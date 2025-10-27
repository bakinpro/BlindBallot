import { 
  useContractRead, 
  useContractWrite, 
  useWaitForTransaction,
  usePrepareContractWrite,
  useNetwork,
  useAccount
} from 'wagmi'
import { CONTRACT_CONFIG } from '../config/contract'
import { useMemo, useEffect, useState } from 'react'

// 修复版本的创建投票Hook
export function useCreateVoteFixed() {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const [args, setArgs] = useState<[string, string, string[], number] | undefined>()
  
  // 准备合约写入 - 只有当args存在时才准备
  const { 
    config, 
    error: prepareError, 
    isError: isPrepareError,
    isLoading: isPrepareLoading 
  } = usePrepareContractWrite({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'createVote',
    args: args,
    enabled: isConnected && !!args, // 只有连接钱包且有参数时才准备
  })
  
  // 执行合约写入
  const { 
    write, 
    data, 
    error: writeError, 
    isLoading: isWriteLoading,
    reset
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
    console.log('🔧 CreateVote Fixed Hook Debug:', {
      isConnected,
      address,
      chain: chain?.name,
      chainId: chain?.id,
      contractAddress: CONTRACT_CONFIG.address,
      hasArgs: !!args,
      args,
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
    isConnected, address, chain, args,
    prepareError, isPrepareError, isPrepareLoading,
    config, write, writeError, isWriteLoading,
    data?.hash, isConfirming, isSuccess, waitError
  ])

  const createVote = useMemo(() => {
    return (title: string, description: string, options: string[], deadline: number) => {
      console.log('🚀 准备创建投票:', { title, description, options, deadline })
      
      try {
        // 设置参数，这会触发 usePrepareContractWrite 重新准备
        setArgs([title, description, options, deadline])
        
        // 如果write函数已经准备好，直接调用
        if (write) {
          console.log('📝 调用 write 函数')
          const result = write()
          console.log('✅ write 调用结果:', result)
          return result
        } else {
          console.log('⏳ write 函数还未准备好，参数已设置，等待准备完成')
        }
      } catch (error) {
        console.error('❌ createVote 调用失败:', error)
        throw error
      }
    }
  }, [write])
  
  // 当write函数准备好且有参数时，自动调用
  useEffect(() => {
    if (write && args && !isWriteLoading && !data) {
      console.log('🔄 自动调用 write 函数，参数:', args)
      try {
        write()
        // 清除参数，避免重复调用
        setArgs(undefined)
      } catch (error) {
        console.error('❌ 自动调用 write 失败:', error)
      }
    }
  }, [write, args, isWriteLoading, data])
  
  return {
    createVote,
    isLoading: isPrepareLoading || isWriteLoading || isConfirming,
    isSuccess,
    error: prepareError || writeError || waitError,
    txHash: data?.hash,
    reset: () => {
      setArgs(undefined)
      reset()
    },
    // 调试信息
    debug: {
      isConnected,
      address,
      chainId: chain?.id,
      contractAddress: CONTRACT_CONFIG.address,
      hasConfig: !!config,
      hasWrite: !!write,
      hasArgs: !!args,
      prepareError: prepareError?.message,
      writeError: writeError?.message,
      waitError: waitError?.message
    }
  }
}

// 简化版本的创建投票Hook（不使用prepare）
export function useCreateVoteSimple() {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  
  // 直接使用 useContractWrite，不预先准备
  const { 
    write, 
    data, 
    error: writeError, 
    isLoading: isWriteLoading,
    reset
  } = useContractWrite({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'createVote',
  })
  
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
    console.log('🔧 CreateVote Simple Hook Debug:', {
      isConnected,
      address,
      chain: chain?.name,
      chainId: chain?.id,
      contractAddress: CONTRACT_CONFIG.address,
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
    write, writeError, isWriteLoading,
    data?.hash, isConfirming, isSuccess, waitError
  ])

  const createVote = useMemo(() => {
    if (!write) {
      console.log('❌ createVote: write function not available')
      return undefined
    }
    
    return (title: string, description: string, options: string[], deadline: number) => {
      console.log('🚀 调用 createVote (Simple):', { title, description, options, deadline })
      
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
    isLoading: isWriteLoading || isConfirming,
    isSuccess,
    error: writeError || waitError,
    txHash: data?.hash,
    reset,
    // 调试信息
    debug: {
      isConnected,
      address,
      chainId: chain?.id,
      contractAddress: CONTRACT_CONFIG.address,
      hasWrite: !!write,
      writeError: writeError?.message,
      waitError: waitError?.message
    }
  }
}

