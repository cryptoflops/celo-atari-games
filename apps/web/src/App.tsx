
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import type { FC } from 'react';
import { config } from './config/wagmi';
import { Home } from './pages/Home';
import { Play } from './pages/Play';
import { Leaderboard } from './pages/Leaderboard';
import { Profile } from './pages/Profile';
import { WalletStatus } from './components/WalletStatus';
import { TemporalBackground } from './components/TemporalBackground';
import { Nav } from './components/Nav';

const queryClient = new QueryClient();

/** Sega arcade logo mark — a hard-edged framed pad + status dots. */
const LogoSVG: FC = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-[0_0_6px_rgba(69,2,255,0.5)]"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="16" height="16" rx="0" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" />
    <rect x="6" y="5" width="8" height="6" rx="0" fill="var(--color-primary)" opacity="0.9" />
    <rect x="9" y="13" width="2" height="3" rx="0" fill="var(--color-primary)" opacity="0.6" />
    <circle cx="7" cy="15" r="1" fill="var(--color-secondary)" />
    <circle cx="13" cy="15" r="1" fill="var(--color-danger)" />
  </svg>
);

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen relative flex flex-col pb-24">
            <TemporalBackground />

            {/* Sega HUD header — sticky strip, single row */}
            <header
              className="sticky top-0 z-50 border-b-2 border-ink bg-surface/95 backdrop-blur-none pt-2"
              role="banner"
            >
              <div className="flex items-center justify-between gap-3 px-4 pb-2 max-w-5xl mx-auto w-full flex-wrap">
                <Link to="/" className="flex items-center gap-2" aria-label="Celo Atari Games">
                  <LogoSVG />
                  <span
                    className="font-arcade tracking-widest text-secondary"
                    style={{ fontSize: '15px', textShadow: '2px 2px 0 var(--color-ink)' }}
                  >
                    CELO&nbsp;ATARI
                  </span>
                </Link>

                <div className="flex items-center gap-4">
                  <span className="tech-label font-bold hidden sm:inline" style={{ fontSize: '13px' }}>
                    <span style={{ color: 'var(--color-celo-yellow)' }}>Celo</span>
                    &nbsp;
                    <span style={{ color: 'var(--color-success)' }}>Mainnet</span>
                  </span>
                  <WalletStatus />
                </div>
              </div>
            </header>

            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[6000] focus:bg-secondary focus:text-ink focus:px-3 focus:py-2 focus:border-2 focus:border-ink focus:shadow-[3px_3px_0_var(--color-ink)] focus:outline-none"
            >
              Skip to content
            </a>

            <main id="main" className="flex-1 w-full max-w-5xl mx-auto relative px-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/play" element={<Play />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>

            <Nav
              items={[
                { to: '/', label: 'Games' },
                { to: '/leaderboard', label: 'Scores' },
                { to: '/profile', label: 'Profile' },
              ]}
            />
          </div>
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
