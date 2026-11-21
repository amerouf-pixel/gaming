import { PaymentBackendStatus, SubscriptionTier } from '../types';

// Official Gumroad product link for JITALX Full Access Launch Offer (€7 one-time)
export const GUMROAD_PRODUCT_URL = 'https://gumroad.com/l/jitalx-full-access';

export interface GumroadPingPayload {
  seller_id: string;
  product_id: string;
  product_permalink: string;
  sale_id: string;
  email: string;
  price: number;
  currency: string;
  refunded?: boolean;
}

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
  gumroadUrl?: string;
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
  portalEndpoint: '/api/stripe/create-portal-session',
  statusEndpoint: '/api/payments/status',
  contactEmail: (env.VITE_CONTACT_EMAIL || 'contact@10jital.com').trim(),
  priceIds: {
    free: '',
    pro_monthly: (env.VITE_STRIPE_PRICE_PRO_MONTHLY || '').trim(),
    lifetime: (env.VITE_STRIPE_PRICE_LIFETIME || '').trim(),
    creator: (env.VITE_STRIPE_PRICE_CREATOR_MONTHLY || '').trim(),
  },
};

/**
 * Builds the official Gumroad checkout URL and pre-attaches email + Firebase UID (when signed in)
 * so the server-side Gumroad Ping webhook can link the purchase to the exact Firebase account.
 */
export function buildGumroadCheckoutUrl(options?: { email?: string | null; uid?: string | null }): string {
  try {
    const url = new URL(GUMROAD_PRODUCT_URL);
    if (options?.email && options.email.includes('@')) {
      url.searchParams.set('email', options.email.trim());
    }
    if (options?.uid && /^[a-zA-Z0-9_-]{8,128}$/.test(options.uid.trim())) {
      url.searchParams.set('uid', options.uid.trim());
    }
    return url.toString();
  } catch {
    return GUMROAD_PRODUCT_URL;
  }
}

export function isStripeConfigured(): boolean {
  return Boolean(
    STRIPE_CONFIG.publishableKey &&
      (STRIPE_CONFIG.publishableKey.startsWith('pk_test_') ||
        STRIPE_CONFIG.publishableKey.startsWith('pk_live_'))
  );
}

export function isStripePlanReady(
  tier: SubscriptionTier,
  backendStatus?: PaymentBackendStatus | null
): boolean {
  if (tier === 'free') return true;
  if (backendStatus) {
    if (tier === 'pro_monthly') return backendStatus.stripePricesConfigured.pro_monthly;
    if (tier === 'creator') return backendStatus.stripePricesConfigured.creator;
    return false;
  }
  return isStripeConfigured() && Boolean(STRIPE_CONFIG.priceIds[tier]);
}

export async function fetchPaymentBackendStatus(): Promise<PaymentBackendStatus | null> {
  try {
    const resp = await fetch(STRIPE_CONFIG.statusEndpoint, { method: 'GET' });
    if (!resp.ok) return null;
    return (await resp.json()) as PaymentBackendStatus;
  } catch {
    return null;
  }
}

export const SUBSCRIPTION_PLANS: SubscriptionPlanDefinition[] = [
  {
    id: 'free',
    name: 'Starter Free',
    tagline: 'Découvrez JITALX gratuitement et organisez vos campagnes multi-jeux.',
    priceDisplay: '0 €',
    billingCycle: 'Gratuit · Sans carte bancaire',
    numericPriceEur: 0,
    stripePriceEnvKey: 'N/A',
    stripePriceId: '',
    features: [
      'Tableau de bord tactique & Radar Holo 360°',
      'Suivi Missions, Collectibles, Garage, Objectifs & Notes',
      'Sauvegarde locale instantanée + Export / Import JSON',
      'Streamer Studio OBS (Chroma, Transparent, Sunset Néon)',
      '3 univers de démonstration personnalisables inclus',
    ],
    limits: {
      customProfiles: '3 univers inclus + locaux',
      cloudSnapshots: 'Snapshots Cloud manuels (compte connecté)',
      overlayBranding: 'Signature discrète JITALX • 10JITAL',
      supportLevel: 'Documentation',
    },
  },
  {
    id: 'lifetime',
    name: 'JITALX Full Access',
    badge: 'OFFRE DE LANCEMENT · GUMROAD',
    tagline: 'Paiement unique sur Gumroad pour soutenir JITALX et accéder à l’édition complète.',
    priceDisplay: '7 €',
    billingCycle: 'Paiement unique sur Gumroad · Offre de lancement',
    numericPriceEur: 7,
    stripePriceEnvKey: 'GUMROAD',
    stripePriceId: STRIPE_CONFIG.priceIds.lifetime,
    gumroadUrl: GUMROAD_PRODUCT_URL,
    recommended: true,
    features: [
      '7 € — Paiement sécurisé directement sur Gumroad',
      'Tous les thèmes (Sunset Néon, Secteur Cyber, Monde Libre)',
      'Streamer Studio 16:9 (Twitch/YouTube) & 9:16 (TikTok Live)',
      'Profils personnalisés & sauvegardes Cloud Firestore',
      'Aucune donnée bancaire saisie dans JITALX',
    ],
    limits: {
      customProfiles: 'Illimités',
      cloudSnapshots: 'Instantanés Cloud & Export JSON',
      overlayBranding: 'Option masquage signature incluse',
      supportLevel: 'Mises à jour incluses',
    },
  },
  {
    id: 'pro_monthly',
    name: 'Pro Mensuel',
    badge: 'STRIPE · ABONNEMENT',
    tagline: 'Formule mensuelle Stripe Checkout (4,99 €/mois) activable dès ajout des clés serveur.',
    priceDisplay: '4,99 €',
    billingCycle: '/ mois · Stripe Checkout',
    numericPriceEur: 4.99,
    stripePriceEnvKey: 'STRIPE_PRICE_PRO_MONTHLY',
    stripePriceId: STRIPE_CONFIG.priceIds.pro_monthly,
    features: [
      'Toutes les fonctionnalités Starter Free',
      'Profils de jeux personnalisés illimités',
      'Instantanés Cloud Firestore multi-appareils',
      'Statistiques avancées & alertes HUD',
      'Gestion d’abonnement via Portail Client Stripe',
    ],
    limits: {
      customProfiles: 'Illimités',
      cloudSnapshots: 'Multi-appareils',
      overlayBranding: 'Personnalisable',
      supportLevel: 'Support prioritaire par email',
    },
  },
  {
    id: 'creator',
    name: 'Creator Studio',
    badge: 'STRIPE · CRÉATEURS',
    tagline: 'Pensé pour les créateurs Twitch, YouTube et TikTok Live multi-jeux (14,99 €/mois).',
    priceDisplay: '14,99 €',
    billingCycle: '/ mois · Stripe Checkout',
    numericPriceEur: 14.99,
    stripePriceEnvKey: 'STRIPE_PRICE_CREATOR_MONTHLY',
    stripePriceId: STRIPE_CONFIG.priceIds.creator,
    features: [
      'Tous les avantages JITALX Full Access',
      'Widgets OBS avancés (Mission active, Compteur défi, URL Source)',
      'Scènes 16:9 & 9:16 dédiées au streaming multi-plateformes',
      'Connecteur OBS WebSocket v5 local & packs overlays',
      'Gestion d’abonnement via Portail Client Stripe',
    ],
    limits: {
      customProfiles: 'Illimités + Scènes multi-live',
      cloudSnapshots: 'Illimités + Restauration rapide',
      overlayBranding: 'White-label',
      supportLevel: 'Support créateur direct',
    },
  },
];

export interface StripeCheckoutRequest {
  planId: 'pro_monthly' | 'creator';
  firebaseIdToken: string;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Calls server-side /api/stripe/create-checkout-session with verified Firebase ID token.
 * Price ID mapping is enforced strictly on the server (never trusted from the browser).
 */
export async function prepareStripeCheckoutSession(
  request: StripeCheckoutRequest
): Promise<{ ok: boolean; status: 'unconfigured' | 'ready' | 'error'; message: string; url?: string }> {
  try {
    const response = await fetch(STRIPE_CONFIG.checkoutEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${request.firebaseIdToken}`,
      },
      body: JSON.stringify({
        planId: request.planId,
        successUrl: request.successUrl,
        cancelUrl: request.cancelUrl,
      }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      url?: string;
      code?: string;
      error?: string;
    };

    if (response.status === 503 || data.code === 'STRIPE_NOT_CONFIGURED') {
      return {
        ok: false,
        status: 'unconfigured',
        message:
          data.error ||
          'Stripe is not configured yet on the server (missing STRIPE_SECRET_KEY / STRIPE_PRICE_*).',
      };
    }

    if (!response.ok) {
      return {
        ok: false,
        status: 'error',
        message: data.error || `Stripe Checkout error (${response.status}).`,
      };
    }

    if (data.url) {
      return { ok: true, status: 'ready', message: 'Stripe Checkout session ready.', url: data.url };
    }
    return {
      ok: false,
      status: 'error',
      message: 'Incomplete Stripe response (missing redirect URL).',
    };
  } catch {
    return {
      ok: false,
      status: 'error',
      message: 'Unable to reach the Stripe server endpoint.',
    };
  }
}

export async function openStripeBillingPortal(params: {
  firebaseIdToken: string;
  customerId: string;
}): Promise<{ ok: boolean; url?: string; error?: string }> {
  if (STRIPE_CONFIG.portalUrl) {
    return { ok: true, url: STRIPE_CONFIG.portalUrl };
  }
  try {
    const response = await fetch(STRIPE_CONFIG.portalEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.firebaseIdToken}`,
      },
      body: JSON.stringify({ customerId: params.customerId }),
    });
    const data = (await response.json().catch(() => ({}))) as { url?: string; error?: string };
    if (!response.ok || !data.url) {
      return { ok: false, error: data.error || `Portal unavailable (${response.status}).` };
    }
    return { ok: true, url: data.url };
  } catch {
    return { ok: false, error: 'Unable to reach Stripe Billing Portal endpoint.' };
  }
}
