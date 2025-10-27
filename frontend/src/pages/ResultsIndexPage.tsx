import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Trophy, Clock, Users } from 'lucide-react'
import { useTotalVotes, useVoteInfo } from '../hooks/useVoteData'

// 单个投票结果卡片组件
function VoteResultCard({ voteId }: { voteId: number }) {
  const { data: voteInfo, isLoading } = useVoteInfo(voteId)

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  if (!voteInfo) {
    return null
  }

  const [title, description, options, deadline, totalVoters, contractIsActive, isRevealed, creator] = voteInfo as [
    string, string, string[], bigint, bigint, boolean, boolean, string
  ]

  const deadlineNum = Number(deadline)
  const totalVotersNum = Number(totalVoters)
  const isExpired = deadlineNum <= Math.floor(Date.now() / 1000)

  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {isExpired ? '已结束' : '进行中'}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{options.length}</div>
            <div className="text-xs text-gray-500">选项数</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{totalVotersNum}</div>
            <div className="text-xs text-gray-500">参与人数</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${isRevealed ? 'text-purple-600' : 'text-gray-400'}`}>
              {isRevealed ? '已解密' : '未解密'}
            </div>
            <div className="text-xs text-gray-500">结果状态</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {new Date(deadlineNum * 1000).toLocaleDateString()}
          </div>
          <Link
            to={`/results/${voteId}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            查看结果
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ResultsIndexPage() {
  const { data: totalVotes, isLoading: loadingTotal } = useTotalVotes()
  const [voteIds, setVoteIds] = useState<number[]>([])

  useEffect(() => {
    const total = totalVotes ? Number(totalVotes) : 0
    if (total > 0) {
      // 生成所有投票ID（从0到total-1）
      const ids = Array.from({ length: total }, (_, index) => index)
      setVoteIds(ids.reverse()) // 最新的在前面
    } else {
      setVoteIds([])
    }
  }, [totalVotes])

  if (loadingTotal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">正在加载投票结果...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <Trophy className="inline-block w-8 h-8 mr-2 text-yellow-500" />
            投票结果
          </h1>
          <p className="text-gray-600">查看所有投票的统计结果</p>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">{voteIds.length}</div>
            <div className="text-gray-600">总投票数</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {voteIds.filter(id => {
                // 这里可以加入更复杂的逻辑来统计活跃投票
                return true
              }).length}
            </div>
            <div className="text-gray-600">可查看结果</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">FHEVM</div>
            <div className="text-gray-600">加密技术</div>
          </div>
        </div>

        {/* 投票结果列表 */}
        {voteIds.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">暂无投票结果</h2>
            <p className="text-gray-600 mb-6">还没有任何投票，创建第一个投票开始吧！</p>
            <div className="flex items-center justify-center space-x-4">
              <Link 
                to="/create" 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                创建投票
              </Link>
              <Link 
                to="/votes" 
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                浏览投票
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                <Users className="inline-block w-5 h-5 mr-2" />
                所有投票结果 ({voteIds.length})
              </h2>
            </div>
            <div className="grid gap-4">
              {voteIds.map(voteId => (
                <VoteResultCard key={voteId} voteId={voteId} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


