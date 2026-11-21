import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { X, Plus, Compass, Sparkles, Car, FileText } from 'lucide-react';
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
  const { addMission, addCollectible, addVehicle, addNote } = useGame();
  const [selectedType, setSelectedType] = useState<NewItemModalType>(defaultType);

  // Mission state
  const [missionTitle, setMissionTitle] = useState('');
  const [missionType, setMissionType] = useState<MissionType>('main');
  const [missionDistrict, setMissionDistrict] = useState('Ocean Boulevard');
  const [missionGiver, setMissionGiver] = useState('');
  const [missionDesc, setMissionDesc] = useState('');
  const [missionStepsText, setMissionStepsText] = useState('');
  const [missionXp, setMissionXp] = useState('1000');
  const [missionCredits, setMissionCredits] = useState('3000');

  // Collectible state
  const [collectibleName, setCollectibleName] = useState('');
  const [collectibleCat, setCollectibleCat] = useState<CollectibleCategory>('relic');
  const [collectibleDistrict, setCollectibleDistrict] = useState('Port Marina');
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
  const [noteTags, setNoteTags] = useState('tactique');

  useEffect(() => {
    if (isOpen) {
      setSelectedType(defaultType);
    }
  }, [isOpen, defaultType]);

  const resetForms = () => {
    setMissionTitle('');
    setMissionType('main');
    setMissionDistrict('Ocean Boulevard');
    setMissionGiver('');
    setMissionDesc('');
    setMissionStepsText('');
    setMissionXp('1000');
    setMissionCredits('3000');

    setCollectibleName('');
    setCollectibleCat('relic');
    setCollectibleDistrict('Port Marina');
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
    setNoteTags('tactique');
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
        district: missionDistrict.trim() || 'Secteur libre',
        giver: missionGiver.trim() || 'Inconnu',
        description: missionDesc.trim() || 'Objectif personnalisé.',
        rewardXp: Math.max(0, Number(missionXp) || 0),
        rewardCredits: Math.max(0, Number(missionCredits) || 0),
        status: 'available',
        steps:
          customSteps.length > 0
            ? customSteps
            : [
                { id: `s_${Date.now()}_1`, text: 'Atteindre le lieu indiqué', completed: false },
                { id: `s_${Date.now()}_2`, text: 'Accomplir l’objectif principal', completed: false },
              ],
      });
    } else if (selectedType === 'collectible') {
      if (!collectibleName.trim()) return;
      addCollectible({
        name: collectibleName.trim(),
        category: collectibleCat,
        district: collectibleDistrict.trim() || 'Secteur libre',
        hint: collectibleHint.trim() || 'Indice à compléter',
        coordinates: collectibleCoords.trim() || 'X: 0.0 | Y: 0.0',
        collected: false,
      });
    } else if (selectedType === 'vehicle') {
      if (!vehicleName.trim()) return;
      addVehicle({
        name: vehicleName.trim(),
        manufacturer: vehicleManufacturer.trim() || 'Custom',
        category: vehicleCat,
        speed: clampStat(vehicleSpeed, 75),
        handling: clampStat(vehicleHandling, 70),
        armor: clampStat(vehicleArmor, 50),
        unlocked: true,
        location: vehicleLoc.trim() || 'Garage personnel',
        isFavorite: false,
        imageUrl: vehicleImageUrl.trim() || undefined,
      });
    } else if (selectedType === 'note') {
      if (!noteTitle.trim()) return;
      addNote({
        title: noteTitle.trim(),
        content: noteContent.trim(),
        tags: noteTags
          .split(',')
          .map((t) => t.trim())
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
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#00f0ff]" />
            <h2 className="font-hud font-bold text-lg text-white">AJOUTER UNE ENTRÉE</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type selector tabs */}
        <div className="grid grid-cols-4 p-2 bg-[#0e0320] border-b border-[#ff2a85]/25 gap-1">
          <button
            type="button"
            onClick={() => setSelectedType('mission')}
            className={`py-2 px-1 text-center rounded-lg text-xs font-hud transition-colors cursor-pointer flex flex-col items-center gap-1 ${
              selectedType === 'mission'
                ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/50'
                : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Mission</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedType('collectible')}
            className={`py-2 px-1 text-center rounded-lg text-xs font-hud transition-colors cursor-pointer flex flex-col items-center gap-1 ${
              selectedType === 'collectible'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Collectible</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedType('vehicle')}
            className={`py-2 px-1 text-center rounded-lg text-xs font-hud transition-colors cursor-pointer flex flex-col items-center gap-1 ${
              selectedType === 'vehicle'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Véhicule</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedType('note')}
            className={`py-2 px-1 text-center rounded-lg text-xs font-hud transition-colors cursor-pointer flex flex-col items-center gap-1 ${
              selectedType === 'note'
                ? 'bg-[#ff2a85]/20 text-[#ff2a85] border border-[#ff2a85]/50'
                : 'text-slate-400 hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Note</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {selectedType === 'mission' && (
            <>
              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  Titre de la mission *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Infiltration du Port Industriel"
                  value={missionTitle}
                  onChange={(e) => setMissionTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">Type</label>
                  <select
                    value={missionType}
                    onChange={(e) => setMissionType(e.target.value as MissionType)}
                    className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                  >
                    <option value="main">Principale</option>
                    <option value="side">Secondaire</option>
                    <option value="bounty">Contrat / Prime</option>
                    <option value="activity">Activité</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    Quartier / District
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
                  Donneur d’ordre
                </label>
                <input
                  type="text"
                  placeholder="ex: Elena Vance, Marco Reyes..."
                  value={missionGiver}
                  onChange={(e) => setMissionGiver(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  Description / Briefing
                </label>
                <textarea
                  rows={2}
                  placeholder="Détails tactiques de l'objectif..."
                  value={missionDesc}
                  onChange={(e) => setMissionDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  Étapes (optionnel, 1 par ligne)
                </label>
                <textarea
                  rows={2}
                  placeholder="Rejoindre le point de rendez-vous&#10;Récupérer la clé d'accès"
                  value={missionStepsText}
                  onChange={(e) => setMissionStepsText(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-xs font-mono-code text-slate-100 focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    Récompense XP
                  </label>
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
                    Crédits (Cr)
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
                  Nom de l&apos;objet *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Puce cryptée #07"
                  value={collectibleName}
                  onChange={(e) => setCollectibleName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={collectibleCat}
                    onChange={(e) => setCollectibleCat(e.target.value as CollectibleCategory)}
                    className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="relic">Relique</option>
                    <option value="cache">Cache Secrète</option>
                    <option value="audio_log">Journal Audio</option>
                    <option value="blueprint">Plan d&apos;arme</option>
                    <option value="easter_egg">Secret / Easter Egg</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    Quartier / Région
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
                  Indice de localisation
                </label>
                <input
                  type="text"
                  placeholder="ex: Sous la passerelle métallique près de l'ascenseur"
                  value={collectibleHint}
                  onChange={(e) => setCollectibleHint(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  Coordonnées GPS
                </label>
                <input
                  type="text"
                  placeholder="ex: X: 312.4 | Y: 184.2"
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
                  Nom du modèle *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Solaris Apex GT"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    Constructeur
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Solaris Motors"
                    value={vehicleManufacturer}
                    onChange={(e) => setVehicleManufacturer(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">Type</label>
                  <select
                    value={vehicleCat}
                    onChange={(e) => setVehicleCat(e.target.value as VehicleCategory)}
                    className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="car">Voiture</option>
                    <option value="sport">Sportive</option>
                    <option value="muscle">Muscle / Coupé</option>
                    <option value="moto">Moto</option>
                    <option value="offroad">Tout-terrain (4x4)</option>
                    <option value="special">Véhicule spécial</option>
                    <option value="heavy">Lourd / Blindé</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono-code text-slate-300 mb-1">
                    Vitesse (1-100)
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
                    Maniabilité
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
                    Blindage
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
                  Lieu de déblocage
                </label>
                <input
                  type="text"
                  placeholder="ex: Hangar côtier près du phare"
                  value={vehicleLoc}
                  onChange={(e) => setVehicleLoc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  Image personnalisée (URL optionnelle)
                </label>
                <input
                  type="url"
                  placeholder="Laisser vide pour le visuel studio de la catégorie"
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
                  Titre de la note *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Code porte laboratoire secret"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-[#ff2a85]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  Contenu / Code
                </label>
                <textarea
                  rows={4}
                  placeholder="Tapez vos notes tactiques, codes, indices..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0e0320] border border-[#ff2a85]/35 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-[#ff2a85] font-mono-code"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-slate-300 mb-1">
                  Tags (séparés par des virgules)
                </label>
                <input
                  type="text"
                  placeholder="ex: codes, boss, secret"
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
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] hover:brightness-110 text-white font-hud font-bold text-xs shadow-lg cursor-pointer transition-all"
            >
              ENREGISTRER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
