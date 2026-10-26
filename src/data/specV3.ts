import {
  ApacStat,
  BonusRule,
  Companion,
  Egg,
  Incubator,
  Kpi,
  LoopStep,
  MonetizationRule,
  OnboardingBeat,
  RaidRule,
  RarityTier,
  RoadmapPhase,
  TechPillar,
  V3Change,
  Variant,
  VehiclePhase,
} from '../types';

/** Métadonnées du document de pré-production. */
export const SPEC_META = {
  title: 'Structure du jeu v3',
  subtitle: 'Document de pré-production (MVP)',
  version: 'v3',
  date: '26 oct. 2026',
  author: '@jonas',
  launchRegion: 'Montagne des Temples / Vallée des Cerisiers',
  phase1Budget: '180 – 250 heures',
  maxPlayersPerServer: 12,
  placeGapStuds: 10000,
  targetDevice: 'Android 2 Go de RAM · 60 FPS',
};

/** Les six évolutions structurantes de la v3 par rapport à la v2. */
export const V3_CHANGES: V3Change[] = [
  {
    id: 'dragon-day-one',
    title: 'Dragon présent dès le jour 1',
    description:
      'Le vol libre reste en Phase 2, mais le dragon existe immédiatement en compagnon et via l’ultime « Mode Esprit du Dragon ».',
    impact: 'Aucune déception face au titre et à la vignette',
    tone: 'violet',
  },
  {
    id: 'fair-racing',
    title: 'Équité absolue en course (0 % pay-to-win)',
    description:
      'Le bonus de recharge de la jauge de drift est supprimé : plus de boosts = vitesse moyenne supérieure. Les compagnons n’influencent que l’économie, l’aimant et la défense.',
    impact: 'Aucun avantage de pilotage achetable',
    tone: 'emerald',
  },
  {
    id: 'no-permanent-loss',
    title: 'Zéro perte définitive lors des raids',
    description:
      'Le vol d’œufs en incubateur est abandonné. Un raid pille uniquement les pièces non récoltées et endort temporairement les compagnons.',
    impact: 'Aucun compagnon ni œuf perdu',
    tone: 'cyan',
  },
  {
    id: 'unified-server',
    title: 'Architecture serveur unifiée',
    description:
      'Sanctuaire et piste cohabitent dans la même Place, éloignés de 10 000 studs, pour supprimer les écrans de chargement de 5 à 12 s liés à TeleportService.',
    impact: 'Transition Torii en moins d’une seconde',
    tone: 'amber',
  },
  {
    id: 'launch-region',
    title: 'Nouvelle région de lancement',
    description:
      'Montagne des Temples / Vallée des Cerisiers remplace Néon City pour garantir 60 FPS sur les smartphones Android de 2 Go de RAM.',
    impact: 'Néon City repoussée en Phase 3',
    tone: 'rose',
  },
  {
    id: 'active-incubation',
    title: 'Incubation active plutôt qu’attente passive',
    description:
      'Un œuf demande 10 minutes, mais chaque course terminée retire 3 minutes. Deux courses font éclore l’œuf au retour au Sanctuaire.',
    impact: 'Boucle courte de 2 minutes',
    tone: 'cyan',
  },
];

/** Données de cadrage du marché Asie-Pacifique. */
export const APAC_STATS: ApacStat[] = [
  {
    value: '~30 %',
    label: 'des joueurs quotidiens de Roblox',
    detail: 'Statista, via VoxBooster',
  },
  {
    value: '+96 %',
    label: 'de bookings APAC au T4 2025',
    detail: 'Japon +160 % · Indonésie +700 %',
  },
  {
    value: '−13 %',
    label: 'de bookings moyens par joueur payant en 2025',
    detail: 'RoWatcher — afflux de joueurs issus de marchés émergents',
  },
];

export const APAC_MARKETS = ['Indonésie', 'Vietnam', 'Thaïlande', 'Philippines', 'Japon'];

/** Boucle courte de 2 minutes. */
export const LOOP_STEPS: LoopStep[] = [
  {
    id: 'race',
    duration: '1 min 30',
    title: 'Course d’arcade',
    description: 'Le joueur court, drifte et ramasse des pièces et des œufs sur la piste.',
  },
  {
    id: 'incubation',
    duration: '−3 min',
    title: 'Réduction du temps d’incubation',
    description:
      'Chaque course terminée retire 3 minutes au compteur de 10 minutes de l’œuf en incubation.',
  },
  {
    id: 'hatch',
    duration: '30 s',
    title: 'Éclosion et gestion',
    description:
      'Deux courses (4 min réelles + 6 min retirées) font éclore l’œuf. Le joueur équipe ses compagnons, récolte ses pièces ou lance une course de revanche.',
  },
];

export const INCUBATION_BASE_MINUTES = 10;
export const INCUBATION_REDUCTION_MINUTES = 3;

/** Économie des incubateurs. */
export const INCUBATORS: Incubator[] = [
  {
    id: 1,
    label: 'Incubateur 1',
    unlock: 'Gratuit dès le départ',
    cost: '0 pièce',
    detail: 'Toujours disponible, y compris pendant l’onboarding (éclosion scriptée du premier œuf).',
    paid: false,
  },
  {
    id: 2,
    label: 'Incubateur 2',
    unlock: 'Déblocable en pièces de jeu',
    cost: '≈ 15 min de jeu',
    detail: 'Premier objectif de rétention : la cible est atteinte en environ 15 minutes.',
    paid: false,
  },
  {
    id: 3,
    label: 'Incubateur 3',
    unlock: 'GamePass',
    cost: 'Robux',
    detail: 'Le GamePass réduit de 3 minutes le temps des 4 œufs simultanément à chaque course.',
    paid: true,
  },
  {
    id: 4,
    label: 'Incubateur 4',
    unlock: 'GamePass',
    cost: 'Robux',
    detail: 'Même Pass que l’incubateur 3 : aucune vente séparée, aucun avantage de pilotage.',
    paid: true,
  },
];


/** Véhicules et physique par phase. */
export const VEHICLE_PHASES: VehiclePhase[] = [
  {
    id: 'phase-0',
    phase: 'Phase 0 · Prototype',
    vehicle: 'Voiture de drift',
    technical: 'Contrôleur par sphère (SphereCast type Mario Kart)',
    role: 'Valider le drift tactile et la boucle Sanctuaire en boîte grise.',
    delivered: true,
  },
  {
    id: 'phase-1',
    phase: 'Phase 1 · Lancement',
    vehicle: 'Voiture et Moto',
    technical: 'Même contrôleur physique, seuls le modèle 3D, l’inclinaison et les effets changent',
    role: 'Deux silhouettes jouables sans doubler le budget physique.',
    delivered: true,
  },
  {
    id: 'phase-1-ultime',
    phase: 'Phase 1 · Ultime',
    vehicle: 'Esprit du Dragon',
    technical: 'Jauge de drift pleine → aura de dragon 5 s, lévitation assistée, pièces doublées',
    role: 'Présence du dragon dès le jour 1, sans vol libre.',
    delivered: true,
  },
  {
    id: 'phase-2',
    phase: 'Phase 2',
    vehicle: 'Dragon volant',
    technical: 'Physique de vol plané et caméra 3D dédiées',
    role: 'Ajouté une fois la rentabilité du jeu prouvée.',
    delivered: false,
  },
  {
    id: 'phase-4',
    phase: 'Phase 4',
    vehicle: 'Hors-bord',
    technical: 'Physique aquatique',
    role: 'Réservé à l’extension des Îles Tropicales.',
    delivered: false,
  },
];

/** Paliers de rareté : les probabilités sont affichées telles quelles en jeu. */
export const RARITIES: RarityTier[] = [
  {
    id: 'commune',
    label: 'Commun',
    chance: 55,
    companions: 3,
    textClass: 'text-slate-300',
    bgClass: 'bg-slate-500/10',
    borderClass: 'border-slate-500/40',
    barClass: 'bg-slate-400',
  },
  {
    id: 'rare',
    label: 'Rare',
    chance: 30,
    companions: 3,
    textClass: 'text-sky-300',
    bgClass: 'bg-sky-500/10',
    borderClass: 'border-sky-500/40',
    barClass: 'bg-sky-400',
  },
  {
    id: 'epique',
    label: 'Épique',
    chance: 12,
    companions: 3,
    textClass: 'text-violet-300',
    bgClass: 'bg-violet-500/10',
    borderClass: 'border-violet-500/40',
    barClass: 'bg-violet-400',
  },
  {
    id: 'legendaire',
    label: 'Légendaire',
    chance: 2.9,
    companions: 3,
    textClass: 'text-amber-300',
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-amber-500/40',
    barClass: 'bg-amber-400',
  },
  {
    id: 'mythique',
    label: 'Mythique',
    chance: 0.1,
    companions: 3,
    textClass: 'text-rose-300',
    bgClass: 'bg-rose-500/10',
    borderClass: 'border-rose-500/40',
    barClass: 'bg-rose-400',
  },
];

/** Système de pity affiché en permanence au-dessus de l’œuf. */
export const PITY = {
  epicEvery: 10,
  legendaryEvery: 40,
};

/** Trois œufs de lancement, un compagnon par palier dans chacun. */
export const EGGS: Egg[] = [
  {
    id: 'celeste',
    name: 'Œuf Céleste',
    theme: 'Montagne des Temples',
    icon: 'Mountain',
    accentClass: 'text-cyan-300',
  },
  {
    id: 'automne',
    name: 'Œuf d’Automne',
    theme: 'Vallée des Cerisiers',
    icon: 'Leaf',
    accentClass: 'text-amber-300',
  },
  {
    id: 'abysses',
    name: 'Œuf des Abysses',
    theme: 'Teasing Îles Tropicales',
    icon: 'Waves',
    accentClass: 'text-sky-300',
  },
];


/**
 * 15 compagnons = 3 œufs × 5 paliers (le document fixe les pourcentages, pas les noms).
 * Les valeurs de bonus ci-dessous sont des propositions d'équilibrage : elles ne touchent
 * jamais la vitesse ni la recharge de boost (interdiction stricte du document).
 */
export const COMPANIONS: Companion[] = [
  {
    id: 'bebe-sakura',
    name: 'Bébé Sakura',
    egg: 'celeste',
    rarity: 'commune',
    element: 'Fleur',
    bonus: { production: 4, style: 3, magnet: 0, defense: 2, luck: 0 },
    blurb: 'Un dragonnet qui laisse tomber des pétales sur le coffre du Sanctuaire.',
  },
  {
    id: 'renard-kitsune',
    name: 'Renard Kitsune',
    egg: 'celeste',
    rarity: 'rare',
    element: 'Illusion',
    bonus: { production: 9, style: 6, magnet: 4, defense: 5, luck: 5 },
    blurb: 'Ses queues attirent les pièces perdues en bord de piste.',
  },
  {
    id: 'grue-de-jade',
    name: 'Grue de Jade',
    egg: 'celeste',
    rarity: 'epique',
    element: 'Vent',
    bonus: { production: 20, style: 10, magnet: 8, defense: 9, luck: 12 },
    blurb: 'Elle veille sur les temples et double la valeur des drifts les plus longs.',
  },
  {
    id: 'qilin-celeste',
    name: 'Qilin Céleste',
    egg: 'celeste',
    rarity: 'legendaire',
    element: 'Foudre',
    bonus: { production: 44, style: 16, magnet: 12, defense: 14, luck: 25 },
    blurb: 'Sa corne lumineuse repousse les raids les plus ambitieux.',
  },
  {
    id: 'dragon-originel',
    name: 'Dragon Originel',
    egg: 'celeste',
    rarity: 'mythique',
    element: 'Esprit',
    bonus: { production: 90, style: 25, magnet: 18, defense: 20, luck: 50 },
    blurb: 'La créature du titre : présente dès l’onboarding, jamais volante avant la Phase 2.',
  },
  {
    id: 'moineau-de-papier',
    name: 'Moineau de Papier',
    egg: 'automne',
    rarity: 'commune',
    element: 'Origami',
    bonus: { production: 4, style: 3, magnet: 1, defense: 2, luck: 0 },
    blurb: 'Plié dans un éclat de cerisier, il rapporte quelques pièces par minute.',
  },
  {
    id: 'tanuki-des-brumes',
    name: 'Tanuki des Brumes',
    egg: 'automne',
    rarity: 'rare',
    element: 'Brouillard',
    bonus: { production: 8, style: 7, magnet: 4, defense: 6, luck: 5 },
    blurb: 'Il brouille la piste des attaquants et gonfle le butin de drift.',
  },
  {
    id: 'oni-cornu',
    name: 'Oni Cornu',
    egg: 'automne',
    rarity: 'epique',
    element: 'Braise',
    bonus: { production: 18, style: 11, magnet: 8, defense: 10, luck: 12 },
    blurb: 'Endormi par un raid ? Il se réveille en colère et double la défense un cycle.',
  },
  {
    id: 'tengu-masque',
    name: 'Tengu Masqué',
    egg: 'automne',
    rarity: 'legendaire',
    element: 'Rafale',
    bonus: { production: 46, style: 16, magnet: 12, defense: 13, luck: 25 },
    blurb: 'Son éventail balaie la piste et aspire les éclats hors trajectoire.',
  },
  {
    id: 'kitsune-neuf-queues',
    name: 'Kitsune à Neuf Queues',
    egg: 'automne',
    rarity: 'mythique',
    element: 'Lune',
    bonus: { production: 86, style: 25, magnet: 18, defense: 20, luck: 50 },
    blurb: 'Chaque queue est une variante cosmétique : Normal, Doré, Arc-en-ciel.',
  },
  {
    id: 'lanternon',
    name: 'Lanternon',
    egg: 'abysses',
    rarity: 'commune',
    element: 'Lumière',
    bonus: { production: 5, style: 3, magnet: 1, defense: 2, luck: 0 },
    blurb: 'Une lanterne flottante qui éclaire le coffre la nuit tombée.',
  },
  {
    id: 'carpe-koi',
    name: 'Carpe Koï',
    egg: 'abysses',
    rarity: 'rare',
    element: 'Eau',
    bonus: { production: 10, style: 6, magnet: 5, defense: 5, luck: 5 },
    blurb: 'Elle remonte le courant des pièces et les pousse vers l’aimant.',
  },
  {
    id: 'tortue-de-corail',
    name: 'Tortue de Corail',
    egg: 'abysses',
    rarity: 'epique',
    element: 'Récif',
    bonus: { production: 19, style: 10, magnet: 9, defense: 11, luck: 12 },
    blurb: 'Sa carapace minérale est la meilleure défense du Sanctuaire.',
  },
  {
    id: 'ryu-des-abysses',
    name: 'Ryū des Abysses',
    egg: 'abysses',
    rarity: 'legendaire',
    element: 'Marée',
    bonus: { production: 42, style: 15, magnet: 13, defense: 15, luck: 25 },
    blurb: 'Annonce l’extension Îles Tropicales et le futur hors-bord.',
  },
  {
    id: 'leviathan-de-jade',
    name: 'Léviathan de Jade',
    egg: 'abysses',
    rarity: 'mythique',
    element: 'Profondeur',
    bonus: { production: 92, style: 24, magnet: 20, defense: 20, luck: 50 },
    blurb: 'Le palier 0,1 % : visible dans le ciel du Sanctuaire dès le jour 1.',
  },
];

/** Fusion : 3 Normaux = 1 Doré, 3 Dorés = 1 Arc-en-ciel → 15 modèles = 45 variantes. */
export const VARIANTS: Variant[] = [
  {
    id: 'normal',
    label: 'Normal',
    multiplier: 1,
    rule: 'Compagnon obtenu tel quel à l’éclosion.',
    textClass: 'text-slate-200',
  },
  {
    id: 'dore',
    label: 'Doré',
    multiplier: 1.5,
    rule: 'Fusion de 3 exemplaires Normaux du même compagnon.',
    textClass: 'text-amber-300',
  },
  {
    id: 'arc-en-ciel',
    label: 'Arc-en-ciel',
    multiplier: 2.25,
    rule: 'Fusion de 3 exemplaires Dorés : palier maximal de collection.',
    textClass: 'text-cyan-300',
  },
];

/** Matrice des bonus autorisés : la vitesse et la recharge de boost sont interdites. */
export const BONUS_RULES: BonusRule[] = [
  {
    id: 'production',
    label: 'Production de pièces',
    allowed: true,
    impact: 'Génère des pièces par minute dans le Sanctuaire, même hors-ligne.',
  },
  {
    id: 'style',
    label: 'Multiplicateur de style',
    allowed: true,
    impact: 'Augmente les pièces gagnées lors d’un drift en course.',
  },
  {
    id: 'magnet',
    label: 'Rayon d’aimant',
    allowed: true,
    impact: 'Attire les pièces et éclats de plus loin sur la piste.',
  },
  {
    id: 'defense',
    label: 'Défense du Sanctuaire',
    allowed: true,
    impact: 'Réduit le pourcentage de pièces pillables lors d’un raid.',
  },
  {
    id: 'luck',
    label: 'Chance d’œuf',
    allowed: true,
    impact: 'Augmente la chance de raretés supérieures, affichée dans l’interface.',
  },
  {
    id: 'speed',
    label: 'Vitesse ou recharge de boost',
    allowed: false,
    impact: 'Strictement interdit : préserve l’équité entre joueurs gratuits et payants.',
  },
];


/** Fonctionnement des raids : pillage de pièces, sommeil temporaire, zéro perte. */
export const RAID_RULES: RaidRule[] = [
  {
    id: 'steal-coins',
    title: 'Pillage des pièces non récoltées',
    description:
      'Le raid vole une partie du coffre du Sanctuaire. Les pièces déjà récoltées et la progression économique ne sont jamais touchées.',
    allowed: true,
  },
  {
    id: 'sleep-companion',
    title: 'Sommeil temporaire d’un compagnon',
    description:
      'Un compagnon actif cesse de produire jusqu’au réveil d’un clic dans le Sanctuaire ou à une victoire en course de revanche.',
    allowed: true,
  },
  {
    id: 'revenge-ghost',
    title: 'Course de revanche contre le fantôme',
    description:
      'Le fantôme rejoue le chronomètre enregistré de l’attaquant : une victoire réveille immédiatement le compagnon endormi.',
    allowed: true,
  },
  {
    id: 'lose-companion',
    title: 'Vol de compagnon ou d’œuf en incubateur',
    description:
      'Abandonné en v3 : aucun compagnon, aucune variante et aucun œuf ne peut être perdu définitivement.',
    allowed: false,
  },
];

/** Monétisation et conformité légale. */
export const MONETIZATION_RULES: MonetizationRule[] = [
  {
    id: 'transparency',
    title: 'Transparence des probabilités',
    description:
      'Chaque œuf ou jeton payant affiche le pourcentage exact de chaque compagnon avant l’achat.',
  },
  {
    id: 'pity',
    title: 'Système de Pity (garantie)',
    description:
      'Affiché en permanence au-dessus de l’œuf : « Épique garanti tous les 10 œufs — Légendaire garanti tous les 40 œufs ». Les pourcentages se recalculent si un boost de chance est actif.',
  },
  {
    id: 'policyservice',
    title: 'Vérification via PolicyService',
    description:
      'Au chargement, le serveur appelle PolicyService:GetPolicyInfoForPlayerAsync(). Si ArePaidRandomItemsRestricted renvoie true, les œufs aléatoires en Robux sont remplacés par l’achat direct du compagnon ou d’un pack cosmétique à prix fixe.',
  },
  {
    id: 'regional-pricing',
    title: 'Tarification régionale',
    description:
      'Regional Pricing activé sur tous les Passes et Produits Développeurs pour l’Indonésie, le Vietnam, la Thaïlande et les Philippines.',
  },
  {
    id: 'no-p2w',
    title: 'Aucun avantage de pilotage',
    description:
      'Les Robux achètent du temps (incubateurs), de la collection (œufs, chance) et du cosmétique (auras, skins). Jamais de vitesse ni de recharge de boost.',
  },
];

/** Architecture technique mobile (cible 2 Go de RAM). */
export const TECH_PILLARS: TechPillar[] = [
  {
    id: 'single-place',
    title: 'Serveur unique et modulaire',
    detail:
      'Sanctuaire et piste de course dans la même Place, à 10 000 studs d’écart : plus de TeleportService entre les deux.',
    metric: '10 000 studs',
  },
  {
    id: 'streaming',
    title: 'StreamingEnabled + RequestStreamAroundAsync',
    detail:
      'StreamingEnabled en mode Opportunistic, avec Player:RequestStreamAroundAsync() au passage du portail Torii pour une transition sans écran de chargement.',
    metric: '< 1 s',
  },
  {
    id: 'server-size',
    title: 'Instances de 12 joueurs maximum',
    detail:
      'Dimensionnement volontairement bas pour tenir 60 FPS constants avec véhicules et compagnons affichés.',
    metric: '12 joueurs',
  },
  {
    id: 'biome',
    title: 'Biome de lancement léger',
    detail:
      'Lumière du jour et crépuscule doré, couleurs très saturées, peu de sources lumineuses dynamiques. Néon City (pluie, reflets, néons) part en Phase 3.',
    metric: '60 FPS · 2 Go',
  },
  {
    id: 'world-event',
    title: 'Événement mondial inter-serveurs',
    detail:
      'MessagingService et MemoryStoreService synchronisent la jauge mondiale et l’apparition du dragon géant. Récompenses par paliers communautaires et au Top 1 % du classement.',
    metric: 'Tous serveurs',
  },
];

/** Onboarding sans texte des 60 premières secondes. */
export const ONBOARDING_BEATS: OnboardingBeat[] = [
  {
    id: 'beat-0-30',
    window: '0 → 30 s',
    title: 'Descente à pleine vitesse',
    description:
      'Aucun menu d’accueil. Le joueur apparaît lancé sur sa moto dans une descente bordée de cerisiers et de temples, un dragon géant au-dessus de la piste. Tremplin, « Mode Esprit du Dragon » automatique, puis arrivée au Sanctuaire.',
  },
  {
    id: 'beat-30-45',
    window: '30 → 45 s',
    title: 'Premier œuf, premier compagnon',
    description:
      'Œuf offert immédiatement, placé dans l’incubateur devant lui. Éclosion instantanée scriptée : il obtient son premier compagnon bébé dragon.',
  },
  {
    id: 'beat-45-60',
    window: '45 → 60 s',
    title: 'Cap sur le portail Torii',
    description:
      'Deuxième œuf reçu avec un minuteur de 10 minutes. Une flèche lumineuse mène au portail avec l’indication « 1 Course = −3 min », qui lance la première vraie course multijoueur.',
  },
];



/** Indicateurs de réussite : ambition finale vs seuil de validation Phase 1. */
export const KPIS: Kpi[] = [
  {
    id: 'retention-d1',
    label: 'Rétention J1',
    ambition: '> 30 %',
    threshold: '≥ 18 à 20 %',
    ambitionValue: 30,
    thresholdValue: 18,
    unit: '%',
    lever: 'Onboarding en 60 s sans menu, 1er compagnon immédiat.',
    tier: 'platinum',
  },
  {
    id: 'session-time',
    label: 'Durée de session',
    ambition: '> 20 min',
    threshold: '≥ 18 à 20 min',
    ambitionValue: 20,
    thresholdValue: 18,
    unit: 'min',
    lever: 'Boucle d’incubation active (−3 min par course).',
    tier: 'gold',
  },
  {
    id: 'crash-rate',
    label: 'Performance technique',
    ambition: '0 crash',
    threshold: '< 1,5 % de taux de crash',
    ambitionValue: 0,
    thresholdValue: 1.5,
    unit: '%',
    inverted: true,
    lever: 'Région de jour légère et serveur unique sous StreamingEnabled.',
    tier: 'gold',
  },
  {
    id: 'approval',
    label: 'Taux de pouces bleus',
    ambition: '> 85 %',
    threshold: '≥ 80 %',
    ambitionValue: 85,
    thresholdValue: 80,
    unit: '%',
    lever: 'Présence immédiate des dragons (pets + ultime), zéro vol punitif.',
    tier: 'silver',
  },
];

/** Jalonnement de production. */
export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: 'phase-0',
    phase: 'Phase 0',
    window: 'Semaines 1 à 4',
    scope: 'Prototype en boîte grise',
    deliverables: [
      'Contrôleur véhicule par sphère',
      '1 piste de test',
      '1 incubateur',
      'Boucle de réduction de temps',
    ],
    status: 'done',
  },
  {
    id: 'phase-1',
    phase: 'Phase 1',
    window: 'Mois 2 et 3',
    scope: 'Lancement MVP',
    deliverables: [
      'Vallée des Cerisiers',
      'Voiture + Moto + Ultime Dragon',
      '15 compagnons / 45 variantes',
      'Système de raid sans perte',
      'Conformité PolicyService',
      'Traductions APAC',
    ],
    gate: 'Passage en Phase 2 uniquement si Rétention J1 ≥ 18 % et Session ≥ 18 min.',
    status: 'active',
  },
  {
    id: 'phase-2',
    phase: 'Phase 2',
    window: 'Mois 4',
    scope: 'Vol libre et événement mondial',
    deliverables: [
      'Dragon en vol libre sur une piste aérienne dédiée',
      'Premier Événement Mondial inter-serveurs',
    ],
    status: 'locked',
  },
  {
    id: 'phase-3',
    phase: 'Phase 3',
    window: 'Mois 5 et 6',
    scope: 'Extension des villes',
    deliverables: ['Néon City optimisée', 'Ruelles de Séoul', 'Ajout des clans'],
    status: 'locked',
  },
  {
    id: 'phase-4',
    phase: 'Phase 4',
    window: 'Mois 7+',
    scope: 'Extensions et UGC',
    deliverables: [
      'Îles Tropicales (Hors-bord)',
      'Outil de création de circuits communautaires',
    ],
    status: 'locked',
  },
];

