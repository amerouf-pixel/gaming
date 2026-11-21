import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { cyberAudio } from '../utils/cyberAudio';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  Maximize2,
  ArrowLeft,
  Monitor,
  Smartphone,
  CheckSquare,
  Square,
  Radio,
  Trophy,
  Compass,
  Link2,
  Check,
  Plus,
  Minus,
  CheckCircle2,
  Target,
  MessageSquare,
  Bell,
  Sliders,
  Layout,
  Sparkles,
  Car,
  Info,
  Camera,
  CameraOff,
  FileText,
} from 'lucide-react';

type OverlayBgMode = 'chroma' | 'transparent' | 'sunset';
type LayoutPreset = 'landscape' | 'vertical';
type CameraPosition = 'bottom-right' | 'top-right' | 'left' | 'hidden';
type CameraSize = 'sm' | 'md' | 'lg';
type ControlTab = 'scene' | 'panels' | 'alerts';

interface StreamerAlert {
  id: string;
  kind: 'follower' | 'sub' | 'goal';
  title: string;
  subtitle: string;
}

interface StudioPreferences {
  cameraPos: CameraPosition;
  cameraSize: CameraSize;
  showChat: boolean;
  showAlerts: boolean;
  showTimer: boolean;
  showStats: boolean;
  showGameInfo: boolean;
  showCustomWidget: boolean;
  customWidgetTitle: string;
  customWidgetText: string;
  chatPinnedNote: string;
}

interface StreamerOverlayProps {
  onExit: () => void;
}

// Clés existantes conservées pour ne perdre aucune configuration utilisateur
const STREAMER_NAME_KEY = 'neonos_streamer_name_v1';
const STREAM_TITLE_KEY = 'neonos_stream_title_v1';
const HIDE_SIGNATURE_KEY = 'neonos_streamer_hide_sig_v1';
const CHALLENGE_LABEL_KEY = 'neonos_streamer_challenge_label_v1';
const CHALLENGE_COUNT_KEY = 'neonos_streamer_challenge_count_v1';
const SHOW_MISSION_WIDGET_KEY = 'neonos_streamer_show_mission_v1';
const SHOW_CHALLENGE_WIDGET_KEY = 'neonos_streamer_show_challenge_v1';
const STUDIO_PREFS_KEY = 'jitalx_streamer_studio_v1';

const DEFAULT_STUDIO_PREFS: StudioPreferences = {
  cameraPos: 'bottom-right',
  cameraSize: 'md',
  showChat: true,
  showAlerts: true,
  showTimer: true,
  showStats: true,
  showGameInfo: true,
  showCustomWidget: false,
  customWidgetTitle: 'NOTE LIVE',
  customWidgetText: 'Objectif 100 % en direct · Tapez !planning dans le chat',
  chatPinnedNote: 'Bienvenue sur le live ! Suivi de progression synchronisé avec JITALX.',
};

function loadStudioPrefs(): StudioPreferences {
  try {
    const raw = localStorage.getItem(STUDIO_PREFS_KEY);
    if (!raw) return DEFAULT_STUDIO_PREFS;
    const parsed = JSON.parse(raw) as Partial<StudioPreferences>;
    return {
      ...DEFAULT_STUDIO_PREFS,
      ...parsed,
    };
  } catch {
    return DEFAULT_STUDIO_PREFS;
  }
}

export const StreamerOverlay: React.FC<StreamerOverlayProps> = ({ onExit }) => {
  const { overallProgress, stats, activeProfile, activeTheme, missions, toggleMissionStep } = useGame();

  // Lecture des paramètres URL OBS (?bg=transparent|chroma|sunset&layout=vertical|landscape&clean=1)
  const getInitialParams = () => {
    if (typeof window === 'undefined') {
      return { bg: 'sunset' as OverlayBgMode, layout: 'landscape' as LayoutPreset, clean: false };
    }
    const params = new URLSearchParams(window.location.search);
    const bgParam = params.get('bg');
    const layoutParam = params.get('layout');
    const cleanParam = params.get('clean');

    const bg: OverlayBgMode =
      bgParam === 'chroma' || bgParam === 'transparent' || bgParam === 'sunset'
        ? bgParam
        : 'sunset';
    const layout: LayoutPreset = layoutParam === 'vertical' ? 'vertical' : 'landscape';
    const clean = cleanParam === '1' || cleanParam === 'true';

    return { bg, layout, clean };
  };

  const initial = getInitialParams();

  const [bgMode, setBgMode] = useState<OverlayBgMode>(initial.bg);
  const [layoutPreset, setLayoutPreset] = useState<LayoutPreset>(initial.layout);
  const [cleanCapture, setCleanCapture] = useState<boolean>(initial.clean);
  const [showWaitingBanner, setShowWaitingBanner] = useState<boolean>(false);
  const [controlTab, setControlTab] = useState<ControlTab>('scene');

  // Préférences studio unifiées (caméra + panneaux secondaires)
  const [prefs, setPrefs] = useState<StudioPreferences>(() => loadStudioPrefs());

  const updatePrefs = useCallback((patch: Partial<StudioPreferences>) => {
    setPrefs((prev) => ({ ...prev, ...patch }));
  }, []);

  // Clés historiques conservées
  const [showMissionWidget, setShowMissionWidget] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SHOW_MISSION_WIDGET_KEY);
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });
  const [showChallengeWidget, setShowChallengeWidget] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SHOW_CHALLENGE_WIDGET_KEY);
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });
  const [challengeLabel, setChallengeLabel] = useState<string>(() => {
    try {
      return localStorage.getItem(CHALLENGE_LABEL_KEY) || 'Défis / Tentatives';
    } catch {
      return 'Défis / Tentatives';
    }
  });
  const [challengeCount, setChallengeCount] = useState<number>(() => {
    try {
      const parsed = Number(localStorage.getItem(CHALLENGE_COUNT_KEY));
      return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0;
    } catch {
      return 0;
    }
  });
  const [streamerName, setStreamerName] = useState<string>(() => {
    try {
      return localStorage.getItem(STREAMER_NAME_KEY) || '@Runner_10J';
    } catch {
      return '@Runner_10J';
    }
  });
  const [streamTitle, setStreamTitle] = useState<string>(() => {
    try {
      return localStorage.getItem(STREAM_TITLE_KEY) || 'Objectif 100 % — Jour 1';
    } catch {
      return 'Objectif 100 % — Jour 1';
    }
  });
  const [hideSignature, setHideSignature] = useState<boolean>(() => {
    try {
      return localStorage.getItem(HIDE_SIGNATURE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [copiedObsUrl, setCopiedObsUrl] = useState<boolean>(false);
  const [copyError, setCopyError] = useState<boolean>(false);
  const [activeAlert, setActiveAlert] = useState<StreamerAlert | null>(null);

  // Chronomètre de session live
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  const activeMission =
    missions.find((m) => m.status === 'in_progress') ||
    missions.find((m) => m.priority && m.status !== 'completed') ||
    missions.find((m) => m.status !== 'completed') ||
    missions[0];
  const nextMissionStep = activeMission?.steps.find((s) => !s.completed);
  const completedStepsCount = activeMission
    ? activeMission.steps.filter((s) => s.completed).length
    : 0;

  // Persistance sécurisée localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STUDIO_PREFS_KEY, JSON.stringify(prefs));
    } catch {
      // ignore storage errors
    }
  }, [prefs]);

  useEffect(() => {
    try {
      localStorage.setItem(STREAMER_NAME_KEY, streamerName);
      localStorage.setItem(STREAM_TITLE_KEY, streamTitle);
      localStorage.setItem(CHALLENGE_LABEL_KEY, challengeLabel);
      localStorage.setItem(HIDE_SIGNATURE_KEY, String(hideSignature));
      localStorage.setItem(CHALLENGE_COUNT_KEY, String(challengeCount));
      localStorage.setItem(SHOW_MISSION_WIDGET_KEY, String(showMissionWidget));
      localStorage.setItem(SHOW_CHALLENGE_WIDGET_KEY, String(showChallengeWidget));
    } catch {
      // ignore storage errors
    }
  }, [
    streamerName,
    streamTitle,
    challengeLabel,
    hideSignature,
    challengeCount,
    showMissionWidget,
    showChallengeWidget,
  ]);

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Fond document réel pour Source Navigateur OBS transparente / chroma
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const prevHtmlBg = document.documentElement.style.background;
    const prevBodyBg = document.body.style.background;

    if (cleanCapture) {
      if (bgMode === 'transparent') {
        document.documentElement.style.background = 'transparent';
        document.body.style.background = 'transparent';
      } else if (bgMode === 'chroma') {
        document.documentElement.style.background = '#00ff00';
        document.body.style.background = '#00ff00';
      } else {
        document.documentElement.style.background = '#120428';
        document.body.style.background = '#120428';
      }
    }

    return () => {
      document.documentElement.style.background = prevHtmlBg;
      document.body.style.background = prevBodyBg;
    };
  }, [bgMode, cleanCapture]);

  // Raccourcis clavier H (Capture propre) & Échap (Sortir capture propre)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if (isTyping) return;

      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        cyberAudio.playClick();
        setCleanCapture((prev) => !prev);
      } else if (e.key === 'Escape' && cleanCapture) {
        e.preventDefault();
        cyberAudio.playClick();
        setCleanCapture(false);
      }
    },
    [cleanCapture]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const formatTimer = (total: number) => {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
      .toString()
      .padStart(2, '0')}`;
  };

  const triggerManualAlert = (kind: StreamerAlert['kind']) => {
    cyberAudio.playFanfare();
    const map: Record<StreamerAlert['kind'], { title: string; subtitle: string }> = {
      follower: {
        title: 'NOUVEAU FOLLOWER',
        subtitle: `Bienvenue dans l'escouade de ${streamerName || '@Runner_10J'}`,
      },
      sub: {
        title: 'ABONNEMENT LIVE',
        subtitle: 'Merci pour le soutien au stream !',
      },
      goal: {
        title: `PALIER ATTEINT · ${overallProgress}%`,
        subtitle: `${stats.missionsDone}/${stats.missionsTotal} missions · ${stats.collectiblesDone}/${stats.collectiblesTotal} collectibles`,
      },
    };
    const id = `al_${Date.now()}`;
    setActiveAlert({ id, kind, ...map[kind] });
    setTimeout(() => {
      setActiveAlert((curr) => (curr?.id === id ? null : curr));
    }, 4500);
  };

  const toggleFullscreen = async () => {
    cyberAudio.playClick();
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
    } catch {
      // Safe fallback inside sandboxed iframes
    }
  };

  const obsUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/overlay?bg=${bgMode}&layout=${layoutPreset}&clean=1`
      : `/overlay?bg=${bgMode}&layout=${layoutPreset}&clean=1`;

  const copyObsBrowserSourceUrl = async () => {
    setCopyError(false);
    try {
      await navigator.clipboard?.writeText(obsUrl);
      cyberAudio.playChirp();
      setCopiedObsUrl(true);
      setTimeout(() => setCopiedObsUrl(false), 2500);
    } catch {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
    }
  };

  const isVertical = layoutPreset === 'vertical';
  const isSunsetTheme = activeTheme === 'sunset-neon';

  // Camera sizing classes inside the stage
  const getCameraWidthClass = () => {
    if (isVertical) {
      if (prefs.cameraSize === 'sm') return 'w-[46%]';
      if (prefs.cameraSize === 'lg') return 'w-[82%]';
      return 'w-[64%]';
    }
    if (prefs.cameraSize === 'sm') return 'w-[22%] min-w-[180px]';
    if (prefs.cameraSize === 'lg') return 'w-[34%] min-w-[260px]';
    return 'w-[27%] min-w-[220px]';
  };

  const getCameraPositionClass = () => {
    switch (prefs.cameraPos) {
      case 'top-right':
        return 'top-4 right-4';
      case 'left':
        return isVertical ? 'top-4 left-4' : 'bottom-28 left-4';
      case 'bottom-right':
      default:
        return isVertical ? 'bottom-36 right-4' : 'bottom-28 right-4';
    }
  };

  const stageBgStyle: React.CSSProperties =
    bgMode === 'chroma'
      ? { backgroundColor: '#00ff00' }
      : bgMode === 'transparent'
      ? {
          backgroundColor: cleanCapture ? 'transparent' : '#090216',
          backgroundImage: cleanCapture
            ? undefined
            : 'linear-gradient(45deg, rgba(255,255,255,0.04) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.04) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.04) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.04) 75%)',
          backgroundSize: cleanCapture ? undefined : '24px 24px',
          backgroundPosition: cleanCapture ? undefined : '0 0, 0 12px, 12px -12px, -12px 0',
        }
      : { backgroundColor: '#120428' };

  // Pure Scene Canvas (rendered fullscreen in Clean Capture Mode OR inside central preview stage)
  const renderBroadcastScene = () => (
    <div
      className={`relative overflow-hidden select-none transition-all duration-300 ${
        cleanCapture
          ? isVertical
            ? 'min-h-screen w-full max-w-[460px] mx-auto flex flex-col justify-between p-4'
            : 'min-h-screen w-full flex flex-col justify-between p-5 sm:p-7'
          : isVertical
          ? 'w-full max-w-[410px] aspect-[9/16] mx-auto border border-[#ff2a85]/50 shadow-[0_0_50px_rgba(0,0,0,0.65)] flex flex-col justify-between p-3.5'
          : 'w-full aspect-video border border-[#ff2a85]/45 shadow-[0_0_50px_rgba(0,0,0,0.65)] flex flex-col justify-between p-4 sm:p-5'
      }`}
      style={stageBgStyle}
    >
      {/* Sunset Néon Ambient Backdrop */}
      {bgMode === 'sunset' && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 18% 18%, rgba(255, 42, 133, 0.24) 0%, transparent 50%),
                radial-gradient(circle at 82% 24%, rgba(255, 123, 0, 0.18) 0%, transparent 45%),
                radial-gradient(circle at 50% 85%, rgba(0, 240, 255, 0.14) 0%, transparent 55%),
                linear-gradient(180deg, #120428 0%, #190536 55%, #0e0220 100%)
              `,
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-1/2 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 42, 133, 0.45) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 240, 255, 0.35) 1px, transparent 1px)
              `,
              backgroundSize: '42px 42px',
              maskImage: 'linear-gradient(to top, black 25%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to top, black 25%, transparent 100%)',
            }}
          />
        </div>
      )}

      {/* Subtle Game Viewport Reference Frame (only visible in Studio Preview, never in Clean Capture) */}
      {!cleanCapture && !showWaitingBanner && (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="px-4 py-2 border border-dashed border-white/15 bg-black/25 text-center">
            <div className="text-[10px] font-mono-code uppercase tracking-widest text-slate-300/80">
              ZONE CAPTURE JEU / VIDÉO ({isVertical ? '9:16 VERTICAL' : '16:9 PAYSAGE'})
            </div>
            <div className="text-[10px] text-slate-400/80 mt-0.5">
              Mode actif :{' '}
              {bgMode === 'chroma'
                ? 'Fond Vert Chroma (#00ff00)'
                : bgMode === 'transparent'
                ? 'Transparent OBS'
                : 'Fond Sunset Néon'}
            </div>
          </div>
        </div>
      )}

      {/* Alert Overlay (Center-Top) */}
      {prefs.showAlerts && activeAlert && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-[85%] max-w-md pointer-events-none">
          <div className="bg-[#120428]/95 border-2 border-[#00f0ff] px-4 py-3 shadow-[0_0_30px_rgba(0,240,255,0.45)] jitalx-chamfer-sm">
            <div className="flex items-center gap-2 text-[10px] font-mono-code uppercase tracking-widest text-[#ff7b00]">
              <Bell className="w-3.5 h-3.5 text-[#ff2a85]" />
              <span>ALERTE STREAM</span>
            </div>
            <div className="font-hud font-bold text-base text-white mt-0.5">
              {activeAlert.title}
            </div>
            <div className="text-xs text-[#00f0ff] font-mono-code">{activeAlert.subtitle}</div>
          </div>
        </div>
      )}

      {/* Waiting Screen Center Card */}
      {bgMode === 'sunset' && showWaitingBanner && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-6 pointer-events-none">
          <div className="bg-[#160631]/92 backdrop-blur-md border border-[#ff2a85]/60 shadow-[0_0_35px_rgba(255,42,133,0.3)] p-6 max-w-md text-center jitalx-chamfer">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono-code text-[#00f0ff] uppercase tracking-widest mb-2">
              <Radio className="w-3.5 h-3.5 text-[#ff2a85]" />
              <span>ÉCRAN D&apos;ATTENTE · {activeProfile.universe}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-hud font-bold text-white uppercase tracking-wide leading-tight">
              Le live commence{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#00f0ff]">
                bientôt
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-2">
              {streamerName || '@Runner_10J'} · {streamTitle}
            </p>
          </div>
        </div>
      )}

      {/* TOP ROW: Secondary Widgets (Mission, Challenge, Custom, Chat) */}
      <div className="relative z-20 flex flex-wrap items-start justify-between gap-3 pointer-events-auto">
        {/* Left Top Stack: Mission Active + Custom Widget */}
        <div className={`space-y-2 ${isVertical ? 'w-full' : 'max-w-[290px] w-full'}`}>
          {showMissionWidget && activeMission && (
            <div className="bg-[#120428]/92 backdrop-blur-md border border-[#00f0ff]/55 p-3 shadow-[0_0_20px_rgba(0,240,255,0.16)] space-y-1.5 jitalx-chamfer-sm">
              <div className="flex items-center justify-between text-[10px] font-mono-code uppercase">
                <span className="text-[#00f0ff] flex items-center gap-1.5 font-bold">
                  <Target className="w-3 h-3 text-[#ff2a85]" />
                  <span>Objectif Stream</span>
                </span>
                <span className="text-[#ff7b00] font-bold tabular-nums">
                  {completedStepsCount}/{activeMission.steps.length}
                </span>
              </div>
              <div className="font-hud font-bold text-xs sm:text-sm text-white truncate">
                {activeMission.title}
              </div>
              <div className="text-[11px] text-slate-300 font-mono-code flex items-center justify-between gap-2">
                <span className="truncate">
                  {nextMissionStep ? `→ ${nextMissionStep.text}` : 'Mission complétée'}
                </span>
                {!cleanCapture && nextMissionStep && (
                  <button
                    type="button"
                    onClick={() => {
                      cyberAudio.playFanfare();
                      toggleMissionStep(activeMission.id, nextMissionStep.id);
                    }}
                    className="px-1.5 py-0.5 bg-[#00f0ff]/20 hover:bg-[#00f0ff]/35 border border-[#00f0ff]/60 text-[#00f0ff] text-[10px] uppercase cursor-pointer shrink-0 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>OK</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {prefs.showCustomWidget && (
            <div className="bg-[#120428]/90 backdrop-blur-md border border-[#ff7b00]/55 px-3 py-2 shadow-lg">
              <div className="text-[10px] font-mono-code uppercase tracking-wider text-[#ff7b00] font-bold">
                {prefs.customWidgetTitle || 'WIDGET'}
              </div>
              <div className="text-xs text-slate-100 mt-0.5 leading-snug">
                {prefs.customWidgetText}
              </div>
            </div>
          )}
        </div>

        {/* Right Top Stack (shifts left if camera is top-right): Counter + Chat */}
        <div
          className={`space-y-2 ${isVertical ? 'w-full' : 'max-w-[260px] w-full'} ${
            !isVertical && prefs.cameraPos === 'top-right' ? 'mr-[29%]' : ''
          }`}
        >
          {showChallengeWidget && (
            <div className="bg-[#120428]/92 backdrop-blur-md border border-[#ff2a85]/55 px-3 py-2 flex items-center justify-between gap-2 shadow-lg">
              <div className="min-w-0">
                <div className="text-[10px] font-mono-code uppercase tracking-wider text-[#ff7b00] truncate">
                  {challengeLabel}
                </div>
                <div className="font-mono-code font-bold text-lg text-white tabular-nums leading-tight">
                  {challengeCount}
                </div>
              </div>
              {!cleanCapture && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      cyberAudio.playClick();
                      setChallengeCount((c) => Math.max(0, c - 1));
                    }}
                    className="p-1 bg-[#1b0838] hover:bg-[#2a0c54] border border-[#ff2a85]/40 text-slate-200 cursor-pointer"
                    aria-label="Décrémenter"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      cyberAudio.playChirp();
                      setChallengeCount((c) => c + 1);
                    }}
                    className="p-1 bg-[#ff2a85]/25 hover:bg-[#ff2a85]/40 border border-[#ff2a85]/70 text-white cursor-pointer"
                    aria-label="Incrémenter"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {prefs.showChat && (
            <div className="bg-[#120428]/88 backdrop-blur-md border border-[#ff2a85]/40 p-2.5 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono-code uppercase text-[#00f0ff]">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-[#ff2a85]" />
                  <span>Zone Chat</span>
                </span>
                <span className="text-slate-400">HUD</span>
              </div>
              <div className="text-[11px] text-slate-200 leading-snug bg-[#0b021a]/80 p-2 border border-white/5">
                <span className="text-[#ff7b00] font-semibold">{streamerName || '@Streamer'}: </span>
                <span>{prefs.chatPinnedNote}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CONFIGURABLE CAMERA FRAME (Absolute Positioned inside Stage) */}
      {prefs.cameraPos !== 'hidden' && (
        <div
          className={`absolute z-20 transition-all duration-300 ${getCameraWidthClass()} ${getCameraPositionClass()}`}
        >
          <div
            className="relative aspect-video w-full p-[2.5px] shadow-[0_0_24px_rgba(255,42,133,0.42)]"
            style={{
              background: 'linear-gradient(135deg, #ff2a85 0%, #ff7b00 50%, #00f0ff 100%)',
              clipPath:
                'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
            }}
          >
            <div
              className={`w-full h-full relative flex items-center justify-center overflow-hidden ${
                bgMode === 'sunset' ? 'bg-[#0e0320]/85 backdrop-blur-sm' : ''
              }`}
              style={{
                backgroundColor:
                  bgMode === 'chroma'
                    ? '#00ff00'
                    : bgMode === 'transparent'
                    ? 'transparent'
                    : undefined,
                clipPath:
                  'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
              }}
            >
              <span className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-[#00f0ff]" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-[#ff2a85]" />
              <span className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-[#ff2a85]" />
              <span className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-[#00f0ff]" />

              {/* LIVE Badge */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 bg-[#120428]/95 border border-[#ff2a85]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a85]" />
                <span className="text-[10px] font-hud font-bold tracking-widest text-white uppercase">
                  LIVE
                </span>
              </div>

              {bgMode === 'sunset' && (
                <div className="text-center px-3 pointer-events-none">
                  <Camera className="w-5 h-5 text-[#00f0ff]/65 mx-auto mb-0.5" />
                  <span className="text-[9px] font-mono-code uppercase tracking-wider text-slate-300/80 block">
                    CAMÉRA STREAMER
                  </span>
                </div>
              )}

              {/* Streamer Nameplate */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <div className="bg-[#120428]/95 border border-[#00f0ff]/60 px-2.5 py-0.5 max-w-full">
                  <span className="text-[11px] font-hud font-bold tracking-wider text-white uppercase truncate block">
                    {streamerName || '@Runner_10J'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM HUD BAR: Game Info + Session Stats + Stopwatch */}
      <div className="relative z-20 mt-auto pt-3 space-y-1.5">
        {(prefs.showGameInfo || prefs.showStats || prefs.showTimer) && (
          <div className="w-full bg-[#120428]/95 border border-[#ff2a85]/65 shadow-[0_0_26px_rgba(18,4,40,0.85)] px-3.5 py-2.5 sm:px-5 sm:py-3 jitalx-chamfer-sm">
            <div
              className={`grid gap-3 items-center ${
                isVertical ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-12'
              }`}
            >
              {/* Game Info & Title */}
              {prefs.showGameInfo && (
                <div className={isVertical ? 'space-y-0.5' : 'md:col-span-5 min-w-0 space-y-0.5'}>
                  <div className="text-[10px] font-mono-code uppercase tracking-widest text-[#00f0ff] truncate">
                    {activeProfile.name} · {activeProfile.universe}
                  </div>
                  <div className="font-hud font-bold text-sm sm:text-base text-white tracking-wide truncate">
                    {streamTitle || 'Objectif 100 % — Jour 1'}
                  </div>
                </div>
              )}

              {/* Session Stats & Progress */}
              {prefs.showStats && (
                <div
                  className={
                    isVertical
                      ? 'space-y-1'
                      : prefs.showGameInfo
                      ? 'md:col-span-4 space-y-1'
                      : 'md:col-span-8 space-y-1'
                  }
                >
                  <div className="flex items-center justify-between text-[11px] font-mono-code">
                    <span className="text-slate-300 uppercase flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-[#ff7b00]" />
                      <span>Progression</span>
                    </span>
                    <span className="text-[#00f0ff] font-bold tabular-nums">{overallProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#090216] border border-[#ff2a85]/40 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#00f0ff] transition-all duration-500"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono-code text-slate-400 tabular-nums">
                    <span className="flex items-center gap-1">
                      <Compass className="w-3 h-3 text-[#ff2a85]" />
                      {stats.missionsDone}/{stats.missionsTotal} M
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      {stats.collectiblesDone}/{stats.collectiblesTotal} C
                    </span>
                    <span className="flex items-center gap-1">
                      <Car className="w-3 h-3 text-emerald-400" />
                      {stats.vehiclesUnlocked}/{stats.vehiclesTotal} V
                    </span>
                  </div>
                </div>
              )}

              {/* Session Stopwatch */}
              {prefs.showTimer && (
                <div
                  className={
                    isVertical
                      ? 'flex items-center justify-between pt-1.5 border-t border-[#ff2a85]/25'
                      : 'md:col-span-3 flex items-center justify-between md:justify-end gap-2 md:border-l md:border-[#ff2a85]/25 md:pl-3'
                  }
                >
                  <div className={isVertical ? '' : 'md:text-right'}>
                    <div className="text-[9px] font-mono-code uppercase tracking-widest text-[#ff7b00]">
                      Chrono Live
                    </div>
                    <div className="font-mono-code font-bold text-lg sm:text-xl text-white tabular-nums tracking-wider leading-none mt-0.5">
                      {formatTimer(elapsedSeconds)}
                    </div>
                  </div>
                  {!cleanCapture && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          cyberAudio.playClick();
                          setIsTimerRunning((prev) => !prev);
                        }}
                        className="p-1.5 bg-[#1b0838] hover:bg-[#2a0c54] border border-[#00f0ff]/40 text-[#00f0ff] cursor-pointer"
                        title={isTimerRunning ? 'Pause' : 'Démarrer'}
                      >
                        {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          cyberAudio.playClick();
                          setElapsedSeconds(0);
                        }}
                        className="p-1.5 bg-[#1b0838] hover:bg-[#2a0c54] border border-[#ff2a85]/40 text-[#ff2a85] cursor-pointer"
                        title="Réinitialiser"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {!hideSignature && (
          <div className="flex justify-end">
            <span className="px-2 py-0.5 bg-[#120428]/90 border border-[#ff2a85]/35 text-[9px] font-mono-code tracking-widest text-slate-300">
              JITALX • 10JITAL
            </span>
          </div>
        )}
      </div>
    </div>
  );

  // =========================================================================
  // MODE CAPTURE PROPRE (OBS SOURCE NAVIGATEUR / TOUCHE H)
  // =========================================================================
  if (cleanCapture) {
    return (
      <div className="min-h-screen w-full relative" style={stageBgStyle}>
        <div className="fixed top-3 right-3 z-50 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              setCleanCapture(false);
            }}
            className="px-3 py-1.5 bg-[#120428]/95 border border-[#00f0ff]/70 text-[#00f0ff] text-[11px] font-mono-code uppercase flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quitter Capture Propre (H / Échap)</span>
          </button>
        </div>
        {renderBroadcastScene()}
      </div>
    );
  }

  // =========================================================================
  // CONSOLE STREAMER STUDIO COMPLÈTE (PRÉVISUALISATION CENTRALE + CONTRÔLES)
  // =========================================================================
  return (
    <div
      className={`min-h-screen w-full flex flex-col text-slate-100 ${
        isSunsetTheme ? 'bg-[#120428]' : 'bg-[#080d18]'
      }`}
    >
      {/* Top Broadcast Console Toolbar */}
      <header className="sticky top-0 z-40 bg-[#120428]/95 backdrop-blur-md border-b border-[#ff2a85]/40 px-4 sm:px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                cyberAudio.playClick();
                onExit();
              }}
              className="px-3 py-1.5 bg-[#1b0838] hover:bg-[#2a0c54] border border-[#ff2a85]/45 text-slate-200 hover:text-[#00f0ff] text-xs font-hud font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour HUD</span>
            </button>

            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-[#ff2a85]" />
              <div>
                <div className="font-hud font-bold text-sm text-white uppercase tracking-wider leading-none">
                  JITALX STREAMER STUDIO
                </div>
                <div className="text-[10px] font-mono-code text-[#00f0ff]/85 mt-0.5">
                  Console de diffusion &amp; Overlay OBS
                </div>
              </div>
            </div>
          </div>

          {/* Format Switch 16:9 / 9:16 + Background Mode */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-[#0b021a] border border-[#ff2a85]/35 p-1">
              <button
                type="button"
                onClick={() => {
                  cyberAudio.playClick();
                  setLayoutPreset('landscape');
                }}
                className={`px-2.5 py-1 text-[11px] font-mono-code font-bold uppercase flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                  !isVertical
                    ? 'bg-[#00f0ff] text-[#120428]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>16:9 Twitch / YT</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  cyberAudio.playClick();
                  setLayoutPreset('vertical');
                }}
                className={`px-2.5 py-1 text-[11px] font-mono-code font-bold uppercase flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap ${
                  isVertical
                    ? 'bg-[#ff2a85] text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>9:16 TikTok Live</span>
              </button>
            </div>

            <button
              type="button"
              onClick={copyObsBrowserSourceUrl}
              className="px-3 py-1.5 bg-[#1b0838] hover:bg-[#2a0c54] border border-[#00f0ff]/50 text-[#00f0ff] text-[11px] font-hud font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              {copiedObsUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Link2 className="w-3.5 h-3.5" />}
              <span>{copiedObsUrl ? 'URL OBS copiée' : copyError ? 'Copie bloquée' : 'Copier URL OBS'}</span>
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="px-2.5 py-1.5 bg-[#1b0838] hover:bg-[#2a0c54] border border-white/15 text-slate-200 hover:text-white text-[11px] font-hud font-bold uppercase flex items-center gap-1 cursor-pointer whitespace-nowrap"
              title="Plein écran (F11)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">F11</span>
            </button>

            <button
              type="button"
              onClick={() => {
                cyberAudio.playChirp();
                setCleanCapture(true);
              }}
              className="px-3.5 py-1.5 bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] hover:brightness-110 text-white text-xs font-hud font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_0_18px_rgba(255,42,133,0.4)] whitespace-nowrap"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Capture Propre (H)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Broadcast Console Grid: Large Central Stage + Right Dock */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* LEFT / CENTER: LARGE LIVE PREVIEW STAGE (8 cols on XL) */}
        <div className="xl:col-span-8 space-y-4">
          <div className="jitalx-panel p-4 sm:p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono-code text-slate-300">
                <span className="font-hud font-bold text-white uppercase tracking-wider">
                  Prévisualisation de Scène en Direct
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-[#00f0ff]">
                  {isVertical ? '1080 × 1920 (9:16)' : '1920 × 1080 (16:9)'}
                </span>
              </div>

              {/* Background Selector */}
              <div className="flex flex-wrap items-center gap-1 bg-[#0b021a] p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    cyberAudio.playClick();
                    setBgMode('sunset');
                  }}
                  className={`px-2.5 py-1 text-[10px] font-mono-code font-bold uppercase cursor-pointer ${
                    bgMode === 'sunset'
                      ? 'bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sunset Néon
                </button>
                <button
                  type="button"
                  onClick={() => {
                    cyberAudio.playClick();
                    setBgMode('transparent');
                  }}
                  className={`px-2.5 py-1 text-[10px] font-mono-code font-bold uppercase cursor-pointer ${
                    bgMode === 'transparent'
                      ? 'bg-[#00f0ff] text-[#120428]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Transparent OBS
                </button>
                <button
                  type="button"
                  onClick={() => {
                    cyberAudio.playClick();
                    setBgMode('chroma');
                  }}
                  className={`px-2.5 py-1 text-[10px] font-mono-code font-bold uppercase cursor-pointer flex items-center gap-1.5 ${
                    bgMode === 'chroma'
                      ? 'bg-[#00ff00] text-[#051a05]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 bg-[#00ff00] border border-black/30 inline-block" />
                  <span>Chroma Vert</span>
                </button>
              </div>
            </div>

            {/* Live Stage Container */}
            <div className="w-full flex items-center justify-center bg-[#070212] p-2 sm:p-4 border border-white/5">
              {renderBroadcastScene()}
            </div>

            {/* Quick Live Deck Strip under Stage */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    cyberAudio.playClick();
                    setIsTimerRunning((prev) => !prev);
                  }}
                  className="px-3 py-1.5 bg-[#0b021a] hover:bg-[#1b0838] border border-[#00f0ff]/40 text-[#00f0ff] font-mono-code text-[11px] flex items-center gap-1.5 cursor-pointer"
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isTimerRunning ? 'Pause Chrono' : 'Démarrer Chrono'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    cyberAudio.playClick();
                    setElapsedSeconds(0);
                  }}
                  className="px-2.5 py-1.5 bg-[#0b021a] hover:bg-[#1b0838] border border-white/10 text-slate-300 font-mono-code text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
                {bgMode === 'sunset' && (
                  <button
                    type="button"
                    onClick={() => {
                      cyberAudio.playClick();
                      setShowWaitingBanner((prev) => !prev);
                    }}
                    className={`px-3 py-1.5 border font-mono-code text-[11px] cursor-pointer ${
                      showWaitingBanner
                        ? 'bg-[#ff7b00]/20 border-[#ff7b00] text-[#ff7b00]'
                        : 'bg-[#0b021a] border-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    Écran d&apos;attente
                  </button>
                )}
              </div>

              <div className="text-[11px] font-mono-code text-slate-400">
                Préférences enregistrées automatiquement dans ce navigateur
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT DOCK: BROADCAST CONFIGURATION PANELS (4 cols on XL) */}
        <aside className="xl:col-span-4 jitalx-panel p-4 sm:p-5 space-y-4">
          {/* Control Dock Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#0b021a] border border-white/10">
            {[
              { id: 'scene' as ControlTab, label: 'Scène & Cam', icon: Layout },
              { id: 'panels' as ControlTab, label: 'Panneaux', icon: Sliders },
              { id: 'alerts' as ControlTab, label: 'Alertes & OBS', icon: Bell },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = controlTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    cyberAudio.playClick();
                    setControlTab(tab.id);
                  }}
                  className={`py-2 px-2 text-[11px] font-hud font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    active
                      ? 'bg-[#ff2a85]/25 text-[#00f0ff] border border-[#ff2a85]/60'
                      : 'text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: SCENE & CAMERA */}
          {controlTab === 'scene' && (
            <div className="space-y-4">
              <div className="space-y-2.5">
                <div>
                  <label
                    htmlFor="studio-streamer-name"
                    className="block text-[11px] font-mono-code text-[#00f0ff] uppercase mb-1"
                  >
                    Pseudo Streamer
                  </label>
                  <input
                    id="studio-streamer-name"
                    type="text"
                    value={streamerName}
                    onChange={(e) => setStreamerName(e.target.value)}
                    maxLength={28}
                    className="w-full jitalx-input px-3 py-2 text-xs font-mono-code"
                  />
                </div>

                <div>
                  <label
                    htmlFor="studio-stream-title"
                    className="block text-[11px] font-mono-code text-[#ff7b00] uppercase mb-1"
                  >
                    Titre du Live
                  </label>
                  <input
                    id="studio-stream-title"
                    type="text"
                    value={streamTitle}
                    onChange={(e) => setStreamTitle(e.target.value)}
                    maxLength={64}
                    className="w-full jitalx-input px-3 py-2 text-xs font-mono-code"
                  />
                </div>
              </div>

              {/* Camera Position Presets */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="text-[11px] font-mono-code uppercase text-slate-300 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#ff2a85]" />
                  <span>Disposition de la Caméra</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'bottom-right' as CameraPosition, label: 'Bas à droite' },
                    { id: 'top-right' as CameraPosition, label: 'Haut à droite' },
                    { id: 'left' as CameraPosition, label: 'À gauche' },
                    { id: 'hidden' as CameraPosition, label: 'Désactivée' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        cyberAudio.playClick();
                        updatePrefs({ cameraPos: opt.id });
                      }}
                      className={`px-3 py-2 text-xs font-mono-code border cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
                        prefs.cameraPos === opt.id
                          ? 'bg-[#00f0ff]/15 border-[#00f0ff] text-[#00f0ff]'
                          : 'bg-[#0b021a] border-white/10 text-slate-300 hover:border-white/25'
                      }`}
                    >
                      {opt.id === 'hidden' && <CameraOff className="w-3.5 h-3.5" />}
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Camera Size */}
              {prefs.cameraPos !== 'hidden' && (
                <div className="space-y-2">
                  <div className="text-[11px] font-mono-code uppercase text-slate-300">
                    Taille du cadre caméra
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'sm' as CameraSize, label: 'Compacte' },
                      { id: 'md' as CameraSize, label: 'Standard' },
                      { id: 'lg' as CameraSize, label: 'Grande' },
                    ].map((sz) => (
                      <button
                        key={sz.id}
                        type="button"
                        onClick={() => {
                          cyberAudio.playClick();
                          updatePrefs({ cameraSize: sz.id });
                        }}
                        className={`py-1.5 text-xs font-mono-code border cursor-pointer ${
                          prefs.cameraSize === sz.id
                            ? 'bg-[#ff2a85]/20 border-[#ff2a85] text-white'
                            : 'bg-[#0b021a] border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {sz.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Signature toggle */}
              <div className="pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    cyberAudio.playClick();
                    setHideSignature((prev) => !prev);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 bg-[#0b021a] border border-white/10 text-xs font-mono-code text-slate-200 hover:border-[#00f0ff]/40 cursor-pointer"
                >
                  <span>Masquer la signature JITALX • 10JITAL</span>
                  {hideSignature ? (
                    <CheckSquare className="w-4 h-4 text-[#00f0ff]" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SECONDARY PANELS TOGGLES */}
          {controlTab === 'panels' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400">
                Activez ou masquez chaque panneau affiché sur votre scène live.
              </div>

              <div className="space-y-2">
                {[
                  {
                    label: 'Objectifs de stream (Mission active)',
                    active: showMissionWidget,
                    toggle: () => setShowMissionWidget((v) => !v),
                  },
                  {
                    label: 'Compteur personnalisé (Défis / Essais)',
                    active: showChallengeWidget,
                    toggle: () => setShowChallengeWidget((v) => !v),
                  },
                  {
                    label: 'Zone Chat HUD',
                    active: prefs.showChat,
                    toggle: () => updatePrefs({ showChat: !prefs.showChat }),
                  },
                  {
                    label: 'Panneau Alertes visuelles',
                    active: prefs.showAlerts,
                    toggle: () => updatePrefs({ showAlerts: !prefs.showAlerts }),
                  },
                  {
                    label: 'Chronomètre de session',
                    active: prefs.showTimer,
                    toggle: () => updatePrefs({ showTimer: !prefs.showTimer }),
                  },
                  {
                    label: 'Statistiques de session (Progression)',
                    active: prefs.showStats,
                    toggle: () => updatePrefs({ showStats: !prefs.showStats }),
                  },
                  {
                    label: 'Informations de jeu & Titre',
                    active: prefs.showGameInfo,
                    toggle: () => updatePrefs({ showGameInfo: !prefs.showGameInfo }),
                  },
                  {
                    label: 'Widget personnalisé libre',
                    active: prefs.showCustomWidget,
                    toggle: () => updatePrefs({ showCustomWidget: !prefs.showCustomWidget }),
                  },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      cyberAudio.playClick();
                      item.toggle();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs border cursor-pointer transition-colors ${
                      item.active
                        ? 'bg-[#00f0ff]/10 border-[#00f0ff]/50 text-white'
                        : 'bg-[#0b021a] border-white/10 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.active ? (
                      <CheckSquare className="w-4 h-4 text-[#00f0ff] shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {/* Editable Counter & Custom Widget Inputs */}
              {showChallengeWidget && (
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <label className="block text-[10px] font-mono-code uppercase text-[#ff7b00]">
                    Intitulé du compteur
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={challengeLabel}
                      onChange={(e) => setChallengeLabel(e.target.value)}
                      maxLength={32}
                      className="flex-1 jitalx-input px-2.5 py-1.5 text-xs font-mono-code"
                    />
                    <button
                      type="button"
                      onClick={() => setChallengeCount(0)}
                      className="px-2.5 py-1.5 bg-[#0b021a] border border-white/15 text-xs text-slate-300 hover:text-white cursor-pointer"
                    >
                      0
                    </button>
                  </div>
                </div>
              )}

              {prefs.showChat && (
                <div className="pt-2 border-t border-white/10 space-y-1.5">
                  <label className="block text-[10px] font-mono-code uppercase text-[#00f0ff]">
                    Message épinglé dans la Zone Chat
                  </label>
                  <input
                    type="text"
                    value={prefs.chatPinnedNote}
                    onChange={(e) => updatePrefs({ chatPinnedNote: e.target.value })}
                    maxLength={110}
                    className="w-full jitalx-input px-2.5 py-1.5 text-xs"
                  />
                </div>
              )}

              {prefs.showCustomWidget && (
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="text-[10px] font-mono-code uppercase text-[#ff7b00] flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>Contenu du Widget Personnalisé</span>
                  </div>
                  <input
                    type="text"
                    value={prefs.customWidgetTitle}
                    onChange={(e) => updatePrefs({ customWidgetTitle: e.target.value })}
                    maxLength={28}
                    placeholder="Titre du widget"
                    className="w-full jitalx-input px-2.5 py-1.5 text-xs font-mono-code"
                  />
                  <textarea
                    rows={2}
                    value={prefs.customWidgetText}
                    onChange={(e) => updatePrefs({ customWidgetText: e.target.value })}
                    maxLength={120}
                    placeholder="Message affiché à l'écran..."
                    className="w-full jitalx-input px-2.5 py-1.5 text-xs"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MANUAL ALERTS & OBS INTEGRATION GUIDE */}
          {controlTab === 'alerts' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-hud font-bold uppercase text-white">
                  Déclencheur d&apos;alertes visuelles (Manuel)
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Testez ou déclenchez manuellement une bannière d&apos;alerte sur la scène
                  (aucune API Twitch/YouTube externe n&apos;est connectée automatiquement).
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => triggerManualAlert('follower')}
                    className="px-3 py-2 bg-[#0b021a] hover:bg-[#1b0838] border border-[#00f0ff]/45 text-xs font-mono-code text-[#00f0ff] text-left cursor-pointer"
                  >
                    Déclencher alerte : Nouveau Follower
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerManualAlert('sub')}
                    className="px-3 py-2 bg-[#0b021a] hover:bg-[#1b0838] border border-[#ff2a85]/50 text-xs font-mono-code text-[#ff2a85] text-left cursor-pointer"
                  >
                    Déclencher alerte : Abonnement Live
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerManualAlert('goal')}
                    className="px-3 py-2 bg-[#0b021a] hover:bg-[#1b0838] border border-[#ff7b00]/50 text-xs font-mono-code text-[#ff7b00] text-left cursor-pointer"
                  >
                    Déclencher alerte : Palier {overallProgress}% atteint
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2.5">
                <div className="text-xs font-hud font-bold uppercase text-white flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span>Intégration Source Navigateur OBS</span>
                </div>
                <div className="p-2.5 bg-[#0b021a] border border-white/10 text-[11px] font-mono-code text-slate-300 break-all select-text">
                  {obsUrl}
                </div>
                <button
                  type="button"
                  onClick={copyObsBrowserSourceUrl}
                  className="w-full py-2 bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 border border-[#00f0ff]/60 text-[#00f0ff] text-xs font-hud font-bold uppercase cursor-pointer"
                >
                  {copiedObsUrl ? 'URL copiée dans le presse-papiers' : 'Copier l’URL pour OBS Studio'}
                </button>
                <div className="p-2.5 bg-[#0b021a]/80 border border-white/5 text-[11px] text-slate-400 flex items-start gap-2 leading-relaxed">
                  <Info className="w-3.5 h-3.5 text-[#00f0ff] shrink-0 mt-0.5" />
                  <span>
                    Dans OBS Studio : Sources → <strong>+ Navigateur</strong> → collez cette URL
                    (1920×1080 ou 1080×1920). Le contrôle direct via OBS WebSocket n&apos;est pas
                    activé ; utilisez le mode Capture Propre (<kbd className="text-white">H</kbd>)
                    ou l&apos;URL ci-dessus.
                  </span>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default StreamerOverlay;
