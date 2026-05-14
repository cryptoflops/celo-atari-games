import { http, createConfig } from 'wagmi'
import { celo, celoSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

const chainId = Number(import.meta.env.VITE_CHAIN_ID || 42220)
const chain = chainId === 11142220 ? celoSepolia : celo

export const config = createConfig({
  chains: [chain],
  connectors: [injected()],
  transports: {
    [celo.id]: http(),
    [celoSepolia.id]: http(),
  },
})
