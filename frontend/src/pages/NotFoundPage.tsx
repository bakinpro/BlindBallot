import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">页面不存在</h1>
          <p className="text-gray-600">
            抱歉，您访问的页面不存在或已被移除。
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>返回首页</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-outline w-full flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回上页</span>
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>如果问题持续存在，请联系管理员。</p>
        </div>
      </div>
    </div>
  )
}

