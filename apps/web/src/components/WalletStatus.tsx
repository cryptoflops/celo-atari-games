import type { FC } from 'react';
import { useWallet } from '../hooks/useWallet';
import { StatusLight } from './StatusLight';

/**
 * Wallet status control for the Sega HUD strip. Shows an explicit short label
 * for wallet state (MINIPAY / INJECTED / NOT CONNECTED) so the indicator never
 * relies on an emoji or color alone. Connect/disconnect uses the arcade button.
 */
export const WalletStatus: FC = () => {
  const { address, isConnected, isMiniPayWallet, connect, disconnect } = useWallet();

  if (isConnected && address) {
    const label = isMiniPayWallet ? 'MINIPAY' : 'INJECTED';
    return (
      <div
        className="hw-chip flex items-center gap-2"
        role="status"
        aria-label={`Wallet connected via ${label}`}
      >
        <StatusLight kind="live" label={label} hideLabel />
        <span className="text-cream" style={{ fontSize: '13px' }}>
          {address.slice(0, 6)}..{address.slice(-4)}
        </span>
        {!isMiniPayWallet && (
          <button
            type="button"
            onClick={() => disconnect()}
            aria-label="Disconnect wallet"
            className="text-danger hover:text-cream transition-colors"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 'bold' }}
          >
            ×
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className="tech-label text-white/45 hidden sm:inline"
        style={{ fontSize: '13px' }}
        aria-label="Wallet not connected"
      >
        WALLET:
        <span className="text-cream ml-1.5">NOT&nbsp;CONNECTED</span>
      </span>
      {!isMiniPayWallet && (
        <button
          type="button"
          onClick={connect}
          className="arcade-btn"
          style={{ fontSize: '13px', padding: '6px 14px', minHeight: '32px' }}
        >
          Connect
        </button>
      )}
    </div>
  );
};
