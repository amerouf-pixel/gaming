import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useLocale } from '../context/LocaleContext';
import { cyberAudio } from '../utils/cyberAudio';
import { TabType } from '../types';
import {
  LayoutDashboard,
  Compass,
  Car,
  Video,
  Map,
  FileText,
  BarChart3,
  MoreHorizontal,
  X,
} from 'lucide-react';

interface BottomNavProps {
  onOpenStreamer?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenStreamer }) => {
  const { currentTab, setCurrentTab, stats, activeTheme } = useGame();
  const { locale, appCopy } = useLocale();
  const t = appCopy.nav;

  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const isSunsetNeon = activeTheme === 'sunset-neon';

  const progressionRemaining =
    stats.missionsTotal - stats.missionsDone + (stats.collectiblesTotal - stats.collectiblesDone);

  const primaryTabs: {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'home', label: t.home, icon: LayoutDashboard },
    {
      id: 'progression',
      label: t.progression,
      icon: Compass,
      badge: progressionRemaining,
    },
    { id: 'garage', label: t.garage, icon: Car },
  ];

  const secondaryTabs: {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'map', label: t.map, icon: Map },
    { id: 'notes', label: t.notes, icon: FileText },
    { id: 'stats', label: t.stats, icon: BarChart3 },
  ];

  const isSecondaryActive =
    currentTab === 'map' || currentTab === 'notes' || currentTab === 'stats';

  return (
    <>
      <nav
        className={`hidden md:block sticky top-16 z-30 transition-colors duration-300 ${
          isSunsetNeon
            ? 'bg-[#170632]/95 border-b border-[#ff2a85]/25'
            : 'bg-[#0c1322]/95 border-b border-cyan-950/70'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-2 overflow-x-auto">
              {primaryTabs.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      cyberAudio.playClick();
                      setCurrentTab(item.id);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 border ${
                      isActive
                        ? isSunsetNeon
                          ? 'bg-[#ff2a85]/20 text-[#00f0ff] border-[#ff2a85]/60 glow-pink'
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 glow-cyan'
                        : 'text-slate-300 hover:text-white hover:bg-white/5 border-transparent'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? isSunsetNeon
                            ? 'text-[#ff2a85]'
                            : 'text-cyan-400'
                          : 'text-slate-400'
                      }`}
                    />
                    <span className="font-hud uppercase">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-0.5 text-[11px] font-mono-code tabular-nums text-[#00f0ff]">
                        ({item.badge})
                      </span>
                    )}
                  </button>
                );
              })}

              {onOpenStreamer && (
                <button
                  type="button"
                  onClick={() => {
                    cyberAudio.playChirp();
                    onOpenStreamer();
                  }}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-hud font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 border ${
                    isSunsetNeon
                      ? 'bg-gradient-to-r from-[#ff2a85]/20 to-[#ff7b00]/20 hover:from-[#ff2a85]/35 hover:to-[#ff7b00]/30 text-[#ff7b00] border-[#ff2a85]/55'
                      : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border-rose-500/50'
                  }`}
                >
                  <Video className="w-4 h-4 text-[#ff2a85]" />
                  <span>{t.studioObs}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 pl-3 border-l border-white/10 shrink-0">
              {secondaryTabs.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      cyberAudio.playClick();
                      setCurrentTab(item.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap border ${
                      isActive
                        ? isSunsetNeon
                          ? 'bg-[#00f0ff]/15 text-[#00f0ff] border-[#00f0ff]/45'
                          : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
                        : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="font-hud">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Secondary Drawer */}
      {mobileToolsOpen && (
        <div className="md:hidden fixed bottom-16 right-3 z-50 bg-[#170632] border border-[#ff2a85]/50 shadow-2xl p-2 space-y-1 min-w-[185px]">
          <div className="flex items-center justify-between px-2 py-1 text-[10px] font-mono-code uppercase text-slate-400">
            <span>{locale === 'fr' ? 'Outils secondaires' : 'More Tools'}</span>
            <button
              type="button"
              onClick={() => setMobileToolsOpen(false)}
              className="text-slate-400 hover:text-white cursor-pointer"
              aria-label={appCopy.common.close}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {secondaryTabs.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  cyberAudio.playClick();
                  setCurrentTab(item.id);
                  setMobileToolsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-hud uppercase cursor-pointer ${
                  active
                    ? 'bg-[#ff2a85]/20 text-[#00f0ff] border border-[#ff2a85]/50'
                    : 'text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg px-2 py-1.5 safe-area-pb ${
          isSunsetNeon
            ? 'bg-[#120428]/95 border-t border-[#ff2a85]/35'
            : 'bg-[#090d16]/95 border-t border-cyan-950/80'
        }`}
      >
        <div className="flex items-center justify-around gap-1 max-w-lg mx-auto">
          {primaryTabs.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  cyberAudio.playClick();
                  setMobileToolsOpen(false);
                  setCurrentTab(item.id);
                }}
                className={`relative flex flex-col items-center justify-center py-1 px-2 transition-all cursor-pointer ${
                  isActive
                    ? isSunsetNeon
                      ? 'text-[#00f0ff]'
                      : 'text-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-105' : ''}`} />
                <span
                  className={`text-[10px] mt-1 font-hud tracking-tight leading-none ${
                    isActive
                      ? isSunsetNeon
                        ? 'font-bold text-[#ff7b00]'
                        : 'font-bold text-cyan-300'
                      : 'font-medium'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}

          {onOpenStreamer && (
            <button
              type="button"
              onClick={() => {
                cyberAudio.playChirp();
                setMobileToolsOpen(false);
                onOpenStreamer();
              }}
              className="relative flex flex-col items-center justify-center py-1 px-2 text-[#ff2a85] hover:text-[#ff7b00] transition-all cursor-pointer"
            >
              <Video className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-hud font-bold tracking-tight leading-none">
                OBS
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              setMobileToolsOpen((prev) => !prev);
            }}
            className={`relative flex flex-col items-center justify-center py-1 px-2 transition-all cursor-pointer ${
              isSecondaryActive || mobileToolsOpen
                ? 'text-[#00f0ff]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-hud tracking-tight leading-none">
              {locale === 'fr' ? 'Outils' : 'More'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
