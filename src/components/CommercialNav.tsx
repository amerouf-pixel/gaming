import React, { useState } from 'react';
import { AppRoute } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLocale, LanguageSwitcher } from '../context/LocaleContext';
import { cyberAudio } from '../utils/cyberAudio';
import { Locale } from '../i18n/locale';
import { ArrowRight, Menu, X, User } from 'lucide-react';

interface CommercialNavProps {
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  language?: Locale;
}

export const CommercialNav: React.FC<CommercialNavProps> = ({
  activeRoute,
  onNavigate,
}) => {
  const { user, account } = useAuth();
  const { copy } = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = copy.nav;

  const navLinks: { route: AppRoute; label: string }[] = [
    { route: 'landing', label: t.products },
    { route: 'demo', label: t.demo },
    { route: 'pricing', label: t.pricing },
    { route: 'streamers', label: t.creators },
    { route: 'account', label: user ? account?.gamerTag || t.account : t.account },
  ];

  const handleNav = (route: AppRoute) => {
    cyberAudio.playClick();
    setMobileMenuOpen(false);
    onNavigate(route);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0a0910]/90 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Studio Wordmark */}
        <button
          type="button"
          onClick={() => handleNav('landing')}
          className="font-hud font-bold text-lg tracking-[0.14em] text-white hover:text-[#00f0ff] transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          10JITALX
        </button>

        {/* Zone 2: 5 Concise Single-Line Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300"
        >
          {navLinks.map((item) => {
            const active = activeRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => handleNav(item.route)}
                className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b ${
                  active
                    ? 'text-white border-[#ff2a85]'
                    : 'text-slate-400 border-transparent hover:text-white hover:border-white/30'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action (+ Mobile Menu Trigger) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('app')}
            className="px-4 py-2 rounded-lg bg-white text-[#0a0910] hover:bg-[#00f0ff] text-xs font-semibold tracking-wide flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0"
          >
            <span>{t.launchApp}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg text-slate-200 hover:text-white border border-white/15 bg-white/[0.04] cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0d0b16] px-4 py-3 space-y-1">
          {navLinks.map((item) => (
            <button
              key={item.route}
              type="button"
              onClick={() => handleNav(item.route)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer flex items-center justify-between ${
                activeRoute === item.route
                  ? 'bg-white/[0.08] text-white'
                  : 'text-slate-300 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              {item.route === 'account' && <User className="w-4 h-4 text-[#00f0ff]" />}
            </button>
          ))}
          <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between gap-3 px-1">
            <button
              type="button"
              onClick={() => handleNav('overlay')}
              className="text-left px-2 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/[0.04] hover:text-white cursor-pointer"
            >
              {t.obsStudio}
            </button>
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
};
