import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import {
  UserAccountProfile,
  GameProfile,
  CloudSnapshotRecord,
  CreatorInquiryInput,
  UniverseTheme,
  StreamPlatform,
  Mission,
  Collectible,
  Vehicle,
  Objective,
  TacticalNote,
} from '../types';

interface AuthContextType {
  user: User | null;
  account: UserAccountProfile | null;
  isAuthReady: boolean;
  isSigningIn: boolean;
  authError: string | null;
  customProfiles: GameProfile[];
  cloudSnapshots: CloudSnapshotRecord[];
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<void>;
  updateAccountProfile: (updates: {
    displayName: string;
    gamerTag: string;
    streamChannel: string;
    streamPlatform: StreamPlatform;
    preferredTheme: UniverseTheme;
  }) => Promise<void>;
  createCustomProfile: (profile: {
    name: string;
    universe: string;
    playerTag: string;
    avatarIcon: 'Sun' | 'Zap' | 'Flame' | 'Gamepad2';
    theme: UniverseTheme;
  }) => Promise<GameProfile | null>;
  deleteCustomProfile: (profileId: string) => Promise<void>;
  saveCloudSnapshot: (payload: {
    profileId: string;
    profileName: string;
    overallProgress: number;
    missionsDone: number;
    missionsTotal: number;
    collectiblesDone: number;
    collectiblesTotal: number;
    missions: Mission[];
    collectibles: Collectible[];
    vehicles: Vehicle[];
    objectives: Objective[];
    notes: TacticalNote[];
  }) => Promise<boolean>;
  deleteCloudSnapshot: (snapshotId: string) => Promise<void>;
  submitCreatorInquiry: (input: CreatorInquiryInput) => Promise<{ ok: boolean; id?: string; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const sanitizeStr = (value: string, maxLen: number, fallback = ''): string => {
  const trimmed = (value || '').trim();
  if (!trimmed) return fallback;
  return trimmed.slice(0, maxLen);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<UserAccountProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [customProfiles, setCustomProfiles] = useState<GameProfile[]>([]);
  const [cloudSnapshots, setCloudSnapshots] = useState<CloudSnapshotRecord[]>([]);

  // Ensure /users/{uid} exists on login
  const ensureUserAccountDoc = useCallback(async (firebaseUser: User) => {
    const userPath = `users/${firebaseUser.uid}`;
    const userRef = doc(db, 'users', firebaseUser.uid);

    try {
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        const displayName = sanitizeStr(firebaseUser.displayName || 'JITALX Player', 80, 'JITALX Player');
        const email = sanitizeStr(firebaseUser.email || '', 160, 'player@jitalx.app');
        const photoURL = sanitizeStr(firebaseUser.photoURL || '', 500, '');
        const gamerTag = sanitizeStr(
          (firebaseUser.displayName || 'Runner').replace(/\s+/g, '_'),
          40,
          'Runner_01'
        );

        await setDoc(userRef, {
          uid: firebaseUser.uid,
          displayName,
          email,
          photoURL,
          gamerTag,
          streamChannel: '',
          streamPlatform: 'twitch',
          preferredTheme: 'sunset-neon',
          subscriptionTier: 'free',
          subscriptionStatus: 'active',
          stripeCustomerId: '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, userPath);
    }
  }, []);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthReady(true);

      if (!firebaseUser) {
        setAccount(null);
        setCustomProfiles([]);
        setCloudSnapshots([]);
        return;
      }

      try {
        await ensureUserAccountDoc(firebaseUser);
      } catch (err) {
        console.error('Account sync error:', err);
      }
    });

    return () => unsubscribe();
  }, [ensureUserAccountDoc]);

  // Real-time listeners for authenticated user's account, custom profiles, and cloud snapshots
  useEffect(() => {
    if (!isAuthReady || !user) return;

    const userPath = `users/${user.uid}`;
    const unsubUser = onSnapshot(
      doc(db, 'users', user.uid),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setAccount({
            uid: data.uid,
            displayName: data.displayName,
            email: data.email,
            photoURL: data.photoURL || '',
            gamerTag: data.gamerTag || 'Runner_01',
            streamChannel: data.streamChannel || '',
            streamPlatform: (data.streamPlatform as StreamPlatform) || 'twitch',
            preferredTheme: (data.preferredTheme as UniverseTheme) || 'sunset-neon',
            subscriptionTier: data.subscriptionTier || 'free',
            subscriptionStatus: data.subscriptionStatus || 'active',
            stripeCustomerId: data.stripeCustomerId || '',
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, userPath);
      }
    );

    const profilesPath = `users/${user.uid}/customProfiles`;
    const profilesQuery = query(
      collection(db, 'users', user.uid, 'customProfiles'),
      where('ownerId', '==', user.uid)
    );
    const unsubProfiles = onSnapshot(
      profilesQuery,
      (snapshot) => {
        const list: GameProfile[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name,
            universe: data.universe,
            playerTag: data.playerTag,
            avatarIcon: data.avatarIcon || 'Gamepad2',
            theme: (data.theme as UniverseTheme) || 'sunset-neon',
            isCustom: true,
          };
        });
        setCustomProfiles(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, profilesPath);
      }
    );

    const snapshotsPath = `users/${user.uid}/cloudSnapshots`;
    const snapshotsQuery = query(
      collection(db, 'users', user.uid, 'cloudSnapshots'),
      where('ownerId', '==', user.uid)
    );
    const unsubSnapshots = onSnapshot(
      snapshotsQuery,
      (snapshot) => {
        const list: CloudSnapshotRecord[] = snapshot.docs
          .map((d) => {
            const data = d.data();
            const ts = data.updatedAt as Timestamp | undefined;
            return {
              id: d.id,
              ownerId: data.ownerId,
              profileId: data.profileId,
              profileName: data.profileName,
              overallProgress: data.overallProgress ?? 0,
              missionsDone: data.missionsDone ?? 0,
              missionsTotal: data.missionsTotal ?? 0,
              collectiblesDone: data.collectiblesDone ?? 0,
              collectiblesTotal: data.collectiblesTotal ?? 0,
              missions: Array.isArray(data.missions) ? data.missions : [],
              collectibles: Array.isArray(data.collectibles) ? data.collectibles : [],
              vehicles: Array.isArray(data.vehicles) ? data.vehicles : [],
              objectives: Array.isArray(data.objectives) ? data.objectives : [],
              notes: Array.isArray(data.notes) ? data.notes : [],
              updatedAtMs: ts && typeof ts.toMillis === 'function' ? ts.toMillis() : Date.now(),
            };
          })
          .sort((a, b) => (b.updatedAtMs || 0) - (a.updatedAtMs || 0));
        setCloudSnapshots(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, snapshotsPath);
      }
    );

    return () => {
      unsubUser();
      unsubProfiles();
      unsubSnapshots();
    };
  }, [isAuthReady, user]);

  const signInWithGoogle = async (): Promise<boolean> => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      return true;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Connexion Google annulée ou bloquée.';
      setAuthError(msg);
      return false;
    } finally {
      setIsSigningIn(false);
    }
  };

  const signOut = async () => {
    setAuthError(null);
    await firebaseSignOut(auth);
  };

  const updateAccountProfile = async (updates: {
    displayName: string;
    gamerTag: string;
    streamChannel: string;
    streamPlatform: StreamPlatform;
    preferredTheme: UniverseTheme;
  }) => {
    if (!user) return;
    const path = `users/${user.uid}`;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: sanitizeStr(updates.displayName, 80, user.displayName || 'JITALX Player'),
        gamerTag: sanitizeStr(updates.gamerTag, 40, 'Runner_01'),
        streamChannel: sanitizeStr(updates.streamChannel, 120, ''),
        streamPlatform: updates.streamPlatform,
        preferredTheme: updates.preferredTheme,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const createCustomProfile = async (profile: {
    name: string;
    universe: string;
    playerTag: string;
    avatarIcon: 'Sun' | 'Zap' | 'Flame' | 'Gamepad2';
    theme: UniverseTheme;
  }): Promise<GameProfile | null> => {
    if (!user) return null;
    const profileId = `prof_${Date.now()}`;
    const path = `users/${user.uid}/customProfiles/${profileId}`;
    const cleanName = sanitizeStr(profile.name, 60, 'Nouvel Univers');
    const cleanUniverse = sanitizeStr(profile.universe, 60, 'Monde Ouvert');
    const cleanTag = sanitizeStr(profile.playerTag, 40, 'Runner_01');

    try {
      await setDoc(doc(db, 'users', user.uid, 'customProfiles', profileId), {
        ownerId: user.uid,
        name: cleanName,
        universe: cleanUniverse,
        playerTag: cleanTag,
        avatarIcon: profile.avatarIcon,
        theme: profile.theme,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return {
        id: profileId,
        name: cleanName,
        universe: cleanUniverse,
        playerTag: cleanTag,
        avatarIcon: profile.avatarIcon,
        theme: profile.theme,
        isCustom: true,
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const deleteCustomProfile = async (profileId: string) => {
    if (!user) return;
    const path = `users/${user.uid}/customProfiles/${profileId}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'customProfiles', profileId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const saveCloudSnapshot = async (payload: {
    profileId: string;
    profileName: string;
    overallProgress: number;
    missionsDone: number;
    missionsTotal: number;
    collectiblesDone: number;
    collectiblesTotal: number;
    missions: Mission[];
    collectibles: Collectible[];
    vehicles: Vehicle[];
    objectives: Objective[];
    notes: TacticalNote[];
  }): Promise<boolean> => {
    if (!user) return false;
    const snapshotId = `snap_${Date.now()}`;
    const path = `users/${user.uid}/cloudSnapshots/${snapshotId}`;

    try {
      await setDoc(doc(db, 'users', user.uid, 'cloudSnapshots', snapshotId), {
        ownerId: user.uid,
        profileId: sanitizeStr(payload.profileId, 64, 'sunset-neon'),
        profileName: sanitizeStr(payload.profileName, 60, 'Sunset Néon'),
        overallProgress: Math.max(0, Math.min(100, Math.round(payload.overallProgress))),
        missionsDone: Math.max(0, Math.min(500, Math.round(payload.missionsDone))),
        missionsTotal: Math.max(0, Math.min(500, Math.round(payload.missionsTotal))),
        collectiblesDone: Math.max(0, Math.min(500, Math.round(payload.collectiblesDone))),
        collectiblesTotal: Math.max(0, Math.min(500, Math.round(payload.collectiblesTotal))),
        missions: payload.missions.slice(0, 100),
        collectibles: payload.collectibles.slice(0, 150),
        vehicles: payload.vehicles.slice(0, 100),
        objectives: payload.objectives.slice(0, 100),
        notes: payload.notes.slice(0, 100),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const deleteCloudSnapshot = async (snapshotId: string) => {
    if (!user) return;
    const path = `users/${user.uid}/cloudSnapshots/${snapshotId}`;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'cloudSnapshots', snapshotId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const submitCreatorInquiry = async (
    input: CreatorInquiryInput
  ): Promise<{ ok: boolean; id?: string; error?: string }> => {
    if (!user) {
      return {
        ok: false,
        error: 'Please sign in with Google first to submit a verified inquiry, or use the direct email option below.',
      };
    }

    const inquiryId = `inq_${Date.now()}`;
    const path = `creatorInquiries/${inquiryId}`;

    try {
      await setDoc(doc(db, 'creatorInquiries', inquiryId), {
        ownerId: user.uid,
        name: sanitizeStr(input.name, 80, user.displayName || 'Creator'),
        email: sanitizeStr(input.email, 160, user.email || ''),
        channelUrl: sanitizeStr(input.channelUrl, 240, ''),
        platform: input.platform,
        inquiryType: input.inquiryType,
        message: sanitizeStr(input.message, 1500, ''),
        status: 'received',
        createdAt: serverTimestamp(),
      });
      return { ok: true, id: inquiryId };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        account,
        isAuthReady,
        isSigningIn,
        authError,
        customProfiles,
        cloudSnapshots,
        signInWithGoogle,
        signOut,
        updateAccountProfile,
        createCustomProfile,
        deleteCustomProfile,
        saveCloudSnapshot,
        deleteCloudSnapshot,
        submitCreatorInquiry,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
