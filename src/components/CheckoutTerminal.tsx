import React from 'react';
import { cyberAudio } from '../utils/cyberAudio';
import { GUMROAD_PRODUCT_URL } from '../services/stripeConfig';
import { useLocale, LanguageSwitcher } from '../context/LocaleContext';
import { ArrowLeft, ShieldCheck, ExternalLink, Lock, Check, X, Info } from 'lucide-react';

interface CheckoutTerminalProps {
  planName?: string;
  price?: string;
  duration?: string;
  redirectUrl?: string;
  onClose?: () => void;
}

export const CheckoutTerminal: React.FC<CheckoutTerminalProps> = ({
  planName = 'JITALX FULL ACCESS',
  price = '7.00',
  duration,
  redirectUrl = GUMROAD_PRODUCT_URL,
  onClose,
}) => {
  const { locale, copy } = useLocale();
  const t = copy.checkout;
  const targetUrl = redirectUrl || GUMROAD_PRODUCT_URL;
  const resolvedDuration =
    duration ||
    (locale === 'fr' ? 'PAIEMENT UNIQUE · ACCÈS À VIE' : 'ONE-TIME PAYMENT · LIFETIME ACCESS');

  return (
    <div className="min-h-screen bg-[#0a0910] font-mono text-[#00f0ff] p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(circle at 25% 25%, rgba(255, 42, 133, 0.14) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(0, 240, 255, 0.1) 0%, transparent 50%),
            #0a0910
          `,
        }}
      />

      {onClose && (
        <button
          type="button"
          onClick={() => {
            cyberAudio.playClick();
            onClose();
          }}
          className="absolute top-4 left-4 md:top-6 md:left-6 z-40 px-3.5 py-1.5 rounded-lg bg-white/[0.05] border border-white/15 text-slate-200 hover:text-[#00f0ff] hover:border-[#00f0ff]/60 text-xs font-hud uppercase flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.backCta}</span>
        </button>
      )}

      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-40">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-4xl rounded-2xl overflow-hidden border border-white/15 bg-[#120e1e]/95 relative z-10 shadow-[0_0_40px_rgba(255,42,133,0.16)] flex flex-col md:flex-row mt-12 md:mt-0">
        {/* Left: Order Summary */}
        <div className="flex-1 border-b md:border-b-0 md:border-r border-white/10 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="text-xl tracking-wider text-white uppercase font-hud font-bold">
                  {t.summaryTitle}
                </h2>
                <p className="text-[11px] text-[#00f0ff]/85 mt-0.5 tracking-wider uppercase">
                  10JITALX · JITALX COMMAND HUB
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#ff7b00]">
                  {t.launchOffer}
                </span>
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="md:hidden text-slate-400 hover:text-white p-1 cursor-pointer"
                    aria-label="Close checkout"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <table className="w-full text-sm text-left">
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-3.5 text-slate-400">{t.productLabel}</td>
                  <td className="py-3.5 text-right text-white font-bold">{planName}</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3.5 text-slate-400">{t.accessLabel}</td>
                  <td className="py-3.5 text-right text-[#00f0ff]">{resolvedDuration}</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3.5 text-slate-400">{t.processorLabel}</td>
                  <td className="py-3.5 text-right text-slate-200">{t.processorValue}</td>
                </tr>
                <tr className="border-b border-[#ff2a85]/60">
                  <td className="py-5 text-slate-200 font-bold">{t.totalLabel}</td>
                  <td className="py-5 text-right text-2xl text-white font-bold tracking-wider tabular-nums">
                    {price} <span className="text-[#ff7b00] text-lg">€</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-xs text-slate-400 leading-relaxed pt-4 border-t border-white/10 font-sans">
            <p>{t.cardNotice}</p>
          </div>
        </div>

        {/* Right: Direct Gumroad Redirect */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between bg-[#0a0812]/80 space-y-6">
          <div className="space-y-5">
            <div className="flex justify-between items-center gap-2">
              <h2 className="text-lg tracking-wider text-white uppercase font-hud font-bold">
                {t.gumroadTitle}
              </h2>
              <span className="text-[11px] text-[#00f0ff] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00f0ff]" />
                {t.httpsVerified}
              </span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-200 font-sans">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
                <span>{t.bullets[0]}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#ff2a85] shrink-0 mt-0.5" />
                <span>{t.bullets[1]}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#ff7b00] shrink-0 mt-0.5" />
                <span>{t.bullets[2]}</span>
              </li>
            </ul>

            <div className="p-3.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-slate-300 font-sans flex items-start gap-2.5 leading-relaxed">
              <Info className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
              <span>{t.honestInfo}</span>
            </div>

            <div className="space-y-2.5 pt-2">
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => cyberAudio.playChirp()}
                className="w-full py-4 px-5 rounded-lg bg-gradient-to-r from-[#ff2a85] via-[#ff5c4d] to-[#ff7b00] hover:brightness-110 text-white font-hud font-bold text-sm tracking-wider uppercase shadow-[0_0_24px_rgba(255,42,133,0.4)] transition-all flex items-center justify-center gap-2.5 text-center"
              >
                <span>
                  {t.continueGumroad} ({price} €)
                </span>
                <ExternalLink className="w-4 h-4 shrink-0" />
              </a>

              <div className="text-[11px] text-center text-slate-400 break-all">
                {t.officialLink} <span className="text-[#00f0ff]">{targetUrl}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>10JITALX · 10JITAL Production · © 2026</span>
            <span className="text-[#00f0ff] flex items-center gap-1">
              <Lock className="w-3 h-3" />
              {t.externalBadge}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutTerminal;
