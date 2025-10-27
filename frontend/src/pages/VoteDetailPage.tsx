import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Clock, Users, Shield, CheckCircle, AlertCircle, Vote, ArrowLeft } from 'lucide-react'
import { useVoteInfo, useHasVoted, useCastVote } from '../hooks/useVoteDetail'
import toast from 'react-hot-toast'

interface VoteOption {
  id: number
  text: string
  isSelected: boolean
}

export default function VoteDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isConnected, address } = useAccount()
  
  const voteId = parseInt(id || '0')
  const { data: voteInfo, isLoading: loadingVoteInfo, error: voteInfoError } = useVoteInfo(voteId)
  const { data: hasVoted, isLoading: loadingHasVoted } = useHasVoted(voteId)
  const { castVote, isLoading: isCasting, isSuccess: castSuccess, error: castError, debug } = useCastVote()

  const [selectedOption, setSelectedOption] = useState<number>(-1)
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  const [isExpired, setIsExpired] = useState(false)

  // 解析真实的投票数据
  const voteData = useMemo(() => {
    if (!voteInfo) return null
    
    const [title, description, options, deadline, totalVoters, contractIsActive, isRevealed, creator] = voteInfo as [
      string, string, string[], bigint, bigint, boolean, boolean, string
    ]
    
    const deadlineNum = Number(deadline)
    const totalVotersNum = Number(totalVoters)
    
    return {
      title,
      description,
      options,
      creator: creator.slice(0, 6) + '...' + creator.slice(-4),
      deadline: deadlineNum,
      totalVoters: totalVotersNum,
      isActive: contractIsActive && deadlineNum > Math.floor(Date.now() / 1000)
    }
  }, [voteInfo])

  // 计算剩余时间
  useEffect(() => {
    if (!voteData) return
    
    const updateTimeRemaining = () => {
      const now = Math.floor(Date.now() / 1000) // 转换为秒
      const deadline = voteData.deadline
      const diff = deadline - now

      if (diff <= 0) {
        setTimeRemaining('已结束')
        setIsExpired(true)
        return
      }

      const hours = Math.floor(diff / 3600)
      const minutes = Math.floor((diff % 3600) / 60)
      const seconds = diff % 60

      if (hours > 0) {
        setTimeRemaining(`${hours}小时${minutes}分钟`)
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}分钟${seconds}秒`)
      } else {
        setTimeRemaining(`${seconds}秒`)
      }
    }

    updateTimeRemaining()
    const timer = setInterval(updateTimeRemaining, 1000)
    return () => clearInterval(timer)
  }, [voteData?.deadline])

  // 监听投票成功
  useEffect(() => {
    if (castSuccess) {
      toast.success('🎉 投票已成功确认！您的选择已记录在区块链上。')
      
      // 显示跳转选项
      setTimeout(() => {
        const shouldNavigate = window.confirm('投票成功！是否查看投票结果？')
        if (shouldNavigate) {
          navigate(`/results/${voteId}`)
        }
      }, 1000)
    }
  }, [castSuccess, navigate, voteId])

  // 提交投票
  const handleVote = async () => {
    if (!isConnected) {
      toast.error('请先连接钱包')
      return
    }

    if (selectedOption === -1) {
      toast.error('请选择一个选项')
      return
    }

    if (hasVoted) {
      toast.error('您已经投过票了')
      return
    }

    if (isExpired) {
      toast.error('投票已结束')
      return
    }

    try {
      console.log('🗳️ 开始投票:', {
        voteId,
        selectedOption,
        optionText: voteData?.options[selectedOption],
        castVoteFunction: !!castVote,
        debug
      })
      
      if (!castVote) {
        toast.error('投票功能不可用，请检查钱包连接和网络')
        return
      }
      
      const result = await castVote(voteId, selectedOption)
      console.log('🗳️ 投票调用结果:', result)
      toast.success('投票交易已发送！正在等待区块链确认...')
      
      // 不立即跳转，让用户看到确认过程
    } catch (error: any) {
      console.error('❌ 投票失败:', error)
      toast.error(`投票失败: ${error.message || '请重试'}`)
    }
  }

  // 如果未连接钱包
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-yellow-800 mb-2">需要连接钱包</h2>
            <p className="text-yellow-700 mb-6">
              请连接您的钱包以参与投票。所有投票都是匿名且安全的。
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              返回首页连接钱包
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 加载状态
  if (loadingVoteInfo || loadingHasVoted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">正在加载投票信息...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          返回上一页
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 投票标题和描述 */}
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {voteData.title}
                  </h1>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {voteData.description}
                  </p>
                </div>
                <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  isExpired 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {isExpired ? '已结束' : '进行中'}
                </div>
              </div>

              {/* 投票状态信息 */}
              <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {voteData.totalVoters}
                  </div>
                  <div className="text-sm text-gray-600">参与人数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {timeRemaining}
                  </div>
                  <div className="text-sm text-gray-600">剩余时间</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {voteData.options.length}
                  </div>
                  <div className="text-sm text-gray-600">选项数量</div>
                </div>
              </div>
            </div>

            {/* 投票选项 */}
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Vote className="w-6 h-6 mr-2" />
                选择您的选项
              </h2>

              {hasVoted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    您已成功投票
                  </h3>
                  <p className="text-green-700">
                    感谢您的参与！您的投票已被安全记录，无法被追踪。
                  </p>
                  <button
                    onClick={() => navigate(`/results/${voteId}`)}
                    className="mt-4 inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    查看结果
                  </button>
                </div>
              ) : isExpired ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-red-800 mb-2">
                    投票已结束
                  </h3>
                  <p className="text-red-700">
                    这个投票已经过期，无法继续参与。
                  </p>
                  <button
                    onClick={() => navigate(`/results/${voteId}`)}
                    className="mt-4 inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    查看结果
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {voteData.options.map((option, index) => (
                    <label
                      key={index}
                      className={`block p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedOption === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="vote-option"
                          value={index}
                          checked={selectedOption === index}
                          onChange={() => setSelectedOption(index)}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-4 text-lg text-gray-900 font-medium">
                          {option}
                        </span>
                      </div>
                    </label>
                  ))}

                  {/* 提交按钮 */}
                  <div className="pt-6">
                    <button
                      onClick={handleVote}
                      disabled={selectedOption === -1 || isCasting}
                      className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
                    >
                      {isCasting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          提交投票中...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          提交投票
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* 投票信息 */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">投票信息</h3>
                <div className="space-y-4">
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">创建者:</span>
                    <span className="ml-1 text-gray-900 font-mono text-xs">
                      {voteData.creator}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">截止时间:</span>
                    <span className="ml-1 text-gray-900">
                      {new Date(voteData.deadline * 1000).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">状态:</span>
                    <span className={`ml-1 font-medium ${
                      isExpired ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {isExpired ? '已结束' : '进行中'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 隐私保护提示 */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <Shield className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-blue-900">隐私保护</h3>
                </div>
                <ul className="text-blue-800 text-sm space-y-2">
                  <li>• 您的投票选择完全匿名</li>
                  <li>• 使用FHEVM加密技术保护隐私</li>
                  <li>• 任何人都无法追踪您的选择</li>
                  <li>• 只有统计结果会被公开</li>
                </ul>
              </div>

              {/* 投票规则 */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">投票规则</h3>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• 每个钱包地址只能投票一次</li>
                  <li>• 投票后无法修改选择</li>
                  <li>• 投票结束前可查看实时结果</li>
                  <li>• 投票记录永久保存在区块链上</li>
                </ul>
              </div>

              {/* 快捷操作 */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">快捷操作</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(`/results/${voteId}`)}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    查看当前结果
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    返回首页
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 开发模式调试信息 */}
        {import.meta.env.DEV && (
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 投票调试信息</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <strong>钱包连接:</strong> {isConnected ? '✅' : '❌'}
              </div>
              <div>
                <strong>投票函数:</strong> {castVote ? '✅' : '❌'}
              </div>
              <div>
                <strong>是否已投票:</strong> {hasVoted ? '✅' : '❌'}
              </div>
              <div>
                <strong>投票状态:</strong> {voteData?.isActive ? '进行中' : '已结束'}
              </div>
              <div>
                <strong>合约地址:</strong> {debug?.contractAddress?.slice(0, 10)}...
              </div>
              <div>
                <strong>写入错误:</strong> {debug?.writeError ? '❌' : '✅'}
              </div>
              <div>
                <strong>等待错误:</strong> {debug?.waitError ? '❌' : '✅'}
              </div>
              <div>
                <strong>交易状态:</strong> {isCasting ? '进行中' : castSuccess ? '成功' : '待提交'}
              </div>
            </div>
            {(debug?.writeError || debug?.waitError || castError) && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                <strong>错误信息:</strong>
                <pre className="mt-2 whitespace-pre-wrap">
                  {JSON.stringify(debug?.writeError || debug?.waitError || castError, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}