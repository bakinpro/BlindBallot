import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Components
import Navbar from './components/NavbarSimple'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'

// Pages
import HomePage from './pages/HomePageSimple'
import CreateVotePage from './pages/CreateVotePage'
import VoteDetailPage from './pages/VoteDetailPage'
import ResultsPage from './pages/ResultsPage'
import ResultsIndexPage from './pages/ResultsIndexPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  // 暂时简化，移除可能导致问题的hooks
  // const { isConnected } = useAccount()
  // const { isConfigured } = useContractConfig()

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreateVotePage />} />
              <Route path="/vote/:id" element={<VoteDetailPage />} />
              <Route path="/results" element={<ResultsIndexPage />} />
              <Route path="/results/:id" element={<ResultsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
