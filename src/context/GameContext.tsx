import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  TabType,
  ProgressionSubTab,
  Mission,
  Collectible,
  Vehicle,
  Objective,
  TacticalNote,
  MapMarker,
  ActivityItem,
  ActivityType,
  GameProfile,
  UniverseTheme,
} from '../types';
import {
  INITIAL_PROFILES,
  INITIAL_MISSIONS,
  INITIAL_COLLECTIBLES,
  INITIAL_VEHICLES,
  INITIAL_OBJECTIVES,
  INITIAL_NOTES,
} from '../data/initialData';

interface GameContextType {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  progressionSubTab: ProgressionSubTab;
  setProgressionSubTab: (sub: ProgressionSubTab) => void;
  openProgressionTab: (sub: ProgressionSubTab) => void;
  profiles: GameProfile[];
  activeProfile: GameProfile;
  activeTheme: UniverseTheme;
  setActiveProfile: (profile: GameProfile) => void;
  setSyncedCustomProfiles: (customProfiles: GameProfile[]) => void;
  addLocalCustomProfile: (profile: Omit<GameProfile, 'id'>) => GameProfile;
  removeLocalCustomProfile: (id: string) => void;
  storageError: string | null;
  clearStorageError: () => void;
  // Missions
  missions: Mission[];
  toggleMissionStatus: (id: string) => void;
  toggleMissionStep: (missionId: string, stepId: string) => void;
  addMission: (mission: Omit<Mission, 'id'>) => void;
  updateMission: (id: string, updates: Partial<Omit<Mission, 'id'>>) => void;
  addMissionStep: (missionId: string, text: string) => void;
  removeMissionStep: (missionId: string, stepId: string) => void;
  deleteMission: (id: string) => void;
  // Collectibles
  collectibles: Collectible[];
  toggleCollectible: (id: string) => void;
  addCollectible: (item: Omit<Collectible, 'id'>) => void;
  updateCollectible: (id: string, updates: Partial<Omit<Collectible, 'id'>>) => void;
  deleteCollectible: (id: string) => void;
  // Vehicles
  vehicles: Vehicle[];
  toggleVehicleUnlocked: (id: string) => void;
  toggleVehicleFavorite: (id: string) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, updates: Partial<Omit<Vehicle, 'id'>>) => void;
  deleteVehicle: (id: string) => void;
  // Objectives
  objectives: Objective[];
  toggleObjective: (id: string) => void;
  stepObjectiveProgress: (id: string, delta: number) => void;
  addObjective: (objective: Omit<Objective, 'id'>) => void;
  updateObjective: (id: string, updates: Partial<Omit<Objective, 'id'>>) => void;
  deleteObjective: (id: string) => void;
  // Notes
  notes: TacticalNote[];
  addNote: (note: Omit<TacticalNote, 'id' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: { title: string; content: string; tags: string[] }) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  // Map markers & custom user map layer
  mapMarkers: MapMarker[];
  addMapMarker: (marker: Omit<MapMarker, 'id' | 'createdAt'>) => void;
  deleteMapMarker: (id: string) => void;
  customMapUrl: string;
  setCustomMapUrl: (url: string) => void;
  // Real Activity Log
  activityLog: ActivityItem[];
  // Stats
  sessionSeconds: number;
  overallProgress: number;
  stats: {
    missionsDone: number;
    missionsTotal: number;
    collectiblesDone: number;
    collectiblesTotal: number;
    vehiclesUnlocked: number;
    vehiclesTotal: number;
    objectivesDone: number;
    objectivesTotal: number;
  };
  // Actions
  resetAllData: () => void;
  exportBackup: () => void;
  importBackup: (jsonData: string) => { ok: boolean; error?: string };
  restoreSnapshotData: (snapshot: {
    missions: Mission[];
    collectibles: Collectible[];
    vehicles: Vehicle[];
    objectives: Objective[];
    notes: TacticalNote[];
  }) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Clés localStorage conservées pour préserver toutes les sauvegardes existantes des utilisateurs
const STORAGE_KEY = 'neonos_data_v3';
const ACTIVE_PROFILE_KEY = 'neonos_active_profile_v2';
const CUSTOM_PROFILES_KEY = 'neonos_custom_profiles_v1';
const MAP_MARKERS_KEY = 'jitalx_map_markers_v1';
const CUSTOM_MAP_URL_KEY = 'jitalx_custom_map_url_v1';
const ACTIVITY_LOG_KEY = 'jitalx_activity_log_v1';

function readLocalArray<T>(key: string, fallback: T[]): T[] {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function formatNow(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

function formatNowFull(): string {
  return `Aujourd'hui, ${formatNow()}`;
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [progressionSubTab, setProgressionSubTab] = useState<ProgressionSubTab>('missions');
  const [storageError, setStorageError] = useState<string | null>(null);

  const openProgressionTab = useCallback((sub: ProgressionSubTab) => {
    setProgressionSubTab(sub);
    setCurrentTab('progression');
  }, []);

  const [localCustomProfiles, setLocalCustomProfiles] = useState<GameProfile[]>(() =>
    readLocalArray<GameProfile>(CUSTOM_PROFILES_KEY, [])
  );
  const [syncedCustomProfiles, setSyncedCustomProfiles] = useState<GameProfile[]>([]);

  const profiles = useMemo<GameProfile[]>(() => {
    const merged = [...INITIAL_PROFILES];
    const seen = new Set(merged.map((p) => p.id));
    for (const p of [...syncedCustomProfiles, ...localCustomProfiles]) {
      if (p && p.id && !seen.has(p.id)) {
        seen.add(p.id);
        merged.push({ ...p, isCustom: true });
      }
    }
    return merged;
  }, [syncedCustomProfiles, localCustomProfiles]);

  const [savedProfileId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ACTIVE_PROFILE_KEY);
    } catch {
      return null;
    }
  });

  const [activeProfile, setActiveProfileState] = useState<GameProfile>(() => {
    if (savedProfileId) {
      const initialLocal = readLocalArray<GameProfile>(CUSTOM_PROFILES_KEY, []);
      const allInitial = [...INITIAL_PROFILES, ...initialLocal];
      const match = allInitial.find((p) => p.id === savedProfileId);
      if (match) return match;
    }
    return INITIAL_PROFILES[0];
  });

  useEffect(() => {
    if (!savedProfileId) return;
    if (activeProfile.id === savedProfileId) return;
    const cloudMatch = syncedCustomProfiles.find((p) => p.id === savedProfileId);
    if (cloudMatch) {
      setActiveProfileState(cloudMatch);
    }
  }, [syncedCustomProfiles, savedProfileId, activeProfile.id]);

  const setActiveProfile = useCallback((profile: GameProfile) => {
    setActiveProfileState(profile);
    try {
      localStorage.setItem(ACTIVE_PROFILE_KEY, profile.id);
    } catch {
      setStorageError('Impossible d’enregistrer le profil actif dans le navigateur.');
    }
  }, []);

  const safePersist = useCallback((key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      setStorageError(
        'Stockage local indisponible ou saturé : exportez une sauvegarde JSON ou utilisez la sauvegarde Cloud.'
      );
    }
  }, []);

  useEffect(() => {
    safePersist(CUSTOM_PROFILES_KEY, localCustomProfiles);
  }, [localCustomProfiles, safePersist]);

  const addLocalCustomProfile = (profile: Omit<GameProfile, 'id'>): GameProfile => {
    const created: GameProfile = {
      ...profile,
      id: `local_prof_${Date.now()}`,
      isCustom: true,
    };
    setLocalCustomProfiles((prev) => [created, ...prev]);
    return created;
  };

  const removeLocalCustomProfile = (id: string) => {
    setLocalCustomProfiles((prev) => prev.filter((p) => p.id !== id));
    if (activeProfile.id === id) {
      setActiveProfile(INITIAL_PROFILES[0]);
    }
  };

  const activeTheme: UniverseTheme = activeProfile.theme || 'sunset-neon';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', activeTheme);
    }
  }, [activeTheme]);

  // Persisted domain datasets
  const [missions, setMissions] = useState<Mission[]>(() =>
    readLocalArray<Mission>(`${STORAGE_KEY}_missions`, INITIAL_MISSIONS)
  );
  const [collectibles, setCollectibles] = useState<Collectible[]>(() =>
    readLocalArray<Collectible>(`${STORAGE_KEY}_collectibles`, INITIAL_COLLECTIBLES)
  );
  const [vehicles, setVehicles] = useState<Vehicle[]>(() =>
    readLocalArray<Vehicle>(`${STORAGE_KEY}_vehicles`, INITIAL_VEHICLES)
  );
  const [objectives, setObjectives] = useState<Objective[]>(() =>
    readLocalArray<Objective>(`${STORAGE_KEY}_objectives`, INITIAL_OBJECTIVES)
  );
  const [notes, setNotes] = useState<TacticalNote[]>(() =>
    readLocalArray<TacticalNote>(`${STORAGE_KEY}_notes`, INITIAL_NOTES)
  );
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>(() =>
    readLocalArray<MapMarker>(MAP_MARKERS_KEY, [])
  );
  const [customMapUrl, setCustomMapUrlState] = useState<string>(() => {
    try {
      return localStorage.getItem(CUSTOM_MAP_URL_KEY) || '';
    } catch {
      return '';
    }
  });
  const [activityLog, setActivityLog] = useState<ActivityItem[]>(() =>
    readLocalArray<ActivityItem>(ACTIVITY_LOG_KEY, [])
  );

  const recordActivity = useCallback((type: ActivityType, label: string) => {
    const entry: ActivityItem = {
      id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type,
      label,
      timestamp: formatNowFull(),
    };
    setActivityLog((prev) => [entry, ...prev].slice(0, 20));
  }, []);

  const setCustomMapUrl = useCallback((url: string) => {
    const clean = url.trim();
    setCustomMapUrlState(clean);
    try {
      if (clean) {
        localStorage.setItem(CUSTOM_MAP_URL_KEY, clean);
      } else {
        localStorage.removeItem(CUSTOM_MAP_URL_KEY);
      }
    } catch {
      setStorageError(
        'Image de carte trop volumineuse pour le stockage local : utilisez une image plus légère ou une URL externe.'
      );
    }
  }, []);

  // Session timer
  const [sessionSeconds, setSessionSeconds] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Safe localStorage persistence
  useEffect(() => {
    safePersist(`${STORAGE_KEY}_missions`, missions);
  }, [missions, safePersist]);
  useEffect(() => {
    safePersist(`${STORAGE_KEY}_collectibles`, collectibles);
  }, [collectibles, safePersist]);
  useEffect(() => {
    safePersist(`${STORAGE_KEY}_vehicles`, vehicles);
  }, [vehicles, safePersist]);
  useEffect(() => {
    safePersist(`${STORAGE_KEY}_objectives`, objectives);
  }, [objectives, safePersist]);
  useEffect(() => {
    safePersist(`${STORAGE_KEY}_notes`, notes);
  }, [notes, safePersist]);
  useEffect(() => {
    safePersist(MAP_MARKERS_KEY, mapMarkers);
  }, [mapMarkers, safePersist]);
  useEffect(() => {
    safePersist(ACTIVITY_LOG_KEY, activityLog);
  }, [activityLog, safePersist]);

  // Mission handlers
  const toggleMissionStatus = (id: string) => {
    const target = missions.find((m) => m.id === id);
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const nextStatus =
          m.status === 'available'
            ? 'in_progress'
            : m.status === 'in_progress'
            ? 'completed'
            : 'available';
        const updatedSteps =
          nextStatus === 'completed'
            ? m.steps.map((s) => ({ ...s, completed: true }))
            : nextStatus === 'available'
            ? m.steps.map((s) => ({ ...s, completed: false }))
            : m.steps;
        return { ...m, status: nextStatus, steps: updatedSteps };
      })
    );
    if (target) {
      const nextLabel =
        target.status === 'available'
          ? 'en cours'
          : target.status === 'in_progress'
          ? 'terminée'
          : 'réouverte';
      recordActivity('mission', `Mission « ${target.title} » ${nextLabel}`);
    }
  };

  const toggleMissionStep = (missionId: string, stepId: string) => {
    const targetMission = missions.find((m) => m.id === missionId);
    const targetStep = targetMission?.steps.find((s) => s.id === stepId);
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== missionId) return m;
        const updatedSteps = m.steps.map((s) =>
          s.id === stepId ? { ...s, completed: !s.completed } : s
        );
        const completedCount = updatedSteps.filter((s) => s.completed).length;
        const allDone = updatedSteps.length > 0 && completedCount === updatedSteps.length;
        const nextStatus = allDone
          ? 'completed'
          : completedCount > 0
          ? 'in_progress'
          : 'available';
        return {
          ...m,
          steps: updatedSteps,
          status: nextStatus,
        };
      })
    );
    if (targetMission && targetStep) {
      recordActivity(
        'mission',
        `${!targetStep.completed ? 'Étape validée' : 'Étape décochée'} · ${targetMission.title}`
      );
    }
  };

  const addMission = (newMission: Omit<Mission, 'id'>) => {
    const id = `m_${Date.now()}`;
    setMissions((prev) => [{ ...newMission, id }, ...prev]);
    recordActivity('mission', `Mission ajoutée : ${newMission.title}`);
  };

  const updateMission = (id: string, updates: Partial<Omit<Mission, 'id'>>) => {
    setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    if (updates.title) {
      recordActivity('mission', `Mission modifiée : ${updates.title}`);
    }
  };

  const addMissionStep = (missionId: string, text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== missionId) return m;
        const updatedSteps = [...m.steps, { id: `s_${Date.now()}`, text: clean, completed: false }];
        const completedCount = updatedSteps.filter((s) => s.completed).length;
        return {
          ...m,
          steps: updatedSteps,
          status: completedCount > 0 ? 'in_progress' : m.status === 'completed' ? 'available' : m.status,
        };
      })
    );
  };

  const removeMissionStep = (missionId: string, stepId: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== missionId) return m;
        const updatedSteps = m.steps.filter((s) => s.id !== stepId);
        const completedCount = updatedSteps.filter((s) => s.completed).length;
        const allDone = updatedSteps.length > 0 && completedCount === updatedSteps.length;
        const nextStatus = allDone
          ? 'completed'
          : completedCount > 0
          ? 'in_progress'
          : updatedSteps.length === 0
          ? m.status
          : 'available';
        return {
          ...m,
          steps: updatedSteps,
          status: nextStatus,
        };
      })
    );
  };

  const deleteMission = (id: string) => {
    const target = missions.find((m) => m.id === id);
    setMissions((prev) => prev.filter((m) => m.id !== id));
    if (target) recordActivity('mission', `Mission supprimée : ${target.title}`);
  };

  // Collectibles handlers
  const toggleCollectible = (id: string) => {
    const target = collectibles.find((c) => c.id === id);
    setCollectibles((prev) =>
      prev.map((c) => (c.id === id ? { ...c, collected: !c.collected } : c))
    );
    if (target) {
      recordActivity(
        'collectible',
        `${!target.collected ? 'Collectible obtenu' : 'Collectible retiré'} : ${target.name}`
      );
    }
  };

  const addCollectible = (item: Omit<Collectible, 'id'>) => {
    const id = `c_${Date.now()}`;
    setCollectibles((prev) => [{ ...item, id }, ...prev]);
    recordActivity('collectible', `Collectible ajouté : ${item.name}`);
  };

  const updateCollectible = (id: string, updates: Partial<Omit<Collectible, 'id'>>) => {
    setCollectibles((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    if (updates.name) recordActivity('collectible', `Collectible modifié : ${updates.name}`);
  };

  const deleteCollectible = (id: string) => {
    const target = collectibles.find((c) => c.id === id);
    setCollectibles((prev) => prev.filter((c) => c.id !== id));
    if (target) recordActivity('collectible', `Collectible supprimé : ${target.name}`);
  };

  // Vehicles handlers
  const toggleVehicleUnlocked = (id: string) => {
    const target = vehicles.find((v) => v.id === id);
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, unlocked: !v.unlocked } : v))
    );
    if (target) {
      recordActivity(
        'vehicle',
        `${!target.unlocked ? 'Véhicule débloqué' : 'Véhicule verrouillé'} : ${target.name}`
      );
    }
  };

  const toggleVehicleFavorite = (id: string) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isFavorite: !v.isFavorite } : v))
    );
  };

  const addVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    const id = `v_${Date.now()}`;
    setVehicles((prev) => [{ ...vehicle, id }, ...prev]);
    recordActivity('vehicle', `Véhicule ajouté au garage : ${vehicle.name}`);
  };

  const updateVehicle = (id: string, updates: Partial<Omit<Vehicle, 'id'>>) => {
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
    if (updates.name) recordActivity('vehicle', `Véhicule mis à jour : ${updates.name}`);
  };

  const deleteVehicle = (id: string) => {
    const target = vehicles.find((v) => v.id === id);
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    if (target) recordActivity('vehicle', `Véhicule retiré : ${target.name}`);
  };

  // Objectives handlers
  const toggleObjective = (id: string) => {
    const target = objectives.find((o) => o.id === id);
    setObjectives((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const nextCompleted = !o.completed;
        return {
          ...o,
          completed: nextCompleted,
          progress: nextCompleted ? o.maxProgress : 0,
        };
      })
    );
    if (target) {
      recordActivity(
        'objective',
        `${!target.completed ? 'Trophée débloqué' : 'Trophée réinitialisé'} : ${target.title}`
      );
    }
  };

  const stepObjectiveProgress = (id: string, delta: number) => {
    setObjectives((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const nextProgress = Math.max(0, Math.min(o.maxProgress, o.progress + delta));
        const completed = nextProgress >= o.maxProgress;
        return { ...o, progress: nextProgress, completed };
      })
    );
  };

  const addObjective = (objective: Omit<Objective, 'id'>) => {
    const id = `o_${Date.now()}`;
    const safeMax = Math.max(1, Math.round(objective.maxProgress || 1));
    const safeProgress = Math.max(0, Math.min(safeMax, Math.round(objective.progress || 0)));
    setObjectives((prev) => [
      {
        ...objective,
        id,
        maxProgress: safeMax,
        progress: safeProgress,
        completed: safeProgress >= safeMax || objective.completed,
      },
      ...prev,
    ]);
    recordActivity('objective', `Objectif ajouté : ${objective.title}`);
  };

  const updateObjective = (id: string, updates: Partial<Omit<Objective, 'id'>>) => {
    setObjectives((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const merged = { ...o, ...updates };
        const safeMax = Math.max(1, Math.round(merged.maxProgress || 1));
        const safeProgress = Math.max(0, Math.min(safeMax, Math.round(merged.progress || 0)));
        return {
          ...merged,
          maxProgress: safeMax,
          progress: safeProgress,
          completed: safeProgress >= safeMax,
        };
      })
    );
  };

  const deleteObjective = (id: string) => {
    const target = objectives.find((o) => o.id === id);
    setObjectives((prev) => prev.filter((o) => o.id !== id));
    if (target) recordActivity('objective', `Objectif supprimé : ${target.title}`);
  };

  // Notes handlers
  const addNote = (note: Omit<TacticalNote, 'id' | 'updatedAt'>) => {
    const id = `n_${Date.now()}`;
    setNotes((prev) => [
      {
        ...note,
        id,
        updatedAt: formatNowFull(),
      },
      ...prev,
    ]);
    recordActivity('note', `Note ajoutée : ${note.title}`);
  };

  const updateNote = (id: string, updates: { title: string; content: string; tags: string[] }) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              title: updates.title.trim() || n.title,
              content: updates.content,
              tags: updates.tags,
              updatedAt: formatNowFull(),
            }
          : n
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const togglePinNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  // Map marker handlers
  const addMapMarker = (marker: Omit<MapMarker, 'id' | 'createdAt'>) => {
    const created: MapMarker = {
      ...marker,
      id: `mk_${Date.now()}`,
      x: Math.max(2, Math.min(98, Number(marker.x.toFixed(1)))),
      y: Math.max(2, Math.min(98, Number(marker.y.toFixed(1)))),
      createdAt: formatNowFull(),
    };
    setMapMarkers((prev) => [created, ...prev]);
    recordActivity('map', `Repère carte placé : ${created.title}`);
  };

  const deleteMapMarker = (id: string) => {
    setMapMarkers((prev) => prev.filter((m) => m.id !== id));
  };

  // Stats calculation (strictly from real items)
  const stats = useMemo(() => {
    const missionsDone = missions.filter((m) => m.status === 'completed').length;
    const collectiblesDone = collectibles.filter((c) => c.collected).length;
    const vehiclesUnlocked = vehicles.filter((v) => v.unlocked).length;
    const objectivesDone = objectives.filter((o) => o.completed).length;

    return {
      missionsDone,
      missionsTotal: missions.length,
      collectiblesDone,
      collectiblesTotal: collectibles.length,
      vehiclesUnlocked,
      vehiclesTotal: vehicles.length,
      objectivesDone,
      objectivesTotal: objectives.length,
    };
  }, [missions, collectibles, vehicles, objectives]);

  const overallProgress = useMemo(() => {
    const totalItems =
      stats.missionsTotal +
      stats.collectiblesTotal +
      stats.vehiclesTotal +
      stats.objectivesTotal;
    if (totalItems === 0) return 0;

    const totalDone =
      stats.missionsDone +
      stats.collectiblesDone +
      stats.vehiclesUnlocked +
      stats.objectivesDone;

    return Math.round((totalDone / totalItems) * 100);
  }, [stats]);

  const resetAllData = () => {
    setMissions(INITIAL_MISSIONS);
    setCollectibles(INITIAL_COLLECTIBLES);
    setVehicles(INITIAL_VEHICLES);
    setObjectives(INITIAL_OBJECTIVES);
    setNotes(INITIAL_NOTES);
    setMapMarkers([]);
    setActivityLog([]);
  };

  const exportBackup = () => {
    const backup = {
      schemaVersion: 3,
      app: 'JITALX',
      timestamp: new Date().toISOString(),
      profile: activeProfile,
      missions,
      collectibles,
      vehicles,
      objectives,
      notes,
      mapMarkers,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jitalx-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = (jsonData: string): { ok: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonData) as Record<string, unknown>;
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return { ok: false, error: 'Le fichier JSON ne contient pas un objet valide.' };
      }
      if (!Array.isArray(parsed.missions) || !Array.isArray(parsed.collectibles)) {
        return {
          ok: false,
          error: 'Structure invalide : les listes "missions" et "collectibles" sont requises.',
        };
      }

      const validMissions = parsed.missions.filter(
        (m): m is Mission =>
          Boolean(m) &&
          typeof m === 'object' &&
          typeof (m as Mission).id === 'string' &&
          typeof (m as Mission).title === 'string' &&
          Array.isArray((m as Mission).steps)
      );
      const validCollectibles = parsed.collectibles.filter(
        (c): c is Collectible =>
          Boolean(c) &&
          typeof c === 'object' &&
          typeof (c as Collectible).id === 'string' &&
          typeof (c as Collectible).name === 'string'
      );

      if (parsed.missions.length > 0 && validMissions.length === 0) {
        return { ok: false, error: 'Format des missions invalide dans le fichier JSON.' };
      }

      setMissions(validMissions);
      setCollectibles(validCollectibles);

      if (Array.isArray(parsed.vehicles)) {
        setVehicles(
          parsed.vehicles.filter(
            (v): v is Vehicle =>
              Boolean(v) &&
              typeof v === 'object' &&
              typeof (v as Vehicle).id === 'string' &&
              typeof (v as Vehicle).name === 'string'
          )
        );
      }
      if (Array.isArray(parsed.objectives)) {
        setObjectives(
          parsed.objectives.filter(
            (o): o is Objective =>
              Boolean(o) &&
              typeof o === 'object' &&
              typeof (o as Objective).id === 'string' &&
              typeof (o as Objective).title === 'string'
          )
        );
      }
      if (Array.isArray(parsed.notes)) {
        setNotes(
          parsed.notes.filter(
            (n): n is TacticalNote =>
              Boolean(n) &&
              typeof n === 'object' &&
              typeof (n as TacticalNote).id === 'string' &&
              typeof (n as TacticalNote).title === 'string'
          )
        );
      }
      if (Array.isArray(parsed.mapMarkers)) {
        setMapMarkers(
          parsed.mapMarkers.filter(
            (mk): mk is MapMarker =>
              Boolean(mk) &&
              typeof mk === 'object' &&
              typeof (mk as MapMarker).id === 'string' &&
              typeof (mk as MapMarker).title === 'string' &&
              typeof (mk as MapMarker).x === 'number' &&
              typeof (mk as MapMarker).y === 'number'
          )
        );
      }
      if (
        parsed.profile &&
        typeof parsed.profile === 'object' &&
        typeof (parsed.profile as GameProfile).id === 'string' &&
        typeof (parsed.profile as GameProfile).name === 'string'
      ) {
        setActiveProfile(parsed.profile as GameProfile);
      }
      recordActivity('note', 'Sauvegarde JSON importée avec succès');
      return { ok: true };
    } catch {
      return { ok: false, error: 'Impossible de lire ce fichier : syntaxe JSON invalide.' };
    }
  };

  const restoreSnapshotData = (snapshot: {
    missions: Mission[];
    collectibles: Collectible[];
    vehicles: Vehicle[];
    objectives: Objective[];
    notes: TacticalNote[];
  }) => {
    if (Array.isArray(snapshot.missions)) setMissions(snapshot.missions);
    if (Array.isArray(snapshot.collectibles)) setCollectibles(snapshot.collectibles);
    if (Array.isArray(snapshot.vehicles)) setVehicles(snapshot.vehicles);
    if (Array.isArray(snapshot.objectives)) setObjectives(snapshot.objectives);
    if (Array.isArray(snapshot.notes)) setNotes(snapshot.notes);
    recordActivity('note', 'Snapshot Cloud restauré');
  };

  return (
    <GameContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        progressionSubTab,
        setProgressionSubTab,
        openProgressionTab,
        profiles,
        activeProfile,
        activeTheme,
        setActiveProfile,
        setSyncedCustomProfiles,
        addLocalCustomProfile,
        removeLocalCustomProfile,
        storageError,
        clearStorageError: () => setStorageError(null),
        missions,
        toggleMissionStatus,
        toggleMissionStep,
        addMission,
        updateMission,
        addMissionStep,
        removeMissionStep,
        deleteMission,
        collectibles,
        toggleCollectible,
        addCollectible,
        updateCollectible,
        deleteCollectible,
        vehicles,
        toggleVehicleUnlocked,
        toggleVehicleFavorite,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        objectives,
        toggleObjective,
        stepObjectiveProgress,
        addObjective,
        updateObjective,
        deleteObjective,
        notes,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        mapMarkers,
        addMapMarker,
        deleteMapMarker,
        customMapUrl,
        setCustomMapUrl,
        activityLog,
        sessionSeconds,
        overallProgress,
        stats,
        resetAllData,
        exportBackup,
        importBackup,
        restoreSnapshotData,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
