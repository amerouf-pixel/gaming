import React, { useState } from 'react';
import { AppRoute } from '../types';
import { cyberAudio } from '../utils/cyberAudio';
import { CheckoutTerminal } from './CheckoutTerminal';
import { CommercialNav } from './CommercialNav';
import {
  Zap,
  Shield,
  Gauge,
  Check,
  ArrowRight,
  Cpu,
  Lock,
  Unlock,
  Radio,
  Video,
  Compass,
  Sparkles,
  Trophy,
  BarChart3,
  Cloud,
} from 'lucide-react';

// COLLER MON LIEN GUMROAD OU WHOP ICI
const DEFAULT_PAYMENT_URL = 'https://gumroad.com/l/jitalx-full-access';

interface LandingPageProps {
  onEnterApp?: () => void;
  onNavigate?: (route: AppRoute) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onNavigate }) => {
  const [tuningLevel, setTuningLevel] = useState<number>(35);
  const [activeCheckout, setActiveCheckout] = useState<{
    planName: string;
    price: string;
    duration: string;
    redirectUrl?: string;
  } | null>(null);

  const navigateTo = (route: AppRoute) => {
    if (onNavigate) {
      onNavigate(route);
    } else if (route === 'app' && onEnterApp) {
      onEnterApp();
    }
  };

  // Interactive tuning stats
  const currentSpeed = Math.min(100, Math.round(58 + (42 * tuningLevel) / 100));
  const currentArmor = Math.min(100, Math.round(40 + (55 * tuningLevel) / 100));
  const isMaxTuning = tuningLevel >= 100;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setTuningLevel(val);
    if (val === 100) {
      cyberAudio.playFanfare();
    } else if (val % 15 === 0) {
      cyberAudio.playClick();
    }
  };

  const modules = [
    {
      index: '01',
      title: 'Tableau de bord & Radar 360°',
      description:
        'Visualisez vos objectifs prioritaires, votre progression 100 % et les points d’intérêt à proximité avec un radar holographique interactif.',
      icon: Radio,
      accent: 'text-[#00f0ff]',
    },
    {
      index: '02',
      title: 'Missions, Collectibles & Garage',
      description:
        'Suivez chaque étape de quête, enregistrez vos coordonnées GPS, comparez vos véhicules et cochez vos objets cachés en temps réel.',
      icon: Compass,
      accent: 'text-[#ff2a85]',
    },
    {
      index: '03',
      title: 'Mode Streamer OBS & TikTok Live',
      description:
        'Overlay intégré prêt pour OBS Studio (Fond Vert Chroma, Transparent Browser Source, Sunset Néon), cadre webcam 16:9 et mise en page verticale 9:16.',
      icon: Video,
      accent: 'text-[#ff7b00]',
    },
    {
      index: '04',
      title: 'Trophées, Notes & Sauvegarde Cloud',
      description:
        'Alertes de succès HUD avec synthèse Web Audio, bloc-notes tactique rapide, export JSON hors-ligne et synchronisation Firebase par compte.',
      icon: Cloud,
      accent: 'text-[#00f0ff]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#120428] text-slate-100 flex flex-col font-sans selection:bg-[#ff2a85]/30 selection:text-[#00f0ff] relative overflow-x-hidden">
      <CommercialNav activeRoute="landing" onNavigate={navigateTo} />

      {/* ===================================================================== */}
      {/* 1. HERO SECTION                                                       */}
      {/* ===================================================================== */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-16 max-w-7xl mx-auto w-full">
        {/* Sunset Néon Ambient Atmosphere */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ff2a85]/16 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#ff7b00]/12 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-[#00f0ff]/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-mono-code text-[#00f0ff] tracking-widest uppercase">
              JITALX · THE STREAMER COMMAND HUB · OBS READY
            </div>

            <h1 className="text-3xl sm:text-5xl font-hud font-bold text-white tracking-wide leading-[1.08]">
              Pilotez vos sessions 100 % et vos lives depuis un{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#00f0ff]">
                centre de commandement tactique
              </span>
            </h1>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl">
              JITALX rassemble votre suivi de missions, collectibles, véhicules, trophées, notes
              tactiques et un studio d&apos;overlay OBS / TikTok Live dans une seule plateforme
              gaming dédiée aux streamers et créateurs de contenu, utilisable hors-ligne ou
              synchronisée avec votre compte.
            </p>

            <div className="space-y-2 pt-2 border-t border-[#ff2a85]/25 text-xs sm:text-sm font-mono-code text-slate-200">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#00f0ff] shrink-0" />
                <span>Radar holographique 360° et suivi de complétion synchronisé</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#ff2a85] shrink-0" />
                <span>Overlay Streamer 16:9 (Twitch/YouTube) &amp; 9:16 (TikTok Live)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#ff7b00] shrink-0" />
                <span>Sauvegarde locale JSON + Synchronisation Cloud Firebase sécurisée</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => {
                  cyberAudio.playTargetAcquired();
                  navigateTo('app');
                }}
                className="px-6 py-3.5 bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#ff2a85] hover:brightness-110 text-white font-hud font-bold text-sm tracking-widest uppercase shadow-[0_0_24px_rgba(255,42,133,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Essayer JITALX gratuitement</span>
              </button>

              <button
                onClick={() => {
                  cyberAudio.playClick();
                  navigateTo('demo');
                }}
                className="px-5 py-3.5 bg-[#1b0838] hover:bg-[#260b4d] text-[#00f0ff] border border-[#00f0ff]/45 text-xs font-hud font-bold tracking-wider uppercase transition-colors cursor-pointer text-center whitespace-nowrap"
              >
                Voir la démo interactive
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono-code text-slate-400">
              <span className="text-[#ff7b00] font-semibold">OFFRE DE LANCEMENT</span>
              <span aria-hidden="true">·</span>
              <span>7 € — Paiement unique / Accès à vie</span>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => navigateTo('streamers')}
                className="text-[#00f0ff] hover:underline cursor-pointer"
              >
                GTA 6 Streamers (EN) →
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Live Tuning Module */}
          <div className="lg:col-span-6">
            <div
              className={`relative bg-[#160631] border-2 transition-all duration-300 p-5 sm:p-7 shadow-2xl ${
                isMaxTuning
                  ? 'border-[#00f0ff] shadow-[0_0_35px_rgba(0,240,255,0.45)]'
                  : 'border-[#ff2a85]/50 shadow-[0_0_25px_rgba(255,42,133,0.2)]'
              }`}
              style={{
                clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
              }}
            >
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00f0ff] pointer-events-none" />

              <div className="flex items-center justify-between border-b border-[#ff2a85]/25 pb-3 mb-4">
                <div>
                  <span className="text-[10px] font-mono-code text-[#00f0ff] uppercase tracking-widest">
                    Aperçu interactif · Module Garage Sunset Néon
                  </span>
                  <h3 className="font-hud font-bold text-lg text-white mt-0.5">SOLARIS APEX GT</h3>
                </div>
                <span className="text-xs font-mono-code text-[#ff2a85] uppercase font-bold">
                  SPORT
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between items-center text-xs font-mono-code mb-1">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-[#00f0ff]" />
                      Vitesse Max
                    </span>
                    <span className="text-[#00f0ff] font-bold text-sm">{currentSpeed} / 100</span>
                  </div>
                  <div className="h-2 w-full bg-[#0e0320] overflow-hidden border border-[#ff2a85]/25">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff2a85] to-[#00f0ff] transition-all duration-150"
                      style={{ width: `${currentSpeed}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-mono-code mb-1">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#ff7b00]" />
                      Châssis Renforcé
                    </span>
                    <span className="text-[#ff7b00] font-bold text-sm">{currentArmor} / 100</span>
                  </div>
                  <div className="h-2 w-full bg-[#0e0320] overflow-hidden border border-[#ff2a85]/25">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff7b00] to-[#ff2a85] transition-all duration-150"
                      style={{ width: `${currentArmor}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#0e0320] p-4 border border-[#ff2a85]/30 space-y-2 mb-6">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="tuning-slider"
                    className="text-xs font-hud font-bold text-[#ff7b00] uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Cpu className="w-4 h-4 text-[#ff7b00]" />
                    <span>Tester la jauge de préparation</span>
                  </label>
                  <span className="text-xs font-mono-code text-white font-bold">
                    {tuningLevel}%
                  </span>
                </div>

                <input
                  id="tuning-slider"
                  type="range"
                  min="0"
                  max="100"
                  value={tuningLevel}
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-[#260b4d] accent-[#ff2a85] cursor-pointer appearance-none outline-none"
                />

                <div className="flex justify-between text-[10px] font-mono-code text-slate-400">
                  <span>Série</span>
                  <span className="text-[#00f0ff]">Glissez vers 100 %</span>
                  <span>Configuration Max</span>
                </div>
              </div>

              {isMaxTuning ? (
                <button
                  onClick={() => {
                    cyberAudio.playTargetAcquired();
                    setActiveCheckout({
                      planName: 'JITALX FULL ACCESS',
                      price: '7.00',
                      duration: 'PAIEMENT UNIQUE · ACCÈS À VIE',
                      redirectUrl: DEFAULT_PAYMENT_URL,
                    });
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#00f0ff] hover:brightness-110 text-white font-hud font-bold text-sm tracking-widest uppercase shadow-[0_0_24px_rgba(255,42,133,0.6)] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Voir l&apos;offre JITALX Full Access (7 €)</span>
                </button>
              ) : (
                <div className="p-3 bg-[#0e0320] border border-dashed border-[#ff2a85]/40 flex items-center justify-between text-xs font-mono-code text-slate-300">
                  <span className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#ff2a85]" />
                    Simulation en direct : {tuningLevel}%
                  </span>
                  <span className="text-[#00f0ff]">Poussez à 100 % →</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. PRESENTATION CLAIRE DES FONCTIONNALITES                            */}
      {/* ===================================================================== */}
      <section className="border-y border-[#ff2a85]/20 bg-[#15052e] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl space-y-2">
              <div className="text-xs font-mono-code text-[#ff7b00] uppercase tracking-widest">
                Architecture complète
              </div>
              <h2 className="text-3xl sm:text-4xl font-hud font-bold text-white">
                Tous vos outils gaming et streaming dans une seule suite
              </h2>
            </div>

            <button
              onClick={() => navigateTo('demo')}
              className="text-xs font-hud font-bold uppercase tracking-wider text-[#00f0ff] hover:text-white flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
            >
              <span>Explorer la démo interactive</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <div
                  key={mod.index}
                  className="bg-[#180633] border border-[#ff2a85]/30 hover:border-[#00f0ff]/55 p-6 transition-colors space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-code text-slate-400">{mod.index}.</span>
                    <Icon className={`w-5 h-5 ${mod.accent}`} />
                  </div>
                  <h3 className="font-hud font-bold text-xl text-white">{mod.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{mod.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. FOCUS STREAMERS & TARIFS                                           */}
      {/* ===================================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* GTA 6 Streamers Launch Callout */}
        <div className="lg:col-span-7 bg-[#180633] border border-[#00f0ff]/40 p-7 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="text-xs font-mono-code text-[#00f0ff] uppercase tracking-widest">
              International Creator Launch
            </div>
            <h2 className="text-2xl sm:text-3xl font-hud font-bold text-white">
              Prêt pour les streams GTA 6 sur Twitch, YouTube &amp; TikTok Live
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Découvrez notre présentation internationale en anglais dédiée aux créateurs de
              contenu, avec accès direct à l&apos;Overlay OBS, avantages streamers et formulaire de
              partenariat.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono-code text-slate-200">
              <div className="p-3 bg-[#0e0320] border border-[#ff2a85]/25 flex items-center gap-2">
                <Video className="w-4 h-4 text-[#ff2a85] shrink-0" />
                <span>Chroma &amp; Transparent</span>
              </div>
              <div className="p-3 bg-[#0e0320] border border-[#ff2a85]/25 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00f0ff] shrink-0" />
                <span>16:9 &amp; 9:16 natif</span>
              </div>
              <div className="p-3 bg-[#0e0320] border border-[#ff2a85]/25 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#ff7b00] shrink-0" />
                <span>Progression Live</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigateTo('streamers')}
              className="px-5 py-3 bg-[#00f0ff] hover:bg-[#4ff6ff] text-[#120428] font-hud font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <span>Page GTA 6 Streamers (EN)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateTo('overlay')}
              className="px-5 py-3 bg-[#0e0320] hover:bg-[#240a4a] border border-[#ff2a85]/50 text-[#ff2a85] font-hud font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Lancer l&apos;Overlay OBS
            </button>
          </div>
        </div>

        {/* Launch Offer Summary Card */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#230948] to-[#14042c] border-2 border-[#ff2a85] p-7 flex flex-col justify-between shadow-[0_0_32px_rgba(255,42,133,0.3)] space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono-code text-[#ff7b00] font-bold uppercase">
                Offre de lancement
              </span>
              <Trophy className="w-4 h-4 text-[#00f0ff]" />
            </div>
            <h3 className="font-hud font-bold text-2xl text-white">JITALX FULL ACCESS</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold font-mono-code text-[#00f0ff]">7 €</span>
              <span className="text-xs font-mono-code text-slate-300">
                Paiement unique · Accès à vie
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Débloquez la licence complète ou comparez les formules mensuelles et Creator Studio
              sur notre page Tarifs dédiée.
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => {
                cyberAudio.playChirp();
                setActiveCheckout({
                  planName: 'JITALX FULL ACCESS',
                  price: '7.00',
                  duration: 'PAIEMENT UNIQUE · ACCÈS À VIE',
                  redirectUrl: DEFAULT_PAYMENT_URL,
                });
              }}
              className="w-full py-3.5 bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#00f0ff] hover:brightness-110 text-white font-hud font-bold text-xs uppercase tracking-widest cursor-pointer"
            >
              Obtenir JITALX Full Access (7 €)
            </button>

            <button
              onClick={() => navigateTo('pricing')}
              className="w-full py-2.5 bg-[#0e0320] hover:bg-[#1b0838] border border-[#00f0ff]/40 text-[#00f0ff] font-hud font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Comparer toutes les formules →
            </button>
          </div>
        </div>
      </section>

      {/* Checkout Terminal Modal */}
      {activeCheckout && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md">
          <CheckoutTerminal
            planName={activeCheckout.planName}
            price={activeCheckout.price}
            duration={activeCheckout.duration}
            redirectUrl={activeCheckout.redirectUrl}
            onClose={() => setActiveCheckout(null)}
            onSuccess={() => {
              setActiveCheckout(null);
              navigateTo('app');
            }}
          />
        </div>
      )}

      {/* Quiet Commercial Footer */}
      <footer className="border-t border-[#ff2a85]/25 bg-[#0e0320] py-8 px-4 sm:px-8 mt-auto text-center text-xs font-mono-code text-slate-400 space-y-2">
        <p>© 2026 10JITAL Production · JITALX · THE STREAMER COMMAND HUB · Tous droits réservés</p>
        <p className="text-[11px] text-slate-500">
          Sauvegarde locale hors-ligne &amp; synchronisation cloud sécurisée · Compatible PC, Mac, Steam Deck, OBS Studio, Android &amp; iOS
        </p>
      </footer>
    </div>
  );
};
