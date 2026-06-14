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
      }} />
    ))}
    {/* Player */}
    <div className="pixel" style={{ left: '44%', top: '78%', width: 18, height: 12, background: '#FCFF52' }} />
  </div>
);

const CabinetCard: React.FC<{ 
  id: string, 
  title: string, 
  status: 'LIVE' | 'BETA' | 'SOON', 
  color: string, 
  preview?: React.ReactNode,
  logoUrl?: string
}> = ({ id, title, status, color, preview, logoUrl }) => (

  <div className="cabinet-container group">
    <div className="cabinet" style={{ borderColor: color }}>
      {/* Marquee */}
      <div className="cabinet-marquee flex justify-between items-center px-4">
        <span className="font-arcade text-[8px] text-white/50">{id}</span>
        <div className="flex items-center gap-2">
          <span className={`status-light ${
            status === 'LIVE' ? 'status-light-live' : status === 'BETA' ? 'status-light-beta' : 'status-light-soon'
          } ${status !== 'SOON' ? 'animate-pulse' : ''}`} />
          <span className="tech-label">{status}</span>
        </div>
      </div>

      {/* Screen Area */}
      <div className="cabinet-screen-bezel">
        <div className="cabinet-screen bg-black flex items-center justify-center p-4">
          {logoUrl ? (
            <img src={logoUrl} alt={title} className="max-w-full max-h-full object-contain" />
          ) : (
            <div className="text-white/20 font-arcade text-[10px] text-center">
              {preview || title.toUpperCase()}
            </div>
          )}
          {/* Scanline effect */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(0deg,transparent_0px,rgba(0,0,0,0.5)_2px,transparent_4px)]" />
        </div>
      </div>

      {/* Controls */}
      <div className="cabinet-controls">
        <div className="joystick-base">
          <div className="joystick" />
        </div>
        <div className="control-btn-group">
          <div className="control-btn yellow" />
          <div className="control-btn red" />
          <div className="control-btn blue" />
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6 px-2 pb-2">
        <Link 
          to={`/play/${id.toLowerCase().replace(' ', '-')}`}
          className={`arcade-btn w-full text-[10px] py-4 transform transition-all ${
            status === 'SOON' ? 'arcade-btn-locked opacity-50 pointer-events-none' : 'group-hover:-translate-y-1'
          }`}
        >
          {status === 'SOON' ? 'COMING SOON' : `PLAY ${title.toUpperCase()}`}
        </Link>
      </div>
    </div>
  </div>
);

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center py-12 px-4 max-w-5xl mx-auto w-full animate-in fade-in duration-700">
      
      {/* Hero Title */}
      <div className="text-center mb-12">
        <h1 className="pixel-title text-4xl sm:text-6xl mb-6 tracking-widest">
          CELO ATARI GAMES
        </h1>
        <p className="text-white/70 font-mono text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          4 retro mini-games for MiniPay.<br/>
          Play fast rounds, save scores on Celo, and secure your spot on the blockchain.
        </p>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-20 w-full max-w-md">
        <Link to="/play/gas-gobbler" className="arcade-btn flex-1 text-center py-4">
          PLAY NOW
        </Link>
        <Link to="/leaderboard" className="arcade-btn-secondary flex-1 text-center py-4">
          LEADERBOARD
        </Link>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full mb-24">
        <CabinetCard 
          id="GAS GOBBLER" 
          title="Gas Gobbler" 
          status="LIVE" 
          color="#FCFF52"
          logoUrl="/gas_gobbler_logo.png"
          preview={<GasGobblerPreview />}
        />
        <CabinetCard 
          id="MENTO INVADERS" 
          title="Mento Invaders" 
          status="BETA" 
          color="#00f0ff"
          preview={<MentoInvadersPreview />}
        />
        <CabinetCard 
          id="BLOCK BREAKER" 
          title="Block Breaker" 
          status="SOON" 
          color="#F72585"
          preview={<BlockBreakerPreview />}
        />
        <CabinetCard 
          id="STABLE SPRINT" 
          title="Stable Sprint" 
          status="SOON" 
          color="#56DF7C"
          preview={<StableSprintPreview />}
        />
      </div>

      {/* Proof of Ship / Infrastructure Section */}
      <div className="w-full">
        <div className="inline-block glass-panel px-4 py-1.5 mb-4 shadow-[0_0_12px_rgba(0,240,255,0.1)]">
          <span className="font-arcade text-[8px] text-primary tracking-widest text-glow-primary">PROOF OF SHIP</span>
        </div>
        
        <div className="glass-panel p-8 border border-white/10 shadow-lg relative overflow-hidden">
          {/* Subtle light pulse effect */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Infrastructure */}
            <div>
              <h3 className="tech-label mb-6 text-white/40 border-b border-white/5 pb-2">Infrastructure</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="tech-label text-white/60">Frontend</span>
                  <a href="https://github.com/cryptoflops/celo-atari-games" target="_blank" rel="noopener noreferrer" className="tech-label font-bold text-white/90 underline hover:text-primary transition-colors">GitHub</a>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="tech-label text-white/60">Contracts</span>
                  <a href="https://talent.app/" target="_blank" rel="noopener noreferrer" className="tech-label font-bold text-white/90 underline hover:text-primary transition-colors">Talent App</a>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="tech-label text-white/60">Network</span>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse shadow-[0_0_6px_var(--color-success)]" />
                    <span className="tech-label font-bold text-success text-glow-success">Celo Mainnet</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MiniPay */}
            <div>
              <h3 className="tech-label mb-6 text-white/40 border-b border-white/5 pb-2">MiniPay Features</h3>
              <div className="space-y-3">
                {[
                  'Automatic Wallet Connection',
                  'Mobile Safe-Area Rendering',
                  'Optimized Touch Controls',
                  'Stablecoin Ready'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-success text-xs font-bold">✓</span>
                    <span className="tech-label text-white/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="flex flex-wrap gap-6 justify-center mt-16 pb-12">
        <a href="https://github.com/cryptoflops/celo-atari-games" target="_blank" rel="noopener noreferrer" className="tech-label text-white/40 hover:text-primary transition-all">[GitHub]</a>
        <a href="https://minipay.celo.org/" target="_blank" rel="noopener noreferrer" className="tech-label text-white/40 hover:text-primary transition-all">[MiniPay Docs]</a>
        <a href="https://celo.org/proof-of-ship" target="_blank" rel="noopener noreferrer" className="tech-label text-white/40 hover:text-primary transition-all">[Celo Proof of Ship]</a>
      </div>

    </div>
  );
};
