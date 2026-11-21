import React, { useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { ProgressTimelineChart } from '../charts/ProgressTimelineChart';
import { ModalSaveDesktop } from '../ModalSaveDesktop';
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
} from 'lucide-react';

interface StatsViewProps {
  onOpenAccount?: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({ onOpenAccount }) => {
  const {
    overallProgress,
    stats,
    missions,
    mapMarkers,
    activityLog,
    sessionSeconds,
    exportBackup,
    importBackup,
    resetAllData,
  } = useGame();

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

  const formatHours = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m ${seconds % 60}s`;
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
          text: 'Sauvegarde JSON importée et appliquée avec succès.',
        });
      } else {
        setImportFeedback({
          type: 'error',
          text: result.error || 'Fichier de sauvegarde JSON invalide.',
        });
      }
      setTimeout(() => setImportFeedback(null), 5000);
    };
    reader.onerror = () => {
      setImportFeedback({
        type: 'error',
        text: 'Impossible de lire le fichier sélectionné.',
      });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-[#00f0ff]" />
          <h1 className="text-2xl font-bold font-hud text-white uppercase">
            Statistiques &amp; Sauvegardes
          </h1>
        </div>
        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
          Métriques calculées en direct depuis vos données locales, export/import JSON et accès
          Cloud.
        </p>
      </div>

      {/* Global Real Progress Card */}
      <div className="jitalx-panel p-5 sm:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 flex items-center justify-center bg-[#0b021a] border-2 border-[#00f0ff]/60 shrink-0">
              <div className="text-center">
                <div className="text-3xl font-extrabold font-hud text-[#00f0ff] tabular-nums">
                  {overallProgress}%
                </div>
                <div className="text-[10px] font-mono-code uppercase text-slate-400">Global</div>
              </div>
            </div>

            <div>
              <div className="text-xs font-mono-code text-[#00f0ff] uppercase tracking-wider">
                Calcul réel sur votre profil actif
              </div>
              <h2 className="text-xl font-bold font-hud text-white mt-0.5 uppercase">
                {overallProgress === 100
                  ? 'Complétion 100 % atteinte'
                  : overallProgress >= 50
                  ? 'Avancement supérieur à 50 %'
                  : 'Progression en cours'}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code text-slate-400 mt-2 tabular-nums">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#ff7b00]" />
                  Session : {formatHours(sessionSeconds)}
                </span>
                <span>Étapes missions : {realTotals.stepsDone}/{realTotals.stepsTotal}</span>
                <span>Repères carte : {mapMarkers.length}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-3 jitalx-panel-deep">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">XP cumulée</div>
              <div className="text-lg font-bold font-mono-code text-[#00f0ff] tabular-nums">
                {realTotals.earnedXp.toLocaleString('fr-FR')} XP
              </div>
            </div>
            <div className="p-3 jitalx-panel-deep">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">Crédits gagnés</div>
              <div className="text-lg font-bold font-mono-code text-[#ff7b00] tabular-nums">
                {realTotals.earnedCredits.toLocaleString('fr-FR')} Cr
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t border-white/10">
          {[
            {
              label: 'Missions terminées',
              done: stats.missionsDone,
              total: stats.missionsTotal,
              barClass: 'bg-[#00f0ff]',
              textClass: 'text-[#00f0ff]',
            },
            {
              label: 'Collectibles découverts',
              done: stats.collectiblesDone,
              total: stats.collectiblesTotal,
              barClass: 'bg-amber-400',
              textClass: 'text-amber-300',
            },
            {
              label: 'Véhicules possédés',
              done: stats.vehiclesUnlocked,
              total: stats.vehiclesTotal,
              barClass: 'bg-emerald-400',
              textClass: 'text-emerald-300',
            },
            {
              label: 'Objectifs & Trophées',
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

      {/* Optional Simulated Projection Chart — Explicitly Labeled as Simulated */}
      <ProgressTimelineChart
        title="PROJECTION INDICATIVE (SIMULÉE)"
        subtitle={`Courbe indicative générée localement à partir de vos compteurs actuels (${activityLog.length} actions enregistrées) — il ne s'agit pas de télémétrie jeu en temps réel`}
        showFilters={true}
      />

      {/* Backup & Data Management */}
      <div className="jitalx-panel p-5 sm:p-6">
        <h3 className="font-hud font-bold text-lg text-white uppercase mb-1.5">
          Sauvegardes JSON, Guide Bureau &amp; Cloud
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Exportez vos données locales en JSON (incluant vos repères carte), restaurez un fichier
          vérifié, ou créez un instantané Cloud manuel via votre compte Firebase.
        </p>

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
            onClick={exportBackup}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0b021a] hover:bg-[#1e0940] border border-[#00f0ff]/45 text-xs font-mono-code text-[#00f0ff] cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exporter en JSON</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 bg-[#0b021a] hover:bg-[#1e0940] border border-emerald-500/45 text-xs font-mono-code text-emerald-300 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span>Importer un JSON</span>
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
              <span>Snapshots Cloud</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsDesktopGuideOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0b021a] hover:bg-[#1e0940] border border-white/15 text-xs font-mono-code text-slate-200 cursor-pointer transition-colors"
          >
            <HardDrive className="w-4 h-4 text-[#ff7b00]" />
            <span>Guide Bureau</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-800/60 text-xs font-mono-code text-rose-300 cursor-pointer transition-colors sm:ml-auto"
          >
            <RefreshCw className="w-4 h-4 text-rose-400" />
            <span>Réinitialiser</span>
          </button>
        </div>

        {showResetConfirm && (
          <div className="mt-4 p-4 bg-rose-950/40 border border-rose-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <div className="text-xs text-rose-200">
                Confirmer la réinitialisation des données locales aux valeurs de démonstration ?
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white cursor-pointer"
              >
                Confirmer
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 bg-slate-800 text-xs text-slate-300 cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      <ModalSaveDesktop
        isOpen={isDesktopGuideOpen}
        onClose={() => setIsDesktopGuideOpen(false)}
      />
    </div>
  );
};
