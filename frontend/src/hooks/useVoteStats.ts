import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useVoteInfo } from './useVoteData'

// 获取单个投票的统计信息
function useVoteStat(voteId: number) {
  const { address } = useAccount()
  const { data: voteData, isLoading, error } = useVoteInfo(voteId)

  return useMemo(() => {
    if (isLoading || error || !voteData) {
      return {
        isLoading,
        error,
        isActive: false,
        isEnded: false,
        isCreatedByUser: false,
        hasVoted: false
      }
    }

    // 解析投票数据
    const [title, description, options, deadline, totalVoters, contractIsActive, isRevealed, creator] = voteData as [
      string, string, string[], bigint, bigint, boolean, boolean, string
    ]

    const deadlineNum = Number(deadline)
    const now = Math.floor(Date.now() / 1000)
    const isActive = contractIsActive && deadlineNum > now
    const isEnded = !contractIsActive || deadlineNum <= now
    const isCreatedByUser = creator.toLowerCase() === address?.toLowerCase()

    return {
      isLoading: false,
      error: null,
      isActive,
      isEnded,
      isCreatedByUser,
      hasVoted: false // 暂时设为false，需要额外的合约调用来检查
    }
  }, [voteData, isLoading, error, address])
}

// 获取所有投票的统计信息
export function useVoteStats(totalVotes: number) {
  const voteIds = totalVotes > 0 ? Array.from({ length: totalVotes }, (_, index) => index) : []
  
  // 获取所有投票的统计信息
  const voteStats = voteIds.map(voteId => useVoteStat(voteId))

  return useMemo(() => {
    const loadingCount = voteStats.filter(stat => stat.isLoading).length
    const activeCount = voteStats.filter(stat => !stat.isLoading && !stat.error && stat.isActive).length
    const endedCount = voteStats.filter(stat => !stat.isLoading && !stat.error && stat.isEnded).length
    const myCreatedCount = voteStats.filter(stat => !stat.isLoading && !stat.error && stat.isCreatedByUser).length
    const myVotedCount = voteStats.filter(stat => !stat.isLoading && !stat.error && stat.hasVoted).length

    return {
      total: totalVotes,
      active: activeCount,
      ended: endedCount,
      myCreated: myCreatedCount,
      myVoted: myVotedCount,
      isLoading: loadingCount > 0
    }
  }, [voteStats, totalVotes])
}

