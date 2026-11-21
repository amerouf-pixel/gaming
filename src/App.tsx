import React, { useState, useEffect, useCallback } from 'react';
import { AppRoute } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider, useGame } from './context/GameContext';
import { LocaleProvider, useLocale } from './context/LocaleContext';
import { ToastProvider } from './context/ToastContext';
import { DISCORD_INVITE_URL, DiscordIcon } from './config/community';
import { ErrorBoundary } from './components/ErrorBoundary';
import { CyberBackground } from './components/CyberBackground';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/views/HomeView';
import { ProgressionView } from './components/views/ProgressionView';
import { VehiclesView } from './components/views/VehiclesView';
import { MapView } from './components/views/MapView';
import { NotesView } from './components/views/NotesView';
import { StatsView } from './components/views/StatsView';
import { ModalNewItem, NewItemModalType } from './components/ModalNewItem';
import { LandingPage } from './components/LandingPage';
import { DemoPage } from './components/DemoPage';
import { PricingPage } from './components/PricingPage';
import { StreamersLaunchPage } from './components/StreamersLaunchPage';
import { AccountPage } from './components/AccountPage';
import { StreamerOverlay } from './components/StreamerOverlay';
import { useAchievementWatcher } from './hooks/useAchievementWatcher';
import { AlertTriangle, X } from 'lucide-react';

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
  const {
    currentTab,
    objectives,
    activeTheme,
    setSyncedCustomProfiles,
    storageError,
    clearStorageError,
  } = useGame();
  const { customProfiles, cloudError, clearCloudError } = useAuth();
  const { appCopy } = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultType, setModalDefaultType] = useState<NewItemModalType>('mission');
  const [activeRoute, setActiveRoute] = useState<AppRoute>(() =>
    typeof window !== 'undefined' ? parseRouteFromPath(window.location.pathname) : 'landing'
  );

  const isSunsetNeon = activeTheme === 'sunset-neon';

  const openNewItemModal = useCallback((defaultType: NewItemModalType = 'mission') => {
    setModalDefaultType(defaultType);
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    setSyncedCustomProfiles(customProfiles);
  }, [customProfiles, setSyncedCustomProfiles]);

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
            onOpenNewItemModal={() => openNewItemModal('mission')}
            onOpenStreamer={() => navigate('overlay')}
          />
        );
      case 'progression':
        return <ProgressionView onOpenNewItemModal={openNewItemModal} />;
      case 'garage':
        return <VehiclesView onOpenNewItemModal={() => openNewItemModal('vehicle')} />;
      case 'map':
        return <MapView />;
      case 'notes':
        return <NotesView onOpenNewItemModal={() => openNewItemModal('note')} />;
      case 'stats':
        return <StatsView onOpenAccount={() => navigate('account')} />;
      default:
        return (
          <HomeView
            onOpenNewItemModal={() => openNewItemModal('mission')}
            onOpenStreamer={() => navigate('overlay')}
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
      <CyberBackground />

      <Header
        onOpenLanding={() => navigate('landing')}
        onOpenAccount={() => navigate('account')}
      />

      <BottomNav onOpenStreamer={() => navigate('overlay')} />

      {(storageError || cloudError) && (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="p-3 bg-rose-950/75 border border-rose-500/60 rounded-xl text-xs text-rose-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{storageError || cloudError}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (storageError) clearStorageError();
                if (cloudError) clearCloudError();
              }}
              className="p-1 text-rose-300 hover:text-white cursor-pointer"
              aria-label={appCopy.common.dismissAlert}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {renderActiveView()}
      </main>

      <footer className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-5 pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 mt-8">
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono-code text-slate-400">
          <button type="button" onClick={() => navigate('landing')} className="hover:text-[#00f0ff] cursor-pointer">
            {appCopy.footer.overview}
          </button>
          <button type="button" onClick={() => navigate('demo')} className="hover:text-[#00f0ff] cursor-pointer">
            {appCopy.footer.demo}
          </button>
          <button type="button" onClick={() => navigate('pricing')} className="hover:text-[#00f0ff] cursor-pointer">
            {appCopy.footer.pricing}
          </button>
          <button type="button" onClick={() => navigate('streamers')} className="hover:text-[#00f0ff] cursor-pointer">
            {appCopy.footer.streamers}
          </button>
          <button type="button" onClick={() => navigate('account')} className="hover:text-[#00f0ff] cursor-pointer">
            {appCopy.footer.accountCloud}
          </button>
          <a
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#8c96ff] hover:text-white transition-colors"
          >
            <DiscordIcon className="w-3.5 h-3.5" />
            <span>{appCopy.footer.discord}</span>
          </a>
        </div>
        <span className="text-[11px] font-mono-code text-slate-500/90 select-none">
          JITALX · © 2026 10JITAL PROD
        </span>
      </footer>

      <ModalNewItem
        isOpen={isModalOpen}
        defaultType={modalDefaultType}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <LocaleProvider>
        <AuthProvider>
          <GameProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </GameProvider>
        </AuthProvider>
      </LocaleProvider>
    </ErrorBoundary>
  );
}
