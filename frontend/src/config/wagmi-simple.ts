import { configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { sepolia } from 'wagmi/chains'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'

// 简化的Sepolia配置，使用最稳定的RPC
const simpleSepolia = {
  ...sepolia,
  rpcUrls: {
    default: { http: ['https://sepolia.drpc.org'] },
    public: { http: ['https://sepolia.drpc.org'] },
  }
}

const { chains, publicClient } = configureChains(
  [simpleSepolia],
  [
    publicProvider({
      stallTimeout: 20000, // 20秒超时
    })
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'AnonVote FHEVM',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  chains,
})

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

export { chains }

