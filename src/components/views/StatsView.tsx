import React, { useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { useLocale } from '../../context/LocaleContext';
import { ProgressTimelineChart } from '../charts/ProgressTimelineChart';
import { ModalSaveDesktop } from '../ModalSaveDesktop';
import { formatDurationShort } from '../../utils/analytics';
import {
  BarChart3,
  Download,
  Upload,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  Cloud,
  Layers,
  Globe2,
} from 'lucide-react';

interface StatsViewProps {
  onOpenAccount?: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({ onOpenAccount }) => {
  const {
    activeProfile,
    selectProfileById,
    overallProgress,
    stats,
    missions,
    mapMarkers,
    sessionSeconds,
    totalTrackedSeconds,
    globalMultiGameStats,
    exportBackup,
    importBackup,
    resetAllData,
  } = useGame();
  const { locale, appCopy } = useLocale();
  const t = appCopy.stats;

  const [importFeedback, setImportFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isDesktopGuideOpen, setIsDesktopGuideOpen] = useState(false);

  const realTotals = useMemo(() => {
    const completedMissions = missions.filter((m) => m.status === 'completed');
    const earnedXp = completedMissions.reduce((acc, m) => acc + (m.rewardXp || 0), 0);
    const earnedCredits = completedMissions.reduce((acc, m) => acc + (m.rewardCredits || 0), 0);
    const stepsTotal = missions.reduce((acc, m) => acc + m.steps.length, 0);
    const stepsDone = missions.reduce(
      (acc, m) => acc + m.steps.filter((s) => s.completed).length,
      0
    );
    return { earnedXp, earnedCredits, stepsTotal, stepsDone };
  }, [missions]);

  const handleExport = (scope: 'active' | 'all') => {
    exportBackup(scope);
    setImportFeedback({ type: 'success', text: t.exportSuccess });
    setTimeout(() => setImportFeedback(null), 4000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = typeof event.target?.result === 'string' ? event.target.result : '';
      const result = importBackup(text);
      if (result.ok) {
        setImportFeedback({
          type: 'success',
          text: t.importSuccess,
        });
      } else {
        setImportFeedback({
          type: 'error',
          text: `${t.importErrorPrefix} ${result.error || ''}`.trim(),
        });
      }
      setTimeout(() => setImportFeedback(null), 6000);
    };
    reader.onerror = () => {
      setImportFeedback({
        type: 'error',
        text: `${t.importErrorPrefix} ${locale === 'fr' ? 'Impossible de lire le fichier.' : 'Unable to read file.'}`,
      });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const numberLocale = locale === 'fr' ? 'fr-FR' : 'en-US';

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-[#00f0ff]" />
          <h1 className="text-2xl font-bold font-hud text-white uppercase">{t.title}</h1>
        </div>
        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">{t.subtitle}</p>
      </div>

      {/* Active Game Real Progress Card */}
      <div className="jitalx-panel p-5 sm:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 flex items-center justify-center bg-[#0b021a] border-2 border-[#00f0ff]/60 shrink-0">
              <div className="text-center">
                <div className="text-3xl font-extrabold font-hud text-[#00f0ff] tabular-nums">
                  {overallProgress}%
                </div>
                <div className="text-[10px] font-mono-code uppercase text-slate-400">
                  {t.scopeActiveGame}
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-mono-code text-[#00f0ff] uppercase tracking-wider">
                {activeProfile.name} · {activeProfile.universe}
              </div>
              <h2 className="text-xl font-bold font-hud text-white mt-0.5 uppercase">
                {overallProgress === 100
                  ? locale === 'fr'
                    ? 'Complétion 100 % atteinte'
                    : '100% Completion Reached'
                  : overallProgress >= 50
                  ? locale === 'fr'
                    ? 'Avancement supérieur à 50 %'
                    : 'Over 50% Completed'
                  : locale === 'fr'
                  ? 'Progression en cours'
                  : 'Campaign In Progress'}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code text-slate-400 mt-2 tabular-nums">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#ff7b00]" />
                  {t.timeTracked}: {formatDurationShort(totalTrackedSeconds, locale)} (
                  {locale === 'fr' ? 'session' : 'session'}:{' '}
                  {formatDurationShort(sessionSeconds, locale)})
                </span>
                <span>
                  {appCopy.home.stepLabel}: {realTotals.stepsDone}/{realTotals.stepsTotal}
                </span>
                <span>
                  {locale === 'fr' ? 'Repères carte' : 'Map pins'}: {mapMarkers.length}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-3 jitalx-panel-deep">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">{t.colXp}</div>
              <div className="text-lg font-bold font-mono-code text-[#00f0ff] tabular-nums">
                {realTotals.earnedXp.toLocaleString(numberLocale)} XP
              </div>
            </div>
            <div className="p-3 jitalx-panel-deep">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">
                {locale === 'fr' ? 'Crédits' : 'Credits'}
              </div>
              <div className="text-lg font-bold font-mono-code text-[#ff7b00] tabular-nums">
                {realTotals.earnedCredits.toLocaleString(numberLocale)} Cr
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t border-white/10">
          {[
            {
              label: appCopy.home.statMissions,
              done: stats.missionsDone,
              total: stats.missionsTotal,
              barClass: 'bg-[#00f0ff]',
              textClass: 'text-[#00f0ff]',
            },
            {
              label: appCopy.home.statCollectibles,
              done: stats.collectiblesDone,
              total: stats.collectiblesTotal,
              barClass: 'bg-amber-400',
              textClass: 'text-amber-300',
            },
            {
              label: appCopy.home.statGarage,
              done: stats.vehiclesUnlocked,
              total: stats.vehiclesTotal,
              barClass: 'bg-emerald-400',
              textClass: 'text-emerald-300',
            },
            {
              label: appCopy.home.statObjectives,
              done: stats.objectivesDone,
              total: stats.objectivesTotal,
              barClass: 'bg-[#ff2a85]',
              textClass: 'text-[#ff2a85]',
            },
          ].map((row) => {
            const pct = Math.round((row.done / (row.total || 1)) * 100);
            return (
              <div key={row.label} className="p-3.5 jitalx-panel-deep">
                <div className="flex justify-between text-xs font-hud mb-1.5">
                  <span className="text-slate-200">{row.label}</span>
                  <span className={`${row.textClass} font-mono-code font-bold tabular-nums`}>
                    {row.done} / {row.total} ({pct}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-[#090216] overflow-hidden">
                  <div className={`h-full ${row.barClass}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 100% REAL Persisted Analytics Chart */}
      <ProgressTimelineChart showFilters={true} />

      {/* Multi-Game Overview Matrix */}
      <div className="jitalx-panel p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-[#ff2a85]" />
              <h3 className="font-hud font-bold text-lg text-white uppercase">
                {t.multiGameMatrixTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{t.multiGameMatrixSubtitle}</p>
          </div>
          <div className="text-xs font-mono-code text-[#00f0ff] tabular-nums">
            {t.scopeAllGames}: {globalMultiGameStats.overallProgress}% ·{' '}
            {formatDurationShort(globalMultiGameStats.totalTrackedSeconds, locale)}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono-code">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 pr-3">{t.colGame}</th>
                <th className="py-2.5 px-2">{t.colProgress}</th>
                <th className="py-2.5 px-2">{t.colMissions}</th>
                <th className="py-2.5 px-2">{t.colCollectibles}</th>
                <th className="py-2.5 px-2">{t.colGarage}</th>
                <th className="py-2.5 px-2">{t.colXp}</th>
                <th className="py-2.5 pl-2 text-right">{t.colTime}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {globalMultiGameStats.perProfile.map((row) => {
                const isCurrent = row.profileId === activeProfile.id;
                return (
                  <tr
                    key={row.profileId}
                    onClick={() => selectProfileById(row.profileId)}
                    className={`cursor-pointer transition-colors ${
                      isCurrent ? 'bg-[#00f0ff]/10 text-white' : 'hover:bg-white/5 text-slate-300'
                    }`}
                  >
                    <td className="py-2.5 pr-3">
                      <div className="font-hud font-bold text-white flex items-center gap-2">
                        <span>{row.profileName}</span>
                        {isCurrent && (
                          <span className="text-[9px] font-mono-code px-1.5 py-0.5 bg-[#00f0ff]/20 text-[#00f0ff] uppercase">
                            {appCopy.common.active}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">{row.universe}</div>
                    </td>
                    <td className="py-2.5 px-2 tabular-nums font-bold text-[#00f0ff]">
                      {row.overallProgress}%
                    </td>
                    <td className="py-2.5 px-2 tabular-nums">
                      {row.missionsDone}/{row.missionsTotal}
                    </td>
                    <td className="py-2.5 px-2 tabular-nums">
                      {row.collectiblesDone}/{row.collectiblesTotal}
                    </td>
                    <td className="py-2.5 px-2 tabular-nums">
                      {row.vehiclesUnlocked}/{row.vehiclesTotal}
                    </td>
                    <td className="py-2.5 px-2 tabular-nums text-[#ff7b00]">
                      {row.earnedXp.toLocaleString(numberLocale)}
                    </td>
                    <td className="py-2.5 pl-2 text-right tabular-nums">
                      {formatDurationShort(row.totalTrackedSeconds, locale)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Backup & Data Management */}
      <div className="jitalx-panel p-5 sm:p-6">
        <h3 className="font-hud font-bold text-lg text-white uppercase mb-1.5">
          {locale === 'fr' ? 'Sauvegardes JSON & Snapshots Cloud' : 'JSON Backups & Cloud Snapshots'}
        </h3>
        <p className="text-xs text-slate-400 mb-5">{appCopy.common.multiGameNote}</p>

        {importFeedback && (
          <div
            className={`p-3 mb-4 border text-xs font-mono-code flex items-center gap-2 ${
              importFeedback.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
            }`}
          >
            {importFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{importFeedback.text}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleExport('active')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0b021a] hover:bg-[#1e0940] border border-[#00f0ff]/45 text-xs font-mono-code text-[#00f0ff] cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportActiveBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => handleExport('all')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0b021a] hover:bg-[#1e0940] border border-[#ff7b00]/45 text-xs font-mono-code text-[#ff7b00] cursor-pointer transition-colors"
          >
            <Layers className="w-4 h-4" />
            <span>{t.exportAllGamesBtn}</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 bg-[#0b021a] hover:bg-[#1e0940] border border-emerald-500/45 text-xs font-mono-code text-emerald-300 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span>{t.importJsonBtn}</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {onOpenAccount && (
            <button
              type="button"
              onClick={onOpenAccount}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1b0838] hover:bg-[#2a0c54] border border-[#ff2a85]/50 text-xs font-mono-code text-white cursor-pointer transition-colors"
            >
              <Cloud className="w-4 h-4 text-[#00f0ff]" />
              <span>{t.cloudAccountBtn}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsDesktopGuideOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0b021a] hover:bg-[#1e0940] border border-white/15 text-xs font-mono-code text-slate-200 cursor-pointer transition-colors"
          >
            <HardDrive className="w-4 h-4 text-[#ff7b00]" />
            <span>{t.backupGuideBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-800/60 text-xs font-mono-code text-rose-300 cursor-pointer transition-colors sm:ml-auto"
          >
            <RefreshCw className="w-4 h-4 text-rose-400" />
            <span>{t.resetUniverseBtn}</span>
          </button>
        </div>

        {showResetConfirm && (
          <div className="mt-4 p-4 bg-rose-950/40 border border-rose-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <div className="text-xs text-rose-200">{t.resetConfirmPrompt}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                  setImportFeedback({ type: 'success', text: t.resetDone });
                  setTimeout(() => setImportFeedback(null), 4000);
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white cursor-pointer"
              >
                {t.confirmResetBtn}
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 bg-slate-800 text-xs text-slate-300 cursor-pointer"
              >
                {appCopy.common.cancel}
              </button>
            </div>
          </div>
        )}
      </div>

      <ModalSaveDesktop
        isOpen={isDesktopGuideOpen}
        onClose={() => setIsDesktopGuideOpen(false)}
        onExportJson={() => handleExport('all')}
        onOpenAccount={onOpenAccount}
      />
    </div>
  );
};
