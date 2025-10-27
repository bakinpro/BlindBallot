import { useState, useEffect } from 'react'
import { Clock, AlertTriangle } from 'lucide-react'
import { calculateTimeLeft, formatTimeLeft } from '../utils/format'

interface CountdownTimerProps {
  deadline: number
  onExpire?: () => void
  className?: string
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function CountdownTimer({ 
  deadline, 
  onExpire, 
  className = '', 
  showIcon = true,
  size = 'md'
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(deadline))

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(deadline)
      setTimeLeft(newTimeLeft)
      
      if (newTimeLeft.total <= 0 && onExpire) {
        onExpire()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [deadline, onExpire])

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm'
      case 'lg':
        return 'text-lg font-semibold'
      default:
        return 'text-base font-medium'
    }
  }

  const getStatusColor = () => {
    if (timeLeft.total <= 0) {
      return 'text-red-600'
    }
    
    const totalHours = timeLeft.total / (1000 * 60 * 60)
    
    if (totalHours < 1) {
      return 'text-red-600'
    } else if (totalHours < 24) {
      return 'text-orange-600'
    } else {
      return 'text-green-600'
    }
  }

  const shouldAnimate = () => {
    const totalHours = timeLeft.total / (1000 * 60 * 60)
    return totalHours < 1 && timeLeft.total > 0
  }

  if (timeLeft.total <= 0) {
    return (
      <div className={`flex items-center space-x-2 ${getSizeClasses()} ${getStatusColor()} ${className}`}>
        {showIcon && <AlertTriangle className="w-4 h-4" />}
        <span>已结束</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-2 ${getSizeClasses()} ${getStatusColor()} ${className} ${
      shouldAnimate() ? 'animate-pulse' : ''
    }`}>
      {showIcon && <Clock className="w-4 h-4" />}
      <span>剩余 {formatTimeLeft(deadline)}</span>
    </div>
  )
}

