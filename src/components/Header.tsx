import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { cyberAudio } from '../utils/cyberAudio';
import {
  Gamepad2,
  Zap,
  Flame,
  Sun,
  Clock,
  Award,
  ChevronDown,
  CheckCircle2,
  Volume2,
  VolumeX,
  HardDrive,
  Video,
  User,
} from 'lucide-react';
import { ModalSaveDesktop } from './ModalSaveDesktop';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onOpenLanding?: () => void;
  onOpenStreamer?: () => void;
  onOpenAccount?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLanding,
  onOpenStreamer,
  onOpenAccount,
}) => {
  const { activeProfile, activeTheme, profiles, setActiveProfile, sessionSeconds, overallProgress } =
    useGame();
  const { user, account } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(() => cyberAudio.getMuted());
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const isViceSunset = activeTheme === 'sunset-neon';

  const handleToggleSound = () => {
    const muted = cyberAudio.toggleMute();
    setIsAudioMuted(muted);
  };

  // Format session time HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProfileIcon = (icon: string) => {
    switch (icon) {
      case 'Sun':
        return <Sun className="w-4 h-4 text-[#ff7b00]" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-[#00f0ff]" />;
      case 'Flame':
        return <Flame className="w-4 h-4 text-[#ff2a85]" />;
      default:
        return <Gamepad2 className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md shadow-lg transition-colors duration-300 ${
        isViceSunset
          ? 'bg-[#120428]/95 border-b border-[#ff2a85]/35'
          : 'bg-[#090d16]/95 border-b border-cyan-950/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Left: App Logo & Game Universe Selector */}
        <div className="flex items-center gap-3 relative">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              isViceSunset
                ? 'bg-gradient-to-br from-[#ff2a85]/25 via-[#ff7b00]/20 to-[#00f0ff]/15 border-[#ff2a85]/50 glow-pink'
                : 'bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border-cyan-500/40 glow-cyan'
            }`}
          >
            {isViceSunset ? (
              <Sun className="w-5 h-5 text-[#ff7b00]" />
            ) : (
              <Gamepad2 className="w-5 h-5 text-cyan-400" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`font-hud font-bold text-lg tracking-wider text-transparent bg-clip-text ${
                  isViceSunset
                    ? 'bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#00f0ff]'
                    : 'bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300'
                }`}
              >
                JITALX
              </span>
              <span
                className={`hidden sm:inline-block text-[10px] font-mono-code tracking-wider uppercase ${
                  isViceSunset ? 'text-[#00f0ff]/90' : 'text-cyan-400/90'
                }`}
              >
                THE STREAMER COMMAND HUB
              </span>
              {typeof window !== 'undefined' && localStorage.getItem('cyber_license') && (
                <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono-code bg-emerald-950/80 text-emerald-300 border border-emerald-600/60 rounded shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  <span>FULL ACCESS</span>
                </span>
              )}
            </div>

            {/* Game Universe / Profile Switcher */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer group ${
                  isViceSunset
                    ? 'text-slate-300 hover:text-[#00f0ff]'
                    : 'text-slate-400 hover:text-cyan-300'
                }`}
              >
                {getProfileIcon(activeProfile.avatarIcon)}
                <span className="font-medium truncate max-w-[130px] sm:max-w-[180px]">
                  {activeProfile.name}
                </span>
                <span className={isViceSunset ? 'text-[#ff2a85]/80' : 'text-slate-600'}>
                  • {activeProfile.universe}
                </span>
                <ChevronDown
                  className={`w-3 h-3 ${
                    isViceSunset
                      ? 'text-slate-400 group-hover:text-[#ff2a85]'
                      : 'text-slate-500 group-hover:text-cyan-400'
                  }`}
                />
              </button>

              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-50"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div
                    className={`absolute left-0 mt-2 w-64 rounded-xl shadow-2xl p-2 z-50 divide-y ${
                      isViceSunset
                        ? 'bg-[#1b0838] border border-[#ff2a85]/50 divide-[#ff2a85]/20'
                        : 'bg-[#0d1424] border border-cyan-900/60 divide-slate-800/60'
                    }`}
                  >
                    <div className="px-2 py-1 text-[11px] font-mono-code uppercase tracking-wider text-slate-300">
                      Changer d&apos;univers de jeu
                    </div>
                    <div className="pt-1.5 space-y-1">
                      {profiles.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            cyberAudio.playClick();
                            setActiveProfile(p);
                            setProfileDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                            activeProfile.id === p.id
                              ? isViceSunset
                                ? 'bg-[#ff2a85]/20 text-[#00f0ff] border border-[#ff2a85]/50'
                                : 'bg-cyan-950/60 text-cyan-300 border border-cyan-700/40'
                              : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {getProfileIcon(p.avatarIcon)}
                            <div>
                              <div className="font-semibold">{p.name}</div>
                              <div className="text-[10px] text-slate-400">{p.universe}</div>
                            </div>
                          </div>
                          {activeProfile.id === p.id && (
                            <CheckCircle2
                              className={`w-3.5 h-3.5 ${
                                isViceSunset ? 'text-[#00f0ff]' : 'text-cyan-400'
                              }`}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Live Session Clock, Audio Toggle & Overall Progress */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mode Streamer / Overlay OBS Button */}
          {onOpenStreamer && (
            <button
              onClick={() => {
                cyberAudio.playChirp();
                onOpenStreamer();
              }}
              className={`px-2 sm:px-2.5 py-1.5 text-[10px] sm:text-[11px] font-hud font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                isViceSunset
                  ? 'bg-[#ff2a85]/15 hover:bg-[#ff2a85]/30 text-[#ff2a85] border-[#ff2a85]/60 shadow-[0_0_12px_rgba(255,42,133,0.3)]'
                  : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.25)]'
              }`}
              title="Ouvrir l'Overlay OBS / TikTok Live Studio"
            >
              <Video className="w-3.5 h-3.5 shrink-0" />
              <span>MODE STREAMER</span>
            </button>
          )}

          {/* Save to Desktop Button */}
          <button
            onClick={() => {
              cyberAudio.playClick();
              setIsSaveModalOpen(true);
            }}
            className={`px-2.5 py-1.5 text-[11px] font-hud font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              isViceSunset
                ? 'bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
            }`}
            title="Enregistrer le projet sur votre Bureau"
          >
            <HardDrive className={`w-3.5 h-3.5 ${isViceSunset ? 'text-[#00f0ff]' : 'text-cyan-400'}`} />
            <span className="hidden lg:inline">SUR LE BUREAU</span>
          </button>

          {/* Account / Profile Button */}
          {onOpenAccount && (
            <button
              onClick={() => {
                cyberAudio.playClick();
                onOpenAccount();
              }}
              className={`px-2.5 py-1.5 text-[11px] font-hud font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                isViceSunset
                  ? 'bg-[#1b0838] hover:bg-[#2a0c54] text-slate-100 border-[#ff2a85]/45 hover:border-[#00f0ff]'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
              }`}
              title={user ? `Compte connecté : ${user.email}` : 'Connexion / Espace Membre'}
            >
              <User className={`w-3.5 h-3.5 ${isViceSunset ? 'text-[#00f0ff]' : 'text-cyan-400'}`} />
              <span className="hidden xl:inline max-w-[90px] truncate">
                {user ? account?.gamerTag || 'Compte' : 'Compte'}
              </span>
            </button>
          )}

          {/* Landing Page Showcase Button */}
          {onOpenLanding && (
            <button
              onClick={() => {
                cyberAudio.playChirp();
                onOpenLanding();
              }}
              className={`px-2.5 py-1.5 text-[11px] font-hud font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0 ${
                isViceSunset
                  ? 'bg-gradient-to-r from-[#ff2a85]/20 to-[#ff7b00]/20 hover:from-[#ff2a85]/30 hover:to-[#ff7b00]/30 text-[#ff7b00] border-[#ff2a85]/50 shadow-[0_0_12px_rgba(255,42,133,0.25)]'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
              }`}
              title="Afficher la page commerciale et les formules"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="hidden lg:inline">OFFRE 7 €</span>
            </button>
          )}

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 border transition-colors cursor-pointer ${
              isAudioMuted
                ? 'border-slate-800 bg-slate-900/80 text-slate-500 hover:text-slate-300'
                : isViceSunset
                ? 'border-[#00f0ff]/50 bg-[#00f0ff]/10 text-[#00f0ff] hover:bg-[#00f0ff]/20 shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                : 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
            }`}
            title={isAudioMuted ? 'Activer le son tactique' : 'Couper le son tactique'}
            aria-label="Toggle Tactical Sound"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Session Duration */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-200 font-mono-code tabular-nums ${
              isViceSunset
                ? 'bg-[#1b0838]/90 border border-[#ff2a85]/30'
                : 'bg-slate-900/80 border border-slate-800'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${isViceSunset ? 'text-[#ff7b00]' : 'text-cyan-400'}`} />
            <span>SESSION {formatTime(sessionSeconds)}</span>
          </div>

          {/* Overall 100% Progress Ring / Bar */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${
              isViceSunset
                ? 'bg-[#1b0838]/90 border border-[#00f0ff]/30'
                : 'bg-slate-900/80 border border-cyan-950'
            }`}
          >
            <Award className={`w-4 h-4 ${isViceSunset ? 'text-[#ff7b00]' : 'text-amber-400'}`} />
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono-code text-slate-400 leading-none">
                Progression
              </div>
              <div
                className={`font-hud font-bold text-sm leading-none mt-0.5 tabular-nums ${
                  isViceSunset ? 'text-[#00f0ff]' : 'text-cyan-300'
                }`}
              >
                {overallProgress}%
              </div>
            </div>
            <div className="w-12 h-2 bg-slate-900/90 rounded-full overflow-hidden ml-1 hidden xs:block">
              <div
                className={`h-full transition-all duration-500 ${
                  isViceSunset
                    ? 'bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#00f0ff]'
                    : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
                }`}
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Guide Enregistrer sur le Bureau */}
      <ModalSaveDesktop
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
      />
    </header>
  );
};
