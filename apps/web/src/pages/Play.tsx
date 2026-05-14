import React from 'react';
import { GameContainer } from '../game/GameContainer';
import { useGame } from '../hooks/useGame';
import { useWallet } from '../hooks/useWallet';

const EXPLORER_URL = 'https://celoscan.io/tx/';

export const Play: React.FC = () => {
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
        <div className="cartridge w-full max-w-lg mx-auto">
          <div className="cartridge-strip" />
          <div className="p-6 sm:p-10 text-center">
            <h2 className="pixel-subtitle mb-4">
              {lastScore !== null ? 'Great Run!' : 'Ready to Gobble?'}
            </h2>
            
            {lastScore !== null && (
              <div className="mb-8 border-y border-[#2d2440] py-6">
                <p className="text-xs text-sand font-mono mb-2 uppercase tracking-[0.2em]">
                  You Scored
                </p>
                <div
                  className="font-arcade text-4xl sm:text-5xl text-primary mb-6"
                  style={{ 
                    textShadow: '4px 4px 0 #476520',
                    fontSmooth: 'never',
                    WebkitFontSmoothing: 'none'
                  }}
                >
                  {lastScore}
                </div>

                {/* Claim Score Button */}
                {!isClaimed && (
                  <button
                    onClick={handleClaimClick}
                    disabled={isClaiming}
                    className="arcade-btn w-full text-xs py-4 mb-4"
                    style={
                      isWrongNetwork && isConnected
                        ? { background: '#3a0a18', color: '#F72585', borderColor: '#F7258544', boxShadow: '0 6px 0 #1a0510' }
                        : { background: '#142010', color: '#56DF7C', borderColor: '#56DF7C44', boxShadow: '0 6px 0 #0a1008' }
                    }
                  >
                    {isClaiming ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2 inline" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        CLAIMING...
                      </>
                    ) : !isConnected ? (
                      '🔗 CONNECT & CLAIM'
                    ) : isWrongNetwork ? (
                      `⚠️ SWITCH TO ${targetChain.name}`
                    ) : (
                      '⛓️ CLAIM SCORE'
                    )}
                  </button>
                )}

                {/* Claim Error */}
                {claimError && (
                  <div className="bg-[#1a0510] border border-danger/30 rounded px-4 py-3 mt-4 max-w-xs mx-auto">
                    <p className="text-danger text-[10px] font-mono uppercase">{claimError}</p>
                    <button 
                      onClick={claimScore}
                      className="text-sand underline text-[10px] mt-2 hover:text-primary font-mono uppercase"
                    >
                      Try again
                    </button>
                  </div>
                )}

                {/* Success State */}
                {isClaimed && txHash && (
                  <div className="bg-[#0a1a0d] border border-success/30 rounded px-4 py-3 mt-4 max-w-xs mx-auto">
                    <p className="text-success text-[10px] font-mono font-bold uppercase mb-1">✓ Score claimed!</p>
                    <a
                      href={`${EXPLORER_URL}${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sand underline text-[10px] hover:text-primary break-all font-mono"
                    >
                      View on CeloScan →
                    </a>
                  </div>
                )}
              </div>
            )}

            <button 
              onClick={startGame}
              disabled={isLoading || isClaiming}
              className="arcade-btn w-full text-sm py-4 disabled:opacity-50"
            >
              {isLoading ? 'STARTING...' : lastScore !== null ? 'PLAY AGAIN' : 'START GAME'}
            </button>
          </div>
        </div>
      ) : (
        <GameContainer onGameOver={onGameOver} seed={seed} />
      )}
    </div>
  );
};
