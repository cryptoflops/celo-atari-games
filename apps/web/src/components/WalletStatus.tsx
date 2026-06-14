import React from 'react';
import { useWallet } from '../hooks/useWallet';

export const WalletStatus: React.FC = () => {
  const { address, isConnected, isMiniPayWallet, connect, disconnect } = useWallet();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel border border-white/10">
          {isMiniPayWallet ? (
            <span className="text-[9px] font-arcade bg-primary text-on-primary px-1.5 py-0.5 rounded-sm">
              MP
            </span>
          ) : (
            <span className="text-[10px]">🦊</span>
          )}
          <span className="tech-label text-white/90">
            {address.slice(0, 6)}..{address.slice(-4)}
          </span>
          {!isMiniPayWallet && (
            <button 
              onClick={() => disconnect()}
              className="text-white/30 hover:text-danger transition-colors ml-1 text-xs"
            >
              ×
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {!isMiniPayWallet && (
        <button
          onClick={connect}
          className="arcade-btn text-[10px] py-2 px-6"
        >
          Connect
        </button>
      )}
    </div>
  );
};

