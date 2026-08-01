import type { FC } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Panel, FeaturedCard } from '../components/Card';
import { Badge, type BadgeStatus } from '../components/Badge';
import { buttonClass } from '../components/Button';

/* ── Tiny CSS pixel-art previews (token-tinted) ────── */

const GasGobblerPreview: FC = () => (
  <div className="game-preview">
    <div className="pixel" style={{ left: '44%', top: '46%', width: 14, height: 14, background: 'var(--color-celo-yellow)', boxShadow: '14px 0 0 var(--color-celo-yellow), 0 14px 0 var(--color-celo-yellow)' }} />
    <div className="pixel" style={{ left: '18%', top: '28%', width: 10, height: 10, background: 'var(--color-success)' }} />
    <div className="pixel" style={{ left: '72%', top: '58%', width: 10, height: 10, background: 'var(--color-success)' }} />
    <div className="pixel" style={{ left: '55%', top: '18%', width: 10, height: 10, background: 'var(--color-success)' }} />
    <div className="pixel" style={{ left: '30%', top: '68%', width: 12, height: 12, background: 'var(--color-danger)' }} />
    <div className="pixel" style={{ left: '80%', top: '30%', width: 12, height: 12, background: 'var(--color-danger)' }} />
  </div>
);

const BlockBreakerPreview: FC = () => (
  <div className="game-preview">
    {[10, 25, 40, 55, 70, 85].map((l, i) => (
      <div key={`r1-${i}`} className="pixel" style={{ left: `${l}%`, top: '12%', width: 18, height: 8, background: i % 2 === 0 ? 'var(--color-celo-yellow)' : 'var(--color-acc-blue-soft)', borderRadius: 1 }} />
    ))}
    {[15, 30, 45, 60, 75].map((l, i) => (
      <div key={`r2-${i}`} className="pixel" style={{ left: `${l}%`, top: '26%', width: 18, height: 8, background: i % 2 === 0 ? 'var(--color-acc-green-soft)' : 'var(--color-celo-yellow)', borderRadius: 1 }} />
    ))}
    <div className="pixel" style={{ left: '48%', top: '58%', width: 8, height: 8, background: 'var(--color-acc-paper-soft)', borderRadius: '50%' }} />
    <div className="pixel" style={{ left: '36%', top: '82%', width: 40, height: 8, background: 'var(--color-celo-yellow)', borderRadius: 2 }} />
  </div>
);

const StableSprintPreview: FC = () => (
  <div className="game-preview">
    <div className="absolute inset-x-0 top-[33%] h-px bg-white/10" />
    <div className="absolute inset-x-0 top-[66%] h-px bg-white/10" />
    <div className="pixel" style={{ left: '20%', top: '44%', width: 12, height: 16, background: 'var(--color-celo-yellow)' }} />
    <div className="pixel" style={{ left: '50%', top: '20%', width: 10, height: 10, background: 'var(--color-success)', borderRadius: '50%' }} />
    <div className="pixel" style={{ left: '70%', top: '50%', width: 10, height: 10, background: 'var(--color-success)', borderRadius: '50%' }} />
    <div className="pixel" style={{ left: '60%', top: '70%', width: 14, height: 14, background: 'var(--color-danger)' }} />
  </div>
);

const MentoInvadersPreview: FC = () => (
  <div className="game-preview">
    {[20, 35, 50, 65, 80].map((l, i) => (
      <div key={`inv-${i}`} className="pixel" style={{
        left: `${l}%`, top: '18%', width: 12, height: 10,
        background: i % 2 === 0 ? 'var(--color-acc-blue-soft)' : 'var(--color-secondary)',
      }} />
    ))}
    <div className="pixel" style={{ left: '44%', top: '78%', width: 18, height: 12, background: 'var(--color-celo-yellow)' }} />
  </div>
);

/* ── Unified game card ─────────────────────────────── */

interface GameCardDatum {
  id: string;
  title: string;
  subline: string;
  desc: string;
  status: BadgeStatus;
  featured?: boolean;
  playable: boolean;
  preview: ReactNode;
}

const GameCard: FC<{ data: GameCardDatum }> = ({ data }) => (
  data.featured ? (
    <FeaturedCard interactive>
      <article className="flex flex-col gap-4">
        <header className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="machine-label machine-label--yellow mb-3">FLAGSHIP</div>
            <h3 className="font-arcade text-cream" style={{ fontSize: '27px', lineHeight: 1.1, textShadow: '3px 3px 0 var(--color-ink)' }}>
              {data.title}
            </h3>
            <p className="tech-label text-white/65 mt-2" style={{ fontSize: '13px' }}>{data.subline}</p>
          </div>
          <Badge status={data.status} />
        </header>

        <div className="sega-screen">
          {data.preview}
        </div>

        <p className="text-white/80" style={{ fontSize: '17px', lineHeight: 1.35, maxWidth: '52ch' }}>
          {data.desc}
        </p>

        {data.playable ? (
          <Link
            to="/play"
            className={buttonClass('primary', 'px-6 self-center mt-1')}
          >
            ▶ Play {data.title}
          </Link>
        ) : (
          <span className="arcade-btn arcade-btn-locked px-6 self-center mt-1" aria-disabled="true">
            Coming soon
          </span>
        )}
      </article>
    </FeaturedCard>
  ) : (
    <Panel interactive={data.playable} variant={data.playable ? 'default' : 'locked'} className="h-full">
      <article className="flex flex-col gap-3 h-full">
        <header className="flex items-center justify-between gap-2">
          <h3 className="font-arcade text-cream" style={{ fontSize: '21px', lineHeight: 1.1, textShadow: '2px 2px 0 var(--color-ink)' }}>
            {data.title}
          </h3>
          <Badge status={data.status} />
        </header>

        <p className="tech-label text-white/65" style={{ fontSize: '13px' }}>{data.subline}</p>

        <div className="sega-screen" style={{ aspectRatio: '4 / 3' }}>
          {data.preview}
        </div>

        <p className="text-white/75" style={{ fontSize: '15px', lineHeight: 1.35 }}>
          {data.desc}
        </p>

        <div className="mt-auto pt-2">
          {data.playable ? (
            <Link to="/play" className={buttonClass('secondary', 'w-full')}>
              Play {data.title}
            </Link>
          ) : (
            <span className="arcade-btn arcade-btn-locked w-full" aria-disabled="true">
              Coming soon
            </span>
          )}
        </div>
      </article>
    </Panel>
  )
);

/* ── MiniPay capability cards ──────────────────────── */

const MinipayCard: FC<{ icon: string; title: string; body: string }> = ({ icon, title, body }) => (
  <Panel className="h-full">
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" style={{ fontSize: '17px' }}>{icon}</span>
        <span className="font-arcade text-cream" style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
      </div>
      <p className="text-white/70" style={{ fontSize: '15px', lineHeight: 1.3 }}>{body}</p>
    </div>
  </Panel>
);

const GAMES: GameCardDatum[] = [
  {
    id: 'gas-gobbler',
    title: 'Gas Gobbler',
    subline: 'Dodge-and-collect · on-chain scores',
    desc: 'Dodge barriers and gobble gas orbs to advance. Survive the mempool and save your run directly to the Celo blockchain.',
    status: 'live',
    featured: true,
    playable: true,
    preview: <GasGobblerPreview />,
  },
  {
    id: 'block-breaker',
    title: 'Block Breaker',
    subline: 'Multi-level · on-chain scores',
    desc: 'Break Celo blocks before time runs out. A multi-level arcade challenge.',
    status: 'soon',
    featured: false,
    playable: false,
    preview: <BlockBreakerPreview />,
  },
  {
    id: 'stable-sprint',
    title: 'Stable Sprint',
    subline: 'Endless runner · on-chain scores',
    desc: 'Collect cUSD coins while dodging volatility traps. An endless runner speed test.',
    status: 'soon',
    featured: false,
    playable: false,
    preview: <StableSprintPreview />,
  },
  {
    id: 'mento-invaders',
    title: 'Mento Invaders',
    subline: 'Stable-shooter · on-chain scores',
    desc: 'Defend the stablecoin pool from incoming anomalies. Survive waves; save your score to the Celo registry.',
    status: 'beta',
    featured: false,
    playable: false,
    preview: <MentoInvadersPreview />,
  },
];

export const Home: FC = () => {
  const flagship = GAMES.find((g) => g.featured) ?? GAMES[0];
  const lineup = GAMES.filter((g) => !g.featured);
  const hasLocked = lineup.some((g) => !g.playable);

  return (
    <div className="flex flex-col items-center py-10 sm:py-14 px-4 max-w-5xl mx-auto w-full">
      {/* ── Title screen hero ── */}
      <header className="text-center mb-12 w-full">
        <h1 className="pixel-title mb-5">
          CELO&nbsp;ATARI
        </h1>
        <p className="text-cream/85 mx-auto" style={{ fontSize: '17px', lineHeight: 1.35, maxWidth: '52ch' }}>
          Four retro mini-games for MiniPay. Play fast rounds, save scores on Celo, and climb the leaderboard.
        </p>
      </header>

      {/* ── Primary action cluster ── */}
      <div className="flex flex-col sm:flex-row gap-4 mb-14 w-full max-w-md">
        <Link to="/play" className={buttonClass('primary', 'flex-1 justify-center py-4')}>
          ▶ Play now
        </Link>
        <Link to="/leaderboard" className={buttonClass('secondary', 'flex-1 justify-center py-4')}>
          Leaderboard
        </Link>
      </div>

      {/* ── Featured flagship arcade card ── */}
      <section className="w-full mb-16" aria-label="Flagship game">
        <h2 className="tech-label text-white/45 mb-4" style={{ fontSize: '13px' }}>
          Featured
        </h2>
        <GameCard data={flagship} />
      </section>

      {/* ── Unified game lineup ── */}
      <section className="w-full mb-16" aria-label="Game lineup">
        <h2 className="tech-label text-white/45 mb-4" style={{ fontSize: '13px' }}>
          Game lineup
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {lineup.map((g) => (
            <GameCard key={g.id} data={g} />
          ))}
        </div>
        {hasLocked && (
          <p className="tech-label text-white/45 mt-5" style={{ fontSize: '13px' }}>
            Locked titles are queued — they land in a future season.
          </p>
        )}
      </section>

      {/* ── Proof / system panel ── */}
      <section className="w-full mb-16" aria-label="Proof of ship">
        <Panel>
          <h2 className="machine-label machine-label--yellow mb-5">System&nbsp;/&nbsp;Proof</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="tech-label text-white/45 mb-3" style={{ fontSize: '13px' }}>Infrastructure</h3>
              <dl className="flex flex-col gap-2">
                <div className="flex justify-between items-center border-b border-border pb-2 pt-1">
                  <dt className="tech-label text-white/55" style={{ fontSize: '13px' }}>Frontend repo</dt>
                  <dd>
                    <a
                      href="https://github.com/cryptoflops/celo-atari-games"
                      target="_blank" rel="noopener noreferrer"
                      className="tech-value text-cream hover:text-secondary underline"
                    >
                      GitHub
                    </a>
                  </dd>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-2 pt-1">
                  <dt className="tech-label text-white/55" style={{ fontSize: '13px' }}>Score contract</dt>
                  <dd>
                    <a
                      href="https://celoscan.io/address/0x16Bbc09bFCCaae7D4C2EcD79C5d72AeA886D2bd0"
                      target="_blank" rel="noopener noreferrer"
                      className="tech-value text-cream hover:text-secondary underline"
                    >
                      celoscan ↗
                    </a>
                  </dd>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-2 pt-1">
                  <dt className="tech-label text-white/55" style={{ fontSize: '13px' }}>Network</dt>
                  <dd className="flex items-center gap-1.5">
                    <span aria-hidden="true" className="status-light status-light-live" />
                    <span className="tech-value text-success" style={{ fontSize: '13px', fontWeight: 'bold' }}>
                      Celo Mainnet
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <dt className="tech-label text-white/55" style={{ fontSize: '13px' }}>Verification</dt>
                  <dd>
                    <Badge status="verified" label="On-chain" />
                  </dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="tech-label text-white/45 mb-3" style={{ fontSize: '13px' }}>MiniPay features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <MinipayCard icon="●" title="Auto-connect" body="Wallet attaches without prompts when opened inside MiniPay." />
                <MinipayCard icon="▣" title="Safe-area" body="Renders inside the MiniPay frame so controls never tuck under OS chrome." />
                <MinipayCard icon="▶" title="Touch controls" body="D-pad sized for thumb-only play." />
                <MinipayCard icon="◆" title="Stablecoin-ready" body="Score submissions cost fractions of a cent — paid in cUSD." />
              </div>
            </div>
          </div>
        </Panel>
      </section>

      {/* ── Footer ── */}
      <footer className="w-full flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pb-10 pt-4 text-center">
        <a href="https://github.com/cryptoflops/celo-atari-games" target="_blank" rel="noopener noreferrer" className="tech-label text-white/55 hover:text-secondary" style={{ fontSize: '13px' }}>
          GitHub
        </a>
        <a href="https://docs.minipay.xyz" target="_blank" rel="noopener noreferrer" className="tech-label text-white/55 hover:text-secondary" style={{ fontSize: '13px' }}>
          MiniPay docs
        </a>
        <a href="https://talent.app/~/earn/celo-proof-of-ship" target="_blank" rel="noopener noreferrer" className="tech-label text-white/55 hover:text-secondary" style={{ fontSize: '13px' }}>
          Celo Proof of Ship
        </a>
        <span className="tech-label text-white/35" style={{ fontSize: '13px' }}>
          © {new Date().getFullYear()} Celo Atari
        </span>
      </footer>
    </div>
  );
};
