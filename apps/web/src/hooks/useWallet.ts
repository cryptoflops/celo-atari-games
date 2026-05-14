import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { isMiniPay } from '../utils/minipay'
import { useEffect } from 'react'
import { celo, celoSepolia } from 'wagmi/chains'

const TARGET_CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 42220)
const targetChain = TARGET_CHAIN_ID === 11142220 ? celoSepolia : celo

export const useWallet = () => {
  const { address, isConnected, chainId } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const inMiniPay = isMiniPay()

  useEffect(() => {
    if (inMiniPay && !isConnected) {
      connect({ connector: injected() })
    }
  }, [inMiniPay, isConnected, connect])

  const handleConnect = () => {
    connect({ connector: injected() })
  }

  return {
    address,
    isConnected,
    chainId,
    isWrongNetwork: isConnected && chainId !== targetChain.id,
    targetChain,
    switchChain,
    isMiniPayWallet: inMiniPay,
    connect: handleConnect,
    disconnect,
  }
}
