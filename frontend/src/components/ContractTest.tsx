import { useState } from 'react'
import { useCreateVoteSimple } from '../hooks/useContract-fixed'
import { useAccount } from 'wagmi'

export default function ContractTest() {
  const { isConnected } = useAccount()
  const { createVote, isLoading, isSuccess, error, debug } = useCreateVoteSimple()
  const [testResult, setTestResult] = useState<string>('')

  const handleTest = async () => {
    if (!createVote) {
      setTestResult('❌ createVote 函数不可用')
      return
    }

    try {
      setTestResult('🔄 正在测试合约调用...')
      
      const currentTime = Math.floor(Date.now() / 1000)
      const deadline = currentTime + (24 * 3600) // 24小时后
      
      console.log('测试参数:', {
        title: '测试投票',
        description: '这是一个测试投票',
        options: ['选项A', '选项B'],
        deadline: deadline
      })
      
      const result = await createVote(
        '测试投票',
        '这是一个测试投票', 
        ['选项A', '选项B'],
        deadline
      )
      
      console.log('测试结果:', result)
      setTestResult(`✅ 测试成功: ${JSON.stringify(result)}`)
      
    } catch (err: any) {
      console.error('测试失败:', err)
      setTestResult(`❌ 测试失败: ${err.message}`)
    }
  }

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">请先连接钱包以进行合约测试</p>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">🧪 合约测试</h3>
      
      {/* 调试信息 */}
      <div className="bg-white rounded p-4 mb-4 text-xs font-mono">
        <h4 className="font-bold mb-2">调试信息:</h4>
        <div className="space-y-1">
          <div><strong>连接状态:</strong> {debug.isConnected ? '✅' : '❌'}</div>
          <div><strong>钱包地址:</strong> {debug.address || '未连接'}</div>
          <div><strong>网络ID:</strong> {debug.chainId || '未知'}</div>
          <div><strong>合约地址:</strong> {debug.contractAddress}</div>
          <div><strong>写入函数:</strong> {debug.hasWrite ? '✅' : '❌'}</div>
          {debug.writeError && (
            <div className="text-red-600"><strong>写入错误:</strong> {debug.writeError}</div>
          )}
          {debug.waitError && (
            <div className="text-red-600"><strong>等待错误:</strong> {debug.waitError}</div>
          )}
        </div>
      </div>

      {/* 测试按钮 */}
      <button
        onClick={handleTest}
        disabled={isLoading || !debug.hasWrite}
        className={`px-6 py-3 rounded-lg font-medium ${
          isLoading || !debug.hasWrite
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isLoading ? '🔄 测试中...' : '🧪 测试创建投票'}
      </button>

      {/* 测试结果 */}
      {testResult && (
        <div className="mt-4 p-4 bg-white rounded border">
          <h4 className="font-bold mb-2">测试结果:</h4>
          <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}

      {/* 错误信息 */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
          <h4 className="font-bold text-red-800 mb-2">错误信息:</h4>
          <pre className="text-sm text-red-700 whitespace-pre-wrap">{error.message}</pre>
        </div>
      )}

      {/* 成功信息 */}
      {isSuccess && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <h4 className="font-bold text-green-800 mb-2">✅ 交易成功!</h4>
          <p className="text-sm text-green-700">投票创建成功</p>
        </div>
      )}
    </div>
  )
}

