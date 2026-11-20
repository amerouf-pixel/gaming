import React, { useState, useEffect } from 'react';
import { cyberAudio } from '../utils/cyberAudio';
import { ArrowLeft, Shield, CheckCircle2, Lock, Sparkles, X } from 'lucide-react';

// COLLER MON LIEN GUMROAD OU WHOP ICI
const DEFAULT_REDIRECT_URL = 'https://gumroad.com/l/jitalx-full-access';

interface CheckoutTerminalProps {
  planName?: string;
  price?: string;
  duration?: string;
  redirectUrl?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export const CheckoutTerminal: React.FC<CheckoutTerminalProps> = ({
  planName = 'JITALX FULL ACCESS',
  price = '7.00',
  duration = 'PAIEMENT UNIQUE · ACCÈS À VIE',
  redirectUrl = DEFAULT_REDIRECT_URL,
  onSuccess,
  onClose,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('INITIALISER LE PAIEMENT SÉCURISÉ');
  const [progress, setProgress] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Simulation de la séquence de paiement
  useEffect(() => {
    if (isProcessing) {
      setGlitchActive(true);
      cyberAudio.playTargetAcquired();

      const sequence = [
        { time: 0, text: "Établissement d'une connexion sécurisée...", progress: 15 },
        { time: 1400, text: 'Cryptage des données (AES-256)...', progress: 45 },
        { time: 2800, text: 'Liaison au serveur JITALX en cours...', progress: 65 },
        { time: 4200, text: `Autorisation du paiement (${price} €)...`, progress: 85 },
        { time: 5600, text: 'TRANSFERT APPROUVÉ - ACCÈS DÉVERROUILLÉ', progress: 100 },
      ];

      const timers = sequence.map((step) =>
        setTimeout(() => {
          setStatusText(step.text);
          setProgress(step.progress);

          if (step.progress === 100) {
            setGlitchActive(false);
            cyberAudio.playFanfare();
            setStatusText('REDIRECTION VERS LA PASSERELLE SÉCURISÉE...');

            setTimeout(() => {
              try {
                window.location.href = redirectUrl || DEFAULT_REDIRECT_URL;
              } catch (e) {
                console.error('Redirection error:', e);
              }
            }, 1500); // Laisse le temps au joueur de lire le message avant de quitter la page
          } else {
            cyberAudio.playClick();
          }
        }, step.time)
      );

      return () => timers.forEach(clearTimeout);
    }
  }, [isProcessing, redirectUrl, price]);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isProcessing) {
      setIsProcessing(true);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.substring(0, 16);
    const parts = val.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : val);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.substring(0, 4);
    if (val.length >= 3) {
      setCardExpiry(`${val.substring(0, 2)}/${val.substring(2)}`);
    } else {
      setCardExpiry(val);
    }
  };

  return (
    <>
      {/* Styles inline pour les effets spécifiques JITALX */}
      <style>
        {`
          @keyframes glitch-anim {
            0% { transform: translate(0) }
            20% { transform: translate(-2px, 1px) }
            40% { transform: translate(-1px, -1px) }
            60% { transform: translate(2px, 1px) }
            80% { transform: translate(1px, -1px) }
            100% { transform: translate(0) }
          }
          .animate-glitch {
            animation: glitch-anim 0.3s infinite;
          }
          .scanlines {
            background: linear-gradient(
              to bottom,
              rgba(255,255,255,0),
              rgba(255,255,255,0) 50%,
              rgba(0,0,0,0.2) 50%,
              rgba(0,0,0,0.2)
            );
            background-size: 100% 4px;
          }
        `}
      </style>

      <div className="min-h-screen bg-[#120428] font-mono text-[#00f0ff] p-4 md:p-8 flex items-center justify-center relative overflow-hidden select-none">
        {/* Overlay Scanline conditionnel */}
        <div
          className={`absolute inset-0 pointer-events-none z-50 transition-opacity duration-300 ${
            glitchActive ? 'opacity-100 scanlines' : 'opacity-0'
          }`}
        />

        {/* Effet radial Sunset Néon en fond */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: `
              radial-gradient(circle at 25% 25%, rgba(255, 42, 133, 0.16) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(0, 240, 255, 0.12) 0%, transparent 50%),
              #120428
            `,
          }}
        />

        {/* Floating Top Controls (Retour / Annuler) */}
        {onClose && (
          <button
            onClick={() => {
              cyberAudio.playClick();
              onClose();
            }}
            className="absolute top-4 left-4 md:top-6 md:left-6 z-40 px-3 py-1.5 bg-[#1b0838]/95 border border-[#ff2a85]/40 text-slate-200 hover:text-[#00f0ff] hover:border-[#00f0ff]/60 text-xs font-hud uppercase flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETOUR</span>
          </button>
        )}

        <div
          className={`w-full max-w-5xl border border-[#ff2a85]/60 bg-[#160631]/95 relative z-10 shadow-[0_0_35px_rgba(255,42,133,0.2)] flex flex-col md:flex-row transition-all duration-300 ${
            glitchActive
              ? 'animate-glitch border-[#ff7b00] shadow-[0_0_30px_rgba(255,123,0,0.35)] text-[#ff7b00]'
              : ''
          }`}
        >
          {/* Panneau de gauche : RÉSUMÉ DE COMMANDE */}
          <div className="flex-1 border-b md:border-b-0 md:border-r border-[#ff2a85]/30 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-2.5 h-2.5 ${
                        glitchActive ? 'bg-[#ff7b00]' : 'bg-[#ff2a85]'
                      }`}
                    />
                    <h2 className="text-xl tracking-widest text-white uppercase font-bold">
                      Terminal JITALX
                    </h2>
                  </div>
                  <p className="text-[11px] text-[#00f0ff]/80 mt-0.5 tracking-wider uppercase">
                    THE STREAMER COMMAND HUB
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] text-white">
                    OFFRE DE LANCEMENT
                  </span>
                  {onClose && (
                    <button
                      onClick={onClose}
                      className="md:hidden text-slate-400 hover:text-white p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <table className="w-full text-sm text-left">
                  <tbody>
                    <tr className="border-b border-[#ff2a85]/20">
                      <td className="py-4 text-slate-300">LICENCE</td>
                      <td className="py-4 text-right text-white font-bold">{planName}</td>
                    </tr>
                    <tr className="border-b border-[#ff2a85]/20">
                      <td className="py-4 text-slate-300">DURÉE</td>
                      <td className="py-4 text-right text-[#00f0ff]">{duration}</td>
                    </tr>
                    <tr className="border-b border-[#ff2a85]/20">
                      <td className="py-4 text-slate-300">MODULES INCLUS</td>
                      <td className="py-4 text-right text-xs leading-relaxed">
                        <span className="text-[#00f0ff]">[SUNSET_NEON_THEME]</span>
                        <br />
                        <span className="text-[#ff2a85]">[RADAR_HOLO_360]</span>
                        <br />
                        <span className="text-[#ff7b00]">[TROPHY_TRACKER]</span>
                        <br />
                        <span className="text-[#00f0ff]">[LOCAL_VAULT_JSON]</span>
                      </td>
                    </tr>
                    <tr className="border-b-2 border-[#ff2a85]">
                      <td className="py-6 text-slate-200 font-bold">MONTANT TOTAL</td>
                      <td className="py-6 text-right text-2xl text-white font-bold tracking-wider tabular-nums">
                        {price} <span className="text-[#ff7b00] text-lg">€</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 text-xs text-slate-400 leading-relaxed pt-4 border-t border-[#ff2a85]/20">
              <p>
                &gt; JITALX SENTINEL : Connexion chiffrée de bout en bout. Paiement unique sans aucun renouvellement automatique.
              </p>
              <p className="mt-1 text-slate-500">&gt; HASH DE SÉCURITÉ: 0x8F9A...4B2C</p>
            </div>
          </div>

          {/* Panneau de droite : LIAISON BANCAIRE */}
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative bg-[#0e0320]/65">
            <div>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl tracking-widest text-white uppercase font-bold">
                  Uplink Paiement
                </h2>
                <span className="text-xs text-[#00f0ff] border border-[#00f0ff]/40 px-2 py-1 bg-[#1b0838] font-mono-code flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-[#00f0ff]" />
                  SECURE 256-BIT
                </span>
              </div>

              {/* Quick Auto-Fill Demo Chip for easy evaluation */}
              {!isProcessing && progress < 100 && (
                <div className="mb-5 p-2.5 bg-[#1b0838]/90 border border-[#ff2a85]/35 flex items-center justify-between gap-2 text-xs">
                  <span className="text-slate-300 text-[11px]">Mode démonstration rapide :</span>
                  <button
                    type="button"
                    onClick={() => {
                      cyberAudio.playChirp();
                      setCardNumber('4532 8910 2345 6789');
                      setCardExpiry('12/28');
                      setCardCvc('777');
                    }}
                    className="px-2 py-1 bg-[#ff2a85]/20 hover:bg-[#ff2a85]/35 text-[#00f0ff] border border-[#ff2a85]/60 text-[10px] font-mono uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    [REMPLIR TEST VIP]
                  </button>
                </div>
              )}

              <form onSubmit={handleCheckout} className="space-y-6">
                {/* Numéro de carte */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-300 uppercase tracking-wider block">
                    Numéro de carte
                  </label>
                  <input
                    type="text"
                    disabled={isProcessing}
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4532 8910 2345 6789"
                    maxLength={19}
                    className="w-full bg-[#120428] border border-[#ff2a85]/40 p-3 text-[#00f0ff] font-mono text-base md:text-lg rounded-none focus:outline-none focus:border-[#00f0ff] focus:bg-[#1b0838] focus:shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all placeholder:text-slate-600 disabled:opacity-50"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  {/* Expiration */}
                  <div className="space-y-2">
                    <label className="text-xs text-slate-300 uppercase tracking-wider block">
                      Expiration (MM/AA)
                    </label>
                    <input
                      type="text"
                      disabled={isProcessing}
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="12/28"
                      maxLength={5}
                      className="w-full bg-[#120428] border border-[#ff2a85]/40 p-3 text-[#00f0ff] font-mono text-base md:text-lg rounded-none focus:outline-none focus:border-[#00f0ff] focus:bg-[#1b0838] focus:shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all placeholder:text-slate-600 disabled:opacity-50"
                      required
                    />
                  </div>

                  {/* CVC */}
                  <div className="space-y-2">
                    <label className="text-xs text-slate-300 uppercase tracking-wider block">
                      Code Auth (CVC)
                    </label>
                    <input
                      type="password"
                      disabled={isProcessing}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.substring(0, 4))}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full bg-[#120428] border border-[#ff2a85]/40 p-3 text-[#00f0ff] font-mono text-base md:text-lg rounded-none focus:outline-none focus:border-[#ff7b00] focus:bg-[#1b0838] focus:shadow-[0_0_12px_rgba(255,123,0,0.3)] transition-all placeholder:text-slate-600 disabled:opacity-50"
                      required
                    />
                  </div>
                </div>

                {/* Bouton de soumission massif */}
                <div className="pt-6">
                  {progress === 100 ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-emerald-950/50 border border-emerald-500/80 text-emerald-300 text-xs font-mono flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <span>PAIEMENT APPROUVÉ · LICENCE JITALX FULL ACCESS ACTIVE</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          try {
                            localStorage.setItem('cyber_license', planName);
                          } catch {
                            // ignore localStorage error
                          }
                          cyberAudio.playFanfare();
                          if (onSuccess) onSuccess();
                        }}
                        className="w-full py-4 bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#00f0ff] hover:brightness-110 text-white font-hud font-bold text-sm tracking-widest uppercase shadow-[0_0_25px_rgba(255,42,133,0.6)] cursor-pointer transition-all flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>OUVRIR JITALX TERMINAL PRINCIPAL</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className={`w-full relative overflow-hidden group border rounded-none p-4 transition-all duration-300 cursor-pointer ${
                        glitchActive
                          ? 'border-[#ff7b00] bg-[#ff7b00]/20 text-[#ff7b00] shadow-[0_0_20px_rgba(255,123,0,0.5)]'
                          : 'border-[#ff2a85] bg-gradient-to-r from-[#ff2a85]/20 to-[#ff7b00]/20 hover:from-[#ff2a85]/35 hover:to-[#ff7b00]/35 hover:shadow-[0_0_22px_rgba(255,42,133,0.55)] text-white'
                      }`}
                    >
                      {/* Barre de progression interne au bouton */}
                      {isProcessing && (
                        <div
                          className={`absolute inset-y-0 left-0 transition-all duration-300 ease-out z-0 ${
                            glitchActive ? 'bg-[#ff7b00]/30' : 'bg-[#00f0ff]/30'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      )}

                      {/* Texte du bouton */}
                      <span className="relative z-10 font-bold tracking-widest text-xs md:text-sm flex items-center justify-center gap-3 uppercase">
                        {isProcessing && progress < 100 && (
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        )}
                        {statusText}
                      </span>
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="pt-4 border-t border-[#ff2a85]/20 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono-code">
              <span>JITALX SECURE GATEWAY</span>
              <span className="text-slate-400/90">Propulsé par 10JITAL Production · © 2026</span>
              <span className="text-[#00f0ff] flex items-center gap-1">
                <Lock className="w-3 h-3" />
                LIAISON CRYPTÉE
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutTerminal;
