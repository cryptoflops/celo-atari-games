import React from 'react';
import { Link } from 'react-router-dom';

/* ── Tiny CSS pixel-art previews ───────────────────── */

const GasGobblerPreview: React.FC = () => (
  <div className="game-preview">
    {/* Player */}
    <div className="pixel" style={{ left: '44%', top: '46%', width: 14, height: 14, background: '#FCFF52', boxShadow: '14px 0 0 #FCFF52, 0 14px 0 #FCFF52' }} />
    {/* Gas orbs */}
    <div className="pixel" style={{ left: '18%', top: '28%', width: 10, height: 10, background: '#56DF7C' }} />
    <div className="pixel" style={{ left: '72%', top: '58%', width: 10, height: 10, background: '#56DF7C' }} />
    <div className="pixel" style={{ left: '55%', top: '18%', width: 10, height: 10, background: '#56DF7C' }} />
    {/* Danger blocks */}
    <div className="pixel bg-danger" style={{ left: '30%', top: '68%', width: 12, height: 12 }} />
    <div className="pixel bg-danger" style={{ left: '80%', top: '30%', width: 12, height: 12 }} />
  </div>
);

const BlockBreakerPreview: React.FC = () => (
  <div className="game-preview">
    {/* Brick row 1 */}
    {[10, 25, 40, 55, 70, 85].map((l, i) => (
      <div key={`r1-${i}`} className="pixel" style={{ left: `${l}%`, top: '12%', width: 18, height: 8, background: i % 2 === 0 ? '#FCFF52' : '#7CC0FF', borderRadius: 1 }} />
    ))}
    {/* Brick row 2 */}
    {[15, 30, 45, 60, 75].map((l, i) => (
      <div key={`r2-${i}`} className="pixel" style={{ left: `${l}%`, top: '26%', width: 18, height: 8, background: i % 2 === 0 ? '#56DF7C' : '#FCFF52', borderRadius: 1 }} />
    ))}
    {/* Ball */}
    <div className="pixel" style={{ left: '48%', top: '58%', width: 8, height: 8, background: '#FCF6F1', borderRadius: '50%' }} />
    {/* Paddle */}
    <div className="pixel" style={{ left: '36%', top: '82%', width: 40, height: 8, background: '#FCFF52', borderRadius: 2 }} />
  </div>
);

const StableSprintPreview: React.FC = () => (
  <div className="game-preview">
    {/* Lanes */}
    <div className="absolute inset-x-0 top-[33%] h-px bg-white/10" />
    <div className="absolute inset-x-0 top-[66%] h-px bg-white/10" />
    {/* Runner */}
    <div className="pixel" style={{ left: '20%', top: '44%', width: 12, height: 16, background: '#FCFF52' }} />
    {/* Coins (cUSD) */}
    <div className="pixel" style={{ left: '50%', top: '20%', width: 10, height: 10, background: '#56DF7C', borderRadius: '50%' }} />
    <div className="pixel" style={{ left: '70%', top: '50%', width: 10, height: 10, background: '#56DF7C', borderRadius: '50%' }} />
    {/* Traps */}
    <div className="pixel bg-danger" style={{ left: '60%', top: '70%', width: 14, height: 14 }} />
  </div>
);

const MentoInvadersPreview: React.FC = () => (
  <div className="game-preview">
    {/* Invader row */}
    {[20, 35, 50, 65, 80].map((l, i) => (
      <div key={`inv-${i}`} className="pixel" style={{
        left: `${l}%`, top: '18%', width: 12, height: 10,
        background: i % 2 === 0 ? '#7CC0FF' : '#B490FF',
        boxShadow: '-4px 4px 0 currentColor, 4px 4px 0 currentColor',
      }} />
    ))}
    {/* Player ship */}
    <div className="pixel" style={{ left: '46%', top: '78%', width: 16, height: 10, background: '#FCFF52', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
    {/* Bullet */}
    <div className="pixel" style={{ left: '49%', top: '55%', width: 4, height: 12, background: '#56DF7C' }} />
  </div>
);

/* ── Home Page ─────────────────────────────────────── */

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-2">
      {/* Hero Section — cabinet marquee */}
      <div className="relative mb-8 mt-8">
        <h1 className="pixel-title relative z-10">
          CELO ATARI<br className="sm:hidden" /> GAMES
        </h1>
      </div>
      
      <p className="text-sm sm:text-base text-sand mb-10 max-w-xl font-mono leading-relaxed">
        4 retro mini-games for MiniPay.<br/>
        Play fast rounds, save scores on Celo, climb the leaderboard.
      </p>
      
      {/* CTAs — Prosperity Yellow primary, Forest secondary */}
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md mx-auto mb-16">
        <Link to="/play" className="arcade-btn flex-1 text-sm">
          PLAY NOW
        </Link>
        <Link to="/leaderboard" className="arcade-btn arcade-btn-secondary flex-1 text-sm">
          LEADERBOARD
        </Link>
      </div>
      
      {/* Games Selection — machine label */}
      <div className="w-full max-w-4xl mx-auto mb-20 text-left">
        <div className="mb-6">
          <span className="machine-label">Games Selection</span>
          <div className="pixel-divider mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Game 1: Gas Gobbler — LIVE, yellow frame */}
          <div className="cartridge">
            <div className="cartridge-strip" />
            <div className="p-5">
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-[10px] text-[#655947] tracking-widest">GAME-01</span>
                <div className="flex items-center gap-2">
                  <span className="status-light status-light-live" />
                  <span className="font-mono text-[10px] text-success uppercase tracking-widest font-bold">Live</span>
                </div>
              </div>
              <h3 className="font-arcade text-sm text-cream mb-2">Gas Gobbler</h3>
              <GasGobblerPreview />
              <p className="text-sand text-xs mb-3 font-mono">
                Eat gas orbs. Dodge failed transactions. Survive the mempool.
              </p>
              <div className="text-[10px] font-mono text-[#655947] mb-4 tracking-wider">
                ⏱ 30 sec rounds &nbsp;·&nbsp; ⛓ On-chain score save
              </div>
              <Link to="/play" className="arcade-btn w-full text-xs py-3">
                Play Gas Gobbler
              </Link>
            </div>
          </div>

          {/* Game 2: Block Breaker — LOCKED */}
          <div className="cartridge cartridge-locked">
            <div className="cartridge-strip" style={{ opacity: 0.3 }} />
            <div className="p-5">
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-[10px] text-[#655947] tracking-widest">GAME-02</span>
                <div className="flex items-center gap-2">
                  <span className="status-light status-light-soon" />
                  <span className="font-mono text-[10px] text-[#655947] uppercase tracking-widest">Coming Soon</span>
                </div>
              </div>
              <h3 className="font-arcade text-sm text-sand mb-2">Block Breaker</h3>
              <BlockBreakerPreview />
              <p className="text-[#655947] text-xs mb-3 font-mono">
                Break Celo blocks before time runs out.
              </p>
              <div className="text-[10px] font-mono text-[#4a3f34] mb-4 tracking-wider">
                ⏱ 60 sec rounds &nbsp;·&nbsp; 🏆 Leaderboard enabled
              </div>
              <button disabled className="arcade-btn arcade-btn-locked w-full text-xs py-3">
                Locked
              </button>
            </div>
          </div>

          {/* Game 3: Stable Sprint — LOCKED */}
          <div className="cartridge cartridge-locked">
            <div className="cartridge-strip" style={{ opacity: 0.3 }} />
            <div className="p-5">
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-[10px] text-[#655947] tracking-widest">GAME-03</span>
                <div className="flex items-center gap-2">
                  <span className="status-light status-light-soon" />
                  <span className="font-mono text-[10px] text-[#655947] uppercase tracking-widest">Coming Soon</span>
                </div>
              </div>
              <h3 className="font-arcade text-sm text-sand mb-2">Stable Sprint</h3>
              <StableSprintPreview />
              <p className="text-[#655947] text-xs mb-3 font-mono">
                Collect cUSD, avoid volatility traps.
              </p>
              <div className="text-[10px] font-mono text-[#4a3f34] mb-4 tracking-wider">
                ⏱ 45 sec rounds &nbsp;·&nbsp; 📱 MiniPay-ready
              </div>
              <button disabled className="arcade-btn arcade-btn-locked w-full text-xs py-3">
                Locked
              </button>
            </div>
          </div>

          {/* Game 4: Mento Invaders — BETA, blue frame */}
          <div className="cartridge cartridge-beta">
            <div className="cartridge-strip" style={{ background: 'repeating-linear-gradient(90deg, #7CC0FF 0 12px, #1a1024 12px 18px)' }} />
            <div className="p-5">
              <div className="flex justify-between items-center mb-1">
                <span className="font-mono text-[10px] text-[#655947] tracking-widest">GAME-04</span>
                <div className="flex items-center gap-2">
                  <span className="status-light status-light-beta" />
                  <span className="font-mono text-[10px] text-accent uppercase tracking-widest font-bold">Beta</span>
                </div>
              </div>
              <h3 className="font-arcade text-sm text-cream mb-2">Mento Invaders</h3>
              <MentoInvadersPreview />
              <p className="text-sand text-xs mb-3 font-mono">
                Defend the stablecoin pool from incoming anomalies.
              </p>
              <div className="text-[10px] font-mono text-[#655947] mb-4 tracking-wider">
                ⏱ Survival Mode &nbsp;·&nbsp; 👾 Classic Shooter
              </div>
              <button disabled className="arcade-btn arcade-btn-accent w-full text-xs py-3">
                Access Beta Soon
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Proof of Ship Section — deep purple bg, Forest border */}
      <div className="w-full max-w-4xl mx-auto text-left mb-12">
        <div className="mb-6">
          <span className="machine-label">Proof of Ship</span>
          <div className="pixel-divider mt-4" />
        </div>
        <div className="cartridge p-0">
          <div className="cartridge-strip" />
          <div className="flex flex-col sm:flex-row gap-0">
            <div className="flex-1 p-6">
              <h3 className="font-arcade text-[10px] text-sand mb-4 tracking-widest">Infrastructure</h3>
              <ul className="space-y-3 font-mono text-xs">
                <li className="flex justify-between">
                  <span className="text-[#655947]">Frontend</span>
                  <a href="https://github.com/cryptoflops/celo-atari-games" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">GitHub</a>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#655947]">Contracts</span>
                  <a href="https://celoscan.io/address/0x16Bbc09bFCCaae7D4C2EcD79C5d72AeA886D2bd0" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">CeloScan</a>
                </li>
                <li className="flex justify-between">
                  <span className="text-[#655947]">Network</span>
                  <span className="text-success font-bold flex items-center gap-2">
                    <span className="status-light status-light-live" />
                    Celo Mainnet
                  </span>
                </li>
              </ul>
            </div>
            <div className="hidden sm:block w-px bg-[#2d2440]" />
            <div className="sm:hidden h-px bg-[#2d2440] mx-6" />
            <div className="flex-1 p-6">
              <h3 className="font-arcade text-[10px] text-sand mb-4 tracking-widest">MiniPay</h3>
              <ul className="space-y-3 font-mono text-xs">
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span className="text-sand">Automatic Wallet Connection</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span className="text-sand">Mobile Safe-Area Rendering</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span className="text-sand">Optimized Touch Controls</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <span className="text-sand">Stablecoin Ready</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
