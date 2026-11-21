import {
  Mission,
  Collectible,
  Vehicle,
  Objective,
  TacticalNote,
  GameProfile,
  ProfileWorkspaceData,
} from '../types';

export const INITIAL_PROFILES: GameProfile[] = [
  {
    id: 'sunset-neon',
    name: 'Sunset Néon',
    universe: 'Baie du Littoral',
    playerTag: 'Runner_01',
    avatarIcon: 'Sun',
    theme: 'sunset-neon',
  },
  {
    id: 'neon-sector',
    name: 'Secteur Cyber',
    universe: 'Grille Urbaine',
    playerTag: 'Agent_09',
    avatarIcon: 'Zap',
    theme: 'cyber-grid',
  },
  {
    id: 'custom',
    name: 'Monde Libre',
    universe: 'Exploration Ouverte',
    playerTag: 'Player_One',
    avatarIcon: 'Gamepad2',
    theme: 'open-world',
  },
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'Opération Jetée Centrale',
    type: 'main',
    district: 'Port Marina',
    giver: 'Elena Vance',
    description:
      'Infiltrer le terminal maritime de Port Marina et récupérer le manifeste crypté avant le lever du soleil.',
    rewardXp: 2500,
    rewardCredits: 15000,
    status: 'in_progress',
    priority: true,
    steps: [
      { id: 'm1-1', text: 'Récupérer le badge d’accès sur la jetée sud', completed: true },
      { id: 'm1-2', text: 'Retrouver Elena au Salon du Littoral', completed: true },
      { id: 'm1-3', text: 'Accéder au bureau du capitaine sans alerte', completed: false },
      { id: 'm1-4', text: 'Extraire les données par vedette rapide', completed: false },
    ],
  },
  {
    id: 'm2',
    title: 'Run Côtier : Boulevard du Phare',
    type: 'side',
    district: 'Boulevard Côtier',
    giver: 'Marco Reyes',
    description:
      'Remporter le contre-la-montre nocturne le long de la promenade des palmiers face aux pilotes locaux.',
    rewardXp: 850,
    rewardCredits: 4500,
    status: 'available',
    priority: false,
    steps: [
      { id: 'm2-1', text: 'Installer le kit turbo haute pression au garage', completed: false },
      { id: 'm2-2', text: 'Rejoindre le départ sous les néons avant minuit', completed: false },
      { id: 'm2-3', text: 'Franchir la ligne d’arrivée en tête', completed: false },
    ],
  },
  {
    id: 'm3',
    title: 'Contrat Chasseur : Signal Fantôme',
    type: 'bounty',
    district: 'Avenue Néon',
    giver: 'Soren K.',
    description:
      'Localiser et neutraliser le brouilleur clandestin dissimulé dans les ruelles commerçantes du centre.',
    rewardXp: 1200,
    rewardCredits: 6200,
    status: 'available',
    steps: [
      { id: 'm3-1', text: 'Trianguler le signal dans le secteur Avenue Néon', completed: true },
      { id: 'm3-2', text: 'Couper les relais électriques du toit', completed: false },
      { id: 'm3-3', text: 'Sécuriser l’émetteur sans endommager la puce', completed: false },
    ],
  },
  {
    id: 'm4',
    title: 'Traversée des Îlots du Sud',
    type: 'activity',
    district: 'Îlot du Phare',
    giver: 'Maya Cruz',
    description:
      'Activer toutes les balises maritimes le long du grand pont côtier avant la montée des eaux.',
    rewardXp: 1800,
    rewardCredits: 8000,
    status: 'completed',
    steps: [
      { id: 'm4-1', text: 'Rejoindre le poste de garde du pont est', completed: true },
      { id: 'm4-2', text: 'Calibrer les capteurs côtiers', completed: true },
      { id: 'm4-3', text: 'Valider la liaison satellite sur l’îlot', completed: true },
    ],
  },
];

export const INITIAL_COLLECTIBLES: Collectible[] = [
  {
    id: 'c1',
    name: 'Cassette Synthwave : Fréquence 88.4',
    category: 'audio_log',
    district: 'Boulevard Côtier',
    hint: 'Posée sur le comptoir du kiosque rétro face à la plage principale.',
    coordinates: 'X: 142.8 | Y: 89.2',
    collected: true,
  },
  {
    id: 'c2',
    name: 'Statuette Néon du Phare',
    category: 'relic',
    district: 'Îlot du Phare',
    hint: 'Tout en haut de l’ancien phare blanc accessible par l’escalier extérieur.',
    coordinates: 'X: 204.1 | Y: 331.4',
    collected: false,
  },
  {
    id: 'c3',
    name: 'Plan Tactique : Turbine Marine',
    category: 'blueprint',
    district: 'Port Marina',
    hint: 'Dans le conteneur bleu ouvert au bout du quai de maintenance n°3.',
    coordinates: 'X: 98.4 | Y: 412.0',
    collected: false,
  },
  {
    id: 'c4',
    name: 'Coffre Étanche du Lagon #04',
    category: 'cache',
    district: 'Jetée Centrale',
    hint: 'Sous la passerelle en bois près de l’embarcadère des hors-bords.',
    coordinates: 'X: 512.9 | Y: 82.5',
    collected: true,
  },
  {
    id: 'c5',
    name: 'Fresque Murale : Horizon Rose',
    category: 'easter_egg',
    district: 'Quartier des Palmiers',
    hint: 'Peinte sur la façade latérale de l’hôtel côtier aux palmiers.',
    coordinates: 'X: 84.1 | Y: 112.3',
    collected: true,
  },
  {
    id: 'c6',
    name: 'Boîte Noire du Yacht Échoué',
    category: 'audio_log',
    district: 'Îlot du Phare',
    hint: 'Dans la cabine supérieure de l’épave visible depuis la crique ouest.',
    coordinates: 'X: 310.2 | Y: 220.8',
    collected: false,
  },
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'v1',
    name: 'Solaris Apex GT',
    category: 'sport',
    manufacturer: 'Solaris Motors',
    speed: 94,
    handling: 86,
    armor: 62,
    unlocked: true,
    location: 'Garage Résidentiel (Boulevard Côtier)',
    isFavorite: true,
    notes: 'Coupé grand tourisme magenta et carbone. Tenue de route impeccable sur la corniche.',
  },
  {
    id: 'v2',
    name: 'Marlin Coastal Coupe',
    category: 'muscle',
    manufacturer: 'Marlin Auto',
    speed: 74,
    handling: 78,
    armor: 70,
    unlocked: true,
    location: 'Parking du Quartier des Palmiers',
    isFavorite: false,
    notes: 'Cabriolet V8 classique idéal pour les trajets côtiers et les poursuites urbaines.',
  },
  {
    id: 'v3',
    name: 'Mirage V-Wave 900',
    category: 'moto',
    manufacturer: 'Mirage Cycles',
    speed: 98,
    handling: 92,
    armor: 40,
    unlocked: false,
    location: 'Concessionnaire Avenue Néon (Coût : 22 000 Cr)',
    isFavorite: false,
    notes: 'Moto sportive profilée avec éclairage néon cyan intégrée aux jantes.',
  },
  {
    id: 'v4',
    name: 'DuneRunner Baja 4x4',
    category: 'offroad',
    manufacturer: 'DuneRunner',
    speed: 78,
    handling: 85,
    armor: 88,
    unlocked: false,
    location: 'Crique Sablonneuse (Îlot du Phare Ouest)',
    isFavorite: false,
    notes: 'Châssis renforcé et pneus sable conçus pour traverser les dunes et lagons.',
  },
];

export const INITIAL_OBJECTIVES: Objective[] = [
  {
    id: 'o1',
    title: 'Légende de la Baie du Littoral',
    description: 'Compléter l’ensemble des quêtes principales et dominer tous les quartiers côtiers.',
    tier: 'platinum',
    progress: 1,
    maxProgress: 4,
    completed: false,
    category: 'Histoire',
  },
  {
    id: 'o2',
    title: 'Roi de l’Asphalte & des Palmiers',
    description: 'Posséder et déverrouiller au moins 4 véhicules dans votre garage côtier.',
    tier: 'gold',
    progress: 2,
    maxProgress: 4,
    completed: false,
    category: 'Exploration',
  },
  {
    id: 'o3',
    title: 'Chasseur de Cassettes & Reliques',
    description: 'Récupérer les enregistrements synthwave et objets cachés de la baie.',
    tier: 'silver',
    progress: 3,
    maxProgress: 6,
    completed: false,
    category: 'Collectibles',
  },
  {
    id: 'o4',
    title: 'Premier Coucher de Soleil',
    description: 'Terminer votre toute première mission côtière avec succès.',
    tier: 'bronze',
    progress: 1,
    maxProgress: 1,
    completed: true,
    category: 'Départ',
  },
];

export const INITIAL_NOTES: TacticalNote[] = [
  {
    id: 'n1',
    title: 'Codes d’accès des hangars côtiers',
    content: 'Marina Nord : 0451\nHangar Jetée 7 : 2901\nCoffre du Club Horizon : 8008',
    tags: ['codes', 'coffres', 'marina'],
    pinned: true,
    updatedAt: 'Aujourd’hui, 14:20',
  },
  {
    id: 'n2',
    title: 'Itinéraire rapide contre-la-montre',
    content: 'Prendre le raccourci par la promenade des palmiers puis couper par le pont ouest pour gagner 6 secondes.',
    tags: ['course', 'tactique', 'littoral'],
    pinned: true,
    updatedAt: 'Hier, 19:45',
  },
  {
    id: 'n3',
    title: 'Spots de véhicules rares de nuit',
    content: 'La Solaris Apex GT apparaît près du Club Nautique entre 22h et 03h. Le 4x4 attend près du phare ouest.',
    tags: ['garage', 'spots'],
    pinned: false,
    updatedAt: 'Il y a 3 jours',
  },
];

// Dedicated starter dataset for Profile 2 ("Secteur Cyber" — Sci-Fi Action RPG universe)
const CYBER_SECTOR_WORKSPACE: ProfileWorkspaceData = {
  missions: [
    {
      id: 'cy_m1',
      title: 'Breach: Spire Relay 09',
      type: 'main',
      district: 'Core Spire',
      giver: 'Kira-7',
      description: 'Infiltrate the upper data spire and extract the encrypted subnet routing keys.',
      rewardXp: 3200,
      rewardCredits: 18500,
      status: 'in_progress',
      priority: true,
      steps: [
        { id: 'cy_m1_1', text: 'Bypass street-level drone scanners', completed: true },
        { id: 'cy_m1_2', text: 'Disable thermal lock on elevator B', completed: false },
        { id: 'cy_m1_3', text: 'Extract shard from central server rack', completed: false },
      ],
    },
    {
      id: 'cy_m2',
      title: 'Blackout Bounty: Proxy Zero',
      type: 'bounty',
      district: 'Lower Conduit',
      giver: 'Fixer Orion',
      description: 'Track down the rogue net-runner disrupting sector telemetry relays.',
      rewardXp: 1400,
      rewardCredits: 7500,
      status: 'available',
      steps: [
        { id: 'cy_m2_1', text: 'Trace signal origin in Lower Conduit', completed: false },
        { id: 'cy_m2_2', text: 'Neutralize relay jammer', completed: false },
      ],
    },
  ],
  collectibles: [
    {
      id: 'cy_c1',
      name: 'Encrypted Data Shard #01',
      category: 'audio_log',
      district: 'Core Spire',
      hint: 'Inside the maintenance kiosk behind the transit terminal.',
      coordinates: 'X: 410.2 | Y: 120.5',
      collected: true,
    },
    {
      id: 'cy_c2',
      name: 'Prototype Optical Core',
      category: 'blueprint',
      district: 'Lower Conduit',
      hint: 'Locked locker next to the neon cooling vents.',
      coordinates: 'X: 288.4 | Y: 390.1',
      collected: false,
    },
  ],
  vehicles: [
    {
      id: 'cy_v1',
      name: 'Kuro-X Interceptor',
      category: 'moto',
      manufacturer: 'Kuro Dynamics',
      speed: 96,
      handling: 90,
      armor: 52,
      unlocked: true,
      location: 'Sector 4 Underground Bay',
      isFavorite: true,
      notes: 'High-torque cyberbike tuned for tight neon alley chases.',
    },
    {
      id: 'cy_v2',
      name: 'Aegis Recon APC',
      category: 'heavy',
      manufacturer: 'Vanguard Heavy',
      speed: 65,
      handling: 62,
      armor: 96,
      unlocked: false,
      location: 'Perimeter Depot',
      isFavorite: false,
      notes: 'Armored transport built for high-threat extraction missions.',
    },
  ],
  objectives: [
    {
      id: 'cy_o1',
      title: 'Ghost in the Grid',
      description: 'Complete 3 main Spire operations without triggering alarms.',
      tier: 'gold',
      progress: 1,
      maxProgress: 3,
      completed: false,
      category: 'Stealth',
    },
  ],
  notes: [
    {
      id: 'cy_n1',
      title: 'Spire Relay Access Codes',
      content: 'North Gate: 7741\nSub-level Maintenance: 9020',
      tags: ['cyber', 'codes'],
      pinned: true,
      updatedAt: 'Preset',
    },
  ],
  mapMarkers: [
    {
      id: 'cy_mk1',
      title: 'Spire Relay 09',
      category: 'mission',
      x: 52,
      y: 38,
      district: 'Core Spire',
      description: 'Primary extraction point',
      createdAt: 'Preset',
    },
  ],
  customMapUrl: '',
  activityLog: [],
  totalTrackedSeconds: 0,
};

// Dedicated starter dataset for Profile 3 ("Monde Libre" — Universal Sandbox / Open-World)
const OPEN_WORLD_WORKSPACE: ProfileWorkspaceData = {
  missions: [
    {
      id: 'ow_m1',
      title: 'First Frontier Outpost',
      type: 'main',
      district: 'Northern Ridge',
      giver: 'Expedition Log',
      description: 'Scout the valley overlook, set up a fast-travel beacon, and chart nearby landmarks.',
      rewardXp: 1500,
      rewardCredits: 5000,
      status: 'available',
      priority: true,
      steps: [
        { id: 'ow_m1_1', text: 'Climb Northern Ridge watchtower', completed: false },
        { id: 'ow_m1_2', text: 'Activate beacon and mark supply cache', completed: false },
      ],
    },
  ],
  collectibles: [
    {
      id: 'ow_c1',
      name: 'Ancient Compass Fragment',
      category: 'relic',
      district: 'Northern Ridge',
      hint: 'Near the ruined stone arch overlooking the canyon.',
      coordinates: 'X: 118.0 | Y: 244.6',
      collected: false,
    },
  ],
  vehicles: [
    {
      id: 'ow_v1',
      name: 'Nomad Trail Rover',
      category: 'offroad',
      manufacturer: 'Frontier Works',
      speed: 76,
      handling: 88,
      armor: 84,
      unlocked: true,
      location: 'Base Camp Garage',
      isFavorite: true,
      notes: 'Reliable all-terrain scout vehicle for any open-world expedition.',
    },
  ],
  objectives: [
    {
      id: 'ow_o1',
      title: 'Cartographer',
      description: 'Place 5 custom map markers across your campaign universe.',
      tier: 'silver',
      progress: 0,
      maxProgress: 5,
      completed: false,
      category: 'Exploration',
    },
  ],
  notes: [
    {
      id: 'ow_n1',
      title: 'Campaign Setup Checklist',
      content: 'Upload your game map image in the Map tab and add your own missions, collectibles, and builds.',
      tags: ['setup', 'multi-game'],
      pinned: true,
      updatedAt: 'Preset',
    },
  ],
  mapMarkers: [],
  customMapUrl: '',
  activityLog: [],
  totalTrackedSeconds: 0,
};

function cloneWorkspace(ws: ProfileWorkspaceData): ProfileWorkspaceData {
  return JSON.parse(JSON.stringify(ws)) as ProfileWorkspaceData;
}

export function createEmptyWorkspace(): ProfileWorkspaceData {
  return {
    missions: [],
    collectibles: [],
    vehicles: [],
    objectives: [],
    notes: [],
    mapMarkers: [],
    customMapUrl: '',
    activityLog: [],
    totalTrackedSeconds: 0,
  };
}

export function getStarterWorkspaceForProfile(
  profileId: string,
  preset: 'starter' | 'empty' = 'starter'
): ProfileWorkspaceData {
  if (preset === 'empty') {
    return createEmptyWorkspace();
  }
  if (profileId === 'sunset-neon') {
    return cloneWorkspace({
      missions: INITIAL_MISSIONS,
      collectibles: INITIAL_COLLECTIBLES,
      vehicles: INITIAL_VEHICLES,
      objectives: INITIAL_OBJECTIVES,
      notes: INITIAL_NOTES,
      mapMarkers: [],
      customMapUrl: '',
      activityLog: [],
      totalTrackedSeconds: 0,
    });
  }
  if (profileId === 'neon-sector') {
    return cloneWorkspace(CYBER_SECTOR_WORKSPACE);
  }
  if (profileId === 'custom') {
    return cloneWorkspace(OPEN_WORLD_WORKSPACE);
  }
  // Custom user-created game profiles default to a clean empty workspace ready for any game
  return createEmptyWorkspace();
}
