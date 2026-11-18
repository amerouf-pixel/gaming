import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Sparkles,
  Radar,
  Cloud,
  Layers,
  Crown,
  Check,
  X,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { playUnlockFanfare, playCyberBlip } from '../utils/audioFx';

interface CommercialProModalProps {
  isOpen: boolean;
  onClose: () => void;
  isVip: boolean;
  onActivateVip: () => void;
}

export const CommercialProModal: React.FC<CommercialProModalProps> = ({
  isOpen,
  onClose,
  isVip,
  onActivateVip,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  if (!isOpen) return null;

  const handleActivate = () => {
    playUnlockFanfare();
    onActivateVip();
    setFeedbackMsg('ACCÈS VIP ÉLITE DÉVERROUILLÉ AVEC SUCCÈS ! LICENCE À VIE ENREGISTRÉE.');
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().length > 3) {
      handleActivate();
    } else {
      setFeedbackMsg('Veuillez entrer une clé de licence valide (ex: OPERATOR-VIP-2077)');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#160631] border-2 border-[#ff2a85]/70 shadow-[0_0_50px_rgba(255,42,133,0.3)] p-6 sm:p-8 overflow-hidden text-slate-100"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
        }}
      >
        {/* Top Decor Bar */}
        <div className="flex items-center justify-between border-b border-[#ff2a85]/30 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ff2a85]/15 border border-[#ff2a85]/50 flex items-center justify-center text-[#ff7b00]">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#00f0ff] font-bold">
                OFFRE DE LANCEMENT · ACCÈS À VIE
              </span>
              <h2 className="text-xl sm:text-2xl font-hud font-bold text-white tracking-wide">
                NEONOS PRO // FULL ACCESS
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status already VIP */}
        {isVip ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 mx-auto bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-hud font-bold text-amber-300">
              VOTRE LICENCE VIP EST DÉJÀ ACTIVE
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto font-mono-code">
              Vous bénéficiez du pack commercial complet, de la télémétrie illimitée, de tous les profils multivers et du radar 360°.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-hud font-bold text-sm uppercase transition-all cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.4)]"
            >
              Retourner au Tableau de Bord
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Value Proposition Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                <Radar className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-hud text-sm">Radar Sonar 360° Illimité</strong>
                  <span className="text-slate-400">
                    Détection instantanée de chaque collectible caché et contrat prioritaire.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#120428]/80 border border-[#ff2a85]/30 flex items-start gap-2.5">
                <Layers className="w-4 h-4 text-[#ff2a85] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-hud text-sm">Multi-Univers Sans Limite</strong>
                  <span className="text-slate-300">
                    Suivez Sunset Néon, vos mondes ouverts urbains, côtiers ou sci-fi dans une seule interface.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-hud text-sm">HUD Audio & Toasts Succès</strong>
                  <span className="text-slate-400">
                    Alertes sonores et graphiques lors du déblocage de chaque trophée platine.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 flex items-start gap-2.5">
                <Cloud className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-hud text-sm">Cloud Save & Export JSON</strong>
                  <span className="text-slate-400">
                    Vos 100% de complétion sauvegardés à vie sans jamais perdre une donnée.
                  </span>
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-gradient-to-r from-[#ff2a85]/20 via-[#120428] to-[#00f0ff]/15 border border-[#ff2a85]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-hud font-bold text-[#00f0ff] tabular-nums">7 €</span>
                  <span className="text-xs text-slate-400 line-through font-mono-code tabular-nums">29 €</span>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] text-white font-bold text-[10px] font-mono-code uppercase">
                    OFFRE DE LANCEMENT
                  </span>
                </div>
                <div className="text-xs text-[#ff7b00] font-mono-code mt-0.5">
                  7 € — Paiement unique / Accès à vie
                </div>
              </div>

              <button
                onClick={handleActivate}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] hover:brightness-110 text-white font-hud font-bold text-sm uppercase transition-all cursor-pointer shadow-[0_0_25px_rgba(255,42,133,0.5)] flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>DÉBLOQUER NEONOS FULL ACCESS</span>
              </button>
            </div>

            {/* Promo Code Alternative Form */}
            <form onSubmit={handleCodeSubmit} className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Entrez votre clé de licence (ou tapez VIP)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 px-3 py-2 text-xs font-mono-code text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono-code uppercase transition-colors cursor-pointer"
              >
                Valider la Clé
              </button>
            </form>

            {feedbackMsg && (
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono-code text-center">
                {feedbackMsg}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
