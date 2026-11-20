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
  Sparkles,
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
} from 'lucide-react';

type OverlayBgMode = 'chroma' | 'transparent' | 'sunset';
type LayoutPreset = 'auto' | 'landscape' | 'vertical';

interface StreamerOverlayProps {
  onExit: () => void;
}

const STREAMER_NAME_KEY = 'neonos_streamer_name_v1';
const STREAM_TITLE_KEY = 'neonos_stream_title_v1';
const HIDE_SIGNATURE_KEY = 'neonos_streamer_hide_sig_v1';
const CHALLENGE_LABEL_KEY = 'neonos_streamer_challenge_label_v1';

export const StreamerOverlay: React.FC<StreamerOverlayProps> = ({ onExit }) => {
  const { overallProgress, stats, activeProfile, missions, toggleMissionStep } = useGame();

  // Read optional OBS Browser Source query params (?bg=transparent|chroma|sunset&layout=vertical|landscape&clean=1)
  const getInitialParams = () => {
    if (typeof window === 'undefined') {
      return { bg: 'sunset' as OverlayBgMode, layout: 'auto' as LayoutPreset, clean: false };
    }
    const params = new URLSearchParams(window.location.search);
    const bgParam = params.get('bg');
    const layoutParam = params.get('layout');
    const cleanParam = params.get('clean');

    const bg: OverlayBgMode =
      bgParam === 'chroma' || bgParam === 'transparent' || bgParam === 'sunset'
        ? bgParam
        : 'sunset';
    const layout: LayoutPreset =
      layoutParam === 'vertical' || layoutParam === 'landscape' ? layoutParam : 'auto';
    const clean = cleanParam === '1' || cleanParam === 'true';

    return { bg, layout, clean };
  };

  const initial = getInitialParams();

  // Background selector for OBS / TikTok Live Studio
  const [bgMode, setBgMode] = useState<OverlayBgMode>(initial.bg);
  // Responsive layout preview preset (16:9 Twitch/YT vs 9:16 TikTok Live vs Auto)
  const [layoutPreset, setLayoutPreset] = useState<LayoutPreset>(initial.layout);
  // Clean capture mode (hides all control panels, shortcut H)
  const [cleanCapture, setCleanCapture] = useState<boolean>(initial.clean);
  // Waiting screen banner toggle for Sunset Néon background
  const [showWaitingBanner, setShowWaitingBanner] = useState<boolean>(false);

  // Live Streamer Widgets toggles
  const [showMissionWidget, setShowMissionWidget] = useState<boolean>(true);
  const [showChallengeWidget, setShowChallengeWidget] = useState<boolean>(true);
  const [challengeLabel, setChallengeLabel] = useState<string>(() => {
    try {
      return localStorage.getItem(CHALLENGE_LABEL_KEY) || 'Défis / Tentatives';
    } catch {
      return 'Défis / Tentatives';
    }
  });
  const [challengeCount, setChallengeCount] = useState<number>(0);
  const [copiedObsUrl, setCopiedObsUrl] = useState<boolean>(false);

  // Editable streamer pseudo & stream title
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

  // Dedicated OBS Session Stopwatch (Start / Pause / Reset)
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  const activeMission =
    missions.find((m) => m.status === 'in_progress' || m.priority) || missions[0];
  const nextMissionStep = activeMission?.steps.find((s) => !s.completed);
  const completedStepsCount = activeMission
    ? activeMission.steps.filter((s) => s.completed).length
    : 0;

  // Persist streamer inputs
  useEffect(() => {
    try {
      localStorage.setItem(STREAMER_NAME_KEY, streamerName);
    } catch {
      // ignore storage errors
    }
  }, [streamerName]);

  useEffect(() => {
    try {
      localStorage.setItem(STREAM_TITLE_KEY, streamTitle);
    } catch {
      // ignore storage errors
    }
  }, [streamTitle]);

  useEffect(() => {
    try {
      localStorage.setItem(CHALLENGE_LABEL_KEY, challengeLabel);
    } catch {
      // ignore storage errors
    }
  }, [challengeLabel]);

  useEffect(() => {
    try {
      localStorage.setItem(HIDE_SIGNATURE_KEY, String(hideSignature));
    } catch {
      // ignore storage errors
    }
  }, [hideSignature]);

  // Stopwatch tick
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Handle genuine transparent background on document root for OBS Browser Source
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const prevHtmlBg = document.documentElement.style.background;
    const prevBodyBg = document.body.style.background;

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

    return () => {
      document.documentElement.style.background = prevHtmlBg;
      document.body.style.background = prevBodyBg;
    };
  }, [bgMode]);

  // Keyboard shortcut: 'H' toggles Clean Capture Mode, 'Escape' restores controls
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

  const toggleFullscreen = async () => {
    cyberAudio.playClick();
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
    } catch {
      // Safe fallback inside restricted iframes
    }
  };

  const copyObsBrowserSourceUrl = () => {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}/overlay?bg=${bgMode}&layout=${
      layoutPreset === 'vertical' ? 'vertical' : 'landscape'
    }&clean=1`;
    navigator.clipboard?.writeText(url);
    cyberAudio.playChirp();
    setCopiedObsUrl(true);
    setTimeout(() => setCopiedObsUrl(false), 2500);
  };

  const rootCanvasStyle: React.CSSProperties =
    bgMode === 'chroma'
      ? { backgroundColor: '#00ff00' }
      : bgMode === 'transparent'
      ? { backgroundColor: 'transparent' }
      : { backgroundColor: '#120428' };

  const isVerticalPreview = layoutPreset === 'vertical';

  return (
    <div
      className="min-h-screen w-full relative flex flex-col justify-between overflow-x-hidden transition-colors duration-200 select-none"
      style={rootCanvasStyle}
    >
      {/* Sunset Néon Ambient Waiting Screen Backdrop */}
      {bgMode === 'sunset' && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 20% 20%, rgba(255, 42, 133, 0.24) 0%, transparent 50%),
                radial-gradient(circle at 82% 25%, rgba(255, 123, 0, 0.20) 0%, transparent 45%),
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
              backgroundSize: '48px 48px',
              maskImage: 'linear-gradient(to top, black 25%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to top, black 25%, transparent 100%)',
            }}
          />
        </div>
      )}

      {/* ===================================================================== */}
      {/* 1. BARRE DE CONTRÔLES OBS (MASQUÉE EN MODE CAPTURE PROPRE / TOUCHE H) */}
      {/* ===================================================================== */}
      {!cleanCapture ? (
        <div className="relative z-40 bg-[#120428]/95 backdrop-blur-md border-b border-[#ff2a85]/45 px-4 sm:px-6 py-3 shadow-2xl">
          <div className="max-w-7xl mx-auto flex flex-col gap-3">
            {/* Row 1: Navigation, Background Mode & Clean Capture */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    cyberAudio.playClick();
                    onExit();
                  }}
                  className="px-3 py-1.5 bg-[#1b0838] hover:bg-[#2a0c54] border border-[#ff2a85]/40 text-slate-200 hover:text-[#00f0ff] text-xs font-hud font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>RETOUR HUD</span>
                </button>

                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#ff2a85]" />
                  <span className="font-hud font-bold text-sm text-white uppercase tracking-wider whitespace-nowrap">
                    STUDIO STREAMER OBS
                  </span>
                </div>
              </div>

              {/* Background Selector: 3 OBS / TikTok Live Studio Modes */}
              <div className="flex flex-wrap items-center gap-1.5 bg-[#0b021a] p-1 border border-[#ff2a85]/30">
                <button
                  onClick={() => {
                    cyberAudio.playClick();
                    setBgMode('chroma');
                  }}
                  className={`px-3 py-1.5 text-[11px] font-mono-code font-bold uppercase transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    bgMode === 'chroma'
                      ? 'bg-[#00ff00] text-[#051a05] shadow-[0_0_12px_rgba(0,255,0,0.5)]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 bg-[#00ff00] border border-black/30 inline-block" />
                  <span>Fond Vert Chroma</span>
                </button>

                <button
                  onClick={() => {
                    cyberAudio.playClick();
                    setBgMode('transparent');
                  }}
                  className={`px-3 py-1.5 text-[11px] font-mono-code font-bold uppercase transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    bgMode === 'transparent'
                      ? 'bg-[#00f0ff] text-[#120428] shadow-[0_0_12px_rgba(0,240,255,0.45)]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Fond Transparent OBS
                </button>

                <button
                  onClick={() => {
                    cyberAudio.playClick();
                    setBgMode('sunset');
                  }}
                  className={`px-3 py-1.5 text-[11px] font-mono-code font-bold uppercase transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    bgMode === 'sunset'
                      ? 'bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] text-white shadow-[0_0_12px_rgba(255,42,133,0.5)]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Fond Sunset Néon
                </button>
              </div>

              {/* OBS URL Copy, Fullscreen & Clean Capture */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={copyObsBrowserSourceUrl}
                  className="px-3 py-1.5 bg-[#1b0838] hover:bg-[#2a0c54] border border-[#00f0ff]/45 text-[#00f0ff] text-[11px] font-hud font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                  title="Copier l'URL directe à coller comme Source Navigateur dans OBS Studio"
                >
                  {copiedObsUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Link2 className="w-3.5 h-3.5" />}
                  <span>{copiedObsUrl ? 'URL OBS COPIÉE' : 'COPIER URL OBS'}</span>
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="px-2.5 py-1.5 bg-[#1b0838] hover:bg-[#2a0c54] border border-[#00f0ff]/40 text-[#00f0ff] text-[11px] font-hud font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                  title="Basculer en plein écran (F11)"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">F11</span>
                </button>

                <button
                  onClick={() => {
                    cyberAudio.playChirp();
                    setCleanCapture(true);
                  }}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] hover:brightness-110 text-white text-xs font-hud font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[0_0_18px_rgba(255,42,133,0.45)] transition-all whitespace-nowrap shrink-0"
                  title="Masquer tous les contrôles pour OBS (Touche H)"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Capture Propre (H)</span>
                </button>
              </div>
            </div>

            {/* Row 2: Stream Inputs, Widgets & Controls */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-[#ff2a85]/20 items-end">
              {/* Streamer Handle Input */}
              <div className="md:col-span-2 flex flex-col gap-1">
                <label
                  htmlFor="obs-streamer-name"
                  className="text-[10px] font-mono-code text-[#00f0ff] uppercase tracking-wider"
                >
                  Pseudo Streamer
                </label>
                <input
                  id="obs-streamer-name"
                  type="text"
                  value={streamerName}
                  onChange={(e) => setStreamerName(e.target.value)}
                  maxLength={28}
                  placeholder="@MonPseudo"
                  className="w-full bg-[#0b021a] border border-[#ff2a85]/40 px-2.5 py-1.5 text-xs font-mono-code text-white focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              {/* Stream Title Input */}
              <div className="md:col-span-3 flex flex-col gap-1">
                <label
                  htmlFor="obs-stream-title"
                  className="text-[10px] font-mono-code text-[#ff7b00] uppercase tracking-wider"
                >
                  Titre du Live en direct
                </label>
                <input
                  id="obs-stream-title"
                  type="text"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  maxLength={64}
                  placeholder="Objectif 100 % — Jour 1"
                  className="w-full bg-[#0b021a] border border-[#ff2a85]/40 px-2.5 py-1.5 text-xs font-mono-code text-white focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              {/* Live Widgets & Controls */}
              <div className="md:col-span-7 flex flex-wrap items-center justify-between md:justify-end gap-2">
                {/* Widget toggles */}
                <button
                  onClick={() => {
                    cyberAudio.playClick();
                    setShowMissionWidget((prev) => !prev);
                  }}
                  className={`px-2.5 py-1.5 text-[10px] font-mono-code uppercase border cursor-pointer transition-colors ${
                    showMissionWidget
                      ? 'bg-[#00f0ff]/15 border-[#00f0ff]/60 text-[#00f0ff]'
                      : 'bg-[#0b021a] border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  Widget Mission
                </button>

                <button
                  onClick={() => {
                    cyberAudio.playClick();
                    setShowChallengeWidget((prev) => !prev);
                  }}
                  className={`px-2.5 py-1.5 text-[10px] font-mono-code uppercase border cursor-pointer transition-colors ${
                    showChallengeWidget
                      ? 'bg-[#ff2a85]/20 border-[#ff2a85]/60 text-[#ff2a85]'
                      : 'bg-[#0b021a] border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  Compteur Défi
                </button>

                {bgMode === 'sunset' && (
                  <button
                    onClick={() => {
                      cyberAudio.playClick();
                      setShowWaitingBanner((prev) => !prev);
                    }}
                    className={`px-2.5 py-1.5 text-[10px] font-mono-code uppercase border cursor-pointer transition-colors ${
                      showWaitingBanner
                        ? 'bg-[#ff7b00]/20 border-[#ff7b00]/60 text-[#ff7b00]'
                        : 'bg-[#0b021a] border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    Écran d&apos;attente
                  </button>
                )}

                {/* Timer Start/Pause/Reset */}
                <div className="flex items-center gap-1 bg-[#0b021a] border border-[#00f0ff]/35 p-0.5">
                  <button
                    onClick={() => {
                      cyberAudio.playClick();
                      setIsTimerRunning((prev) => !prev);
                    }}
                    className={`px-2 py-1 text-[10px] font-mono-code font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors ${
                      isTimerRunning
                        ? 'bg-[#ff7b00]/20 text-[#ff7b00]'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
                  </button>
                  <button
                    onClick={() => {
                      cyberAudio.playClick();
                      setElapsedSeconds(0);
                    }}
                    className="px-2 py-1 text-[10px] font-mono-code text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    title="Réinitialiser le chronomètre"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Aspect Ratio Preview Switch (16:9 vs 9:16 TikTok Live) */}
                <div className="flex items-center gap-1 bg-[#0b021a] border border-[#ff2a85]/35 p-0.5">
                  <button
                    onClick={() => {
                      cyberAudio.playClick();
                      setLayoutPreset('landscape');
                    }}
                    className={`px-2 py-1 text-[10px] font-mono-code uppercase flex items-center gap-1 cursor-pointer ${
                      layoutPreset !== 'vertical'
                        ? 'bg-[#00f0ff]/20 text-[#00f0ff]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Format Paysage 1920x1080 (Twitch / YouTube)"
                  >
                    <Monitor className="w-3 h-3" />
                    <span>16:9</span>
                  </button>
                  <button
                    onClick={() => {
                      cyberAudio.playClick();
                      setLayoutPreset('vertical');
                    }}
                    className={`px-2 py-1 text-[10px] font-mono-code uppercase flex items-center gap-1 cursor-pointer ${
                      layoutPreset === 'vertical'
                        ? 'bg-[#ff2a85]/30 text-[#ff2a85]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Format Vertical 9:16 (TikTok Live)"
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>9:16</span>
                  </button>
                </div>

                {/* Hide Signature Checkbox */}
                <button
                  type="button"
                  onClick={() => {
                    cyberAudio.playClick();
                    setHideSignature((prev) => !prev);
                  }}
                  className="flex items-center gap-1.5 text-[11px] font-mono-code text-slate-300 hover:text-white cursor-pointer whitespace-nowrap"
                >
                  {hideSignature ? (
                    <CheckSquare className="w-3.5 h-3.5 text-[#00f0ff]" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-500" />
                  )}
                  <span>Masquer signature</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Discreet hover-only restore trigger when in Mode Capture Propre */
        <div className="fixed top-3 right-3 z-50 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => {
              cyberAudio.playClick();
              setCleanCapture(false);
            }}
            className="px-3 py-1.5 bg-[#120428]/90 border border-[#00f0ff]/60 text-[#00f0ff] text-[11px] font-mono-code uppercase flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Afficher contrôles (H / Échap)</span>
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. SCENE OVERLAY PRINCIPALE (16:9 1920x1080 OU 9:16 TIKTOK LIVE)       */}
      {/* ===================================================================== */}
      <div
        className={`relative z-10 flex-1 w-full mx-auto flex flex-col justify-between transition-all duration-300 ${
          isVerticalPreview
            ? `max-w-[430px] ${
                cleanCapture
                  ? 'p-4 min-h-screen'
                  : 'my-4 border-2 border-dashed border-[#ff2a85]/50 p-4 min-h-[760px]'
              }`
            : 'p-4 sm:p-8'
        }`}
        style={
          isVerticalPreview && bgMode === 'transparent' && !cleanCapture
            ? { backgroundColor: 'rgba(18, 4, 40, 0.15)' }
            : undefined
        }
      >
        {/* TOP AREA: Cadre Webcam 16:9 + Right Live Streamer Widgets */}
        <div
          className={`flex flex-col ${
            isVerticalPreview ? 'gap-4 items-center' : 'lg:flex-row items-start justify-between gap-6'
          }`}
        >
          {/* CADRE WEBCAM NÉON 16:9 */}
          <div
            className={`relative ${
              isVerticalPreview ? 'w-full' : 'w-full sm:w-[340px] lg:w-[400px]'
            } shrink-0`}
          >
            <div
              className="relative aspect-video w-full p-[3px] shadow-[0_0_28px_rgba(255,42,133,0.45)]"
              style={{
                background: 'linear-gradient(135deg, #ff2a85 0%, #ff7b00 50%, #00f0ff 100%)',
                clipPath:
                  'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
              }}
            >
              <div
                className={`w-full h-full relative flex items-center justify-center overflow-hidden ${
                  bgMode === 'sunset' ? 'bg-[#0e0320]/80 backdrop-blur-sm' : ''
                }`}
                style={{
                  backgroundColor:
                    bgMode === 'chroma'
                      ? '#00ff00'
                      : bgMode === 'transparent'
                      ? 'transparent'
                      : undefined,
                  clipPath:
                    'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
                }}
              >
                <span className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#00f0ff]" />
                <span className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#ff2a85]" />
                <span className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#ff2a85]" />
                <span className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#00f0ff]" />

                {/* Animated LIVE Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-0.5 bg-[#120428]/95 border border-[#ff2a85] shadow-[0_0_12px_rgba(255,42,133,0.65)]">
                  <span className="w-2 h-2 rounded-full bg-[#ff2a85] animate-pulse" />
                  <span className="text-[11px] font-hud font-bold tracking-widest text-white uppercase">
                    LIVE
                  </span>
                </div>

                {bgMode === 'sunset' && (
                  <div className="text-center px-4 pointer-events-none">
                    <Video className="w-7 h-7 text-[#00f0ff]/60 mx-auto mb-1" />
                    <span className="text-[10px] font-mono-code uppercase tracking-widest text-slate-300/80 block">
                      CAMÉRA 16:9 · SUNSET NÉON
                    </span>
                  </div>
                )}

                {/* Streamer Nameplate */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2">
                  <div className="bg-[#120428]/95 border border-[#00f0ff]/60 px-3 py-1 shadow-[0_0_14px_rgba(0,240,255,0.28)] max-w-[85%]">
                    {cleanCapture ? (
                      <span className="text-xs sm:text-sm font-hud font-bold tracking-wider text-white uppercase truncate block">
                        {streamerName || '@Runner_10J'}
                      </span>
                    ) : (
                      <input
                        type="text"
                        value={streamerName}
                        onChange={(e) => setStreamerName(e.target.value)}
                        aria-label="Pseudo du streamer sur le cadre webcam"
                        className="bg-transparent text-xs sm:text-sm font-hud font-bold tracking-wider text-white uppercase focus:outline-none w-full min-w-[110px]"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: LIVE BROADCAST WIDGETS (Mission Active + Compteur Défi + Waiting Banner) */}
          <div className={`${isVerticalPreview ? 'w-full' : 'w-full lg:max-w-sm'} space-y-3`}>
            {/* Waiting Screen Card */}
            {bgMode === 'sunset' && showWaitingBanner && (
              <div
                className="bg-[#160631]/92 backdrop-blur-md border border-[#ff2a85]/55 shadow-[0_0_30px_rgba(255,42,133,0.3)] p-5"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
                }}
              >
                <div className="flex items-center gap-2 text-[11px] font-mono-code text-[#00f0ff] uppercase tracking-widest mb-1.5">
                  <Radio className="w-3.5 h-3.5 text-[#ff2a85] animate-pulse" />
                  <span>SIGNAL EN ATTENTE · SUNSET NÉON</span>
                </div>
                <h2 className="text-2xl font-hud font-bold text-white uppercase tracking-wide leading-tight">
                  Le live commence{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#00f0ff]">
                    bientôt
                  </span>
                </h2>
                <p className="text-xs text-slate-300 mt-1.5">
                  HUD synchronisé sur <span className="text-[#00f0ff] font-semibold">{activeProfile.universe}</span>.
                </p>
              </div>
            )}

            {/* Live Active Mission Widget */}
            {showMissionWidget && activeMission && (
              <div
                className="bg-[#120428]/92 backdrop-blur-md border border-[#00f0ff]/55 p-3.5 shadow-[0_0_24px_rgba(0,240,255,0.2)] space-y-2"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
                }}
              >
                <div className="flex items-center justify-between text-[10px] font-mono-code uppercase">
                  <span className="text-[#00f0ff] flex items-center gap-1.5 font-bold">
                    <Target className="w-3.5 h-3.5 text-[#ff2a85]" />
                    <span>Mission Active</span>
                  </span>
                  <span className="text-[#ff7b00] font-bold">
                    {completedStepsCount}/{activeMission.steps.length} étapes
                  </span>
                </div>

                <div className="font-hud font-bold text-sm sm:text-base text-white truncate">
                  {activeMission.title}
                </div>

                <div className="text-xs text-slate-300 font-mono-code flex items-center justify-between gap-2">
                  <span className="truncate">
                    {nextMissionStep ? `→ ${nextMissionStep.text}` : 'Toutes les étapes validées'}
                  </span>
                  {!cleanCapture && nextMissionStep && (
                    <button
                      onClick={() => {
                        cyberAudio.playFanfare();
                        toggleMissionStep(activeMission.id, nextMissionStep.id);
                      }}
                      className="px-2 py-0.5 bg-[#00f0ff]/20 hover:bg-[#00f0ff]/35 border border-[#00f0ff]/60 text-[#00f0ff] text-[10px] uppercase cursor-pointer shrink-0 flex items-center gap-1"
                      title="Valider l'étape suivante en direct"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Valider</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Live Challenge / Attempts Counter Widget */}
            {showChallengeWidget && (
              <div className="bg-[#120428]/92 backdrop-blur-md border border-[#ff2a85]/55 px-3.5 py-2.5 flex items-center justify-between gap-3 shadow-[0_0_20px_rgba(255,42,133,0.2)]">
                <div className="min-w-0 flex-1">
                  {cleanCapture ? (
                    <div className="text-[10px] font-mono-code uppercase tracking-wider text-[#ff7b00] truncate">
                      {challengeLabel}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={challengeLabel}
                      onChange={(e) => setChallengeLabel(e.target.value)}
                      maxLength={32}
                      aria-label="Nom du compteur en direct"
                      className="bg-transparent text-[10px] font-mono-code uppercase tracking-wider text-[#ff7b00] focus:outline-none w-full border-b border-transparent focus:border-[#00f0ff]"
                    />
                  )}
                  <div className="font-mono-code font-bold text-xl text-white">
                    {challengeCount}
                  </div>
                </div>

                {!cleanCapture && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        cyberAudio.playClick();
                        setChallengeCount((c) => Math.max(0, c - 1));
                      }}
                      className="p-1.5 bg-[#1b0838] hover:bg-[#2a0c54] border border-[#ff2a85]/40 text-slate-200 cursor-pointer"
                      aria-label="Décrémenter le compteur"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        cyberAudio.playChirp();
                        setChallengeCount((c) => c + 1);
                      }}
                      className="p-1.5 bg-[#ff2a85]/25 hover:bg-[#ff2a85]/40 border border-[#ff2a85]/70 text-white cursor-pointer"
                      aria-label="Incrémenter le compteur"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        cyberAudio.playClick();
                        setChallengeCount(0);
                      }}
                      className="p-1.5 bg-[#1b0838] hover:bg-[#2a0c54] border border-slate-700 text-slate-300 cursor-pointer"
                      aria-label="Réinitialiser le compteur"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM AREA: BARRE HUD TEMPS RÉEL + SIGNATURE MICRO */}
        <div className="mt-auto pt-6 space-y-2.5">
          <div
            className="w-full bg-[#120428]/95 border border-[#ff2a85]/70 shadow-[0_0_30px_rgba(18,4,40,0.85)] p-3.5 sm:px-6 sm:py-4"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
            }}
          >
            <div
              className={`grid gap-4 items-center ${
                isVerticalPreview ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-12'
              }`}
            >
              {/* Left: Stream Title + Universe Tag */}
              <div className={isVerticalPreview ? 'space-y-1' : 'md:col-span-5 min-w-0 space-y-1'}>
                <div className="flex items-center gap-2 text-[10px] font-mono-code uppercase tracking-widest text-[#00f0ff]">
                  <Sparkles className="w-3 h-3 text-[#ff7b00] shrink-0" />
                  <span className="truncate">
                    {activeProfile.name} · {activeProfile.universe}
                  </span>
                </div>
                {cleanCapture ? (
                  <div className="font-hud font-bold text-base sm:text-xl text-white tracking-wide truncate">
                    {streamTitle || 'Objectif 100 % — Jour 1'}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={streamTitle}
                    onChange={(e) => setStreamTitle(e.target.value)}
                    aria-label="Titre du stream dans la barre HUD"
                    className="w-full bg-transparent border-b border-[#ff2a85]/35 focus:border-[#00f0ff] font-hud font-bold text-base sm:text-xl text-white tracking-wide focus:outline-none pb-0.5"
                  />
                )}
              </div>

              {/* Center: Global Completion Bar */}
              <div className={isVerticalPreview ? 'space-y-1.5' : 'md:col-span-4 space-y-1.5'}>
                <div className="flex items-center justify-between text-xs font-mono-code">
                  <span className="text-slate-300 uppercase flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-[#ff7b00]" />
                    <span>Progression 100 %</span>
                  </span>
                  <span className="text-[#00f0ff] font-bold text-sm">{overallProgress}%</span>
                </div>

                <div className="h-2.5 w-full bg-[#090216] border border-[#ff2a85]/40 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#00f0ff] transition-all duration-500 shadow-[0_0_12px_rgba(0,240,255,0.6)]"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono-code text-slate-400">
                  <span className="flex items-center gap-1">
                    <Compass className="w-3 h-3 text-[#ff2a85]" />
                    Missions {stats.missionsDone}/{stats.missionsTotal}
                  </span>
                  <span>
                    Collectibles {stats.collectiblesDone}/{stats.collectiblesTotal} · Garage{' '}
                    {stats.vehiclesUnlocked}/{stats.vehiclesTotal}
                  </span>
                </div>
              </div>

              {/* Right: Session Stopwatch */}
              <div
                className={`${
                  isVerticalPreview
                    ? 'flex items-center justify-between pt-2 border-t border-[#ff2a85]/25'
                    : 'md:col-span-3 flex items-center justify-between md:justify-end gap-3 md:border-l md:border-[#ff2a85]/25 md:pl-4'
                }`}
              >
                <div className={isVerticalPreview ? '' : 'md:text-right'}>
                  <div className="text-[10px] font-mono-code uppercase tracking-widest text-[#ff7b00]">
                    Chrono Session
                  </div>
                  <div className="font-mono-code font-bold text-xl sm:text-2xl text-white tracking-wider">
                    {formatTimer(elapsedSeconds)}
                  </div>
                </div>

                {!cleanCapture && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        cyberAudio.playClick();
                        setIsTimerRunning((prev) => !prev);
                      }}
                      className="p-2 bg-[#1b0838] hover:bg-[#2a0c54] border border-[#00f0ff]/40 text-[#00f0ff] cursor-pointer transition-colors"
                      title={isTimerRunning ? 'Mettre en pause' : 'Démarrer'}
                    >
                      {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => {
                        cyberAudio.playClick();
                        setElapsedSeconds(0);
                      }}
                      className="p-2 bg-[#1b0838] hover:bg-[#2a0c54] border border-[#ff2a85]/40 text-[#ff2a85] cursor-pointer transition-colors"
                      title="Réinitialiser"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Micro-mention discrète JITALX • 10JITAL */}
          {!hideSignature && (
            <div className="flex justify-end">
              <span className="px-2.5 py-0.5 bg-[#120428]/90 border border-[#ff2a85]/35 text-[10px] font-mono-code tracking-widest text-slate-300">
                JITALX • 10JITAL
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamerOverlay;
