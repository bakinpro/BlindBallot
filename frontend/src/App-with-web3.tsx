import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { useState, useEffect } from 'react'

// Components
import Navbar from './components/Navbar'
import NavbarSimple from './components/NavbarSimple'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'

// Pages
import HomePage from './pages/HomePage'
import HomePageSimple from './pages/HomePageSimple'
import CreateVotePage from './pages/CreateVotePage'
import VoteDetailPage from './pages/VoteDetailPage'
import VoteListPageReal from './pages/VoteListPageReal'
import ResultsPage from './pages/ResultsPage'
import ResultsIndexPage from './pages/ResultsIndexPage'
import DemoVotePage from './pages/DemoVotePage'
import NotFoundPage from './pages/NotFoundPage'

// Hooks
import { useContractConfig } from './hooks/useContractConfig'

function App() {
  const [useSimpleMode, setUseSimpleMode] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // 尝试使用Web3功能，如果失败则降级到简单模式
  useEffect(() => {
    try {
      // 检查合约配置是否可用
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
      if (!contractAddress || contractAddress === 'your-contract-address-here') {
        console.warn('⚠️ 合约地址未配置，使用简单模式')
        setUseSimpleMode(true)
      }
      
      setInitialized(true)
    } catch (error) {
      console.error('Web3初始化失败，降级到简单模式:', error)
      setUseSimpleMode(true)
      setInitialized(true)
    }
  }, [])

  // Web3组件包装器，带错误处理
  function Web3ComponentWrapper({ children }: { children: React.ReactNode }) {
    const [hasError, setHasError] = useState(false)
    
    try {
      const { isConnected } = useAccount()
      const { isConfigured } = useContractConfig()
      
      return <>{children}</>
    } catch (error) {
      console.error('Web3组件错误:', error)
      if (!hasError) {
        setHasError(true)
        // 自动切换到简单模式
        setTimeout(() => setUseSimpleMode(true), 100)
      }
      
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
          <p className="text-yellow-800">
            ⚠️ Web3功能暂时不可用，已自动切换到简单模式
          </p>
        </div>
      )
    }
  }

  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">正在初始化应用...</p>
        </div>
      </div>
    )
  }

  // 简单模式 - 不使用Web3功能
  if (useSimpleMode) {
    return (
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <NavbarSimple />
            
            {/* 显示模式提示 */}
            <div className="bg-blue-50 border-b border-blue-200 py-2">
              <div className="container mx-auto px-4">
                <p className="text-blue-800 text-sm text-center">
                  🔧 当前运行在简单模式下
                  <button
                    onClick={() => setUseSimpleMode(false)}
                    className="ml-2 underline hover:no-underline"
                  >
                    尝试启用Web3功能
                  </button>
                </p>
              </div>
            </div>
            
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePageSimple />} />
                <Route path="/create" element={<CreateVotePage />} />
                <Route path="/votes" element={<VoteListPageReal />} />
                <Route path="/vote/:id" element={<VoteDetailPage />} />
                <Route path="/results" element={<ResultsIndexPage />} />
                <Route path="/results/:id" element={<ResultsPage />} />
                <Route path="/demo" element={<DemoVotePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </ErrorBoundary>
    )
  }

  // 完整模式 - 使用Web3功能
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Web3ComponentWrapper>
            <Navbar />
          </Web3ComponentWrapper>
          
          {/* Web3功能提示 */}
          <div className="bg-green-50 border-b border-green-200 py-2">
            <div className="container mx-auto px-4">
              <p className="text-green-800 text-sm text-center">
                🚀 Web3功能已启用
                <button
                  onClick={() => setUseSimpleMode(true)}
                  className="ml-2 underline hover:no-underline"
                >
                  切换到简单模式
                </button>
              </p>
            </div>
          </div>
          
          <main className="flex-1">
            <Web3ComponentWrapper>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreateVotePage />} />
              <Route path="/votes" element={<VoteListPageReal />} />
              <Route path="/vote/:id" element={<VoteDetailPage />} />
              <Route path="/results" element={<ResultsIndexPage />} />
              <Route path="/results/:id" element={<ResultsPage />} />
              <Route path="/demo" element={<DemoVotePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            </Web3ComponentWrapper>
          </main>

          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
