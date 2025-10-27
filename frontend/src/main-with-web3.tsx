import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App-with-web3.tsx'
import './index.css'

// Web3 配置
import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { config, chains } from './config/wagmi-simple.ts'

// Toast 通知
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient()

// 错误边界组件
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('应用错误:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              应用出现了错误
            </h1>
            <p className="text-gray-600 mb-6">
              请刷新页面重试，如果问题持续存在，请联系技术支持。
            </p>
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                🔄 刷新页面
              </button>
              <button
                onClick={() => window.location.href = '/test.html'}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                🔧 返回测试页面
              </button>
            </div>
            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer">技术详情</summary>
                <pre className="text-xs text-red-600 bg-red-50 p-3 rounded mt-2 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// 带有重试机制的组件包装器
function WebAppWrapper() {
  const [retryCount, setRetryCount] = React.useState(0)
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    // 清除任何之前的错误
    setHasError(false)
  }, [retryCount])

  try {
    return (
      <WagmiConfig config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider chains={chains}>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  style: {
                    background: '#059669',
                  },
                },
                error: {
                  duration: 5000,
                  style: {
                    background: '#dc2626',
                  },
                },
              }}
            />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiConfig>
    )
  } catch (error) {
    console.error('Web3配置错误:', error)
    
    if (!hasError) {
      setHasError(true)
      
      // 如果是首次错误，尝试重试
      if (retryCount < 2) {
        setTimeout(() => {
          console.log(`尝试重试... (${retryCount + 1}/2)`)
          setRetryCount(prev => prev + 1)
        }, 1000)
      }
    }

    // 降级到简单版本
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Web3 配置加载失败
          </h1>
          <p className="text-gray-600 mb-6">
            正在尝试修复连接问题... ({retryCount}/2)
          </p>
          
          {retryCount >= 2 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">
                如果问题持续，您可以：
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => setRetryCount(0)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  🔄 重新尝试
                </button>
                <button
                  onClick={() => window.location.href = '/test.html'}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  🔧 进入测试页面
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

// 渲染应用
console.log('🚀 开始渲染带有Web3功能的应用...')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <WebAppWrapper />
    </ErrorBoundary>
  </React.StrictMode>
)
