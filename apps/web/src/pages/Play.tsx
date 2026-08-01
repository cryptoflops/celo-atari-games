import type { FC } from 'react';
import { GameContainer } from '../game/GameContainer';
import { useGame } from '../hooks/useGame';
import { useWallet } from '../hooks/useWallet';
import { Panel } from '../components/Card';
import { Button } from '../components/Button';

const EXPLORER_URL = 'https://celoscan.io/tx/';

export const Play: FC = () => {
  const { isConnected, isWrongNetwork, targetChain, switchChain, connect } = useWallet();
  const {
    isPlaying,
    isLoading,
    isClaiming,
    isClaimed,
    claimError,
    txHash,
    lastScore,
    seed,
    startGame,
    onGameOver,
    claimScore
  } = useGame();

  const handleClaimClick = () => {
    if (!isConnected) {
      connect();
    } else if (isWrongNetwork) {
      switchChain({ chainId: targetChain.id });
    } else {
      claimScore();
    }
  };

  return (
    <div className="flex flex-col items-center py-8 px-4 w-full">
      {!isPlaying ? (
        <Panel variant="featured" className="w-full max-w-lg mx-auto text-center">
          {/* sub header strip */}
          <div className="sega-marquee mb-6">
            <span className="font-arcade text-secondary" style={{ fontSize: '21px', textShadow: '2px 2px 0 var(--color-ink)' }}>
              {lastScore !== null ? 'RUN COMPLETE' : 'GAS GOBBLER'}
            </span>
          </div>

          <h2 className="pixel-subtitle mb-4" style={{ fontSize: '27px' }}>
            {lastScore !== null ? 'Great run' : 'Ready to gobble?'}
          </h2>

          {lastScore !== null && (
            <div className="mb-8 border-y-2 border-border py-6">
              <p className="tech-label text-white/45 mb-2" style={{ fontSize: '13px' }}>
                You scored
              </p>
              <div
                className="font-arcade text-secondary mb-6"
                style={{
                  fontSize: '48px',
                  textShadow: '4px 4px 0 var(--color-ink), 0 0 16px rgba(255, 218, 20, 0.2)',
                  lineHeight: 1,
                }}
              >
                {lastScore.toLocaleString()}
              </div>

              {/* Claim Score Button */}
              {!isClaimed && (
                <Button
                  onClick={handleClaimClick}
                  loading={isClaiming}
                  disabled={isClaiming}
                  variant={
                    isWrongNetwork && isConnected
                      ? 'destructive'
                      : 'accent'
                  }
                  fullWidth
                  className="text-sm py-4 mb-4"
                  style={
                    isWrongNetwork && isConnected
                      ? undefined
                      : { background: '#0c1f12', color: 'var(--color-success)', borderColor: 'var(--color-success)', boxShadow: '6px 6px 0 #0a1008' }
                  }
                >
                  {!isConnected
                    ? 'Connect & claim'
                    : isWrongNetwork
                      ? `Switch to ${targetChain.name}`
                      : 'Claim score'}
                </Button>
              )}

              {/* Claim Error */}
              {claimError && (
                <div className="sega-panel sega-panel-locked mt-4 max-w-xs mx-auto text-left" role="alert">
                  <p className="tech-label text-danger font-bold mb-1" style={{ fontSize: '13px' }}>
                    ✕ Score claim failed
                  </p>
                  <p className="text-white/75 mb-3" style={{ fontSize: '15px', lineHeight: 1.35 }}>
                    {claimError}
                  </p>
                  <button
                    onClick={claimScore}
                    className="arcade-btn arcade-btn-tertiary"
                    style={{ fontSize: '13px' }}
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Success State */}
              {isClaimed && txHash && (
                <div className="sega-panel mt-4 max-w-xs mx-auto text-left" style={{ background: '#0a1a0d', borderColor: 'var(--color-success)', boxShadow: '4px 4px 0 #08140a' }}>
                  <p className="tech-label text-success font-bold mb-1" style={{ fontSize: '13px' }}>
                    ✓ Score claimed
                  </p>
                  <a
                    href={`${EXPLORER_URL}${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tech-value text-cream hover:text-secondary underline break-all"
                    style={{ fontSize: '13px' }}
                  >
                    View on CeloScan →
                  </a>
                </div>
              )}
            </div>
          )}

          <Button
            onClick={startGame}
            loading={isLoading}
            disabled={isLoading || isClaiming}
            variant="primary"
            fullWidth
            className="text-lg py-4"
          >
            {lastScore !== null ? 'Play again' : 'Start game'}
          </Button>
        </Panel>
      ) : (
        <GameContainer onGameOver={onGameOver} seed={seed} />
      )}
    </div>
  );
};
