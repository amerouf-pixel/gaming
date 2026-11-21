import { SubscriptionTier } from '../types';

export type Locale = 'en' | 'fr';

export const DEFAULT_LOCALE: Locale = 'en';

export type CatalogCategoryId =
  | 'all'
  | 'digital-kits'
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
      kicker: '10JITALX · International Digital Studio',
      headline: 'Digital Studio. Ideas in Action.',
      description:
        'We build digital kits, templates, SaaS, apps and websites that help creators, entrepreneurs and businesses launch faster, grow smarter and stand out worldwide.',
      primaryCta: 'Explore Digital Products',
      secondaryCta: 'Discover 10JITALX',
      shareLabel: 'Share Studio',
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
      kicker: '01. Digital Catalog',
      heading: 'Products engineered for real execution',
      subtitle:
        'Browse our live releases and upcoming studio editions. Every price, feature, and checkout link below reflects our active production catalog.',
      comparePlansCta: 'Compare all plans & capabilities',
      categories: {
        all: 'All Products',
        'digital-kits': 'Digital Kits',
        templates: 'Templates',
        'saas-tools': 'SaaS Tools',
        applications: 'Applications',
        websites: 'Websites',
        marketing: 'Marketing & Advertising',
        'creator-resources': 'Creator Resources',
      },
      emptyTitle: 'Upcoming studio release in this category',
      emptyDescription:
        'We only list verified, active products. New 10JITALX releases for this category are currently in production—explore our flagship live JITALX suite or contact the studio for custom builds.',
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
      kicker: '02. Discover 10JITALX',
      heading: 'Built for global creators, founders, and digital teams',
      subtitle:
        '10JITALX combines product engineering, interface design, and broadcast-ready tooling into practical digital software you can deploy immediately.',
      pillars: [
        {
          index: '01',
          title: 'Digital Kits & Design Systems',
          description:
            'Cohesive visual systems, modular UI layouts, and production-ready digital assets built for rapid deployment across global audiences.',
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
            'International English positioning, semantic SEO metadata, shareable previews, and structured multilingual readiness from day one.',
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
          title: 'International & Responsive',
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
      radarHint: 'Click targets on the radar to inspect coordinates and distance',
    },
    pricing: {
      kicker: '10JITALX Store · Launch Offer €7 One-Time',
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
        'No payment card details are collected or stored inside 10JITALX or JITALX. Checkout is processed exclusively on Gumroad.',
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
      copyright: '© 2026 10JITALX · 10JITAL Production. Digital Studio. Ideas in Action.',
      disclaimer:
        'Independent digital studio platform · Not affiliated with Rockstar Games or Take-Two Interactive.',
      products: 'Products',
      demo: 'Live Demo',
      pricing: 'Pricing',
      creators: 'Creators',
      obsStudio: 'OBS Studio',
      account: 'Account',
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
        categoryLabel: 'Applications · Creator Resources · Digital Kits',
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
          'Early access to upcoming 10JITALX overlay packs',
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
      kicker: '10JITALX · Studio Digital International',
      headline: 'Digital Studio. Ideas in Action.',
      description:
        'Nous concevons des kits digitaux, templates, SaaS, applications et sites web pour aider créateurs, entrepreneurs et entreprises à lancer plus vite, grandir plus intelligemment et se démarquer dans le monde entier.',
      primaryCta: 'Explorer les produits digitaux',
      secondaryCta: 'Découvrir 10JITALX',
      shareLabel: 'Partager le studio',
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
      kicker: '01. Catalogue Digital',
      heading: 'Des produits conçus pour une exécution réelle',
      subtitle:
        'Parcourez nos produits actifs et nos éditions à venir. Chaque prix, fonctionnalité et lien de paiement reflète fidèlement notre catalogue en production.',
      comparePlansCta: 'Comparer toutes les formules',
      categories: {
        all: 'Tous les produits',
        'digital-kits': 'Digital Kits',
        templates: 'Templates',
        'saas-tools': 'Outils SaaS',
        applications: 'Applications',
        websites: 'Sites Web',
        marketing: 'Marketing & Pub',
        'creator-resources': 'Ressources Créateurs',
      },
      emptyTitle: 'Sortie studio à venir dans cette catégorie',
      emptyDescription:
        'Nous affichons uniquement des produits réels et vérifiés. Les prochaines sorties 10JITALX dans cette catégorie sont en cours de production — explorez notre suite phare JITALX ou contactez le studio.',
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
      kicker: '02. Découvrir 10JITALX',
      heading: 'Pensé pour les créateurs, fondateurs et équipes digitales',
      subtitle:
        '10JITALX réunit ingénierie produit, design d’interface et outils de diffusion live dans des logiciels pratiques prêts à déployer immédiatement.',
      pillars: [
        {
          index: '01',
          title: 'Digital Kits & Design Systems',
          description:
            'Systèmes visuels cohérents, interfaces modulaires et ressources digitales prêtes pour un déploiement rapide à l’international.',
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
            'Positionnement international, SEO sémantique, aperçus sociaux partageables et architecture multilingue évolutive.',
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
      copyLink: 'Copier le lien du studio',
      linkCopied: 'Lien copié',
      shareX: 'Partager sur X',
      shareLinkedIn: 'LinkedIn',
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
          title: 'International & Responsive',
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
      radarHint: 'Cliquez sur les cibles du radar pour inspecter la distance',
    },
    pricing: {
      kicker: 'Boutique 10JITALX · Offre de lancement 7 €',
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
        'Aucune information bancaire n’est saisie ni stockée dans 10JITALX ou JITALX. La transaction est intégralement traitée par Gumroad.',
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
      copyright: '© 2026 10JITALX · 10JITAL Production. Digital Studio. Ideas in Action.',
      disclaimer:
        'Studio digital indépendant · Non affilié à Rockstar Games ni Take-Two Interactive.',
      products: 'Produits',
      demo: 'Démo',
      pricing: 'Tarifs',
      creators: 'Créateurs',
      obsStudio: 'Studio OBS',
      account: 'Compte',
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
        categoryLabel: 'Applications · Ressources Créateurs · Digital Kits',
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
          'Accès anticipé aux futurs packs d’overlays 10JITALX',
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
