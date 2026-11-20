export type TabType = 'home' | 'missions' | 'collectibles' | 'vehicles' | 'objectives' | 'notes' | 'stats';

export type AppRoute = 'landing' | 'app' | 'demo' | 'pricing' | 'streamers' | 'account' | 'overlay';

export type MissionType = 'main' | 'side' | 'bounty' | 'activity';
export type MissionStatus = 'available' | 'in_progress' | 'completed';

export interface MissionStep {
  id: string;
  text: string;
  completed: boolean;
}

export interface Mission {
  id: string;
  title: string;
  type: MissionType;
  district: string;
  giver: string;
  description: string;
  rewardXp: number;
  rewardCredits: number;
  status: MissionStatus;
  steps: MissionStep[];
  priority?: boolean;
}

export type CollectibleCategory = 'relic' | 'cache' | 'audio_log' | 'blueprint' | 'easter_egg';

export interface Collectible {
  id: string;
  name: string;
  category: CollectibleCategory;
  district: string;
  hint: string;
  collected: boolean;
  coordinates?: string;
}

export type VehicleCategory = 'sport' | 'muscle' | 'moto' | 'offroad' | 'heavy';

export interface Vehicle {
  id: string;
  name: string;
  category: VehicleCategory;
  manufacturer: string;
  speed: number; // 0-100
  handling: number; // 0-100
  armor: number; // 0-100
  unlocked: boolean;
  location: string;
  isFavorite?: boolean;
  notes?: string;
}

export type ObjectiveTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Objective {
  id: string;
  title: string;
  description: string;
  tier: ObjectiveTier;
  progress: number;
  maxProgress: number;
  completed: boolean;
  category: string;
}

export interface TacticalNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  updatedAt: string;
}

export type UniverseTheme = 'sunset-neon' | 'cyber-grid' | 'open-world';

export interface GameProfile {
  id: string;
  name: string;
  universe: string;
  playerTag: string;
  avatarIcon: string;
  theme?: UniverseTheme;
  isCustom?: boolean;
}

export type SubscriptionTier = 'free' | 'pro_monthly' | 'lifetime' | 'creator';
export type SubscriptionStatus = 'active' | 'inactive' | 'pending_stripe';
export type StreamPlatform = 'twitch' | 'youtube' | 'tiktok' | 'kick' | 'multi';

export interface UserAccountProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  gamerTag: string;
  streamChannel: string;
  streamPlatform: StreamPlatform;
  preferredTheme: UniverseTheme;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  stripeCustomerId: string;
}

export interface CloudSnapshotRecord {
  id: string;
  ownerId: string;
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
  updatedAtMs?: number;
}

export type InquiryPlatform = 'twitch' | 'youtube' | 'tiktok' | 'kick' | 'agency' | 'other';
export type InquiryType = 'creator_partnership' | 'streamer_access' | 'press_media' | 'commercial';

export interface CreatorInquiryInput {
  name: string;
  email: string;
  channelUrl: string;
  platform: InquiryPlatform;
  inquiryType: InquiryType;
  message: string;
}
