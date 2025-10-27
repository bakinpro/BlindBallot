import { useNetwork, useSwitchNetwork } from 'wagmi'
import { AlertTriangle, CheckCircle, Wifi } from 'lucide-react'

const EXPECTED_NETWORKS = [
  { id: 31337, name: 'Localhost 8545', description: '本地开发网络' },
  { id: 8009, name: 'FHEVM Testnet', description: 'FHEVM 测试网络' },
  { id: 11155111, name: 'Sepolia', description: 'Sepolia 测试网络' }
]

export default function NetworkChecker() {
  const { chain, chains } = useNetwork()
  const { switchNetwork, isLoading: isSwitching } = useSwitchNetwork()

  if (!chain) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <Wifi className="w-5 h-5 text-yellow-600 mr-2" />
          <div>
            <h3 className="font-medium text-yellow-800">网络未连接</h3>
            <p className="text-sm text-yellow-700">请在钱包中选择一个网络</p>
          </div>
        </div>
      </div>
    )
  }

  const isExpectedNetwork = EXPECTED_NETWORKS.some(network => network.id === chain.id)

  if (isExpectedNetwork) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          <div>
            <h3 className="font-medium text-green-800">网络连接正常</h3>
            <p className="text-sm text-green-700">
              当前网络: {chain.name} (ID: {chain.id})
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-red-800 mb-2">网络不匹配</h3>
          <p className="text-sm text-red-700 mb-4">
            当前连接到: <strong>{chain.name} (ID: {chain.id})</strong>
            <br />
            此应用需要连接到支持的网络才能正常工作。
          </p>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-red-800">建议切换到以下网络之一：</p>
            <div className="grid gap-2">
              {EXPECTED_NETWORKS.map((network) => {
                const isAvailable = chains.some(c => c.id === network.id)
                return (
                  <div key={network.id} className="flex items-center justify-between bg-red-100 rounded p-3">
                    <div>
                      <div className="font-medium text-red-800">{network.name}</div>
                      <div className="text-xs text-red-600">
                        链ID: {network.id} - {network.description}
                      </div>
                    </div>
                    {isAvailable && switchNetwork && (
                      <button
                        onClick={() => switchNetwork(network.id)}
                        disabled={isSwitching}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSwitching ? '切换中...' : '切换'}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {!switchNetwork && (
            <div className="mt-4 p-3 bg-red-100 rounded text-sm text-red-800">
              <strong>手动切换网络:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>打开 MetaMask 钱包</li>
                <li>点击网络下拉菜单</li>
                <li>选择 "Localhost 8545" 或添加自定义网络</li>
                <li>刷新页面</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 简化版本的网络检查器
export function SimpleNetworkChecker() {
  const { chain } = useNetwork()
  
  if (!chain) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 text-sm">
        <p className="text-yellow-700">⚠️ 未连接到任何网络</p>
      </div>
    )
  }

  const isLocalNetwork = chain.id === 31337
  
  return (
    <div className={`border-l-4 p-3 text-sm ${
      isLocalNetwork 
        ? 'bg-green-100 border-green-500' 
        : 'bg-yellow-100 border-yellow-500'
    }`}>
      <p className={isLocalNetwork ? 'text-green-700' : 'text-yellow-700'}>
        {isLocalNetwork ? '✅' : '⚠️'} 当前网络: {chain.name} (ID: {chain.id})
      </p>
      {!isLocalNetwork && (
        <p className="text-xs text-yellow-600 mt-1">
          建议切换到 Localhost 8545 (ID: 31337) 以获得最佳体验
        </p>
      )}
    </div>
  )
}

