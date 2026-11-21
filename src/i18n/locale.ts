import { SubscriptionTier } from '../types';

export type Locale = 'en' | 'fr';

export const DEFAULT_LOCALE: Locale = 'en';

export type CatalogCategoryId =
  | 'all'
  | 'studio-kits'
  | 'templates'
  | 'saas-tools'
  | 'applications'
  | 'websites'
  | 'marketing'
  | 'creator-resources';

export interface LocalizedPlanCopy {
  name: string;
  badge?: string;
  tagline: string;
  priceDisplay: string;
  billingCycle: string;
  statusLabel: string;
  categoryLabel: string;
  features: string[];
  limits: {
    customProfiles: string;
    cloudSnapshots: string;
    overlayBranding: string;
    supportLevel: string;
  };
}

export interface StudioCopy {
  nav: {
    products: string;
    demo: string;
    pricing: string;
    creators: string;
    launchApp: string;
    account: string;
    signIn: string;
    obsStudio: string;
  };
  hero: {
    kicker: string;
    headline: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    shareLabel: string;
    copiedLabel: string;
    trustItems: [string, string, string];
    flagshipKicker: string;
    flagshipTitle: string;
    flagshipDesc: string;
    tryDemoCta: string;
  };
  catalog: {
    kicker: string;
    heading: string;
    subtitle: string;
    comparePlansCta: string;
    categories: Record<CatalogCategoryId, string>;
    emptyTitle: string;
    emptyDescription: string;
    emptyViewAll: string;
    emptyAction: string;
    viewDetails: string;
    openFreeApp: string;
    buyOnGumroad: string;
    comingSoonStripe: string;
    continueStripe: string;
    includedHeading: string;
    shareProduct: string;
    interactiveDemo: string;
    proceedCheckout: string;
    launchFreeApp: string;
    viewPlanDetails: string;
  };
  studio: {
    kicker: string;
    heading: string;
    subtitle: string;
    pillars: { index: string; title: string; description: string }[];
    previewKicker: string;
    previewHeading: string;
    previewDesc: string;
    previewFeat1: string;
    previewFeat2: string;
    launchWorkspace: string;
    openObsStudio: string;
    widgetKicker: string;
    widgetTag: string;
    speedLabel: string;
    armorLabel: string;
    sliderLabel: string;
    unlockCta: string;
    lockedHint: string;
  };
  trust: {
    kicker: string;
    heading: string;
    subtitle: string;
    copyLink: string;
    linkCopied: string;
    shareX: string;
    shareLinkedIn: string;
    communityKicker: string;
    communityTitle: string;
    communityDesc: string;
    joinDiscordCta: string;
    cards: { title: string; description: string }[];
  };
  demo: {
    kicker: string;
    heading: string;
    subtitle: string;
    testObsCta: string;
    openFullAppCta: string;
    statProgress: string;
    statMissions: string;
    statCollectibles: string;
    statUniverse: string;
    missionCardTitle: string;
    missionHint: string;
    collectiblesCardTitle: string;
    audioCardTitle: string;
    audioCardDesc: string;
    audioTriggerCta: string;
    trophyTitle: string;
    trophyDesc: string;
    radarTitle: string;
    radarHint: string;
  };
  radar: {
    title: string;
    subtitle: string;
    zoomTitle: string;
    muteTitle: string;
    unmuteTitle: string;
    westMark: string;
    filterAll: string;
    filterMissions: string;
    filterCollectibles: string;
    filterVehicles: string;
    signalLocked: string;
    typeMission: string;
    typeCollectible: string;
    typeVehicle: string;
    statusLabel: string;
    statusInProgress: string;
    statusAvailable: string;
    statusUndiscovered: string;
    statusUnlocked: string;
    statusLocked: string;
    vehicleSpeed: string;
    vehicleHandling: string;
    openMissionsCta: string;
    markCollectedCta: string;
    openGarageCta: string;
    noTargetTitle: string;
    noTargetDesc: string;
    targetsDisplayed: string;
    radarActive: string;
    targetAriaPrefix: string;
  };
  account: {
    kicker: string;
    heading: string;
    backToHud: string;
    signOut: string;
    dismiss: string;
    authKicker: string;
    authHeading: string;
    authDesc: string;
    signInBtn: string;
    signingInBtn: string;
    identityTitle: string;
    displayNameLabel: string;
    gamerTagLabel: string;
    streamChannelLabel: string;
    streamChannelPlaceholder: string;
    platformLabel: string;
    platformMulti: string;
    themeLabel: string;
    themeSunset: string;
    themeCyber: string;
    themeOpenWorld: string;
    saveProfileBtn: string;
    savingProfileBtn: string;
    profileSavedMsg: string;
    profileSaveErr: string;
    signInToEditProfile: string;
    profilesTitle: string;
    profilesAvailable: string;
    badgeCloud: string;
    badgeLocal: string;
    badgeDemo: string;
    badgeActive: string;
    deleteProfileTitle: string;
    createProfileHeadingCloud: string;
    createProfileHeadingLocal: string;
    profileNamePlaceholder: string;
    profileUniversePlaceholder: string;
    profileTagPlaceholder: string;
    themeOptSunset: string;
    themeOptCyber: string;
    themeOptOpenWorld: string;
    iconSun: string;
    iconFlame: string;
    iconZap: string;
    iconGamepad: string;
    addProfileBtn: string;
    creatingProfileBtn: string;
    cloudProfileCreated: string;
    cloudProfileCreateErr: string;
    localProfileCreated: string;
    cloudProfileDeleted: string;
    cloudProfileDeleteErr: string;
    localProfileDeleted: string;
    billingTitle: string;
    firestoreStatusLabel: string;
    firestoreStatusNote: string;
    launchOfferRow: string;
    gumroadActiveTag: string;
    stripeRow: string;
    stripeKeyDetected: string;
    stripeNotActive: string;
    gumroadBtn: string;
    pricingBtn: string;
    portalBtn: string;
    snapshotsTitle: string;
    snapshotsCountLabel: string;
    snapshotsDesc: string;
    snapshotsImageNote: string;
    saveSnapshotBtn: string;
    savingSnapshotBtn: string;
    snapshotSavedMsg: string;
    snapshotSaveErr: string;
    snapshotDeletedMsg: string;
    snapshotDeleteErr: string;
    snapshotRestoredMsg: string;
    snapshotsEmpty: string;
    snapshotsSignInHint: string;
    snapshotMissionsLabel: string;
    snapshotCollectiblesLabel: string;
    snapshotMarkersLabel: string;
    restoreSnapshotTitle: string;
    deleteSnapshotTitle: string;
  };
  streamers: {
    kicker: string;
    headlinePrefix: string;
    headlineAccent: string;
    subtitle: string;
    tryFreeCta: string;
    openStudioCta: string;
    trustItems: [string, string, string];
    archTitle: string;
    archTag: string;
    archCards: { title: string; desc: string }[];
    whyKicker: string;
    whyHeading: string;
    whySubtitle: string;
    whyCards: { title: string; desc: string }[];
    partnerKicker: string;
    partnerHeading: string;
    partnerDesc: string;
    partnerBullets: [string, string, string];
    tryFreeFirstCta: string;
    contactTitle: string;
    contactSubtitle: string;
    signInGoogleBtn: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    platformLabel: string;
    platformAgency: string;
    platformOther: string;
    inquiryTypeLabel: string;
    inquiryTypes: {
      creator_partnership: string;
      streamer_access: string;
      press_media: string;
      commercial: string;
    };
    channelUrlLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    verifiedAccountPrefix: string;
    signInHint: string;
    directEmailBtn: string;
    submitBtn: string;
    submittingBtn: string;
    errName: string;
    errEmail: string;
    errMessage: string;
    errSignInRequired: string;
    errSubmitFailed: string;
    errSaveCatch: string;
    successRecorded: string;
    footerDisclaimer: string;
  };
  backupGuide: {
    title: string;
    subtitle: string;
    noticeTitle: string;
    noticeDesc: string;
    steps: { num: string; title: string; desc: string; badge: string }[];
    noteTitle: string;
    noteDesc: string;
    exportNowBtn: string;
    openCloudBtn: string;
    closeBtn: string;
  };
  pricing: {
    kicker: string;
    heading: string;
    subtitle: string;
    activePaymentLabel: string;
    activePaymentValue: string;
    stripeReadyNote: string;
    stripePendingNote: string;
    myAccountCta: string;
    noticeTitle: string;
    currentPlanCta: string;
    startFreeCta: string;
    buyGumroadCta: string;
    subscribeStripeCta: string;
    comingSoonCta: string;
    freeSubtext: string;
    gumroadSubtext: string;
    stripeActiveSubtext: string;
    stripePendingSubtext: string;
    matrixHeader: string;
    matrixProfiles: string;
    matrixCloud: string;
    matrixOverlay: string;
    matrixSupport: string;
    securityAuth: string;
    securityPayment: string;
  };
  checkout: {
    backCta: string;
    summaryTitle: string;
    launchOffer: string;
    productLabel: string;
    accessLabel: string;
    processorLabel: string;
    processorValue: string;
    totalLabel: string;
    cardNotice: string;
    gumroadTitle: string;
    httpsVerified: string;
    bullets: [string, string, string];
    honestInfo: string;
    continueGumroad: string;
    officialLink: string;
    externalBadge: string;
  };
  footer: {
    copyright: string;
    disclaimer: string;
    products: string;
    demo: string;
    pricing: string;
    creators: string;
    obsStudio: string;
    account: string;
    discord: string;
  };
  plans: Record<SubscriptionTier, LocalizedPlanCopy>;
}

export const STUDIO_COPY: Record<Locale, StudioCopy> = {
  en: {
    nav: {
      products: 'Products',
      demo: 'Live Demo',
      pricing: 'Pricing',
      creators: 'Creators',
      launchApp: 'Launch App',
      account: 'Account',
      signIn: 'Sign In',
      obsStudio: 'OBS Overlay Studio',
    },
    hero: {
      kicker: '10JITAL PROD · Creative Software Lab',
      headline: '10JITAL PROD. Ideas in Action.',
      description:
        'We build studio kits, templates, SaaS, apps and websites that help creators, entrepreneurs and businesses launch faster, grow smarter and stand out worldwide.',
      primaryCta: 'Explore Products',
      secondaryCta: 'Discover 10JITAL PROD',
      shareLabel: 'Share',
      copiedLabel: 'Link Copied',
      trustItems: [
        'Instant Browser Access',
        'Firebase Cloud Ready',
        'Gumroad Checkout (€7 Launch Edition)',
      ],
      flagshipKicker: 'Flagship Live Software',
      flagshipTitle: 'JITALX — The Streamer Command Hub',
      flagshipDesc:
        'Tactical progression workspace, visual garage, interactive map, and native OBS 16:9 / 9:16 broadcast overlay.',
      tryDemoCta: 'Try Live Demo',
    },
    catalog: {
      kicker: '01. Product Catalog',
      heading: 'Products engineered for real execution',
      subtitle:
        'Browse our live releases and upcoming studio editions. Every price, feature, and checkout link below reflects our active production catalog.',
      comparePlansCta: 'Compare all plans & capabilities',
      categories: {
        all: 'All Products',
        'studio-kits': 'Studio Kits',
        templates: 'Templates',
        'saas-tools': 'SaaS Tools',
        applications: 'Applications',
        websites: 'Websites',
        marketing: 'Marketing & Advertising',
        'creator-resources': 'Creator Resources',
      },
      emptyTitle: 'Upcoming release in this category',
      emptyDescription:
        'We only list verified, active products. New 10JITAL PROD releases for this category are currently in production—explore our flagship live JITALX suite or contact the team for custom builds.',
      emptyViewAll: 'View All Active Releases',
      emptyAction: 'Request Custom Build',
      viewDetails: 'View Details',
      openFreeApp: 'Launch Free Edition',
      buyOnGumroad: 'Get Full Access · €7',
      comingSoonStripe: 'Stripe Billing Pending',
      continueStripe: 'Continue to Stripe',
      includedHeading: 'Included in this release',
      shareProduct: 'Share Product',
      interactiveDemo: 'Interactive Demo',
      proceedCheckout: 'Proceed to Checkout (€7)',
      launchFreeApp: 'Launch Free App',
      viewPlanDetails: 'View Plan Details',
    },
    studio: {
      kicker: '02. Discover 10JITAL PROD',
      heading: 'Built for global creators, founders, and modern teams',
      subtitle:
        '10JITAL PROD combines product engineering, interface design, and broadcast-ready tooling into practical software you can deploy immediately.',
      pillars: [
        {
          index: '01',
          title: 'Studio Kits & Design Systems',
          description:
            'Cohesive visual systems, modular UI layouts, and production-ready creative assets built for rapid deployment across global audiences.',
        },
        {
          index: '02',
          title: 'SaaS & Web Applications',
          description:
            'Fast React, TypeScript, and cloud-backed web tools engineered for clarity, offline resilience, and cross-device responsiveness.',
        },
        {
          index: '03',
          title: 'Creator & Broadcast Tooling',
          description:
            'Live second-screen command centers and OBS / TikTok Live browser sources engineered specifically for modern video creators.',
        },
        {
          index: '04',
          title: 'Global Launch Foundations',
          description:
            'Bilingual positioning, semantic SEO metadata, shareable previews, and structured multilingual readiness from day one.',
        },
      ],
      previewKicker: 'Interactive Product Preview',
      previewHeading: 'Test our flagship JITALX workspace directly in your browser',
      previewDesc:
        'Every module inside JITALX—interactive tactical map, visual garage, mission tracker, and OBS / TikTok Live Studio overlay—runs live in your browser right now.',
      previewFeat1: '360° Radar & Interactive Map',
      previewFeat2: '16:9 & 9:16 OBS Studio',
      launchWorkspace: 'Launch JITALX Workspace',
      openObsStudio: 'Open OBS Overlay Studio',
      widgetKicker: 'Interactive Demo Widget · Editable Preset',
      widgetTag: 'Garage Preview',
      speedLabel: 'Top Speed Tuning',
      armorLabel: 'Chassis Integrity',
      sliderLabel: 'Interactive calibration control',
      unlockCta: 'Open Official Gumroad Checkout (€7.00)',
      lockedHint: 'Slide to 100% to preview launch checkout',
    },
    trust: {
      kicker: '03. Verifiable Engineering',
      heading: 'Transparent architecture, verifiable safeguards',
      subtitle:
        'No fabricated reviews or inflated metrics—only real engineering practices you can inspect directly in the product.',
      copyLink: 'Copy Studio Link',
      linkCopied: 'Link Copied',
      shareX: 'Share on X',
      shareLinkedIn: 'LinkedIn',
      communityKicker: 'Official JITALX Server',
      communityTitle: 'Join the JITALX Discord Community',
      communityDesc:
        'Exchange custom multi-game profiles, OBS Studio overlay tips, release updates, and direct support with 10JITAL PROD.',
      joinDiscordCta: 'Join the Discord Community',
      cards: [
        {
          title: 'Isolated Cloud Accounts',
          description:
            'Google Sign-In via Firebase Auth with strict UID-scoped Firestore security rules.',
        },
        {
          title: 'Zero In-App Card Forms',
          description:
            'Payments for JITALX Full Access (€7) are processed externally on official Gumroad HTTPS checkout.',
        },
        {
          title: 'Offline-First Data Export',
          description: 'Local persistence with validated JSON backup export and import anytime.',
        },
        {
          title: 'Global & Responsive',
          description:
            'Built for desktop monitors, laptops, tablets, and mobile viewports with zero horizontal overflow.',
        },
      ],
    },
    demo: {
      kicker: 'Live Interactive Sandbox · Real-Time State Sync',
      heading: 'Experience JITALX in real operating conditions',
      subtitle:
        'Every action on this page—checking a mission step, collecting a coordinate item, or firing an audio trophy alert—mutates your real JITALX state and updates the OBS Overlay instantly.',
      testObsCta: 'Test OBS Overlay',
      openFullAppCta: 'Open Full JITALX App',
      statProgress: 'Global Progress',
      statMissions: 'Missions Completed',
      statCollectibles: 'Collectibles Found',
      statUniverse: 'Active Universe',
      missionCardTitle: '01. Interactive Mission Checklist',
      missionHint: 'Click any step to toggle',
      collectiblesCardTitle: '02. Collectibles & Coordinates',
      audioCardTitle: '03. HUD Alert & Web Audio Synth',
      audioCardDesc:
        'Trigger a live platinum achievement toast with real-time synthesized Web Audio feedback.',
      audioTriggerCta: 'Trigger Platinum Achievement',
      trophyTitle: 'JITALX Live Demo Verified',
      trophyDesc: 'Real-time HUD and OBS Overlay state sync is ready for your broadcast.',
      radarTitle: '04. Live 360° Tactical Radar',
      radarHint: 'Click targets on the radar to inspect coordinates and jump straight into JITALX',
    },
    radar: {
      title: '360° TACTICAL RADAR',
      subtitle: 'Live overview of your missions, collectibles, and vehicles',
      zoomTitle: 'Adjust radar range',
      muteTitle: 'Mute audio feedback',
      unmuteTitle: 'Enable synthesized audio feedback',
      westMark: 'W 270°',
      filterAll: 'SCAN ALL',
      filterMissions: 'MISSIONS',
      filterCollectibles: 'SECRETS',
      filterVehicles: 'GARAGE',
      signalLocked: 'SIGNAL LOCKED',
      typeMission: 'MISSION',
      typeCollectible: 'COLLECTIBLE',
      typeVehicle: 'VEHICLE',
      statusLabel: 'Status:',
      statusInProgress: 'IN PROGRESS',
      statusAvailable: 'AVAILABLE',
      statusUndiscovered: 'UNDISCOVERED',
      statusUnlocked: 'UNLOCKED',
      statusLocked: 'LOCKED',
      vehicleSpeed: 'Speed',
      vehicleHandling: 'Handling',
      openMissionsCta: 'OPEN MISSIONS',
      markCollectedCta: 'MARK COLLECTED',
      openGarageCta: 'OPEN GARAGE',
      noTargetTitle: 'NO TARGET SELECTED',
      noTargetDesc:
        'Click any glowing marker on the 360° radar to lock onto its coordinates and inspect rewards or jump to that module.',
      targetsDisplayed: 'MARKERS DISPLAYED',
      radarActive: 'RADAR ONLINE',
      targetAriaPrefix: 'Target:',
    },
    account: {
      kicker: 'Member Space · Profiles · Cloud Snapshots',
      heading: 'JITALX Account & Cloud Backups',
      backToHud: 'Back to HUD',
      signOut: 'Sign Out',
      dismiss: 'Dismiss',
      authKicker: 'Firebase Authentication · UID-Scoped Isolation',
      authHeading: 'Sign in to save your profiles and progression snapshots in the Cloud',
      authDesc:
        'Your Google account creates a private Firestore space (strictly isolated by user UID) to store manual progression snapshots (including map markers) and sync your custom universes.',
      signInBtn: 'Continue with Google',
      signingInBtn: 'Signing in...',
      identityTitle: 'Player & Streamer Identity',
      displayNameLabel: 'Display Name',
      gamerTagLabel: 'Gamer Tag / OBS Handle',
      streamChannelLabel: 'Stream Channel',
      streamChannelPlaceholder: 'twitch.tv/yourchannel',
      platformLabel: 'Primary Platform',
      platformMulti: 'Multi-stream',
      themeLabel: 'Favorite Theme',
      themeSunset: 'Sunset Neon',
      themeCyber: 'Cyber Sector',
      themeOpenWorld: 'Open World',
      saveProfileBtn: 'Save Profile',
      savingProfileBtn: 'Saving...',
      profileSavedMsg: 'Profile saved in Firestore for your account.',
      profileSaveErr: 'Failed to save profile.',
      signInToEditProfile: 'Sign in with Google above to customize your Cloud profile.',
      profilesTitle: 'Game Profiles & Universes',
      profilesAvailable: 'profiles available',
      badgeCloud: 'Cloud',
      badgeLocal: 'Local',
      badgeDemo: 'Demo',
      badgeActive: 'Active',
      deleteProfileTitle: 'Delete this custom profile',
      createProfileHeadingCloud: 'Create a custom profile (saved to your Cloud account)',
      createProfileHeadingLocal: 'Create a custom profile (stored locally)',
      profileNamePlaceholder: 'Profile name (e.g. 100% Open-World Run)',
      profileUniversePlaceholder: 'Campaign / Game (e.g. Main Story)',
      profileTagPlaceholder: 'Player tag',
      themeOptSunset: 'Theme: Sunset Neon',
      themeOptCyber: 'Theme: Cyber Sector',
      themeOptOpenWorld: 'Theme: Open World',
      iconSun: 'Icon: Sun',
      iconFlame: 'Icon: Flame',
      iconZap: 'Icon: Bolt',
      iconGamepad: 'Icon: Gamepad',
      addProfileBtn: 'Add Profile',
      creatingProfileBtn: 'Creating...',
      cloudProfileCreated: 'Profile "{name}" created in your Cloud space.',
      cloudProfileCreateErr: 'Unable to create Cloud profile.',
      localProfileCreated: 'Local profile "{name}" created and activated.',
      cloudProfileDeleted: 'Cloud profile deleted.',
      cloudProfileDeleteErr: 'Unable to delete this Cloud profile.',
      localProfileDeleted: 'Local profile deleted.',
      billingTitle: 'Access & Billing',
      firestoreStatusLabel: 'Account Firestore Entitlement',
      firestoreStatusNote:
        'Paid entitlements cannot be modified from the client (protected by Firestore security rules).',
      launchOfferRow: 'Launch Offer (€7.00)',
      gumroadActiveTag: 'Gumroad Active',
      stripeRow: 'Stripe Subscriptions',
      stripeKeyDetected: 'Key Detected',
      stripeNotActive: 'Not Active',
      gumroadBtn: 'Gumroad Offer €7',
      pricingBtn: 'Pricing',
      portalBtn: 'Portal',
      snapshotsTitle: 'Manual Cloud Snapshots',
      snapshotsCountLabel: 'snapshot(s)',
      snapshotsDesc:
        'Cloud snapshots are saved on demand (no background auto-sync) and isolated to your Firebase UID. Includes missions, collectibles, vehicles, objectives, notes, and map markers.',
      snapshotsImageNote:
        'Note: local base64 vehicle images over 2 KB are omitted from Cloud snapshots to stay within Firestore limits; use JSON Export in Stats to archive full local images.',
      saveSnapshotBtn: 'Save Cloud Snapshot ({progress}%)',
      savingSnapshotBtn: 'Saving...',
      snapshotSavedMsg: 'Snapshot "{name}" ({progress}%) saved in Firestore.',
      snapshotSaveErr: 'Cloud backup failed.',
      snapshotDeletedMsg: 'Snapshot removed from Cloud.',
      snapshotDeleteErr: 'Unable to delete this snapshot.',
      snapshotRestoredMsg: 'Snapshot "{name}" restored into your HUD (including map markers).',
      snapshotsEmpty:
        'No snapshots saved yet. Click above to archive your missions, collectibles, vehicles, objectives, notes, and map markers.',
      snapshotsSignInHint:
        'Sign in with Google to create and restore Cloud snapshots in Firestore (local JSON export/import remains available in Stats & Backups).',
      snapshotMissionsLabel: 'Missions',
      snapshotCollectiblesLabel: 'Collectibles',
      snapshotMarkersLabel: 'Markers',
      restoreSnapshotTitle: 'Restore this snapshot',
      deleteSnapshotTitle: 'Delete this snapshot',
    },
    streamers: {
      kicker: 'JITALX · THE STREAMER COMMAND HUB · 10JITAL PROD',
      headlinePrefix: 'Turn your open-world marathon into a',
      headlineAccent: 'live tactical broadcast',
      subtitle:
        'JITALX pairs a customizable second-screen mission tracker with a built-in OBS and TikTok Live Studio overlay. Built for upcoming open-world marathons using your own custom checklists or our editable demo presets.',
      tryFreeCta: 'Try JITALX Free',
      openStudioCta: 'Open OBS Overlay Studio',
      trustItems: [
        'OBS Browser Source Ready',
        '1920x1080 Landscape & 9:16 Vertical',
        'No Credit Card Required',
      ],
      archTitle: 'Stream Output Architecture',
      archTag: 'OBS + TikTok Live',
      archCards: [
        {
          title: '16:9 Twitch & YouTube Layout',
          desc: 'Neon 16:9 webcam frame, synchronized 100% completion bar, active mission tracker, and live stopwatch built for 1080p capture.',
        },
        {
          title: '9:16 TikTok Live Vertical Mode',
          desc: 'One-click vertical layout preset keeping your webcam, mission progress, and timer crystal clear on mobile screens.',
        },
        {
          title: '3 Instant OBS Backdrop Modes',
          desc: 'Switch between Transparent Browser Source, Chroma Key Green (#00ff00), and a Sunset Neon “Starting Soon” waiting screen.',
        },
      ],
      whyKicker: '01. Why Creators Use JITALX',
      whyHeading: 'Designed for high-retention open-world launch streams',
      whySubtitle:
        'Every module is engineered to reduce broadcast friction while giving viewers real-time context on your custom playthrough goals. Included universes are fictional, fully editable demo data.',
      whyCards: [
        {
          title: 'Live Mission & Collectible Sync',
          desc: 'Check off mission steps, hidden collectibles, vehicles, or trophies on your second monitor and watch your live OBS HUD progress bar update immediately.',
        },
        {
          title: 'Session Timer & Challenge Counter',
          desc: 'Built-in Start/Pause/Reset marathon timer plus a live customizable challenge or attempt counter right inside the OBS overlay.',
        },
        {
          title: 'Clean Capture Mode (Key H)',
          desc: 'Press H or copy the direct OBS Browser Source URL to hide all editor controls and capture pure graphics.',
        },
      ],
      partnerKicker: '02. Creators & Partnerships',
      partnerHeading: 'Partner with 10JITAL PROD for your next marathon',
      partnerDesc:
        'We are opening early creator collaborations for Twitch, YouTube, Kick, and TikTok Live broadcasters preparing story runs, 100% completion challenges, and community open-world events.',
      partnerBullets: [
        'Direct feedback channel with the 10JITAL PROD team for custom overlay widgets.',
        'Early access to upcoming creator overlay presets and multi-game profiles.',
        'Co-branded community giveaways and affiliate launch collaboration options.',
      ],
      tryFreeFirstCta: 'Try JITALX Free First',
      contactTitle: 'Creator & Business Contact',
      contactSubtitle:
        'Reach 10JITAL PROD for creator partnerships, press kits, or commercial licensing.',
      signInGoogleBtn: 'Sign in with Google',
      nameLabel: 'Name or Creator Handle *',
      namePlaceholder: 'Alex / @AlexLive',
      emailLabel: 'Business Email *',
      emailPlaceholder: 'creator@domain.com',
      platformLabel: 'Primary Platform',
      platformAgency: 'Talent Agency',
      platformOther: 'Other',
      inquiryTypeLabel: 'Inquiry Type',
      inquiryTypes: {
        creator_partnership: 'Creator Partnership',
        streamer_access: 'Streamer Early Access',
        press_media: 'Press & Media',
        commercial: 'Commercial / Licensing',
      },
      channelUrlLabel: 'Channel URL (Optional)',
      messageLabel: 'Message & Stream Setup Details *',
      messagePlaceholder:
        'Tell us about your channel, streaming format (16:9 / 9:16), or partnership goals...',
      verifiedAccountPrefix: 'Verified account:',
      signInHint: 'Sign in to submit in-app, or email directly',
      directEmailBtn: 'Direct Email',
      submitBtn: 'Submit Inquiry',
      submittingBtn: 'Sending...',
      errName: 'Please enter your name or creator handle (at least 2 characters).',
      errEmail: 'Please enter a valid contact email address.',
      errMessage: 'Please share a brief message (at least 10 characters).',
      errSignInRequired:
        'Sign in with Google to submit directly into our verified creator queue, or use the direct email button below.',
      errSubmitFailed: 'Submission failed.',
      errSaveCatch:
        'Could not save inquiry right now. You can send it directly via email using the button below.',
      successRecorded:
        'Your inquiry ({id}) has been securely recorded. Our team at 10JITAL PROD will reply to {email}.',
      footerDisclaimer:
        'JITALX is an independent multi-game command hub and OBS overlay studio by 10JITAL PROD, not affiliated with or endorsed by any game publisher or streaming platform.',
    },
    backupGuide: {
      title: 'Backup & Portability Guide',
      subtitle: 'JSON EXPORT, RESTORE & CLOUD SNAPSHOTS',
      noticeTitle: 'Keep your progress safe across devices:',
      noticeDesc:
        'JITALX stores your workspace automatically in your browser. To move your setup to another PC, share a preset, or archive a marathon run, use JSON Export or Firebase Cloud Snapshots.',
      steps: [
        {
          num: '01',
          title: 'Export a validated JSON backup',
          desc: 'Click “Export JSON” to download a complete local file containing your active profile, missions, collectibles, garage vehicles (including custom images), objectives, notes, and custom map markers.',
          badge: 'Offline Archive',
        },
        {
          num: '02',
          title: 'Restore on any browser or workstation',
          desc: 'Open Stats & Backups on your target computer, click “Import JSON”, and select your backup file. JITALX validates the schema before applying it so corrupted files never overwrite your data.',
          badge: 'Schema Validated',
        },
        {
          num: '03',
          title: 'Create on-demand Cloud Snapshots',
          desc: 'Sign in with Google on the Account page to save private UID-isolated Cloud snapshots in Firestore—including your missions, collectibles, garage, objectives, notes, and map markers.',
          badge: 'Firebase Cloud',
        },
        {
          num: '04',
          title: 'Copy your OBS Studio Browser Source URL',
          desc: 'Inside Streamer Studio, copy your customized 16:9 or 9:16 URL with transparent or chroma backdrop to reuse your exact broadcast scene in OBS Studio or TikTok Live Studio.',
          badge: 'OBS Ready',
        },
      ],
      noteTitle: 'Local vs. Cloud images:',
      noteDesc:
        'JSON backups preserve full local base64 images. Cloud snapshots strip base64 uploads over 2 KB to respect Firestore document limits.',
      exportNowBtn: 'Export JSON Now',
      openCloudBtn: 'Open Cloud Account',
      closeBtn: 'Got it',
    },
    pricing: {
      kicker: '10JITAL PROD Store · Launch Offer €7 One-Time',
      heading: 'Transparent pricing for solo players and live creators',
      subtitle:
        'Launch JITALX Starter Free right now in your browser, or unlock the €7.00 Full Access launch edition on official Gumroad. Monthly Stripe subscriptions remain inactive until server-side billing is deployed.',
      activePaymentLabel: 'Active checkout today:',
      activePaymentValue:
        'JITALX Full Access Launch Offer (€7.00 one-time) processed exclusively via official Gumroad.',
      stripeReadyNote:
        'Stripe publishable key detected: verify your Price IDs and backend webhook endpoint.',
      stripePendingNote:
        'Monthly Stripe subscriptions are in preparation—zero card details are collected in-app. Automatic Gumroad-to-Firestore license sync requires deploying a server webhook.',
      myAccountCta: 'My Account',
      noticeTitle: 'Monthly subscription not active yet',
      currentPlanCta: 'Active Plan',
      startFreeCta: 'Start Free Now',
      buyGumroadCta: 'Buy on Gumroad · €7',
      subscribeStripeCta: 'Subscribe via Stripe',
      comingSoonCta: 'Coming Soon',
      freeSubtext: 'Instant browser access · No account required',
      gumroadSubtext: 'Official external Gumroad HTTPS checkout',
      stripeActiveSubtext: 'Stripe Checkout active',
      stripePendingSubtext: 'Awaiting Stripe server backend',
      matrixHeader: 'Capability',
      matrixProfiles: 'Profiles & Universes',
      matrixCloud: 'Cloud Backups',
      matrixOverlay: 'OBS Overlay Branding',
      matrixSupport: 'Support',
      securityAuth:
        'Firebase Google Sign-In with strict UID-isolated Cloud Firestore security rules.',
      securityPayment:
        'Zero payment card details collected in-app (checkout delegated to Gumroad HTTPS).',
    },
    checkout: {
      backCta: 'BACK',
      summaryTitle: 'Order Summary',
      launchOffer: 'Launch Offer',
      productLabel: 'PRODUCT',
      accessLabel: 'ACCESS',
      processorLabel: 'PROCESSOR',
      processorValue: 'Gumroad (Official HTTPS)',
      totalLabel: 'TOTAL',
      cardNotice:
        'No payment card details are collected or stored inside 10JITAL PROD or JITALX. Checkout is processed exclusively on Gumroad.',
      gumroadTitle: 'Gumroad Checkout',
      httpsVerified: 'HTTPS Verified',
      bullets: [
        'One-time €7.00 launch price — no recurring subscription or hidden fees.',
        'Full access to JITALX themes, custom profiles, JSON backup, and OBS / TikTok Live Studio.',
        'Secure external redirect to the official Gumroad product page.',
      ],
      honestInfo:
        'This app never simulates payments or unlocks paid tiers in localStorage. After purchasing on Gumroad, keep your receipt (server-side webhook sync to Firestore requires backend deployment).',
      continueGumroad: 'Continue to Gumroad',
      officialLink: 'Official checkout:',
      externalBadge: 'EXTERNAL CHECKOUT',
    },
    footer: {
      copyright: '© 2026 10JITAL PROD · JITALX. Ideas in Action.',
      disclaimer:
        'Independent multi-game platform by 10JITAL PROD · Not affiliated with or endorsed by any game publisher.',
      products: 'Products',
      demo: 'Live Demo',
      pricing: 'Pricing',
      creators: 'Creators',
      obsStudio: 'OBS Studio',
      account: 'Account',
      discord: 'Discord',
    },
    plans: {
      free: {
        name: 'JITALX Starter Edition',
        tagline:
          'Instant browser-based command hub with mission tracking, 360° radar, visual garage, tactical map, and OBS overlay preview.',
        priceDisplay: '€0',
        billingCycle: 'Free · No card required',
        statusLabel: 'Live Free Access',
        categoryLabel: 'Applications · Creator Resources',
        features: [
          'Instant browser launch with zero sign-up required',
          'Missions, Collectibles, Visual Garage, Tactical Map & Notes',
          'Offline localStorage persistence + validated JSON Export/Import',
          'Built-in Streamer Studio OBS preview (Chroma, Transparent & Sunset Neon)',
          '3 editable demo universes included',
        ],
        limits: {
          customProfiles: '3 presets + local custom',
          cloudSnapshots: 'Manual Cloud snapshots (signed-in)',
          overlayBranding: 'Subtle JITALX · 10JITAL mark',
          supportLevel: 'Documentation',
        },
      },
      lifetime: {
        name: 'JITALX Full Access',
        badge: 'LAUNCH OFFER · GUMROAD',
        tagline:
          'Complete second-screen tactical command hub, visual garage, interactive map, and 16:9 / 9:16 OBS broadcast studio.',
        priceDisplay: '€7.00',
        billingCycle: 'One-time · Official Gumroad',
        statusLabel: 'Live Release',
        categoryLabel: 'Applications · Creator Resources · Studio Kits',
        features: [
          'One-time €7.00 payment handled directly on Gumroad',
          'All themes: Sunset Neon, Cyber Grid, and Open World',
          'OBS & TikTok Live Studio overlay (16:9 & 9:16, Chroma & Transparent)',
          'Custom game profiles, map markers & Firebase Cloud snapshots',
          'Zero payment card details entered in-app',
        ],
        limits: {
          customProfiles: 'Unlimited',
          cloudSnapshots: 'Cloud Snapshots & JSON Export',
          overlayBranding: 'Optional signature hide included',
          supportLevel: 'Updates included',
        },
      },
      pro_monthly: {
        name: 'JITALX Pro Monthly',
        badge: 'COMING SOON · STRIPE',
        tagline:
          'Subscription tier prepared for multi-device creator workflows and recurring studio updates once Stripe billing is activated.',
        priceDisplay: '€4.99',
        billingCycle: '/ month · Stripe pending',
        statusLabel: 'Stripe Backend Pending',
        categoryLabel: 'SaaS Tools',
        features: [
          'All JITALX Starter Edition capabilities',
          'Unlimited custom game profiles',
          'Multi-device Firestore cloud snapshot workflows',
          'Advanced stats & HUD alert customization',
          'Activation scheduled after Stripe server deployment',
        ],
        limits: {
          customProfiles: 'Unlimited',
          cloudSnapshots: 'Multi-device',
          overlayBranding: 'Customizable',
          supportLevel: 'Priority email support',
        },
      },
      creator: {
        name: 'JITALX Creator Studio',
        badge: 'COMING SOON · STRIPE',
        tagline:
          'Dedicated multi-platform creator tier for Twitch, YouTube, and TikTok Live broadcasters with white-label overlay options.',
        priceDisplay: '€14.99',
        billingCycle: '/ month · Stripe pending',
        statusLabel: 'Stripe Backend Pending',
        categoryLabel: 'Creator Resources · Marketing & Advertising',
        features: [
          'All JITALX Full Access modules',
          'Advanced OBS widgets (Active mission, Counter, Browser Source URL)',
          'Multi-platform 16:9 & 9:16 live streaming presets',
          'Early access to upcoming 10JITAL PROD overlay packs',
          'Activation scheduled after Stripe server deployment',
        ],
        limits: {
          customProfiles: 'Unlimited + Multi-live scenes',
          cloudSnapshots: 'Unlimited + Fast restore',
          overlayBranding: 'White-label',
          supportLevel: 'Direct creator support',
        },
      },
    },
  },
  fr: {
    nav: {
      products: 'Produits',
      demo: 'Démo',
      pricing: 'Tarifs',
      creators: 'Créateurs',
      launchApp: 'Ouvrir JITALX',
      account: 'Compte',
      signIn: 'Connexion',
      obsStudio: 'Studio Overlay OBS',
    },
    hero: {
      kicker: '10JITAL PROD · Atelier Logiciel & Créateurs',
      headline: '10JITAL PROD. Ideas in Action.',
      description:
        'Nous concevons des kits studio, templates, SaaS, applications et sites web pour aider créateurs, entrepreneurs et entreprises à lancer plus vite, grandir plus intelligemment et se démarquer partout dans le monde.',
      primaryCta: 'Explorer les produits',
      secondaryCta: 'Découvrir 10JITAL PROD',
      shareLabel: 'Partager',
      copiedLabel: 'Lien copié',
      trustItems: [
        'Accès immédiat navigateur',
        'Compatible Cloud Firebase',
        'Paiement Gumroad (Offre 7 €)',
      ],
      flagshipKicker: 'Logiciel Phare Actif',
      flagshipTitle: 'JITALX — The Streamer Command Hub',
      flagshipDesc:
        'Espace de progression tactique, garage visuel, carte interactive et studio d’overlay OBS 16:9 & 9:16 intégré.',
      tryDemoCta: 'Tester la démo',
    },
    catalog: {
      kicker: '01. Catalogue Produits',
      heading: 'Des produits conçus pour une exécution réelle',
      subtitle:
        'Parcourez nos produits actifs et nos éditions à venir. Chaque prix, fonctionnalité et lien de paiement reflète fidèlement notre catalogue en production.',
      comparePlansCta: 'Comparer toutes les formules',
      categories: {
        all: 'Tous les produits',
        'studio-kits': 'Kits Studio',
        templates: 'Templates',
        'saas-tools': 'Outils SaaS',
        applications: 'Applications',
        websites: 'Sites Web',
        marketing: 'Marketing & Pub',
        'creator-resources': 'Ressources Créateurs',
      },
      emptyTitle: 'Sortie à venir dans cette catégorie',
      emptyDescription:
        'Nous affichons uniquement des produits réels et vérifiés. Les prochaines sorties 10JITAL PROD dans cette catégorie sont en cours de production — explorez notre suite phare JITALX ou contactez l’équipe.',
      emptyViewAll: 'Voir toutes les sorties actives',
      emptyAction: 'Demander un projet sur mesure',
      viewDetails: 'Voir le détail',
      openFreeApp: 'Ouvrir la version gratuite',
      buyOnGumroad: 'Accès Complet · 7 €',
      comingSoonStripe: 'Stripe en préparation',
      continueStripe: 'Continuer vers Stripe',
      includedHeading: 'Inclus dans cette édition',
      shareProduct: 'Partager le produit',
      interactiveDemo: 'Démo interactive',
      proceedCheckout: 'Passer au paiement (7 €)',
      launchFreeApp: 'Lancer l’app gratuite',
      viewPlanDetails: 'Voir les tarifs',
    },
    studio: {
      kicker: '02. Découvrir 10JITAL PROD',
      heading: 'Pensé pour les créateurs, fondateurs et équipes modernes',
      subtitle:
        '10JITAL PROD réunit ingénierie produit, design d’interface et outils de diffusion live dans des logiciels pratiques prêts à déployer immédiatement.',
      pillars: [
        {
          index: '01',
          title: 'Kits Studio & Design Systems',
          description:
            'Systèmes visuels cohérents, interfaces modulaires et ressources créatives prêtes pour un déploiement rapide auprès d’une audience mondiale.',
        },
        {
          index: '02',
          title: 'SaaS & Applications Web',
          description:
            'Outils web React, TypeScript et Cloud conçus pour la rapidité, la résilience hors-ligne et le confort multi-écrans.',
        },
        {
          index: '03',
          title: 'Outils Créateurs & Diffusion Live',
          description:
            'Centres de commande second-écran et sources navigateur OBS / TikTok Live pensés pour les créateurs vidéo modernes.',
        },
        {
          index: '04',
          title: 'Fondations de Lancement Global',
          description:
            'Positionnement bilingue, SEO sémantique, aperçus sociaux partageables et architecture multilingue évolutive.',
        },
      ],
      previewKicker: 'Aperçu Produit Interactif',
      previewHeading: 'Testez notre espace phare JITALX directement dans votre navigateur',
      previewDesc:
        'Chaque module de JITALX — carte tactique interactive, garage visuel, suivi de missions et studio d’overlay OBS / TikTok Live — fonctionne en direct dès maintenant.',
      previewFeat1: 'Radar 360° & Carte Interactive',
      previewFeat2: 'Studio OBS 16:9 & 9:16',
      launchWorkspace: 'Ouvrir l’espace JITALX',
      openObsStudio: 'Ouvrir le Studio Overlay OBS',
      widgetKicker: 'Widget Démo Interactif · Modèle Éditable',
      widgetTag: 'Aperçu Garage',
      speedLabel: 'Préparation Vitesse Max',
      armorLabel: 'Châssis Renforcé',
      sliderLabel: 'Jauge de calibration interactive',
      unlockCta: 'Ouvrir le paiement officiel Gumroad (7,00 €)',
      lockedHint: 'Glissez jusqu’à 100 % pour afficher le paiement',
    },
    trust: {
      kicker: '03. Ingénierie Vérifiable',
      heading: 'Architecture transparente et garanties vérifiables',
      subtitle:
        'Aucun faux avis ni compteur gonflé : uniquement des garanties techniques réelles que vous pouvez vérifier directement dans l’application.',
      copyLink: 'Copier le lien',
      linkCopied: 'Lien copié',
      shareX: 'Partager sur X',
      shareLinkedIn: 'LinkedIn',
      communityKicker: 'Serveur Officiel JITALX',
      communityTitle: 'Rejoignez la communauté Discord JITALX',
      communityDesc:
        'Partagez vos profils multi-jeux, astuces d’overlay OBS Studio, nouveautés produit et obtenez le support direct de 10JITAL PROD.',
      joinDiscordCta: 'Rejoindre la communauté Discord',
      cards: [
        {
          title: 'Comptes Cloud Isolés',
          description:
            'Connexion Google via Firebase Auth avec règles de sécurité Firestore strictement isolées par UID.',
        },
        {
          title: 'Aucune Saisie Bancaire Interne',
          description:
            'Le paiement de JITALX Full Access (7 €) est traité exclusivement en externe via Gumroad HTTPS.',
        },
        {
          title: 'Sauvegarde Locale & Export JSON',
          description:
            'Persistance locale instantanée avec export et import JSON validés à tout moment.',
        },
        {
          title: 'Multi-Écrans & Responsive',
          description:
            'Conçu pour écrans desktop, ordinateurs portables, tablettes et mobiles sans débordement horizontal.',
        },
      ],
    },
    demo: {
      kicker: 'Bac à sable interactif · Synchronisation en direct',
      heading: 'Testez JITALX en conditions réelles',
      subtitle:
        'Chaque action effectuée ici (validation d’étape, collectible coché ou trophée audio) met à jour votre véritable état JITALX et se reflète instantanément dans l’Overlay OBS.',
      testObsCta: 'Tester l’Overlay OBS',
      openFullAppCta: 'Ouvrir JITALX complet',
      statProgress: 'Progression globale',
      statMissions: 'Missions terminées',
      statCollectibles: 'Collectibles trouvés',
      statUniverse: 'Univers actif',
      missionCardTitle: '01. Checklist de mission interactive',
      missionHint: 'Cliquez pour cocher une étape',
      collectiblesCardTitle: '02. Collectibles & coordonnées',
      audioCardTitle: '03. Alerte HUD & synthèse audio',
      audioCardDesc:
        'Déclenchez une notification de trophée Platine avec son Web Audio synthétisé en temps réel.',
      audioTriggerCta: 'Déclencher un trophée Platine',
      trophyTitle: 'Démo JITALX Validée',
      trophyDesc: 'Synchronisation temps réel HUD et Overlay OBS prête pour votre live.',
      radarTitle: '04. Radar holographique 360° en direct',
      radarHint: 'Cliquez sur les cibles du radar pour inspecter la distance et ouvrir le module',
    },
    radar: {
      title: 'RADAR TACTIQUE 360°',
      subtitle: 'Vue synthétique de vos missions, collectibles et véhicules',
      zoomTitle: 'Ajuster la portée du radar',
      muteTitle: 'Couper le son',
      unmuteTitle: 'Activer le retour sonore synthétisé',
      westMark: 'O 270°',
      filterAll: 'TOUT SCANNER',
      filterMissions: 'MISSIONS',
      filterCollectibles: 'SECRETS',
      filterVehicles: 'GARAGE',
      signalLocked: 'SIGNAL LOCALISÉ',
      typeMission: 'MISSION',
      typeCollectible: 'COLLECTIBLE',
      typeVehicle: 'VÉHICULE',
      statusLabel: 'Statut :',
      statusInProgress: 'EN COURS',
      statusAvailable: 'DISPONIBLE',
      statusUndiscovered: 'NON DÉCOUVERT',
      statusUnlocked: 'DÉVERROUILLÉ',
      statusLocked: 'VERROUILLÉ',
      vehicleSpeed: 'Vitesse',
      vehicleHandling: 'Maniabilité',
      openMissionsCta: 'OUVRIR LES MISSIONS',
      markCollectedCta: 'MARQUER RÉCUPÉRÉ',
      openGarageCta: 'OUVRIR LE GARAGE',
      noTargetTitle: 'AUCUNE CIBLE SÉLECTIONNÉE',
      noTargetDesc:
        'Cliquez sur un marqueur lumineux du radar 360° pour verrouiller ses coordonnées et inspecter ses récompenses ou ouvrir le module associé.',
      targetsDisplayed: 'REPÈRES AFFICHÉS',
      radarActive: 'RADAR ACTIF',
      targetAriaPrefix: 'Cible :',
    },
    account: {
      kicker: 'Espace Membre · Profils · Snapshots Cloud',
      heading: 'Compte & Sauvegardes Cloud JITALX',
      backToHud: 'Retour au HUD',
      signOut: 'Déconnexion',
      dismiss: 'Fermer',
      authKicker: 'Authentification Firebase · Isolation par UID',
      authHeading: 'Connectez-vous pour enregistrer vos profils et snapshots dans le Cloud',
      authDesc:
        'Votre compte Google crée un espace privé dans Firestore (strictement isolé par identifiant utilisateur) pour sauvegarder manuellement vos snapshots de progression (marqueurs de carte inclus) et synchroniser vos profils personnalisés.',
      signInBtn: 'Continuer avec Google',
      signingInBtn: 'Connexion en cours...',
      identityTitle: 'Identité Joueur & Streamer',
      displayNameLabel: 'Nom affiché',
      gamerTagLabel: 'Gamer Tag / Pseudo OBS',
      streamChannelLabel: 'Chaîne de stream',
      streamChannelPlaceholder: 'twitch.tv/votrechaine',
      platformLabel: 'Plateforme principale',
      platformMulti: 'Multi-stream',
      themeLabel: 'Thème favori',
      themeSunset: 'Sunset Néon',
      themeCyber: 'Secteur Cyber',
      themeOpenWorld: 'Monde Libre',
      saveProfileBtn: 'Enregistrer le profil',
      savingProfileBtn: 'Enregistrement...',
      profileSavedMsg: 'Profil enregistré dans Firestore pour votre compte.',
      profileSaveErr: 'Erreur lors de la sauvegarde du profil.',
      signInToEditProfile:
        'Connectez-vous avec Google ci-dessus pour personnaliser votre profil Cloud.',
      profilesTitle: 'Profils & Univers de Jeu',
      profilesAvailable: 'profils disponibles',
      badgeCloud: 'Cloud',
      badgeLocal: 'Local',
      badgeDemo: 'Démo',
      badgeActive: 'Actif',
      deleteProfileTitle: 'Supprimer ce profil personnalisé',
      createProfileHeadingCloud: 'Créer un profil personnalisé (stocké dans votre compte Cloud)',
      createProfileHeadingLocal: 'Créer un profil personnalisé (stocké en local)',
      profileNamePlaceholder: 'Nom du profil (ex : Run 100% Open-World)',
      profileUniversePlaceholder: 'Campagne / Jeu (ex : Campagne Principale)',
      profileTagPlaceholder: 'Tag joueur',
      themeOptSunset: 'Thème Sunset Néon',
      themeOptCyber: 'Thème Secteur Cyber',
      themeOptOpenWorld: 'Thème Monde Libre',
      iconSun: 'Icône Soleil',
      iconFlame: 'Icône Flamme',
      iconZap: 'Icône Éclair',
      iconGamepad: 'Icône Manette',
      addProfileBtn: 'Ajouter le profil',
      creatingProfileBtn: 'Création...',
      cloudProfileCreated: 'Profil « {name} » créé dans votre espace Cloud.',
      cloudProfileCreateErr: 'Impossible de créer le profil Cloud.',
      localProfileCreated: 'Profil local « {name} » créé et activé.',
      cloudProfileDeleted: 'Profil Cloud supprimé.',
      cloudProfileDeleteErr: 'Impossible de supprimer ce profil Cloud.',
      localProfileDeleted: 'Profil local supprimé.',
      billingTitle: 'Accès & Facturation',
      firestoreStatusLabel: 'Statut Firestore du compte',
      firestoreStatusNote:
        'Les droits payants ne peuvent pas être modifiés côté client (protégés par les règles Firestore).',
      launchOfferRow: 'Offre de lancement (7 €)',
      gumroadActiveTag: 'Gumroad actif',
      stripeRow: 'Abonnements Stripe',
      stripeKeyDetected: 'Clé détectée',
      stripeNotActive: 'Non activé',
      gumroadBtn: 'Offre Gumroad 7 €',
      pricingBtn: 'Tarifs',
      portalBtn: 'Portail',
      snapshotsTitle: 'Snapshots Cloud Manuels',
      snapshotsCountLabel: 'snapshot(s)',
      snapshotsDesc:
        'Les snapshots Cloud sont enregistrés à la demande (sans synchronisation automatique en arrière-plan) et isolés sur votre UID Firebase. Inclut missions, collectibles, véhicules, objectifs, notes et marqueurs de carte.',
      snapshotsImageNote:
        'Note : les images locales de véhicules en base64 (> 2 Ko) sont omises des snapshots Cloud pour respecter la limite Firestore ; utilisez l’export JSON dans Statistiques pour archiver les images complètes.',
      saveSnapshotBtn: 'Enregistrer un snapshot ({progress}%)',
      savingSnapshotBtn: 'Enregistrement...',
      snapshotSavedMsg: 'Snapshot « {name} » ({progress}%) enregistré dans Firestore.',
      snapshotSaveErr: 'Échec de la sauvegarde Cloud.',
      snapshotDeletedMsg: 'Snapshot supprimé du Cloud.',
      snapshotDeleteErr: 'Impossible de supprimer ce snapshot.',
      snapshotRestoredMsg: 'Snapshot « {name} » restauré dans votre HUD (marqueurs de carte inclus).',
      snapshotsEmpty:
        'Aucun snapshot enregistré. Cliquez ci-dessus pour archiver vos missions, collectibles, véhicules, objectifs, notes et marqueurs de carte.',
      snapshotsSignInHint:
        'Connectez-vous avec Google pour créer et restaurer des snapshots Cloud dans Firestore (l’export/import JSON local reste disponible dans Statistiques).',
      snapshotMissionsLabel: 'Missions',
      snapshotCollectiblesLabel: 'Collectibles',
      snapshotMarkersLabel: 'Repères',
      restoreSnapshotTitle: 'Restaurer ce snapshot',
      deleteSnapshotTitle: 'Supprimer ce snapshot',
    },
    streamers: {
      kicker: 'JITALX · THE STREAMER COMMAND HUB · 10JITAL PROD',
      headlinePrefix: 'Transformez votre marathon open-world en',
      headlineAccent: 'diffusion tactique en direct',
      subtitle:
        'JITALX combine un suivi de missions second-écran personnalisable avec un studio d’overlay intégré pour OBS et TikTok Live. Prêt pour vos marathons open-world avec vos propres checklists ou nos univers de démonstration éditables.',
      tryFreeCta: 'Essayer JITALX gratuitement',
      openStudioCta: 'Ouvrir le Studio Overlay OBS',
      trustItems: [
        'Prêt pour Source Navigateur OBS',
        'Formats 1920x1080 Paysage & 9:16 Vertical',
        'Sans carte bancaire',
      ],
      archTitle: 'Architecture de Diffusion Live',
      archTag: 'OBS + TikTok Live',
      archCards: [
        {
          title: 'Mise en page 16:9 Twitch & YouTube',
          desc: 'Cadre webcam 16:9, barre de progression 100 % synchronisée, suivi de mission active et chronomètre live pensés pour une capture 1080p.',
        },
        {
          title: 'Mode Vertical 9:16 TikTok Live',
          desc: 'Préréglage vertical en un clic qui garde votre webcam, votre avancement et votre chrono parfaitement lisibles sur mobile.',
        },
        {
          title: '3 Modes de Fond OBS Instantanés',
          desc: 'Basculez entre Source Navigateur Transparente, Fond Vert Chroma Key (#00ff00) et écran d’attente Sunset Néon.',
        },
      ],
      whyKicker: '01. Pourquoi les créateurs choisissent JITALX',
      whyHeading: 'Pensé pour des lives marathons fluides et lisibles',
      whySubtitle:
        'Chaque module réduit la friction pendant votre diffusion tout en donnant au chat un contexte clair sur vos objectifs. Les univers inclus sont des modèles éditables.',
      whyCards: [
        {
          title: 'Synchro Missions & Collectibles en Direct',
          desc: 'Cochez vos étapes, collectibles, véhicules ou trophées sur votre second écran et observez la barre de progression OBS se mettre à jour instantanément.',
        },
        {
          title: 'Chrono de Session & Compteur de Défis',
          desc: 'Chronomètre marathon Démarrer/Pause/Reset intégré avec compteur personnalisable (essais, défis) directement visible sur l’overlay.',
        },
        {
          title: 'Mode Capture Propre (Touche H)',
          desc: 'Appuyez sur H ou copiez l’URL directe Source Navigateur OBS pour masquer tous les contrôles d’édition et capturer une scène propre.',
        },
      ],
      partnerKicker: '02. Créateurs & Partenariats',
      partnerHeading: 'Collaborez avec 10JITAL PROD pour votre prochain marathon',
      partnerDesc:
        'Nous ouvrons des collaborations créateurs pour les streamers Twitch, YouTube, Kick et TikTok Live qui préparent des runs histoire, des défis 100 % et des événements communautaires.',
      partnerBullets: [
        'Canal d’échange direct avec l’équipe 10JITAL PROD pour des widgets d’overlay sur mesure.',
        'Accès anticipé aux prochains presets d’overlays créateurs et profils multi-jeux.',
        'Options de collaborations lancement, animations communautaires et licences créateurs.',
      ],
      tryFreeFirstCta: 'Tester JITALX gratuitement d’abord',
      contactTitle: 'Contact Créateurs & Partenariats',
      contactSubtitle:
        'Contactez 10JITAL PROD pour un partenariat créateur, un dossier presse ou une licence commerciale.',
      signInGoogleBtn: 'Connexion Google',
      nameLabel: 'Nom ou Pseudo Créateur *',
      namePlaceholder: 'Alex / @AlexLive',
      emailLabel: 'Email de contact *',
      emailPlaceholder: 'createur@domaine.com',
      platformLabel: 'Plateforme principale',
      platformAgency: 'Agence Talents',
      platformOther: 'Autre',
      inquiryTypeLabel: 'Objet de la demande',
      inquiryTypes: {
        creator_partnership: 'Partenariat Créateur',
        streamer_access: 'Accès Anticipé Streamer',
        press_media: 'Presse & Médias',
        commercial: 'Licence Commerciale',
      },
      channelUrlLabel: 'URL de la chaîne (Optionnel)',
      messageLabel: 'Message & détails de votre configuration live *',
      messagePlaceholder:
        'Présentez votre chaîne, votre format de diffusion (16:9 / 9:16) ou votre projet de collaboration...',
      verifiedAccountPrefix: 'Compte vérifié :',
      signInHint: 'Connectez-vous pour envoyer via l’app, ou utilisez l’email direct',
      directEmailBtn: 'Email direct',
      submitBtn: 'Envoyer la demande',
      submittingBtn: 'Envoi en cours...',
      errName: 'Veuillez saisir votre nom ou pseudo (au moins 2 caractères).',
      errEmail: 'Veuillez saisir une adresse email de contact valide.',
      errMessage: 'Veuillez rédiger un message (au moins 10 caractères).',
      errSignInRequired:
        'Connectez-vous avec Google pour enregistrer votre demande directement, ou utilisez le bouton Email direct ci-dessous.',
      errSubmitFailed: 'L’envoi a échoué.',
      errSaveCatch:
        'Impossible d’enregistrer la demande pour le moment. Utilisez le bouton Email direct ci-dessous.',
      successRecorded:
        'Votre demande ({id}) a bien été enregistrée. L’équipe 10JITAL PROD vous répondra à {email}.',
      footerDisclaimer:
        'JITALX est un centre de commande multi-jeux et studio d’overlay OBS indépendant conçu par 10JITAL PROD, non affilié aux éditeurs de jeux ni aux plateformes de streaming.',
    },
    backupGuide: {
      title: 'Guide Sauvegarde & Portabilité',
      subtitle: 'EXPORT JSON, RESTAURATION & SNAPSHOTS CLOUD',
      noticeTitle: 'Sécurisez votre progression sur tous vos postes :',
      noticeDesc:
        'JITALX enregistre automatiquement votre espace dans votre navigateur. Pour transférer votre configuration sur un autre PC ou archiver un marathon, utilisez l’export JSON ou les Snapshots Cloud.',
      steps: [
        {
          num: '01',
          title: 'Exporter une sauvegarde JSON complète',
          desc: 'Cliquez sur « Exporter en JSON » pour télécharger un fichier contenant votre profil actif, vos missions, collectibles, véhicules (images locales incluses), objectifs, notes et marqueurs de carte.',
          badge: 'Archive Locale',
        },
        {
          num: '02',
          title: 'Restaurer sur n’importe quel navigateur',
          desc: 'Ouvrez Statistiques & Sauvegardes sur votre autre poste, cliquez sur « Importer un JSON » puis sélectionnez votre fichier. JITALX valide sa structure avant application.',
          badge: 'Schéma Validé',
        },
        {
          num: '03',
          title: 'Créer des Snapshots Cloud à la demande',
          desc: 'Connectez-vous avec Google sur la page Compte pour sauvegarder vos instantanés privés dans Firestore (missions, collectibles, garage, objectifs, notes et marqueurs de carte inclus).',
          badge: 'Cloud Firebase',
        },
        {
          num: '04',
          title: 'Réutiliser votre scène dans OBS Studio',
          desc: 'Dans le Streamer Studio, copiez l’URL Source Navigateur 16:9 ou 9:16 (fond transparent ou chroma key) pour charger votre overlay directement dans OBS ou TikTok Live Studio.',
          badge: 'Prêt pour OBS',
        },
      ],
      noteTitle: 'Images locales vs Cloud :',
      noteDesc:
        'L’export JSON conserve les images locales complètes. Les snapshots Cloud retirent les images base64 supérieures à 2 Ko pour respecter la limite Firestore.',
      exportNowBtn: 'Exporter en JSON maintenant',
      openCloudBtn: 'Ouvrir l’espace Cloud',
      closeBtn: 'J’ai compris',
    },
    pricing: {
      kicker: 'Boutique 10JITAL PROD · Offre de lancement 7 €',
      heading: 'Des formules transparentes pour joueurs solo et créateurs',
      subtitle:
        'Testez JITALX gratuitement dès maintenant, ou passez à l’offre de lancement à 7 € directement sur Gumroad. Les abonnements mensuels Stripe restent désactivés tant qu’un backend de facturation n’est pas déployé.',
      activePaymentLabel: 'Paiement actif aujourd’hui :',
      activePaymentValue:
        'Offre de lancement JITALX Full Access (7,00 € paiement unique) traitée exclusivement sur Gumroad.',
      stripeReadyNote:
        'Clé publique Stripe détectée : vérifiez vos Price IDs et votre endpoint webhook serveur.',
      stripePendingNote:
        'Abonnements mensuels Stripe en préparation — aucune carte bancaire n’est demandée dans l’application. La liaison automatique des licences Gumroad vers Firestore nécessite un webhook serveur.',
      myAccountCta: 'Mon compte',
      noticeTitle: 'Formule mensuelle non activée',
      currentPlanCta: 'Formule active',
      startFreeCta: 'Commencer gratuitement',
      buyGumroadCta: 'Acheter sur Gumroad · 7 €',
      subscribeStripeCta: 'Souscrire via Stripe',
      comingSoonCta: 'Bientôt disponible',
      freeSubtext: 'Accès immédiat navigateur · Sans inscription',
      gumroadSubtext: 'Redirection officielle Gumroad HTTPS',
      stripeActiveSubtext: 'Stripe Checkout actif',
      stripePendingSubtext: 'En attente du backend Stripe',
      matrixHeader: 'Capacité',
      matrixProfiles: 'Profils & Univers',
      matrixCloud: 'Sauvegarde Cloud',
      matrixOverlay: 'Overlay OBS',
      matrixSupport: 'Support',
      securityAuth:
        'Authentification Firebase Google et isolation stricte des données Firestore par UID.',
      securityPayment:
        'Aucune carte bancaire collectée dans l’application (paiement délégué à Gumroad HTTPS).',
    },
    checkout: {
      backCta: 'RETOUR',
      summaryTitle: 'Récapitulatif de commande',
      launchOffer: 'Offre de lancement',
      productLabel: 'PRODUIT',
      accessLabel: 'ACCÈS',
      processorLabel: 'PLATEFORME',
      processorValue: 'Gumroad (HTTPS officiel)',
      totalLabel: 'TOTAL',
      cardNotice:
        'Aucune information bancaire n’est saisie ni stockée dans 10JITAL PROD ou JITALX. La transaction est intégralement traitée par Gumroad.',
      gumroadTitle: 'Paiement Gumroad',
      httpsVerified: 'HTTPS Vérifié',
      bullets: [
        'Paiement unique de 7,00 € — sans abonnement récurrent ni frais cachés.',
        'Accès complet aux thèmes JITALX, profils personnalisés, sauvegarde JSON et Studio OBS / TikTok Live.',
        'Redirection externe sécurisée vers la page produit officielle Gumroad.',
      ],
      honestInfo:
        'Cette application ne simule aucun paiement et n’active pas de licence via localStorage. Après achat sur Gumroad, conservez votre reçu (la synchronisation automatique Firestore requiert un webhook serveur).',
      continueGumroad: 'Continuer vers Gumroad',
      officialLink: 'Lien officiel :',
      externalBadge: 'CHECKOUT EXTERNE',
    },
    footer: {
      copyright: '© 2026 10JITAL PROD · JITALX. Ideas in Action.',
      disclaimer:
        'Plateforme multi-jeux indépendante par 10JITAL PROD · Non affiliée aux éditeurs de jeux.',
      products: 'Produits',
      demo: 'Démo',
      pricing: 'Tarifs',
      creators: 'Créateurs',
      obsStudio: 'Studio OBS',
      account: 'Compte',
      discord: 'Discord',
    },
    plans: {
      free: {
        name: 'JITALX Starter Edition',
        tagline:
          'Découvrez JITALX gratuitement dans votre navigateur : missions, radar 360°, garage visuel, carte tactique et aperçu OBS.',
        priceDisplay: '0 €',
        billingCycle: 'Gratuit · Sans carte bancaire',
        statusLabel: 'Accès gratuit actif',
        categoryLabel: 'Applications · Ressources Créateurs',
        features: [
          'Lancement navigateur immédiat sans inscription',
          'Missions, Collectibles, Garage Visuel, Carte Tactique & Notes',
          'Sauvegarde locale instantanée + Export / Import JSON validé',
          'Streamer Studio OBS intégré (Chroma, Transparent & Sunset Néon)',
          '3 univers de démonstration personnalisables inclus',
        ],
        limits: {
          customProfiles: '3 univers inclus + locaux',
          cloudSnapshots: 'Snapshots Cloud manuels (connecté)',
          overlayBranding: 'Signature discrète JITALX · 10JITAL',
          supportLevel: 'Documentation',
        },
      },
      lifetime: {
        name: 'JITALX Full Access',
        badge: 'OFFRE DE LANCEMENT · GUMROAD',
        tagline:
          'Centre de commandement tactique complet, garage visuel, carte interactive et studio d’overlay OBS 16:9 & 9:16.',
        priceDisplay: '7,00 €',
        billingCycle: 'Paiement unique · Gumroad officiel',
        statusLabel: 'Sortie active',
        categoryLabel: 'Applications · Ressources Créateurs · Kits Studio',
        features: [
          '7,00 € — Paiement unique traité directement sur Gumroad',
          'Tous les thèmes : Sunset Néon, Secteur Cyber et Monde Libre',
          'Streamer Studio 16:9 (Twitch/YouTube) & 9:16 (TikTok Live)',
          'Profils personnalisés, marqueurs carte & Snapshots Cloud Firebase',
          'Aucune donnée bancaire saisie dans l’application',
        ],
        limits: {
          customProfiles: 'Illimités',
          cloudSnapshots: 'Instantanés Cloud & Export JSON',
          overlayBranding: 'Option masquage signature incluse',
          supportLevel: 'Mises à jour incluses',
        },
      },
      pro_monthly: {
        name: 'JITALX Pro Mensuel',
        badge: 'BIENTÔT · STRIPE',
        tagline:
          'Formule mensuelle préparée pour les créateurs multi-appareils dès le déploiement de la facturation Stripe.',
        priceDisplay: '4,99 €',
        billingCycle: '/ mois · Stripe en préparation',
        statusLabel: 'Stripe en préparation',
        categoryLabel: 'Outils SaaS',
        features: [
          'Toutes les fonctionnalités JITALX Starter Edition',
          'Profils de jeux personnalisés illimités',
          'Instantanés Cloud Firestore multi-appareils',
          'Statistiques avancées & alertes HUD',
          'Activation prévue après configuration serveur Stripe',
        ],
        limits: {
          customProfiles: 'Illimités',
          cloudSnapshots: 'Multi-appareils',
          overlayBranding: 'Personnalisable',
          supportLevel: 'Support prioritaire par email',
        },
      },
      creator: {
        name: 'JITALX Creator Studio',
        badge: 'BIENTÔT · STRIPE',
        tagline:
          'Pensé pour les créateurs Twitch, YouTube et TikTok Live souhaitant des scènes d’overlay personnalisables.',
        priceDisplay: '14,99 €',
        billingCycle: '/ mois · Stripe en préparation',
        statusLabel: 'Stripe en préparation',
        categoryLabel: 'Ressources Créateurs · Marketing & Pub',
        features: [
          'Tous les avantages JITALX Full Access',
          'Widgets OBS avancés (Mission active, Compteur, Source Navigateur)',
          'Scènes 16:9 & 9:16 dédiées au streaming multi-plateformes',
          'Accès anticipé aux futurs packs d’overlays 10JITAL PROD',
          'Activation prévue après configuration serveur Stripe',
        ],
        limits: {
          customProfiles: 'Illimités + Scènes multi-live',
          cloudSnapshots: 'Illimités + Restauration rapide',
          overlayBranding: 'Marque blanche',
          supportLevel: 'Support créateur direct',
        },
      },
    },
  },
};
