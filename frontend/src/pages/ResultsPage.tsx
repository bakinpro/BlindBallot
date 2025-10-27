import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ArrowLeft, BarChart3, PieChart as PieChartIcon, Users, Clock, Trophy, Share2, Download } from 'lucide-react'
import { useVoteInfo, useVoteResults } from '../hooks/useVoteDetail'
import { useAccount } from 'wagmi'
import toast from 'react-hot-toast'

interface VoteResult {
  option: string
  votes: number
  percentage: number
  color: string
}

export default function ResultsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { address } = useAccount()
  const voteId = Number.isFinite(Number(id)) ? parseInt(id as string, 10) : 0
  
  const { data: voteInfo, isLoading: loadingVoteInfo, error: voteInfoError } = useVoteInfo(voteId)
  const { data: results, isLoading: loadingResults } = useVoteResults(voteId)
  
  const [viewType, setViewType] = useState<'bar' | 'pie'>('bar')

  // 解析真实的投票数据
  const voteData = useMemo(() => {
    if (!voteInfo) return null
    
    const [title, description, options, deadline, totalVoters, contractIsActive, isRevealed, creator] = voteInfo as [
      string, string, string[], bigint, bigint, boolean, boolean, string
    ]
    
    const deadlineNum = Number(deadline)
    const totalVotersNum = Number(totalVoters)
    
    return {
      title,
      description,
      options,
      creator: creator.slice(0, 6) + '...' + creator.slice(-4),
      deadline: deadlineNum,
      totalVotes: totalVotersNum,
      isActive: contractIsActive,
      isRevealed,
      endTime: deadlineNum * 1000
    }
  }, [voteInfo])

  // 解析投票结果数据
  const voteResults = useMemo(() => {
    if (!voteData?.options || voteData.options.length === 0) {
      return []
    }
    
    if (!results || !voteData.isRevealed) {
      // 如果没有结果或未解密，显示占位数据
      return voteData.options.map((option, index) => ({
        option,
        votes: 0,
        percentage: 0,
        color: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'][index % 6]
      }))
    }
    
    try {
      // 解析真实结果
      const resultCounts = Array.isArray(results) ? results : []
      const totalVotes = resultCounts.reduce((sum, count) => sum + Number(count || 0), 0)
      
      return voteData.options.map((option, index) => {
        const votes = Number(resultCounts[index] || 0)
        const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
        return {
          option: option || `选项 ${index + 1}`,
          votes,
          percentage,
          color: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'][index % 6]
        }
      })
    } catch (error) {
      console.error('解析投票结果时出错:', error)
      // 出错时返回占位数据
      return voteData.options.map((option, index) => ({
        option: option || `选项 ${index + 1}`,
        votes: 0,
        percentage: 0,
        color: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'][index % 6]
      }))
    }
  }, [voteData, results])

  // 获胜选项
  const winningOption = useMemo(() => {
    if (voteResults.length === 0) return null
    return voteResults.reduce((max, current) => current.votes > max.votes ? current : max, voteResults[0])
  }, [voteResults])


  // 分享结果
  const handleShare = async () => {
    if (!voteData) return
    
    try {
      await navigator.share({
        title: `投票结果: ${voteData.title}`,
        text: `查看投票"${voteData.title}"的结果`,
        url: window.location.href,
      })
    } catch (error) {
      // 如果不支持原生分享，复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板！')
    }
  }

  // 导出结果
  const handleExport = () => {
    if (!voteData) return
    const dataStr = JSON.stringify({
      vote: voteData,
      results: voteResults,
      exportTime: new Date().toISOString()
    }, null, 2)
    
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `vote_results_${voteId}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // 加载状态
  if (loadingVoteInfo || loadingResults) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">正在加载结果...</p>
          </div>
        </div>
      </div>
    )
  }

  // 基础容错：无数据或解析失败时给出提示
  if (!voteData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border p-8 text-center">
          <p className="text-gray-700">未找到该投票信息，或合约返回为空。</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          返回上一页
        </button>

        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">投票结果</h1>
          <p className="text-gray-600">基于区块链的匿名投票统计结果</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 投票信息卡片 */}
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {voteData.title}
                  </h2>
                  <p className="text-gray-600">
                    {voteData.description}
                  </p>
                </div>
                <div className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  已结束
                </div>
              </div>

              {/* 开发模式调试信息 */}
              {import.meta.env.DEV && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">🔧 调试信息</h4>
                  <div className="text-xs text-blue-800 space-y-1">
                    <div>投票数据: {voteData ? '✅ 已加载' : '❌ 未加载'}</div>
                    <div>结果数据: {results ? '✅ 已加载' : '❌ 未加载'}</div>
                    <div>投票结果数组长度: {voteResults.length}</div>
                    <div>是否已解密: {voteData?.isRevealed ? '✅' : '❌'}</div>
                    <div>创建者地址: {voteData?.creator}</div>
                    <div>投票总参与人数: {voteData?.totalVotes}</div>
                  </div>
                </div>
              )}


              {/* 统计概览 */}
              <div className="grid grid-cols-4 gap-4 p-6 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {voteResults.reduce((sum, result) => sum + result.votes, 0)}
                  </div>
                  <div className="text-sm text-gray-600">总票数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {voteResults.length}
                  </div>
                  <div className="text-sm text-gray-600">选项数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {winningOption?.percentage || 0}%
                  </div>
                  <div className="text-sm text-gray-600">最高得票</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    1小时前
                  </div>
                  <div className="text-sm text-gray-600">结束时间</div>
                </div>
              </div>
            </div>

            {/* 结果可视化 */}
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">结果统计</h3>
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewType('bar')}
                    className={`flex items-center px-3 py-1 rounded text-sm font-medium transition-colors ${
                      viewType === 'bar' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    柱状图
                  </button>
                  <button
                    onClick={() => setViewType('pie')}
                    className={`flex items-center px-3 py-1 rounded text-sm font-medium transition-colors ${
                      viewType === 'pie' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <PieChartIcon className="w-4 h-4 mr-1" />
                    饼状图
                  </button>
                </div>
              </div>

              {/* 图表容器 */}
              <div className="h-80">
                {voteResults.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">暂无投票数据</p>
                  </div>
                ) : viewType === 'bar' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={voteResults} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="option" 
                        tick={{ fontSize: 12 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value, name, props) => [`${value} 票 (${props.payload.percentage}%)`, '得票数']}
                      />
                      <Bar dataKey="votes" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                        {voteResults.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={voteResults}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ option, percentage }) => `${option}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="votes"
                      >
                        {voteResults.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [`${value} 票 (${props.payload.percentage}%)`, '得票数']} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* 详细结果列表 */}
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">详细结果</h3>
              <div className="space-y-4">
                {voteResults
                  .sort((a, b) => b.votes - a.votes)
                  .map((result, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {index === 0 && (
                          <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                        )}
                        <span className="font-medium text-gray-900">
                          {result.option}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold text-gray-900">
                          {result.votes}
                        </span>
                        <span className="text-lg font-semibold" style={{ color: result.color }}>
                          {result.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${result.percentage}%`,
                          backgroundColor: result.color
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* 获胜选项 */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-center mb-3">
                  <Trophy className="w-6 h-6 text-yellow-600 mr-2" />
                  <h3 className="text-lg font-semibold text-yellow-900">获胜选项</h3>
                </div>
                <p className="text-xl font-bold text-yellow-800 mb-2">
                  {winningOption?.option || '暂无获胜选项'}
                </p>
                <p className="text-yellow-700">
                  获得 {winningOption?.votes || 0} 票 ({winningOption?.percentage || 0}%)
                </p>
              </div>

              {/* 投票信息 */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">投票信息</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">创建者</span>
                    <span className="text-gray-900 font-mono text-xs">
                      {voteData.creator}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">总参与人数</span>
                    <span className="text-gray-900 font-medium">
                      {voteResults.reduce((sum, result) => sum + result.votes, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">结束时间</span>
                    <span className="text-gray-900">
                      {new Date(voteData.endTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">状态</span>
                    <span className="text-red-600 font-medium">已结束</span>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">操作</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    分享结果
                  </button>
                  <button
                    onClick={handleExport}
                    className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    导出数据
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    返回首页
                  </button>
                </div>
              </div>

              {/* 技术信息 */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">技术保障</h3>
                <ul className="text-blue-800 text-sm space-y-2">
                  <li>• ✅ 基于区块链的不可篡改记录</li>
                  <li>• ✅ FHEVM同态加密保护隐私</li>
                  <li>• ✅ 智能合约自动统计结果</li>
                  <li>• ✅ 全程透明可验证过程</li>
                </ul>
              </div>

              {/* 结果说明 */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">结果说明</h3>
                <ul className="text-gray-700 text-sm space-y-2">
                  <li>• 所有投票均为匿名，无法追踪</li>
                  <li>• 结果基于智能合约自动计算</li>
                  <li>• 数据永久保存在区块链上</li>
                  <li>• 任何人都可以验证结果真实性</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}