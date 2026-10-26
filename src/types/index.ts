export type TabType =
  | 'home'
  | 'missions'
  | 'collectibles'
  | 'vehicles'
  | 'objectives'
  | 'notes'
  | 'spec'
  | 'stats';

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

export interface GameProfile {
  id: string;
  name: string;
  universe: string;
  playerTag: string;
  avatarIcon: string;
}

/* ==========================================================================
   Pré-production v3 (MVP) — modèles du document de cadrage
   ========================================================================== */

export type SpecSectionId =
  | 'vision'
  | 'boucle'
  | 'vehicules'
  | 'compagnons'
  | 'raids'
  | 'monetisation'
  | 'technique'
  | 'onboarding'
  | 'kpis'
  | 'roadmap';

export interface V3Change {
  id: string;
  title: string;
  description: string;
  impact: string;
  tone: 'cyan' | 'emerald' | 'amber' | 'rose' | 'violet';
}

export interface ApacStat {
  value: string;
  label: string;
  detail: string;
}

export interface LoopStep {
  id: string;
  duration: string;
  title: string;
  description: string;
}

export interface Incubator {
  id: number;
  label: string;
  unlock: string;
  cost: string;
  detail: string;
  paid: boolean;
}

export type VehiclePhaseId = 'phase-0' | 'phase-1' | 'phase-1-ultime' | 'phase-2' | 'phase-4';

export interface VehiclePhase {
  id: VehiclePhaseId;
  phase: string;
  vehicle: string;
  technical: string;
  role: string;
  delivered: boolean;
}

export type Rarity = 'commune' | 'rare' | 'epique' | 'legendaire' | 'mythique';

export interface RarityTier {
  id: Rarity;
  label: string;
  chance: number;
  companions: number;
  textClass: string;
  bgClass: string;
  borderClass: string;
  barClass: string;
}

export type EggId = 'celeste' | 'automne' | 'abysses';

export interface Egg {
  id: EggId;
  name: string;
  theme: string;
  icon: string;
  accentClass: string;
}

export interface CompanionBonus {
  /** Pièces générées par minute dans le Sanctuaire. */
  production: number;
  /** Bonus en % sur les pièces gagnées en drift. */
  style: number;
  /** Rayon d'aimant additionnel, en studs. */
  magnet: number;
  /** Réduction en % des pièces pillables lors d'un raid. */
  defense: number;
  /** Bonus de chance d'œuf affiché, en %. */
  luck: number;
}

export interface Companion {
  id: string;
  name: string;
  egg: EggId;
  rarity: Rarity;
  element: string;
  bonus: CompanionBonus;
  blurb: string;
}

export interface BonusRule {
  id: string;
  label: string;
  allowed: boolean;
  impact: string;
}

export interface Variant {
  id: string;
  label: string;
  multiplier: number;
  rule: string;
  textClass: string;
}

export interface RaidRule {
  id: string;
  title: string;
  description: string;
  allowed: boolean;
}

export interface MonetizationRule {
  id: string;
  title: string;
  description: string;
}

export interface TechPillar {
  id: string;
  title: string;
  detail: string;
  metric?: string;
}

export interface OnboardingBeat {
  id: string;
  window: string;
  title: string;
  description: string;
}

export type KpiTier = 'platinum' | 'gold' | 'silver' | 'bronze';

export interface Kpi {
  id: string;
  label: string;
  ambition: string;
  threshold: string;
  ambitionValue: number;
  thresholdValue: number;
  unit: string;
  /** true lorsque la valeur basse est la meilleure (ex. taux de crash). */
  inverted?: boolean;
  lever: string;
  tier: KpiTier;
}

export interface RoadmapPhase {
  id: string;
  phase: string;
  window: string;
  scope: string;
  deliverables: string[];
  gate?: string;
  status: 'done' | 'active' | 'locked';
}
