import { 
  useContractRead, 
  useContractWrite, 
  useWaitForTransaction,
  usePrepareContractWrite 
} from 'wagmi'
import { CONTRACT_CONFIG } from '../config/contract'
import { useMemo } from 'react'
import { parseEther } from 'viem'

// 获取总投票数
export function useTotalVotes() {
  return useContractRead({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'nextVoteId',
  })
}

// 获取投票信息
export function useVoteInfo(voteId: number) {
  return useContractRead({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getVote',
    args: [voteId],
    enabled: voteId >= 0,
  })
}

// 获取投票结果
export function useVoteResults(voteId: number) {
  return useContractRead({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getResults',
    args: [voteId],
    enabled: voteId >= 0,
  })
}

// 检查用户是否已投票
export function useHasVoted(voteId: number, userAddress?: string) {
  return useContractRead({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'hasVoted',
    args: [voteId, userAddress],
    enabled: !!userAddress && voteId >= 0,
  })
}

// 创建投票
export function useCreateVote() {
  const { config } = usePrepareContractWrite({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'createVote',
  })
  
  const { write, data, error, isLoading } = useContractWrite(config)
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })
  
  const createVote = useMemo(() => {
    if (!write) return undefined
    
    return (title: string, description: string, options: string[], duration: number) => {
      return write({
        args: [title, description, options, duration],
      })
    }
  }, [write])
  
  return {
    createVote,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
    txHash: data?.hash,
  }
}

// 投票
export function useCastVote() {
  const { config } = usePrepareContractWrite({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'castVote',
  })
  
  const { write, data, error, isLoading } = useContractWrite(config)
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })
  
  const castVote = useMemo(() => {
    if (!write) return undefined
    
    return (voteId: number, encryptedChoice: string) => {
      return write({
        args: [voteId, encryptedChoice],
      })
    }
  }, [write])
  
  return {
    castVote,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
    txHash: data?.hash,
  }
}

// 结束投票
export function useEndVote() {
  const { config } = usePrepareContractWrite({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'endVote',
  })
  
  const { write, data, error, isLoading } = useContractWrite(config)
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })
  
  const endVote = useMemo(() => {
    if (!write) return undefined
    
    return (voteId: number) => {
      return write({
        args: [voteId],
      })
    }
  }, [write])
  
  return {
    endVote,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
    txHash: data?.hash,
  }
}

// 获取用户投票列表
export function useUserVotes(userAddress?: string) {
  // 这个需要通过事件查询或者后端API实现
  // 暂时返回一个模拟的hook结构
  return {
    data: [],
    isLoading: false,
    error: null,
  }
}

