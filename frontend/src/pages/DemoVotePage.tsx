import { useNavigate } from 'react-router-dom'
import { Vote, ArrowRight, Users, Clock, Shield, Trophy } from 'lucide-react'

const demoVotes = [
  {
    id: 1,
    title: "是否同意实施新的开发计划？",
    description: "该计划将引入新的技术栈和开发流程，预计需要6个月的过渡期。",
    status: "active",
    timeRemaining: "23小时12分钟",
    participants: 45,
    options: ["完全同意", "部分同意", "需要更多信息", "不同意"]
  },
  {
    id: 2,
    title: "团队工作模式投票",
    description: "决定下一阶段的工作模式，混合办公还是完全远程。",
    status: "ended",
    timeRemaining: "已结束",
    participants: 78,
    options: ["完全远程", "混合办公", "回到办公室", "弹性安排"],
    winner: "混合办公"
  },
  {
    id: 3,
    title: "年会活动方案选择",
    description: "选择今年的年会活动形式和主题，让大家共同参与决定。",
    status: "active",
    timeRemaining: "5天14小时",
    participants: 23,
    options: ["户外团建", "室内聚餐", "线上活动", "推迟举办"]
  }
]

export default function DemoVotePage() {
  const navigate = useNavigate()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'ended':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '进行中'
      case 'ended':
        return '已结束'
      default:
        return '未知'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-6">
            <Vote className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            投票演示中心
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            探索 AnonVote 的完整功能，体验匿名投票的全流程
          </p>
        </div>

        {/* 功能导航 */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <button
            onClick={() => navigate('/create')}
            className="p-6 bg-white border-2 border-green-200 rounded-xl hover:border-green-400 hover:shadow-lg transition-all group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-green-200 transition-colors">
              <Vote className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">创建投票</h3>
            <p className="text-gray-600 text-sm">体验完整的投票创建流程</p>
          </button>

          <button
            onClick={() => navigate('/vote/1')}
            className="p-6 bg-white border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-blue-200 transition-colors">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">参与投票</h3>
            <p className="text-gray-600 text-sm">体验匿名投票参与流程</p>
          </button>

          <button
            onClick={() => navigate('/results/2')}
            className="p-6 bg-white border-2 border-purple-200 rounded-xl hover:border-purple-400 hover:shadow-lg transition-all group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-purple-200 transition-colors">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">查看结果</h3>
            <p className="text-gray-600 text-sm">查看详细的投票结果统计</p>
          </button>
        </div>

        {/* 演示投票列表 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">演示投票</h2>
            <p className="text-gray-600">点击任意投票进行体验</p>
          </div>

          <div className="grid gap-6">
            {demoVotes.map((vote) => (
              <div
                key={vote.id}
                className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 mr-3">
                          {vote.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vote.status)}`}>
                          {getStatusText(vote.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {vote.description}
                      </p>
                    </div>
                  </div>

                  {/* 投票统计信息 */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{vote.participants} 人参与</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{vote.timeRemaining}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Vote className="w-4 h-4 mr-2" />
                      <span>{vote.options.length} 个选项</span>
                    </div>
                  </div>

                  {/* 选项预览 */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2">投票选项：</p>
                    <div className="flex flex-wrap gap-2">
                      {vote.options.map((option, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm ${
                            vote.winner === option ? 'bg-yellow-100 text-yellow-800 font-medium' : ''
                          }`}
                        >
                          {vote.winner === option && <Trophy className="inline w-3 h-3 mr-1" />}
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Shield className="w-4 h-4 mr-1" />
                      <span>匿名投票 • 区块链保护</span>
                    </div>
                    
                    <div className="flex space-x-3">
                      {vote.status === 'active' ? (
                        <button
                          onClick={() => navigate(`/vote/${vote.id}`)}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          参与投票
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(`/results/${vote.id}`)}
                          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          查看结果
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 快速指南 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🚀 快速体验指南
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">连接钱包</h3>
              <p className="text-sm text-gray-600">
                点击右上角连接您的 MetaMask 钱包
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">参与投票</h3>
              <p className="text-sm text-gray-600">
                选择一个活跃的投票进行体验
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">查看结果</h3>
              <p className="text-sm text-gray-600">
                查看实时统计和详细分析
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              返回首页
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

