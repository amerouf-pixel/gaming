import React, { useState } from 'react';
import { cyberAudio } from '../utils/cyberAudio';
import { CheckoutTerminal } from './CheckoutTerminal';
import {
  Zap,
  Shield,
  Gauge,
  Trophy,
  Check,
  Flame,
  ArrowRight,
  Cpu,
  Lock,
  Unlock,
  Radio,
  Crosshair,
  Volume2,
  VolumeX,
} from 'lucide-react';

// COLLER MON LIEN GUMROAD OU WHOP ICI
const DEFAULT_PAYMENT_URL = 'https://gumroad.com/l/neonos-full-access';

interface LandingPageProps {
  onEnterApp?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  // Interactive tuning slider state: 0 to 100%
  const [tuningLevel, setTuningLevel] = useState<number>(35);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(() => cyberAudio.getMuted());
  const [activeCheckout, setActiveCheckout] = useState<{
    planName: string;
    price: string;
    duration: string;
    redirectUrl?: string;
  } | null>(null);

  // Vehicle dynamic stats based on slider
  const baseSpeed = 58;
  const maxBonusSpeed = 42;
  const currentSpeed = Math.min(100, Math.round(baseSpeed + (maxBonusSpeed * tuningLevel) / 100));

  const baseArmor = 40;
  const maxBonusArmor = 55;
  const currentArmor = Math.min(100, Math.round(baseArmor + (maxBonusArmor * tuningLevel) / 100));

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

  const handlePlanSelect = (plan: string) => {
    cyberAudio.playChirp();
    if (plan === 'Street Runner') {
      if (onEnterApp) onEnterApp();
    } else if (plan === 'Coastal Pass') {
      setActiveCheckout({
        planName: 'PASS MENSUEL NEONOS',
        price: '4.99',
        duration: 'ACCÈS MENSUEL (30 JOURS)',
        redirectUrl: DEFAULT_PAYMENT_URL,
      });
    } else {
      setActiveCheckout({
        planName: 'NEONOS FULL ACCESS',
        price: '7.00',
        duration: 'PAIEMENT UNIQUE · ACCÈS À VIE',
        redirectUrl: DEFAULT_PAYMENT_URL,
      });
    }
  };

  const toggleSound = () => {
    const muted = cyberAudio.toggleMute();
    setIsAudioMuted(muted);
  };

  return (
    <div className="min-h-screen bg-[#120428] text-slate-100 flex flex-col font-sans selection:bg-[#ff2a85]/30 selection:text-[#00f0ff] relative overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. TOP COMMERCIAL NAV CONTRACT                                           */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#120428]/95 backdrop-blur-md border-b border-[#ff2a85]/30 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#ff2a85]/15 border border-[#ff2a85]/50 flex items-center justify-center text-[#00f0ff] shadow-[0_0_14px_rgba(255,42,133,0.35)]">
            <Crosshair className="w-5 h-5" />
          </div>
          <div>
            <span className="font-hud font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#00f0ff]">
              NEONOS
            </span>
            <span className="text-[10px] font-mono-code text-[#00f0ff] block -mt-0.5 tracking-widest uppercase">
              Second-Screen Tactical HUD
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            className="p-2 border border-[#ff2a85]/30 bg-[#1b0838] text-slate-300 hover:text-[#00f0ff] hover:border-[#00f0ff]/60 transition-colors cursor-pointer"
            title={isAudioMuted ? 'Activer le son tactique' : 'Couper le son'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#00f0ff]" />}
          </button>

          {onEnterApp && (
            <button
              onClick={() => {
                cyberAudio.playClick();
                onEnterApp();
              }}
              className="px-4 py-2 text-xs font-hud font-bold uppercase tracking-wider bg-[#1b0838] border border-[#00f0ff]/50 text-[#00f0ff] hover:bg-[#00f0ff]/15 hover:border-[#00f0ff] transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span>ACCÉDER À NEONOS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION "LIVE TUNING" (LE HOOK INTERACTIF)                        */}
      {/* ========================================================================= */}
      <section className="relative px-4 sm:px-8 lg:px-12 pt-10 pb-16 max-w-7xl mx-auto w-full">
        {/* Sunset Néon Ambient Atmosphere */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ff2a85]/18 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#ff7b00]/14 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-[#00f0ff]/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Aggressive Hook & Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono-code text-[#00f0ff] tracking-widest uppercase">
              <Radio className="w-3.5 h-3.5 text-[#ff2a85]" />
              <span>NEONOS · SECOND-SCREEN TACTICAL HUD · OFFRE DE LANCEMENT</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-hud font-bold text-white tracking-wide uppercase leading-[1.1]">
              Prenez le contrôle total de vos sessions.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#00f0ff]">
                Ne laissez plus aucun secret au hasard.
              </span>
            </h1>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-sans max-w-xl">
              Fini les allers-retours fastidieux sur les wikis et les cartes interactives lentes.
              NeonOS synchronise vos quêtes, vos collectibles cachés, votre garage côtier et vos
              succès avec un temps de réponse instantané et une cartographie radar 360°.
            </p>

            {/* Key benefits list */}
            <div className="space-y-2 pt-2 border-t border-[#ff2a85]/25 text-xs sm:text-sm font-mono-code text-slate-200">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#00f0ff] flex-shrink-0" />
                <span>Radar Lidar holographique 360° avec calcul de distance métrique</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#ff2a85] flex-shrink-0" />
                <span>Système de Trophées &amp; popups HUD instantanés avec synthèse audio</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#ff7b00] flex-shrink-0" />
                <span>100% Hors-Ligne &amp; Sauvegarde locale (Export JSON illimité)</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => {
                  cyberAudio.playTargetAcquired();
                  setActiveCheckout({
                    planName: 'NEONOS FULL ACCESS',
                    price: '7.00',
                    duration: 'PAIEMENT UNIQUE · ACCÈS À VIE',
                    redirectUrl: DEFAULT_PAYMENT_URL,
                  });
                }}
                className="px-6 py-3.5 bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#ff2a85] hover:brightness-110 text-white font-hud font-bold text-sm tracking-widest uppercase shadow-[0_0_25px_rgba(255,42,133,0.65)] transition-all cursor-pointer flex items-center justify-center gap-2 text-center whitespace-nowrap"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>ACCÈS À VIE — 7 €</span>
              </button>

              {onEnterApp && (
                <button
                  onClick={() => {
                    cyberAudio.playClick();
                    onEnterApp();
                  }}
                  className="px-5 py-3.5 bg-[#1b0838] hover:bg-[#260b4d] text-[#00f0ff] border border-[#00f0ff]/40 text-xs font-hud font-bold tracking-wider uppercase transition-colors cursor-pointer text-center whitespace-nowrap"
                >
                  TESTER LA DÉMO LIVE
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono-code text-slate-300 pt-1">
              <span className="text-[#ff7b00] font-bold">OFFRE DE LANCEMENT</span>
              <span>·</span>
              <span>7 € — Paiement unique / Accès à vie</span>
              <span>·</span>
              <span>★ 4.9/5 sur 2 400+ avis</span>
            </div>
          </div>

          {/* Right Column: Interactive "Live Tuning" Hook Card */}
          <div className="lg:col-span-6">
            <div
              className={`relative bg-[#160631] border-2 transition-all duration-300 p-5 sm:p-7 shadow-2xl ${
                isMaxTuning
                  ? 'border-[#00f0ff] shadow-[0_0_35px_rgba(0,240,255,0.5)]'
                  : 'border-[#ff2a85]/50 shadow-[0_0_25px_rgba(255,42,133,0.2)]'
              }`}
              style={{
                clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
              }}
            >
              {/* Corner tech accent */}
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00f0ff] pointer-events-none" />

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-[#ff2a85]/25 pb-3 mb-4">
                <div>
                  <span className="text-[10px] font-mono-code text-[#00f0ff] uppercase tracking-widest">
                    MODULE GARAGE SUNSET NÉON · TEST EN DIRECT
                  </span>
                  <h3 className="font-hud font-bold text-lg text-white mt-0.5">
                    SOLARIS APEX GT
                  </h3>
                </div>
                <span className="text-xs font-mono-code px-2 py-0.5 bg-[#ff2a85]/15 border border-[#ff2a85]/50 text-[#ff2a85] uppercase font-bold">
                  SPORT_CLASS
                </span>
              </div>

              {/* Dynamic Vehicle Telemetry Specs */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between items-center text-xs font-mono-code mb-1">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-[#00f0ff]" />
                      Vitesse Max (Overclocking)
                    </span>
                    <span className="text-[#00f0ff] font-bold text-sm tabular-nums">{currentSpeed} / 100</span>
                  </div>
                  <div className="h-2 w-full bg-[#0e0320] overflow-hidden border border-[#ff2a85]/25">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff2a85] to-[#00f0ff] transition-all duration-150 shadow-[0_0_10px_#00f0ff]"
                      style={{ width: `${currentSpeed}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-mono-code mb-1">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#ff7b00]" />
                      Châssis Carbone Renforcé
                    </span>
                    <span className="text-[#ff7b00] font-bold text-sm tabular-nums">{currentArmor} / 100</span>
                  </div>
                  <div className="h-2 w-full bg-[#0e0320] overflow-hidden border border-[#ff2a85]/25">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff7b00] to-[#ff2a85] transition-all duration-150 shadow-[0_0_10px_#ff7b00]"
                      style={{ width: `${currentArmor}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* The Interactive Slider */}
              <div className="bg-[#0e0320] p-4 border border-[#ff2a85]/30 space-y-2 mb-6">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="tuning-slider"
                    className="text-xs font-hud font-bold text-[#ff7b00] uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Cpu className="w-4 h-4 text-[#ff7b00]" />
                    <span>Installer la mise à niveau côtière</span>
                  </label>
                  <span className="text-xs font-mono-code text-white font-bold tabular-nums">
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
                  <span>Configuration série</span>
                  <span className="text-[#00f0ff]">Glissez vers 100% pour déverrouiller</span>
                  <span>Puissance maximale</span>
                </div>
              </div>

              {/* Trigger / Buy CTA based on slider state */}
              {isMaxTuning ? (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      cyberAudio.playTargetAcquired();
                      setActiveCheckout({
                        planName: 'NEONOS FULL ACCESS',
                        price: '7.00',
                        duration: 'PAIEMENT UNIQUE · ACCÈS À VIE',
                        redirectUrl: DEFAULT_PAYMENT_URL,
                      });
                    }}
                    className="w-full py-4 bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#00f0ff] hover:brightness-110 text-white font-hud font-bold text-base tracking-widest uppercase shadow-[0_0_30px_rgba(255,42,133,0.75)] flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Unlock className="w-5 h-5 fill-current" />
                    <span>DÉBLOQUER NEONOS FULL ACCESS (7 €)</span>
                  </button>
                  <p className="text-center text-[10px] font-mono-code text-[#00f0ff] uppercase tracking-widest">
                    OVERCLOCK RÉUSSI · OFFRE DE LANCEMENT DÉVERROUILLÉE
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-[#0e0320] border border-dashed border-[#ff2a85]/40 flex items-center justify-between text-xs font-mono-code text-slate-300">
                  <span className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#ff2a85]" />
                    Accès complet verrouillé à {tuningLevel}%
                  </span>
                  <span className="text-[#00f0ff]">Poussez la jauge à 100% →</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PREUVE SOCIALE (MARQUEE TERMINAL EN DIRECT)                            */}
      {/* ========================================================================= */}
      <div className="bg-[#0e0320] border-y border-[#ff2a85]/30 py-3 overflow-hidden select-none">
        <div className="flex whitespace-nowrap animate-marquee gap-8 text-xs font-mono-code text-[#00f0ff]/90">
          <span>NEONOS.LOG: Runner_01 vient d&apos;atteindre les 100% sur Baie du Littoral //</span>
          <span className="text-[#ff7b00] font-bold">1 402 joueurs synchronisés aujourd&apos;hui //</span>
          <span>Upload des coordonnées du phare terminé //</span>
          <span className="text-[#ff2a85]">Maya_C: &apos;Gain de 40 heures sur mon run 100%&apos; //</span>
          <span>Moteur local 0ms opérationnel //</span>
          <span className="text-[#00f0ff]">Succès Platine débloqué: &apos;Légende de la Baie du Littoral&apos; //</span>
          <span>Téléchargement PWA natif Android &amp; PC validé //</span>
          <span>Sauvegarde JSON locale active //</span>
          <span>NEONOS.LOG: Runner_01 vient d&apos;atteindre les 100% sur Baie du Littoral //</span>
          <span className="text-[#ff7b00] font-bold">1 402 joueurs synchronisés aujourd&apos;hui //</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. TARIFICATION (PRICING) — OFFRE DE LANCEMENT 7 €                        */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="text-xs font-mono-code text-[#ff2a85] uppercase tracking-widest font-bold">
            OFFRE DE LANCEMENT · INVESTISSEMENT UNIQUE
          </div>
          <h2 className="text-3xl sm:text-4xl font-hud font-bold text-white uppercase tracking-wide">
            CHOISISSEZ VOTRE ACCÈS NEONOS
          </h2>
          <p className="text-sm text-slate-300 font-sans">
            Aucun abonnement piège. Un paiement unique de 7 € pour débloquer votre Second-Screen Tactical HUD à vie.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Card 1: Découverte */}
          <div className="bg-[#160631] border border-[#ff2a85]/25 p-6 flex flex-col justify-between transition-all hover:border-[#ff2a85]/50">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono-code text-slate-400 uppercase tracking-widest">
                  NIVEAU 1 · DÉCOUVERTE
                </span>
                <h3 className="font-hud font-bold text-xl text-white mt-0.5">STREET RUNNER</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Pour tester l&apos;interface sur les premières missions côtières et découvrir NeonOS.
                </p>
              </div>

              <div className="pt-2">
                <span className="text-3xl font-bold font-mono-code text-white tabular-nums">0 €</span>
                <span className="text-xs font-mono-code text-slate-400 ml-2">Accès gratuit</span>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-slate-200 font-mono-code">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-slate-400" />
                  <span>Jusqu&apos;à 5 missions enregistrées</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-slate-400" />
                  <span>10 collectibles de base</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-slate-400" />
                  <span>Bloc-notes tactique standard</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 line-through">
                  <span>Radar Holo 360° limité</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 line-through">
                  <span>Toasts de succès complets</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handlePlanSelect('Street Runner')}
              className="mt-8 w-full py-2.5 bg-[#0e0320] hover:bg-[#260b4d] text-slate-200 border border-[#ff2a85]/30 font-hud text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              COMMENCER GRATUITEMENT
            </button>
          </div>

          {/* Card 2: Pass 30 jours */}
          <div className="bg-[#180736] border border-[#00f0ff]/40 p-6 flex flex-col justify-between transition-all hover:border-[#00f0ff]/75">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono-code text-[#00f0ff] uppercase tracking-widest">
                  NIVEAU 2 · MENSUEL
                </span>
                <h3 className="font-hud font-bold text-xl text-white mt-0.5">COASTAL PASS</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Accès flexible pour les joueurs qui terminent une campagne en 1 mois.
                </p>
              </div>

              <div className="pt-2">
                <span className="text-3xl font-bold font-mono-code text-[#00f0ff] tabular-nums">4,99 €</span>
                <span className="text-xs font-mono-code text-slate-300 ml-1">/ mois</span>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-slate-200 font-mono-code">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span>Missions illimitées &amp; filtres</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span>Tous les collectibles &amp; GPS</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span>Garage complet &amp; comparatifs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span>Alertes HUD Platine / Or</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span>Radar Holographique 360°</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handlePlanSelect('Coastal Pass')}
              className="mt-8 w-full py-2.5 bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 text-[#00f0ff] border border-[#00f0ff]/50 font-hud text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              SOUSCRIRE (4,99 €)
            </button>
          </div>

          {/* Card 3: NeonOS Full Access (7 € — Paiement unique / Accès à vie) */}
          <div
            className="relative bg-gradient-to-b from-[#230948] to-[#14042c] border-2 border-[#ff2a85] p-6 sm:p-7 flex flex-col justify-between shadow-[0_0_35px_rgba(255,42,133,0.35)] transition-all hover:shadow-[0_0_45px_rgba(255,42,133,0.55)]"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
            }}
          >
            {/* Top Launch Offer Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] text-white text-[10px] font-mono-code font-bold px-3 py-1 uppercase tracking-widest">
              OFFRE DE LANCEMENT
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono-code text-[#ff7b00] uppercase tracking-widest font-bold">
                  NIVEAU ÉLITE · LE CHOIX RECOMMANDÉ
                </span>
                <h3 className="font-hud font-bold text-2xl text-white mt-0.5">
                  NEONOS FULL ACCESS
                </h3>
                <p className="text-xs text-slate-200 mt-1">
                  Licence définitive pour tous vos mondes ouverts urbains et côtiers. Zéro récurrence.
                </p>
              </div>

              {/* Price comparison: 7 € — Paiement unique / Accès à vie */}
              <div className="pt-2 space-y-1">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-4xl font-bold font-mono-code text-[#00f0ff] tabular-nums">7 €</span>
                  <span className="text-sm font-mono-code text-slate-400 line-through tabular-nums">29 €</span>
                  <span className="text-xs font-mono-code text-[#ff7b00] uppercase font-bold">
                    (-76%)
                  </span>
                </div>
                <div className="text-xs font-mono-code font-semibold text-[#ff2a85]">
                  7 € — Paiement unique / Accès à vie
                </div>
              </div>

              {/* Urgency Indicator */}
              <div className="bg-[#0e0320] border border-[#ff2a85]/50 p-3 space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono-code uppercase font-bold">
                  <span className="text-[#ff7b00] flex items-center gap-1">
                    <Flame className="w-3 h-3 text-[#ff2a85]" />
                    Tarif lancement limité aux premiers joueurs
                  </span>
                  <span className="text-[#00f0ff]">88% VENDUES</span>
                </div>
                <div className="w-full bg-[#1b0838] h-2 overflow-hidden border border-[#ff2a85]/30">
                  <div className="h-full bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] w-[88%]" />
                </div>
              </div>

              {/* Full Features */}
              <div className="space-y-2.5 pt-2 text-xs text-slate-100 font-mono-code">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00f0ff] font-bold" />
                  <span className="font-semibold text-white">7 € — Paiement unique / Accès à vie</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#ff2a85]" />
                  <span>Tous les univers (Sunset Néon, Secteur Cyber, Monde Libre...)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#ff7b00]" />
                  <span>Radar Holo 360° &amp; Moteur Audio Tactique</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00f0ff]" />
                  <span>Sauvegardes locales &amp; Export JSON illimité</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#ff2a85]" />
                  <span>Mode Deck Streamer pour 2ème écran</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#ff7b00]" />
                  <span>Mises à jour majeures futures incluses</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handlePlanSelect('NeonOS Full Access')}
              className="mt-8 w-full py-4 bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#00f0ff] hover:brightness-110 text-white font-hud font-bold text-sm tracking-widest uppercase shadow-[0_0_25px_rgba(255,42,133,0.65)] transition-all cursor-pointer"
            >
              OBTENIR NEONOS À VIE (7 €)
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. NEONOS CHECKOUT TERMINAL MODAL                                         */}
      {/* ========================================================================= */}
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
              if (onEnterApp) onEnterApp();
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MINIMAL COMMERCIAL FOOTER                                             */}
      {/* ========================================================================= */}
      <footer className="border-t border-[#ff2a85]/25 bg-[#0e0320] py-8 px-4 sm:px-8 mt-auto text-center text-xs font-mono-code text-slate-400 space-y-2">
        <p>© 2026 10JITAL Production · NeonOS · Second-Screen Tactical HUD · Tous droits réservés</p>
        <p className="text-[11px] text-slate-500">
          Chiffrement local · Zéro collecte de données personnelles · Compatible PC, Mac, Steam Deck, Android &amp; iOS
        </p>
      </footer>
    </div>
  );
};
