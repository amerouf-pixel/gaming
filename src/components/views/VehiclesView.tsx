import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Vehicle, VehicleCategory } from '../../types';
import {
  getDefaultVehicleImage,
  isValidImageUrl,
  VEHICLE_CATEGORY_LABELS,
} from '../../utils/vehicleVisuals';
import {
  Car,
  Lock,
  Unlock,
  Star,
  Plus,
  MapPin,
  Gauge,
  Shield,
  Zap,
  Trash2,
  Pencil,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  Info,
} from 'lucide-react';

interface VehiclesViewProps {
  onOpenNewItemModal: () => void;
}

const clampStat = (val: string, fallback: number): number => {
  const n = Number(val);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.min(100, Math.round(n)));
};

export const VehiclesView: React.FC<VehiclesViewProps> = ({ onOpenNewItemModal }) => {
  const {
    vehicles,
    toggleVehicleUnlocked,
    toggleVehicleFavorite,
    updateVehicle,
    deleteVehicle,
    stats,
  } = useGame();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editManufacturer, setEditManufacturer] = useState('');
  const [editCategory, setEditCategory] = useState<VehicleCategory>('sport');
  const [editSpeed, setEditSpeed] = useState('80');
  const [editHandling, setEditHandling] = useState('75');
  const [editArmor, setEditArmor] = useState('60');
  const [editLocation, setEditLocation] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [imageError, setImageError] = useState<string | null>(null);

  const startEdit = (v: Vehicle) => {
    setEditingId(v.id);
    setEditName(v.name);
    setEditManufacturer(v.manufacturer);
    setEditCategory(v.category);
    setEditSpeed(String(v.speed));
    setEditHandling(String(v.handling));
    setEditArmor(String(v.armor));
    setEditLocation(v.location);
    setEditNotes(v.notes || '');
    setEditImageUrl(v.imageUrl || '');
    setImageError(null);
  };

  const saveEdit = (id: string) => {
    if (!editName.trim()) return;
    updateVehicle(id, {
      name: editName.trim(),
      manufacturer: editManufacturer.trim() || 'Custom',
      category: editCategory,
      speed: clampStat(editSpeed, 75),
      handling: clampStat(editHandling, 75),
      armor: clampStat(editArmor, 60),
      location: editLocation.trim() || 'Garage personnel',
      notes: editNotes.trim() || undefined,
      imageUrl: editImageUrl.trim() || undefined,
    });
    setFailedImages((prev) => ({ ...prev, [id]: false }));
    setEditingId(null);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError(null);
    if (!file.type.startsWith('image/')) {
      setImageError('Format non pris en charge (utilisez PNG, JPG ou WebP).');
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      setImageError('Image trop lourde (> 1,5 Mo). Utilisez une image plus légère ou une URL.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditImageUrl(reader.result);
      }
    };
    reader.onerror = () => setImageError('Erreur de lecture du fichier.');
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const filteredVehicles = vehicles.filter((v) => {
    if (filterCategory === 'unlocked' && !v.unlocked) return false;
    if (filterCategory === 'favorite' && !v.isFavorite) return false;
    if (filterCategory === 'cars' && !['car', 'muscle'].includes(v.category)) return false;
    if (filterCategory === 'sport' && v.category !== 'sport') return false;
    if (filterCategory === 'moto' && v.category !== 'moto') return false;
    if (filterCategory === 'offroad' && v.category !== 'offroad') return false;
    if (filterCategory === 'special' && !['special', 'heavy'].includes(v.category)) return false;
    return true;
  });

  const garagePercent = Math.round((stats.vehiclesUnlocked / (stats.vehiclesTotal || 1)) * 100);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Car className="w-6 h-6 text-[#00f0ff]" />
            <h1 className="text-2xl font-bold font-hud text-white uppercase tracking-wide">
              Garage Visuel
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Galerie de véhicules par catégorie, suivi de collection et fiches personnalisables.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewItemModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] hover:brightness-110 text-white font-hud font-bold text-xs uppercase tracking-wider shadow-[0_0_18px_rgba(255,42,133,0.35)] transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un véhicule</span>
        </button>
      </div>

      {/* Garage Progress & Category Filters */}
      <div className="jitalx-panel p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#0b021a] border border-[#00f0ff]/45 flex items-center justify-center text-[#00f0ff] shrink-0">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-mono-code text-slate-400 uppercase">
                Progression de la collection
              </div>
              <div className="text-xl font-bold font-hud text-white tabular-nums">
                {stats.vehiclesUnlocked} / {stats.vehiclesTotal} possédés ({garagePercent}%)
              </div>
            </div>
          </div>

          <div className="w-full md:max-w-xs">
            <div className="h-2 w-full bg-[#090216] border border-[#ff2a85]/35 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#00f0ff] transition-all duration-500"
                style={{ width: `${garagePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 border-t border-white/10 pb-1">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'unlocked', label: 'Possédés' },
            { id: 'favorite', label: 'Favoris' },
            { id: 'cars', label: 'Voitures & Muscle' },
            { id: 'sport', label: 'Sport' },
            { id: 'moto', label: 'Motos' },
            { id: 'offroad', label: 'Tout-terrain' },
            { id: 'special', label: 'Spéciaux & Lourds' },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setFilterCategory(chip.id)}
              className={`px-3 py-1.5 text-xs font-mono-code whitespace-nowrap cursor-pointer transition-colors border ${
                filterCategory === chip.id
                  ? 'bg-[#00f0ff]/15 text-[#00f0ff] border-[#00f0ff]/60'
                  : 'bg-[#0b021a] text-slate-400 hover:text-white border-white/10'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Honest disclaimer */}
      <div className="p-2.5 jitalx-panel-deep text-[11px] font-mono-code text-slate-400 flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-[#00f0ff] shrink-0" />
        <span>
          Les illustrations par catégorie sont fournies par JITALX et les caractéristiques par défaut
          sont librement éditables (aucune donnée officielle éditeur). Vous pouvez importer vos
          propres visuels sur chaque fiche.
        </span>
      </div>

      {/* Visual Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredVehicles.length === 0 ? (
          <div className="col-span-full p-10 text-center jitalx-panel">
            <Car className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <div className="text-slate-200 font-hud font-bold uppercase">
              Aucun véhicule dans cette catégorie
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Choisissez un autre filtre ou ajoutez un nouveau véhicule à votre garage.
            </p>
          </div>
        ) : (
          filteredVehicles.map((vehicle) => {
            const isEditing = editingId === vehicle.id;
            const imgSrc = isValidImageUrl(vehicle.imageUrl)
              ? vehicle.imageUrl!
              : getDefaultVehicleImage(vehicle.category);
            const hasImageError = Boolean(failedImages[vehicle.id]);

            return (
              <div
                key={vehicle.id}
                className={`jitalx-panel overflow-hidden flex flex-col justify-between transition-all ${
                  vehicle.unlocked ? 'border-[#ff2a85]/35' : 'opacity-80 border-white/10'
                }`}
              >
                {/* Visual Media Showcase */}
                <div className="relative aspect-[4/3] w-full bg-[#090216] overflow-hidden border-b border-white/10">
                  {!hasImageError ? (
                    <img
                      src={imgSrc}
                      alt={vehicle.name}
                      referrerPolicy="no-referrer"
                      onError={() => setFailedImages((prev) => ({ ...prev, [vehicle.id]: true }))}
                      className={`w-full h-full object-cover transition-transform duration-300 ${
                        vehicle.unlocked ? 'hover:scale-105' : 'grayscale-[55%]'
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1b0838] to-[#090216] text-slate-400 p-4 text-center">
                      <ImageIcon className="w-8 h-8 text-[#00f0ff]/60 mb-2" />
                      <span className="text-xs font-hud uppercase text-slate-300">
                        {vehicle.name}
                      </span>
                      <span className="text-[10px] font-mono-code text-slate-500 mt-0.5">
                        Visuel personnalisable via Éditer
                      </span>
                    </div>
                  )}

                  {/* Contrast Scrim + Collection Status & Quick Controls */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b021a] via-[#0b021a]/75 to-transparent p-3.5">
                    <div className="flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[11px] font-mono-code text-slate-300 truncate">
                          {vehicle.manufacturer} · {VEHICLE_CATEGORY_LABELS[vehicle.category]}
                        </div>
                        <h3 className="font-hud font-bold text-lg text-white leading-tight truncate">
                          {vehicle.name}
                        </h3>
                      </div>
                      <span
                        className={`text-[10px] font-mono-code uppercase font-bold shrink-0 ${
                          vehicle.unlocked ? 'text-emerald-300' : 'text-slate-400'
                        }`}
                      >
                        {vehicle.unlocked ? 'Possédé' : 'Verrouillé'}
                      </span>
                    </div>
                  </div>

                  {/* Top-right Action Buttons */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleVehicleFavorite(vehicle.id)}
                      className="p-1.5 bg-[#120428]/85 hover:bg-[#120428] border border-white/15 text-slate-300 hover:text-amber-400 cursor-pointer"
                      title="Marquer en favori"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          vehicle.isFavorite ? 'text-amber-400 fill-amber-400' : ''
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleVehicleUnlocked(vehicle.id)}
                      className={`p-1.5 border cursor-pointer ${
                        vehicle.unlocked
                          ? 'bg-emerald-950/85 text-emerald-300 border-emerald-500/50'
                          : 'bg-[#120428]/85 text-slate-400 border-white/15'
                      }`}
                      title={vehicle.unlocked ? 'Marquer non possédé' : 'Marquer possédé'}
                    >
                      {vehicle.unlocked ? (
                        <Unlock className="w-3.5 h-3.5" />
                      ) : (
                        <Lock className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => (isEditing ? setEditingId(null) : startEdit(vehicle))}
                      className="p-1.5 bg-[#120428]/85 hover:bg-[#120428] border border-white/15 text-slate-300 hover:text-[#00f0ff] cursor-pointer"
                      title="Modifier ce véhicule"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteVehicle(vehicle.id)}
                      className="p-1.5 bg-[#120428]/85 hover:bg-[#120428] border border-white/15 text-slate-300 hover:text-rose-400 cursor-pointer"
                      title="Supprimer ce véhicule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Body: Inline Editor OR Stats + Location */}
                {isEditing ? (
                  <div className="p-4 space-y-3 bg-[#0b021a]">
                    <div className="text-xs font-hud font-bold uppercase text-[#00f0ff]">
                      Modifier la fiche véhicule
                    </div>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Nom du véhicule"
                      className="w-full jitalx-input px-2.5 py-1.5 text-xs"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editManufacturer}
                        onChange={(e) => setEditManufacturer(e.target.value)}
                        placeholder="Constructeur"
                        className="w-full jitalx-input px-2.5 py-1.5 text-xs"
                      />
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as VehicleCategory)}
                        className="w-full jitalx-input px-2.5 py-1.5 text-xs"
                      >
                        <option value="car">Voiture</option>
                        <option value="sport">Sport</option>
                        <option value="muscle">Muscle / Coupé</option>
                        <option value="moto">Moto</option>
                        <option value="offroad">Tout-terrain</option>
                        <option value="special">Spécial</option>
                        <option value="heavy">Lourd / Blindé</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] font-mono-code text-slate-400">Vitesse</label>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={editSpeed}
                          onChange={(e) => setEditSpeed(e.target.value)}
                          className="w-full jitalx-input px-2 py-1 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono-code text-slate-400">Maniab.</label>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={editHandling}
                          onChange={(e) => setEditHandling(e.target.value)}
                          className="w-full jitalx-input px-2 py-1 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono-code text-slate-400">Blindage</label>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={editArmor}
                          onChange={(e) => setEditArmor(e.target.value)}
                          className="w-full jitalx-input px-2 py-1 text-xs"
                        />
                      </div>
                    </div>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      placeholder="Lieu / Garage"
                      className="w-full jitalx-input px-2.5 py-1.5 text-xs"
                    />
                    <input
                      type="text"
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Notes personnelles..."
                      className="w-full jitalx-input px-2.5 py-1.5 text-xs"
                    />
                    <div className="space-y-1.5 pt-1 border-t border-white/10">
                      <label className="text-[10px] font-mono-code text-slate-400 uppercase block">
                        Image personnalisée (URL ou fichier local)
                      </label>
                      <input
                        type="url"
                        value={editImageUrl}
                        onChange={(e) => setEditImageUrl(e.target.value)}
                        placeholder="https://... (vide = visuel catégorie)"
                        className="w-full jitalx-input px-2.5 py-1.5 text-xs font-mono-code"
                      />
                      <div className="flex items-center gap-2">
                        <label className="flex-1 py-1.5 px-2.5 bg-[#170632] hover:bg-[#1e0940] border border-white/15 text-[11px] font-mono-code text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer">
                          <Upload className="w-3 h-3 text-[#00f0ff]" />
                          <span>Importer photo</span>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleImageFileUpload}
                            className="hidden"
                          />
                        </label>
                        {editImageUrl && (
                          <button
                            type="button"
                            onClick={() => setEditImageUrl('')}
                            className="px-2.5 py-1.5 bg-slate-900 text-[11px] font-mono-code text-slate-300 hover:text-white cursor-pointer"
                          >
                            Réinit.
                          </button>
                        )}
                      </div>
                      {imageError && (
                        <div className="text-[11px] text-rose-300 font-mono-code">{imageError}</div>
                      )}
                    </div>
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
                        onClick={() => saveEdit(vehicle.id)}
                        className="px-3 py-1.5 bg-[#00f0ff] text-[#120428] text-xs font-hud font-bold uppercase flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Enregistrer</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-[11px] font-mono-code text-slate-400 mb-0.5">
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-[#00f0ff]" /> Vitesse
                          </span>
                          <span className="text-[#00f0ff] font-semibold tabular-nums">
                            {vehicle.speed}/100
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-[#090216] overflow-hidden">
                          <div
                            className="h-full bg-[#00f0ff]"
                            style={{ width: `${vehicle.speed}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-mono-code text-slate-400 mb-0.5">
                          <span className="flex items-center gap-1">
                            <Gauge className="w-3 h-3 text-emerald-400" /> Maniabilité
                          </span>
                          <span className="text-emerald-400 font-semibold tabular-nums">
                            {vehicle.handling}/100
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-[#090216] overflow-hidden">
                          <div
                            className="h-full bg-emerald-400"
                            style={{ width: `${vehicle.handling}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-mono-code text-slate-400 mb-0.5">
                          <span className="flex items-center gap-1">
                            <Shield className="w-3 h-3 text-[#ff7b00]" /> Blindage
                          </span>
                          <span className="text-[#ff7b00] font-semibold tabular-nums">
                            {vehicle.armor}/100
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-[#090216] overflow-hidden">
                          <div
                            className="h-full bg-[#ff7b00]"
                            style={{ width: `${vehicle.armor}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-1.5">
                      <div className="text-xs text-slate-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#ff2a85] shrink-0" />
                        <span className="truncate">{vehicle.location}</span>
                      </div>
                      {vehicle.notes && (
                        <p className="text-[11px] text-slate-400 line-clamp-2">{vehicle.notes}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
