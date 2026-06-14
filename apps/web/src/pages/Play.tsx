import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { GameContainer } from '../game/GameContainer';
import { useGame } from '../hooks/useGame';
import { useWallet } from '../hooks/useWallet';

const EXPLORER_URL = 'https://celoscan.io/tx/';

const GAME_INFO: Record<string, { 
  name: string, 
  desc: string, 
  logo?: string,
  time: string,
  type: string,
  scores: { name: string, score: number }[]
}> = {
  'gas-gobbler': {
    name: 'Gas Gobbler',
    desc: 'Dodge barriers and gobble all gas orbs to advance! Points are saved directly to the Celo blockchain.',
    logo: '/gas_gobbler_logo.png',
    time: 'CLEANSING',
    type: 'ON-CHAIN',
    scores: [
      { name: 'CRYPTO_KING', score: 1540 },
      { name: 'MINI_PAY_MAV', score: 1200 },
      { name: 'GAS_GUZZLER', score: 1080 },
    ]
  },
  'mento-invaders': {
    name: 'Mento Invaders',
    desc: 'Defend the stablecoin pool from incoming anomalies. Classical space shooter survival mode.',
    time: 'SURVIVAL',
    type: 'ON-CHAIN',
    scores: [
      { name: 'MENTO_MONSTER', score: 5000 },
      { name: 'STABLE_PILOT', score: 4200 },
      { name: 'PEGGED_ONE', score: 3800 },
    ]
  },
  'block-breaker': {
    name: 'Block Breaker',
    desc: 'Break Celo blocks before time runs out. Multi-level arcade challenge.',
    time: '60s',
    type: 'ON-CHAIN',
    scores: [
      { name: 'BLOCK_BUSTER', score: 2500 },
      { name: 'PADDLE_PRO', score: 2100 },
      { name: 'BRICK_BOSS', score: 1800 },
    ]
  },
  'stable-sprint': {
    name: 'Stable Sprint',
    desc: 'Collect cUSD coins while dodging volatility traps. Endless runner speed test.',
    time: '45s',
    type: 'ON-CHAIN',
    scores: [
      { name: 'FLASH_RUNNER', score: 3200 },
      { name: 'COIN_COLLECTOR', score: 2800 },
      { name: 'CUSD_DASH', score: 2400 },
    ]
  }
};

export const Play: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
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
  } = useGame(gameId || 'gas-gobbler');

  if (!gameId || !GAME_INFO[gameId]) {
    return <Navigate to="/play/gas-gobbler" replace />;
  }

  const info = GAME_INFO[gameId];

  const handleClaimClick = () => {
    if (!isConnected) {
      connect();
    } else if (isWrongNetwork) {
      switchChain({ chainId: targetChain.id });
    } else {
      claimScore();
    }
  };

  const handlePlayClick = () => {
    if (!isConnected) {
      connect();
    } else {
      startGame();
    }
  };

  return (
    <div className="flex flex-col items-center py-6 px-4 w-full max-w-md mx-auto min-h-[calc(100vh-80px)] justify-center">
      {!isPlaying ? (
        <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">
          
          {/* Header */}
          <div className="text-center">
            <span className="tech-label opacity-40 mb-1.5 block tracking-widest">CELO ATARI ARCADE</span>
            <h1 className="pixel-title text-3xl sm:text-4xl text-glow-primary">{info.name}</h1>
          </div>

          {/* Logo / Splash */}
          <div className="glass-panel p-6 flex justify-center bg-black/50 shadow-inner relative overflow-hidden border-white/5">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            {info.logo ? (
              <img src={info.logo} alt={info.name} className="max-w-[160px] object-contain drop-shadow-[0_0_25px_rgba(0,240,255,0.4)]" />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center text-6xl opacity-60 filter drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]">
                {gameId === 'mento-invaders' ? '👾' : gameId === 'block-breaker' ? '🧱' : '🏃'}
              </div>
            )}
          </div>

          {/* Instructions Box */}
          <div className="relative pt-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-background px-4 z-10">
              <span className="font-arcade text-[7px] text-white/30 tracking-[0.3em]">HOW TO PLAY</span>
            </div>
            <div className="glass-panel p-5 pt-7 border-dashed border-2 border-white/10">
              <p className="tech-label text-white/95 leading-relaxed text-center mb-5 normal-case font-medium">
                {info.desc}
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center p-2.5 glass-panel bg-white/5 border-white/5">
                  <span className="tech-label opacity-40 text-[9px] mb-1">Mission</span>
                  <span className="font-arcade text-[9px] text-white/90">{info.time}</span>
                </div>
                <div className="flex flex-col items-center p-2.5 glass-panel bg-white/5 border-white/5">
                  <span className="tech-label opacity-40 text-[9px] mb-1">Score Type</span>
                  <span className="font-arcade text-[9px] text-success text-glow-success">{info.type}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results or High Scores */}
          {lastScore !== null ? (
            <div className="glass-panel p-5 border-primary/20 bg-primary/5 text-center shadow-lg">
              <span className="tech-label opacity-50 mb-1 block">LAST RUN SCORE</span>
              <div className="font-arcade text-5xl text-primary mb-5 drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                {lastScore}
              </div>

              {!isClaimed ? (
                <>
                  <button
                    onClick={handleClaimClick}
                    disabled={isClaiming}
                    className="arcade-btn w-full py-4 text-xs"
                    style={{ background: isWrongNetwork && isConnected ? 'var(--color-danger)' : 'var(--color-success)', color: '#000' }}
                  >
                    {isClaiming ? 'SAVING TO CELO...' : !isConnected ? 'CONNECT & SAVE' : isWrongNetwork ? 'SWITCH NETWORK' : 'SAVE SCORE ON-CHAIN'}
                  </button>
                  {claimError && (
                    <div className="mt-3 p-3 border border-danger/30 bg-danger/10 text-danger rounded-lg tech-label text-[10px] text-center leading-normal animate-pulse text-glow-danger">
                      ERROR: {claimError}
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-success/10 border border-success/30 rounded-lg p-4 shadow-sm">
                  <p className="text-success tech-label font-bold mb-1.5 text-glow-success">SCORE SECURED ON CELO</p>
                  {txHash && (
                    <a href={`${EXPLORER_URL}${txHash}`} target="_blank" rel="noopener noreferrer" className="tech-value underline text-[8px] hover:text-success transition-colors">
                      VIEW TRANSACTION ON EXPLORER →
                    </a>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-5 border-white/10">
              <h3 className="tech-label opacity-40 mb-3 text-center">CURRENT LEADERS</h3>
              <div className="space-y-2.5">
                {info.scores.map((s, i) => (
                  <div key={i} className="flex justify-between items-center font-mono text-xs border-b border-white/5 pb-1">
                    <span className="text-white/60">{i+1}. {s.name}</span>
                    <span className="text-success font-bold">{s.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button 
            onClick={handlePlayClick}
            disabled={isLoading || isClaiming}
            className="arcade-btn w-full py-4.5 text-xs group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform" />
            <span className="relative font-bold">
              {isLoading ? 'LOADING ENGINE...' : !isConnected ? 'CONNECT WALLET TO PLAY' : lastScore !== null ? 'PLAY AGAIN' : 'START GAME'}
            </span>
          </button>

        </div>
      ) : (
        <GameContainer onGameOver={onGameOver} seed={seed} />
      )}
    </div>
  );
};

