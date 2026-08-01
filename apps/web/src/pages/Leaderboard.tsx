import type { FC } from 'react';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { Link } from 'react-router-dom';

export const Leaderboard: FC = () => {
  return (
    <div className="flex flex-col items-center py-8 px-4 w-full max-w-2xl mx-auto">
      <header className="text-center mb-8 w-full">
        <h2 className="pixel-subtitle mb-3" style={{ fontSize: '27px' }}>
          Global ranking
        </h2>
        <p className="text-cream/80 text-center mx-auto" style={{ fontSize: '15px', lineHeight: 1.35, maxWidth: '46ch' }}>
          Top scores are verified by the GasGobblerScoreRegistry smart contract on the Celo blockchain.
        </p>
      </header>

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
