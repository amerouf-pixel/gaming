import { SubscriptionTier } from '../types';

// Véritable lien produit Gumroad pour l'offre de lancement JITALX (7 €)
export const GUMROAD_PRODUCT_URL = 'https://gumroad.com/l/jitalx-full-access';

/**
 * Contrat serveur préparé pour un futur webhook Gumroad Ping (ex. route Vercel /api/gumroad/webhook).
 * La validation d'achat et l'écriture de `subscriptionTier: 'lifetime'` dans Firestore
 * doivent impérativement être effectuées côté serveur après vérification de la vente Gumroad,
 * jamais depuis le navigateur ni via localStorage.
 */
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
    tagline: 'Découvrez JITALX gratuitement et organisez votre première campagne en monde ouvert.',
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
    stripePriceEnvKey: 'VITE_STRIPE_PRICE_LIFETIME',
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
    badge: 'BIENTÔT · STRIPE',
    tagline: 'Formule mensuelle préparée pour une future activation via Stripe Checkout.',
    priceDisplay: '4,99 €',
    billingCycle: '/ mois · En préparation Stripe',
    numericPriceEur: 4.99,
    stripePriceEnvKey: 'VITE_STRIPE_PRICE_PRO_MONTHLY',
    stripePriceId: STRIPE_CONFIG.priceIds.pro_monthly,
    features: [
      'Toutes les fonctionnalités Starter Free',
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
  {
    id: 'creator',
    name: 'Creator Studio',
    badge: 'BIENTÔT · STRIPE',
    tagline: 'Pensé pour les créateurs Twitch, YouTube et TikTok Live en mondes ouverts.',
    priceDisplay: '14,99 €',
    billingCycle: '/ mois · En préparation Stripe',
    numericPriceEur: 14.99,
    stripePriceEnvKey: 'VITE_STRIPE_PRICE_CREATOR_MONTHLY',
    stripePriceId: STRIPE_CONFIG.priceIds.creator,
    features: [
      'Tous les avantages JITALX Full Access',
      'Widgets OBS avancés (Mission active, Compteur défi, URL Source)',
      'Scènes 16:9 & 9:16 dédiées au streaming multi-plateformes',
      'Accès anticipé aux futurs packs d’overlays',
      'Activation prévue après configuration serveur Stripe',
    ],
    limits: {
      customProfiles: 'Illimités + Scènes multi-live',
      cloudSnapshots: 'Illimités + Restauration rapide',
      overlayBranding: 'White-label',
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
        'Stripe n’est pas encore configuré. Pour acheter JITALX dès maintenant (7 €), utilisez le lien officiel Gumroad.',
    };
  }

  if (!intent.priceId) {
    return {
      ok: false,
      status: 'unconfigured',
      message: `Aucun Stripe Price ID défini pour la formule "${intent.planId}".`,
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
        message: `Endpoint Stripe indisponible (${response.status}). Vérifiez votre route serveur.`,
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
