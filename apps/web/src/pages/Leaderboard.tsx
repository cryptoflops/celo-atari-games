import React from 'react';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { Link } from 'react-router-dom';

export const Leaderboard: React.FC = () => {
  return (
    <div className="flex flex-col items-center py-8 px-4">
      <h2 className="pixel-subtitle mb-4">GLOBAL RANKING</h2>
      <p className="text-sand mb-8 max-w-lg text-center text-sm font-mono">
        Top scores are verified by the GasGobblerScoreRegistry smart contract on the Celo blockchain.
      </p>
      
      <LeaderboardTable />

      {/* Empty state — shown when no scores are on-chain yet */}
      <div className="w-full max-w-md mt-8 glass-panel p-8 text-center border-dashed border-2 border-white/10">
        <div className="text-4xl mb-4 opacity-40">🏆</div>
        <h3 className="font-mono text-sm font-bold text-white/60 mb-2">No Scores Yet</h3>
        <p className="font-mono text-xs text-white/40 mb-6 leading-relaxed">
          Connect your wallet and play a game to see your name on the leaderboard.
        </p>
        <Link 
          to="/play/gas-gobbler" 
          className="arcade-btn inline-block text-xs py-3 px-8"
        >
          PLAY NOW
        </Link>
      </div>
    </div>
  );
};
