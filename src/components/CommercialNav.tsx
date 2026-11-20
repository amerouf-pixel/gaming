import React, { useState } from 'react';
import { AppRoute } from '../types';
import { useAuth } from '../context/AuthContext';
import { cyberAudio } from '../utils/cyberAudio';
import { Crosshair, ArrowRight, User, Menu, X } from 'lucide-react';

interface CommercialNavProps {
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  language?: 'fr' | 'en';
}

export const CommercialNav: React.FC<CommercialNavProps> = ({
  activeRoute,
  onNavigate,
  language = 'fr',
}) => {
  const { user, account } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isEn = language === 'en';

  const navLinks: { route: AppRoute; label: string }[] = [
    { route: 'landing', label: isEn ? 'Overview' : 'Accueil' },
    { route: 'demo', label: isEn ? 'Live Demo' : 'Démo' },
    { route: 'pricing', label: isEn ? 'Pricing' : 'Tarifs' },
    { route: 'streamers', label: 'GTA 6 Streamers' },
    { route: 'overlay', label: 'OBS Overlay' },
  ];

  const handleNav = (route: AppRoute) => {
    cyberAudio.playClick();
    setMobileMenuOpen(false);
    onNavigate(route);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#120428]/95 backdrop-blur-md border-b border-[#ff2a85]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNav('landing')}
          className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0 text-left"
        >
          <span className="w-8 h-8 bg-[#ff2a85]/15 border border-[#ff2a85]/50 flex items-center justify-center text-[#00f0ff]">
            <Crosshair className="w-4 h-4" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-hud font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#00f0ff]">
              JITALX
            </span>
            <span className="hidden lg:block text-[9px] font-mono-code tracking-widest text-[#00f0ff]/85 uppercase mt-0.5">
              THE STREAMER COMMAND HUB
            </span>
          </span>
        </button>

        {/* Zone 2: Clean Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((item) => {
            const active = activeRoute === item.route;
            return (
              <button
                key={item.route}
                onClick={() => handleNav(item.route)}
                className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b-2 ${
                  active
                    ? 'text-[#00f0ff] border-[#ff2a85] font-semibold'
                    : 'text-slate-300 border-transparent hover:text-white hover:border-[#00f0ff]/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Account + Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => handleNav('account')}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeRoute === 'account'
                ? 'bg-[#ff2a85]/20 border-[#ff2a85] text-white'
                : 'bg-[#1b0838] border-[#ff2a85]/30 text-slate-200 hover:border-[#00f0ff]/60 hover:text-[#00f0ff]'
            }`}
          >
            <User className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>
              {user
                ? account?.gamerTag || user.displayName?.split(' ')[0] || (isEn ? 'Account' : 'Compte')
                : isEn
                ? 'Sign In'
                : 'Connexion'}
            </span>
          </button>

          <button
            onClick={() => handleNav('app')}
            className="px-4 py-2 bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] hover:brightness-110 text-white text-xs font-hud font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap shrink-0 shadow-[0_0_16px_rgba(255,42,133,0.4)]"
          >
            <span>{isEn ? 'Try JITALX Free' : 'Ouvrir JITALX'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 text-slate-200 hover:text-[#00f0ff] border border-[#ff2a85]/30 bg-[#1b0838] cursor-pointer"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#ff2a85]/25 bg-[#120428] px-4 py-3 space-y-1.5">
          {navLinks.map((item) => (
            <button
              key={item.route}
              onClick={() => handleNav(item.route)}
              className={`w-full text-left px-3 py-2.5 text-sm font-medium cursor-pointer block ${
                activeRoute === item.route
                  ? 'bg-[#ff2a85]/20 text-[#00f0ff] border border-[#ff2a85]/40'
                  : 'text-slate-200 hover:bg-[#1b0838]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNav('account')}
            className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-[#1b0838] cursor-pointer flex items-center gap-2 border-t border-[#ff2a85]/20 pt-3 mt-2"
          >
            <User className="w-4 h-4 text-[#00f0ff]" />
            <span>
              {user
                ? account?.gamerTag || (isEn ? 'My Account' : 'Mon compte')
                : isEn
                ? 'Sign In / Account'
                : 'Connexion / Espace membre'}
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
