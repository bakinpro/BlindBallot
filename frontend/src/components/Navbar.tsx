import { Link, useLocation } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Vote, Plus, Home, BarChart3, User, List } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()
  const { isConnected, address } = useAccount()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo 和品牌名 */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Vote className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-900">AnonVote</span>
              <div className="text-sm text-gray-500 -mt-1">匿名投票系统</div>
            </div>
          </Link>

          {/* 导航链接 */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              首页
            </Link>
            
            <Link
              to="/votes"
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/votes') 
                  ? 'bg-orange-100 text-orange-600' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-orange-600'
              }`}
            >
              <List className="w-4 h-4 mr-2" />
              所有投票
            </Link>
            
            {isConnected && (
              <>
                <Link
                  to="/create"
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/create') 
                      ? 'bg-green-100 text-green-600' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'
                  }`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  创建投票
                </Link>
                
                <Link
                  to="/results"
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/results') 
                      ? 'bg-purple-100 text-purple-600' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  投票结果
                </Link>
              </>
            )}
          </div>

          {/* 连接状态和钱包按钮 */}
          <div className="flex items-center space-x-4">
            {/* 连接状态指示器 */}
            {isConnected && (
              <div className="hidden sm:flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>已连接</span>
              </div>
            )}
            
            {/* 钱包连接按钮 */}
            <div className="custom-connect-button">
              <ConnectButton 
                accountStatus={{
                  smallScreen: 'avatar',
                  largeScreen: 'full',
                }}
                chainStatus={{
                  smallScreen: 'icon',
                  largeScreen: 'full',
                }}
                showBalance={{
                  smallScreen: false,
                  largeScreen: true,
                }}
              />
            </div>
          </div>
        </div>

        {/* 移动端导航菜单 */}
        <div className="md:hidden border-t border-gray-200 py-2">
          <div className="flex items-center justify-around">
            <Link
              to="/"
              className={`flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Home className="w-5 h-5 mb-1" />
              首页
            </Link>
            
            <Link
              to="/votes"
              className={`flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive('/votes') 
                  ? 'bg-orange-100 text-orange-600' 
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              <List className="w-5 h-5 mb-1" />
              投票
            </Link>
            
            {isConnected && (
              <>
                <Link
                  to="/create"
                  className={`flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/create') 
                      ? 'bg-green-100 text-green-600' 
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  <Plus className="w-5 h-5 mb-1" />
                  创建
                </Link>
                
                <Link
                  to="/results"
                  className={`flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/results') 
                      ? 'bg-purple-100 text-purple-600' 
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 mb-1" />
                  结果
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .custom-connect-button button {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%) !important;
          border: none !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          padding: 8px 20px !important;
          transition: all 0.2s ease !important;
        }
        
        .custom-connect-button button:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4) !important;
        }
      `}</style>
    </nav>
  )
}