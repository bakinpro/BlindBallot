import { configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { 
  mainnet,
  sepolia,
  hardhat,
  localhost,
} from 'wagmi/chains'

// FHEVM Testnet 链配置
export const fhevmTestnet = {
  id: 8009,
  name: 'FHEVM Testnet',
  network: 'fhevm-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'ZAMA',
    symbol: 'ZAMA',
  },
  rpcUrls: {
    public: { http: ['https://devnet.zama.ai'] },
    default: { http: ['https://devnet.zama.ai'] },
  },
  blockExplorers: {
    default: { name: 'FHEVM Explorer', url: 'https://explorer.devnet.zama.ai' },
  },
  testnet: true,
} as const

// 配置链
// 自定义Sepolia链配置，使用多个RPC端点
const customSepolia = {
  ...sepolia,
  rpcUrls: {
    ...sepolia.rpcUrls,
    default: { 
      http: [
        'https://sepolia.drpc.org',
        'https://ethereum-sepolia.blockpi.network/v1/rpc/public',
        'https://rpc.sepolia.org'
      ] 
    },
    public: { 
      http: [
        'https://sepolia.drpc.org',
        'https://ethereum-sepolia.blockpi.network/v1/rpc/public',
        'https://rpc.sepolia.org'
      ] 
    },
  }
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    customSepolia, // 使用自定义Sepolia配置
    hardhat,
    localhost,
    fhevmTestnet,
    ...(import.meta.env.DEV ? [mainnet] : []),
  ],
  [
    publicProvider()
  ]
)

// 获取默认钱包连接器
const { connectors } = getDefaultWallets({
  appName: 'AnonVote',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  chains,
})

// 创建 Wagmi 配置
export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export { chains }
