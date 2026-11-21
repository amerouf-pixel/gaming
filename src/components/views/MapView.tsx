import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { useLocale } from '../../context/LocaleContext';
import { MapMarkerCategory } from '../../types';
import { cyberAudio } from '../../utils/cyberAudio';
import { isValidImageUrl } from '../../utils/vehicleVisuals';
import {
  Map,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Plus,
  Trash2,
  Compass,
  Sparkles,
  Car,
  Trophy,
  MapPin,
  Upload,
  Link2,
  Info,
  CheckCircle2,
  X,
  Crosshair,
} from 'lucide-react';

interface UnifiedPin {
  id: string;
  sourceId: string;
  sourceType: 'mission' | 'collectible' | 'vehicle' | 'objective' | 'custom';
  category: MapMarkerCategory;
  title: string;
  subtitle: string;
  district: string;
  x: number;
  y: number;
  completed?: boolean;
}

const DISTRICT_ANCHORS: Record<string, { x: number; y: number }> = {
  'Port Marina': { x: 24, y: 66 },
  'Boulevard Côtier': { x: 48, y: 36 },
  'Avenue Néon': { x: 64, y: 48 },
  'Îlot du Phare': { x: 78, y: 74 },
  'Jetée Centrale': { x: 35, y: 72 },
  'Quartier des Palmiers': { x: 54, y: 24 },
};

function parseCoordinatesToPercent(coords?: string): { x: number; y: number } | null {
  if (!coords) return null;
  const match = coords.match(/X:\s*([0-9.]+)\s*\|\s*Y:\s*([0-9.]+)/i);
  if (!match) return null;
  const rawX = Number(match[1]);
  const rawY = Number(match[2]);
  if (!Number.isFinite(rawX) || !Number.isFinite(rawY)) return null;
  const x = Math.max(8, Math.min(92, (rawX / 600) * 100));
  const y = Math.max(8, Math.min(92, (rawY / 500) * 100));
  return { x, y };
}

function deterministicPosition(seed: string, district?: string): { x: number; y: number } {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 10000;
  }
  const anchor = district ? DISTRICT_ANCHORS[district] : undefined;
  if (anchor) {
    const dx = ((hash % 15) - 7) * 1.1;
    const dy = (((Math.floor(hash / 17)) % 15) - 7) * 1.1;
    return {
      x: Math.max(8, Math.min(92, anchor.x + dx)),
      y: Math.max(8, Math.min(92, anchor.y + dy)),
    };
  }
  return {
    x: 12 + (hash % 76),
    y: 12 + ((Math.floor(hash / 13)) % 76),
  };
}

export const MapView: React.FC = () => {
  const {
    missions,
    collectibles,
    vehicles,
    objectives,
    mapMarkers,
    addMapMarker,
    deleteMapMarker,
    customMapUrl,
    setCustomMapUrl,
    toggleCollectible,
    openProgressionTab,
    setCurrentTab,
    activeProfile,
  } = useGame();

  const { locale, appCopy } = useLocale();
  const t = appCopy.map;

  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  // Layer filters
  const [filters, setFilters] = useState<Record<MapMarkerCategory, boolean>>({
    mission: true,
    collectible: true,
    vehicle: true,
    objective: true,
    poi: true,
  });

  // Marker placement mode & selected marker
  const [placementMode, setPlacementMode] = useState(false);
  const [pendingPoint, setPendingPoint] = useState<{ x: number; y: number } | null>(null);
  const [newMarkerTitle, setNewMarkerTitle] = useState('');
  const [newMarkerCategory, setNewMarkerCategory] = useState<MapMarkerCategory>('poi');
  const [newMarkerDistrict, setNewMarkerDistrict] = useState('');
  const [newMarkerDesc, setNewMarkerDesc] = useState('');

  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  // Custom map background panel
  const [showMapSourcePanel, setShowMapSourcePanel] = useState(false);
  const [mapUrlInput, setMapUrlInput] = useState(customMapUrl);
  const [mapOpacity, setMapOpacity] = useState(85);
  const [mapUploadError, setMapUploadError] = useState<string | null>(null);

  // Sync custom map input when switching game profiles
  useEffect(() => {
    setMapUrlInput(customMapUrl);
    setSelectedPinId(null);
    setPendingPoint(null);
  }, [customMapUrl, activeProfile.id]);

  // Build unified pins from real data + user custom markers
  const allPins = useMemo<UnifiedPin[]>(() => {
    const list: UnifiedPin[] = [];

    missions.forEach((m) => {
      const pos = deterministicPosition(m.id, m.district);
      const statusText =
        m.status === 'completed'
          ? appCopy.missions.statusCompleted
          : m.status === 'in_progress'
          ? appCopy.missions.statusInProgress
          : appCopy.missions.statusAvailable;
      list.push({
        id: `pin_m_${m.id}`,
        sourceId: m.id,
        sourceType: 'mission',
        category: 'mission',
        title: m.title,
        subtitle: `${statusText} · +${m.rewardCredits} Cr`,
        district: m.district,
        x: pos.x,
        y: pos.y,
        completed: m.status === 'completed',
      });
    });

    collectibles.forEach((c) => {
      const pos = parseCoordinatesToPercent(c.coordinates) || deterministicPosition(c.id, c.district);
      list.push({
        id: `pin_c_${c.id}`,
        sourceId: c.id,
        sourceType: 'collectible',
        category: 'collectible',
        title: c.name,
        subtitle: c.hint,
        district: c.district,
        x: pos.x,
        y: pos.y,
        completed: c.collected,
      });
    });

    vehicles.forEach((v) => {
      const pos = deterministicPosition(v.id, v.location.split('(')[0]?.trim());
      list.push({
        id: `pin_v_${v.id}`,
        sourceId: v.id,
        sourceType: 'vehicle',
        category: 'vehicle',
        title: v.name,
        subtitle: `${v.unlocked ? appCopy.common.unlocked : appCopy.common.locked} · ${v.location}`,
        district: v.location,
        x: pos.x,
        y: pos.y,
        completed: v.unlocked,
      });
    });

    objectives.forEach((o) => {
      const pos = deterministicPosition(o.id);
      list.push({
        id: `pin_o_${o.id}`,
        sourceId: o.id,
        sourceType: 'objective',
        category: 'objective',
        title: o.title,
        subtitle: `${o.progress}/${o.maxProgress} · ${o.category}`,
        district: o.category,
        x: pos.x,
        y: pos.y,
        completed: o.completed,
      });
    });

    mapMarkers.forEach((mk) => {
      list.push({
        id: `pin_u_${mk.id}`,
        sourceId: mk.id,
        sourceType: 'custom',
        category: mk.category,
        title: mk.title,
        subtitle: mk.description || (locale === 'fr' ? 'Repère personnalisé' : 'Custom pin'),
        district: mk.district || (locale === 'fr' ? 'Repère libre' : 'Custom zone'),
        x: mk.x,
        y: mk.y,
      });
    });

    return list;
  }, [missions, collectibles, vehicles, objectives, mapMarkers, appCopy, locale]);

  const visiblePins = useMemo(
    () => allPins.filter((p) => filters[p.category]),
    [allPins, filters]
  );

  const selectedPin = useMemo(
    () => allPins.find((p) => p.id === selectedPinId) || null,
    [allPins, selectedPinId]
  );

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.max(1, Math.min(2.6, Number((prev + delta).toFixed(2)))));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (placementMode) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: Math.max(-420, Math.min(420, dragStartRef.current.panX + dx)),
      y: Math.max(-320, Math.min(320, dragStartRef.current.panY + dy)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleMapSurfaceClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!placementMode || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    setPendingPoint({
      x: Math.max(2, Math.min(98, Number(xPct.toFixed(1)))),
      y: Math.max(2, Math.min(98, Number(yPct.toFixed(1)))),
    });
    cyberAudio.playClick();
  };

  const handleSaveNewMarker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingPoint || !newMarkerTitle.trim()) return;
    addMapMarker({
      title: newMarkerTitle.trim(),
      category: newMarkerCategory,
      x: pendingPoint.x,
      y: pendingPoint.y,
      district: newMarkerDistrict.trim() || undefined,
      description: newMarkerDesc.trim() || undefined,
    });
    cyberAudio.playChirp();
    setPendingPoint(null);
    setNewMarkerTitle('');
    setNewMarkerDistrict('');
    setNewMarkerDesc('');
    setPlacementMode(false);
  };

  const handleUploadCustomMapFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMapUploadError(null);
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      setMapUploadError(t.invalidMapUrl);
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setMapUploadError(
        locale === 'fr'
          ? 'Image trop lourde (> 3 Mo). Compressez-la ou utilisez une URL directe.'
          : 'Image exceeds 3 MB limit. Compress it or use a direct HTTPS URL.'
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomMapUrl(reader.result);
        setMapUrlInput(reader.result);
      }
    };
    reader.onerror = () =>
      setMapUploadError(
        locale === 'fr' ? 'Impossible de lire le fichier image.' : 'Unable to read image file.'
      );
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const getPinStyle = (category: MapMarkerCategory, completed?: boolean) => {
    if (completed) {
      return 'bg-emerald-500/90 border-emerald-200 text-slate-950';
    }
    switch (category) {
      case 'mission':
        return 'bg-[#ff2a85] border-white text-white';
      case 'collectible':
        return 'bg-amber-400 border-amber-100 text-slate-950';
      case 'vehicle':
        return 'bg-emerald-400 border-emerald-100 text-slate-950';
      case 'objective':
        return 'bg-purple-500 border-purple-200 text-white';
      case 'poi':
      default:
        return 'bg-[#00f0ff] border-white text-[#120428]';
    }
  };

  const getCategoryIcon = (category: MapMarkerCategory) => {
    switch (category) {
      case 'mission':
        return <Compass className="w-3.5 h-3.5" />;
      case 'collectible':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'vehicle':
        return <Car className="w-3.5 h-3.5" />;
      case 'objective':
        return <Trophy className="w-3.5 h-3.5" />;
      default:
        return <MapPin className="w-3.5 h-3.5" />;
    }
  };

  const filterMeta: { id: MapMarkerCategory; label: string; color: string; count: number }[] = [
    {
      id: 'mission',
      label: t.catMission,
      color: 'text-[#ff2a85]',
      count: allPins.filter((p) => p.category === 'mission').length,
    },
    {
      id: 'collectible',
      label: t.catCollectible,
      color: 'text-amber-400',
      count: allPins.filter((p) => p.category === 'collectible').length,
    },
    {
      id: 'vehicle',
      label: t.catVehicle,
      color: 'text-emerald-400',
      count: allPins.filter((p) => p.category === 'vehicle').length,
    },
    {
      id: 'objective',
      label: t.catObjective,
      color: 'text-purple-400',
      count: allPins.filter((p) => p.category === 'objective').length,
    },
    {
      id: 'poi',
      label: t.catPoi,
      color: 'text-[#00f0ff]',
      count: allPins.filter((p) => p.category === 'poi').length,
    },
  ];

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Map className="w-6 h-6 text-[#00f0ff]" />
            <h1 className="text-2xl font-bold font-hud text-white uppercase tracking-wide">
              {t.title}
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            {t.subtitle} ·{' '}
            <span className="text-[#00f0ff] font-medium">
              {activeProfile.name} ({activeProfile.universe})
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              cyberAudio.playClick();
              setPlacementMode((prev) => !prev);
              setPendingPoint(null);
            }}
            className={`px-3.5 py-2 text-xs font-hud font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${
              placementMode
                ? 'bg-[#ff2a85] text-white shadow-[0_0_16px_rgba(255,42,133,0.45)]'
                : 'bg-[#00f0ff] hover:bg-[#4ff6ff] text-[#120428]'
            }`}
          >
            {placementMode ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{placementMode ? appCopy.common.cancel : t.addMarkerTitle}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMapSourcePanel((prev) => !prev)}
            className="px-3.5 py-2 jitalx-panel text-xs font-hud font-bold uppercase text-slate-200 hover:text-[#00f0ff] flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#ff7b00]" />
            <span>{t.uploadCustomMap}</span>
          </button>
        </div>
      </div>

      {/* Multi-Game Neutral Notice */}
      <div className="p-3 jitalx-panel-deep text-xs text-slate-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
        <span>{t.multiGameMapNote}</span>
      </div>

      {/* Custom Map Source Loader */}
      {showMapSourcePanel && (
        <div className="jitalx-panel p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-hud font-bold text-sm text-white uppercase">
              {t.uploadCustomMap} ({activeProfile.name})
            </h2>
            <button
              type="button"
              onClick={() => setShowMapSourcePanel(false)}
              className="text-slate-400 hover:text-white cursor-pointer"
              aria-label={appCopy.common.close}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-7">
              <label className="block text-[11px] font-mono-code text-slate-300 mb-1">
                {t.mapUrlPlaceholder}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={mapUrlInput}
                  onChange={(e) => setMapUrlInput(e.target.value)}
                  placeholder="https://example.com/game-map.png"
                  className="flex-1 jitalx-input px-3 py-2 text-xs font-mono-code"
                />
                <button
                  type="button"
                  onClick={() => {
                    const trimmed = mapUrlInput.trim();
                    if (!trimmed) {
                      setCustomMapUrl('');
                      setMapUploadError(null);
                      return;
                    }
                    if (!isValidImageUrl(trimmed)) {
                      setMapUploadError(t.invalidMapUrl);
                      return;
                    }
                    setMapUploadError(null);
                    setCustomMapUrl(trimmed);
                  }}
                  className="px-3 py-2 bg-[#00f0ff] text-[#120428] text-xs font-hud font-bold uppercase cursor-pointer flex items-center gap-1"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>{t.applyMapUrl}</span>
                </button>
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="w-full py-2 px-3 bg-[#0b021a] hover:bg-[#1b0838] border border-[#ff2a85]/45 text-xs font-mono-code text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-[#ff7b00]" />
                <span>{t.uploadCustomMap}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleUploadCustomMapFile}
                  className="hidden"
                />
              </label>
            </div>

            <div className="md:col-span-2">
              {customMapUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomMapUrl('');
                    setMapUrlInput('');
                  }}
                  className="w-full py-2 px-3 bg-rose-950/40 border border-rose-500/40 text-xs font-mono-code text-rose-300 hover:bg-rose-900/40 cursor-pointer"
                >
                  {t.resetMapLayer}
                </button>
              )}
            </div>
          </div>

          {customMapUrl && (
            <div className="flex items-center gap-3 text-xs font-mono-code text-slate-300">
              <span>{locale === 'fr' ? 'Opacité du fond :' : 'Map opacity:'}</span>
              <input
                type="range"
                min={25}
                max={100}
                value={mapOpacity}
                onChange={(e) => setMapOpacity(Number(e.target.value))}
                className="accent-[#00f0ff]"
              />
              <span className="tabular-nums text-[#00f0ff]">{mapOpacity}%</span>
            </div>
          )}

          {mapUploadError && (
            <div className="text-xs text-rose-300 font-mono-code">{mapUploadError}</div>
          )}
        </div>
      )}

      {/* Filter Bar + Zoom Controls */}
      <div className="jitalx-panel p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {filterMeta.map((f) => {
            const active = filters[f.id];
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  cyberAudio.playClick();
                  setFilters((prev) => ({ ...prev, [f.id]: !prev[f.id] }));
                }}
                className={`px-3 py-1.5 text-xs font-mono-code border cursor-pointer transition-colors flex items-center gap-1.5 ${
                  active
                    ? 'bg-white/10 border-[#00f0ff]/55 text-white'
                    : 'bg-[#0b021a] border-white/10 text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className={active ? f.color : 'text-slate-600'}>{getCategoryIcon(f.id)}</span>
                <span>{f.label}</span>
                <span className="tabular-nums text-[10px] opacity-75">({f.count})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleZoom(-0.25)}
            className="p-2 bg-[#0b021a] border border-white/15 text-slate-200 hover:text-[#00f0ff] cursor-pointer"
            title="Dézoomer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="px-2.5 text-xs font-mono-code text-[#00f0ff] tabular-nums min-w-[56px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => handleZoom(0.25)}
            className="p-2 bg-[#0b021a] border border-white/15 text-slate-200 hover:text-[#00f0ff] cursor-pointer"
            title="Zoomer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetView}
            className="p-2 bg-[#0b021a] border border-white/15 text-slate-300 hover:text-white cursor-pointer"
            title="Réinitialiser la vue"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Split: Large Interactive Map Surface (9 cols) + Legend & Inspector (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* MAP VIEWPORT */}
        <div className="lg:col-span-9 jitalx-panel p-2 relative overflow-hidden">
          {placementMode && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-[#ff2a85] text-white text-xs font-hud font-bold uppercase tracking-wider shadow-lg flex items-center gap-2">
              <Crosshair className="w-4 h-4" />
              <span>{t.clickToPlaceHint}</span>
            </div>
          )}

          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={(e) => {
              if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                handleZoom(e.deltaY < 0 ? 0.15 : -0.15);
              }
            }}
            className={`relative w-full h-[460px] sm:h-[580px] overflow-hidden bg-[#070212] border border-white/10 ${
              placementMode
                ? 'cursor-crosshair'
                : isDragging
                ? 'cursor-grabbing'
                : 'cursor-grab'
            }`}
          >
            {/* Transformable Map Layer */}
            <div
              ref={canvasRef}
              onClick={handleMapSurfaceClick}
              className="w-full h-full relative origin-center transition-transform duration-100"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              }}
            >
              {/* User Supplied Map Image Layer OR Default Customizable Tactical Grid */}
              {customMapUrl && isValidImageUrl(customMapUrl) ? (
                <img
                  src={customMapUrl}
                  alt="Carte personnalisée importée par l'utilisateur"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                  style={{ opacity: mapOpacity / 100 }}
                />
              ) : (
                <svg
                  viewBox="0 0 1000 650"
                  className="absolute inset-0 w-full h-full pointer-events-none select-none"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <pattern id="jitalxGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path
                        d="M 50 0 L 0 0 0 50"
                        fill="none"
                        stroke="rgba(0, 240, 255, 0.12)"
                        strokeWidth="1"
                      />
                    </pattern>
                    <radialGradient id="bayGlow" cx="50%" cy="50%" r="60%">
                      <stop offset="0%" stopColor="rgba(255, 42, 133, 0.14)" />
                      <stop offset="60%" stopColor="rgba(0, 240, 255, 0.05)" />
                      <stop offset="100%" stopColor="rgba(7, 2, 18, 0.0)" />
                    </radialGradient>
                  </defs>
                  <rect width="1000" height="650" fill="url(#jitalxGrid)" />
                  <rect width="1000" height="650" fill="url(#bayGlow)" />

                  {/* Stylized abstract sector contours (fictional demo grid, never an official map) */}
                  <path
                    d="M 110 120 L 420 95 L 680 140 L 870 260 L 820 490 L 560 545 L 220 510 L 130 350 Z"
                    fill="rgba(255, 42, 133, 0.06)"
                    stroke="rgba(255, 42, 133, 0.35)"
                    strokeWidth="2"
                  />
                  <path
                    d="M 210 210 L 540 190 L 720 310 L 630 450 L 310 430 Z"
                    fill="rgba(0, 240, 255, 0.04)"
                    stroke="rgba(0, 240, 255, 0.25)"
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                  />
                  <line
                    x1="150"
                    y1="330"
                    x2="860"
                    y2="330"
                    stroke="rgba(255, 123, 0, 0.25)"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="490"
                    y1="90"
                    x2="490"
                    y2="560"
                    stroke="rgba(255, 123, 0, 0.25)"
                    strokeWidth="1.5"
                  />

                  {/* Sector Labels */}
                  {Object.entries(DISTRICT_ANCHORS).map(([name, pos]) => (
                    <text
                      key={name}
                      x={pos.x * 10}
                      y={pos.y * 6.5}
                      fill="rgba(226, 232, 240, 0.45)"
                      fontSize="13"
                      fontFamily="JetBrains Mono, monospace"
                      textAnchor="middle"
                    >
                      {name.toUpperCase()}
                    </text>
                  ))}
                </svg>
              )}

              {/* Plotted Markers */}
              {visiblePins.map((pin) => {
                const isSelected = selectedPinId === pin.id;
                return (
                  <button
                    key={pin.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      cyberAudio.playClick();
                      setSelectedPinId(pin.id);
                    }}
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform cursor-pointer ${getPinStyle(
                      pin.category,
                      pin.completed
                    )} ${isSelected ? 'scale-125 ring-4 ring-[#00f0ff]/45 z-30' : 'hover:scale-110'}`}
                    title={`${pin.title} (${pin.district})`}
                  >
                    {getCategoryIcon(pin.category)}
                  </button>
                );
              })}

              {/* Pending placement marker preview */}
              {pendingPoint && (
                <div
                  style={{ left: `${pendingPoint.x}%`, top: `${pendingPoint.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full border-2 border-white bg-[#ff2a85] flex items-center justify-center shadow-[0_0_18px_#ff2a85]"
                >
                  <Plus className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Map Coordinates Footer Overlay */}
            <div className="absolute bottom-3 left-3 z-20 px-2.5 py-1 bg-[#120428]/90 border border-white/15 text-[10px] font-mono-code text-slate-300 tabular-nums pointer-events-none">
              {visiblePins.length} {locale === 'fr' ? 'repères affichés · Glisser pour déplacer' : 'pins visible · Drag to pan'} · Zoom {Math.round(zoom * 100)}%
            </div>
          </div>
        </div>

        {/* RIGHT INSPECTOR & MARKER CREATION PANEL (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* New Marker Form when point selected */}
          {pendingPoint && (
            <form onSubmit={handleSaveNewMarker} className="jitalx-panel p-4 space-y-3 border-[#ff2a85]/60">
              <div className="flex items-center justify-between">
                <span className="font-hud font-bold text-xs uppercase text-[#00f0ff]">
                  {t.addMarkerTitle} ({pendingPoint.x}%, {pendingPoint.y}%)
                </span>
                <button
                  type="button"
                  onClick={() => setPendingPoint(null)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                required
                placeholder={t.markerNamePlaceholder}
                value={newMarkerTitle}
                onChange={(e) => setNewMarkerTitle(e.target.value)}
                className="w-full jitalx-input px-2.5 py-1.5 text-xs"
              />
              <select
                value={newMarkerCategory}
                onChange={(e) => setNewMarkerCategory(e.target.value as MapMarkerCategory)}
                className="w-full jitalx-input px-2.5 py-1.5 text-xs"
              >
                <option value="poi">{t.catPoi}</option>
                <option value="mission">{t.catMission}</option>
                <option value="collectible">{t.catCollectible}</option>
                <option value="vehicle">{t.catVehicle}</option>
                <option value="objective">{t.catObjective}</option>
              </select>
              <input
                type="text"
                placeholder={t.markerDistrictPlaceholder}
                value={newMarkerDistrict}
                onChange={(e) => setNewMarkerDistrict(e.target.value)}
                className="w-full jitalx-input px-2.5 py-1.5 text-xs"
              />
              <textarea
                rows={2}
                placeholder={t.markerDescPlaceholder}
                value={newMarkerDesc}
                onChange={(e) => setNewMarkerDesc(e.target.value)}
                className="w-full jitalx-input px-2.5 py-1.5 text-xs"
              />
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] text-white text-xs font-hud font-bold uppercase cursor-pointer"
              >
                {t.placeMarkerBtn}
              </button>
            </form>
          )}

          {/* Selected Marker Inspector */}
          <div className="jitalx-panel p-4 space-y-3">
            <div className="text-xs font-hud font-bold uppercase text-slate-300 border-b border-white/10 pb-2">
              {locale === 'fr' ? 'Détails du marqueur' : 'Marker Inspector'}
            </div>

            {selectedPin ? (
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 ${getPinStyle(
                      selectedPin.category,
                      selectedPin.completed
                    )}`}
                  >
                    {getCategoryIcon(selectedPin.category)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-hud font-bold text-sm text-white leading-snug">
                      {selectedPin.title}
                    </div>
                    <div className="text-[11px] font-mono-code text-[#00f0ff] mt-0.5">
                      {selectedPin.district}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-[#0b021a] p-2.5 border border-white/5">
                  {selectedPin.subtitle}
                </p>

                <div className="text-[10px] font-mono-code text-slate-400 tabular-nums">
                  {locale === 'fr' ? 'Position grille' : 'Grid position'}: X {selectedPin.x.toFixed(1)}% · Y {selectedPin.y.toFixed(1)}%
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedPin.sourceType === 'collectible' && (
                    <button
                      type="button"
                      onClick={() => {
                        cyberAudio.playFanfare();
                        toggleCollectible(selectedPin.sourceId);
                      }}
                      className="flex-1 py-1.5 px-2.5 bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-hud font-bold uppercase flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {selectedPin.completed
                          ? locale === 'fr'
                            ? 'Décocher'
                            : 'Uncheck'
                          : locale === 'fr'
                          ? 'Collecter'
                          : 'Collect'}
                      </span>
                    </button>
                  )}

                  {selectedPin.sourceType === 'mission' && (
                    <button
                      type="button"
                      onClick={() => openProgressionTab('missions')}
                      className="flex-1 py-1.5 px-2.5 bg-[#00f0ff]/15 border border-[#00f0ff]/50 text-[#00f0ff] text-xs font-hud font-bold uppercase cursor-pointer"
                    >
                      {appCopy.home.openMissions}
                    </button>
                  )}

                  {selectedPin.sourceType === 'vehicle' && (
                    <button
                      type="button"
                      onClick={() => setCurrentTab('garage')}
                      className="flex-1 py-1.5 px-2.5 bg-emerald-500/15 border border-emerald-400/50 text-emerald-300 text-xs font-hud font-bold uppercase cursor-pointer"
                    >
                      {appCopy.nav.garage}
                    </button>
                  )}

                  {selectedPin.sourceType === 'objective' && (
                    <button
                      type="button"
                      onClick={() => openProgressionTab('objectives')}
                      className="flex-1 py-1.5 px-2.5 bg-purple-500/15 border border-purple-400/50 text-purple-300 text-xs font-hud font-bold uppercase cursor-pointer"
                    >
                      {appCopy.progression.tabObjectives}
                    </button>
                  )}

                  {selectedPin.sourceType === 'custom' && (
                    <button
                      type="button"
                      onClick={() => {
                        deleteMapMarker(selectedPin.sourceId);
                        setSelectedPinId(null);
                      }}
                      className="flex-1 py-1.5 px-2.5 bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-hud font-bold uppercase flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{appCopy.common.delete}</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed">
                {locale === 'fr'
                  ? 'Cliquez sur un marqueur de la carte pour afficher ses détails ou activez « Placer un repère » pour ajouter vos emplacements.'
                  : 'Click any map marker to inspect details or enable "Place New Marker" to pin your own coordinates.'}
              </p>
            )}
          </div>

          {/* Legend */}
          <div className="jitalx-panel p-4 space-y-2">
            <div className="text-xs font-hud font-bold uppercase text-slate-300 border-b border-white/10 pb-2">
              {locale === 'fr' ? 'Légende' : 'Legend'}
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff2a85] border border-white inline-block" />
                <span>{t.catMission}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-100 inline-block" />
                <span>{t.catCollectible}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-100 inline-block" />
                <span>{t.catVehicle}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500 border border-purple-200 inline-block" />
                <span>{t.catObjective}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#00f0ff] border border-white inline-block" />
                <span>{t.catPoi}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
