import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  ProfileWorkspaceData,
  ProgressEvent,
  ProgressEventKind,
  SessionRecord,
  GlobalMultiGameStats,
  ProfileStatsSummary,
} from '../types';
import {
  INITIAL_PROFILES,
  INITIAL_MISSIONS,
  INITIAL_COLLECTIBLES,
  INITIAL_VEHICLES,
  INITIAL_OBJECTIVES,
  INITIAL_NOTES,
  getStarterWorkspaceForProfile,
} from '../data/initialData';
import { isValidImageUrl } from '../utils/vehicleVisuals';
import { toLocalDateKey } from '../utils/analytics';

export interface RestoreSnapshotResult {
  restoredProfileId: string;
  preservedLocalImages: number;
}

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
  selectProfileById: (profileId: string) => boolean;
  setSyncedCustomProfiles: (customProfiles: GameProfile[]) => void;
  addLocalCustomProfile: (
    profile: Omit<GameProfile, 'id'>,
    preset?: 'empty' | 'starter'
  ) => GameProfile;
  updateLocalCustomProfile: (
    id: string,
    updates: Partial<Omit<GameProfile, 'id' | 'isCustom'>>
  ) => void;
  removeLocalCustomProfile: (id: string) => void;
  storageError: string | null;
  clearStorageError: () => void;
  // Active profile isolated datasets
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
  // Vehicles / Garage
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
  // Real Activity Log & Persisted Analytics
  activityLog: ActivityItem[];
  progressEvents: ProgressEvent[];
  sessionHistory: SessionRecord[];
  // Stats (Active Game + Global Multi-Game)
  sessionSeconds: number;
  totalTrackedSeconds: number;
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
  globalMultiGameStats: GlobalMultiGameStats;
  // Actions
  resetAllData: () => void;
  exportBackup: (scope?: 'active' | 'all') => void;
  importBackup: (jsonData: string) => { ok: boolean; error?: string };
  restoreSnapshotData: (snapshot: {
    profileId?: string;
    missions: Mission[];
    collectibles: Collectible[];
    vehicles: Vehicle[];
    objectives: Objective[];
    notes: TacticalNote[];
    mapMarkers?: MapMarker[];
    customMapUrl?: string;
  }) => RestoreSnapshotResult;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Legacy keys retained strictly for seamless one-time migration without data loss
const LEGACY_STORAGE_KEY = 'neonos_data_v3';
const ACTIVE_PROFILE_KEY = 'neonos_active_profile_v2';
const CUSTOM_PROFILES_KEY = 'neonos_custom_profiles_v1';
const LEGACY_MAP_MARKERS_KEY = 'jitalx_map_markers_v1';
const LEGACY_CUSTOM_MAP_URL_KEY = 'jitalx_custom_map_url_v1';
const LEGACY_ACTIVITY_LOG_KEY = 'jitalx_activity_log_v1';

// New isolated multi-game + real analytics persistence keys
const WORKSPACES_STORAGE_KEY = 'jitalx_workspaces_by_profile_v1';
const PROGRESS_EVENTS_KEY = 'jitalx_progress_events_v1';
const SESSION_HISTORY_KEY = 'jitalx_session_history_v1';

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
  return formatNow();
}

function sanitizeVehicleImage(url?: string): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  return isValidImageUrl(trimmed) ? trimmed : undefined;
}

function sanitizeWorkspace(raw: Partial<ProfileWorkspaceData> | undefined, fallbackId: string): ProfileWorkspaceData {
  const base = getStarterWorkspaceForProfile(fallbackId, 'empty');
  if (!raw || typeof raw !== 'object') return base;
  return {
    missions: Array.isArray(raw.missions) ? raw.missions : base.missions,
    collectibles: Array.isArray(raw.collectibles) ? raw.collectibles : base.collectibles,
    vehicles: Array.isArray(raw.vehicles)
      ? raw.vehicles.map((v) => ({ ...v, imageUrl: sanitizeVehicleImage(v.imageUrl) }))
      : base.vehicles,
    objectives: Array.isArray(raw.objectives) ? raw.objectives : base.objectives,
    notes: Array.isArray(raw.notes) ? raw.notes : base.notes,
    mapMarkers: Array.isArray(raw.mapMarkers) ? raw.mapMarkers : base.mapMarkers,
    customMapUrl:
      typeof raw.customMapUrl === 'string' && isValidImageUrl(raw.customMapUrl)
        ? raw.customMapUrl.trim()
        : '',
    activityLog: Array.isArray(raw.activityLog) ? raw.activityLog.slice(0, 30) : [],
    totalTrackedSeconds:
      typeof raw.totalTrackedSeconds === 'number' && Number.isFinite(raw.totalTrackedSeconds)
        ? Math.max(0, Math.floor(raw.totalTrackedSeconds))
        : 0,
  };
}

function loadInitialWorkspaces(initialProfileId: string): Record<string, ProfileWorkspaceData> {
  try {
    const saved = localStorage.getItem(WORKSPACES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Record<string, Partial<ProfileWorkspaceData>>;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const clean: Record<string, ProfileWorkspaceData> = {};
        for (const [pid, ws] of Object.entries(parsed)) {
          clean[pid] = sanitizeWorkspace(ws, pid);
        }
        // Ensure built-in profiles exist if not yet initialized
        for (const builtIn of INITIAL_PROFILES) {
          if (!clean[builtIn.id]) {
            clean[builtIn.id] = getStarterWorkspaceForProfile(builtIn.id, 'starter');
          }
        }
        return clean;
      }
    }
  } catch {
    // fall through to migration / defaults
  }

  // One-time seamless migration from legacy single-dataset localStorage keys
  const migrated: Record<string, ProfileWorkspaceData> = {
    'sunset-neon': getStarterWorkspaceForProfile('sunset-neon', 'starter'),
    'neon-sector': getStarterWorkspaceForProfile('neon-sector', 'starter'),
    custom: getStarterWorkspaceForProfile('custom', 'starter'),
  };

  try {
    const hasLegacyData =
      localStorage.getItem(`${LEGACY_STORAGE_KEY}_missions`) !== null ||
      localStorage.getItem(`${LEGACY_STORAGE_KEY}_collectibles`) !== null ||
      localStorage.getItem(`${LEGACY_STORAGE_KEY}_vehicles`) !== null ||
      localStorage.getItem(LEGACY_MAP_MARKERS_KEY) !== null;

    if (hasLegacyData) {
      const targetId = initialProfileId || 'sunset-neon';
      const legacyCustomMap = localStorage.getItem(LEGACY_CUSTOM_MAP_URL_KEY) || '';
      migrated[targetId] = sanitizeWorkspace(
        {
          missions: readLocalArray<Mission>(`${LEGACY_STORAGE_KEY}_missions`, INITIAL_MISSIONS),
          collectibles: readLocalArray<Collectible>(
            `${LEGACY_STORAGE_KEY}_collectibles`,
            INITIAL_COLLECTIBLES
          ),
          vehicles: readLocalArray<Vehicle>(`${LEGACY_STORAGE_KEY}_vehicles`, INITIAL_VEHICLES),
          objectives: readLocalArray<Objective>(`${LEGACY_STORAGE_KEY}_objectives`, INITIAL_OBJECTIVES),
          notes: readLocalArray<TacticalNote>(`${LEGACY_STORAGE_KEY}_notes`, INITIAL_NOTES),
          mapMarkers: readLocalArray<MapMarker>(LEGACY_MAP_MARKERS_KEY, []),
          customMapUrl: legacyCustomMap,
          activityLog: readLocalArray<ActivityItem>(LEGACY_ACTIVITY_LOG_KEY, []),
          totalTrackedSeconds: 0,
        },
        targetId
      );
    }
  } catch {
    // ignore storage access issues
  }

  return migrated;
}

export function computeWorkspaceSummary(
  profile: GameProfile,
  ws: ProfileWorkspaceData,
  liveSessionExtraSeconds = 0
): ProfileStatsSummary {
  const missionsDone = ws.missions.filter((m) => m.status === 'completed').length;
  const collectiblesDone = ws.collectibles.filter((c) => c.collected).length;
  const vehiclesUnlocked = ws.vehicles.filter((v) => v.unlocked).length;
  const objectivesDone = ws.objectives.filter((o) => o.completed).length;

  const totalItems =
    ws.missions.length + ws.collectibles.length + ws.vehicles.length + ws.objectives.length;
  const totalDone = missionsDone + collectiblesDone + vehiclesUnlocked + objectivesDone;
  const overallProgress = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0;

  const earnedXp =
    ws.missions
      .filter((m) => m.status === 'completed')
      .reduce((acc, m) => acc + (m.rewardXp || 0), 0) +
    collectiblesDone * 150 +
    objectivesDone * 500 +
    vehiclesUnlocked * 200;

  return {
    profileId: profile.id,
    profileName: profile.name,
    universe: profile.universe,
    theme: profile.theme || 'sunset-neon',
    missionsDone,
    missionsTotal: ws.missions.length,
    collectiblesDone,
    collectiblesTotal: ws.collectibles.length,
    vehiclesUnlocked,
    vehiclesTotal: ws.vehicles.length,
    objectivesDone,
    objectivesTotal: ws.objectives.length,
    earnedXp,
    overallProgress,
    totalTrackedSeconds: (ws.totalTrackedSeconds || 0) + liveSessionExtraSeconds,
  };
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

  // Per-profile isolated workspace map
  const [workspaces, setWorkspaces] = useState<Record<string, ProfileWorkspaceData>>(() =>
    loadInitialWorkspaces(savedProfileId || INITIAL_PROFILES[0].id)
  );

  // Persisted real analytics
  const [progressEvents, setProgressEvents] = useState<ProgressEvent[]>(() =>
    readLocalArray<ProgressEvent>(PROGRESS_EVENTS_KEY, [])
  );
  const [sessionHistory, setSessionHistory] = useState<SessionRecord[]>(() =>
    readLocalArray<SessionRecord>(SESSION_HISTORY_KEY, [])
  );

  const safePersist = useCallback((key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      setStorageError(
        'Local storage full or unavailable: export a JSON backup or use Cloud snapshots.'
      );
    }
  }, []);

  useEffect(() => {
    safePersist(CUSTOM_PROFILES_KEY, localCustomProfiles);
  }, [localCustomProfiles, safePersist]);

  useEffect(() => {
    safePersist(WORKSPACES_STORAGE_KEY, workspaces);
  }, [workspaces, safePersist]);

  useEffect(() => {
    safePersist(PROGRESS_EVENTS_KEY, progressEvents);
  }, [progressEvents, safePersist]);

  useEffect(() => {
    safePersist(SESSION_HISTORY_KEY, sessionHistory);
  }, [sessionHistory, safePersist]);

  // Sync active profile if a saved Cloud profile finishes loading or gets edited
  useEffect(() => {
    const updatedMatch = profiles.find((p) => p.id === activeProfile.id);
    if (
      updatedMatch &&
      (updatedMatch.name !== activeProfile.name ||
        updatedMatch.universe !== activeProfile.universe ||
        updatedMatch.playerTag !== activeProfile.playerTag ||
        updatedMatch.theme !== activeProfile.theme ||
        updatedMatch.avatarIcon !== activeProfile.avatarIcon)
    ) {
      setActiveProfileState(updatedMatch);
    } else if (savedProfileId && activeProfile.id !== savedProfileId) {
      const cloudMatch = syncedCustomProfiles.find((p) => p.id === savedProfileId);
      if (cloudMatch) {
        setActiveProfileState(cloudMatch);
      }
    }
  }, [profiles, syncedCustomProfiles, savedProfileId, activeProfile]);

  // Ensure every active profile always has an initialized isolated workspace entry
  useEffect(() => {
    setWorkspaces((prev) => {
      if (prev[activeProfile.id]) return prev;
      return {
        ...prev,
        [activeProfile.id]: getStarterWorkspaceForProfile(
          activeProfile.id,
          activeProfile.isCustom ? 'empty' : 'starter'
        ),
      };
    });
  }, [activeProfile.id, activeProfile.isCustom]);

  // Active session timer & real SessionRecord incremental persistence
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const currentSessionRef = useRef<{
    id: string;
    profileId: string;
    startedAt: number;
    actionsCount: number;
    xpDelta: number;
    flushedSeconds: number;
  }>({
    id: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    profileId: activeProfile.id,
    startedAt: Date.now(),
    actionsCount: 0,
    xpDelta: 0,
    flushedSeconds: 0,
  });

  const flushCurrentSession = useCallback((elapsedSec: number) => {
    const ref = currentSessionRef.current;
    const deltaSeconds = Math.max(0, elapsedSec - ref.flushedSeconds);
    if (deltaSeconds <= 0 && ref.actionsCount === 0) return;

    ref.flushedSeconds = elapsedSec;
    const now = Date.now();
    const record: SessionRecord = {
      id: ref.id,
      profileId: ref.profileId,
      startedAt: ref.startedAt,
      endedAt: now,
      dateKey: toLocalDateKey(ref.startedAt),
      durationSeconds: elapsedSec,
      actionsCount: ref.actionsCount,
      xpDelta: ref.xpDelta,
    };

    setSessionHistory((prev) => {
      const idx = prev.findIndex((s) => s.id === record.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = record;
        return next.slice(-200);
      }
      return [...prev, record].slice(-200);
    });

    if (deltaSeconds > 0) {
      setWorkspaces((prev) => {
        const existing =
          prev[ref.profileId] || getStarterWorkspaceForProfile(ref.profileId, 'empty');
        return {
          ...prev,
          [ref.profileId]: {
            ...existing,
            totalTrackedSeconds: (existing.totalTrackedSeconds || 0) + deltaSeconds,
          },
        };
      });
    }
  }, []);

  const sessionSecondsRef = useRef(0);
  sessionSecondsRef.current = sessionSeconds;

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => {
        const next = prev + 1;
        if (next % 15 === 0) {
          flushCurrentSession(next);
        }
        return next;
      });
    }, 1000);

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        flushCurrentSession(sessionSecondsRef.current);
      }
    };
    const handleBeforeUnload = () => {
      flushCurrentSession(sessionSecondsRef.current);
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [flushCurrentSession]);

  const setActiveProfile = useCallback(
    (profile: GameProfile) => {
      if (profile.id !== activeProfile.id) {
        flushCurrentSession(sessionSecondsRef.current);
        currentSessionRef.current = {
          id: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          profileId: profile.id,
          startedAt: Date.now(),
          actionsCount: 0,
          xpDelta: 0,
          flushedSeconds: 0,
        };
        setSessionSeconds(0);
      }
      setActiveProfileState(profile);
      try {
        localStorage.setItem(ACTIVE_PROFILE_KEY, profile.id);
      } catch {
        setStorageError('Unable to persist active profile in browser storage.');
      }
    },
    [activeProfile.id, flushCurrentSession]
  );

  const selectProfileById = useCallback(
    (profileId: string): boolean => {
      const match = profiles.find((p) => p.id === profileId);
      if (!match) return false;
      setActiveProfile(match);
      return true;
    },
    [profiles, setActiveProfile]
  );

  const addLocalCustomProfile = (
    profile: Omit<GameProfile, 'id'>,
    preset: 'empty' | 'starter' = 'empty'
  ): GameProfile => {
    const created: GameProfile = {
      ...profile,
      id: `local_prof_${Date.now()}`,
      isCustom: true,
    };
    setLocalCustomProfiles((prev) => [created, ...prev]);
    setWorkspaces((prev) => ({
      ...prev,
      [created.id]:
        preset === 'starter'
          ? getStarterWorkspaceForProfile('custom', 'starter')
          : getStarterWorkspaceForProfile(created.id, 'empty'),
    }));
    return created;
  };

  const updateLocalCustomProfile = (
    id: string,
    updates: Partial<Omit<GameProfile, 'id' | 'isCustom'>>
  ) => {
    setLocalCustomProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const removeLocalCustomProfile = (id: string) => {
    setLocalCustomProfiles((prev) => prev.filter((p) => p.id !== id));
    setWorkspaces((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
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

  // Active workspace slice (strictly isolated to activeProfile.id)
  const activeWorkspace: ProfileWorkspaceData = useMemo(
    () =>
      workspaces[activeProfile.id] ||
      getStarterWorkspaceForProfile(activeProfile.id, activeProfile.isCustom ? 'empty' : 'starter'),
    [workspaces, activeProfile.id, activeProfile.isCustom]
  );

  const updateActiveWorkspace = useCallback(
    (updater: (ws: ProfileWorkspaceData) => ProfileWorkspaceData) => {
      const targetId = activeProfile.id;
      const isCustom = activeProfile.isCustom;
      setWorkspaces((prev) => {
        const current =
          prev[targetId] || getStarterWorkspaceForProfile(targetId, isCustom ? 'empty' : 'starter');
        return {
          ...prev,
          [targetId]: updater(current),
        };
      });
    },
    [activeProfile.id, activeProfile.isCustom]
  );

  const recordProgressEvent = useCallback(
    (kind: ProgressEventKind, delta: number, xpDelta: number, label: string) => {
      const now = Date.now();
      const event: ProgressEvent = {
        id: `pev_${now}_${Math.random().toString(36).slice(2, 6)}`,
        profileId: activeProfile.id,
        timestamp: now,
        dateKey: toLocalDateKey(now),
        kind,
        delta,
        xpDelta,
        label,
      };
      setProgressEvents((prev) => [...prev, event].slice(-1000));
      currentSessionRef.current.actionsCount += 1;
      currentSessionRef.current.xpDelta += xpDelta;
    },
    [activeProfile.id]
  );

  const appendActivity = (ws: ProfileWorkspaceData, type: ActivityType, label: string): ActivityItem[] => {
    const entry: ActivityItem = {
      id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type,
      label,
      timestamp: formatNowFull(),
    };
    return [entry, ...ws.activityLog].slice(0, 25);
  };

  // Missions
  const toggleMissionStatus = (id: string) => {
    const target = activeWorkspace.missions.find((m) => m.id === id);
    if (!target) return;
    const nextStatus =
      target.status === 'available'
        ? 'in_progress'
        : target.status === 'in_progress'
        ? 'completed'
        : 'available';

    updateActiveWorkspace((ws) => ({
      ...ws,
      missions: ws.missions.map((m) => {
        if (m.id !== id) return m;
        const updatedSteps =
          nextStatus === 'completed'
            ? m.steps.map((s) => ({ ...s, completed: true }))
            : nextStatus === 'available'
            ? m.steps.map((s) => ({ ...s, completed: false }))
            : m.steps;
        return { ...m, status: nextStatus, steps: updatedSteps };
      }),
      activityLog: appendActivity(ws, 'mission', `${target.title} → ${nextStatus}`),
    }));

    if (nextStatus === 'completed' && target.status !== 'completed') {
      recordProgressEvent('mission', 1, target.rewardXp || 500, target.title);
    } else if (target.status === 'completed' && nextStatus !== 'completed') {
      recordProgressEvent('mission', -1, -(target.rewardXp || 500), target.title);
    }
  };

  const toggleMissionStep = (missionId: string, stepId: string) => {
    const targetMission = activeWorkspace.missions.find((m) => m.id === missionId);
    const targetStep = targetMission?.steps.find((s) => s.id === stepId);
    if (!targetMission || !targetStep) return;

    const updatedSteps = targetMission.steps.map((s) =>
      s.id === stepId ? { ...s, completed: !s.completed } : s
    );
    const completedCount = updatedSteps.filter((s) => s.completed).length;
    const allDone = updatedSteps.length > 0 && completedCount === updatedSteps.length;
    const nextStatus = allDone
      ? 'completed'
      : completedCount > 0
      ? 'in_progress'
      : 'available';

    updateActiveWorkspace((ws) => ({
      ...ws,
      missions: ws.missions.map((m) =>
        m.id === missionId ? { ...m, steps: updatedSteps, status: nextStatus } : m
      ),
      activityLog: appendActivity(
        ws,
        'mission',
        `${!targetStep.completed ? '✓' : '↺'} ${targetMission.title}`
      ),
    }));

    if (nextStatus === 'completed' && targetMission.status !== 'completed') {
      recordProgressEvent('mission', 1, targetMission.rewardXp || 500, targetMission.title);
    } else if (targetMission.status === 'completed' && nextStatus !== 'completed') {
      recordProgressEvent('mission', -1, -(targetMission.rewardXp || 500), targetMission.title);
    }
  };

  const addMission = (newMission: Omit<Mission, 'id'>) => {
    const id = `m_${Date.now()}`;
    updateActiveWorkspace((ws) => ({
      ...ws,
      missions: [{ ...newMission, id }, ...ws.missions],
      activityLog: appendActivity(ws, 'mission', `+ ${newMission.title}`),
    }));
  };

  const updateMission = (id: string, updates: Partial<Omit<Mission, 'id'>>) => {
    updateActiveWorkspace((ws) => ({
      ...ws,
      missions: ws.missions.map((m) => (m.id === id ? { ...m, ...updates } : m)),
      activityLog: updates.title
        ? appendActivity(ws, 'mission', `✎ ${updates.title}`)
        : ws.activityLog,
    }));
  };

  const addMissionStep = (missionId: string, text: string) => {
    const clean = text.trim();
    if (!clean) return;
    updateActiveWorkspace((ws) => ({
      ...ws,
      missions: ws.missions.map((m) => {
        if (m.id !== missionId) return m;
        const updatedSteps = [...m.steps, { id: `s_${Date.now()}`, text: clean, completed: false }];
        const completedCount = updatedSteps.filter((s) => s.completed).length;
        return {
          ...m,
          steps: updatedSteps,
          status:
            completedCount > 0
              ? 'in_progress'
              : m.status === 'completed'
              ? 'available'
              : m.status,
        };
      }),
    }));
  };

  const removeMissionStep = (missionId: string, stepId: string) => {
    updateActiveWorkspace((ws) => ({
      ...ws,
      missions: ws.missions.map((m) => {
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
        return { ...m, steps: updatedSteps, status: nextStatus };
      }),
    }));
  };

  const deleteMission = (id: string) => {
    const target = activeWorkspace.missions.find((m) => m.id === id);
    updateActiveWorkspace((ws) => ({
      ...ws,
      missions: ws.missions.filter((m) => m.id !== id),
      activityLog: target ? appendActivity(ws, 'mission', `× ${target.title}`) : ws.activityLog,
    }));
  };

  // Collectibles
  const toggleCollectible = (id: string) => {
    const target = activeWorkspace.collectibles.find((c) => c.id === id);
    if (!target) return;
    const nextCollected = !target.collected;
    updateActiveWorkspace((ws) => ({
      ...ws,
      collectibles: ws.collectibles.map((c) =>
        c.id === id ? { ...c, collected: nextCollected } : c
      ),
      activityLog: appendActivity(ws, 'collectible', `${nextCollected ? '✓' : '↺'} ${target.name}`),
    }));
    recordProgressEvent('collectible', nextCollected ? 1 : -1, nextCollected ? 150 : -150, target.name);
  };

  const addCollectible = (item: Omit<Collectible, 'id'>) => {
    const id = `c_${Date.now()}`;
    updateActiveWorkspace((ws) => ({
      ...ws,
      collectibles: [{ ...item, id }, ...ws.collectibles],
      activityLog: appendActivity(ws, 'collectible', `+ ${item.name}`),
    }));
  };

  const updateCollectible = (id: string, updates: Partial<Omit<Collectible, 'id'>>) => {
    updateActiveWorkspace((ws) => ({
      ...ws,
      collectibles: ws.collectibles.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      activityLog: updates.name
        ? appendActivity(ws, 'collectible', `✎ ${updates.name}`)
        : ws.activityLog,
    }));
  };

  const deleteCollectible = (id: string) => {
    const target = activeWorkspace.collectibles.find((c) => c.id === id);
    updateActiveWorkspace((ws) => ({
      ...ws,
      collectibles: ws.collectibles.filter((c) => c.id !== id),
      activityLog: target ? appendActivity(ws, 'collectible', `× ${target.name}`) : ws.activityLog,
    }));
  };

  // Vehicles / Garage
  const toggleVehicleUnlocked = (id: string) => {
    const target = activeWorkspace.vehicles.find((v) => v.id === id);
    if (!target) return;
    const nextUnlocked = !target.unlocked;
    updateActiveWorkspace((ws) => ({
      ...ws,
      vehicles: ws.vehicles.map((v) => (v.id === id ? { ...v, unlocked: nextUnlocked } : v)),
      activityLog: appendActivity(ws, 'vehicle', `${nextUnlocked ? '✓' : '↺'} ${target.name}`),
    }));
    recordProgressEvent('vehicle', nextUnlocked ? 1 : -1, nextUnlocked ? 200 : -200, target.name);
  };

  const toggleVehicleFavorite = (id: string) => {
    updateActiveWorkspace((ws) => ({
      ...ws,
      vehicles: ws.vehicles.map((v) => (v.id === id ? { ...v, isFavorite: !v.isFavorite } : v)),
    }));
  };

  const addVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    const id = `v_${Date.now()}`;
    const safeVehicle: Vehicle = {
      ...vehicle,
      id,
      imageUrl: sanitizeVehicleImage(vehicle.imageUrl),
    };
    updateActiveWorkspace((ws) => ({
      ...ws,
      vehicles: [safeVehicle, ...ws.vehicles],
      activityLog: appendActivity(ws, 'vehicle', `+ ${vehicle.name}`),
    }));
  };

  const updateVehicle = (id: string, updates: Partial<Omit<Vehicle, 'id'>>) => {
    const safeUpdates: Partial<Omit<Vehicle, 'id'>> = { ...updates };
    if ('imageUrl' in safeUpdates) {
      safeUpdates.imageUrl = sanitizeVehicleImage(safeUpdates.imageUrl);
    }
    updateActiveWorkspace((ws) => ({
      ...ws,
      vehicles: ws.vehicles.map((v) => (v.id === id ? { ...v, ...safeUpdates } : v)),
      activityLog: updates.name
        ? appendActivity(ws, 'vehicle', `✎ ${updates.name}`)
        : ws.activityLog,
    }));
  };

  const deleteVehicle = (id: string) => {
    const target = activeWorkspace.vehicles.find((v) => v.id === id);
    updateActiveWorkspace((ws) => ({
      ...ws,
      vehicles: ws.vehicles.filter((v) => v.id !== id),
      activityLog: target ? appendActivity(ws, 'vehicle', `× ${target.name}`) : ws.activityLog,
    }));
  };

  // Objectives
  const toggleObjective = (id: string) => {
    const target = activeWorkspace.objectives.find((o) => o.id === id);
    if (!target) return;
    const nextCompleted = !target.completed;
    updateActiveWorkspace((ws) => ({
      ...ws,
      objectives: ws.objectives.map((o) =>
        o.id === id
          ? { ...o, completed: nextCompleted, progress: nextCompleted ? o.maxProgress : 0 }
          : o
      ),
      activityLog: appendActivity(ws, 'objective', `${nextCompleted ? '★' : '↺'} ${target.title}`),
    }));
    recordProgressEvent('objective', nextCompleted ? 1 : -1, nextCompleted ? 500 : -500, target.title);
  };

  const stepObjectiveProgress = (id: string, delta: number) => {
    const target = activeWorkspace.objectives.find((o) => o.id === id);
    if (!target) return;
    const nextProgress = Math.max(0, Math.min(target.maxProgress, target.progress + delta));
    const nextCompleted = nextProgress >= target.maxProgress;
    updateActiveWorkspace((ws) => ({
      ...ws,
      objectives: ws.objectives.map((o) =>
        o.id === id ? { ...o, progress: nextProgress, completed: nextCompleted } : o
      ),
    }));
    if (nextCompleted && !target.completed) {
      recordProgressEvent('objective', 1, 500, target.title);
    } else if (!nextCompleted && target.completed) {
      recordProgressEvent('objective', -1, -500, target.title);
    }
  };

  const addObjective = (objective: Omit<Objective, 'id'>) => {
    const id = `o_${Date.now()}`;
    const safeMax = Math.max(1, Math.round(objective.maxProgress || 1));
    const safeProgress = Math.max(0, Math.min(safeMax, Math.round(objective.progress || 0)));
    updateActiveWorkspace((ws) => ({
      ...ws,
      objectives: [
        {
          ...objective,
          id,
          maxProgress: safeMax,
          progress: safeProgress,
          completed: safeProgress >= safeMax || objective.completed,
        },
        ...ws.objectives,
      ],
      activityLog: appendActivity(ws, 'objective', `+ ${objective.title}`),
    }));
  };

  const updateObjective = (id: string, updates: Partial<Omit<Objective, 'id'>>) => {
    updateActiveWorkspace((ws) => ({
      ...ws,
      objectives: ws.objectives.map((o) => {
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
      }),
    }));
  };

  const deleteObjective = (id: string) => {
    const target = activeWorkspace.objectives.find((o) => o.id === id);
    updateActiveWorkspace((ws) => ({
      ...ws,
      objectives: ws.objectives.filter((o) => o.id !== id),
      activityLog: target ? appendActivity(ws, 'objective', `× ${target.title}`) : ws.activityLog,
    }));
  };

  // Notes
  const addNote = (note: Omit<TacticalNote, 'id' | 'updatedAt'>) => {
    const id = `n_${Date.now()}`;
    updateActiveWorkspace((ws) => ({
      ...ws,
      notes: [{ ...note, id, updatedAt: formatNowFull() }, ...ws.notes],
      activityLog: appendActivity(ws, 'note', `+ ${note.title}`),
    }));
  };

  const updateNote = (id: string, updates: { title: string; content: string; tags: string[] }) => {
    updateActiveWorkspace((ws) => ({
      ...ws,
      notes: ws.notes.map((n) =>
        n.id === id
          ? {
              ...n,
              title: updates.title.trim() || n.title,
              content: updates.content,
              tags: updates.tags,
              updatedAt: formatNowFull(),
            }
          : n
      ),
    }));
  };

  const deleteNote = (id: string) => {
    updateActiveWorkspace((ws) => ({
      ...ws,
      notes: ws.notes.filter((n) => n.id !== id),
    }));
  };

  const togglePinNote = (id: string) => {
    updateActiveWorkspace((ws) => ({
      ...ws,
      notes: ws.notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)),
    }));
  };

  // Map markers & custom map background (isolated per game profile!)
  const addMapMarker = (marker: Omit<MapMarker, 'id' | 'createdAt'>) => {
    const created: MapMarker = {
      ...marker,
      id: `mk_${Date.now()}`,
      x: Math.max(2, Math.min(98, Number(marker.x.toFixed(1)))),
      y: Math.max(2, Math.min(98, Number(marker.y.toFixed(1)))),
      createdAt: formatNowFull(),
    };
    updateActiveWorkspace((ws) => ({
      ...ws,
      mapMarkers: [created, ...ws.mapMarkers],
      activityLog: appendActivity(ws, 'map', `+ ${created.title}`),
    }));
  };

  const deleteMapMarker = (id: string) => {
    updateActiveWorkspace((ws) => ({
      ...ws,
      mapMarkers: ws.mapMarkers.filter((m) => m.id !== id),
    }));
  };

  const setCustomMapUrl = useCallback(
    (url: string) => {
      const clean = url.trim();
      if (clean && !isValidImageUrl(clean)) {
        setStorageError('Invalid map image URL (only HTTPS/HTTP or PNG/JPEG/WebP/GIF images allowed).');
        return;
      }
      updateActiveWorkspace((ws) => ({
        ...ws,
        customMapUrl: clean,
      }));
    },
    [updateActiveWorkspace]
  );

  // Active game stats
  const stats = useMemo(() => {
    const missionsDone = activeWorkspace.missions.filter((m) => m.status === 'completed').length;
    const collectiblesDone = activeWorkspace.collectibles.filter((c) => c.collected).length;
    const vehiclesUnlocked = activeWorkspace.vehicles.filter((v) => v.unlocked).length;
    const objectivesDone = activeWorkspace.objectives.filter((o) => o.completed).length;

    return {
      missionsDone,
      missionsTotal: activeWorkspace.missions.length,
      collectiblesDone,
      collectiblesTotal: activeWorkspace.collectibles.length,
      vehiclesUnlocked,
      vehiclesTotal: activeWorkspace.vehicles.length,
      objectivesDone,
      objectivesTotal: activeWorkspace.objectives.length,
    };
  }, [activeWorkspace]);

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

  const liveUnsavedSeconds = Math.max(0, sessionSeconds - currentSessionRef.current.flushedSeconds);
  const totalTrackedSeconds = (activeWorkspace.totalTrackedSeconds || 0) + liveUnsavedSeconds;

  // Global Multi-Game Stats across ALL profiles
  const globalMultiGameStats = useMemo<GlobalMultiGameStats>(() => {
    const perProfile: ProfileStatsSummary[] = profiles.map((prof) => {
      const ws =
        workspaces[prof.id] ||
        getStarterWorkspaceForProfile(prof.id, prof.isCustom ? 'empty' : 'starter');
      const liveExtra = prof.id === activeProfile.id ? liveUnsavedSeconds : 0;
      return computeWorkspaceSummary(prof, ws, liveExtra);
    });

    const totals = perProfile.reduce(
      (acc, p) => {
        acc.missionsDone += p.missionsDone;
        acc.missionsTotal += p.missionsTotal;
        acc.collectiblesDone += p.collectiblesDone;
        acc.collectiblesTotal += p.collectiblesTotal;
        acc.vehiclesUnlocked += p.vehiclesUnlocked;
        acc.vehiclesTotal += p.vehiclesTotal;
        acc.objectivesDone += p.objectivesDone;
        acc.objectivesTotal += p.objectivesTotal;
        acc.totalEarnedXp += p.earnedXp;
        acc.totalTrackedSeconds += p.totalTrackedSeconds;
        return acc;
      },
      {
        missionsDone: 0,
        missionsTotal: 0,
        collectiblesDone: 0,
        collectiblesTotal: 0,
        vehiclesUnlocked: 0,
        vehiclesTotal: 0,
        objectivesDone: 0,
        objectivesTotal: 0,
        totalEarnedXp: 0,
        totalTrackedSeconds: 0,
      }
    );

    const allItems =
      totals.missionsTotal +
      totals.collectiblesTotal +
      totals.vehiclesTotal +
      totals.objectivesTotal;
    const allDone =
      totals.missionsDone +
      totals.collectiblesDone +
      totals.vehiclesUnlocked +
      totals.objectivesDone;

    return {
      totalProfiles: profiles.length,
      ...totals,
      overallProgress: allItems > 0 ? Math.round((allDone / allItems) * 100) : 0,
      perProfile,
    };
  }, [profiles, workspaces, activeProfile.id, liveUnsavedSeconds]);

  const resetAllData = () => {
    const fresh = getStarterWorkspaceForProfile(
      activeProfile.id,
      activeProfile.isCustom ? 'empty' : 'starter'
    );
    setWorkspaces((prev) => ({
      ...prev,
      [activeProfile.id]: fresh,
    }));
  };

  const exportBackup = (scope: 'active' | 'all' = 'active') => {
    flushCurrentSession(sessionSecondsRef.current);
    const backup =
      scope === 'all'
        ? {
            schemaVersion: 4,
            scope: 'all',
            app: 'JITALX',
            publisher: '10JITAL PROD',
            timestamp: new Date().toISOString(),
            activeProfileId: activeProfile.id,
            customProfiles: localCustomProfiles,
            workspaces,
            progressEvents,
            sessionHistory,
          }
        : {
            schemaVersion: 3,
            scope: 'active',
            app: 'JITALX',
            publisher: '10JITAL PROD',
            timestamp: new Date().toISOString(),
            profile: activeProfile,
            missions: activeWorkspace.missions,
            collectibles: activeWorkspace.collectibles,
            vehicles: activeWorkspace.vehicles,
            objectives: activeWorkspace.objectives,
            notes: activeWorkspace.notes,
            mapMarkers: activeWorkspace.mapMarkers,
            customMapUrl: activeWorkspace.customMapUrl,
          };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download =
      scope === 'all'
        ? `jitalx-multigame-backup-${Date.now()}.json`
        : `jitalx-${activeProfile.id}-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = (jsonData: string): { ok: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonData) as Record<string, unknown>;
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return { ok: false, error: 'Invalid JSON backup object.' };
      }

      // Schema v4: full multi-game backup
      if (parsed.schemaVersion === 4 && parsed.workspaces && typeof parsed.workspaces === 'object') {
        const rawWorkspaces = parsed.workspaces as Record<string, Partial<ProfileWorkspaceData>>;
        const sanitizedMap: Record<string, ProfileWorkspaceData> = {};
        for (const [pid, ws] of Object.entries(rawWorkspaces)) {
          if (/^[a-zA-Z0-9_-]{1,64}$/.test(pid)) {
            sanitizedMap[pid] = sanitizeWorkspace(ws, pid);
          }
        }
        if (Object.keys(sanitizedMap).length === 0) {
          return { ok: false, error: 'No valid game workspaces found in v4 backup.' };
        }
        if (Array.isArray(parsed.customProfiles)) {
          const validCustom = parsed.customProfiles.filter(
            (p): p is GameProfile =>
              Boolean(p) &&
              typeof p === 'object' &&
              typeof (p as GameProfile).id === 'string' &&
              typeof (p as GameProfile).name === 'string'
          );
          if (validCustom.length > 0) {
            setLocalCustomProfiles((prev) => {
              const seen = new Set(prev.map((p) => p.id));
              return [...prev, ...validCustom.filter((p) => !seen.has(p.id))];
            });
          }
        }
        setWorkspaces((prev) => ({ ...prev, ...sanitizedMap }));
        if (Array.isArray(parsed.progressEvents)) {
          setProgressEvents(parsed.progressEvents as ProgressEvent[]);
        }
        if (Array.isArray(parsed.sessionHistory)) {
          setSessionHistory(parsed.sessionHistory as SessionRecord[]);
        }
        return { ok: true };
      }

      // Schema v3: single profile backup (backward compatible)
      if (!Array.isArray(parsed.missions) || !Array.isArray(parsed.collectibles)) {
        return {
          ok: false,
          error: 'Invalid schema: "missions" and "collectibles" arrays are required.',
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
        return { ok: false, error: 'Invalid missions array format in JSON file.' };
      }

      const validVehicles = Array.isArray(parsed.vehicles)
        ? parsed.vehicles
            .filter(
              (v): v is Vehicle =>
                Boolean(v) &&
                typeof v === 'object' &&
                typeof (v as Vehicle).id === 'string' &&
                typeof (v as Vehicle).name === 'string'
            )
            .map((v) => ({ ...v, imageUrl: sanitizeVehicleImage(v.imageUrl) }))
        : activeWorkspace.vehicles;

      const validObjectives = Array.isArray(parsed.objectives)
        ? parsed.objectives.filter(
            (o): o is Objective =>
              Boolean(o) &&
              typeof o === 'object' &&
              typeof (o as Objective).id === 'string' &&
              typeof (o as Objective).title === 'string'
          )
        : activeWorkspace.objectives;

      const validNotes = Array.isArray(parsed.notes)
        ? parsed.notes.filter(
            (n): n is TacticalNote =>
              Boolean(n) &&
              typeof n === 'object' &&
              typeof (n as TacticalNote).id === 'string' &&
              typeof (n as TacticalNote).title === 'string'
          )
        : activeWorkspace.notes;

      const validMarkers = Array.isArray(parsed.mapMarkers)
        ? parsed.mapMarkers.filter(
            (mk): mk is MapMarker =>
              Boolean(mk) &&
              typeof mk === 'object' &&
              typeof (mk as MapMarker).id === 'string' &&
              typeof (mk as MapMarker).title === 'string' &&
              typeof (mk as MapMarker).x === 'number' &&
              typeof (mk as MapMarker).y === 'number'
          )
        : activeWorkspace.mapMarkers;

      const importedMapUrl =
        typeof parsed.customMapUrl === 'string' && isValidImageUrl(parsed.customMapUrl)
          ? parsed.customMapUrl.trim()
          : activeWorkspace.customMapUrl;

      let targetProfileId = activeProfile.id;
      if (
        parsed.profile &&
        typeof parsed.profile === 'object' &&
        typeof (parsed.profile as GameProfile).id === 'string' &&
        typeof (parsed.profile as GameProfile).name === 'string'
      ) {
        const importedProf = parsed.profile as GameProfile;
        targetProfileId = importedProf.id;
        const exists = profiles.some((p) => p.id === importedProf.id);
        if (!exists) {
          setLocalCustomProfiles((prev) => [{ ...importedProf, isCustom: true }, ...prev]);
        }
        setActiveProfile(importedProf);
      }

      setWorkspaces((prev) => {
        const current = prev[targetProfileId] || getStarterWorkspaceForProfile(targetProfileId, 'empty');
        return {
          ...prev,
          [targetProfileId]: {
            ...current,
            missions: validMissions,
            collectibles: validCollectibles,
            vehicles: validVehicles,
            objectives: validObjectives,
            notes: validNotes,
            mapMarkers: validMarkers,
            customMapUrl: importedMapUrl,
            activityLog: appendActivity(current, 'note', 'JSON backup imported'),
          },
        };
      });

      return { ok: true };
    } catch {
      return { ok: false, error: 'Unable to parse file: invalid JSON syntax.' };
    }
  };

  const restoreSnapshotData = (snapshot: {
    profileId?: string;
    missions: Mission[];
    collectibles: Collectible[];
    vehicles: Vehicle[];
    objectives: Objective[];
    notes: TacticalNote[];
    mapMarkers?: MapMarker[];
    customMapUrl?: string;
  }): RestoreSnapshotResult => {
    const targetId =
      snapshot.profileId && profiles.some((p) => p.id === snapshot.profileId)
        ? snapshot.profileId
        : activeProfile.id;

    if (targetId !== activeProfile.id) {
      selectProfileById(targetId);
    }

    const existingWs =
      workspaces[targetId] || getStarterWorkspaceForProfile(targetId, 'empty');

    // Preserve local base64 vehicle images when Cloud snapshot stripped them due to Firestore limits
    let preservedLocalImages = 0;
    const localVehicleImageMap = new Map<string, string>();
    for (const v of existingWs.vehicles) {
      if (v.imageUrl) {
        localVehicleImageMap.set(v.id, v.imageUrl);
      }
    }

    const mergedVehicles = Array.isArray(snapshot.vehicles)
      ? snapshot.vehicles.map((v) => {
          const safeCloudImg = sanitizeVehicleImage(v.imageUrl);
          if (safeCloudImg) return { ...v, imageUrl: safeCloudImg };
          const localFallback = localVehicleImageMap.get(v.id);
          if (localFallback) {
            preservedLocalImages += 1;
            return { ...v, imageUrl: localFallback };
          }
          return v;
        })
      : existingWs.vehicles;

    const restoredCustomMap =
      typeof snapshot.customMapUrl === 'string' && isValidImageUrl(snapshot.customMapUrl)
        ? snapshot.customMapUrl.trim()
        : existingWs.customMapUrl;

    setWorkspaces((prev) => {
      const current = prev[targetId] || getStarterWorkspaceForProfile(targetId, 'empty');
      return {
        ...prev,
        [targetId]: {
          ...current,
          missions: Array.isArray(snapshot.missions) ? snapshot.missions : current.missions,
          collectibles: Array.isArray(snapshot.collectibles)
            ? snapshot.collectibles
            : current.collectibles,
          vehicles: mergedVehicles,
          objectives: Array.isArray(snapshot.objectives) ? snapshot.objectives : current.objectives,
          notes: Array.isArray(snapshot.notes) ? snapshot.notes : current.notes,
          mapMarkers: Array.isArray(snapshot.mapMarkers) ? snapshot.mapMarkers : current.mapMarkers,
          customMapUrl: restoredCustomMap,
          activityLog: appendActivity(current, 'note', 'Cloud Snapshot restored'),
        },
      };
    });

    return { restoredProfileId: targetId, preservedLocalImages };
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
        selectProfileById,
        setSyncedCustomProfiles,
        addLocalCustomProfile,
        updateLocalCustomProfile,
        removeLocalCustomProfile,
        storageError,
        clearStorageError: () => setStorageError(null),
        missions: activeWorkspace.missions,
        toggleMissionStatus,
        toggleMissionStep,
        addMission,
        updateMission,
        addMissionStep,
        removeMissionStep,
        deleteMission,
        collectibles: activeWorkspace.collectibles,
        toggleCollectible,
        addCollectible,
        updateCollectible,
        deleteCollectible,
        vehicles: activeWorkspace.vehicles,
        toggleVehicleUnlocked,
        toggleVehicleFavorite,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        objectives: activeWorkspace.objectives,
        toggleObjective,
        stepObjectiveProgress,
        addObjective,
        updateObjective,
        deleteObjective,
        notes: activeWorkspace.notes,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        mapMarkers: activeWorkspace.mapMarkers,
        addMapMarker,
        deleteMapMarker,
        customMapUrl: activeWorkspace.customMapUrl,
        setCustomMapUrl,
        activityLog: activeWorkspace.activityLog,
        progressEvents,
        sessionHistory,
        sessionSeconds,
        totalTrackedSeconds,
        overallProgress,
        stats,
        globalMultiGameStats,
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
