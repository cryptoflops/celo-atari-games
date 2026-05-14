import React from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';

export const LeaderboardTable: React.FC = () => {
  const { data, isLoading, isError } = useLeaderboard();

  if (isLoading) return <div className="text-center text-gray-400 py-8">Loading leaderboard...</div>;
  if (isError) return <div className="text-center text-danger py-8">Failed to load leaderboard</div>;

  const leaderboard = data?.leaderboard || [];

  return (
    <div className="w-full max-w-2xl mx-auto bg-background/80 rounded-2xl border border-secondary overflow-hidden shadow-2xl backdrop-blur-md">
      <table className="w-full text-left">
        <thead className="bg-secondary/30 text-primary border-b border-secondary">
          <tr>
            <th className="px-6 py-4 font-bold tracking-wider">Rank</th>
            <th className="px-6 py-4 font-bold tracking-wider">Player</th>
            <th className="px-6 py-4 font-bold tracking-wider text-right">Score</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-secondary/50">
          {leaderboard.map((entry: any, index: number) => (
            <tr key={index} className="hover:bg-secondary/10 transition-colors">
              <td className="px-6 py-4 text-gray-400 font-mono">#{index + 1}</td>
              <td className="px-6 py-4 font-medium text-white">
                {entry.username || `${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`}
              </td>
              <td className="px-6 py-4 text-right font-bold text-success text-lg">{entry.score}</td>
            </tr>
          ))}
          {leaderboard.length === 0 && (
            <tr>
              <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                No scores yet. Be the first to play!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
