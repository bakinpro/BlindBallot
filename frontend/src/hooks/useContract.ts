import { useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'
import { CONTRACT_CONFIG } from '../config/contract'
import { useMemo } from 'react'

// 检查合约配置是否正确
export function useContractConfig() {
  const isConfigured = useMemo(() => {
    return CONTRACT_CONFIG.address && CONTRACT_CONFIG.address !== '' && CONTRACT_CONFIG.address !== '0x'
  }, [])

  return { isConfigured, address: CONTRACT_CONFIG.address, abi: CONTRACT_CONFIG.abi }
}

// 创建投票
export function useCreateVote() {
  const { write, data, isLoading, error } = useContractWrite({
    ...CONTRACT_CONFIG,
    functionName: 'createVote',
  })

  const { isLoading: isWaiting, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return {
    createVote: write,
    data,
    isLoading: isLoading || isWaiting,
    isSuccess,
    error,
  }
}

// 投票提交
export function useCastVote() {
  const { write, data, isLoading, error } = useContractWrite({
    ...CONTRACT_CONFIG,
    functionName: 'castVote',
  })

  const { isLoading: isWaiting, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return {
    castVote: write,
    data,
    isLoading: isLoading || isWaiting,
    isSuccess,
    error,
  }
}

// 请求解密投票结果
export function useRevealVote() {
  const { write, data, isLoading, error } = useContractWrite({
    ...CONTRACT_CONFIG,
    functionName: 'revealVoteResults',
  })

  const { isLoading: isWaiting, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return {
    revealVote: write,
    data,
    isLoading: isLoading || isWaiting,
    isSuccess,
    error,
  }
}

// 获取投票信息
export function useVoteInfo(voteId: number | undefined) {
  return useContractRead({
    ...CONTRACT_CONFIG,
    functionName: 'getVoteInfo',
    args: voteId !== undefined ? [voteId] : undefined,
    enabled: voteId !== undefined && CONTRACT_CONFIG.address !== '',
  })
}

// 获取投票结果
export function useVoteResults(voteId: number | undefined) {
  return useContractRead({
    ...CONTRACT_CONFIG,
    functionName: 'getVoteResults',
    args: voteId !== undefined ? [voteId] : undefined,
    enabled: voteId !== undefined && CONTRACT_CONFIG.address !== '',
  })
}

// 检查是否已投票
export function useHasVoted(voteId: number | undefined, address: string | undefined) {
  return useContractRead({
    ...CONTRACT_CONFIG,
    functionName: 'hasAddressVoted',
    args: voteId !== undefined && address ? [voteId, address] : undefined,
    enabled: voteId !== undefined && !!address && CONTRACT_CONFIG.address !== '',
  })
}

// 获取总投票数
export function useTotalVotes() {
  return useContractRead({
    ...CONTRACT_CONFIG,
    functionName: 'getTotalVotes',
    enabled: CONTRACT_CONFIG.address !== '',
  })
}

// 检查投票是否过期
export function useIsVoteExpired(voteId: number | undefined) {
  return useContractRead({
    ...CONTRACT_CONFIG,
    functionName: 'isVoteExpired',
    args: voteId !== undefined ? [voteId] : undefined,
    enabled: voteId !== undefined && CONTRACT_CONFIG.address !== '',
  })
}

// 提前结束投票
export function useEndVoteEarly() {
  const { write, data, isLoading, error } = useContractWrite({
    ...CONTRACT_CONFIG,
    functionName: 'endVoteEarly',
  })

  const { isLoading: isWaiting, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return {
    endVoteEarly: write,
    data,
    isLoading: isLoading || isWaiting,
    isSuccess,
    error,
  }
}