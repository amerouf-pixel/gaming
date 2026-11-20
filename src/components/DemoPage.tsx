import React from 'react';
import { AppRoute } from '../types';
import { useGame } from '../context/GameContext';
import { useToast } from '../context/ToastContext';
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

  const demoMission = missions.find((m) => m.status === 'in_progress') || missions[0];
  const demoCollectibles = collectibles.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#120428] text-slate-100 flex flex-col">
      <CommercialNav activeRoute="demo" onNavigate={onNavigate} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#ff2a85]/25 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs font-mono-code text-[#00f0ff] uppercase tracking-widest">
              Bac à sable interactif · Données synchronisées en direct
            </div>
            <h1 className="text-3xl sm:text-5xl font-hud font-bold text-white leading-tight">
              Testez JITALX en conditions réelles
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Chaque action effectuée sur cette page (validation d&apos;étape, collectible coché ou
              notification de trophée) met à jour votre véritable état JITALX et se reflète
              instantanément dans l&apos;Overlay OBS.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => {
                cyberAudio.playChirp();
                onNavigate('overlay');
              }}
              className="px-4 py-2.5 bg-[#1b0838] hover:bg-[#2a0c54] border border-[#ff2a85]/60 text-[#ff2a85] text-xs font-hud font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Video className="w-4 h-4" />
              <span>Tester l&apos;Overlay OBS</span>
            </button>

            <button
              onClick={() => {
                cyberAudio.playTargetAcquired();
                onNavigate('app');
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] hover:brightness-110 text-white text-xs font-hud font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-[0_0_20px_rgba(255,42,133,0.4)]"
            >
              <span>Ouvrir l&apos;application complète</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Sync Status Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#180633] border border-[#ff2a85]/30 p-4">
            <div className="text-xs text-slate-400">Progression globale</div>
            <div className="text-2xl font-hud font-bold text-[#00f0ff] font-mono-code mt-1">
              {overallProgress}%
            </div>
          </div>
          <div className="bg-[#180633] border border-[#ff2a85]/30 p-4">
            <div className="text-xs text-slate-400">Missions terminées</div>
            <div className="text-2xl font-hud font-bold text-white font-mono-code mt-1">
              {stats.missionsDone} / {stats.missionsTotal}
            </div>
          </div>
          <div className="bg-[#180633] border border-[#ff2a85]/30 p-4">
            <div className="text-xs text-slate-400">Collectibles trouvés</div>
            <div className="text-2xl font-hud font-bold text-[#ff7b00] font-mono-code mt-1">
              {stats.collectiblesDone} / {stats.collectiblesTotal}
            </div>
          </div>
          <div className="bg-[#180633] border border-[#ff2a85]/30 p-4">
            <div className="text-xs text-slate-400">Univers actif</div>
            <div className="text-lg font-hud font-bold text-white truncate mt-1">
              {activeProfile.name}
            </div>
          </div>
        </div>

        {/* Interactive Workspace Split: Live Mission & Collectibles + Achievement Audio Trigger */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Mission Checklist */}
          <div className="lg:col-span-7 bg-[#180633] border border-[#ff2a85]/35 p-6 space-y-5">
            <div className="flex items-center justify-between gap-2 border-b border-[#ff2a85]/20 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#00f0ff]" />
                <h2 className="font-hud font-bold text-lg text-white">
                  1. Checklist de mission interactive
                </h2>
              </div>
              <span className="text-xs font-mono-code text-[#ff7b00]">
                Cliquez pour cocher
              </span>
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
                  <p className="text-sm text-slate-300 mt-1">{demoMission.description}</p>
                </div>

                <div className="space-y-2">
                  {demoMission.steps.map((step) => (
                    <button
                      key={step.id}
                      onClick={() => {
                        cyberAudio.playClick();
                        toggleMissionStep(demoMission.id, step.id);
                      }}
                      className="w-full text-left flex items-center gap-3 p-3 bg-[#0e0320] border border-[#ff2a85]/25 hover:border-[#00f0ff]/60 transition-colors cursor-pointer"
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
            <div className="bg-[#180633] border border-[#ff2a85]/35 p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#ff2a85]/20 pb-3">
                <Sparkles className="w-5 h-5 text-[#ff7b00]" />
                <h2 className="font-hud font-bold text-lg text-white">
                  2. Collectibles & coordonnées
                </h2>
              </div>

              <div className="space-y-2.5">
                {demoCollectibles.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      cyberAudio.playChirp();
                      toggleCollectible(item.id);
                    }}
                    className="w-full text-left p-3 bg-[#0e0320] border border-[#ff2a85]/20 hover:border-[#ff7b00]/60 transition-colors cursor-pointer flex items-center justify-between gap-3"
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

            <div className="bg-[#180633] border border-[#00f0ff]/35 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#00f0ff]" />
                <h2 className="font-hud font-bold text-lg text-white">
                  3. Alerte HUD & synthèse audio
                </h2>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Déclenchez une notification de trophée avec son Web Audio synthétisé en temps réel.
              </p>
              <button
                onClick={() =>
                  triggerAchievement(
                    'Démo JITALX Validée',
                    'platinum',
                    'Synchronisation temps réel HUD et Overlay OBS prête pour votre session.'
                  )
                }
                className="w-full py-2.5 px-4 bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 border border-[#00f0ff]/60 text-[#00f0ff] font-hud font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>Déclencher un trophée Platine</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live 360° HoloRadar embedded directly in Demo */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-hud font-bold text-xl text-white">
              4. Radar holographique 360° en direct
            </h2>
            <span className="text-xs font-mono-code text-slate-400">
              Cliquez sur les cibles du radar pour inspecter la distance
            </span>
          </div>
          <HoloRadar />
        </div>
      </main>

      <footer className="border-t border-[#ff2a85]/25 bg-[#0e0320] py-6 px-4 text-center text-xs font-mono-code text-slate-400">
        © 2026 10JITAL Production · JITALX · THE STREAMER COMMAND HUB
      </footer>
    </div>
  );
};
