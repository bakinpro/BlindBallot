/**
 * 投票相关的工具函数
 */

export type VoteStatus = 'active' | 'expired' | 'completed'

export interface VoteInfo {
  id: number
  title: string
  description: string
  options: string[]
  deadline: number
  totalVoters: number
  isActive: boolean
  isRevealed: boolean
  creator: string
}

/**
 * 获取投票状态
 */
export function getVoteStatus(voteInfo: VoteInfo, isExpired?: boolean): VoteStatus {
  if (voteInfo.isRevealed) return 'completed'
  if (isExpired || Date.now() > voteInfo.deadline * 1000) return 'expired'
  return 'active'
}

/**
 * 检查用户是否可以投票
 */
export function canUserVote(
  isConnected: boolean,
  hasVoted: boolean,
  status: VoteStatus
): boolean {
  return isConnected && !hasVoted && status === 'active'
}

/**
 * 获取投票状态显示文本
 */
export function getStatusText(status: VoteStatus): string {
  switch (status) {
    case 'active':
      return '进行中'
    case 'expired':
      return '已过期'
    case 'completed':
      return '已完成'
    default:
      return '未知状态'
  }
}

/**
 * 获取投票状态样式类名
 */
export function getStatusClassName(status: VoteStatus): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'expired':
      return 'bg-orange-100 text-orange-800'
    case 'completed':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

/**
 * 验证投票表单数据
 */
export interface CreateVoteFormData {
  title: string
  description: string
  options: string[]
  deadline: string
}

export interface FormErrors {
  title?: string
  description?: string
  options?: string[]
  deadline?: string
}

export function validateVoteForm(data: CreateVoteFormData): FormErrors {
  const errors: FormErrors = {}

  // 验证标题
  if (!data.title.trim()) {
    errors.title = '请输入投票标题'
  } else if (data.title.length > 100) {
    errors.title = '标题不能超过100个字符'
  }

  // 验证描述（可选）
  if (data.description.length > 500) {
    errors.description = '描述不能超过500个字符'
  }

  // 验证选项
  const validOptions = data.options.filter(opt => opt.trim() !== '')
  if (validOptions.length < 2) {
    errors.options = ['至少需要两个有效选项']
  } else if (validOptions.length > 10) {
    errors.options = ['选项数量不能超过10个']
  } else {
    // 检查重复选项
    const uniqueOptions = new Set(validOptions.map(opt => opt.trim().toLowerCase()))
    if (uniqueOptions.size !== validOptions.length) {
      errors.options = ['选项不能重复']
    }
    
    // 检查选项长度
    const longOptions = validOptions.filter(opt => opt.length > 50)
    if (longOptions.length > 0) {
      errors.options = ['每个选项不能超过50个字符']
    }
  }

  // 验证截止时间
  if (!data.deadline) {
    errors.deadline = '请选择截止时间'
  } else {
    const deadlineDate = new Date(data.deadline)
    const now = new Date()
    
    if (deadlineDate <= now) {
      errors.deadline = '截止时间必须晚于当前时间'
    }
    
    // 检查是否超过1年
    const oneYearLater = new Date()
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1)
    
    if (deadlineDate > oneYearLater) {
      errors.deadline = '截止时间不能超过一年'
    }
    
    // 检查是否少于5分钟
    const fiveMinutesLater = new Date()
    fiveMinutesLater.setMinutes(fiveMinutesLater.getMinutes() + 5)
    
    if (deadlineDate < fiveMinutesLater) {
      errors.deadline = '截止时间至少需要5分钟后'
    }
  }

  return errors
}

/**
 * 生成投票选项的颜色
 */
export function getOptionColor(index: number): string {
  const colors = [
    '#3B82F6', // blue
    '#10B981', // emerald
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // violet
    '#06B6D4', // cyan
    '#84CC16', // lime
    '#F97316', // orange
    '#EC4899', // pink
    '#6B7280', // gray
  ]
  
  return colors[index % colors.length]
}

/**
 * 计算投票结果统计
 */
export interface VoteStats {
  totalVotes: number
  winner: {
    option: string
    votes: number
    percentage: number
    index: number
  } | null
  results: Array<{
    option: string
    votes: number
    percentage: number
    index: number
  }>
}

export function calculateVoteStats(
  options: string[],
  results: number[]
): VoteStats {
  const totalVotes = results.reduce((sum, votes) => sum + votes, 0)
  
  const votesData = options.map((option, index) => ({
    option,
    votes: results[index] || 0,
    percentage: totalVotes > 0 ? (results[index] || 0) / totalVotes * 100 : 0,
    index
  }))
  
  // 按票数排序
  const sortedResults = [...votesData].sort((a, b) => b.votes - a.votes)
  
  const winner = totalVotes > 0 ? sortedResults[0] : null
  
  return {
    totalVotes,
    winner,
    results: sortedResults
  }
}

/**
 * 检查是否为有效的以太坊地址
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

