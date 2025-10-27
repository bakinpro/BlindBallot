import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// 简化的页面组件
function SimplePage({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 简化的导航栏 */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">🗳</span>
              </div>
              <span className="text-xl font-bold text-gray-900">AnonVote</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-gray-700 hover:text-blue-600">首页</a>
              <a href="/create" className="text-gray-700 hover:text-blue-600">创建投票</a>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
          {children}
        </div>
      </main>

      {/* 简化的底部 */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          © 2025 AnonVote - 基于 FHEVM 的匿名投票系统
        </div>
      </footer>
    </div>
  )
}

// 首页组件
function HomePage() {
  return (
    <SimplePage title="欢迎使用 AnonVote">
      <div className="text-center py-16">
        <div className="bg-green-100 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-green-800 mb-2">
            🎉 应用已成功运行！
          </h2>
          <p className="text-green-700">
            恭喜！React 应用现在可以正常显示了。
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">功能介绍</h3>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-blue-600 mb-2">🔒 匿名投票</h4>
              <p className="text-sm text-gray-600">基于 FHEVM 技术，确保投票过程完全匿名</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-blue-600 mb-2">✅ 结果透明</h4>
              <p className="text-sm text-gray-600">投票结果公开可验证，确保公平公正</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-blue-600 mb-2">⚡ 实时统计</h4>
              <p className="text-sm text-gray-600">投票结果实时更新，方便会议决策</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-blue-600 mb-2">🚀 易于使用</h4>
              <p className="text-sm text-gray-600">简洁的界面设计，快速创建和参与投票</p>
            </div>
          </div>
        </div>

        <div className="space-x-4">
          <a
            href="/create"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ➕ 创建新投票
          </a>
          <a
            href="/test.html"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            🔧 返回测试页面
          </a>
        </div>
      </div>
    </SimplePage>
  )
}

// 创建投票页面
function CreatePage() {
  return (
    <SimplePage title="创建新投票">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">
          🚧 功能开发中
        </h2>
        <p className="text-yellow-700">
          投票创建功能正在开发中，很快就会上线！
        </p>
      </div>
      
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">未来功能预览：</h3>
        <ul className="space-y-2 text-gray-600">
          <li>• 设置投票标题和描述</li>
          <li>• 添加多个投票选项</li>
          <li>• 设置投票截止时间</li>
          <li>• 配置投票权限</li>
          <li>• 生成投票链接</li>
        </ul>
        
        <div className="mt-6 pt-4 border-t">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← 返回首页
          </a>
        </div>
      </div>
    </SimplePage>
  )
}

// 404页面
function NotFoundPage() {
  return (
    <SimplePage title="页面未找到">
      <div className="text-center py-16">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">页面不存在</h2>
        <p className="text-gray-600 mb-8">您访问的页面可能已被移动或删除。</p>
        <a
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🏠 返回首页
        </a>
      </div>
    </SimplePage>
  )
}

// 主应用组件
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

// 渲染应用
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

