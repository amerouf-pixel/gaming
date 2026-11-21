import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Collectible, CollectibleCategory } from '../../types';
import {
  Sparkles,
  MapPin,
  Search,
  CheckCircle2,
  Circle,
  Plus,
  Compass,
  FileCode,
  Volume2,
  Shield,
  HelpCircle,
  Trash2,
  Pencil,
  Check,
  X,
} from 'lucide-react';

interface CollectiblesViewProps {
  onOpenNewItemModal: () => void;
}

export const CollectiblesView: React.FC<CollectiblesViewProps> = ({ onOpenNewItemModal }) => {
  const { collectibles, toggleCollectible, updateCollectible, deleteCollectible, stats } =
    useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<CollectibleCategory>('relic');
  const [editDistrict, setEditDistrict] = useState('');
  const [editHint, setEditHint] = useState('');
  const [editCoords, setEditCoords] = useState('');

  const startEdit = (item: Collectible) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditDistrict(item.district);
    setEditHint(item.hint);
    setEditCoords(item.coordinates || '');
  };

  const saveEdit = (id: string) => {
    if (!editName.trim()) return;
    updateCollectible(id, {
      name: editName.trim(),
      category: editCategory,
      district: editDistrict.trim() || 'Secteur libre',
      hint: editHint.trim() || 'Indice à compléter',
      coordinates: editCoords.trim() || undefined,
    });
    setEditingId(null);
  };

  const filteredItems = collectibles.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q) ||
        item.hint.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getCategoryIcon = (cat: CollectibleCategory) => {
    switch (cat) {
      case 'audio_log':
        return <Volume2 className="w-4 h-4 text-[#00f0ff]" />;
      case 'relic':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'blueprint':
        return <FileCode className="w-4 h-4 text-emerald-400" />;
      case 'cache':
        return <Shield className="w-4 h-4 text-purple-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-[#ff2a85]" />;
    }
  };

  const getCategoryLabel = (cat: CollectibleCategory) => {
    switch (cat) {
      case 'audio_log':
        return 'Journal Audio';
      case 'relic':
        return 'Relique';
      case 'blueprint':
        return 'Plan';
      case 'cache':
        return 'Cache Secrète';
      case 'easter_egg':
        return 'Secret';
    }
  };

  const progressPct = Math.round((stats.collectiblesDone / (stats.collectiblesTotal || 1)) * 100);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold font-hud text-white uppercase">Collectibles</h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Localisation, indices, édition rapide et suivi de complétion de vos objets cachés.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewItemModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] hover:brightness-110 text-white font-hud font-bold text-xs uppercase tracking-wider shadow-[0_0_18px_rgba(255,42,133,0.3)] transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un collectible</span>
        </button>
      </div>

      {/* Progress Card */}
      <div className="jitalx-panel p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono-code text-slate-400 uppercase">
            Statut des objets cachés
          </div>
          <div className="text-xl font-bold font-hud text-white mt-0.5 tabular-nums">
            {stats.collectiblesDone} / {stats.collectiblesTotal} découverts ({progressPct}%)
          </div>
        </div>

        <div className="flex-1 max-w-xs">
          <div className="w-full bg-[#090216] h-2 overflow-hidden border border-[#ff2a85]/35">
            <div
              className="bg-gradient-to-r from-[#ff7b00] to-amber-300 h-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un nom, secteur ou indice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 jitalx-input text-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'audio_log', label: 'Audio' },
            { id: 'relic', label: 'Reliques' },
            { id: 'blueprint', label: 'Plans' },
            { id: 'cache', label: 'Caches' },
            { id: 'easter_egg', label: 'Secrets' },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setSelectedCategory(chip.id)}
              className={`px-3 py-1.5 text-xs font-mono-code whitespace-nowrap cursor-pointer transition-colors border ${
                selectedCategory === chip.id
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/60'
                  : 'bg-[#0b021a] text-slate-400 hover:text-white border-white/10'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Collectibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full p-8 text-center jitalx-panel">
            <Sparkles className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <div className="text-slate-200 font-semibold">Aucun collectible trouvé.</div>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isEditing = editingId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (!isEditing) toggleCollectible(item.id);
                }}
                className={`jitalx-panel p-4 transition-all flex flex-col justify-between ${
                  isEditing ? '' : 'cursor-pointer'
                } ${item.collected ? 'opacity-75 border-white/10' : 'hover:border-amber-400/50'}`}
              >
                {isEditing ? (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="space-y-2.5"
                  >
                    <div className="text-xs font-hud font-bold uppercase text-[#00f0ff]">
                      Modifier le collectible
                    </div>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Nom"
                      className="w-full jitalx-input px-2.5 py-1.5 text-xs"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as CollectibleCategory)}
                        className="w-full jitalx-input px-2.5 py-1.5 text-xs"
                      >
                        <option value="relic">Relique</option>
                        <option value="cache">Cache Secrète</option>
                        <option value="audio_log">Journal Audio</option>
                        <option value="blueprint">Plan</option>
                        <option value="easter_egg">Secret</option>
                      </select>
                      <input
                        type="text"
                        value={editDistrict}
                        onChange={(e) => setEditDistrict(e.target.value)}
                        placeholder="Secteur"
                        className="w-full jitalx-input px-2.5 py-1.5 text-xs"
                      />
                    </div>
                    <input
                      type="text"
                      value={editHint}
                      onChange={(e) => setEditHint(e.target.value)}
                      placeholder="Indice de localisation"
                      className="w-full jitalx-input px-2.5 py-1.5 text-xs"
                    />
                    <input
                      type="text"
                      value={editCoords}
                      onChange={(e) => setEditCoords(e.target.value)}
                      placeholder="Coordonnées (ex: X: 142.8 | Y: 89.2)"
                      className="w-full jitalx-input px-2.5 py-1.5 text-xs font-mono-code"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 bg-slate-900 text-xs text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Annuler</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => saveEdit(item.id)}
                        className="px-3 py-1.5 bg-[#00f0ff] text-[#120428] text-xs font-hud font-bold uppercase flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Enregistrer</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2 text-[11px] font-mono-code">
                        <div className="flex items-center gap-1.5 text-amber-300">
                          {getCategoryIcon(item.category)}
                          <span className="uppercase font-semibold">
                            {getCategoryLabel(item.category)}
                          </span>
                        </div>

                        <span className="text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#ff2a85]" />
                          {item.district}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <h3
                          className={`font-hud font-bold text-base ${
                            item.collected ? 'line-through text-slate-400' : 'text-white'
                          }`}
                        >
                          {item.name}
                        </h3>

                        <div className="shrink-0 mt-0.5">
                          {item.collected ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 mt-2 leading-relaxed jitalx-panel-deep p-2.5">
                        <span className="text-slate-400 font-semibold">Indice : </span>
                        {item.hint}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono-code text-slate-400">
                      <span className="flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-[#00f0ff]" />
                        {item.coordinates || 'Coordonnées libres'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={item.collected ? 'text-emerald-400' : 'text-slate-500'}>
                          {item.collected ? 'Obtenu' : 'À trouver'}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(item);
                          }}
                          className="p-1 text-slate-400 hover:text-[#00f0ff] cursor-pointer"
                          title="Modifier ce collectible"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCollectible(item.id);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                          title="Supprimer ce collectible"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
