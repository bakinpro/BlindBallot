import { useContractRead } from 'wagmi'
import { CONTRACT_CONFIG } from '../config/contract'
import { useState, useEffect } from 'react'

// 投票数据类型
export interface VoteData {
  id: number
  title: string
  description: string
  creator: string
  deadline: number
  totalVoters: number
  isActive: boolean
  isRevealed: boolean
  options: string[]
  status: 'active' | 'ended' | 'pending'
  timeRemaining: string
}

// 获取投票总数
export function useTotalVotes() {
  return useContractRead({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'nextVoteId',
  })
}

// 获取单个投票信息
export function useVoteInfo(voteId: number) {
  return useContractRead({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getVoteInfo',
    args: [BigInt(voteId)],
    enabled: voteId >= 0,
  })
}

// 获取所有投票数据
export function useAllVotes() {
  const { data: totalVotesData, isLoading: loadingTotal, error: totalError } = useTotalVotes()
  const [votes, setVotes] = useState<VoteData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalVotes = totalVotesData ? parseInt(totalVotesData.toString()) : 0

  useEffect(() => {
    if (totalVotes === 0) {
      setVotes([])
      return
    }

    setLoading(true)
    setError(null)

    // 这里我们需要为每个投票ID获取详细信息
    // 由于React Hook的限制，我们需要用不同的方式处理
    console.log(`需要加载 ${totalVotes} 个投票的详细信息`)
    
    // 暂时设置为空数组，我们需要实现批量加载
    setVotes([])
    setLoading(false)
  }, [totalVotes])

  return {
    votes,
    totalVotes,
    loading: loadingTotal || loading,
    error: totalError?.message || error,
  }
}

// 计算时间剩余
export function calculateTimeRemaining(deadline: number): { remaining: string, status: 'active' | 'ended' } {
  const now = Math.floor(Date.now() / 1000)
  const diff = deadline - now

  if (diff <= 0) {
    return { remaining: '已结束', status: 'ended' }
  }

  const hours = Math.floor(diff / 3600)
  const minutes = Math.floor((diff % 3600) / 60)

  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return { remaining: `${days}天${hours % 24}小时`, status: 'active' }
  } else if (hours > 0) {
    return { remaining: `${hours}小时${minutes}分钟`, status: 'active' }
  } else {
    return { remaining: `${minutes}分钟`, status: 'active' }
  }
}

