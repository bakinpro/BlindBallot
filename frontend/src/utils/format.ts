import { format, formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

/**
 * 格式化时间戳为可读日期
 */
export function formatDate(timestamp: number | string, formatStr: string = 'yyyy年MM月dd日 HH:mm'): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp * 1000)
  return format(date, formatStr, { locale: zhCN })
}

/**
 * 格式化相对时间（多久之前/之后）
 */
export function formatRelativeTime(timestamp: number | string): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp * 1000)
  return formatDistanceToNow(date, { addSuffix: true, locale: zhCN })
}

/**
 * 获取时间状态和样式
 */
export function getTimeStatus(deadline: number) {
  const now = Date.now()
  const deadlineMs = deadline * 1000
  const diff = deadlineMs - now
  
  if (diff <= 0) {
    return {
      status: 'expired',
      text: '已结束',
      className: 'text-red-600 bg-red-100'
    }
  }
  
  const hours = diff / (1000 * 60 * 60)
  
  if (hours < 1) {
    return {
      status: 'urgent',
      text: '即将结束',
      className: 'text-orange-600 bg-orange-100 animate-pulse'
    }
  }
  
  if (hours < 24) {
    return {
      status: 'soon',
      text: '即将结束',
      className: 'text-orange-600 bg-orange-100'
    }
  }
  
  return {
    status: 'active',
    text: '进行中',
    className: 'text-green-600 bg-green-100'
  }
}

/**
 * 格式化钱包地址
 */
export function formatAddress(address: string, startLength: number = 6, endLength: number = 4): string {
  if (!address) return ''
  if (address.length <= startLength + endLength) return address
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}

/**
 * 格式化数字（添加千分位分隔符）
 */
export function formatNumber(num: number | string): string {
  const number = typeof num === 'string' ? parseFloat(num) : num
  return new Intl.NumberFormat('zh-CN').format(number)
}

/**
 * 格式化百分比
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * 计算剩余时间
 */
export function calculateTimeLeft(deadline: number): {
  total: number
  days: number
  hours: number
  minutes: number
  seconds: number
} {
  const now = Date.now()
  const deadlineMs = deadline * 1000
  const total = deadlineMs - now
  
  if (total <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
  
  const days = Math.floor(total / (1000 * 60 * 60 * 24))
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((total % (1000 * 60)) / 1000)
  
  return { total, days, hours, minutes, seconds }
}

/**
 * 格式化剩余时间为文本
 */
export function formatTimeLeft(deadline: number): string {
  const { total, days, hours, minutes } = calculateTimeLeft(deadline)
  
  if (total <= 0) return '已结束'
  
  if (days > 0) {
    return `${days}天${hours}小时`
  }
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  }
  
  if (minutes > 0) {
    return `${minutes}分钟`
  }
  
  return '即将结束'
}

