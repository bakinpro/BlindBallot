import React, { useState, useMemo } from 'react'
import { useAccount } from 'wagmi'
import VoteCard from './VoteCard'
import { useVoteInfo } from '../hooks/useVoteData'

interface VoteListProps {
  totalVotes: number
  filter: 'all' | 'active' | 'ended' | 'my-votes' | 'my-created'
  searchTerm: string
}

// 单个投票的筛选组件
function VoteFilterItem({ voteId, filter, searchTerm, address }: { 
  voteId: number
  filter: 'all' | 'active' | 'ended' | 'my-votes' | 'my-created'
  searchTerm: string
  address?: string
}) {
  const { data: voteData, isLoading, error } = useVoteInfo(voteId)

  // 如果加载中或出错，先显示卡片（让VoteCard处理这些状态）
  if (isLoading || error || !voteData) {
    return <VoteCard key={voteId} voteId={voteId} />
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

  // 搜索过滤
  const matchesSearch = searchTerm === '' || 
    title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    description.toLowerCase().includes(searchTerm.toLowerCase())

  // 状态过滤
  let shouldShow = true
  switch (filter) {
    case 'active':
      shouldShow = isActive
      break
    case 'ended':
      shouldShow = isEnded
      break
    case 'my-created':
      shouldShow = isCreatedByUser
      break
    case 'my-votes':
      // 暂时显示所有（因为我们没有实现投票记录查询）
      shouldShow = true
      break
    default:
      shouldShow = true
  }

  // 如果不匹配筛选条件，不渲染
  if (!shouldShow || !matchesSearch) {
    return null
  }

  return <VoteCard key={voteId} voteId={voteId} />
}

export default function VoteList({ totalVotes, filter, searchTerm }: VoteListProps) {
  const { address } = useAccount()
  
  const voteIds = totalVotes > 0 ? Array.from({ length: totalVotes }, (_, index) => index) : []

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {voteIds.map(voteId => (
        <VoteFilterItem
          key={voteId}
          voteId={voteId}
          filter={filter}
          searchTerm={searchTerm}
          address={address}
        />
      ))}
    </div>
  )
}

