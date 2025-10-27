import { 
  useContractRead, 
  useContractWrite, 
  useWaitForTransaction,
  usePrepareContractWrite,
  useNetwork,
  useAccount
} from 'wagmi'
import { CONTRACT_CONFIG } from '../config/contract'
import { useMemo, useEffect } from 'react'

// 带调试的创建投票Hook
export function useCreateVoteDebug() {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  
  // 准备合约写入
  const { 
    config, 
    error: prepareError, 
    isError: isPrepareError,
    isLoading: isPrepareLoading 
  } = usePrepareContractWrite({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'createVote',
    enabled: isConnected, // 只有连接钱包时才准备
  })
  
  // 执行合约写入
  const { 
    write, 
    data, 
    error: writeError, 
    isLoading: isWriteLoading 
  } = useContractWrite(config)
  
  // 等待交易确认
  const { 
    isLoading: isConfirming, 
    isSuccess,
    error: waitError 
  } = useWaitForTransaction({
    hash: data?.hash,
  })

  // 调试信息输出
  useEffect(() => {
    console.log('🔧 CreateVote Hook Debug:', {
      isConnected,
      address,
      chain: chain?.name,
      chainId: chain?.id,
      contractAddress: CONTRACT_CONFIG.address,
      prepareError: prepareError?.message,
      isPrepareError,
      isPrepareLoading,
      config: !!config,
      write: !!write,
      writeError: writeError?.message,
      isWriteLoading,
      txHash: data?.hash,
      isConfirming,
      isSuccess,
      waitError: waitError?.message
    })
  }, [
    isConnected, address, chain, 
    prepareError, isPrepareError, isPrepareLoading,
    config, write, writeError, isWriteLoading,
    data?.hash, isConfirming, isSuccess, waitError
  ])

  const createVote = useMemo(() => {
    if (!write) {
      console.log('❌ createVote: write function not available')
      return undefined
    }
    
    return (title: string, description: string, options: string[], deadline: number) => {
      console.log('🚀 调用 createVote:', { title, description, options, deadline })
      
      try {
        const result = write({
          args: [title, description, options, deadline],
        })
        console.log('📝 createVote 调用结果:', result)
        return result
      } catch (error) {
        console.error('❌ createVote 调用失败:', error)
        throw error
      }
    }
  }, [write])
  
  return {
    createVote,
    isLoading: isPrepareLoading || isWriteLoading || isConfirming,
    isSuccess,
    error: prepareError || writeError || waitError,
    txHash: data?.hash,
    // 调试信息
    debug: {
      isConnected,
      address,
      chainId: chain?.id,
      contractAddress: CONTRACT_CONFIG.address,
      hasConfig: !!config,
      hasWrite: !!write,
      prepareError: prepareError?.message,
      writeError: writeError?.message,
      waitError: waitError?.message
    }
  }
}

// 获取总投票数（带调试）
export function useTotalVotesDebug() {
  const { chain } = useNetwork()
  const { isConnected } = useAccount()
  
  const result = useContractRead({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'nextVoteId',
    enabled: isConnected,
  })

  useEffect(() => {
    console.log('📊 TotalVotes Debug:', {
      isConnected,
      chain: chain?.name,
      chainId: chain?.id,
      contractAddress: CONTRACT_CONFIG.address,
      data: result.data?.toString(),
      error: result.error?.message,
      isLoading: result.isLoading,
      isError: result.isError
    })
  }, [result, isConnected, chain])

  return result
}

// 获取投票信息（带调试）
export function useVoteInfoDebug(voteId: number) {
  const { chain } = useNetwork()
  const { isConnected } = useAccount()
  
  const result = useContractRead({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getVoteInfo',
    args: [voteId],
    enabled: isConnected && voteId >= 0,
  })

  useEffect(() => {
    if (voteId >= 0) {
      console.log(`📋 VoteInfo Debug (ID: ${voteId}):`, {
        isConnected,
        chain: chain?.name,
        chainId: chain?.id,
        contractAddress: CONTRACT_CONFIG.address,
        voteId,
        data: result.data,
        error: result.error?.message,
        isLoading: result.isLoading,
        isError: result.isError
      })
    }
  }, [result, voteId, isConnected, chain])

  return result
}

