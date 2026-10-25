import React, { useState } from 'react';
import {
  Cpu,
  Zap,
  Trash2,
  PackageCheck,
  FolderKanban,
  ShieldCheck,
  Download,
  Copy,
  Check,
  X,
  Terminal,
  CalendarClock,
  BellOff,
  Activity,
  HardDrive,
  Lock,
  Rocket,
  ClipboardList,
  Sparkles,
} from 'lucide-react';
import { cyberAudio } from '../utils/cyberAudio';
import { generateWin11ProBatchScript } from '../utils/win11ProScriptGenerator';

interface ModalWin11AutomationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalWin11Automation: React.FC<ModalWin11AutomationProps> = ({ isOpen, onClose }) => {
  const [enableGamingTurbo, setEnableGamingTurbo] = useState(true);
  const [enableDeepClean, setEnableDeepClean] = useState(true);
  const [enableWingetUpdate, setEnableWingetUpdate] = useState(true);
  const [enableWin11ProTweaks, setEnableWin11ProTweaks] = useState(true);
  const [enableSortDownloads, setEnableSortDownloads] = useState(true);
  const [enableWeeklySchedule, setEnableWeeklySchedule] = useState(true);
  const [enableFocusAssist, setEnableFocusAssist] = useState(true);
  const [enableBackgroundApps, setEnableBackgroundApps] = useState(true);
  const [enableStorageSense, setEnableStorageSense] = useState(true);
  const [enablePrivacy, setEnablePrivacy] = useState(true);
  const [enableStartupManager, setEnableStartupManager] = useState(false);
  const [enableClipboardHistory, setEnableClipboardHistory] = useState(false);
  const [enableWindowSuggestions, setEnableWindowSuggestions] = useState(true);
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const handleDownloadBat = () => {
    cyberAudio.playChirp();
    const content = generateWin11ProBatchScript({
      enableGamingTurbo,
      enableDeepClean,
      enableWingetUpdate,
      enableWin11ProTweaks,
      enableSortDownloads,
      enableWeeklySchedule,
      enableFocusAssist,
      enableBackgroundApps,
      enableStorageSense,
      enablePrivacy,
      enableStartupManager,
      enableClipboardHistory,
      enableWindowSuggestions,
    });
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Win11Pro-Auto-Gaming-Optimizer.bat';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const quickPowerShellCmd = `powershell -NoProfile -ExecutionPolicy Bypass -File ".\\automation-win11-pro\\Win11Pro-Gaming-Optimizer.ps1"`;

  const copyCommand = () => {
    navigator.clipboard.writeText(quickPowerShellCmd);
    cyberAudio.playClick();
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const modules = [
    {
      id: 'gaming',
      title: 'Mode Gaming Turbo (Performances Ultimes)',
      desc: "Débloque le mode caché 'Performances Ultimes' de Windows 11 Pro, coupe les processus inutiles, désactive Game DVR et optimise le ping.",
      checked: enableGamingTurbo,
      onChange: () => setEnableGamingTurbo(!enableGamingTurbo),
      icon: Zap,
      badge: 'FPS + PING',
    },
    {
      id: 'clean',
      title: 'Nettoyage Profond & Cache Shaders GPU',
      desc: 'Supprime %TEMP%, Windows\\Temp, Prefetch, les caches DirectX / NVIDIA / AMD et vide la Corbeille.',
      checked: enableDeepClean,
      onChange: () => setEnableDeepClean(!enableDeepClean),
      icon: Trash2,
      badge: 'ESPACE DISQUE',
    },
    {
      id: 'tweaks',
      title: 'Optimisations Exclusives Windows 11 Pro',
      desc: 'Crée un point de restauration, calibre la souris en 1:1, accélère les menus (MenuShowDelay=0) et bloque la télémétrie.',
      checked: enableWin11ProTweaks,
      onChange: () => setEnableWin11ProTweaks(!enableWin11ProTweaks),
      icon: ShieldCheck,
      badge: 'WIN 11 PRO',
    },
    {
      id: 'downloads',
      title: 'Tri Automatique du Dossier Téléchargements',
      desc: 'Range automatiquement vos fichiers par dossiers : Images, Documents, Archives (.zip/.rar) et Programmes (.exe/.msi).',
      checked: enableSortDownloads,
      onChange: () => setEnableSortDownloads(!enableSortDownloads),
      icon: FolderKanban,
      badge: 'AUTO-TRI',
    },
    {
      id: 'winget',
      title: 'Mise à Jour Silencieuse des Logiciels (Winget)',
      desc: 'Met à jour tous les logiciels installés sur votre PC en 1 clic via le gestionnaire officiel Windows 11.',
      checked: enableWingetUpdate,
      onChange: () => setEnableWingetUpdate(!enableWingetUpdate),
      icon: PackageCheck,
      badge: 'MAJ 1-CLIC',
    },
    {
      id: 'schedule',
      title: 'Planification Hebdomadaire Automatique',
      desc: 'Crée une tâche dans le Planificateur Windows 11 Pro pour nettoyer et optimiser le PC automatiquement chaque dimanche.',
      checked: enableWeeklySchedule,
      onChange: () => setEnableWeeklySchedule(!enableWeeklySchedule),
      icon: CalendarClock,
      badge: '100% AUTO',
    },
    {
      id: 'focus',
      title: 'Focus Assist Gaming',
      desc: 'Désactive toutes les notifications Windows pendant vos sessions de jeu : aucun popup, aucune interruption.',
      checked: enableFocusAssist,
      onChange: () => setEnableFocusAssist(!enableFocusAssist),
      icon: BellOff,
      badge: 'ZEN GAMING',
    },
    {
      id: 'bgapps',
      title: 'Applications en Arrière-plan',
      desc: 'Empêche les applications Windows de tourner en arrière-plan et libère la RAM et le CPU pour vos jeux.',
      checked: enableBackgroundApps,
      onChange: () => setEnableBackgroundApps(!enableBackgroundApps),
      icon: Activity,
      badge: 'RAM LIBRE',
    },
    {
      id: 'storage',
      title: 'Stockage Sense Automatique',
      desc: "Configure l'analyse et le nettoyage automatique du disque par Windows 11 (fichiers temporaires, corbeille, téléchargements anciens).",
      checked: enableStorageSense,
      onChange: () => setEnableStorageSense(!enableStorageSense),
      icon: HardDrive,
      badge: 'DISQUE AUTO',
    },
    {
      id: 'privacy',
      title: 'Confidentialité Renforcée',
      desc: 'Bloque la télémétrie Windows, les identifiants de publicité et les suggestions personnalisées dans le menu Démarrer.',
      checked: enablePrivacy,
      onChange: () => setEnablePrivacy(!enablePrivacy),
      icon: Lock,
      badge: 'VIE PRIVEE',
    },
    {
      id: 'startup',
      title: 'Audit des Applications au Démarrage',
      desc: "Liste toutes les applications qui se lancent avec Windows pour identifier celles qui ralentissent votre démarrage.",
      checked: enableStartupManager,
      onChange: () => setEnableStartupManager(!enableStartupManager),
      icon: Rocket,
      badge: 'AUDIT',
    },
    {
      id: 'clipboard',
      title: 'Historique du Presse-papiers',
      desc: 'Vide et désactive la collecte de l’historique du presse-papiers Windows pour préserver la confidentialité et libérer de l’espace.',
      checked: enableClipboardHistory,
      onChange: () => setEnableClipboardHistory(!enableClipboardHistory),
      icon: ClipboardList,
      badge: 'PRIVE',
    },
    {
      id: 'suggestions',
      title: 'Suggestions Windows',
      desc: "Désactive les conseils, astuces, publicités et recommandations du menu Démarrer et de l'écran de verrouillage.",
      checked: enableWindowSuggestions,
      onChange: () => setEnableWindowSuggestions(!enableWindowSuggestions),
      icon: Sparkles,
      badge: 'ZERO PUB',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#0b101b] border border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.2)] p-6 md:p-8 relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold font-hud uppercase tracking-wider text-white">
                Automatisation Windows 11 Pro & Mode Gaming
              </h2>
              <p className="text-xs text-emerald-400/80 font-mono-code">
                GENERATEUR DE SCRIPT .BAT EN 1 CLIC (DROITS ADMIN AUTO)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto my-5 pr-1 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.id}
                  onClick={() => {
                    cyberAudio.playClick();
                    m.onChange();
                  }}
                  className={`p-3.5 border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    m.checked
                      ? 'bg-emerald-950/20 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.12)]'
                      : 'bg-slate-900/40 border-slate-800 opacity-60 hover:opacity-90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={m.checked}
                        onChange={() => {}}
                        className="accent-emerald-400 w-4 h-4 cursor-pointer"
                      />
                      <Icon className={`w-4 h-4 ${m.checked ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <h3 className="font-bold text-white text-xs sm:text-sm">{m.title}</h3>
                    </div>
                    <span className="text-[9px] font-mono-code text-emerald-300 bg-emerald-950/80 border border-emerald-700/50 px-1.5 py-0.5 shrink-0">
                      {m.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{m.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-black/60 border border-cyan-900/50 font-mono-code text-xs text-cyan-300 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{quickPowerShellCmd}</span>
            </div>
            <button
              onClick={copyCommand}
              className="px-2.5 py-1 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-700/60 text-cyan-300 text-[11px] shrink-0 flex items-center gap-1 cursor-pointer"
            >
              {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCmd ? 'Copié !' : 'Copier'}</span>
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400 font-mono-code">
            Double-cliquez sur le fichier téléchargé pour lancer l'optimisation.
          </span>
          <button
            onClick={handleDownloadBat}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-hud font-bold text-xs uppercase tracking-wider cursor-pointer border border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger le Script (.BAT) 1-Clic</span>
          </button>
        </div>
      </div>
    </div>
  );
};
