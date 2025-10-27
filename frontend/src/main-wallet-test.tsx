import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// 最简单的钱包连接测试
import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit'
import { config, chains } from './config/wagmi-fixed'

const queryClient = new QueryClient()

function WalletTestApp() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          🔗 钱包连接测试
        </h1>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            点击下方按钮测试钱包连接功能
          </p>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <ConnectButton />
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">调试信息:</p>
            <div className="text-xs text-left bg-gray-50 p-3 rounded font-mono">
              <div>Chains: {chains.length} 个</div>
              <div>Config: {config ? '✅ 已配置' : '❌ 未配置'}</div>
              <div>Window.ethereum: {(window as any).ethereum ? '✅ 已检测' : '❌ 未检测'}</div>
              <div>时间: {new Date().toLocaleString()}</div>
            </div>
          </div>
          
          <div className="space-y-2 pt-4 border-t border-gray-200">
            <button
              onClick={() => window.location.href = 'http://localhost:3000'}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              返回主应用
            </button>
            <button
              onClick={() => window.location.href = '/test.html'}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              返回测试页面
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

console.log('🔗 开始渲染钱包连接测试...')

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <WagmiConfig config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider chains={chains}>
            <WalletTestApp />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiConfig>
    </React.StrictMode>
  )
  console.log('✅ 钱包测试应用已渲染')
} catch (error) {
  console.error('❌ 钱包测试应用渲染失败:', error)
  
  // 显示错误信息
  const root = document.getElementById('root')
  if (root) {
    root.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f9fafb; font-family: system-ui, -apple-system, sans-serif;">
        <div style="max-width: 400px; padding: 32px; background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center;">
          <h1 style="color: #dc2626; margin-bottom: 16px;">❌ 钱包配置错误</h1>
          <p style="color: #6b7280; margin-bottom: 16px;">无法初始化钱包连接功能</p>
          <pre style="background: #fef2f2; padding: 12px; border-radius: 6px; font-size: 12px; color: #dc2626; text-align: left; overflow: auto;">${error}</pre>
          <div style="margin-top: 20px;">
            <button onclick="window.location.reload()" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; margin-right: 8px;">刷新</button>
            <button onclick="window.location.href='/test.html'" style="background: #6b7280; color: white; border: none; padding: 8px 16px; border-radius: 6px;">返回测试</button>
          </div>
        </div>
      </div>
    `
  }
}

