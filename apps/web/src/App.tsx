
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from './config/wagmi';
import { Home } from './pages/Home';
import { Play } from './pages/Play';
import { Leaderboard } from './pages/Leaderboard';
import { Profile } from './pages/Profile';
import { WalletStatus } from './components/WalletStatus';
import { TemporalBackground } from './components/TemporalBackground';

const queryClient = new QueryClient();

const NavIcon: React.FC<{ icon: string, label: string, to: string, active: boolean }> = ({ icon, label, to, active }) => (
  <Link to={to} className={`flex flex-col items-center gap-1 flex-1 py-2.5 transition-all relative ${active ? 'text-primary scale-105' : 'text-white/40 hover:text-white/70'}`}>
    <span className="text-xl drop-shadow-[0_0_8px_rgba(0,240,255,0.3)]">{icon}</span>
    <span className="font-arcade text-[6px] tracking-tighter uppercase">{label}</span>
    {active && (
      <span className="absolute bottom-0.5 w-6 h-0.5 bg-primary rounded-full shadow-[0_0_6px_var(--color-primary)]" />
    )}
  </Link>
);

const BottomNav: React.FC = () => {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10 flex justify-around px-2 pb-safe">
      <NavIcon icon="🎮" label="Games" to="/" active={location.pathname === '/'} />
      <NavIcon icon="📊" label="Scores" to="/leaderboard" active={location.pathname === '/leaderboard'} />
      <NavIcon icon="👤" label="Profile" to="/profile" active={location.pathname === '/profile'} />
    </nav>
  );
};

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen relative flex flex-col pb-20">
            <TemporalBackground />
            
            {/* Tech Status Bar */}
            <header className="w-full px-6 py-4 flex items-center justify-between sticky top-0 z-50 glass-panel border-b border-white/5 backdrop-blur-xl">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--color-primary)]" />
                <span className="font-arcade text-[10px] tracking-widest text-primary text-glow-primary">
                  CELO ATARI
                </span>
              </Link>
              
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-6 mr-4">
                  <span className="tech-label opacity-40">System: <span className="text-success text-glow-success font-bold">Operational</span></span>
                  <span className="tech-label opacity-40">Network: <span className="text-secondary text-glow-primary">Mainnet</span></span>
                </div>
                <WalletStatus />
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-5xl mx-auto relative px-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/play/:gameId" element={<Play />} />
                <Route path="/play" element={<Play />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>

            <BottomNav />
          </div>
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;

