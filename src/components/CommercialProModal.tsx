import React from 'react';
import {
  Radar,
  Cloud,
  Layers,
  Crown,
  X,
  ExternalLink,
  Video,
  ShieldCheck,
} from 'lucide-react';
import { cyberAudio } from '../utils/cyberAudio';
import { GUMROAD_PRODUCT_URL } from '../services/stripeConfig';

interface CommercialProModalProps {
  isOpen: boolean;
  onClose: () => void;
  isVerifiedPaid?: boolean;
}

export const CommercialProModal: React.FC<CommercialProModalProps> = ({
  isOpen,
  onClose,
  isVerifiedPaid = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className="relative w-full max-w-2xl bg-[#160631] border-2 border-[#ff2a85]/70 shadow-[0_0_50px_rgba(255,42,133,0.3)] p-6 sm:p-8 overflow-hidden text-slate-100"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
        }}
      >
        <div className="flex items-center justify-between border-b border-[#ff2a85]/30 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ff2a85]/15 border border-[#ff2a85]/50 flex items-center justify-center text-[#ff7b00]">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#00f0ff] font-bold">
                OFFRE DE LANCEMENT · GUMROAD OFFICIEL
              </span>
              <h2 className="text-xl sm:text-2xl font-hud font-bold text-white tracking-wide">
                JITALX FULL ACCESS
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              cyberAudio.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isVerifiedPaid ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 mx-auto bg-emerald-500/15 border-2 border-emerald-400 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-hud font-bold text-emerald-300">
              LICENCE VÉRIFIÉE ACTIVE SUR VOTRE COMPTE
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Votre statut est synchronisé avec votre compte Firestore.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#00f0ff] hover:bg-[#4ff6ff] text-[#120428] font-hud font-bold text-sm uppercase transition-all cursor-pointer"
            >
              Retourner au tableau de bord
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#120428]/80 border border-[#ff2a85]/30 flex items-start gap-2.5">
                <Radar className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-hud text-sm">Radar Tactique 360°</strong>
                  <span className="text-slate-300">
                    Vue synthétique de vos missions prioritaires et collectibles restants.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#120428]/80 border border-[#ff2a85]/30 flex items-start gap-2.5">
                <Layers className="w-4 h-4 text-[#ff2a85] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-hud text-sm">Profils Multi-Univers</strong>
                  <span className="text-slate-300">
                    Créez et personnalisez vos propres profils de jeu en plus des modèles de démo.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#120428]/80 border border-[#ff2a85]/30 flex items-start gap-2.5">
                <Video className="w-4 h-4 text-[#ff7b00] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-hud text-sm">Streamer Studio OBS</strong>
                  <span className="text-slate-300">
                    Overlays 16:9 et 9:16 avec fond transparent, Chroma Key et widgets temps réel.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#120428]/80 border border-[#ff2a85]/30 flex items-start gap-2.5">
                <Cloud className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-hud text-sm">Export JSON &amp; Snapshots Cloud</strong>
                  <span className="text-slate-300">
                    Sauvegarde locale JSON et snapshots Cloud manuels liés à votre compte Google.
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-[#ff2a85]/20 via-[#120428] to-[#00f0ff]/15 border border-[#ff2a85]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-hud font-bold text-[#00f0ff] tabular-nums">
                    7 €
                  </span>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] text-white font-bold text-[10px] font-mono-code uppercase">
                    OFFRE DE LANCEMENT
                  </span>
                </div>
                <div className="text-xs text-[#ff7b00] font-mono-code mt-0.5">
                  Paiement unique sur Gumroad · Sans abonnement
                </div>
              </div>

              <a
                href={GUMROAD_PRODUCT_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => cyberAudio.playChirp()}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] hover:brightness-110 text-white font-hud font-bold text-sm uppercase transition-all shadow-[0_0_25px_rgba(255,42,133,0.45)] flex items-center justify-center gap-2"
              >
                <span>Commander sur Gumroad</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <p className="text-[11px] text-slate-400 font-mono-code text-center">
              Paiement géré exclusivement par Gumroad · © 2026 10JITAL Production
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
