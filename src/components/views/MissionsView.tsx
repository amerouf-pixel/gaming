import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Mission, MissionType, MissionStatus } from '../../types';
import {
  Compass,
  CheckCircle2,
  Circle,
  Clock,
  Search,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Pencil,
  Check,
  X,
} from 'lucide-react';

interface MissionsViewProps {
  onOpenNewItemModal: () => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({ onOpenNewItemModal }) => {
  const {
    missions,
    toggleMissionStatus,
    toggleMissionStep,
    updateMission,
    addMissionStep,
    removeMissionStep,
    deleteMission,
  } = useGame();

  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMissionId, setExpandedMissionId] = useState<string | null>(null);
  const [newStepInputs, setNewStepInputs] = useState<Record<string, string>>({});

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState<MissionType>('main');
  const [editDistrict, setEditDistrict] = useState('');
  const [editGiver, setEditGiver] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editXp, setEditXp] = useState('0');
  const [editCredits, setEditCredits] = useState('0');

  const startEditing = (mission: Mission) => {
    setEditingId(mission.id);
    setEditTitle(mission.title);
    setEditType(mission.type);
    setEditDistrict(mission.district);
    setEditGiver(mission.giver);
    setEditDesc(mission.description);
    setEditXp(String(mission.rewardXp));
    setEditCredits(String(mission.rewardCredits));
    setExpandedMissionId(mission.id);
  };

  const saveEdit = (e: React.FormEvent, missionId: string) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    updateMission(missionId, {
      title: editTitle.trim(),
      type: editType,
      district: editDistrict.trim() || 'Secteur libre',
      giver: editGiver.trim() || 'Inconnu',
      description: editDesc.trim(),
      rewardXp: Math.max(0, Number(editXp) || 0),
      rewardCredits: Math.max(0, Number(editCredits) || 0),
    });
    setEditingId(null);
  };

  const handleAddStep = (e: React.FormEvent, missionId: string) => {
    e.preventDefault();
    const text = (newStepInputs[missionId] || '').trim();
    if (!text) return;
    addMissionStep(missionId, text);
    setNewStepInputs((prev) => ({ ...prev, [missionId]: '' }));
  };

  const filteredMissions = missions.filter((m) => {
    if (filterType === 'in_progress' && m.status !== 'in_progress') return false;
    if (filterType === 'completed' && m.status !== 'completed') return false;
    if (filterType === 'available' && m.status !== 'available') return false;
    if (['main', 'side', 'bounty', 'activity'].includes(filterType) && m.type !== filterType) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.district.toLowerCase().includes(q) ||
        m.giver.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: MissionStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono-code font-semibold bg-emerald-500/12 text-emerald-300 border border-emerald-500/35">
            <CheckCircle2 className="w-3 h-3" />
            Terminée
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono-code font-semibold bg-[var(--jx-accent-alt)]/12 text-[var(--jx-accent-alt)] border border-[var(--jx-accent-alt)]/35">
            <Clock className="w-3 h-3" />
            En cours
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono-code font-semibold bg-white/[0.04] text-slate-300 border border-white/10">
            <Circle className="w-3 h-3" />
            Disponible
          </span>
        );
    }
  };

  const getTypeLabel = (type: MissionType) => {
    switch (type) {
      case 'main':
        return <span className="text-[10px] font-mono-code font-bold tracking-wider uppercase text-[var(--jx-accent)]">Principale</span>;
      case 'side':
        return <span className="text-[10px] font-mono-code font-bold tracking-wider uppercase text-[var(--jx-accent-alt)]">Secondaire</span>;
      case 'bounty':
        return <span className="text-[10px] font-mono-code font-bold tracking-wider uppercase text-amber-300">Contrat / Prime</span>;
      case 'activity':
        return <span className="text-[10px] font-mono-code font-bold tracking-wider uppercase text-fuchsia-300">Activité</span>;
    }
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-[var(--jx-accent-alt)]" />
            <h1 className="text-xl sm:text-2xl font-bold font-hud tracking-wide text-white uppercase">
              Journal des missions
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Créez, modifiez et suivez vos quêtes principales, contrats et étapes personnalisées.
          </p>
        </div>

        <button
          onClick={onOpenNewItemModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[var(--jx-accent)] to-[var(--jx-accent-warm)] hover:brightness-110 text-white font-hud font-bold text-xs tracking-wider uppercase shadow-lg transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle mission</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="jitalx-panel p-3.5 rounded-xl flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, quartier ou contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="jitalx-input w-full pl-10 pr-4 py-2 text-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'in_progress', label: 'En cours' },
            { id: 'main', label: 'Principales' },
            { id: 'side', label: 'Secondaires' },
            { id: 'bounty', label: 'Primes' },
            { id: 'completed', label: 'Terminées' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setFilterType(chip.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono-code whitespace-nowrap cursor-pointer transition-colors ${
                filterType === chip.id
                  ? 'bg-[var(--jx-accent-alt)]/15 text-[var(--jx-accent-alt)] border border-[var(--jx-accent-alt)]/45 font-semibold'
                  : 'bg-white/[0.03] text-slate-400 hover:text-slate-200 border border-white/10'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mission Cards */}
      <div className="space-y-3.5">
        {filteredMissions.length === 0 ? (
          <div className="jitalx-panel p-10 text-center rounded-xl">
            <Compass className="w-9 h-9 text-slate-600 mx-auto mb-2.5" />
            <div className="text-slate-200 font-hud font-semibold">
              Aucune mission ne correspond à vos critères.
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Modifiez votre recherche ou ajoutez une nouvelle quête.
            </div>
          </div>
        ) : (
          filteredMissions.map((mission) => {
            const isExpanded = expandedMissionId === mission.id;
            const isEditing = editingId === mission.id;
            const completedStepsCount = mission.steps.filter((s) => s.completed).length;

            return (
              <div
                key={mission.id}
                className="jitalx-panel hover:border-[var(--jx-border-strong)] rounded-xl overflow-hidden transition-all"
              >
                <div className="p-4 sm:p-5">
                  {isEditing ? (
                    <form onSubmit={(e) => saveEdit(e, mission.id)} className="space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-xs font-hud font-bold text-[var(--jx-accent-alt)] uppercase tracking-wider">
                          Modifier la mission
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                          aria-label="Annuler la modification"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Titre de la mission"
                          className="jitalx-input w-full px-3 py-2 text-sm"
                        />
                        <select
                          value={editType}
                          onChange={(e) => setEditType(e.target.value as MissionType)}
                          className="jitalx-input w-full px-3 py-2 text-sm"
                        >
                          <option value="main">Principale</option>
                          <option value="side">Secondaire</option>
                          <option value="bounty">Contrat / Prime</option>
                          <option value="activity">Activité</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={editDistrict}
                          onChange={(e) => setEditDistrict(e.target.value)}
                          placeholder="Quartier"
                          className="jitalx-input w-full px-3 py-2 text-xs"
                        />
                        <input
                          type="text"
                          value={editGiver}
                          onChange={(e) => setEditGiver(e.target.value)}
                          placeholder="Donneur d'ordre"
                          className="jitalx-input w-full px-3 py-2 text-xs"
                        />
                      </div>

                      <textarea
                        rows={2}
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="Description"
                        className="jitalx-input w-full px-3 py-2 text-xs"
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          min="0"
                          value={editXp}
                          onChange={(e) => setEditXp(e.target.value)}
                          placeholder="XP"
                          className="jitalx-input w-full px-3 py-2 text-xs tabular-nums"
                        />
                        <input
                          type="number"
                          min="0"
                          value={editCredits}
                          onChange={(e) => setEditCredits(e.target.value)}
                          placeholder="Crédits"
                          className="jitalx-input w-full px-3 py-2 text-xs tabular-nums"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 rounded-md bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-slate-300 cursor-pointer"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 rounded-md bg-[var(--jx-accent-alt)] hover:brightness-110 text-slate-950 font-hud font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Enregistrer</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code">
                          {getTypeLabel(mission.type)}
                          <span className="text-slate-600" aria-hidden="true">·</span>
                          <span className="text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[var(--jx-accent-alt)]" />
                            {mission.district}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEditing(mission)}
                            className="p-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-[var(--jx-accent-alt)] border border-white/10 cursor-pointer transition-colors"
                            title="Modifier la mission"
                            aria-label="Modifier la mission"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleMissionStatus(mission.id)}
                            className="cursor-pointer"
                            title="Cliquer pour changer de statut"
                          >
                            {getStatusBadge(mission.status)}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-lg font-bold font-hud text-white">{mission.title}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Donneur d’ordre : <span className="text-slate-200">{mission.giver}</span>
                          </p>
                        </div>

                        <button
                          onClick={() => setExpandedMissionId(isExpanded ? null : mission.id)}
                          className="p-1.5 text-slate-400 hover:text-[var(--jx-accent-alt)] bg-white/[0.04] hover:bg-white/[0.08] rounded-md border border-white/10 cursor-pointer transition-colors"
                          aria-label={isExpanded ? 'Réduire' : 'Déplier'}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                      <p className="text-sm text-slate-300 mt-2.5 leading-relaxed">{mission.description}</p>

                      {mission.steps.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <div className="flex items-center justify-between text-xs font-mono-code text-slate-400 mb-1.5 tabular-nums">
                            <span>Étapes complétées</span>
                            <span className="text-[var(--jx-accent-alt)] font-semibold">
                              {completedStepsCount} / {mission.steps.length}
                            </span>
                          </div>
                          <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden border border-white/5">
                            <div
                              className="bg-gradient-to-r from-[var(--jx-accent)] to-[var(--jx-accent-alt)] h-full transition-all duration-300"
                              style={{
                                width: `${(completedStepsCount / mission.steps.length) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {isExpanded && (
                        <div className="mt-4 pt-3 border-t border-white/10 space-y-2.5">
                          <div className="text-[11px] font-mono-code uppercase tracking-wider text-slate-400">
                            Étapes de la mission
                          </div>
                          {mission.steps.map((step) => (
                            <div
                              key={step.id}
                              className="jitalx-panel-deep flex items-center justify-between gap-2 p-2.5 rounded-lg hover:border-[var(--jx-accent-alt)]/40 transition-colors"
                            >
                              <button
                                type="button"
                                onClick={() => toggleMissionStep(mission.id, step.id)}
                                className="flex items-center gap-3 text-left flex-1 cursor-pointer"
                              >
                                {step.completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                                )}
                                <span
                                  className={`text-sm ${
                                    step.completed ? 'line-through text-slate-500' : 'text-slate-200'
                                  }`}
                                >
                                  {step.text}
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => removeMissionStep(mission.id, step.id)}
                                className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                                title="Supprimer cette étape"
                                aria-label="Supprimer cette étape"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}

                          {/* Add step inline */}
                          <form onSubmit={(e) => handleAddStep(e, mission.id)} className="flex gap-2 pt-1">
                            <input
                              type="text"
                              value={newStepInputs[mission.id] || ''}
                              onChange={(e) =>
                                setNewStepInputs((prev) => ({ ...prev, [mission.id]: e.target.value }))
                              }
                              placeholder="Ajouter une nouvelle étape..."
                              className="jitalx-input flex-1 px-3 py-1.5 text-xs"
                            />
                            <button
                              type="submit"
                              className="px-3 py-1.5 rounded-md bg-[var(--jx-accent-alt)]/15 hover:bg-[var(--jx-accent-alt)]/25 border border-[var(--jx-accent-alt)]/40 text-[var(--jx-accent-alt)] text-xs font-mono-code font-semibold cursor-pointer"
                            >
                              + Étape
                            </button>
                          </form>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                            <button
                              onClick={() => deleteMission(mission.id)}
                              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-mono-code cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Supprimer la mission</span>
                            </button>

                            <button
                              onClick={() => toggleMissionStatus(mission.id)}
                              className="px-3 py-1.5 rounded-md bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono-code text-[var(--jx-accent-alt)] cursor-pointer"
                            >
                              Changer d&apos;état (Disponible → En cours → Terminée)
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs font-mono-code tabular-nums">
                        <div className="flex items-center gap-3">
                          <span className="text-[var(--jx-accent-alt)]">+{mission.rewardXp.toLocaleString('fr-FR')} XP</span>
                          <span className="text-slate-600" aria-hidden="true">·</span>
                          <span className="text-amber-300">+{mission.rewardCredits.toLocaleString('fr-FR')} Cr</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
