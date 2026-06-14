import React from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';

const PodiumEntry: React.FC<{ rank: number, address: string, score: number, username?: string }> = ({ rank, address, score, username }) => {
  const colors = {
    1: 'border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.2)] bg-[#FFD700]/5', // Gold
    2: 'border-[#C0C0C0] shadow-[0_0_15px_rgba(192,192,192,0.15)] bg-[#C0C0C0]/5', // Silver
    3: 'border-[#CD7F32] shadow-[0_0_15px_rgba(205,127,50,0.15)] bg-[#CD7F32]/5', // Bronze
  };

  const badges = {
    1: '👑',
    2: '🥈',
    3: '🥉',
  };

  return (
    <div className={`flex flex-col items-center p-5 rounded-2xl glass-panel border-2 transition-all duration-300 hover:scale-105 ${
      rank === 1 ? 'scale-110 -translate-y-4 z-10' : 'scale-95'
    } ${colors[rank as keyof typeof colors] || 'border-white/10'}`}>
      <div className="text-3xl mb-1 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
        {badges[rank as keyof typeof badges] || '👤'}
      </div>
      <div className="font-arcade text-[8px] text-white/40 mb-2">RANK {rank}</div>
      <div className="font-mono text-[10px] text-white/90 font-bold mb-1 truncate w-24 text-center">
        {username || `${address.slice(0, 6)}...${address.slice(-4)}`}
      </div>
      <div className="font-bold text-success text-glow-success text-sm font-mono">{score.toLocaleString()}</div>
      <div className="tech-label text-[7px] mt-1.5 text-white/30">PTS</div>
    </div>
  );
};

interface LeaderboardEntry {
  address: string;
  score: number;
  username?: string;
}

export const LeaderboardTable: React.FC = () => {
  const { data, isLoading, isError } = useLeaderboard();

  if (isLoading) return <div className="text-center tech-label py-16 animate-pulse text-primary text-glow-primary">Loading Chain State...</div>;
  if (isError) return <div className="text-center text-danger py-16 tech-label text-glow-danger">Error: Registry Mismatch</div>;

  const leaderboard: LeaderboardEntry[] = data?.leaderboard || [];
  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in duration-500">

      {/* Podium */}
      {topThree.length > 0 && (
        <div className="flex justify-center items-end gap-3 mb-16 mt-8">
          {topThree[1] && <PodiumEntry rank={2} {...topThree[1]} />}
          {topThree[0] && <PodiumEntry rank={1} {...topThree[0]} />}
          {topThree[2] && <PodiumEntry rank={3} {...topThree[2]} />}
        </div>
      )}

      {/* Table */}
      <div className="glass-panel overflow-hidden border border-white/10 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 tech-label text-white/40">Rank</th>
                <th className="px-6 py-4 tech-label text-white/40">Player</th>
                <th className="px-6 py-4 tech-label text-white/40 text-right">Score</th>
                <th className="px-6 py-4 tech-label text-white/40 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leaderboard.map((entry, index: number) => (
                <tr key={index} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-white/50 font-mono text-xs font-bold">#{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded bg-surface-bright flex items-center justify-center text-sm border border-white/10 shadow-sm">
                        {index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : '👤'}
                      </div>
                      <span className="font-mono text-sm text-white/90 group-hover:text-primary transition-colors">
                        {entry.username || `${entry.address.slice(0, 6)}...${entry.address.slice(-4)}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-success text-glow-success font-mono text-sm">{entry.score.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="flex items-center gap-1.5 text-success">
                        <span className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_6px_var(--color-success)]" />
                        <span className="text-[9px] font-bold uppercase tracking-tight text-glow-success">Verified</span>
                      </div>
                      <span className="text-[7px] font-mono text-white/30">EIP-712</span>
                    </div>
                  </td>
                </tr>
              ))}
              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center tech-label text-white/30">
                    No records found in registry
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

