import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { useLocale } from '../context/LocaleContext';
import { cyberAudio } from '../utils/cyberAudio';
import {
  Crosshair,
  Volume2,
  VolumeX,
  Car,
  MapPin,
  CheckCircle2,
  Radio,
  ExternalLink,
} from 'lucide-react';

interface RadarTarget {
  id: string;
  type: 'mission' | 'collectible' | 'vehicle';
  title: string;
  subtitle: string;
  district: string;
  x: number; // percentage -50 to 50 relative to radar center
  y: number; // percentage -50 to 50 relative to radar center
  distanceMeters: number;
  statusText: string;
  extraInfo?: string;
  isPriority?: boolean;
}

interface HoloRadarProps {
  onNavigateToApp?: () => void;
  variant?: 'hud' | 'studio';
}

export const HoloRadar: React.FC<HoloRadarProps> = ({
  onNavigateToApp,
  variant = 'hud',
}) => {
  const {
    missions,
    collectibles,
    vehicles,
    activeTheme,
    setCurrentTab,
    openProgressionTab,
    toggleCollectible,
  } = useGame();
  const { copy } = useLocale();
  const t = copy.radar;

  const isStudio = variant === 'studio';
  const isViceSunset = !isStudio && activeTheme === 'sunset-neon';

  const [activeFilter, setActiveFilter] = useState<'all' | 'missions' | 'collectibles' | 'vehicles'>('all');
  const [selectedTarget, setSelectedTarget] = useState<RadarTarget | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(() => cyberAudio.getMuted());
  const [radarZoom, setRadarZoom] = useState<'1x' | '2x'>('1x');

  // Generate tactical coordinates on the radar from active game items
  const targets: RadarTarget[] = useMemo(() => {
    const list: RadarTarget[] = [];

    missions.slice(0, 4).forEach((m, idx) => {
      const angles = [45, 140, 230, 310];
      const rad = (angles[idx % angles.length] * Math.PI) / 180;
      const dist = 28 + idx * 8;
      list.push({
        id: m.id,
        type: 'mission',
        title: m.title,
        subtitle: m.giver,
        district: m.district,
        x: Math.cos(rad) * dist,
        y: Math.sin(rad) * dist,
        distanceMeters: 280 + idx * 340,
        statusText: m.status === 'in_progress' ? t.statusInProgress : t.statusAvailable,
        extraInfo: `+${m.rewardXp} XP · +${m.rewardCredits} Cr`,
        isPriority: m.priority,
      });
    });

    collectibles
      .filter((c) => !c.collected)
      .slice(0, 5)
      .forEach((c, idx) => {
        const angles = [85, 175, 260, 350, 115];
        const rad = (angles[idx % angles.length] * Math.PI) / 180;
        const dist = 18 + idx * 6;
        list.push({
          id: c.id,
          type: 'collectible',
          title: c.name,
          subtitle: c.category.toUpperCase(),
          district: c.district,
          x: Math.cos(rad) * dist,
          y: Math.sin(rad) * dist,
          distanceMeters: 140 + idx * 180,
          statusText: t.statusUndiscovered,
          extraInfo: c.hint,
        });
      });

    vehicles.slice(0, 3).forEach((v, idx) => {
      const angles = [195, 290, 25];
      const rad = (angles[idx % angles.length] * Math.PI) / 180;
      const dist = 36 + idx * 4;
      list.push({
        id: v.id,
        type: 'vehicle',
        title: v.name,
        subtitle: v.manufacturer,
        district: v.location,
        x: Math.cos(rad) * dist,
        y: Math.sin(rad) * dist,
        distanceMeters: 450 + idx * 520,
        statusText: v.unlocked ? t.statusUnlocked : t.statusLocked,
        extraInfo: `${t.vehicleSpeed} ${v.speed} · ${t.vehicleHandling} ${v.handling}`,
      });
    });

    return list;
  }, [missions, collectibles, vehicles, t]);

  const filteredTargets = useMemo(() => {
    if (activeFilter === 'all') return targets;
    if (activeFilter === 'missions') return targets.filter((item) => item.type === 'mission');
    if (activeFilter === 'collectibles') return targets.filter((item) => item.type === 'collectible');
    return targets.filter((item) => item.type === 'vehicle');
  }, [targets, activeFilter]);

  // Keep selected target localized if locale or data updates
  const resolvedSelectedTarget = useMemo(() => {
    if (!selectedTarget) return null;
    return targets.find((item) => item.id === selectedTarget.id) || null;
  }, [targets, selectedTarget]);

  const handleSelectTarget = (target: RadarTarget) => {
    cyberAudio.playTargetAcquired();
    setSelectedTarget(target);
  };

  const handleToggleMute = () => {
    const next = cyberAudio.toggleMute();
    setIsMuted(next);
  };

  const getTypeLabel = (type: RadarTarget['type']) => {
    if (type === 'mission') return t.typeMission;
    if (type === 'collectible') return t.typeCollectible;
    return t.typeVehicle;
  };

  const zoomFactor = radarZoom === '2x' ? 1.4 : 1;

  const containerClass = isStudio
    ? 'bg-[#110e1c] border-white/10 shadow-2xl'
    : isViceSunset
    ? 'bg-[#160631]/95 border-[#ff2a85]/40 shadow-[0_0_35px_rgba(255,42,133,0.18)]'
    : 'bg-[#070b14] border-cyan-950/90 shadow-2xl';

  const headerBorderClass = isStudio
    ? 'border-white/[0.08]'
    : isViceSunset
    ? 'border-[#ff2a85]/30'
    : 'border-cyan-950/70';

  const panelClass = isStudio
    ? 'rounded-xl bg-black/35 border-white/[0.08]'
    : isViceSunset
    ? 'bg-[#120428]/90 border-[#ff2a85]/35'
    : 'bg-[#0a101d] border-cyan-950/80';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 border transition-colors ${containerClass}`}
    >
      {/* Top HUD Header */}
      <div className={`flex items-center justify-between pb-3 mb-4 border-b ${headerBorderClass}`}>
        <div className="flex items-center gap-2.5">
          <div
            className={`p-1.5 rounded-lg border ${
              isStudio
                ? 'bg-[#00f0ff]/10 border-[#00f0ff]/35 text-[#00f0ff]'
                : isViceSunset
                ? 'bg-[#ff2a85]/15 border-[#ff2a85]/50 text-[#00f0ff]'
                : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
            }`}
          >
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="font-hud font-bold text-base sm:text-lg text-white tracking-wider">
              {t.title}
            </h2>
            <p className="text-[11px] font-mono-code text-slate-400">
              {t.subtitle} · Zoom {radarZoom}
            </p>
          </div>
        </div>

        {/* HUD Quick Audio & Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              setRadarZoom((prev) => (prev === '1x' ? '2x' : '1x'));
            }}
            className={`px-2.5 py-1 text-[11px] font-mono-code border cursor-pointer transition-colors ${
              isStudio
                ? 'rounded-lg border-white/15 bg-white/[0.05] text-[#00f0ff] hover:border-[#00f0ff]/50'
                : 'border-cyan-950 bg-slate-900/80 text-cyan-400 hover:border-cyan-500/50'
            }`}
            title={t.zoomTitle}
          >
            ZOOM {radarZoom}
          </button>

          <button
            type="button"
            onClick={handleToggleMute}
            className={`p-1.5 border transition-colors cursor-pointer ${isStudio ? 'rounded-lg' : ''} ${
              isMuted
                ? 'border-white/10 bg-white/[0.04] text-slate-500 hover:text-slate-300'
                : 'border-[#00f0ff]/45 bg-[#00f0ff]/10 text-[#00f0ff] hover:bg-[#00f0ff]/20'
            }`}
            title={isMuted ? t.unmuteTitle : t.muteTitle}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Grid: Radar Screen on Left/Center + Tactical Target Dossier on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radar Viewport (7 Cols on desktop) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div
            className={`relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] rounded-full border-2 flex items-center justify-center select-none overflow-hidden ${
              isStudio
                ? 'border-[#00f0ff]/30 bg-[#0a0812] shadow-[0_0_50px_rgba(0,240,255,0.12)]'
                : isViceSunset
                ? 'border-[#ff2a85]/50 bg-[#0e0320] shadow-[0_0_50px_rgba(255,42,133,0.22)]'
                : 'border-cyan-500/30 bg-[#040810] shadow-[0_0_50px_rgba(6,182,212,0.15)]'
            }`}
          >
            {/* Concentric Range Rings */}
            <div
              className={`absolute w-[75%] h-[75%] rounded-full border ${
                isViceSunset ? 'border-[#ff2a85]/25' : 'border-cyan-500/20'
              }`}
            />
            <div
              className={`absolute w-[50%] h-[50%] rounded-full border border-dashed ${
                isViceSunset ? 'border-[#00f0ff]/35' : 'border-cyan-500/25'
              }`}
            />
            <div
              className={`absolute w-[25%] h-[25%] rounded-full border ${
                isViceSunset ? 'border-[#ff7b00]/30' : 'border-cyan-500/20'
              }`}
            />

            {/* Crosshair Axes */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`w-full h-[1px] ${isViceSunset ? 'bg-[#ff2a85]/25' : 'bg-cyan-500/20'}`} />
              <div className={`h-full w-[1px] absolute ${isViceSunset ? 'bg-[#00f0ff]/25' : 'bg-cyan-500/20'}`} />
            </div>

            {/* Azimuth Angle Marks */}
            <span className="absolute top-2 text-[9px] font-mono-code text-[#00f0ff]/85 font-bold">N 000°</span>
            <span className="absolute bottom-2 text-[9px] font-mono-code text-[#ff2a85]/80 font-bold">S 180°</span>
            <span className="absolute right-2 text-[9px] font-mono-code text-[#ff7b00]/80 font-bold">E 090°</span>
            <span className="absolute left-2 text-[9px] font-mono-code text-[#00f0ff]/75 font-bold">
              {t.westMark}
            </span>

            {/* Rotating Radar Sweep Beam */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none animate-[spin_5s_linear_infinite]"
              style={{
                background:
                  isViceSunset || isStudio
                    ? 'conic-gradient(from 0deg, rgba(0, 240, 255, 0.36) 0deg, rgba(255, 42, 133, 0.14) 45deg, transparent 78deg)'
                    : 'conic-gradient(from 0deg, rgba(6, 182, 212, 0.4) 0deg, rgba(6, 182, 212, 0.08) 45deg, transparent 75deg)',
              }}
            />

            {/* Center Player Beacon */}
            <div className="relative z-10 w-3 h-3 rounded-full flex items-center justify-center bg-[#00f0ff] shadow-[0_0_12px_#00f0ff]">
              <div
                className={`w-6 h-6 rounded-full border animate-ping opacity-75 ${
                  isViceSunset || isStudio ? 'border-[#ff2a85]' : 'border-cyan-400'
                }`}
              />
            </div>

            {/* Interactive Target Blips */}
            {filteredTargets.map((target) => {
              const isSelected = resolvedSelectedTarget?.id === target.id;
              const posX = target.x * zoomFactor;
              const posY = target.y * zoomFactor;

              let colorClasses = 'bg-cyan-400 text-cyan-300 shadow-[0_0_8px_#06b6d4]';
              if (target.type === 'collectible') {
                colorClasses = 'bg-amber-400 text-amber-300 shadow-[0_0_8px_#fbbf24]';
              } else if (target.type === 'vehicle') {
                colorClasses = 'bg-emerald-400 text-emerald-300 shadow-[0_0_8px_#34d399]';
              }

              return (
                <button
                  key={target.id}
                  type="button"
                  onClick={() => handleSelectTarget(target)}
                  aria-label={`${t.targetAriaPrefix} ${target.title}`}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 cursor-pointer group z-20 ${
                    isSelected ? 'scale-150 z-30' : 'hover:scale-125'
                  }`}
                  style={{
                    left: `calc(50% + ${posX}%)`,
                    top: `calc(50% + ${posY}%)`,
                  }}
                >
                  <div className={`w-2.5 h-2.5 rounded-sm ${colorClasses} relative`}>
                    {isSelected && (
                      <div className="absolute -inset-1.5 border border-cyan-300 animate-pulse pointer-events-none" />
                    )}
                  </div>

                  <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[8px] font-mono-code text-slate-300 bg-black/85 px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/15">
                    {target.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filter Toolbar beneath radar */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
            {(
              [
                { id: 'all', label: t.filterAll },
                { id: 'missions', label: t.filterMissions },
                { id: 'collectibles', label: t.filterCollectibles },
                { id: 'vehicles', label: t.filterVehicles },
              ] as const
            ).map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => {
                  cyberAudio.playClick();
                  setActiveFilter(filter.id);
                }}
                className={`px-3 py-1 text-[11px] font-mono-code cursor-pointer transition-colors ${
                  isStudio ? 'rounded-lg' : ''
                } ${
                  activeFilter === filter.id
                    ? 'bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/60 font-bold'
                    : 'bg-white/[0.04] text-slate-400 hover:text-slate-200 border border-white/10'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel: Active Target Telemetry HUD (5 Cols on desktop) */}
        <div
          className={`lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between min-h-[300px] shadow-lg border ${panelClass}`}
        >
          {resolvedSelectedTarget ? (
            <div className="space-y-4">
              {/* Header Dossier */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <Crosshair
                    className="w-4 h-4 text-[#00f0ff] animate-spin"
                    style={{ animationDuration: '8s' }}
                  />
                  <span className="text-[10px] font-mono-code text-[#00f0ff] uppercase tracking-widest font-bold">
                    {t.signalLocked} · {getTypeLabel(resolvedSelectedTarget.type)}
                  </span>
                </div>
                <span className="text-[11px] font-mono-code text-slate-400 tabular-nums">
                  {resolvedSelectedTarget.distanceMeters}m
                </span>
              </div>

              {/* Title & Category */}
              <div>
                <span className="text-[11px] font-mono-code text-slate-400 uppercase">
                  {resolvedSelectedTarget.subtitle}
                </span>
                <h3 className="font-hud font-bold text-lg text-white mt-0.5">
                  {resolvedSelectedTarget.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#ff2a85]" />
                  <span>{resolvedSelectedTarget.district}</span>
                </div>
              </div>

              {/* Status and Telemetry Details */}
              <div className="bg-black/45 p-3 rounded-lg border border-white/[0.08] space-y-2">
                <div className="flex justify-between items-center text-xs font-mono-code">
                  <span className="text-slate-400">{t.statusLabel}</span>
                  <span className="text-[#00f0ff] font-bold">{resolvedSelectedTarget.statusText}</span>
                </div>
                {resolvedSelectedTarget.extraInfo && (
                  <div className="text-xs text-slate-300 font-sans border-t border-white/[0.08] pt-1.5 leading-relaxed">
                    {resolvedSelectedTarget.extraInfo}
                  </div>
                )}
              </div>

              {/* Quick Tactical Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                {resolvedSelectedTarget.type === 'mission' && (
                  <button
                    type="button"
                    onClick={() => {
                      cyberAudio.playClick();
                      openProgressionTab('missions');
                      onNavigateToApp?.();
                    }}
                    className="flex-1 px-3 py-2.5 rounded-lg text-xs font-hud font-bold bg-[#00f0ff] hover:bg-[#4ff6ff] text-[#0a0910] flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
                  >
                    <span>{t.openMissionsCta}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}

                {resolvedSelectedTarget.type === 'collectible' && (
                  <button
                    type="button"
                    onClick={() => {
                      cyberAudio.playFanfare();
                      toggleCollectible(resolvedSelectedTarget.id);
                      setSelectedTarget(null);
                    }}
                    className="flex-1 px-3 py-2.5 rounded-lg text-xs font-hud font-bold bg-amber-400 hover:bg-amber-300 text-[#0a0910] flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.markCollectedCta}</span>
                  </button>
                )}

                {resolvedSelectedTarget.type === 'vehicle' && (
                  <button
                    type="button"
                    onClick={() => {
                      cyberAudio.playClick();
                      setCurrentTab('garage');
                      onNavigateToApp?.();
                    }}
                    className="flex-1 px-3 py-2.5 rounded-lg text-xs font-hud font-bold bg-emerald-400 hover:bg-emerald-300 text-[#0a0910] flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
                  >
                    <Car className="w-4 h-4" />
                    <span>{t.openGarageCta}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-3 my-auto">
              <div className="w-12 h-12 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/5 flex items-center justify-center text-[#00f0ff]">
                <Crosshair className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="font-hud font-bold text-white text-sm">{t.noTargetTitle}</h4>
              <p className="text-xs text-slate-400 max-w-xs font-mono-code leading-relaxed">
                {t.noTargetDesc}
              </p>
            </div>
          )}

          {/* Bottom Live Feed Telemetry */}
          <div className="border-t border-white/[0.08] pt-3 mt-4 flex items-center justify-between text-[10px] font-mono-code text-slate-400">
            <span>
              {t.targetsDisplayed} : {filteredTargets.length}
            </span>
            <span className="text-[#00f0ff]">{t.radarActive}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
