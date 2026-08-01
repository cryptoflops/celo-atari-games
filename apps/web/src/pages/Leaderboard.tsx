import type { FC } from 'react';
import { LeaderboardTable } from '../components/LeaderboardTable';

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
    </div>
  );
};
