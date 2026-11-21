import React from 'react';
import { AppRoute } from '../types';
import { useGame } from '../context/GameContext';
import { useToast } from '../context/ToastContext';
import { useLocale, LanguageSwitcher } from '../context/LocaleContext';
import { cyberAudio } from '../utils/cyberAudio';
import { CommercialNav } from './CommercialNav';
import { HoloRadar } from './HoloRadar';
import {
  CheckCircle2,
  Circle,
  Trophy,
  Video,
  ArrowRight,
  Compass,
  Sparkles,
  Volume2,
} from 'lucide-react';

interface DemoPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const DemoPage: React.FC<DemoPageProps> = ({ onNavigate }) => {
  const {
    missions,
    collectibles,
    overallProgress,
    stats,
    toggleMissionStep,
    toggleCollectible,
    activeProfile,
  } = useGame();
  const { triggerAchievement } = useToast();
  const { copy } = useLocale();
  const t = copy.demo;

  const demoMission = missions.find((m) => m.status === 'in_progress') || missions[0];
  const demoCollectibles = collectibles.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0a0910] text-slate-100 flex flex-col font-sans overflow-x-hidden">
      <CommercialNav activeRoute="demo" onNavigate={onNavigate} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-mono-code text-[#00f0ff] uppercase tracking-[0.14em]">
                {t.kicker}
              </p>
              <LanguageSwitcher />
            </div>
            <h1
              className="text-3xl sm:text-5xl font-hud font-bold text-white leading-tight tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              {t.heading}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{t.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                cyberAudio.playChirp();
                onNavigate('overlay');
              }}
              className="px-4 py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-slate-100 text-xs font-semibold tracking-wide flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors"
            >
              <Video className="w-4 h-4 text-[#ff2a85]" />
              <span>{t.testObsCta}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                cyberAudio.playTargetAcquired();
                onNavigate('app');
              }}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#ff2a85] via-[#ff5c4d] to-[#ff7b00] hover:brightness-110 text-white text-xs font-semibold tracking-wide flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-[0_10px_28px_-8px_rgba(255,42,133,0.5)] transition-all"
            >
              <span>{t.openFullAppCta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Sync Status Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-[#110e1c] border border-white/10 p-5">
            <div className="text-xs text-slate-400">{t.statProgress}</div>
            <div className="text-2xl font-hud font-bold text-[#00f0ff] font-mono-code tabular-nums mt-1">
              {overallProgress}%
            </div>
          </div>
          <div className="rounded-xl bg-[#110e1c] border border-white/10 p-5">
            <div className="text-xs text-slate-400">{t.statMissions}</div>
            <div className="text-2xl font-hud font-bold text-white font-mono-code tabular-nums mt-1">
              {stats.missionsDone} / {stats.missionsTotal}
            </div>
          </div>
          <div className="rounded-xl bg-[#110e1c] border border-white/10 p-5">
            <div className="text-xs text-slate-400">{t.statCollectibles}</div>
            <div className="text-2xl font-hud font-bold text-[#ff7b00] font-mono-code tabular-nums mt-1">
              {stats.collectiblesDone} / {stats.collectiblesTotal}
            </div>
          </div>
          <div className="rounded-xl bg-[#110e1c] border border-white/10 p-5">
            <div className="text-xs text-slate-400">{t.statUniverse}</div>
            <div className="text-lg font-hud font-bold text-white truncate mt-1">
              {activeProfile.name}
            </div>
          </div>
        </div>

        {/* Interactive Workspace Split: Live Mission & Collectibles + Achievement Audio Trigger */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Mission Checklist */}
          <div className="lg:col-span-7 rounded-2xl bg-[#110e1c] border border-white/10 p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3.5">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#00f0ff]" />
                <h2 className="font-hud font-bold text-lg text-white">{t.missionCardTitle}</h2>
              </div>
              <span className="text-xs font-mono-code text-[#ff7b00]">{t.missionHint}</span>
            </div>

            {demoMission && (
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-mono-code text-slate-400">
                    {demoMission.district} · {demoMission.giver}
                  </div>
                  <h3 className="font-hud font-bold text-xl text-white mt-0.5">
                    {demoMission.title}
                  </h3>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    {demoMission.description}
                  </p>
                </div>

                <div className="space-y-2">
                  {demoMission.steps.map((step) => (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => {
                        cyberAudio.playClick();
                        toggleMissionStep(demoMission.id, step.id);
                      }}
                      className="w-full text-left flex items-center gap-3 p-3.5 rounded-xl bg-black/35 border border-white/[0.08] hover:border-[#00f0ff]/60 transition-colors cursor-pointer"
                    >
                      {step.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          step.completed ? 'line-through text-slate-500' : 'text-slate-100'
                        }`}
                      >
                        {step.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Col: Collectibles + Audio Trophy Test */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl bg-[#110e1c] border border-white/10 p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3.5">
                <Sparkles className="w-5 h-5 text-[#ff7b00]" />
                <h2 className="font-hud font-bold text-lg text-white">{t.collectiblesCardTitle}</h2>
              </div>

              <div className="space-y-2.5">
                {demoCollectibles.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      cyberAudio.playChirp();
                      toggleCollectible(item.id);
                    }}
                    className="w-full text-left p-3.5 rounded-xl bg-black/35 border border-white/[0.08] hover:border-[#ff7b00]/60 transition-colors cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div
                        className={`text-sm font-medium truncate ${
                          item.collected ? 'line-through text-slate-500' : 'text-white'
                        }`}
                      >
                        {item.name}
                      </div>
                      <div className="text-xs font-mono-code text-slate-400">
                        {item.district} · {item.coordinates}
                      </div>
                    </div>
                    {item.collected ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#110e1c] border border-[#00f0ff]/25 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#00f0ff]" />
                <h2 className="font-hud font-bold text-lg text-white">{t.audioCardTitle}</h2>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{t.audioCardDesc}</p>
              <button
                type="button"
                onClick={() => triggerAchievement(t.trophyTitle, 'platinum', t.trophyDesc)}
                className="w-full py-2.5 px-4 rounded-lg bg-[#00f0ff]/12 hover:bg-[#00f0ff]/22 border border-[#00f0ff]/50 text-[#00f0ff] font-semibold text-xs tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>{t.audioTriggerCta}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live 360° HoloRadar embedded directly in Demo */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-hud font-bold text-xl text-white">{t.radarTitle}</h2>
            <span className="text-xs font-mono-code text-slate-400">{t.radarHint}</span>
          </div>
          <HoloRadar variant="studio" onNavigateToApp={() => onNavigate('app')} />
        </div>
      </main>

      <footer className="border-t border-white/[0.08] bg-[#08070d] py-6 px-4 text-center text-xs font-mono-code text-slate-400">
        {copy.footer.copyright}
      </footer>
    </div>
  );
};
