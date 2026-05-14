import React from 'react';
import { useWallet } from '../hooks/useWallet';

export const WalletStatus: React.FC = () => {
  const { address, isConnected, isMiniPayWallet, connect, disconnect } = useWallet();

  // Trust signals as hardware display chips
  const renderTrustSignals = () => (
    <div className="hidden lg:flex items-center gap-2 mr-3">
      <div className="hw-chip flex items-center gap-1.5">
        <span className="status-light status-light-live" />
        <span>Celo</span>
      </div>
      <div className="hw-chip">
        Gas ~$0.001
      </div>
      <div className="hw-chip">
        On-chain
      </div>
    </div>
  );

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        {renderTrustSignals()}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#120b1a] border border-[#2d2440]"
          style={{ boxShadow: 'inset 0 0 12px rgba(71,101,32,0.06)' }}
        >
          {isMiniPayWallet ? (
            <span className="text-[10px] font-mono font-bold text-[#111] bg-primary px-2 py-0.5 rounded-sm uppercase tracking-wider">
              MP
            </span>
          ) : (
            <span className="text-[10px]">🦊</span>
          )}
          <span className="text-xs font-mono text-sand font-bold">
            {address.slice(0, 6)}..{address.slice(-4)}
          </span>
          {!isMiniPayWallet && (
            <button 
              onClick={() => disconnect()}
              className="text-[10px] text-danger hover:text-cream transition-colors ml-1 uppercase tracking-wider font-mono"
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
      {renderTrustSignals()}
      {!isMiniPayWallet && (
        <button
          onClick={connect}
          className="arcade-btn text-xs py-2 px-4"
          style={{ fontSize: '11px' }}
        >
          Connect
        </button>
      )}
    </div>
  );
};
