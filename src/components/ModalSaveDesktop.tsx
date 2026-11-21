import React from 'react';
import {
  Download,
  Cloud,
  X,
  HardDrive,
  ArrowRight,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { useLocale } from '../context/LocaleContext';
import { cyberAudio } from '../utils/cyberAudio';

interface ModalSaveDesktopProps {
  isOpen: boolean;
  onClose: () => void;
  onExportJson?: () => void;
  onOpenAccount?: () => void;
}

export const ModalSaveDesktop: React.FC<ModalSaveDesktopProps> = ({
  isOpen,
  onClose,
  onExportJson,
  onOpenAccount,
}) => {
  const { copy } = useLocale();
  const t = copy.backupGuide;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl bg-[#110e1c] border border-white/15 shadow-2xl p-6 md:p-8 relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/35 flex items-center justify-center text-[#00f0ff]">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold font-hud uppercase tracking-wider text-white">
                {t.title}
              </h2>
              <p className="text-xs text-[#00f0ff]/80 font-mono-code">{t.subtitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label={t.closeBtn}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="my-5 overflow-y-auto pr-1 space-y-4 text-sm font-sans flex-1">
          <div className="rounded-xl bg-[#00f0ff]/8 border border-[#00f0ff]/25 p-3.5 flex items-start gap-3 text-xs text-slate-200">
            <ShieldCheck className="w-5 h-5 text-[#00f0ff] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white uppercase tracking-wider font-hud">
                {t.noticeTitle}
              </span>
              <p className="text-slate-300 mt-1 leading-relaxed">{t.noticeDesc}</p>
            </div>
          </div>

          <div className="space-y-3">
            {t.steps.map((s) => (
              <div
                key={s.num}
                className="rounded-xl bg-black/35 border border-white/[0.08] hover:border-white/20 transition-colors p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-hud font-bold text-[#00f0ff] px-2 py-0.5 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/30">
                      {s.num}
                    </span>
                    <h3 className="font-bold text-white text-sm">{s.title}</h3>
                  </div>
                  <span className="text-[10px] font-mono-code text-slate-400 border border-white/10 rounded px-2 py-0.5 shrink-0">
                    {s.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pl-0.5">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-black/35 border border-white/[0.08] flex items-start gap-2.5 text-xs text-slate-400">
            <Info className="w-4 h-4 text-[#ff7b00] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-200">{t.noteTitle}</strong> {t.noteDesc}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {onExportJson && (
              <button
                type="button"
                onClick={() => {
                  cyberAudio.playChirp();
                  onExportJson();
                }}
                className="px-4 py-2 rounded-lg bg-[#00f0ff]/12 hover:bg-[#00f0ff]/22 border border-[#00f0ff]/45 text-[#00f0ff] font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.exportNowBtn}</span>
              </button>
            )}
            {onOpenAccount && (
              <button
                type="button"
                onClick={() => {
                  cyberAudio.playClick();
                  onClose();
                  onOpenAccount();
                }}
                className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-slate-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Cloud className="w-3.5 h-3.5 text-[#ff7b00]" />
                <span>{t.openCloudBtn}</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#ff2a85] via-[#ff5c4d] to-[#ff7b00] hover:brightness-110 text-white font-semibold text-xs uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5"
          >
            <span>{t.closeBtn}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
