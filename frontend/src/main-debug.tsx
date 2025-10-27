import React from 'react'
import ReactDOM from 'react-dom/client'

// 调试信息收集
const debugInfo = {
  timestamp: new Date().toISOString(),
  userAgent: navigator.userAgent,
  url: window.location.href,
  viewport: `${window.innerWidth}x${window.innerHeight}`,
  nodeEnv: import.meta.env.MODE,
  reactVersion: React.version,
}

console.log('🔍 调试信息:', debugInfo)

// 极简的调试页面，不依赖任何CSS框架
function DebugApp() {
  const [mounted, setMounted] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    try {
      setMounted(true)
      console.log('✅ React 组件已挂载')
    } catch (err) {
      console.error('❌ 组件挂载出错:', err)
      setError(err instanceof Error ? err.message : String(err))
    }
  }, [])

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        fontFamily: 'monospace',
        backgroundColor: '#fee', 
        color: '#c00',
        minHeight: '100vh'
      }}>
        <h1>❌ 错误发生</h1>
        <pre>{error}</pre>
        <div style={{ marginTop: '20px', fontSize: '12px' }}>
          <div>时间: {debugInfo.timestamp}</div>
          <div>URL: {debugInfo.url}</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#f9f9f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        maxWidth: '600px', 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#2563eb', marginBottom: '20px' }}>
          🎉 AnonVote 调试页面
        </h1>
        
        <div style={{ 
          backgroundColor: '#dcfce7', 
          color: '#166534', 
          padding: '15px', 
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          <strong>✅ 成功!</strong> React 应用正在运行
          {mounted && <div>✅ 组件已成功挂载</div>}
        </div>

        <h3>🔧 调试信息:</h3>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '6px',
          fontSize: '14px',
          fontFamily: 'monospace'
        }}>
          {Object.entries(debugInfo).map(([key, value]) => (
            <div key={key} style={{ marginBottom: '5px' }}>
              <strong>{key}:</strong> {String(value)}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔄 刷新页面
          </button>
        </div>
      </div>
    </div>
  )
}

// 全局错误处理
window.onerror = function(message, source, lineno, colno, error) {
  console.error('🚨 全局JavaScript错误:', {
    message, source, lineno, colno, error
  })
  return false
}

window.addEventListener('unhandledrejection', function(event) {
  console.error('🚨 未处理的Promise拒绝:', event.reason)
})

// 尝试渲染应用
try {
  console.log('🚀 开始渲染应用...')
  const rootElement = document.getElementById('root')
  
  if (!rootElement) {
    throw new Error('找不到根元素 #root')
  }
  
  console.log('✅ 找到根元素')
  const root = ReactDOM.createRoot(rootElement)
  
  root.render(
    <React.StrictMode>
      <DebugApp />
    </React.StrictMode>
  )
  
  console.log('✅ React 应用已渲染')
} catch (error) {
  console.error('❌ 渲染失败:', error)
  
  // 备用渲染方案 - 直接操作DOM
  const rootElement = document.getElementById('root')
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: monospace; background: #fee; color: #c00; min-height: 100vh;">
        <h1>❌ React 渲染失败</h1>
        <pre>${error instanceof Error ? error.message : String(error)}</pre>
        <div style="margin-top: 20px; font-size: 12px;">
          <div>时间: ${new Date().toISOString()}</div>
          <div>URL: ${window.location.href}</div>
        </div>
      </div>
    `
  }
}

