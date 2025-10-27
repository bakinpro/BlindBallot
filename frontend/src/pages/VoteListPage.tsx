import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Clock, Users, Vote, Filter, Search, Plus, BarChart3, CheckCircle } from 'lucide-react'

interface VoteItem {
  id: number
  title: string
  description: string
  creator: string
  status: 'active' | 'ended' | 'pending'
  timeRemaining: string
  participants: number
  options: string[]
  created: string
  deadline: string
  isCreatedByUser?: boolean
  hasVoted?: boolean
}

// 模拟投票数据
const mockVotes: VoteItem[] = [
  {
    id: 1,
    title: "是否同意实施新的开发计划？",
    description: "该计划将引入新的技术栈和开发流程，预计需要6个月的过渡期。",
    creator: "0x1234...5678",
    status: "active",
    timeRemaining: "23小时12分钟",
    participants: 45,
    options: ["完全同意", "部分同意", "需要更多信息", "不同意"],
    created: "2025-09-08",
    deadline: "2025-09-09",
    isCreatedByUser: false,
    hasVoted: false
  },
  {
    id: 2,
    title: "团队工作模式投票",
    description: "决定下一阶段的工作模式，混合办公还是完全远程。",
    creator: "0xabcd...efgh",
    status: "ended",
    timeRemaining: "已结束",
    participants: 78,
    options: ["完全远程", "混合办公", "回到办公室", "弹性安排"],
    created: "2025-09-07",
    deadline: "2025-09-08",
    isCreatedByUser: false,
    hasVoted: true
  },
  {
    id: 3,
    title: "年会活动方案选择",
    description: "选择今年的年会活动形式和主题，让大家共同参与决定。",
    creator: "您的地址",
    status: "active",
    timeRemaining: "5天14小时",
    participants: 23,
    options: ["户外团建", "室内聚餐", "线上活动", "推迟举办"],
    created: "2025-09-08",
    deadline: "2025-09-13",
    isCreatedByUser: true,
    hasVoted: false
  },
  {
    id: 4,
    title: "技术栈升级决策",
    description: "讨论是否升级到最新的技术栈版本，包括框架和依赖库的更新。",
    creator: "0x9999...1111",
    status: "active",
    timeRemaining: "2天8小时",
    participants: 12,
    options: ["立即升级", "分阶段升级", "暂缓升级", "需要更多调研"],
    created: "2025-09-08",
    deadline: "2025-09-10",
    isCreatedByUser: false,
    hasVoted: false
  }
]

export default function VoteListPage() {
  const { isConnected, address } = useAccount()
  const [filter, setFilter] = useState<'all' | 'active' | 'ended' | 'my-votes' | 'my-created'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // 过滤投票
  const filteredVotes = mockVotes.filter(vote => {
    // 搜索过滤
    const matchesSearch = searchTerm === '' || 
      vote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vote.description.toLowerCase().includes(searchTerm.toLowerCase())

    // 状态过滤
    if (filter === 'active') return vote.status === 'active' && matchesSearch
    if (filter === 'ended') return vote.status === 'ended' && matchesSearch
    if (filter === 'my-votes') return vote.hasVoted && matchesSearch
    if (filter === 'my-created') return vote.isCreatedByUser && matchesSearch
    
    return matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'ended': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '进行中'
      case 'ended': return '已结束'
      case 'pending': return '待开始'
      default: return '未知'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">所有投票</h1>
            <p className="text-gray-600">浏览和参与匿名投票活动</p>
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
                { key: 'all', label: '全部', count: mockVotes.length },
                { key: 'active', label: '进行中', count: mockVotes.filter(v => v.status === 'active').length },
                { key: 'ended', label: '已结束', count: mockVotes.filter(v => v.status === 'ended').length },
                { key: 'my-votes', label: '我的投票', count: mockVotes.filter(v => v.hasVoted).length },
                { key: 'my-created', label: '我创建的', count: mockVotes.filter(v => v.isCreatedByUser).length }
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

        {/* 投票列表 */}
        <div className="space-y-6">
          {filteredVotes.length === 0 ? (
            <div className="bg-white rounded-xl border p-12 text-center">
              <div className="text-6xl mb-4">🗳️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? '没有找到匹配的投票' : '暂无投票'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? '请尝试调整搜索条件' : '成为第一个创建投票的人！'}
              </p>
              {!searchTerm && (
                <Link
                  to="/create"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  创建投票
                </Link>
              )}
            </div>
          ) : (
            filteredVotes.map((vote) => (
              <div key={vote.id} className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* 投票头部 */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 mr-3">
                          {vote.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vote.status)}`}>
                          {getStatusText(vote.status)}
                        </span>
                        {vote.isCreatedByUser && (
                          <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            我创建的
                          </span>
                        )}
                        {vote.hasVoted && (
                          <span className="ml-2 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            已投票
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">
                        {vote.description}
                      </p>
                    </div>
                  </div>

                  {/* 投票统计 */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{vote.participants} 人参与</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{vote.timeRemaining}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Vote className="w-4 h-4 mr-2" />
                      <span>{vote.options.length} 个选项</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="text-xs">创建: {vote.created}</span>
                    </div>
                  </div>

                  {/* 选项预览 */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2">投票选项:</p>
                    <div className="flex flex-wrap gap-2">
                      {vote.options.slice(0, 3).map((option, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {option}
                        </span>
                      ))}
                      {vote.options.length > 3 && (
                        <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm">
                          +{vote.options.length - 3} 更多
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      创建者: {vote.creator}
                    </div>
                    
                    <div className="flex space-x-3">
                      {vote.status === 'active' && !vote.hasVoted ? (
                        <Link
                          to={`/vote/${vote.id}`}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Vote className="w-4 h-4 mr-1" />
                          参与投票
                        </Link>
                      ) : vote.hasVoted ? (
                        <Link
                          to={`/results/${vote.id}`}
                          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <BarChart3 className="w-4 h-4 mr-1" />
                          查看结果
                        </Link>
                      ) : (
                        <Link
                          to={`/results/${vote.id}`}
                          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <BarChart3 className="w-4 h-4 mr-1" />
                          查看结果
                        </Link>
                      )}
                      
                      <Link
                        to={`/vote/${vote.id}`}
                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        详情
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 底部统计 */}
        {filteredVotes.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <p className="text-blue-800">
              当前显示 <span className="font-semibold">{filteredVotes.length}</span> 个投票
              {searchTerm && ` (搜索: "${searchTerm}")`}
              {filter !== 'all' && ` (筛选: ${filter})`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

