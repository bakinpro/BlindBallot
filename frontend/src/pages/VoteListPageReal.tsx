import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccount, useNetwork } from 'wagmi'
import { Filter, Search, Plus, AlertCircle } from 'lucide-react'
import { useTotalVotes } from '../hooks/useVoteData'
import { useVoteStats } from '../hooks/useVoteStats'
import VoteList from '../components/VoteList'

export default function VoteListPageReal() {
  const { isConnected, address } = useAccount()
  const { chain } = useNetwork()
  
  // 获取投票总数
  const { data: totalVotesData, isLoading: loadingTotalVotes, error: totalVotesError } = useTotalVotes()
  
  const [filter, setFilter] = useState<'all' | 'active' | 'ended' | 'my-votes' | 'my-created'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const totalVotes = totalVotesData ? parseInt(totalVotesData.toString()) : 0

  // 获取投票统计信息
  const voteStats = useVoteStats(totalVotes)

  // 如果未连接钱包
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-yellow-800 mb-2">需要连接钱包</h2>
            <p className="text-yellow-700 mb-6">
              请连接您的钱包以查看区块链上的投票数据。
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              返回首页连接钱包
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">区块链投票</h1>
            <p className="text-gray-600">从智能合约读取的真实投票数据</p>
          </div>
          <Link
            to="/create"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            创建投票
          </Link>
        </div>


        {/* 过滤和搜索栏 */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* 搜索框 */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="搜索投票标题或描述..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 过滤按钮 */}
            <div className="flex items-center space-x-2 overflow-x-auto">
              <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
              {[
                { key: 'all', label: '全部', count: voteStats.total },
                { key: 'active', label: '进行中', count: voteStats.active },
                { key: 'ended', label: '已结束', count: voteStats.ended },
                { key: 'my-votes', label: '我的投票', count: voteStats.myVoted },
                { key: 'my-created', label: '我创建的', count: voteStats.myCreated }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === key
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 加载状态 */}
        {loadingTotalVotes && (
          <div className="bg-white rounded-xl border p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">正在从区块链加载数据...</h3>
            <p className="text-gray-600">请稍候，正在读取智能合约中的投票信息</p>
          </div>
        )}

        {/* 无数据状态 */}
        {!loadingTotalVotes && totalVotes === 0 && (
          <div className="bg-white rounded-xl border p-12 text-center">
            <div className="text-6xl mb-4">🗳️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              暂无投票
            </h3>
            <p className="text-gray-600 mb-6">
              智能合约中还没有任何投票记录。成为第一个创建投票的人！
            </p>
            <Link
              to="/create"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              创建投票
            </Link>
          </div>
        )}

        {/* 错误状态 */}
        {totalVotesError && (
          <div className="bg-white rounded-xl border p-12 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              无法连接到智能合约
            </h3>
            <p className="text-gray-600 mb-4">
              {totalVotesError.message}
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">可能的原因：</p>
              <ul className="text-sm text-gray-600 text-left inline-block">
                <li>• 网络连接问题</li>
                <li>• 合约地址配置错误</li>
                <li>• 连接到了错误的网络</li>
                <li>• 本地区块链服务器未启动</li>
              </ul>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              🔄 重新加载
            </button>
          </div>
        )}


        {/* 投票列表 */}
        {!loadingTotalVotes && totalVotes > 0 && (
          <div>
            <div className="mb-4 text-sm text-gray-600">
              找到 {totalVotes} 个投票 (ID: 0 到 {totalVotes - 1})
              {voteStats.isLoading && <span className="ml-2 text-blue-600">正在加载筛选统计...</span>}
            </div>
            <VoteList 
              totalVotes={totalVotes}
              filter={filter}
              searchTerm={searchTerm}
            />
          </div>
        )}

        {/* 底部信息 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <p className="text-blue-800">
            <strong>区块链投票系统</strong> - 所有数据来源于智能合约，确保透明和不可篡改
          </p>
          <p className="text-sm text-blue-600 mt-2">
            合约地址: <code className="bg-blue-100 px-2 py-1 rounded text-xs">{import.meta.env.VITE_CONTRACT_ADDRESS}</code>
          </p>
        </div>
      </div>
    </div>
  )
}
