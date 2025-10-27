import { useMemo } from 'react'
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'
import { useVoteInfo } from './useVoteData'
import { CONTRACT_CONFIG } from '../config/contract'

// 获取投票详情（复用现有的 useVoteInfo）
export { useVoteInfo } from './useVoteData'

// 检查用户是否已投票
export function useHasVoted(voteId: number) {
  const { address } = useAccount()
  
  const { data, isLoading, error } = useContractRead({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'hasAddressVoted',
    args: [BigInt(voteId), address],
    enabled: !!address && voteId >= 0,
    watch: false, // 关闭自动监听，减少刷新
  })
  
  return {
    data: data || false,
    isLoading,
    error
  }
}

// 投票功能（简化版，模拟加密投票）
export function useCastVote() {
  const { isConnected, address } = useAccount()

  // 直接使用 useContractWrite，参数在调用时传入
  const {
    write: castVoteWrite,
    data,
    error: writeError,
    isLoading: isWriteLoading,
    isError: isWriteError,
  } = useContractWrite({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'castVote',
  })

  const {
    isLoading: isConfirming,
    isSuccess,
    error: waitError,
    isError: isWaitError,
  } = useWaitForTransaction({
    hash: data?.hash,
    enabled: !!data?.hash,
  })

  const castVote = useMemo(() => {
    if (!castVoteWrite) return undefined

    return (voteId: number, optionIndex: number) => {
      // 为了测试，我们创建一个简单的"加密"字节
      // 实际应该使用 FHEVM 的加密功能
      const mockEncryptedChoice = `0x${optionIndex.toString(16).padStart(4, '0')}`
      
      console.log('🗳️ 发送投票参数:', {
        voteId,
        optionIndex,
        mockEncryptedChoice,
        args: [BigInt(voteId), mockEncryptedChoice]
      })

      try {
        return castVoteWrite({
          args: [BigInt(voteId), mockEncryptedChoice],
        })
      } catch (error) {
        console.error('🗳️ castVoteWrite 调用失败:', error)
        throw error
      }
    }
  }, [castVoteWrite])

  const debug = {
    isConnected,
    address,
    contractAddress: CONTRACT_CONFIG.address,
    hasConfig: !!CONTRACT_CONFIG.address && !!CONTRACT_CONFIG.abi,
    hasWrite: !!castVoteWrite,
    writeError: writeError?.message,
    waitError: waitError?.message,
    isWriteLoading,
    isConfirming,
    isSuccess,
    isWriteError,
    isWaitError,
  }

  return {
    castVote,
    isLoading: isWriteLoading || isConfirming,
    isSuccess,
    error: writeError || waitError,
    debug,
  }
}

// 获取投票结果
export function useVoteResults(voteId: number) {
  const { data, isLoading, error } = useContractRead({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getVoteResults',
    args: [BigInt(voteId)],
    enabled: voteId >= 0,
    watch: true,
  })
  
  return {
    data,
    isLoading,
    error
  }
}

// 解密投票结果
export function useRevealVoteResults() {
  const { isConnected, address } = useAccount()

  const {
    write: revealWrite,
    data,
    error: writeError,
    isLoading: isWriteLoading,
    isError: isWriteError,
  } = useContractWrite({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'revealVoteResults',
  })

  const {
    isLoading: isConfirming,
    isSuccess,
    error: waitError,
    isError: isWaitError,
  } = useWaitForTransaction({
    hash: data?.hash,
    enabled: !!data?.hash,
  })

  const revealResults = useMemo(() => {
    if (!revealWrite) return undefined

    return (voteId: number, decryptedCounts: number[]) => {
      console.log('🔓 解密投票结果:', {
        voteId,
        decryptedCounts,
        args: [BigInt(voteId), decryptedCounts.map(c => BigInt(c))]
      })

      return revealWrite({
        args: [BigInt(voteId), decryptedCounts.map(c => BigInt(c))],
      })
    }
  }, [revealWrite])

  return {
    revealResults,
    isLoading: isWriteLoading || isConfirming,
    isSuccess,
    error: writeError || waitError,
    debug: {
      isConnected,
      address,
      hasWrite: !!revealWrite,
      writeError: writeError?.message,
      waitError: waitError?.message,
    }
  }
}
