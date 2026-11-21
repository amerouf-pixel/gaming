import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { cyberAudio } from '../utils/cyberAudio';
import { GUMROAD_PRODUCT_URL } from '../services/stripeConfig';
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
  User,
  ExternalLink,
} from 'lucide-react';

interface HeaderProps {
  onOpenLanding?: () => void;
  onOpenAccount?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLanding, onOpenAccount }) => {
  const { activeProfile, activeTheme, profiles, setActiveProfile, sessionSeconds, overallProgress } =
    useGame();
  const { user, account } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(() => cyberAudio.getMuted());

  const isSunsetNeon = activeTheme === 'sunset-neon';
  const verifiedTier = user && account && account.subscriptionTier !== 'free'
    ? account.subscriptionTier
    : null;

  const handleToggleSound = () => {
    const muted = cyberAudio.toggleMute();
    setIsAudioMuted(muted);
  };

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
        isSunsetNeon
          ? 'bg-[#120428]/95 border-b border-[#ff2a85]/35'
          : 'bg-[#090d16]/95 border-b border-cyan-950/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Left: JITALX Brand & Universe Switcher */}
        <div className="flex items-center gap-3 relative min-w-0">
          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              onOpenLanding?.();
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 cursor-pointer transition-transform hover:scale-105 ${
              isSunsetNeon
                ? 'bg-gradient-to-br from-[#ff2a85]/25 via-[#ff7b00]/20 to-[#00f0ff]/15 border-[#ff2a85]/50 glow-pink'
                : 'bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border-cyan-500/40 glow-cyan'
            }`}
            title="Retour à la présentation JITALX"
          >
            {isSunsetNeon ? (
              <Sun className="w-5 h-5 text-[#ff7b00]" />
            ) : (
              <Gamepad2 className="w-5 h-5 text-cyan-400" />
            )}
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`font-hud font-bold text-lg tracking-wider text-transparent bg-clip-text ${
                  isSunsetNeon
                    ? 'bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#00f0ff]'
                    : 'bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300'
                }`}
              >
                JITALX
              </span>
              <span
                className={`hidden md:inline-block text-[10px] font-mono-code tracking-wider uppercase ${
                  isSunsetNeon ? 'text-[#00f0ff]/85' : 'text-cyan-400/85'
                }`}
              >
                THE STREAMER COMMAND HUB
              </span>
              {verifiedTier && (
                <span className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono-code bg-emerald-950/80 text-emerald-300 border border-emerald-600/60 rounded uppercase">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  <span>{verifiedTier}</span>
                </span>
              )}
            </div>

            {/* Universe / Profile Switcher */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer group ${
                  isSunsetNeon
                    ? 'text-slate-300 hover:text-[#00f0ff]'
                    : 'text-slate-400 hover:text-cyan-300'
                }`}
              >
                {getProfileIcon(activeProfile.avatarIcon)}
                <span className="font-medium truncate max-w-[125px] sm:max-w-[180px]">
                  {activeProfile.name}
                </span>
                <span className={`hidden xs:inline ${isSunsetNeon ? 'text-[#ff2a85]/80' : 'text-slate-600'}`}>
                  • {activeProfile.universe}
                </span>
                <ChevronDown
                  className={`w-3 h-3 shrink-0 ${
                    isSunsetNeon
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
                      isSunsetNeon
                        ? 'bg-[#1b0838] border border-[#ff2a85]/50 divide-[#ff2a85]/20'
                        : 'bg-[#0d1424] border border-cyan-900/60 divide-slate-800/60'
                    }`}
                  >
                    <div className="px-2 py-1 text-[11px] font-mono-code uppercase tracking-wider text-slate-300">
                      Profils &amp; Univers
                    </div>
                    <div className="pt-1.5 space-y-1 max-h-64 overflow-y-auto">
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
                              ? isSunsetNeon
                                ? 'bg-[#ff2a85]/20 text-[#00f0ff] border border-[#ff2a85]/50'
                                : 'bg-cyan-950/60 text-cyan-300 border border-cyan-700/40'
                              : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {getProfileIcon(p.avatarIcon)}
                            <div className="min-w-0">
                              <div className="font-semibold truncate">{p.name}</div>
                              <div className="text-[10px] text-slate-400 truncate">{p.universe}</div>
                            </div>
                          </div>
                          {activeProfile.id === p.id && (
                            <CheckCircle2
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isSunsetNeon ? 'text-[#00f0ff]' : 'text-cyan-400'
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

        {/* Right: Clean Compact Utilities */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {onOpenAccount && (
            <button
              onClick={() => {
                cyberAudio.playClick();
                onOpenAccount();
              }}
              className={`px-2.5 py-1.5 text-[11px] font-hud font-bold uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                isSunsetNeon
                  ? 'bg-[#1b0838] hover:bg-[#2a0c54] text-slate-100 border-[#ff2a85]/45 hover:border-[#00f0ff]'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
              }`}
              title={user ? `Compte connecté : ${user.email}` : 'Connexion / Profils Cloud'}
            >
              <User className={`w-3.5 h-3.5 ${isSunsetNeon ? 'text-[#00f0ff]' : 'text-cyan-400'}`} />
              <span className="hidden sm:inline max-w-[90px] truncate">
                {user ? account?.gamerTag || 'Compte' : 'Compte'}
              </span>
            </button>
          )}

          {/* Honest Direct Gumroad Offer Link */}
          <a
            href={GUMROAD_PRODUCT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => cyberAudio.playChirp()}
            className={`hidden sm:inline-flex px-2.5 py-1.5 text-[11px] font-hud font-bold uppercase tracking-wider border transition-all items-center gap-1 whitespace-nowrap ${
              isSunsetNeon
                ? 'bg-gradient-to-r from-[#ff2a85]/20 to-[#ff7b00]/20 hover:from-[#ff2a85]/35 hover:to-[#ff7b00]/35 text-[#ff7b00] border-[#ff2a85]/50'
                : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
            title="Offre de lancement JITALX Full Access (7 € sur Gumroad)"
          >
            <span>OFFRE 7 €</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 border transition-colors cursor-pointer ${
              isAudioMuted
                ? 'border-slate-800 bg-slate-900/80 text-slate-500 hover:text-slate-300'
                : isSunsetNeon
                ? 'border-[#00f0ff]/50 bg-[#00f0ff]/10 text-[#00f0ff] hover:bg-[#00f0ff]/20'
                : 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
            }`}
            title={isAudioMuted ? 'Activer les effets sonores' : 'Couper les effets sonores'}
            aria-label="Activer ou couper le son"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Session Duration */}
          <div
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-200 font-mono-code tabular-nums ${
              isSunsetNeon
                ? 'bg-[#1b0838]/90 border border-[#ff2a85]/30'
                : 'bg-slate-900/80 border border-slate-800'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${isSunsetNeon ? 'text-[#ff7b00]' : 'text-cyan-400'}`} />
            <span>{formatTime(sessionSeconds)}</span>
          </div>

          {/* Overall Progress */}
          <div
            className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl ${
              isSunsetNeon
                ? 'bg-[#1b0838]/90 border border-[#00f0ff]/30'
                : 'bg-slate-900/80 border border-cyan-950'
            }`}
          >
            <Award className={`w-4 h-4 ${isSunsetNeon ? 'text-[#ff7b00]' : 'text-amber-400'}`} />
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono-code text-slate-400 leading-none">
                Global
              </div>
              <div
                className={`font-hud font-bold text-sm leading-none mt-0.5 tabular-nums ${
                  isSunsetNeon ? 'text-[#00f0ff]' : 'text-cyan-300'
                }`}
              >
                {overallProgress}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
