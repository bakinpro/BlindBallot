import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Plus, Vote, Users, Shield, Clock, List } from 'lucide-react'
import { useTotalVotes } from '../hooks/useContract-v1'

export default function HomePage() {
  const { isConnected } = useAccount()
  const { data: totalVotes, isLoading: loadingVotes } = useTotalVotes()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 英雄区域 */}
      <div className="text-center py-16">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-6">
            <Vote className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          欢迎来到 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AnonVote</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          基于 FHEVM 的下一代匿名投票系统，确保您的投票过程完全匿名、结果透明公正
        </p>

        {/* 状态显示 */}
        <div className="flex items-center justify-center space-x-6 mb-10">
          <div className="bg-white rounded-lg shadow-sm border p-4 min-w-[120px]">
            <div className="text-2xl font-bold text-blue-600">
              {loadingVotes ? '...' : totalVotes?.toString() || '0'}
            </div>
            <div className="text-sm text-gray-600">总投票数</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 min-w-[120px]">
            <div className="text-2xl font-bold text-green-600">100%</div>
            <div className="text-sm text-gray-600">匿名保护</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 min-w-[120px]">
            <div className="text-2xl font-bold text-purple-600">24/7</div>
            <div className="text-sm text-gray-600">实时可用</div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isConnected ? (
              <>
                <Link
                  to="/create"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <Plus className="w-6 h-6 mr-2" />
                  创建新投票
                </Link>
                <Link
                  to="/votes"
                  className="inline-flex items-center px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
                >
                  <List className="w-5 h-5 mr-2" />
                  浏览投票
                </Link>
                <Link
                  to="/demo"
                  className="inline-flex items-center px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Vote className="w-5 h-5 mr-2" />
                  查看演示
                </Link>
              </>
            ) : (
              <>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 max-w-md mx-auto mb-4">
                  <p className="text-yellow-800 font-medium mb-4">
                    🔗 请先连接钱包以开始使用
                  </p>
                  <p className="text-yellow-700 text-sm">
                    连接 MetaMask 或其他兼容钱包来创建和参与投票
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/votes"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <List className="w-5 h-5 mr-2" />
                    浏览投票
                  </Link>
                  <Link
                    to="/demo"
                    className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors"
                  >
                    <Vote className="w-5 h-5 mr-2" />
                    查看演示
                  </Link>
                </div>
              </>
            )}
        </div>
      </div>

      {/* 功能特性 */}
      <div className="py-16 bg-white rounded-3xl shadow-sm mt-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            为什么选择 AnonVote？
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">完全匿名</h3>
              <p className="text-gray-600">
                基于 FHEVM 同态加密技术，确保投票过程和选择完全匿名
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Vote className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">结果透明</h3>
              <p className="text-gray-600">
                投票结果实时公开，所有统计数据可验证，确保公平公正
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">实时统计</h3>
              <p className="text-gray-600">
                投票结果实时更新显示，方便会议决策和结果查看
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">易于使用</h3>
              <p className="text-gray-600">
                直观的界面设计，支持多种钱包，快速创建和参与投票
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 使用场景 */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          适用场景
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">📊 会议决策</h3>
            <p className="text-blue-800">
              董事会议、股东大会、团队决策等需要匿名投票的场景
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-green-900 mb-4">🏛️ 组织治理</h3>
            <p className="text-green-800">
              DAO 治理投票、社区提案决策、协会选举等去中心化治理
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-purple-900 mb-4">🎓 学术研究</h3>
            <p className="text-purple-800">
              学术评议、同行评审、研究调查等需要保护隐私的投票
            </p>
          </div>
        </div>
      </div>

      {/* 快速开始 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl py-16 px-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">准备开始了吗？</h2>
        <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
          创建您的第一个匿名投票只需几分钟，让决策过程更加公正透明
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {isConnected ? (
            <>
              <Link
                to="/create"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-6 h-6 mr-2" />
                创建投票
              </Link>
              <Link
                to="/vote/demo"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-colors"
              >
                查看演示
              </Link>
            </>
          ) : (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
              <p className="text-white mb-2">
                请连接您的钱包开始使用
              </p>
              <p className="text-blue-100 text-sm">
                支持 MetaMask、WalletConnect 等主流钱包
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}