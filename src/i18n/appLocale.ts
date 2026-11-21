import { Locale } from './locale';

export interface AppCopy {
  common: {
    save: string;
    cancel: string;
    close: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    all: string;
    done: string;
    active: string;
    locked: string;
    unlocked: string;
    favorite: string;
    dismissAlert: string;
    reset: string;
    todayAt: string;
    noResults: string;
    multiGameNote: string;
  };
  header: {
    backToSite: string;
    account: string;
    signIn: string;
    globalProgress: string;
    switchProfileTitle: string;
    profileMenuHeading: string;
    manageProfiles: string;
    sessionLabel: string;
    audioOn: string;
    audioOff: string;
    activeUniverse: string;
    discordLabel: string;
    discordTitle: string;
  };
  nav: {
    home: string;
    progression: string;
    garage: string;
    map: string;
    notes: string;
    stats: string;
    studioObs: string;
  };
  footer: {
    overview: string;
    demo: string;
    pricing: string;
    streamers: string;
    accountCloud: string;
    discord: string;
  };
  home: {
    activeProfileBadge: string;
    heroTitlePrefix: string;
    heroSubtitle: string;
    quickAdd: string;
    openObsStudio: string;
    statCompletion: string;
    statMissions: string;
    statCollectibles: string;
    statGarage: string;
    statObjectives: string;
    priorityMissionHeading: string;
    noPriorityMission: string;
    openMissions: string;
    recentActivityHeading: string;
    noRecentActivity: string;
    telemetryHeading: string;
    openStats: string;
    stepLabel: string;
    discordSupportCta: string;
    discordSupportDesc: string;
  };
  progression: {
    title: string;
    subtitle: string;
    tabMissions: string;
    tabCollectibles: string;
    tabObjectives: string;
    newMission: string;
    newCollectible: string;
    newObjective: string;
  };
  missions: {
    searchPlaceholder: string;
    filterAll: string;
    filterMain: string;
    filterSide: string;
    filterBounty: string;
    filterActivity: string;
    statusAvailable: string;
    statusInProgress: string;
    statusCompleted: string;
    stepsHeading: string;
    addStepPlaceholder: string;
    addStepBtn: string;
    rewardLabel: string;
    districtLabel: string;
    giverLabel: string;
    emptyTitle: string;
    emptyDesc: string;
    markDone: string;
    markProgress: string;
    reopen: string;
    editTitle: string;
    deleteConfirm: string;
  };
  collectibles: {
    searchPlaceholder: string;
    catAll: string;
    catRelic: string;
    catCache: string;
    catAudioLog: string;
    catBlueprint: string;
    catEasterEgg: string;
    onlyMissing: string;
    collected: string;
    missing: string;
    hintLabel: string;
    coordsLabel: string;
    emptyTitle: string;
    emptyDesc: string;
  };
  objectives: {
    searchPlaceholder: string;
    tierAll: string;
    tierBronze: string;
    tierSilver: string;
    tierGold: string;
    tierPlatinum: string;
    progressLabel: string;
    unlockedBadge: string;
    inProgressBadge: string;
    emptyTitle: string;
    emptyDesc: string;
  };
  garage: {
    title: string;
    subtitle: string;
    addVehicle: string;
    searchPlaceholder: string;
    onlyUnlocked: string;
    onlyFavorites: string;
    catAll: string;
    catSport: string;
    catMuscle: string;
    catMoto: string;
    catOffroad: string;
    catCar: string;
    catSpecial: string;
    catHeavy: string;
    speed: string;
    handling: string;
    armor: string;
    locationLabel: string;
    uploadPhoto: string;
    photoUrlPlaceholder: string;
    invalidImageUrl: string;
    invalidFileType: string;
    fileTooLarge: string;
    emptyTitle: string;
    emptyDesc: string;
    unlockedCount: string;
  };
  map: {
    title: string;
    subtitle: string;
    uploadCustomMap: string;
    mapUrlPlaceholder: string;
    applyMapUrl: string;
    resetMapLayer: string;
    clickToPlaceHint: string;
    addMarkerTitle: string;
    markerNamePlaceholder: string;
    markerDistrictPlaceholder: string;
    markerDescPlaceholder: string;
    placeMarkerBtn: string;
    catPoi: string;
    catMission: string;
    catObjective: string;
    catCollectible: string;
    catVehicle: string;
    markersListTitle: string;
    noMarkers: string;
    invalidMapUrl: string;
    multiGameMapNote: string;
  };
  notes: {
    title: string;
    subtitle: string;
    newNote: string;
    searchPlaceholder: string;
    pinnedSection: string;
    otherSection: string;
    emptyTitle: string;
    emptyDesc: string;
    tagsPlaceholder: string;
    titlePlaceholder: string;
    contentPlaceholder: string;
    updatedLabel: string;
  };
  stats: {
    title: string;
    subtitle: string;
    backupGuideBtn: string;
    cloudAccountBtn: string;
    exportActiveBtn: string;
    exportAllGamesBtn: string;
    importJsonBtn: string;
    resetUniverseBtn: string;
    resetConfirmPrompt: string;
    confirmResetBtn: string;
    scopeActiveGame: string;
    scopeAllGames: string;
    periodDaily: string;
    periodWeekly: string;
    periodMonthly: string;
    realTelemetryTitle: string;
    realTelemetrySubtitle: string;
    emptyHistoryTitle: string;
    emptyHistoryDesc: string;
    actionsCompleted: string;
    xpEarned: string;
    timeTracked: string;
    sessionsCount: string;
    multiGameMatrixTitle: string;
    multiGameMatrixSubtitle: string;
    colGame: string;
    colProgress: string;
    colMissions: string;
    colCollectibles: string;
    colGarage: string;
    colXp: string;
    colTime: string;
    importSuccess: string;
    importErrorPrefix: string;
    exportSuccess: string;
    resetDone: string;
  };
  modalNew: {
    title: string;
    tabMission: string;
    tabCollectible: string;
    tabVehicle: string;
    tabObjective: string;
    tabNote: string;
    submitCreate: string;
    invalidImageError: string;
    fieldTitle: string;
    fieldName: string;
    fieldDistrict: string;
    fieldGiver: string;
    fieldDescription: string;
    fieldHint: string;
    fieldCoords: string;
    fieldManufacturer: string;
    fieldLocation: string;
    fieldImageUrl: string;
    fieldCategory: string;
    fieldTier: string;
    fieldMaxProgress: string;
    fieldTags: string;
    fieldContent: string;
  };
  toast: {
    badgeUnlocked: string;
    closeAria: string;
  };
  errorBoundary: {
    title: string;
    description: string;
    reloadBtn: string;
  };
  overlay: {
    exitBtn: string;
    cleanModeBtn: string;
    cleanHint: string;
    layout169: string;
    layout916: string;
    bgTransparent: string;
    bgChroma: string;
    bgWaiting: string;
    copyObsUrl: string;
    obsUrlCopied: string;
    widgetsHeading: string;
    camPosHeading: string;
    camSizeHeading: string;
    obsWsHeading: string;
    obsWsDesc: string;
    obsWsConnect: string;
    obsWsDisconnect: string;
    obsWsConnected: string;
    obsWsDisconnected: string;
    obsWsScenes: string;
    obsWsLive: string;
    obsWsOffline: string;
    integrationsHeading: string;
    integrationsDesc: string;
    twitchConnect: string;
    youtubeConnect: string;
    disconnect: string;
    notConfigured: string;
    signInRequired: string;
    profileSelectorLabel: string;
    hideSigLabel: string;
    timerStart: string;
    timerPause: string;
    timerReset: string;
    counterLabel: string;
    waitingScreenHeading: string;
    activeMissionWidget: string;
    noActiveMission: string;
    progressWidget: string;
    camFrameLabel: string;
  };
}

export const APP_COPY: Record<Locale, AppCopy> = {
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      all: 'All',
      done: 'Done',
      active: 'Active',
      locked: 'Locked',
      unlocked: 'Unlocked',
      favorite: 'Favorite',
      dismissAlert: 'Dismiss alert',
      reset: 'Reset',
      todayAt: 'Today',
      noResults: 'No matching items found.',
      multiGameNote: 'Each game profile stores its own isolated missions, collectibles, garage, map, notes, and statistics.',
    },
    header: {
      backToSite: 'Studio Home',
      account: 'Account',
      signIn: 'Sign In',
      globalProgress: 'Completion',
      switchProfileTitle: 'Switch game universe',
      profileMenuHeading: 'Game Universes (Isolated Data)',
      manageProfiles: 'Manage / Edit Profiles',
      sessionLabel: 'Session',
      audioOn: 'Mute HUD sound effects',
      audioOff: 'Enable HUD sound effects',
      activeUniverse: 'Active Universe',
      discordLabel: 'Discord',
      discordTitle: 'Join the official JITALX Discord server',
    },
    nav: {
      home: 'Dashboard',
      progression: 'Progression',
      garage: 'Garage',
      map: 'Map',
      notes: 'Notes',
      stats: 'Stats',
      studioObs: 'OBS Studio',
    },
    footer: {
      overview: 'Overview',
      demo: 'Live Demo',
      pricing: 'Pricing',
      streamers: 'Streamers',
      accountCloud: 'Account & Cloud',
      discord: 'Discord Community',
    },
    home: {
      activeProfileBadge: 'Active Game Profile',
      heroTitlePrefix: 'Command Center',
      heroSubtitle: 'Track missions, collectibles, custom garage, tactical map, and live OBS scenes per game universe.',
      quickAdd: 'Quick Add',
      openObsStudio: 'OBS Studio',
      statCompletion: 'Completion',
      statMissions: 'Missions',
      statCollectibles: 'Collectibles',
      statGarage: 'Garage',
      statObjectives: 'Objectives',
      priorityMissionHeading: 'Active Priority Mission',
      noPriorityMission: 'No active mission in this universe yet. Add or start one to track it here and in OBS.',
      openMissions: 'Open Missions',
      recentActivityHeading: 'Recent Activity',
      noRecentActivity: 'No recorded actions yet in this game profile.',
      telemetryHeading: 'Real Session Activity',
      openStats: 'Full Analytics',
      stepLabel: 'Steps',
      discordSupportCta: 'Discord Community & Support',
      discordSupportDesc: 'Get support, share custom game profiles & OBS presets, and connect with JITALX players.',
    },
    progression: {
      title: 'Progression & Goals',
      subtitle: 'Manage missions, collectibles, and achievements independently for your active game universe.',
      tabMissions: 'Missions',
      tabCollectibles: 'Collectibles',
      tabObjectives: 'Objectives & Trophies',
      newMission: 'New Mission',
      newCollectible: 'New Collectible',
      newObjective: 'New Objective',
    },
    missions: {
      searchPlaceholder: 'Search missions, districts, or contacts...',
      filterAll: 'All',
      filterMain: 'Main',
      filterSide: 'Side',
      filterBounty: 'Bounty',
      filterActivity: 'Activity',
      statusAvailable: 'Available',
      statusInProgress: 'In Progress',
      statusCompleted: 'Completed',
      stepsHeading: 'Checklist Steps',
      addStepPlaceholder: 'Add a mission step...',
      addStepBtn: 'Add',
      rewardLabel: 'Reward',
      districtLabel: 'Sector',
      giverLabel: 'Contact',
      emptyTitle: 'No missions in this game profile',
      emptyDesc: 'Create your first mission or switch filters to organize this campaign.',
      markDone: 'Complete',
      markProgress: 'Start',
      reopen: 'Reopen',
      editTitle: 'Edit mission',
      deleteConfirm: 'Delete this mission?',
    },
    collectibles: {
      searchPlaceholder: 'Search collectibles, hints, or sectors...',
      catAll: 'All',
      catRelic: 'Relics',
      catCache: 'Caches',
      catAudioLog: 'Logs',
      catBlueprint: 'Blueprints',
      catEasterEgg: 'Secrets',
      onlyMissing: 'Missing only',
      collected: 'Collected',
      missing: 'Missing',
      hintLabel: 'Hint',
      coordsLabel: 'Coords',
      emptyTitle: 'No collectibles tracked yet',
      emptyDesc: 'Add custom collectibles, secrets, or items for this game universe.',
    },
    objectives: {
      searchPlaceholder: 'Search trophies or milestones...',
      tierAll: 'All Tiers',
      tierBronze: 'Bronze',
      tierSilver: 'Silver',
      tierGold: 'Gold',
      tierPlatinum: 'Platinum',
      progressLabel: 'Progress',
      unlockedBadge: 'Unlocked',
      inProgressBadge: 'In Progress',
      emptyTitle: 'No objectives yet',
      emptyDesc: 'Create milestones, speedrun targets, or 100% completion trophies for this game.',
    },
    garage: {
      title: 'Universal Garage & Loadouts',
      subtitle: 'Track vehicles, mounts, ships, or gear sets for this game profile with custom visuals.',
      addVehicle: 'Add Entry',
      searchPlaceholder: 'Search by name, brand, or location...',
      onlyUnlocked: 'Unlocked only',
      onlyFavorites: 'Favorites',
      catAll: 'All',
      catSport: 'Sport',
      catMuscle: 'Muscle',
      catMoto: 'Moto',
      catOffroad: 'Off-Road',
      catCar: 'Standard',
      catSpecial: 'Special',
      catHeavy: 'Heavy',
      speed: 'Speed',
      handling: 'Handling',
      armor: 'Armor',
      locationLabel: 'Location',
      uploadPhoto: 'Upload Image (PNG/JPG/WebP)',
      photoUrlPlaceholder: 'Or paste HTTPS image URL...',
      invalidImageUrl: 'Invalid image URL. Only HTTPS/HTTP links or raster PNG/JPEG/WebP/GIF data images are allowed.',
      invalidFileType: 'Unsupported image format. Please use PNG, JPEG, WebP, or GIF (SVG is blocked for security).',
      fileTooLarge: 'Image exceeds 2 MB limit.',
      emptyTitle: 'Garage is empty for this game',
      emptyDesc: 'Add vehicles, mounts, starships, or builds specific to this game universe.',
      unlockedCount: 'unlocked',
    },
    map: {
      title: 'Tactical Map & Custom Pins',
      subtitle: 'Upload any game map background and pin your own coordinates, bosses, loot, or routes.',
      uploadCustomMap: 'Upload Map Image',
      mapUrlPlaceholder: 'Paste HTTPS map image URL...',
      applyMapUrl: 'Apply',
      resetMapLayer: 'Reset Map',
      clickToPlaceHint: 'Click anywhere on the map to select pin coordinates',
      addMarkerTitle: 'Place New Marker',
      markerNamePlaceholder: 'Marker title (e.g. Boss arena, Secret cache)',
      markerDistrictPlaceholder: 'Region / Zone (optional)',
      markerDescPlaceholder: 'Tactical note (optional)',
      placeMarkerBtn: 'Save Marker',
      catPoi: 'POI',
      catMission: 'Mission',
      catObjective: 'Objective',
      catCollectible: 'Collectible',
      catVehicle: 'Vehicle',
      markersListTitle: 'Saved Map Markers',
      noMarkers: 'No markers placed on this game map yet.',
      invalidMapUrl: 'Invalid map image URL. Use an HTTPS image link or upload a PNG/JPEG/WebP file.',
      multiGameMapNote: 'Multi-game tactical grid — upload your own map image per game profile.',
    },
    notes: {
      title: 'Tactical Notes & Codes',
      subtitle: 'Keep builds, boss patterns, door codes, and stream talking points isolated per game.',
      newNote: 'New Note',
      searchPlaceholder: 'Search notes or #tags...',
      pinnedSection: 'Pinned Notes',
      otherSection: 'All Notes',
      emptyTitle: 'No notes in this universe',
      emptyDesc: 'Create your first tactical note, cheat sheet, or broadcast checklist.',
      tagsPlaceholder: 'Tags (comma separated)',
      titlePlaceholder: 'Note title',
      contentPlaceholder: 'Write your notes, routes, codes, or strategies...',
      updatedLabel: 'Updated',
    },
    stats: {
      title: 'Real Analytics & Backups',
      subtitle: 'Persisted session logs, multi-game comparison, and validated JSON / Cloud backups.',
      backupGuideBtn: 'Backup Guide',
      cloudAccountBtn: 'Cloud Account',
      exportActiveBtn: 'Export Active Game (JSON)',
      exportAllGamesBtn: 'Export All Games (JSON)',
      importJsonBtn: 'Import JSON',
      resetUniverseBtn: 'Reset Active Game',
      resetConfirmPrompt: 'Reset missions, collectibles, garage, objectives, notes, and markers for this game profile?',
      confirmResetBtn: 'Confirm Reset',
      scopeActiveGame: 'Active Game',
      scopeAllGames: 'All Games (Global)',
      periodDaily: 'Daily (7d)',
      periodWeekly: 'Weekly (8w)',
      periodMonthly: 'Monthly (6m)',
      realTelemetryTitle: 'Persisted Progression History',
      realTelemetrySubtitle: 'Strictly calculated from your recorded actions and session timers — zero simulated curves.',
      emptyHistoryTitle: 'No progression history recorded yet',
      emptyHistoryDesc: 'Complete a mission, collect an item, unlock a vehicle, or keep a session running to populate real charts here.',
      actionsCompleted: 'Recorded Actions',
      xpEarned: 'XP Delta',
      timeTracked: 'Tracked Time',
      sessionsCount: 'Sessions',
      multiGameMatrixTitle: 'Multi-Game Overview',
      multiGameMatrixSubtitle: 'Compare real completion and tracked time across every game profile.',
      colGame: 'Game Profile',
      colProgress: 'Progress',
      colMissions: 'Missions',
      colCollectibles: 'Collectibles',
      colGarage: 'Garage',
      colXp: 'XP',
      colTime: 'Time',
      importSuccess: 'JSON backup imported successfully.',
      importErrorPrefix: 'Import failed:',
      exportSuccess: 'JSON backup downloaded.',
      resetDone: 'Active game profile reset.',
    },
    modalNew: {
      title: 'Add to Active Game Profile',
      tabMission: 'Mission',
      tabCollectible: 'Collectible',
      tabVehicle: 'Garage',
      tabObjective: 'Objective',
      tabNote: 'Note',
      submitCreate: 'Create Entry',
      invalidImageError: 'Invalid image URL. Only HTTPS/HTTP URLs or PNG/JPEG/WebP/GIF images are accepted.',
      fieldTitle: 'Title',
      fieldName: 'Name',
      fieldDistrict: 'Zone / Sector',
      fieldGiver: 'Contact / Source',
      fieldDescription: 'Description',
      fieldHint: 'Location Hint',
      fieldCoords: 'Coordinates',
      fieldManufacturer: 'Brand / Class',
      fieldLocation: 'Location',
      fieldImageUrl: 'Image URL (HTTPS, optional)',
      fieldCategory: 'Category',
      fieldTier: 'Tier',
      fieldMaxProgress: 'Target Count',
      fieldTags: 'Tags (comma separated)',
      fieldContent: 'Content',
    },
    toast: {
      badgeUnlocked: 'Achievement Unlocked',
      closeAria: 'Dismiss notification',
    },
    errorBoundary: {
      title: 'JITALX Recovery',
      description: 'A runtime error was intercepted to protect your local data. You can reload the interface safely.',
      reloadBtn: 'Reload JITALX',
    },
    overlay: {
      exitBtn: 'Back to HUD',
      cleanModeBtn: 'Clean Capture (H)',
      cleanHint: 'Press H anytime to toggle editor controls',
      layout169: '16:9 Landscape',
      layout916: '9:16 Vertical',
      bgTransparent: 'Transparent',
      bgChroma: 'Chroma Green',
      bgWaiting: 'Waiting Screen',
      copyObsUrl: 'Copy OBS URL',
      obsUrlCopied: 'OBS URL Copied',
      widgetsHeading: 'Active Widgets',
      camPosHeading: 'Webcam Position',
      camSizeHeading: 'Webcam Size',
      obsWsHeading: 'Local OBS WebSocket v5 (Optional)',
      obsWsDesc: 'Connect directly to your local OBS Studio (Tools → WebSocket Server). No cloud relay or fake data.',
      obsWsConnect: 'Connect OBS',
      obsWsDisconnect: 'Disconnect',
      obsWsConnected: 'OBS Connected',
      obsWsDisconnected: 'Disconnected',
      obsWsScenes: 'OBS Scenes',
      obsWsLive: 'STREAMING LIVE',
      obsWsOffline: 'OFFLINE',
      integrationsHeading: 'Twitch & YouTube OAuth (Optional)',
      integrationsDesc: 'Requires server OAuth credentials. Status reflects real server configuration.',
      twitchConnect: 'Connect Twitch',
      youtubeConnect: 'Connect YouTube',
      disconnect: 'Disconnect',
      notConfigured: 'Not configured on server',
      signInRequired: 'Sign in with Google on Account page first',
      profileSelectorLabel: 'Game Profile',
      hideSigLabel: 'Hide JITALX signature',
      timerStart: 'Start',
      timerPause: 'Pause',
      timerReset: 'Reset',
      counterLabel: 'Challenge Counter',
      waitingScreenHeading: 'Stream Starting Soon',
      activeMissionWidget: 'Active Mission',
      noActiveMission: 'No mission in progress',
      progressWidget: 'Universe Completion',
      camFrameLabel: 'WEBCAM FEED',
    },
  },
  fr: {
    common: {
      save: 'Enregistrer',
      cancel: 'Annuler',
      close: 'Fermer',
      delete: 'Supprimer',
      edit: 'Modifier',
      add: 'Ajouter',
      search: 'Rechercher',
      all: 'Tout',
      done: 'Terminé',
      active: 'Actif',
      locked: 'Verrouillé',
      unlocked: 'Débloqué',
      favorite: 'Favori',
      dismissAlert: 'Fermer l’alerte',
      reset: 'Réinitialiser',
      todayAt: 'Aujourd’hui',
      noResults: 'Aucun élément correspondant.',
      multiGameNote: 'Chaque profil de jeu stocke ses propres missions, collectibles, garage, carte, notes et statistiques de façon isolée.',
    },
    header: {
      backToSite: 'Accueil Studio',
      account: 'Compte',
      signIn: 'Connexion',
      globalProgress: 'Progression',
      switchProfileTitle: 'Changer d’univers de jeu',
      profileMenuHeading: 'Univers de Jeux (Données Isolées)',
      manageProfiles: 'Gérer / Modifier les profils',
      sessionLabel: 'Session',
      audioOn: 'Couper les sons HUD',
      audioOff: 'Activer les sons HUD',
      activeUniverse: 'Univers actif',
      discordLabel: 'Discord',
      discordTitle: 'Rejoindre le serveur Discord officiel JITALX',
    },
    nav: {
      home: 'Tableau',
      progression: 'Progression',
      garage: 'Garage',
      map: 'Carte',
      notes: 'Notes',
      stats: 'Stats',
      studioObs: 'Studio OBS',
    },
    footer: {
      overview: 'Présentation',
      demo: 'Démo',
      pricing: 'Tarifs',
      streamers: 'Streamers',
      accountCloud: 'Compte & Cloud',
      discord: 'Communauté Discord',
    },
    home: {
      activeProfileBadge: 'Profil de Jeu Actif',
      heroTitlePrefix: 'Centre de Commande',
      heroSubtitle: 'Suivez vos missions, collectibles, garage personnalisé, carte tactique et scènes OBS par univers de jeu.',
      quickAdd: 'Ajout Rapide',
      openObsStudio: 'Studio OBS',
      statCompletion: 'Complétion',
      statMissions: 'Missions',
      statCollectibles: 'Collectibles',
      statGarage: 'Garage',
      statObjectives: 'Objectifs',
      priorityMissionHeading: 'Mission Prioritaire Active',
      noPriorityMission: 'Aucune mission en cours dans cet univers. Créez ou démarrez une mission pour la suivre ici et dans OBS.',
      openMissions: 'Voir les missions',
      recentActivityHeading: 'Activité Récente',
      noRecentActivity: 'Aucune action enregistrée dans ce profil de jeu.',
      telemetryHeading: 'Activité Réelle de Session',
      openStats: 'Statistiques complètes',
      stepLabel: 'Étapes',
      discordSupportCta: 'Support & Communauté Discord',
      discordSupportDesc: 'Obtenez de l’aide, partagez vos profils de jeux & presets OBS et échangez avec la communauté JITALX.',
    },
    progression: {
      title: 'Progression & Objectifs',
      subtitle: 'Gérez indépendamment missions, collectibles et trophées pour votre univers de jeu actif.',
      tabMissions: 'Missions',
      tabCollectibles: 'Collectibles',
      tabObjectives: 'Objectifs & Trophées',
      newMission: 'Nouvelle Mission',
      newCollectible: 'Nouveau Collectible',
      newObjective: 'Nouvel Objectif',
    },
    missions: {
      searchPlaceholder: 'Rechercher une mission, un secteur ou un contact...',
      filterAll: 'Toutes',
      filterMain: 'Principales',
      filterSide: 'Secondaires',
      filterBounty: 'Contrats',
      filterActivity: 'Activités',
      statusAvailable: 'Disponible',
      statusInProgress: 'En cours',
      statusCompleted: 'Terminée',
      stepsHeading: 'Étapes de mission',
      addStepPlaceholder: 'Ajouter une étape...',
      addStepBtn: 'Ajouter',
      rewardLabel: 'Récompense',
      districtLabel: 'Secteur',
      giverLabel: 'Contact',
      emptyTitle: 'Aucune mission dans ce profil',
      emptyDesc: 'Créez votre première mission ou ajustez les filtres pour organiser cette campagne.',
      markDone: 'Terminer',
      markProgress: 'Démarrer',
      reopen: 'Réouvrir',
      editTitle: 'Modifier la mission',
      deleteConfirm: 'Supprimer cette mission ?',
    },
    collectibles: {
      searchPlaceholder: 'Rechercher un collectible, un indice ou un secteur...',
      catAll: 'Tous',
      catRelic: 'Reliques',
      catCache: 'Caches',
      catAudioLog: 'Journaux',
      catBlueprint: 'Plans',
      catEasterEgg: 'Secrets',
      onlyMissing: 'Manquants uniquement',
      collected: 'Collecté',
      missing: 'Manquant',
      hintLabel: 'Indice',
      coordsLabel: 'Coords',
      emptyTitle: 'Aucun collectible suivi',
      emptyDesc: 'Ajoutez vos propres objets, secrets ou collectibles pour cet univers de jeu.',
    },
    objectives: {
      searchPlaceholder: 'Rechercher un trophée ou un jalon...',
      tierAll: 'Tous les rangs',
      tierBronze: 'Bronze',
      tierSilver: 'Argent',
      tierGold: 'Or',
      tierPlatinum: 'Platine',
      progressLabel: 'Progression',
      unlockedBadge: 'Débloqué',
      inProgressBadge: 'En cours',
      emptyTitle: 'Aucun objectif enregistré',
      emptyDesc: 'Ajoutez des trophées, défis ou objectifs 100 % propres à ce jeu.',
    },
    garage: {
      title: 'Garage Universel & Équipements',
      subtitle: 'Suivez vos véhicules, montures, vaisseaux ou builds propres à ce jeu avec visuels personnalisés.',
      addVehicle: 'Ajouter',
      searchPlaceholder: 'Rechercher par nom, marque ou lieu...',
      onlyUnlocked: 'Débloqués uniquement',
      onlyFavorites: 'Favoris',
      catAll: 'Tous',
      catSport: 'Sport',
      catMuscle: 'Muscle',
      catMoto: 'Moto',
      catOffroad: 'Tout-Terrain',
      catCar: 'Standard',
      catSpecial: 'Spécial',
      catHeavy: 'Lourd',
      speed: 'Vitesse',
      handling: 'Tenue',
      armor: 'Blindage',
      locationLabel: 'Emplacement',
      uploadPhoto: 'Importer une image (PNG/JPG/WebP)',
      photoUrlPlaceholder: 'Ou coller une URL HTTPS d’image...',
      invalidImageUrl: 'URL d’image invalide. Seuls les liens HTTPS/HTTP ou images PNG/JPEG/WebP/GIF sont autorisés.',
      invalidFileType: 'Format non supporté. Utilisez PNG, JPEG, WebP ou GIF (SVG bloqué par sécurité).',
      fileTooLarge: 'Image trop lourde (limite 2 Mo).',
      emptyTitle: 'Garage vide pour ce jeu',
      emptyDesc: 'Ajoutez des véhicules, montures, vaisseaux ou configurations propres à cet univers.',
      unlockedCount: 'débloqués',
    },
    map: {
      title: 'Carte Tactique & Marqueurs',
      subtitle: 'Importez l’image de carte de n’importe quel jeu et placez vos repères, boss, loot ou itinéraires.',
      uploadCustomMap: 'Importer une carte',
      mapUrlPlaceholder: 'Coller une URL HTTPS d’image de carte...',
      applyMapUrl: 'Appliquer',
      resetMapLayer: 'Réinitialiser',
      clickToPlaceHint: 'Cliquez sur la carte pour positionner un nouveau repère',
      addMarkerTitle: 'Placer un repère',
      markerNamePlaceholder: 'Titre du repère (ex. Boss, Coffre secret)',
      markerDistrictPlaceholder: 'Zone / Région (optionnel)',
      markerDescPlaceholder: 'Note tactique (optionnel)',
      placeMarkerBtn: 'Enregistrer le repère',
      catPoi: 'POI',
      catMission: 'Mission',
      catObjective: 'Objectif',
      catCollectible: 'Collectible',
      catVehicle: 'Véhicule',
      markersListTitle: 'Repères enregistrés',
      noMarkers: 'Aucun repère placé sur la carte de ce jeu.',
      invalidMapUrl: 'URL de carte invalide. Utilisez un lien HTTPS ou importez un fichier PNG/JPEG/WebP.',
      multiGameMapNote: 'Grille tactique multi-jeux — importez votre propre image de carte par profil.',
    },
    notes: {
      title: 'Notes Tactiques & Codes',
      subtitle: 'Centralisez vos builds, codes d’accès, stratégies et rappels de stream par jeu.',
      newNote: 'Nouvelle Note',
      searchPlaceholder: 'Rechercher une note ou un #tag...',
      pinnedSection: 'Notes Épinglées',
      otherSection: 'Autres Notes',
      emptyTitle: 'Aucune note dans cet univers',
      emptyDesc: 'Créez votre première note tactique, feuille de route ou liste de stream.',
      tagsPlaceholder: 'Tags (séparés par virgule)',
      titlePlaceholder: 'Titre de la note',
      contentPlaceholder: 'Écrivez vos notes, itinéraires, codes ou stratégies...',
      updatedLabel: 'Modifié',
    },
    stats: {
      title: 'Statistiques Réelles & Sauvegardes',
      subtitle: 'Historique de sessions persisté, comparatif multi-jeux et sauvegardes JSON / Cloud validées.',
      backupGuideBtn: 'Guide Sauvegarde',
      cloudAccountBtn: 'Compte Cloud',
      exportActiveBtn: 'Exporter ce jeu (JSON)',
      exportAllGamesBtn: 'Exporter tous les jeux (JSON)',
      importJsonBtn: 'Importer JSON',
      resetUniverseBtn: 'Réinitialiser ce jeu',
      resetConfirmPrompt: 'Réinitialiser missions, collectibles, garage, objectifs, notes et marqueurs de ce profil ?',
      confirmResetBtn: 'Confirmer',
      scopeActiveGame: 'Jeu actif',
      scopeAllGames: 'Tous les jeux (Global)',
      periodDaily: 'Jour (7j)',
      periodWeekly: 'Semaine (8s)',
      periodMonthly: 'Mois (6m)',
      realTelemetryTitle: 'Historique Réel de Progression',
      realTelemetrySubtitle: 'Calculé uniquement depuis vos actions et sessions enregistrées — aucune courbe simulée.',
      emptyHistoryTitle: 'Aucun historique de progression enregistré',
      emptyHistoryDesc: 'Validez une mission, un collectible, un véhicule ou laissez une session active pour alimenter ces graphiques réels.',
      actionsCompleted: 'Actions enregistrées',
      xpEarned: 'Delta XP',
      timeTracked: 'Temps suivi',
      sessionsCount: 'Sessions',
      multiGameMatrixTitle: 'Vue Globale Multi-Jeux',
      multiGameMatrixSubtitle: 'Comparez la complétion réelle et le temps suivi entre tous vos profils de jeux.',
      colGame: 'Profil de jeu',
      colProgress: 'Progression',
      colMissions: 'Missions',
      colCollectibles: 'Collectibles',
      colGarage: 'Garage',
      colXp: 'XP',
      colTime: 'Temps',
      importSuccess: 'Sauvegarde JSON importée avec succès.',
      importErrorPrefix: 'Échec de l’import :',
      exportSuccess: 'Sauvegarde JSON téléchargée.',
      resetDone: 'Profil de jeu actif réinitialisé.',
    },
    modalNew: {
      title: 'Ajouter au Profil de Jeu Actif',
      tabMission: 'Mission',
      tabCollectible: 'Collectible',
      tabVehicle: 'Garage',
      tabObjective: 'Objectif',
      tabNote: 'Note',
      submitCreate: 'Créer l’entrée',
      invalidImageError: 'URL d’image invalide. Seules les URL HTTPS/HTTP ou images PNG/JPEG/WebP/GIF sont acceptées.',
      fieldTitle: 'Titre',
      fieldName: 'Nom',
      fieldDistrict: 'Zone / Secteur',
      fieldGiver: 'Contact / Source',
      fieldDescription: 'Description',
      fieldHint: 'Indice d’emplacement',
      fieldCoords: 'Coordonnées',
      fieldManufacturer: 'Marque / Classe',
      fieldLocation: 'Emplacement',
      fieldImageUrl: 'URL Image (HTTPS, optionnel)',
      fieldCategory: 'Catégorie',
      fieldTier: 'Rang',
      fieldMaxProgress: 'Objectif cible',
      fieldTags: 'Tags (séparés par virgule)',
      fieldContent: 'Contenu',
    },
    toast: {
      badgeUnlocked: 'Succès Débloqué',
      closeAria: 'Fermer la notification',
    },
    errorBoundary: {
      title: 'Récupération JITALX',
      description: 'Une erreur d’exécution a été interceptée afin de protéger vos données locales. Vous pouvez recharger l’interface en toute sécurité.',
      reloadBtn: 'Recharger JITALX',
    },
    overlay: {
      exitBtn: 'Retour au HUD',
      cleanModeBtn: 'Mode Capture (H)',
      cleanHint: 'Appuyez sur H à tout moment pour masquer/afficher les contrôles',
      layout169: '16:9 Paysage',
      layout916: '9:16 Vertical',
      bgTransparent: 'Transparent',
      bgChroma: 'Fond Vert Chroma',
      bgWaiting: 'Écran d’attente',
      copyObsUrl: 'Copier l’URL OBS',
      obsUrlCopied: 'URL OBS copiée',
      widgetsHeading: 'Widgets actifs',
      camPosHeading: 'Position Webcam',
      camSizeHeading: 'Taille Webcam',
      obsWsHeading: 'OBS WebSocket v5 local (Optionnel)',
      obsWsDesc: 'Connexion directe à votre OBS Studio local (Outils → Serveur WebSocket). Aucun relais ni donnée simulée.',
      obsWsConnect: 'Connecter OBS',
      obsWsDisconnect: 'Déconnecter',
      obsWsConnected: 'OBS Connecté',
      obsWsDisconnected: 'Déconnecté',
      obsWsScenes: 'Scènes OBS',
      obsWsLive: 'EN DIRECT',
      obsWsOffline: 'HORS LIGNE',
      integrationsHeading: 'Twitch & YouTube OAuth (Optionnel)',
      integrationsDesc: 'Nécessite les identifiants OAuth serveur. Statut réel renvoyé par le backend.',
      twitchConnect: 'Connecter Twitch',
      youtubeConnect: 'Connecter YouTube',
      disconnect: 'Déconnecter',
      notConfigured: 'Non configuré sur le serveur',
      signInRequired: 'Connectez-vous avec Google sur la page Compte d’abord',
      profileSelectorLabel: 'Profil de jeu',
      hideSigLabel: 'Masquer signature JITALX',
      timerStart: 'Démarrer',
      timerPause: 'Pause',
      timerReset: 'Reset',
      counterLabel: 'Compteur Défi',
      waitingScreenHeading: 'Le live démarre bientôt',
      activeMissionWidget: 'Mission active',
      noActiveMission: 'Aucune mission en cours',
      progressWidget: 'Complétion univers',
      camFrameLabel: 'FLUX WEBCAM',
    },
  },
};
