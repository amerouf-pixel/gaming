import { SubscriptionTier } from '../types';

export interface SubscriptionPlanDefinition {
  id: SubscriptionTier;
  name: string;
  badge?: string;
  tagline: string;
  priceDisplay: string;
  billingCycle: string;
  numericPriceEur: number;
  stripePriceEnvKey: string;
  stripePriceId: string;
  recommended?: boolean;
  features: string[];
  limits: {
    customProfiles: string;
    cloudSnapshots: string;
    overlayBranding: string;
    supportLevel: string;
  };
}

const env = import.meta.env;

export const STRIPE_CONFIG = {
  publishableKey: (env.VITE_STRIPE_PUBLISHABLE_KEY || '').trim(),
  portalUrl: (env.VITE_STRIPE_PORTAL_URL || '').trim(),
  checkoutEndpoint: (env.VITE_STRIPE_CHECKOUT_ENDPOINT || '/api/stripe/create-checkout-session').trim(),
  contactEmail: (env.VITE_CONTACT_EMAIL || 'contact@10jital.com').trim(),
  priceIds: {
    free: '',
    pro_monthly: (env.VITE_STRIPE_PRICE_PRO_MONTHLY || '').trim(),
    lifetime: (env.VITE_STRIPE_PRICE_LIFETIME || '').trim(),
    creator: (env.VITE_STRIPE_PRICE_CREATOR_MONTHLY || '').trim(),
  },
};

export function isStripeConfigured(): boolean {
  return Boolean(
    STRIPE_CONFIG.publishableKey &&
      (STRIPE_CONFIG.publishableKey.startsWith('pk_test_') ||
        STRIPE_CONFIG.publishableKey.startsWith('pk_live_'))
  );
}

export function isStripePlanReady(tier: SubscriptionTier): boolean {
  if (tier === 'free') return true;
  return isStripeConfigured() && Boolean(STRIPE_CONFIG.priceIds[tier]);
}

export const SUBSCRIPTION_PLANS: SubscriptionPlanDefinition[] = [
  {
    id: 'free',
    name: 'Starter Free',
    tagline: 'Idéal pour découvrir JITALX et suivre sa première campagne en monde ouvert.',
    priceDisplay: '0 €',
    billingCycle: 'Gratuit · Sans carte bancaire',
    numericPriceEur: 0,
    stripePriceEnvKey: 'N/A',
    stripePriceId: '',
    features: [
      'Tableau de bord tactique & Radar Holo 360°',
      'Suivi Missions, Collectibles, Garage, Objectifs & Notes',
      'Sauvegarde locale instantanée + Export / Import JSON',
      'Mode Streamer OBS (Chroma, Transparent, Sunset Néon)',
      '3 univers préconfigurés inclus',
    ],
    limits: {
      customProfiles: '3 univers inclus',
      cloudSnapshots: 'Sauvegarde locale + 1 snapshot cloud',
      overlayBranding: 'Signature discrète JITALX • 10JITAL',
      supportLevel: 'Documentation communautaire',
    },
  },
  {
    id: 'pro_monthly',
    name: 'Pro Mensuel',
    tagline: 'Accès flexible pour compléter une campagne 100 % avec synchronisation cloud.',
    priceDisplay: '4,99 €',
    billingCycle: '/ mois · Annulable à tout moment',
    numericPriceEur: 4.99,
    stripePriceEnvKey: 'VITE_STRIPE_PRICE_PRO_MONTHLY',
    stripePriceId: STRIPE_CONFIG.priceIds.pro_monthly,
    features: [
      'Toutes les fonctionnalités Starter Free',
      'Profils de jeux personnalisés illimités',
      'Synchronisation Cloud Firestore multi-appareils',
      'Statistiques avancées & courbe de progression',
      'Toasts Trophées HUD & effets audio tactiques',
    ],
    limits: {
      customProfiles: 'Illimités',
      cloudSnapshots: 'Multi-appareils',
      overlayBranding: 'Personnalisable',
      supportLevel: 'Support prioritaire par email',
    },
  },
  {
    id: 'lifetime',
    name: 'JITALX Full Access',
    badge: 'OFFRE DE LANCEMENT',
    tagline: 'Paiement unique pour débloquer JITALX — THE STREAMER COMMAND HUB à vie.',
    priceDisplay: '7 €',
    billingCycle: 'Paiement unique · Accès à vie',
    numericPriceEur: 7,
    stripePriceEnvKey: 'VITE_STRIPE_PRICE_LIFETIME',
    stripePriceId: STRIPE_CONFIG.priceIds.lifetime,
    recommended: true,
    features: [
      '7 € — Paiement unique / Accès à vie',
      'Tous les thèmes & univers (Sunset Néon, Secteur Cyber, Monde Libre)',
      'Overlay OBS 16:9 & TikTok Live 9:16 sans watermark',
      'Profils personnalisés & Cloud Sync Firestore',
      'Mises à jour majeures futures incluses',
    ],
    limits: {
      customProfiles: 'Illimités',
      cloudSnapshots: 'Illimités',
      overlayBranding: 'Suppression signature incluse',
      supportLevel: 'Accès prioritaire mises à jour',
    },
  },
  {
    id: 'creator',
    name: 'Creator Studio',
    badge: 'STREAMERS',
    tagline: 'Pensé pour les créateurs Twitch, YouTube et TikTok Live en préparation GTA 6.',
    priceDisplay: '14,99 €',
    billingCycle: '/ mois · Licence Créateur',
    numericPriceEur: 14.99,
    stripePriceEnvKey: 'VITE_STRIPE_PRICE_CREATOR_MONTHLY',
    stripePriceId: STRIPE_CONFIG.priceIds.creator,
    features: [
      'Tous les avantages JITALX Full Access',
      'Widgets OBS avancés (Mission active, Compteur défi, URL Browser Source)',
      'Gestion multi-chaînes et scènes 16:9 + 9:16',
      'Accès anticipé aux packs d’overlays thématiques',
      'Support créateur dédié & intégration partenaires',
    ],
    limits: {
      customProfiles: 'Illimités + Scènes multi-live',
      cloudSnapshots: 'Illimités + Restauration rapide',
      overlayBranding: 'White-label complet',
      supportLevel: 'Support créateur direct',
    },
  },
];

export interface StripeCheckoutIntent {
  planId: SubscriptionTier;
  priceId: string;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Prepared Stripe Checkout launcher.
 * Never activates real payments unless VITE_STRIPE_PUBLISHABLE_KEY and a valid Price ID are configured.
 */
export async function prepareStripeCheckoutSession(
  intent: StripeCheckoutIntent
): Promise<{ ok: boolean; status: 'unconfigured' | 'ready' | 'error'; message: string; url?: string }> {
  if (!isStripeConfigured()) {
    return {
      ok: false,
      status: 'unconfigured',
      message:
        'Stripe n’est pas encore configuré. Ajoutez VITE_STRIPE_PUBLISHABLE_KEY, les VITE_STRIPE_PRICE_* et votre endpoint backend /api/stripe/create-checkout-session avant d’activer les paiements réels.',
    };
  }

  if (!intent.priceId) {
    return {
      ok: false,
      status: 'unconfigured',
      message: `Aucun Stripe Price ID défini pour la formule "${intent.planId}". Configurez la variable d’environnement correspondante.`,
    };
  }

  try {
    const response = await fetch(STRIPE_CONFIG.checkoutEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(intent),
    });

    if (!response.ok) {
      return {
        ok: false,
        status: 'error',
        message: `Endpoint Stripe indisponible (${response.status}). Vérifiez votre route serveur Vercel.`,
      };
    }

    const data = (await response.json()) as { url?: string };
    if (data.url) {
      return { ok: true, status: 'ready', message: 'Session Stripe prête.', url: data.url };
    }
    return {
      ok: false,
      status: 'error',
      message: 'Réponse Stripe incomplète (URL de redirection manquante).',
    };
  } catch {
    return {
      ok: false,
      status: 'error',
      message:
        'Impossible de joindre le backend Stripe. Déployez la route API Stripe côté serveur avant activation.',
    };
  }
}
