import { useState } from 'react'
import { useContractRead } from 'wagmi'
import { CONTRACT_CONFIG } from '../config/contract'

export default function VoteDebug() {
  const [testVoteId, setTestVoteId] = useState(0)

  // 获取总投票数
  const { data: totalVotes, isLoading: loadingTotal, error: totalError } = useContractRead({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'nextVoteId',
  })

  // 获取指定投票信息
  const { data: voteInfo, isLoading: loadingVote, error: voteError } = useContractRead({
    address: CONTRACT_CONFIG.address,
    abi: CONTRACT_CONFIG.abi,
    functionName: 'getVoteInfo',
    args: [testVoteId],
    enabled: testVoteId >= 0,
  })

  const totalVotesNum = totalVotes ? parseInt(totalVotes.toString()) : 0

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-yellow-900 mb-4">🔍 投票调试工具</h3>
      
      {/* 总投票数 */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">总投票数:</h4>
        {loadingTotal ? (
          <p className="text-gray-600">加载中...</p>
        ) : totalError ? (
          <p className="text-red-600">错误: {totalError.message}</p>
        ) : (
          <p className="text-green-600">✅ {totalVotesNum} 个投票 (ID: 0 到 {totalVotesNum - 1})</p>
        )}
      </div>

      {/* 测试特定投票 */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">测试投票信息:</h4>
        <div className="flex items-center space-x-2 mb-2">
          <label>投票ID:</label>
          <input
            type="number"
            min="0"
            max={Math.max(0, totalVotesNum - 1)}
            value={testVoteId}
            onChange={(e) => setTestVoteId(parseInt(e.target.value) || 0)}
            className="px-2 py-1 border rounded w-20"
          />
          <span className="text-sm text-gray-500">
            (范围: 0 - {Math.max(0, totalVotesNum - 1)})
          </span>
        </div>
        
        {loadingVote ? (
          <p className="text-gray-600">加载投票 #{testVoteId} 中...</p>
        ) : voteError ? (
          <div className="text-red-600">
            <p>❌ 加载投票 #{testVoteId} 失败:</p>
            <p className="text-sm">{voteError.message}</p>
          </div>
        ) : voteInfo ? (
          <div className="bg-white rounded p-3 text-sm">
            <p><strong>✅ 投票 #{testVoteId} 数据:</strong></p>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify({
                title: voteInfo[0],
                description: voteInfo[1],
                options: voteInfo[2],
                deadline: voteInfo[3]?.toString(),
                totalVoters: voteInfo[4]?.toString(),
                isActive: voteInfo[5],
                isRevealed: voteInfo[6],
                creator: voteInfo[7]
              }, null, 2)}
            </pre>
          </div>
        ) : (
          <p className="text-gray-600">无数据</p>
        )}
      </div>

      {/* 快速测试按钮 */}
      <div className="flex space-x-2">
        {Array.from({ length: Math.min(3, totalVotesNum) }, (_, i) => (
          <button
            key={i}
            onClick={() => setTestVoteId(i)}
            className={`px-3 py-1 rounded text-sm ${
              testVoteId === i 
                ? 'bg-yellow-600 text-white' 
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            }`}
          >
            测试 #{i}
          </button>
        ))}
      </div>
    </div>
  )
}

