import { configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
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
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    hardhat,
    localhost,
    fhevmTestnet,
    sepolia,
    ...(import.meta.env.DEV ? [mainnet] : []),
  ],
  [publicProvider()]
)

// 配置连接器
const connectors = [
  new InjectedConnector({
    chains,
    options: {
      name: 'Injected',
      shimDisconnect: true,
    },
  }),
  new MetaMaskConnector({
    chains,
    options: {
      shimDisconnect: true,
    },
  }),
  new WalletConnectConnector({
    chains,
    options: {
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
      showQrModal: true,
    },
  }),
]

// 创建 Wagmi 配置
export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export { chains }
