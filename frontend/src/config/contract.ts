// 合约配置
export const CONTRACT_CONFIG = {
  // 合约地址 - 部署后需要更新
  address: (process.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`,
  
  // 合约 ABI - 核心函数接口
  abi: [
    // 获取下一个投票ID（总投票数）
    {
      "inputs": [],
      "name": "nextVoteId",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    
    // 获取投票信息
    {
      "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "name": "votes",
      "outputs": [
        { "internalType": "string", "name": "title", "type": "string" },
        { "internalType": "string", "name": "description", "type": "string" },
        { "internalType": "address", "name": "creator", "type": "address" },
        { "internalType": "uint256", "name": "deadline", "type": "uint256" },
        { "internalType": "uint256", "name": "totalVoters", "type": "uint256" },
        { "internalType": "bool", "name": "isActive", "type": "bool" },
        { "internalType": "bool", "name": "isRevealed", "type": "bool" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    
    // 创建投票
    {
      "inputs": [
        { "internalType": "string", "name": "title", "type": "string" },
        { "internalType": "string", "name": "description", "type": "string" },
        { "internalType": "string[]", "name": "options", "type": "string[]" },
        { "internalType": "uint256", "name": "deadline", "type": "uint256" }
      ],
      "name": "createVote",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    
    // 投票提交
    {
      "inputs": [
        { "internalType": "uint256", "name": "voteId", "type": "uint256" },
        { "internalType": "bytes", "name": "encryptedChoice", "type": "bytes" }
      ],
      "name": "castVote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    
    // 解密投票结果
    {
      "inputs": [
        { "internalType": "uint256", "name": "voteId", "type": "uint256" },
        { "internalType": "uint256[]", "name": "decryptedCounts", "type": "uint256[]" }
      ],
      "name": "revealVoteResults",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    
    // 获取投票信息
    {
      "inputs": [{ "internalType": "uint256", "name": "voteId", "type": "uint256" }],
      "name": "getVoteInfo",
      "outputs": [
        { "internalType": "string", "name": "title", "type": "string" },
        { "internalType": "string", "name": "description", "type": "string" },
        { "internalType": "string[]", "name": "options", "type": "string[]" },
        { "internalType": "uint256", "name": "deadline", "type": "uint256" },
        { "internalType": "uint256", "name": "totalVoters", "type": "uint256" },
        { "internalType": "bool", "name": "isActive", "type": "bool" },
        { "internalType": "bool", "name": "isRevealed", "type": "bool" },
        { "internalType": "address", "name": "creator", "type": "address" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    
    // 获取投票结果
    {
      "inputs": [{ "internalType": "uint256", "name": "voteId", "type": "uint256" }],
      "name": "getVoteResults",
      "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
      "stateMutability": "view",
      "type": "function"
    },
    
    // 检查是否已投票
    {
      "inputs": [
        { "internalType": "uint256", "name": "voteId", "type": "uint256" },
        { "internalType": "address", "name": "addr", "type": "address" }
      ],
      "name": "hasAddressVoted",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    
    // 获取总投票数
    {
      "inputs": [],
      "name": "getTotalVotes",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    
    // 检查投票是否过期
    {
      "inputs": [{ "internalType": "uint256", "name": "voteId", "type": "uint256" }],
      "name": "isVoteExpired",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    
    // 提前结束投票
    {
      "inputs": [{ "internalType": "uint256", "name": "voteId", "type": "uint256" }],
      "name": "endVoteEarly",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    
    // 事件
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "voteId", "type": "uint256" },
        { "indexed": true, "internalType": "address", "name": "creator", "type": "address" },
        { "indexed": false, "internalType": "string", "name": "title", "type": "string" },
        { "indexed": false, "internalType": "uint256", "name": "deadline", "type": "uint256" }
      ],
      "name": "VoteCreated",
      "type": "event"
    },
    
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "voteId", "type": "uint256" },
        { "indexed": true, "internalType": "address", "name": "voter", "type": "address" }
      ],
      "name": "VoteCast",
      "type": "event"
    },
    
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "voteId", "type": "uint256" },
        { "indexed": false, "internalType": "uint256[]", "name": "counts", "type": "uint256[]" }
      ],
      "name": "VoteRevealed",
      "type": "event"
    }
  ] as const
} as const
