import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useProfile } from '../hooks/useProfile';

export const Profile: React.FC = () => {
  const { address, isConnected, connect, isMiniPayWallet } = useWallet();
  const profile = useProfile();
  
  const [formData, setFormData] = useState({
    username: profile.username,
    twitter: profile.twitter,
    farcaster: profile.farcaster,
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    profile.updateProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex flex-col items-center py-12 px-4 max-w-xl mx-auto w-full animate-in fade-in duration-300">
      <div className="text-center mb-10">
        <h1 className="pixel-title text-3xl sm:text-4xl mb-4 text-glow-primary">PLAYER PROFILE</h1>
        <p className="text-white/60 font-mono text-xs sm:text-sm max-w-md mx-auto">
          Manage your credentials, link your web3 socials, and verify your on-chain standing.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 w-full border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Wallet Section */}
        <div className="mb-10">
          <h2 className="tech-label opacity-40 mb-4 block">WALLET CONNECTION</h2>
          {isConnected && address ? (
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-surface-bright flex items-center justify-center text-xl border border-white/10 shadow-sm">
                  {isMiniPayWallet ? '📱' : '🦊'}
                </div>
                <div>
                  <div className="font-mono text-sm text-white/90 font-bold">{`${address.slice(0, 6)}...${address.slice(-4)}`}</div>
                  <div className="tech-label text-[9px] text-success text-glow-success mt-0.5">CONNECTED VIA {isMiniPayWallet ? 'MINIPAY' : 'INJECTED'}</div>
                </div>
              </div>
              <div className="text-[8px] font-arcade px-2.5 py-1 bg-primary/20 text-primary rounded shadow-[0_0_8px_rgba(0,240,255,0.15)] text-glow-primary border border-primary/20">
                VERIFIED
              </div>
            </div>
          ) : (
            <div className="text-center p-8 border-dashed border-2 border-white/10 rounded-xl">
              <p className="tech-label text-white/40 mb-4 normal-case font-medium">No wallet linked to this browser session</p>
              <button onClick={connect} className="arcade-btn py-3 px-6 text-xs">
                CONNECT WALLET
              </button>
            </div>
          )}
        </div>

        {/* Profile Form */}
        <div>
          <h2 className="tech-label opacity-40 mb-4 block">SOCIAL REGISTRY</h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="tech-label text-[10px] opacity-70 mb-2 block">Arcade Alias</label>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. Satoshi"
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-sm text-white focus:outline-none focus-neon transition-colors"
              />
            </div>
            
            <div>
              <label className="tech-label text-[10px] opacity-70 mb-2 block">X (Twitter) Profile</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-mono">@</span>
                <input 
                  type="text" 
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="username"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 pl-9 font-mono text-sm text-white focus:outline-none focus-neon transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="tech-label text-[10px] opacity-70 mb-2 block">Farcaster Identity</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-mono">@</span>
                <input 
                  type="text" 
                  name="farcaster"
                  value={formData.farcaster}
                  onChange={handleChange}
                  placeholder="username"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 pl-9 font-mono text-sm text-white focus:outline-none focus-neon transition-colors"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={`w-full py-4 text-xs font-arcade transition-all rounded-xl cursor-pointer ${
                isSaved 
                  ? 'bg-success text-black shadow-[0_0_15px_var(--color-success)]' 
                  : 'bg-primary text-black hover:bg-primary/90 shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]'
              }`}
            >
              {isSaved ? 'REGISTRY SECURED!' : 'SAVE PROFILE'}
            </button>
          </form>
          <div className="mt-4 p-3 border border-yellow-500/20 bg-yellow-500/5 rounded-lg">
            <p className="font-mono text-[9px] text-yellow-400/70 text-center">
              ⚡ Profile data is stored locally (browser only). On-chain persistence coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
