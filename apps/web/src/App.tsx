
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from './config/wagmi';
import { Home } from './pages/Home';
import { Play } from './pages/Play';
import { Leaderboard } from './pages/Leaderboard';
import { WalletStatus } from './components/WalletStatus';
import { TemporalBackground } from './components/TemporalBackground';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <TemporalBackground />
          <div className="min-h-screen text-cream font-sans relative z-10 flex flex-col">
            {/* Navigation Header — arcade machine top strip */}
            <header className="w-full px-4 sm:px-6 py-3 flex items-center justify-between border-b-[3px] border-[#2d2440] sticky top-0 z-50"
              style={{
                background: 'linear-gradient(180deg, #1a1024, #120b1a)',
                boxShadow: '0 4px 0 #0a0614',
              }}
            >
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center text-secondary font-black text-sm"
                  style={{ boxShadow: '0 3px 0 #8a8c1a' }}
                >
                  G
                </div>
                <span className="font-arcade text-[10px] sm:text-xs tracking-wider hidden sm:block text-cream">
                  CELO ATARI GAMES
                </span>
              </Link>
              
              <div className="flex items-center gap-3">
                <nav className="hidden sm:flex items-center gap-2 mr-3">
                  <Link to="/play" className="hw-chip hover:text-primary transition-colors text-xs uppercase tracking-wider">
                    PLAY
                  </Link>
                  <Link to="/leaderboard" className="hw-chip hover:text-accent transition-colors text-xs uppercase tracking-wider">
                    LEADERBOARD
                  </Link>
                </nav>
                <WalletStatus />
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-5xl mx-auto relative px-4 sm:px-6">
              <div className="py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/play" element={<Play />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                </Routes>
              </div>
            </main>
            
            {/* Footer — arcade cabinet base */}
            <footer className="w-full py-4 flex flex-row flex-wrap items-center justify-center gap-4 text-xs border-t-[3px] border-[#2d2440] mt-auto"
              style={{
                background: 'linear-gradient(180deg, #120b1a, #0a0614)',
                boxShadow: '0 -4px 0 #0a0614',
              }}
            >
              <a href="https://github.com/cryptoflops/celo-atari-games" target="_blank" rel="noopener noreferrer" className="hw-chip hover:text-primary transition-colors">
                [GitHub]
              </a>
              <a href="https://docs.minipay.xyz" target="_blank" rel="noopener noreferrer" className="hw-chip hover:text-primary transition-colors">
                [MiniPay Docs]
              </a>
              <a href="https://talent.app/~/earn/celo-proof-of-ship" target="_blank" rel="noopener noreferrer" className="hw-chip hover:text-primary transition-colors">
                [Celo Proof of Ship]
              </a>
            </footer>
          </div>
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
