import type { FC } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useWallet } from '../hooks/useWallet';
import { Panel } from './Card';
import { RankBadge } from './Badge';

interface LeaderboardEntry {
  address: string;
  score: number;
  username?: string;
}

const PlayerLabel: FC<{ entry: LeaderboardEntry }> = ({ entry }) => {
  const name = entry.username || `${entry.address.slice(0, 6)}…${entry.address.slice(-4)}`;
  return <span className="tech-value text-cream" style={{ fontSize: '15px' }}>{name}</span>;
};

const ScoreValue: FC<{ score: number }> = ({ score }) => (
  <span
    className="tech-value font-bold"
    style={{
      fontSize: '15px',
      textAlign: 'right',
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--color-success)',
    }}
  >
    {score.toLocaleString()}
  </span>
);

const ScoreRow: FC<{
  rank: number;
  entry: LeaderboardEntry;
  isCurrent?: boolean;
}> = ({ rank, entry, isCurrent }) => (
  <div className={`sega-score-row ${isCurrent ? 'sega-score-row--current' : ''}`}>
    <span style={{ minWidth: '52px' }}>
      <RankBadge rank={rank} />
    </span>
    <PlayerLabel entry={entry} />
    <ScoreValue score={entry.score} />
    <span className="flex items-center gap-1.5">
      <span aria-hidden="true" className="status-light status-light-live" />
      <span className="tech-label text-success" style={{ fontSize: '13px' }}>VERIFIED</span>
    </span>
  </div>
);

/** Skeleton row preserves layout shape while scores load. */
const SkeletonRow: FC = () => (
  <div className="sega-score-row" style={{ opacity: 0.45 }} aria-hidden="true">
    <span style={{ minWidth: '52px' }}>
      <span className="sega-badge sega-badge--soon" style={{ width: '48px' }}>
        <span className="animate-pulse" style={{ display: 'inline-block', minWidth: '24px' }}>—</span>
      </span>
    </span>
    <span className="tech-value text-white/40" style={{ fontSize: '15px' }}>loading…</span>
    <span className="tech-value text-white/40" style={{ fontSize: '15px', textAlign: 'right' }}>········</span>
    <span className="tech-label text-white/30" style={{ fontSize: '13px' }}>—</span>
  </div>
);

export const LeaderboardTable: FC = () => {
  // useLeaderboard returns a TanStack Query result — isLoading/isError/data/refetch available.
  const { data, isLoading, isError, refetch } = useLeaderboard();
  const { address } = useWallet();

  const leaderboard: LeaderboardEntry[] = (data?.leaderboard as LeaderboardEntry[] | undefined) ?? [];

  // Find the current player's ranking if they appear in the registry.
  const currentPlayerRank = address
    ? leaderboard.findIndex((e) => e.address.toLowerCase() === address.toLowerCase()) + 1
    : 0;

  // ── Loading state: preserve layout shape ──
  if (isLoading) {
    return (
      <Panel className="w-full" aria-busy="true" role="status">
        <p className="tech-label text-white/55 mb-3 text-center" style={{ fontSize: '13px' }}>
          Loading scores…
        </p>
        <div className="flex flex-col">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      </Panel>
    );
  }

  // ── Error state: scoreboard shell preserved, retry action given ──
  if (isError) {
    return (
      <Panel variant="locked" className="w-full" role="alert">
        <p className="tech-label text-danger font-bold mb-1" style={{ fontSize: '13px' }}>✕ Contract read failed</p>
        <p className="text-white/70 mb-4" style={{ fontSize: '15px', lineHeight: 1.35 }}>
          Could not read the score registry. Check your network connection and try again.
        </p>
        <button type="button" onClick={() => refetch()} className="arcade-btn" style={{ fontSize: '15px' }}>
          Try again
        </button>
      </Panel>
    );
  }

  // ── Empty state ──
  if (leaderboard.length === 0) {
    return (
      <Panel className="w-full text-center">
        <h2 className="font-arcade text-cream mb-2" style={{ fontSize: '21px' }}>No scores yet</h2>
        <p className="text-white/65 mb-5 mx-auto" style={{ fontSize: '15px', lineHeight: 1.35, maxWidth: '36ch' }}>
          Be the first player to submit a verified on-chain score to the Celo registry.
        </p>
        <a href="/play" className="arcade-btn arcade-btn-secondary">▶ Start a run</a>
      </Panel>
    );
  }

  // ── Ranked scoreboard ──
  return (
    <Panel className="w-full" aria-label="Scoreboard">
      <div className="flex items-center justify-between mb-3">
        <h2 className="tech-label text-white/45" style={{ fontSize: '13px' }}>All-time · Gas Gobbler</h2>
        <span className="tech-label text-white/45" style={{ fontSize: '13px' }}>{leaderboard.length} entries</span>
      </div>

      <div className="flex flex-col">
        {leaderboard.map((entry, i) => (
          <ScoreRow
            key={`${entry.address}-${i}`}
            rank={i + 1}
            entry={entry}
            isCurrent={currentPlayerRank === i + 1}
          />
        ))}
      </div>

      {/* Connected-but-unranked callout */}
      {address && currentPlayerRank === 0 && (
        <div className="mt-4 pt-3 border-t border-border">
          <div className="sega-score-row sega-score-row--current" aria-label="Your rank: unranked">
            <span style={{ minWidth: '52px' }}>
              <span className="sega-badge sega-badge--soon">#—</span>
            </span>
            <span className="tech-value text-cream" style={{ fontSize: '15px' }}>
              {address.slice(0, 6)}…{address.slice(-4)}
              <span className="tech-label text-white/55 ml-2" style={{ fontSize: '13px' }}>(you)</span>
            </span>
            <span className="tech-value text-white/45" style={{ fontSize: '15px', textAlign: 'right' }}>no score yet</span>
            <span className="tech-label text-white/45" style={{ fontSize: '13px' }}>UNRANKED</span>
          </div>
          <p className="text-white/55 mt-2 text-center" style={{ fontSize: '13px' }}>
            Submit a verified run to claim your spot.
          </p>
        </div>
      )}
    </Panel>
  );
};
