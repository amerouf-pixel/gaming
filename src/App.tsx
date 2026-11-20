import React, { useState, useEffect, useCallback } from 'react';
import { AppRoute } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider, useGame } from './context/GameContext';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CyberBackground } from './components/CyberBackground';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/views/HomeView';
import { MissionsView } from './components/views/MissionsView';
import { CollectiblesView } from './components/views/CollectiblesView';
import { VehiclesView } from './components/views/VehiclesView';
import { ObjectivesView } from './components/views/ObjectivesView';
import { NotesView } from './components/views/NotesView';
import { StatsView } from './components/views/StatsView';
import { ModalNewItem } from './components/ModalNewItem';
import { LandingPage } from './components/LandingPage';
import { DemoPage } from './components/DemoPage';
import { PricingPage } from './components/PricingPage';
import { StreamersLaunchPage } from './components/StreamersLaunchPage';
import { AccountPage } from './components/AccountPage';
import { StreamerOverlay } from './components/StreamerOverlay';
import { useAchievementWatcher } from './hooks/useAchievementWatcher';

const ROUTE_TO_PATH: Record<AppRoute, string> = {
  landing: '/',
  app: '/app',
  demo: '/demo',
  pricing: '/pricing',
  streamers: '/streamers',
  account: '/account',
  overlay: '/overlay',
};

function parseRouteFromPath(pathname: string): AppRoute {
  const clean = pathname.replace(/\/+$/, '') || '/';
  switch (clean) {
    case '/app':
      return 'app';
    case '/demo':
      return 'demo';
    case '/pricing':
      return 'pricing';
    case '/streamers':
      return 'streamers';
    case '/account':
      return 'account';
    case '/overlay':
      return 'overlay';
    case '/':
    default:
      return 'landing';
  }
}

const AppContent: React.FC = () => {
  const { currentTab, objectives, activeTheme, setSyncedCustomProfiles } = useGame();
  const { customProfiles } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState<AppRoute>(() =>
    typeof window !== 'undefined' ? parseRouteFromPath(window.location.pathname) : 'landing'
  );

  const isSunsetNeon = activeTheme === 'sunset-neon';

  // Sync Firestore custom game profiles into GameContext
  useEffect(() => {
    setSyncedCustomProfiles(customProfiles);
  }, [customProfiles, setSyncedCustomProfiles]);

  // Keep browser history synchronized for clean Vercel SPA routes
  useEffect(() => {
    const handlePopState = () => {
      setActiveRoute(parseRouteFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((route: AppRoute) => {
    setActiveRoute(route);
    if (typeof window !== 'undefined') {
      const targetPath = ROUTE_TO_PATH[route];
      if (window.location.pathname !== targetPath) {
        try {
          window.history.pushState({}, '', targetPath);
        } catch {
          // ignore sandbox history restriction
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Automatically listen for objective completion and dispatch achievement toasts
  useAchievementWatcher(objectives);

  if (activeRoute === 'overlay') {
    return <StreamerOverlay onExit={() => navigate('app')} />;
  }

  if (activeRoute === 'landing') {
    return <LandingPage onEnterApp={() => navigate('app')} onNavigate={navigate} />;
  }

  if (activeRoute === 'demo') {
    return <DemoPage onNavigate={navigate} />;
  }

  if (activeRoute === 'pricing') {
    return <PricingPage onNavigate={navigate} />;
  }

  if (activeRoute === 'streamers') {
    return <StreamersLaunchPage onNavigate={navigate} />;
  }

  if (activeRoute === 'account') {
    return <AccountPage onNavigate={navigate} />;
  }

  const renderActiveView = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeView
            onOpenNewItemModal={() => setIsModalOpen(true)}
            onOpenLanding={() => navigate('landing')}
          />
        );
      case 'missions':
        return <MissionsView onOpenNewItemModal={() => setIsModalOpen(true)} />;
      case 'collectibles':
        return <CollectiblesView onOpenNewItemModal={() => setIsModalOpen(true)} />;
      case 'vehicles':
        return <VehiclesView onOpenNewItemModal={() => setIsModalOpen(true)} />;
      case 'objectives':
        return <ObjectivesView />;
      case 'notes':
        return <NotesView onOpenNewItemModal={() => setIsModalOpen(true)} />;
      case 'stats':
        return <StatsView />;
      default:
        return (
          <HomeView
            onOpenNewItemModal={() => setIsModalOpen(true)}
            onOpenLanding={() => navigate('landing')}
          />
        );
    }
  };

  return (
    <div
      className={`relative min-h-screen text-slate-100 flex flex-col font-sans transition-colors duration-500 ${
        isSunsetNeon
          ? 'bg-[#120428] selection:bg-[#ff2a85]/30 selection:text-[#00f0ff]'
          : 'bg-[#090d16] selection:bg-cyan-500/30 selection:text-cyan-200'
      }`}
    >
      {/* Tactical Multi-Layer Background (Grid, CRT, Grain, Vignette) */}
      <CyberBackground />

      {/* Tactical Top Bar */}
      <Header
        onOpenLanding={() => navigate('landing')}
        onOpenStreamer={() => navigate('overlay')}
        onOpenAccount={() => navigate('account')}
      />

      {/* Main Tab Navigation */}
      <BottomNav />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {renderActiveView()}
      </main>

      {/* Discreet 10JITAL Production Signature & Commercial Links */}
      <footer className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-5 pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 mt-8">
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono-code text-slate-400">
          <button onClick={() => navigate('landing')} className="hover:text-[#00f0ff] cursor-pointer">
            Accueil
          </button>
          <button onClick={() => navigate('demo')} className="hover:text-[#00f0ff] cursor-pointer">
            Démo
          </button>
          <button onClick={() => navigate('pricing')} className="hover:text-[#00f0ff] cursor-pointer">
            Tarifs
          </button>
          <button onClick={() => navigate('streamers')} className="hover:text-[#00f0ff] cursor-pointer">
            GTA 6 Streamers (EN)
          </button>
          <button onClick={() => navigate('account')} className="hover:text-[#00f0ff] cursor-pointer">
            Compte &amp; Cloud
          </button>
        </div>
        <span className="text-[11px] font-mono-code text-slate-500/90 select-none">
          JITALX · © 2026 10JITAL Production
        </span>
      </footer>

      {/* Add New Entry Modal */}
      <ModalNewItem isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <GameProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </GameProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
