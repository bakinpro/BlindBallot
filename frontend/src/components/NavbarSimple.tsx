import { Link, useLocation } from 'react-router-dom'
import { Vote, Plus, Home, List } from 'lucide-react'

export default function NavbarSimple() {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo 和品牌名 */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Vote className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">AnonVote</span>
            <span className="text-sm text-gray-500 hidden sm:block">匿名投票</span>
          </Link>

          {/* 导航链接 */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>首页</span>
            </Link>

            <Link
              to="/votes"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/votes')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
              <span>所有投票</span>
            </Link>

            <Link
              to="/create"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/create')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>创建投票</span>
            </Link>
          </div>

          {/* 简化的连接状态 */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
                演示模式
              </div>
            </div>
            
            <button className="btn-outline text-sm">
              连接钱包
            </button>
          </div>
        </div>

        {/* 移动端导航菜单 */}
        <div className="md:hidden border-t border-gray-200 py-2">
          <div className="flex space-x-1">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium flex-1 justify-center transition-colors ${
                isActive('/')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>首页</span>
            </Link>
            <Link
              to="/votes"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium flex-1 justify-center transition-colors ${
                isActive('/votes')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
              <span>投票</span>
            </Link>
            <Link
              to="/create"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium flex-1 justify-center transition-colors ${
                isActive('/create')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>创建</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
