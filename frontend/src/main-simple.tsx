import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// 最简化的测试页面
function SimpleApp() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AnonVote
        </h1>
        <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800 font-medium">
            ✅ React 应用成功运行！
          </p>
        </div>
        <p className="text-gray-600 mb-6">
          如果您看到这个页面，说明基础设置是正确的。
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <div>端口: {window.location.port}</div>
          <div>时间: {new Date().toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SimpleApp />
  </React.StrictMode>,
)

