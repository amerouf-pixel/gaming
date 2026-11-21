import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useLocale } from '../../context/LocaleContext';
import { useToast } from '../../context/ToastContext';
import { ObjectiveTier } from '../../types';
import {
  Trophy,
  Award,
  CheckCircle2,
  Circle,
  Medal,
  Plus,
  Minus,
  Trash2,
  X,
} from 'lucide-react';

export const ObjectivesView: React.FC = () => {
  const {
    objectives,
    toggleObjective,
    stepObjectiveProgress,
    addObjective,
    deleteObjective,
    stats,
  } = useGame();
  const { locale, appCopy } = useLocale();
  const t = appCopy.objectives;
  const { triggerAchievement } = useToast();
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [showNewForm, setShowNewForm] = useState(false);

  // Add objective form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTier, setNewTier] = useState<ObjectiveTier>('gold');
  const [newCategory, setNewCategory] = useState('Progression');
  const [newMaxProgress, setNewMaxProgress] = useState('1');

  const handleCreateObjective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addObjective({
      title: newTitle.trim(),
      description: newDesc.trim() || 'Objectif personnalisé',
      tier: newTier,
      category: newCategory.trim() || 'Progression',
      progress: 0,
      maxProgress: Math.max(1, Number(newMaxProgress) || 1),
      completed: false,
    });
    setNewTitle('');
    setNewDesc('');
    setNewMaxProgress('1');
    setShowNewForm(false);
  };

  const filteredObjectives = objectives.filter((o) => {
    if (selectedTier !== 'all' && o.tier !== selectedTier) return false;
    return true;
  });

  const getTierIcon = (tier: ObjectiveTier) => {
    switch (tier) {
      case 'platinum':
        return <Award className="w-5 h-5 text-[#00f0ff]" />;
      case 'gold':
        return <Trophy className="w-5 h-5 text-amber-400" />;
      case 'silver':
        return <Medal className="w-5 h-5 text-slate-200" />;
      case 'bronze':
        return <Medal className="w-5 h-5 text-[#ff7b00]" />;
    }
  };

  const getTierLabel = (tier: ObjectiveTier) => {
    switch (tier) {
      case 'platinum':
        return t.tierPlatinum;
      case 'gold':
        return t.tierGold;
      case 'silver':
        return t.tierSilver;
      case 'bronze':
        return t.tierBronze;
    }
  };

  const pct = Math.round((stats.objectivesDone / (stats.objectivesTotal || 1)) * 100);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#ff7b00]" />
            <h1 className="text-2xl font-bold font-hud text-white uppercase">
              {appCopy.progression.tabObjectives}
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">{t.emptyDesc}</p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewForm((prev) => !prev)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] hover:brightness-110 text-white font-hud font-bold text-xs uppercase tracking-wider cursor-pointer whitespace-nowrap"
        >
          {showNewForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showNewForm ? appCopy.common.close : appCopy.progression.newObjective}</span>
        </button>
      </div>

      {/* Inline Add Objective Form */}
      {showNewForm && (
        <form onSubmit={handleCreateObjective} className="jitalx-panel p-4 space-y-3">
          <div className="text-xs font-hud font-bold uppercase text-[#00f0ff]">
            {appCopy.progression.newObjective}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder={`${appCopy.modalNew.fieldTitle} *`}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="jitalx-input px-3 py-2 text-xs"
            />
            <div className="grid grid-cols-3 gap-2">
              <select
                value={newTier}
                onChange={(e) => setNewTier(e.target.value as ObjectiveTier)}
                className="jitalx-input px-2 py-2 text-xs"
              >
                <option value="bronze">{t.tierBronze}</option>
                <option value="silver">{t.tierSilver}</option>
                <option value="gold">{t.tierGold}</option>
                <option value="platinum">{t.tierPlatinum}</option>
              </select>
              <input
                type="text"
                placeholder={appCopy.modalNew.fieldCategory}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="jitalx-input px-2 py-2 text-xs"
              />
              <input
                type="number"
                min={1}
                max={999}
                value={newMaxProgress}
                onChange={(e) => setNewMaxProgress(e.target.value)}
                title={appCopy.modalNew.fieldMaxProgress}
                className="jitalx-input px-2 py-2 text-xs"
              />
            </div>
          </div>
          <input
            type="text"
            placeholder={appCopy.modalNew.fieldDescription}
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="w-full jitalx-input px-3 py-2 text-xs"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-[#00f0ff] text-[#120428] font-hud font-bold text-xs uppercase cursor-pointer"
            >
              {appCopy.common.save}
            </button>
          </div>
        </form>
      )}

      {/* Progress banner, Filters & Toast Preview */}
      <div className="jitalx-panel p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono-code text-slate-400 uppercase">
              {t.unlockedBadge}
            </div>
            <div className="text-xl font-bold font-hud text-white tabular-nums">
              {stats.objectivesDone} / {stats.objectivesTotal} ({pct}%)
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: t.tierAll },
              { id: 'platinum', label: t.tierPlatinum },
              { id: 'gold', label: t.tierGold },
              { id: 'silver', label: t.tierSilver },
              { id: 'bronze', label: t.tierBronze },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setSelectedTier(chip.id)}
                className={`px-3 py-1.5 text-xs font-mono-code whitespace-nowrap cursor-pointer border ${
                  selectedTier === chip.id
                    ? 'bg-[#00f0ff]/15 text-[#00f0ff] border-[#00f0ff]/60'
                    : 'bg-[#0b021a] text-slate-400 hover:text-white border-white/10'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10 text-[11px] font-mono-code text-slate-400">
          <span>
            {locale === 'fr' ? 'Aperçu des notifications HUD :' : 'HUD achievement toast preview:'}
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                triggerAchievement(
                  locale === 'fr' ? 'Aperçu Trophée Platine' : 'Platinum Trophy Preview',
                  'platinum',
                  locale === 'fr'
                    ? 'Notification HUD de démonstration pour un trophée Platine.'
                    : 'Sample HUD notification for a Platinum achievement.'
                )
              }
              className="px-2 py-1 bg-[#0b021a] border border-[#00f0ff]/40 text-[#00f0ff] hover:bg-[#00f0ff]/15 cursor-pointer"
            >
              {locale === 'fr' ? 'Tester Platine' : 'Test Platinum'}
            </button>
            <button
              type="button"
              onClick={() =>
                triggerAchievement(
                  locale === 'fr' ? 'Aperçu Trophée Or' : 'Gold Trophy Preview',
                  'gold',
                  locale === 'fr'
                    ? 'Notification HUD de démonstration pour un trophée Or.'
                    : 'Sample HUD notification for a Gold achievement.'
                )
              }
              className="px-2 py-1 bg-[#0b021a] border border-amber-400/40 text-amber-300 hover:bg-amber-400/15 cursor-pointer"
            >
              {locale === 'fr' ? 'Tester Or' : 'Test Gold'}
            </button>
          </div>
        </div>
      </div>

      {/* Objectives list */}
      <div className="space-y-3">
        {filteredObjectives.length === 0 ? (
          <div className="p-8 text-center jitalx-panel text-slate-300 text-sm">
            {t.emptyTitle}
          </div>
        ) : (
          filteredObjectives.map((obj) => {
            const objPct = Math.round((obj.progress / (obj.maxProgress || 1)) * 100);
            return (
              <div
                key={obj.id}
                className={`jitalx-panel p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  obj.completed ? 'opacity-75 border-white/10' : 'hover:border-[#00f0ff]/45'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="mt-0.5 p-2 bg-[#0b021a] border border-white/10 shrink-0">
                    {getTierIcon(obj.tier)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] font-mono-code text-slate-400">
                      <span className="text-[#00f0ff] uppercase font-semibold">
                        {getTierLabel(obj.tier)}
                      </span>
                      <span>·</span>
                      <span>{obj.category}</span>
                    </div>
                    <h3
                      className={`font-hud font-bold text-base mt-0.5 ${
                        obj.completed ? 'line-through text-slate-400' : 'text-white'
                      }`}
                    >
                      {obj.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{obj.description}</p>

                    <div className="mt-2.5 max-w-sm">
                      <div className="h-1.5 w-full bg-[#090216] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#ff2a85] to-[#00f0ff] transition-all duration-300"
                          style={{ width: `${objPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {obj.maxProgress > 1 && (
                    <div className="flex items-center gap-1 bg-[#0b021a] border border-white/10 p-1">
                      <button
                        type="button"
                        onClick={() => stepObjectiveProgress(obj.id, -1)}
                        className="p-1 text-slate-300 hover:text-white cursor-pointer"
                        aria-label="Diminuer progression"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-xs font-mono-code text-white tabular-nums">
                        {obj.progress}/{obj.maxProgress}
                      </span>
                      <button
                        type="button"
                        onClick={() => stepObjectiveProgress(obj.id, 1)}
                        className="p-1 text-[#00f0ff] hover:text-white cursor-pointer"
                        aria-label="Augmenter progression"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleObjective(obj.id)}
                    className="p-1.5 cursor-pointer"
                    title={obj.completed ? 'Réinitialiser' : 'Marquer débloqué'}
                  >
                    {obj.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-500 hover:text-[#00f0ff]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteObjective(obj.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 cursor-pointer"
                    title="Supprimer cet objectif"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
