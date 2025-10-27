import { Link } from 'react-router-dom'
import { 
  Plus, 
  Vote as VoteIcon,
  Zap,
  Shield,
  Eye,
  AlertCircle
} from 'lucide-react'

export default function HomePageSimple() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Shield className="w-4 h-4" />
          <span>基于 FHEVM 全同态加密技术</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          AnonVote
          <span className="block text-2xl md:text-3xl text-primary-600 mt-2">
            会议匿名投票系统
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          确保投票隐私的同时实现结果透明可验证，适用于董事会、DAO 提案、公司内部决策等场景
        </p>

        {/* 特性卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">完全匿名</h3>
            <p className="text-sm text-gray-600">投票内容全程加密，无法追踪到具体投票人</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">结果透明</h3>
            <p className="text-sm text-gray-600">投票结果公开可验证，确保统计准确</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">简单易用</h3>
            <p className="text-sm text-gray-600">直观的操作界面，非技术人员也能轻松使用</p>
          </div>
        </div>

        {/* 系统状态 */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto mb-6">
          <div className="flex items-center space-x-2 text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="font-medium">系统运行正常</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            前端已成功启动，可以开始使用投票系统
          </p>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <Link to="/create" className="btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>创建投票</span>
          </Link>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center space-x-2 text-amber-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">演示模式</span>
            </div>
            <p className="text-amber-700 text-sm mt-1">
              当前运行在演示模式下。连接钱包和部署合约后可使用完整功能。
            </p>
          </div>
        </div>
      </div>

      {/* 功能说明 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          系统功能
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">投票创建</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>设置投票标题和描述</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>添加多个投票选项</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>设置投票截止时间</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">投票参与</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>匿名投票选择</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>加密投票提交</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>防重复投票保护</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">结果查看</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>自动解密统计结果</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>图表可视化展示</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>结果透明可验证</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">安全保障</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>FHEVM 全同态加密</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>区块链不可篡改</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>智能合约保护</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

