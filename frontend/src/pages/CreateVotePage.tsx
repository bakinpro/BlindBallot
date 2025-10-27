import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Plus, Trash2, Clock, Users, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import NetworkChecker from '../components/NetworkChecker'
import { useCreateVoteSimple } from '../hooks/useContract-fixed'
import toast from 'react-hot-toast'

interface VoteOption {
  id: string
  text: string
}

export default function CreateVotePage() {
  const navigate = useNavigate()
  const { isConnected } = useAccount()
  const { createVote, isLoading, isSuccess, error, debug } = useCreateVoteSimple()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 24, // 默认24小时
  })

  const [options, setOptions] = useState<VoteOption[]>([
    { id: '1', text: '赞成' },
    { id: '2', text: '反对' },
  ])

  const [errors, setErrors] = useState<Record<string, string>>({})

  // 添加选项
  const addOption = () => {
    if (options.length >= 10) {
      toast.error('最多只能添加10个选项')
      return
    }
    
    const newId = Date.now().toString()
    setOptions([...options, { id: newId, text: '' }])
  }

  // 删除选项
  const removeOption = (id: string) => {
    if (options.length <= 2) {
      toast.error('至少需要2个选项')
      return
    }
    
    setOptions(options.filter(option => option.id !== id))
  }

  // 更新选项文本
  const updateOption = (id: string, text: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, text } : option
    ))
  }

  // 表单验证
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = '请输入投票标题'
    } else if (formData.title.length < 3) {
      newErrors.title = '标题至少需要3个字符'
    } else if (formData.title.length > 100) {
      newErrors.title = '标题不能超过100个字符'
    }

    if (!formData.description.trim()) {
      newErrors.description = '请输入投票描述'
    } else if (formData.description.length < 10) {
      newErrors.description = '描述至少需要10个字符'
    } else if (formData.description.length > 500) {
      newErrors.description = '描述不能超过500个字符'
    }

    if (formData.duration < 1) {
      newErrors.duration = '投票时长至少1小时'
    } else if (formData.duration > 168) {
      newErrors.duration = '投票时长不能超过168小时（7天）'
    }

    // 验证选项
    const validOptions = options.filter(option => option.text.trim())
    if (validOptions.length < 2) {
      newErrors.options = '至少需要2个有效选项'
    }

    const duplicateOptions = validOptions.filter((option, index) => 
      validOptions.findIndex(o => o.text.trim().toLowerCase() === option.text.trim().toLowerCase()) !== index
    )
    if (duplicateOptions.length > 0) {
      newErrors.options = '选项不能重复'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      toast.error('请先连接钱包')
      return
    }

    if (!validateForm()) {
      toast.error('请检查表单输入')
      return
    }

    const validOptions = options
      .filter(option => option.text.trim())
      .map(option => option.text.trim())

    try {
      // 计算截止时间戳（当前时间 + 持续时间）
      const currentTime = Math.floor(Date.now() / 1000) // 当前时间戳（秒）
      const deadline = currentTime + (formData.duration * 3600) // 添加持续时间（小时转秒）
      
      console.log('📝 创建投票参数:', {
        title: formData.title.trim(),
        description: formData.description.trim(),
        options: validOptions,
        deadline: deadline,
        deadlineDate: new Date(deadline * 1000).toLocaleString()
      })
      
      const result = await createVote?.(
        formData.title.trim(),
        formData.description.trim(),
        validOptions,
        deadline
      )
      
      console.log('✅ 创建投票结果:', result)
      toast.success('投票创建成功！正在跳转...')
      
      // 如果能从交易结果中获取投票ID，使用真实ID；否则跳转到投票列表
      if (result && result.hash) {
        // 等待交易确认后跳转到投票列表
        setTimeout(() => {
          navigate('/votes')
        }, 3000)
      } else {
        // 立即跳转到投票列表
        setTimeout(() => {
          navigate('/votes')
        }, 1500)
      }
      
    } catch (error) {
      console.error('❌ 创建投票失败:', error)
      toast.error(`创建投票失败: ${error.message || '请重试'}`)
    }
  }

  // 如果未连接钱包
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-yellow-800 mb-2">需要连接钱包</h2>
            <p className="text-yellow-700 mb-6">
              请连接您的钱包以创建投票。我们支持 MetaMask、WalletConnect 等主流钱包。
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              返回首页连接钱包
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">创建新投票</h1>
          <p className="text-gray-600">
            设置投票参数，创建一个匿名、透明的投票活动
          </p>
        </div>

        {/* 网络检查 */}
        {isConnected && <NetworkChecker />}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 主表单 */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 基本信息 */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  基本信息
                </h2>

                <div className="space-y-6">
                  {/* 投票标题 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      投票标题 *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="例如：是否同意新的提案？"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.title ? 'border-red-300' : 'border-gray-300'
                      }`}
                      maxLength={100}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                      {formData.title.length}/100 字符
                    </p>
                  </div>

                  {/* 投票描述 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      详细描述 *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="详细描述投票的背景、目的和相关信息..."
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      maxLength={500}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                      {formData.description.length}/500 字符
                    </p>
                  </div>

                  {/* 投票时长 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      投票时长 *
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        min="1"
                        max="168"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })}
                        className={`w-24 px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.duration ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      <span className="text-gray-700">小时</span>
                      <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                    {errors.duration && (
                      <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                      投票将在 {formData.duration} 小时后自动结束
                    </p>
                  </div>
                </div>
              </div>

              {/* 投票选项 */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    投票选项
                  </h2>
                  <button
                    type="button"
                    onClick={addOption}
                    disabled={options.length >= 10}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    添加选项
                  </button>
                </div>

                <div className="space-y-4">
                  {options.map((option, index) => (
                    <div key={option.id} className="flex items-center space-x-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => updateOption(option.id, e.target.value)}
                        placeholder={`选项 ${index + 1}`}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        maxLength={50}
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(option.id)}
                          className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {errors.options && (
                  <p className="text-red-500 text-sm mt-4">{errors.options}</p>
                )}

                <p className="text-gray-500 text-sm mt-4">
                  最少2个选项，最多10个选项。每个选项最多50个字符。
                </p>
              </div>

              {/* 提交按钮 */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      创建中...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      创建投票
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* 预览卡片 */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">投票预览</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">标题</p>
                    <p className="font-medium text-gray-900">
                      {formData.title || '投票标题'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">持续时间</p>
                    <p className="text-gray-900">{formData.duration} 小时</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">选项数量</p>
                    <p className="text-gray-900">{options.filter(o => o.text.trim()).length} 个</p>
                  </div>
                </div>
              </div>

              {/* 提示信息 */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 创建提示</h3>
                <ul className="text-blue-800 text-sm space-y-2">
                  <li>• 投票创建后无法修改，请仔细检查</li>
                  <li>• 所有投票都是匿名的，无法追踪投票者</li>
                  <li>• 投票结果将实时公开显示</li>
                  <li>• 投票结束后结果将永久保存在区块链上</li>
                </ul>
              </div>

              {/* 合约测试 */}

              {/* 安全提示 */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-green-900">隐私保护</h3>
                </div>
                <p className="text-green-800 text-sm">
                  基于 FHEVM 同态加密技术，确保投票过程完全匿名，任何人都无法查看个人的投票选择。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}