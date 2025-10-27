import { Link } from 'react-router-dom'
import { useVoteInfo, calculateTimeRemaining } from '../hooks/useVoteData'
import { Clock, Users, Vote, User } from 'lucide-react'
import { useAccount } from 'wagmi'

interface VoteCardProps {
  voteId: number
}

export default function VoteCard({ voteId }: VoteCardProps) {
  const { address } = useAccount()
  const { data: voteData, isLoading, error } = useVoteInfo(voteId)

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    )
  }

  if (error || !voteData) {
    console.log(`投票 #${voteId} 加载错误:`, error)
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-800">投票 #{voteId} 加载失败</p>
        {error && <p className="text-red-600 text-sm mt-2">{error.message}</p>}
        <p className="text-red-500 text-xs mt-2">
          可能原因：投票不存在或合约调用失败
        </p>
      </div>
    )
  }

  // 解析合约返回的数据
  const [title, description, options, deadline, totalVoters, contractIsActive, isRevealed, creator] = voteData as [
    string, string, string[], bigint, bigint, boolean, boolean, string
  ]

  // 调试信息
  console.log(`投票 #${voteId} 数据:`, {
    title,
    description,
    options,
    deadline: deadline.toString(),
    totalVoters: totalVoters.toString(),
    contractIsActive,
    isRevealed,
    creator
  })

  const deadlineNum = Number(deadline)
  const totalVotersNum = Number(totalVoters)
  const { remaining, status } = calculateTimeRemaining(deadlineNum)
  const isCreatedByUser = creator.toLowerCase() === address?.toLowerCase()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'ended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '进行中'
      case 'ended': return '已结束'
      default: return '未知'
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        {/* 标题和状态 */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 flex-1 mr-4">
            {title}
          </h3>
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
              {getStatusText(status)}
            </span>
            {isCreatedByUser && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                我创建的
              </span>
            )}
          </div>
        </div>

        {/* 描述 */}
        <p className="text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>

        {/* 选项预览 */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">投票选项:</p>
          <div className="flex flex-wrap gap-2">
            {options.slice(0, 3).map((option, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {option}
              </span>
            ))}
            {options.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
                +{options.length - 3} 更多
              </span>
            )}
          </div>
        </div>

        {/* 统计信息 */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{totalVotersNum} 人投票</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{remaining}</span>
            </div>
          </div>
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span className="truncate max-w-[120px]" title={creator}>
              {creator.slice(0, 6)}...{creator.slice(-4)}
            </span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex space-x-3">
          {status === 'active' && (
            <Link
              to={`/vote/${voteId}`}
              className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Vote className="w-4 h-4 inline mr-2" />
              参与投票
            </Link>
          )}
          
          <Link
            to={`/results/${voteId}`}
            className={`flex-1 text-center py-2 px-4 rounded-lg transition-colors font-medium ${
              status === 'active' 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            查看结果
          </Link>
        </div>
      </div>
    </div>
  )
}