import { createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
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

export const config = createConfig({
  autoConnect: true,
  chains,
  publicClient,
  webSocketPublicClient,
})

export { chains }
