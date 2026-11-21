import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Locale, DEFAULT_LOCALE, STUDIO_COPY, StudioCopy } from '../i18n/locale';
import { APP_COPY, AppCopy } from '../i18n/appLocale';
import { cyberAudio } from '../utils/cyberAudio';

const LOCALE_STORAGE_KEY = '10jitalx_locale_v1';

interface LocaleContextType {
  locale: Locale;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
  copy: StudioCopy;
  appCopy: AppCopy;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

function readInitialLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  try {
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === 'en' || saved === 'fr') return saved;
  } catch {
    // ignore storage access errors
  }
  return DEFAULT_LOCALE;
}

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // ignore storage errors
    }
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => (prev === 'en' ? 'fr' : 'en'));
  }, []);

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        toggleLocale,
        copy: STUDIO_COPY[locale],
        appCopy: APP_COPY[locale],
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

export function useLocale(): LocaleContextType {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return ctx;
}

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { locale, setLocale } = useLocale();

  return (
    <div
      role="group"
      aria-label="Language selection"
      className={`inline-flex items-center p-0.5 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-mono-code ${className}`}
    >
      {(['en', 'fr'] as Locale[]).map((lang) => {
        const active = locale === lang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => {
              if (!active) {
                cyberAudio.playClick();
                setLocale(lang);
              }
            }}
            aria-pressed={active}
            className={`px-2.5 py-1 rounded-md uppercase transition-colors cursor-pointer whitespace-nowrap ${
              active
                ? 'bg-white text-[#0a0910] font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang}
          </button>
        );
      })}
    </div>
  );
};
