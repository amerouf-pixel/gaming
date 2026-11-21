import React from 'react';
import { useGame } from '../../context/GameContext';
import { useLocale } from '../../context/LocaleContext';
import { HoloRadar } from '../HoloRadar';
import { DashboardMiniTelemetryChart } from '../charts/DashboardMiniTelemetryChart';
import { cyberAudio } from '../../utils/cyberAudio';
import { DISCORD_INVITE_URL, DiscordIcon } from '../../config/community';
import {
  getDefaultVehicleImage,
  getVehicleCategoryLabel,
  isValidImageUrl,
} from '../../utils/vehicleVisuals';
import {
  Compass,
  Sparkles,
  Car,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Circle,
  Pin,
  MapPin,
  Plus,
  Video,
  Map,
  Info,
  Clock,
  Award,
  ExternalLink,
} from 'lucide-react';

interface HomeViewProps {
  onOpenNewItemModal: () => void;
  onOpenStreamer?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenNewItemModal, onOpenStreamer }) => {
  const {
    activeProfile,
    overallProgress,
    stats,
    missions,
    collectibles,
    vehicles,
    objectives,
    notes,
    activityLog,
    setCurrentTab,
    openProgressionTab,
    toggleMissionStep,
    toggleCollectible,
  } = useGame();
  const { locale, appCopy } = useLocale();
  const t = appCopy.home;

  const inProgressMissions = missions.filter((m) => m.status === 'in_progress');
  const activeMission =
    inProgressMissions[0] ||
    missions.find((m) => m.priority && m.status !== 'completed') ||
    missions.find((m) => m.status !== 'completed') ||
    missions[0];

  const priorityObjectives = objectives.filter((o) => !o.completed).slice(0, 3);
  const unlockedObjectives = objectives.filter((o) => o.completed);
  const nextCollectibles = collectibles.filter((c) => !c.collected).slice(0, 3);
  const ownedVehicles = vehicles.filter((v) => v.unlocked);
  const featuredVehicle =
    ownedVehicles.find((v) => v.isFavorite) ||
    ownedVehicles[0] ||
    vehicles.find((v) => v.isFavorite) ||
    vehicles[0];
  const pinnedNotes = notes.filter((n) => n.pinned).slice(0, 2);

  const totalItems =
    stats.missionsTotal + stats.collectiblesTotal + stats.vehiclesTotal + stats.objectivesTotal;
  const completedItems =
    stats.missionsDone + stats.collectiblesDone + stats.vehiclesUnlocked + stats.objectivesDone;

  const featuredVehicleSrc = featuredVehicle
    ? isValidImageUrl(featuredVehicle.imageUrl)
      ? featuredVehicle.imageUrl!
      : getDefaultVehicleImage(featuredVehicle.category)
    : '';

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* 1. CENTRE DE COMMANDEMENT — HERO UNIFIÉ STYLE STREAMER STUDIO */}
      <section className="jitalx-panel p-5 sm:p-7 relative overflow-hidden jitalx-chamfer">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code text-slate-300">
              <span className="text-[#00f0ff] font-semibold uppercase tracking-wider">
                {t.heroTitlePrefix}
              </span>
              <span className="text-slate-600">·</span>
              <span>{activeProfile.name}</span>
              <span className="text-slate-600">·</span>
              <span className="text-[#ff7b00]">{activeProfile.universe}</span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold font-hud text-white tracking-wide uppercase">
                {t.statCompletion}
              </h1>
              <span className="text-2xl sm:text-3xl font-bold font-mono-code text-[#00f0ff] tabular-nums">
                {overallProgress}%
              </span>
            </div>

            <div className="max-w-xl space-y-1.5">
              <div className="h-2.5 w-full bg-[#090216] border border-[#ff2a85]/40 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#00f0ff] transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-400 tabular-nums">
                <span>
                  {completedItems} / {totalItems} {locale === 'fr' ? 'éléments complétés' : 'items completed'}
                </span>
                <span>
                  {inProgressMissions.length}{' '}
                  {locale === 'fr'
                    ? `mission${inProgressMissions.length > 1 ? 's' : ''} en cours`
                    : `active mission${inProgressMissions.length > 1 ? 's' : ''}`}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Command Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onOpenStreamer && (
              <button
                type="button"
                onClick={() => {
                  cyberAudio.playChirp();
                  onOpenStreamer();
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] hover:brightness-110 text-white font-hud font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_18px_rgba(255,42,133,0.35)] whitespace-nowrap"
              >
                <Video className="w-4 h-4" />
                <span>{t.openObsStudio}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                cyberAudio.playClick();
                setCurrentTab('map');
              }}
              className="px-4 py-2.5 bg-[#0b021a] hover:bg-[#1e0940] border border-[#00f0ff]/55 text-[#00f0ff] font-hud font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
            >
              <Map className="w-4 h-4" />
              <span>{appCopy.nav.map}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                cyberAudio.playClick();
                onOpenNewItemModal();
              }}
              className="px-4 py-2.5 bg-[#00f0ff] hover:bg-[#4ff6ff] text-[#120428] font-hud font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{t.quickAdd}</span>
            </button>
          </div>
        </div>

        {/* 4 Real KPI Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              openProgressionTab('missions');
            }}
            className="text-left p-3.5 jitalx-panel-deep hover:border-[#00f0ff]/55 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-hud font-bold uppercase">{t.statMissions}</span>
              <Compass className="w-4 h-4 text-[#00f0ff]" />
            </div>
            <div className="text-2xl font-bold font-mono-code text-white tabular-nums">
              {stats.missionsDone}
              <span className="text-xs text-slate-500 font-normal"> / {stats.missionsTotal}</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-[#00f0ff] h-full transition-all duration-500"
                style={{ width: `${(stats.missionsDone / (stats.missionsTotal || 1)) * 100}%` }}
              />
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              openProgressionTab('collectibles');
            }}
            className="text-left p-3.5 jitalx-panel-deep hover:border-amber-400/55 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-hud font-bold uppercase">{t.statCollectibles}</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono-code text-white tabular-nums">
              {stats.collectiblesDone}
              <span className="text-xs text-slate-500 font-normal"> / {stats.collectiblesTotal}</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-amber-400 h-full transition-all duration-500"
                style={{
                  width: `${(stats.collectiblesDone / (stats.collectiblesTotal || 1)) * 100}%`,
                }}
              />
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              setCurrentTab('garage');
            }}
            className="text-left p-3.5 jitalx-panel-deep hover:border-emerald-400/55 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-hud font-bold uppercase">{t.statGarage}</span>
              <Car className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono-code text-white tabular-nums">
              {stats.vehiclesUnlocked}
              <span className="text-xs text-slate-500 font-normal"> / {stats.vehiclesTotal}</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full transition-all duration-500"
                style={{
                  width: `${(stats.vehiclesUnlocked / (stats.vehiclesTotal || 1)) * 100}%`,
                }}
              />
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              openProgressionTab('objectives');
            }}
            className="text-left p-3.5 jitalx-panel-deep hover:border-[#ff2a85]/55 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-hud font-bold uppercase">{t.statObjectives}</span>
              <Trophy className="w-4 h-4 text-[#ff7b00]" />
            </div>
            <div className="text-2xl font-bold font-mono-code text-white tabular-nums">
              {stats.objectivesDone}
              <span className="text-xs text-slate-500 font-normal"> / {stats.objectivesTotal}</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] h-full transition-all duration-500"
                style={{
                  width: `${(stats.objectivesDone / (stats.objectivesTotal || 1)) * 100}%`,
                }}
              />
            </div>
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono-code text-slate-400 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#00f0ff] shrink-0" />
          <span>{appCopy.common.multiGameNote}</span>
        </div>
      </section>

      {/* 2. COLONNES OPÉRATIONNELLES : MISSIONS, OBJECTIFS, COLLECTIBLES + GARAGE, ACTIVITÉS, NOTES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT 8 COLS */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Mission */}
          <div className="jitalx-panel p-5 space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono-code">
                <Compass className="w-4 h-4 text-[#ff2a85]" />
                <span className="font-hud font-bold text-white uppercase tracking-wider text-sm">
                  {t.priorityMissionHeading}
                </span>
                {activeMission && (
                  <>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">{activeMission.district}</span>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  cyberAudio.playClick();
                  openProgressionTab('missions');
                }}
                className="text-xs text-[#00f0ff] hover:underline font-hud font-bold uppercase flex items-center gap-1 cursor-pointer"
              >
                <span>{t.openMissions}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {activeMission ? (
              <div className="space-y-3">
                <div>
                  <h2 className="text-xl font-bold font-hud text-white">{activeMission.title}</h2>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    {activeMission.description}
                  </p>
                </div>

                <div className="space-y-1.5 jitalx-panel-deep p-3">
                  {activeMission.steps.map((step) => (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => {
                        cyberAudio.playClick();
                        toggleMissionStep(activeMission.id, step.id);
                      }}
                      className="w-full text-left flex items-center gap-3 p-2 hover:bg-white/5 cursor-pointer transition-colors"
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

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code text-slate-400">
                  <span>
                    {appCopy.missions.giverLabel}: {activeMission.giver}
                  </span>
                  <span className="text-[#00f0ff] tabular-nums">
                    +{activeMission.rewardXp} XP · +{activeMission.rewardCredits} Cr
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 jitalx-panel-deep text-xs text-slate-400">
                {t.noPriorityMission}
              </div>
            )}
          </div>

          {/* Real 7-Day Activity Chart */}
          <DashboardMiniTelemetryChart onNavigateToStats={() => setCurrentTab('stats')} />

          {/* Priority Objectives & Trophies */}
          <div className="jitalx-panel p-5 space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#ff7b00]" />
                <h2 className="font-hud font-bold text-sm text-white uppercase tracking-wider">
                  {appCopy.progression.tabObjectives}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  cyberAudio.playClick();
                  openProgressionTab('objectives');
                }}
                className="text-xs text-[#00f0ff] hover:underline font-hud font-bold uppercase flex items-center gap-1 cursor-pointer"
              >
                <span>
                  {locale === 'fr' ? 'Gérer' : 'Manage'} ({unlockedObjectives.length}/{objectives.length})
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {priorityObjectives.length === 0 ? (
              <div className="p-3.5 jitalx-panel-deep text-xs text-emerald-300 font-mono-code flex items-center gap-2">
                <Award className="w-4 h-4 shrink-0" />
                <span>
                  {locale === 'fr'
                    ? 'Tous les objectifs configurés sont débloqués.'
                    : 'All configured objectives are unlocked.'}
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {priorityObjectives.map((obj) => {
                  const pct = Math.round((obj.progress / (obj.maxProgress || 1)) * 100);
                  return (
                    <div key={obj.id} className="p-3.5 jitalx-panel-deep space-y-2">
                      <div className="text-[11px] font-mono-code text-slate-400 flex items-center justify-between">
                        <span className="uppercase">{obj.tier}</span>
                        <span className="text-[#00f0ff] tabular-nums">
                          {obj.progress}/{obj.maxProgress}
                        </span>
                      </div>
                      <div className="font-hud font-bold text-sm text-white leading-snug">
                        {obj.title}
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#ff2a85] to-[#ff7b00]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Collectibles Remaining */}
          <div className="jitalx-panel p-5 space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h2 className="font-hud font-bold text-sm text-white uppercase tracking-wider">
                  {t.statCollectibles} ({stats.collectiblesTotal - stats.collectiblesDone}{' '}
                  {appCopy.collectibles.missing.toLowerCase()})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  cyberAudio.playClick();
                  openProgressionTab('collectibles');
                }}
                className="text-xs text-amber-300 hover:underline font-hud font-bold uppercase flex items-center gap-1 cursor-pointer"
              >
                <span>{locale === 'fr' ? 'Catalogue complet' : 'Full catalog'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {nextCollectibles.length === 0 ? (
              <div className="p-3.5 jitalx-panel-deep text-xs text-emerald-300 font-mono-code">
                {locale === 'fr'
                  ? 'Tous les collectibles de ce profil sont validés.'
                  : 'All collectibles in this game profile are collected.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {nextCollectibles.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 jitalx-panel-deep flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="text-[11px] font-mono-code text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-[#ff2a85] shrink-0" />
                        <span className="truncate">{item.district}</span>
                      </div>
                      <div className="font-hud font-bold text-sm text-white leading-snug">
                        {item.name}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">{item.hint}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        cyberAudio.playFanfare();
                        toggleCollectible(item.id);
                      }}
                      className="w-full py-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/45 text-amber-300 text-xs font-hud font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{appCopy.collectibles.collected}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT 4 COLS: VISUAL FEATURED VEHICLE, RECENT ACTIVITY, PINNED NOTES */}
        <div className="lg:col-span-4 space-y-6">
          {/* Featured Vehicle from Visual Garage */}
          {featuredVehicle && (
            <div className="jitalx-panel overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-emerald-400" />
                  <h2 className="font-hud font-bold text-sm text-white uppercase tracking-wider">
                    {t.statGarage}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    cyberAudio.playClick();
                    setCurrentTab('garage');
                  }}
                  className="text-xs text-emerald-400 hover:underline font-hud font-bold uppercase cursor-pointer"
                >
                  {locale === 'fr' ? 'Ouvrir' : 'Open'}
                </button>
              </div>

              <div className="relative aspect-[4/3] w-full bg-[#090216] overflow-hidden">
                <img
                  src={featuredVehicleSrc}
                  alt={featuredVehicle.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b021a] via-[#0b021a]/70 to-transparent p-4">
                  <div className="text-[11px] font-mono-code text-slate-300">
                    {featuredVehicle.manufacturer} ·{' '}
                    {getVehicleCategoryLabel(featuredVehicle.category, locale)}
                  </div>
                  <div className="font-hud font-bold text-lg text-white">
                    {featuredVehicle.name}
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-2.5 text-xs font-mono-code">
                <div className="flex items-center justify-between text-slate-300">
                  <span>
                    {appCopy.garage.speed} / {appCopy.garage.handling} / {appCopy.garage.armor}
                  </span>
                  <span className="text-[#00f0ff] tabular-nums">
                    {featuredVehicle.speed} · {featuredVehicle.handling} · {featuredVehicle.armor}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#ff2a85] shrink-0" />
                  <span className="truncate">{featuredVehicle.location}</span>
                </div>
              </div>
            </div>
          )}

          {/* Real Recent Activity Log */}
          <div className="jitalx-panel p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00f0ff]" />
                <h2 className="font-hud font-bold text-sm text-white uppercase tracking-wider">
                  {t.recentActivityHeading}
                </h2>
              </div>
              <span className="text-[11px] font-mono-code text-slate-400 tabular-nums">
                {activityLog.length}
              </span>
            </div>

            {activityLog.length === 0 ? (
              <p className="text-xs text-slate-400 leading-relaxed">{t.noRecentActivity}</p>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {activityLog.slice(0, 6).map((act) => (
                  <div
                    key={act.id}
                    className="p-2.5 jitalx-panel-deep flex items-start justify-between gap-2 text-xs"
                  >
                    <span className="text-slate-200 leading-snug">{act.label}</span>
                    <span className="text-[10px] font-mono-code text-slate-500 shrink-0 tabular-nums">
                      {act.timestamp.replace("Aujourd'hui, ", '')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pinned Notes */}
          <div className="jitalx-panel p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Pin className="w-4 h-4 text-[#ff7b00]" />
                <h2 className="font-hud font-bold text-sm text-white uppercase tracking-wider">
                  {appCopy.notes.pinnedSection}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  cyberAudio.playClick();
                  setCurrentTab('notes');
                }}
                className="text-xs text-[#00f0ff] hover:underline font-hud font-bold uppercase cursor-pointer"
              >
                {appCopy.nav.notes}
              </button>
            </div>

            {pinnedNotes.length === 0 ? (
              <p className="text-xs text-slate-400">{appCopy.notes.emptyTitle}</p>
            ) : (
              <div className="space-y-2">
                {pinnedNotes.map((note) => (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => {
                      cyberAudio.playClick();
                      setCurrentTab('notes');
                    }}
                    className="w-full text-left p-2.5 jitalx-panel-deep hover:border-[#00f0ff]/45 transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-xs text-[#00f0ff] mb-0.5">{note.title}</div>
                    <p className="text-xs text-slate-300 line-clamp-2 font-mono-code whitespace-pre-line">
                      {note.content}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Link: Discord Community & Support */}
          <a
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => cyberAudio.playClick()}
            className="block jitalx-panel p-4 border-[#5865F2]/45 hover:border-[#5865F2] transition-colors group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 bg-[#5865F2]/20 border border-[#5865F2]/55 flex items-center justify-center shrink-0">
                  <DiscordIcon className="w-5 h-5 text-[#8c96ff] group-hover:text-white transition-colors" />
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="font-hud font-bold text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span className="truncate">{t.discordSupportCta}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {t.discordSupportDesc}
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#8c96ff] group-hover:text-white shrink-0 mt-0.5 transition-colors" />
            </div>
          </a>
        </div>
      </div>

      {/* 3. RADAR TACTIQUE 360° */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono-code uppercase tracking-wider text-slate-400">
            {locale === 'fr' ? 'Radar de proximité 360°' : '360° Proximity Radar'}
          </span>
          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              setCurrentTab('map');
            }}
            className="text-xs font-hud font-bold uppercase text-[#00f0ff] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Map className="w-3.5 h-3.5" />
            <span>{appCopy.map.title}</span>
          </button>
        </div>
        <HoloRadar />
      </div>
    </div>
  );
};
