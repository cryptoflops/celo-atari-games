import React from 'react';
import { LeaderboardTable } from '../components/LeaderboardTable';

export const Leaderboard: React.FC = () => {
  return (
    <div className="flex flex-col items-center py-8 px-4">
      <h2 className="pixel-subtitle mb-4">GLOBAL RANKING</h2>
      <p className="text-sand mb-8 max-w-lg text-center text-sm font-mono">
        Top scores are verified by the GasGobblerScoreRegistry smart contract on the Celo blockchain.
      </p>
      
      <LeaderboardTable />
    </div>
  );
};
