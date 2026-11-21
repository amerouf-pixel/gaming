import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useLocale } from '../context/LocaleContext';
import { isValidImageUrl } from '../utils/vehicleVisuals';
import { X, Plus, Compass, Sparkles, Car, FileText, AlertTriangle } from 'lucide-react';
import { MissionType, CollectibleCategory, VehicleCategory } from '../types';

export type NewItemModalType = 'mission' | 'collectible' | 'vehicle' | 'note';

interface ModalNewItemProps {
  isOpen: boolean;
  defaultType?: NewItemModalType;
  onClose: () => void;
}

const clampStat = (value: string, fallback: number): number => {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.min(100, Math.round(n)));
};

export const ModalNewItem: React.FC<ModalNewItemProps> = ({
  isOpen,
  defaultType = 'mission',
  onClose,
}) => {
  const { addMission, addCollectible, addVehicle, addNote, activeProfile } = useGame();
  const { locale, appCopy } = useLocale();
  const t = appCopy.modalNew;

  const [selectedType, setSelectedType] = useState<NewItemModalType>(defaultType);
  const [formError, setFormError] = useState<string | null>(null);

  // Mission state
  const [missionTitle, setMissionTitle] = useState('');
  const [missionType, setMissionType] = useState<MissionType>('main');
  const [missionDistrict, setMissionDistrict] = useState('');
  const [missionGiver, setMissionGiver] = useState('');
  const [missionDesc, setMissionDesc] = useState('');
  const [missionStepsText, setMissionStepsText] = useState('');
  const [missionXp, setMissionXp] = useState('1000');
  const [missionCredits, setMissionCredits] = useState('3000');

  // Collectible state
  const [collectibleName, setCollectibleName] = useState('');
  const [collectibleCat, setCollectibleCat] = useState<CollectibleCategory>('relic');
  const [collectibleDistrict, setCollectibleDistrict] = useState('');
  const [collectibleHint, setCollectibleHint] = useState('');
  const [collectibleCoords, setCollectibleCoords] = useState('');

  // Vehicle state
  const [vehicleName, setVehicleName] = useState('');
  const [vehicleManufacturer, setVehicleManufacturer] = useState('');
  const [vehicleCat, setVehicleCat] = useState<VehicleCategory>('sport');
  const [vehicleSpeed, setVehicleSpeed] = useState('80');
  const [vehicleHandling, setVehicleHandling] = useState('75');
  const [vehicleArmor, setVehicleArmor] = useState('60');
  const [vehicleLoc, setVehicleLoc] = useState('');
  const [vehicleImageUrl, setVehicleImageUrl] = useState('');

  // Note state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('tactics');

  useEffect(() => {
    if (isOpen) {
      setSelectedType(defaultType);
      setFormError(null);
    }
  }, [isOpen, defaultType]);

  const resetForms = () => {
    setFormError(null);
    setMissionTitle('');
    setMissionType('main');
    setMissionDistrict('');
    setMissionGiver('');
    setMissionDesc('');
    setMissionStepsText('');
    setMissionXp('1000');
    setMissionCredits('3000');

    setCollectibleName('');
    setCollectibleCat('relic');
    setCollectibleDistrict('');
    setCollectibleHint('');
    setCollectibleCoords('');

    setVehicleName('');
    setVehicleManufacturer('');
    setVehicleCat('sport');
    setVehicleSpeed('80');
    setVehicleHandling('75');
    setVehicleArmor('60');
    setVehicleLoc('');
    setVehicleImageUrl('');

    setNoteTitle('');
    setNoteContent('');
    setNoteTags('tactics');
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (selectedType === 'mission') {
      if (!missionTitle.trim()) return;
      const customSteps = missionStepsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((text, idx) => ({
          id: `s_${Date.now()}_${idx + 1}`,
          text,
          completed: false,
        }));

      addMission({
        title: missionTitle.trim(),
        type: missionType,
        district: missionDistrict.trim() || (locale === 'fr' ? 'Secteur libre' : 'Open Sector'),
        giver: missionGiver.trim() || (locale === 'fr' ? 'Inconnu' : 'Unknown'),
        description:
          missionDesc.trim() ||
          (locale === 'fr' ? 'Objectif personnalisé.' : 'Custom campaign objective.'),
        rewardXp: Math.max(0, Number(missionXp) || 0),
        rewardCredits: Math.max(0, Number(missionCredits) || 0),
        status: 'available',
        steps:
          customSteps.length > 0
            ? customSteps
            : [
                {
                  id: `s_${Date.now()}_1`,
                  text: locale === 'fr' ? 'Rejoindre la zone indiquée' : 'Reach the target location',
                  completed: false,
                },
                {
                  id: `s_${Date.now()}_2`,
                  text: locale === 'fr' ? 'Compléter l’objectif' : 'Complete main objective',
                  completed: false,
                },
              ],
      });
    } else if (selectedType === 'collectible') {
      if (!collectibleName.trim()) return;
      addCollectible({
        name: collectibleName.trim(),
        category: collectibleCat,
        district: collectibleDistrict.trim() || (locale === 'fr' ? 'Secteur libre' : 'Open Sector'),
        hint:
          collectibleHint.trim() ||
          (locale === 'fr' ? 'Indice à compléter' : 'Location hint to fill in'),
        coordinates: collectibleCoords.trim() || 'X: 0.0 | Y: 0.0',
        collected: false,
      });
    } else if (selectedType === 'vehicle') {
      if (!vehicleName.trim()) return;
      const cleanImg = vehicleImageUrl.trim();
      if (cleanImg && !isValidImageUrl(cleanImg)) {
        setFormError(t.invalidImageError);
        return;
      }
      addVehicle({
        name: vehicleName.trim(),
        manufacturer: vehicleManufacturer.trim() || 'Custom',
        category: vehicleCat,
        speed: clampStat(vehicleSpeed, 75),
        handling: clampStat(vehicleHandling, 70),
        armor: clampStat(vehicleArmor, 50),
        unlocked: true,
        location: vehicleLoc.trim() || (locale === 'fr' ? 'Garage personnel' : 'Personal Garage'),
        isFavorite: false,
        imageUrl: cleanImg || undefined,
      });
    } else if (selectedType === 'note') {
      if (!noteTitle.trim()) return;
      addNote({
        title: noteTitle.trim(),
        content: noteContent.trim(),
        tags: noteTags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        pinned: true,
      });
    }

    resetForms();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#160631] border border-[#ff2a85]/50 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#ff2a85]/25 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Plus className="w-5 h-5 text-[#00f0ff] shrink-0" />
            <div className="min-w-0">
              <h2 className="font-hud font-bold text-base sm:text-lg text-white uppercase truncate">
                {t.title}
              </h2>
              <p className="text-[11px] font-mono-code text-[#00f0ff]/80 truncate">
                {activeProfile.name} · {activeProfile.universe}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
            aria-label={appCopy.common.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type selector tabs */}
        <div className="grid grid-cols-4 p-2 bg-[#0e0320] border-b border-[#ff2a85]/25 gap-1">
          <button
            type="button"
            onClick={() => {
              setSelectedType('mission');
              setFormError(null);
            }}
            className={`py-2 px-1 text-center rounded-lg text-xs font-hud transition-colors cursor-pointer flex flex-col items-center gap-1 ${
              selectedType === 'mission'
                ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50'
                : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{t.tabMission}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedType('collectible');
              setFormError(null);
            }}
            className={`py-2 px-1 text-center rounded-lg text-xs font-hud transition-colors cursor-pointer flex flex-col items-center gap-1 ${
              selectedType === 'collectible'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.tabCollectible}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedType('vehicle');
              setFormError(null);
            }}
            className={`py-2 px-1 text-center rounded-lg text-xs font-hud transition-colors cursor-pointer flex flex-col items-center gap-1 ${
              selectedType === 'vehicle'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>{t.tabVehicle}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedType('note');
              setFormError(null);
            }}
            className={`py-2 px-1 text-center rounded-lg text-xs font-hud transition-colors cursor-pointer flex flex-col items-center gap-1 ${
              selectedType === 'note'
                ? 'bg-[#ff2a85]/20 text-[#ff2a85] border border-[#ff2a85]/50'
                : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.tabNote}</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-xs text-rose-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {selectedType === 'mission' && (
            <>
              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  {t.fieldTitle} *
                </label>
                <input
                  type="text"
                  required
                  value={missionTitle}
                  onChange={(e) => setMissionTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    {t.fieldCategory}
                  </label>
                  <select
                    value={missionType}
                    onChange={(e) => setMissionType(e.target.value as MissionType)}
                    className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                  >
                    <option value="main">{appCopy.missions.filterMain}</option>
                    <option value="side">{appCopy.missions.filterSide}</option>
                    <option value="bounty">{appCopy.missions.filterBounty}</option>
                    <option value="activity">{appCopy.missions.filterActivity}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    {t.fieldDistrict}
                  </label>
                  <input
                    type="text"
                    value={missionDistrict}
                    onChange={(e) => setMissionDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  {t.fieldGiver}
                </label>
                <input
                  type="text"
                  value={missionGiver}
                  onChange={(e) => setMissionGiver(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  {t.fieldDescription}
                </label>
                <textarea
                  rows={2}
                  value={missionDesc}
                  onChange={(e) => setMissionDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  {locale === 'fr' ? 'Étapes (1 par ligne, optionnel)' : 'Steps (1 per line, optional)'}
                </label>
                <textarea
                  rows={2}
                  value={missionStepsText}
                  onChange={(e) => setMissionStepsText(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-xs font-mono-code text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">XP</label>
                  <input
                    type="number"
                    min="0"
                    value={missionXp}
                    onChange={(e) => setMissionXp(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    {locale === 'fr' ? 'Crédits' : 'Credits'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={missionCredits}
                    onChange={(e) => setMissionCredits(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
              </div>
            </>
          )}

          {selectedType === 'collectible' && (
            <>
              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  {t.fieldName} *
                </label>
                <input
                  type="text"
                  required
                  value={collectibleName}
                  onChange={(e) => setCollectibleName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    {t.fieldCategory}
                  </label>
                  <select
                    value={collectibleCat}
                    onChange={(e) => setCollectibleCat(e.target.value as CollectibleCategory)}
                    className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="relic">{appCopy.collectibles.catRelic}</option>
                    <option value="cache">{appCopy.collectibles.catCache}</option>
                    <option value="audio_log">{appCopy.collectibles.catAudioLog}</option>
                    <option value="blueprint">{appCopy.collectibles.catBlueprint}</option>
                    <option value="easter_egg">{appCopy.collectibles.catEasterEgg}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    {t.fieldDistrict}
                  </label>
                  <input
                    type="text"
                    value={collectibleDistrict}
                    onChange={(e) => setCollectibleDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  {t.fieldHint}
                </label>
                <input
                  type="text"
                  value={collectibleHint}
                  onChange={(e) => setCollectibleHint(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  {t.fieldCoords}
                </label>
                <input
                  type="text"
                  placeholder="X: 312.4 | Y: 184.2"
                  value={collectibleCoords}
                  onChange={(e) => setCollectibleCoords(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </>
          )}

          {selectedType === 'vehicle' && (
            <>
              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  {t.fieldName} *
                </label>
                <input
                  type="text"
                  required
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    {t.fieldManufacturer}
                  </label>
                  <input
                    type="text"
                    value={vehicleManufacturer}
                    onChange={(e) => setVehicleManufacturer(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    {t.fieldCategory}
                  </label>
                  <select
                    value={vehicleCat}
                    onChange={(e) => setVehicleCat(e.target.value as VehicleCategory)}
                    className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="car">{appCopy.garage.catCar}</option>
                    <option value="sport">{appCopy.garage.catSport}</option>
                    <option value="muscle">{appCopy.garage.catMuscle}</option>
                    <option value="moto">{appCopy.garage.catMoto}</option>
                    <option value="offroad">{appCopy.garage.catOffroad}</option>
                    <option value="special">{appCopy.garage.catSpecial}</option>
                    <option value="heavy">{appCopy.garage.catHeavy}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    {appCopy.garage.speed}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={vehicleSpeed}
                    onChange={(e) => setVehicleSpeed(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    {appCopy.garage.handling}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={vehicleHandling}
                    onChange={(e) => setVehicleHandling(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    {appCopy.garage.armor}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={vehicleArmor}
                    onChange={(e) => setVehicleArmor(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  {t.fieldLocation}
                </label>
                <input
                  type="text"
                  value={vehicleLoc}
                  onChange={(e) => setVehicleLoc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  {t.fieldImageUrl}
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={vehicleImageUrl}
                  onChange={(e) => setVehicleImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-xs font-mono-code text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </>
          )}

          {selectedType === 'note' && (
            <>
              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  {t.fieldTitle} *
                </label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-[#ff2a85]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  {t.fieldContent}
                </label>
                <textarea
                  rows={4}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-[#ff2a85] font-mono-code"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  {t.fieldTags}
                </label>
                <input
                  type="text"
                  value={noteTags}
                  onChange={(e) => setNoteTags(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-[#ff2a85]"
                />
              </div>
            </>
          )}

          <div className="pt-3 border-t border-[#ff2a85]/25 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 text-xs font-mono-code text-slate-300 hover:bg-slate-800 cursor-pointer"
            >
              {appCopy.common.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] hover:brightness-110 text-white font-hud font-bold text-xs shadow-lg cursor-pointer transition-all uppercase"
            >
              {t.submitCreate}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
