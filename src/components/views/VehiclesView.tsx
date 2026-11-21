import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useLocale } from '../../context/LocaleContext';
import { Vehicle, VehicleCategory } from '../../types';
import {
  getDefaultVehicleImage,
  getVehicleCategoryLabel,
  isValidImageUrl,
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

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
]);

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
  const { locale, appCopy } = useLocale();
  const t = appCopy.garage;

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
    const trimmedImg = editImageUrl.trim();
    if (trimmedImg && !isValidImageUrl(trimmedImg)) {
      setImageError(t.invalidImageUrl);
      return;
    }

    setImageError(null);
    updateVehicle(id, {
      name: editName.trim(),
      manufacturer: editManufacturer.trim() || 'Custom',
      category: editCategory,
      speed: clampStat(editSpeed, 75),
      handling: clampStat(editHandling, 75),
      armor: clampStat(editArmor, 60),
      location: editLocation.trim() || (locale === 'fr' ? 'Garage personnel' : 'Personal Garage'),
      notes: editNotes.trim() || undefined,
      imageUrl: trimmedImg || undefined,
    });
    setFailedImages((prev) => ({ ...prev, [id]: false }));
    setEditingId(null);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError(null);
    if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
      setImageError(t.invalidFileType);
      e.target.value = '';
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      setImageError(t.fileTooLarge);
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string' && isValidImageUrl(reader.result)) {
        setEditImageUrl(reader.result);
      } else {
        setImageError(t.invalidFileType);
      }
    };
    reader.onerror = () =>
      setImageError(locale === 'fr' ? 'Erreur de lecture du fichier.' : 'Failed to read file.');
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
              {t.title}
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">{t.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={onOpenNewItemModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] hover:brightness-110 text-white font-hud font-bold text-xs uppercase tracking-wider shadow-[0_0_18px_rgba(255,42,133,0.35)] transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addVehicle}</span>
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
                {locale === 'fr' ? 'Progression de la collection' : 'Collection Progress'}
              </div>
              <div className="text-xl font-bold font-hud text-white tabular-nums">
                {stats.vehiclesUnlocked} / {stats.vehiclesTotal} {t.unlockedCount} ({garagePercent}%)
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
            { id: 'all', label: t.catAll },
            { id: 'unlocked', label: t.onlyUnlocked },
            { id: 'favorite', label: t.onlyFavorites },
            { id: 'cars', label: `${t.catCar} & ${t.catMuscle}` },
            { id: 'sport', label: t.catSport },
            { id: 'moto', label: t.catMoto },
            { id: 'offroad', label: t.catOffroad },
            { id: 'special', label: `${t.catSpecial} & ${t.catHeavy}` },
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
          {locale === 'fr'
            ? 'Les illustrations par catégorie sont fournies par JITALX et chaque fiche (véhicule, monture, vaisseau ou équipement) est librement éditable pour tous vos jeux.'
            : 'Category illustrations are provided by JITALX and every card (vehicle, mount, ship, or loadout) is freely editable for any game.'}
        </span>
      </div>

      {/* Visual Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredVehicles.length === 0 ? (
          <div className="col-span-full p-10 text-center jitalx-panel">
            <Car className="w-10 h-10 text-slate-500 mx-auto mb-2" />
            <div className="text-slate-200 font-hud font-bold uppercase">{t.emptyTitle}</div>
            <p className="text-xs text-slate-400 mt-1">{t.emptyDesc}</p>
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
                        {locale === 'fr' ? 'Visuel modifiable via Éditer' : 'Customize visual via Edit'}
                      </span>
                    </div>
                  )}

                  {/* Contrast Scrim */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b021a] via-[#0b021a]/75 to-transparent p-3.5">
                    <div className="flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[11px] font-mono-code text-slate-300 truncate">
                          {vehicle.manufacturer} · {getVehicleCategoryLabel(vehicle.category, locale)}
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
                        {vehicle.unlocked ? appCopy.common.unlocked : appCopy.common.locked}
                      </span>
                    </div>
                  </div>

                  {/* Top-right Action Buttons */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleVehicleFavorite(vehicle.id)}
                      className="p-1.5 bg-[#120428]/85 hover:bg-[#120428] border border-white/15 text-slate-300 hover:text-amber-400 cursor-pointer"
                      title={appCopy.common.favorite}
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
                      title={vehicle.unlocked ? appCopy.common.locked : appCopy.common.unlocked}
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
                      title={appCopy.common.edit}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteVehicle(vehicle.id)}
                      className="p-1.5 bg-[#120428]/85 hover:bg-[#120428] border border-white/15 text-slate-300 hover:text-rose-400 cursor-pointer"
                      title={appCopy.common.delete}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Body: Inline Editor OR Stats + Location */}
                {isEditing ? (
                  <div className="p-4 space-y-3 bg-[#0b021a]">
                    <div className="text-xs font-hud font-bold uppercase text-[#00f0ff]">
                      {appCopy.common.edit}
                    </div>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder={appCopy.modalNew.fieldName}
                      className="w-full jitalx-input px-2.5 py-1.5 text-xs"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={editManufacturer}
                        onChange={(e) => setEditManufacturer(e.target.value)}
                        placeholder={appCopy.modalNew.fieldManufacturer}
                        className="w-full jitalx-input px-2.5 py-1.5 text-xs"
                      />
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as VehicleCategory)}
                        className="w-full jitalx-input px-2.5 py-1.5 text-xs"
                      >
                        <option value="car">{t.catCar}</option>
                        <option value="sport">{t.catSport}</option>
                        <option value="muscle">{t.catMuscle}</option>
                        <option value="moto">{t.catMoto}</option>
                        <option value="offroad">{t.catOffroad}</option>
                        <option value="special">{t.catSpecial}</option>
                        <option value="heavy">{t.catHeavy}</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] font-mono-code text-slate-400">
                          {t.speed}
                        </label>
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
                        <label className="text-[10px] font-mono-code text-slate-400">
                          {t.handling}
                        </label>
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
                        <label className="text-[10px] font-mono-code text-slate-400">
                          {t.armor}
                        </label>
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
                      placeholder={t.locationLabel}
                      className="w-full jitalx-input px-2.5 py-1.5 text-xs"
                    />
                    <input
                      type="text"
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder={locale === 'fr' ? 'Notes personnelles...' : 'Personal notes...'}
                      className="w-full jitalx-input px-2.5 py-1.5 text-xs"
                    />
                    <div className="space-y-1.5 pt-1 border-t border-white/10">
                      <label className="text-[10px] font-mono-code text-slate-400 uppercase block">
                        {t.uploadPhoto}
                      </label>
                      <input
                        type="url"
                        value={editImageUrl}
                        onChange={(e) => {
                          setEditImageUrl(e.target.value);
                          if (imageError) setImageError(null);
                        }}
                        placeholder={t.photoUrlPlaceholder}
                        className="w-full jitalx-input px-2.5 py-1.5 text-xs font-mono-code"
                      />
                      <div className="flex items-center gap-2">
                        <label className="flex-1 py-1.5 px-2.5 bg-[#170632] hover:bg-[#1e0940] border border-white/15 text-[11px] font-mono-code text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer">
                          <Upload className="w-3 h-3 text-[#00f0ff]" />
                          <span>{locale === 'fr' ? 'Importer photo' : 'Upload image'}</span>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif"
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
                            {appCopy.common.reset}
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
                        <span>{appCopy.common.cancel}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => saveEdit(vehicle.id)}
                        className="px-3 py-1.5 bg-[#00f0ff] text-[#120428] text-xs font-hud font-bold uppercase flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{appCopy.common.save}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-[11px] font-mono-code text-slate-400 mb-0.5">
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-[#00f0ff]" /> {t.speed}
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
                            <Gauge className="w-3 h-3 text-emerald-400" /> {t.handling}
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
                            <Shield className="w-3 h-3 text-[#ff7b00]" /> {t.armor}
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
