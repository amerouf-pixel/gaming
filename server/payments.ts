import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { Express, Request, Response } from 'express';

export const OFFICIAL_GUMROAD_URL = 'https://gumroad.com/l/jitalx-full-access';
export const GUMROAD_MIN_PRICE_CENTS = 700; // 7.00 EUR
const MAX_REPLAY_CACHE = 5000;
const STRIPE_TOLERANCE_SECONDS = 300;

interface FirebaseAppletConfig {
  projectId?: string;
  firestoreDatabaseId?: string;
}

function loadFirebaseProjectId(): string {
  try {
    const cfgPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
    const raw = fs.readFileSync(cfgPath, 'utf8');
    const parsed = JSON.parse(raw) as FirebaseAppletConfig;
    return (parsed.projectId || '').trim();
  } catch {
    return (process.env.FIREBASE_PROJECT_ID || '').trim();
  }
}

export const FIREBASE_PROJECT_ID = loadFirebaseProjectId();

// ---------------------------------------------------------------------------
// Firebase ID Token RS256 Verification (requires ZERO IAM roles / Admin SDK)
// ---------------------------------------------------------------------------
const GOOGLE_CERTS_URL =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

let cachedCerts: Record<string, string> = {};
let certsExpiresAtMs = 0;

async function getGooglePublicCerts(): Promise<Record<string, string>> {
  const now = Date.now();
  if (Object.keys(cachedCerts).length > 0 && now < certsExpiresAtMs) {
    return cachedCerts;
  }
  const resp = await fetch(GOOGLE_CERTS_URL);
  if (!resp.ok) {
    throw new Error(`Failed to fetch Google public keys (${resp.status}).`);
  }
  const cacheControl = resp.headers.get('cache-control') || '';
  const match = cacheControl.match(/max-age=(\d+)/i);
  const maxAgeSec = match ? Number(match[1]) : 3600;
  cachedCerts = (await resp.json()) as Record<string, string>;
  certsExpiresAtMs = now + Math.max(60, maxAgeSec) * 1000;
  return cachedCerts;
}

function base64UrlDecode(segment: string): Buffer {
  const padded = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (padded.length % 4)) % 4;
  return Buffer.from(padded + '='.repeat(padLen), 'base64');
}

export interface VerifiedFirebaseToken {
  uid: string;
  email: string;
  emailVerified: boolean;
}

export async function verifyFirebaseIdToken(
  token: string,
  expectedProjectId = FIREBASE_PROJECT_ID
): Promise<VerifiedFirebaseToken> {
  if (!expectedProjectId) {
    throw new Error('Firebase project ID is not configured on the server.');
  }
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Malformed Firebase ID token.');
  }

  const [headerB64, payloadB64, sigB64] = parts;
  const header = JSON.parse(base64UrlDecode(headerB64).toString('utf8')) as {
    alg?: string;
    kid?: string;
  };
  const payload = JSON.parse(base64UrlDecode(payloadB64).toString('utf8')) as {
    aud?: string;
    iss?: string;
    sub?: string;
    exp?: number;
    iat?: number;
    email?: string;
    email_verified?: boolean;
  };

  if (header.alg !== 'RS256' || !header.kid) {
    throw new Error('Invalid token algorithm or key identifier.');
  }

  const nowSec = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || payload.exp <= nowSec) {
    throw new Error('Firebase ID token has expired.');
  }
  if (typeof payload.iat !== 'number' || payload.iat > nowSec + 300) {
    throw new Error('Firebase ID token issued-at timestamp is invalid.');
  }
  if (payload.aud !== expectedProjectId) {
    throw new Error('Firebase ID token audience mismatch.');
  }
  if (payload.iss !== `https://securetoken.google.com/${expectedProjectId}`) {
    throw new Error('Firebase ID token issuer mismatch.');
  }
  if (!payload.sub || typeof payload.sub !== 'string' || payload.sub.length > 128) {
    throw new Error('Firebase ID token subject (uid) missing.');
  }

  const certs = await getGooglePublicCerts();
  const cert = certs[header.kid];
  if (!cert) {
    throw new Error('Signing certificate not found for Firebase ID token.');
  }

  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(`${headerB64}.${payloadB64}`);
  verifier.end();
  const signature = base64UrlDecode(sigB64);
  if (!verifier.verify(cert, signature)) {
    throw new Error('Invalid Firebase ID token signature.');
  }

  return {
    uid: payload.sub,
    email: typeof payload.email === 'string' ? payload.email : '',
    emailVerified: Boolean(payload.email_verified),
  };
}

export function extractBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

// ---------------------------------------------------------------------------
// Constant-time secret check & replay cache helper
// ---------------------------------------------------------------------------
export function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

class BoundedReplayCache {
  private entries = new Map<string, number>();

  has(key: string): boolean {
    return this.entries.has(key);
  }

  add(key: string): void {
    if (this.entries.size >= MAX_REPLAY_CACHE) {
      const oldest = this.entries.keys().next().value;
      if (oldest) this.entries.delete(oldest);
    }
    this.entries.set(key, Date.now());
  }
}

const processedGumroadEvents = new BoundedReplayCache();
const processedStripeEvents = new BoundedReplayCache();

// ---------------------------------------------------------------------------
// Gumroad Ping Validation (Pure, Exported for Testing)
// ---------------------------------------------------------------------------
export interface GumroadValidationConfig {
  webhookToken: string;
  sellerId: string;
  productId: string;
  productPermalink: string;
  allowTest: boolean;
}

export interface GumroadValidationResult {
  ok: boolean;
  httpStatus: number;
  error?: string;
  action?: 'grant_lifetime' | 'revoke_license';
  saleId?: string;
  buyerEmail?: string;
  firebaseUid?: string | null;
  amountCents?: number;
  currency?: string;
  isTest?: boolean;
}

function parseBooleanFlag(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const lower = value.trim().toLowerCase();
    return lower === 'true' || lower === '1' || lower === 'yes';
  }
  return false;
}

function extractGumroadUid(body: Record<string, unknown>): string | null {
  const candidates: unknown[] = [
    body.uid,
    body['url_params[uid]'],
    body['custom_fields[uid]'],
    body['custom_fields[firebase_uid]'],
  ];

  const urlParams = body.url_params;
  if (urlParams && typeof urlParams === 'object' && !Array.isArray(urlParams)) {
    candidates.push((urlParams as Record<string, unknown>).uid);
  }
  const customFields = body.custom_fields;
  if (customFields && typeof customFields === 'object' && !Array.isArray(customFields)) {
    const cf = customFields as Record<string, unknown>;
    candidates.push(cf.uid, cf.firebase_uid);
  }

  for (const cand of candidates) {
    if (typeof cand === 'string') {
      const trimmed = cand.trim();
      if (/^[a-zA-Z0-9_-]{8,128}$/.test(trimmed)) {
        return trimmed;
      }
    }
  }
  return null;
}

export function validateGumroadPing(params: {
  providedToken: string;
  body: Record<string, unknown>;
  config: GumroadValidationConfig;
}): GumroadValidationResult {
  const { providedToken, body, config } = params;

  if (!config.webhookToken || !config.sellerId || (!config.productId && !config.productPermalink)) {
    return {
      ok: false,
      httpStatus: 503,
      error:
        'Gumroad webhook is not configured on the server. Set GUMROAD_WEBHOOK_TOKEN, GUMROAD_SELLER_ID, and GUMROAD_PRODUCT_ID (or GUMROAD_PRODUCT_PERMALINK).',
    };
  }

  if (!providedToken || !timingSafeStringEqual(providedToken, config.webhookToken)) {
    return {
      ok: false,
      httpStatus: 401,
      error: 'Unauthorized: invalid or missing Gumroad webhook token.',
    };
  }

  const sellerId = String(body.seller_id || '').trim();
  if (!sellerId || !timingSafeStringEqual(sellerId, config.sellerId)) {
    return { ok: false, httpStatus: 403, error: 'Forbidden: Gumroad seller_id mismatch.' };
  }

  const productId = String(body.product_id || '').trim();
  const productPermalink = String(body.product_permalink || '').trim();
  const productIdMatches = Boolean(config.productId && productId && productId === config.productId);
  const permalinkMatches = Boolean(
    config.productPermalink && productPermalink && productPermalink === config.productPermalink
  );

  if (!productIdMatches && !permalinkMatches) {
    return { ok: false, httpStatus: 400, error: 'Invalid Gumroad product_id / product_permalink.' };
  }

  const saleId = String(body.sale_id || '').trim();
  if (!saleId || saleId.length > 128) {
    return { ok: false, httpStatus: 400, error: 'Missing or invalid Gumroad sale_id.' };
  }

  const buyerEmail = String(body.email || '').trim().toLowerCase();
  if (!buyerEmail || !buyerEmail.includes('@') || buyerEmail.length > 160) {
    return { ok: false, httpStatus: 400, error: 'Missing or invalid buyer email.' };
  }

  const isTest = parseBooleanFlag(body.test);
  if (isTest && !config.allowTest) {
    return {
      ok: false,
      httpStatus: 400,
      error: 'Gumroad test pings are rejected unless GUMROAD_ALLOW_TEST=true.',
    };
  }

  const isRefunded = parseBooleanFlag(body.refunded);
  const isChargebacked = parseBooleanFlag(body.chargebacked);
  const isDisputed = parseBooleanFlag(body.disputed);
  const resourceName = String(body.resource_name || '').trim().toLowerCase();
  const isRevocation =
    isRefunded || isChargebacked || isDisputed || resourceName === 'refund' || resourceName === 'dispute';

  const currency = String(body.currency || '').trim().toLowerCase();
  const priceRaw = Number(body.price);
  const amountCents = Number.isFinite(priceRaw) ? Math.round(priceRaw) : NaN;

  if (!isRevocation) {
    if (currency !== 'eur') {
      return {
        ok: false,
        httpStatus: 400,
        error: `Unexpected currency "${currency || 'missing'}". Expected "eur".`,
      };
    }
    if (!Number.isFinite(amountCents) || amountCents < GUMROAD_MIN_PRICE_CENTS) {
      return {
        ok: false,
        httpStatus: 400,
        error: `Payment amount (${amountCents} cents) is below minimum required (${GUMROAD_MIN_PRICE_CENTS} cents).`,
      };
    }
  }

  return {
    ok: true,
    httpStatus: 200,
    action: isRevocation ? 'revoke_license' : 'grant_lifetime',
    saleId,
    buyerEmail,
    firebaseUid: extractGumroadUid(body),
    amountCents: Number.isFinite(amountCents) ? amountCents : 0,
    currency: currency || 'eur',
    isTest,
  };
}

// ---------------------------------------------------------------------------
// Stripe Signature Verification & Plan Mapping (Pure, Exported for Testing)
// ---------------------------------------------------------------------------
export function resolveStripePlanPriceId(
  planId: string,
  env: Record<string, string | undefined> = process.env
): { ok: boolean; priceId?: string; error?: string } {
  if (planId === 'pro_monthly') {
    const priceId = (env.STRIPE_PRICE_PRO_MONTHLY || '').trim();
    if (!priceId) {
      return { ok: false, error: 'Missing server env var STRIPE_PRICE_PRO_MONTHLY.' };
    }
    return { ok: true, priceId };
  }
  if (planId === 'creator') {
    const priceId = (env.STRIPE_PRICE_CREATOR_MONTHLY || '').trim();
    if (!priceId) {
      return { ok: false, error: 'Missing server env var STRIPE_PRICE_CREATOR_MONTHLY.' };
    }
    return { ok: true, priceId };
  }
  return {
    ok: false,
    error: `Unsupported Stripe subscription planId "${planId}". Allowed: pro_monthly, creator.`,
  };
}

export function verifyStripeSignature(params: {
  rawBody: Buffer | string;
  signatureHeader: string;
  webhookSecret: string;
  nowSeconds?: number;
}): { ok: boolean; error?: string } {
  const { rawBody, signatureHeader, webhookSecret, nowSeconds = Math.floor(Date.now() / 1000) } = params;

  if (!webhookSecret) {
    return { ok: false, error: 'STRIPE_WEBHOOK_SECRET is not configured on the server.' };
  }
  if (!signatureHeader) {
    return { ok: false, error: 'Missing Stripe-Signature header.' };
  }

  const elements = signatureHeader.split(',');
  let timestamp = '';
  const signatures: string[] = [];

  for (const el of elements) {
    const [k, v] = el.split('=');
    if (!k || !v) continue;
    if (k.trim() === 't') timestamp = v.trim();
    if (k.trim() === 'v1') signatures.push(v.trim());
  }

  const tsNum = Number(timestamp);
  if (!Number.isFinite(tsNum) || signatures.length === 0) {
    return { ok: false, error: 'Malformed Stripe-Signature header.' };
  }

  if (Math.abs(nowSeconds - tsNum) > STRIPE_TOLERANCE_SECONDS) {
    return { ok: false, error: 'Stripe webhook timestamp outside replay tolerance window (300s).' };
  }

  const payloadString = Buffer.isBuffer(rawBody) ? rawBody.toString('utf8') : rawBody;
  const expectedSig = crypto
    .createHmac('sha256', webhookSecret)
    .update(`${timestamp}.${payloadString}`, 'utf8')
    .digest('hex');

  const valid = signatures.some((sig) => timingSafeStringEqual(sig, expectedSig));
  if (!valid) {
    return { ok: false, error: 'Invalid Stripe webhook HMAC signature.' };
  }

  return { ok: true };
}

export interface StripeWebhookAction {
  handled: boolean;
  action: 'activate_subscription' | 'mark_payment_failed' | 'update_subscription' | 'revoke_subscription' | 'ignore';
  eventType: string;
  firebaseUid?: string;
  planId?: string;
  stripeCustomerId?: string;
  subscriptionStatus?: string;
}

export function classifyStripeWebhookEvent(event: Record<string, unknown>): StripeWebhookAction {
  const eventType = String(event.type || '');
  const dataObj = ((event.data as Record<string, unknown> | undefined)?.object || {}) as Record<
    string,
    unknown
  >;
  const metadata = (dataObj.metadata || {}) as Record<string, unknown>;
  const firebaseUid =
    typeof metadata.firebaseUid === 'string'
      ? metadata.firebaseUid
      : typeof dataObj.client_reference_id === 'string'
      ? dataObj.client_reference_id
      : undefined;
  const planId = typeof metadata.planId === 'string' ? metadata.planId : undefined;
  const stripeCustomerId = typeof dataObj.customer === 'string' ? dataObj.customer : undefined;

  switch (eventType) {
    case 'checkout.session.completed':
    case 'invoice.payment_succeeded':
      return {
        handled: true,
        action: 'activate_subscription',
        eventType,
        firebaseUid,
        planId,
        stripeCustomerId,
        subscriptionStatus: 'active',
      };
    case 'invoice.payment_failed':
      return {
        handled: true,
        action: 'mark_payment_failed',
        eventType,
        firebaseUid,
        planId,
        stripeCustomerId,
        subscriptionStatus: 'inactive',
      };
    case 'customer.subscription.updated':
      return {
        handled: true,
        action: 'update_subscription',
        eventType,
        firebaseUid,
        planId,
        stripeCustomerId,
        subscriptionStatus: typeof dataObj.status === 'string' ? dataObj.status : 'active',
      };
    case 'customer.subscription.deleted':
    case 'charge.refunded':
      return {
        handled: true,
        action: 'revoke_subscription',
        eventType,
        firebaseUid,
        planId: 'free',
        stripeCustomerId,
        subscriptionStatus: 'inactive',
      };
    default:
      return { handled: false, action: 'ignore', eventType };
  }
}

function isSafeRedirectUrl(candidate: string, allowedOrigin: string): boolean {
  try {
    const parsed = new URL(candidate);
    const allowed = new URL(allowedOrigin);
    return parsed.origin === allowed.origin && (parsed.protocol === 'https:' || parsed.protocol === 'http:');
  } catch {
    return false;
  }
}

function resolveRequestOrigin(req: Request): string {
  const configured = (process.env.APP_URL || '').trim().replace(/\/+$/, '');
  if (configured) return configured;
  const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http';
  const host = (req.headers['x-forwarded-host'] as string) || req.get('host') || 'localhost:3000';
  return `${proto}://${host}`;
}

export function getPaymentBackendStatus(env: Record<string, string | undefined> = process.env) {
  const hasGumroadToken = Boolean((env.GUMROAD_WEBHOOK_TOKEN || '').trim());
  const hasGumroadSeller = Boolean((env.GUMROAD_SELLER_ID || '').trim());
  const hasGumroadProduct = Boolean(
    (env.GUMROAD_PRODUCT_ID || '').trim() || (env.GUMROAD_PRODUCT_PERMALINK || '').trim()
  );

  const hasStripeSecret = Boolean((env.STRIPE_SECRET_KEY || '').trim());
  const hasStripeWebhook = Boolean((env.STRIPE_WEBHOOK_SECRET || '').trim());
  const hasProPrice = Boolean((env.STRIPE_PRICE_PRO_MONTHLY || '').trim());
  const hasCreatorPrice = Boolean((env.STRIPE_PRICE_CREATOR_MONTHLY || '').trim());

  const missingEnvVars: string[] = [];
  if (!hasGumroadToken) missingEnvVars.push('GUMROAD_WEBHOOK_TOKEN');
  if (!hasGumroadSeller) missingEnvVars.push('GUMROAD_SELLER_ID');
  if (!hasGumroadProduct) missingEnvVars.push('GUMROAD_PRODUCT_ID');
  if (!hasStripeSecret) missingEnvVars.push('STRIPE_SECRET_KEY');
  if (!hasStripeWebhook) missingEnvVars.push('STRIPE_WEBHOOK_SECRET');
  if (!hasProPrice) missingEnvVars.push('STRIPE_PRICE_PRO_MONTHLY');
  if (!hasCreatorPrice) missingEnvVars.push('STRIPE_PRICE_CREATOR_MONTHLY');

  return {
    gumroadUrl: OFFICIAL_GUMROAD_URL,
    gumroadWebhookConfigured: hasGumroadToken && hasGumroadSeller && hasGumroadProduct,
    stripeCheckoutConfigured: hasStripeSecret && (hasProPrice || hasCreatorPrice),
    stripeWebhookConfigured: hasStripeSecret && hasStripeWebhook,
    stripePortalConfigured: hasStripeSecret,
    stripePricesConfigured: {
      pro_monthly: hasStripeSecret && hasProPrice,
      creator: hasStripeSecret && hasCreatorPrice,
    },
    // Server-side Firestore Admin writes remain disabled until project ownership & IAM roles/datastore.user are confirmed.
    firestoreServerSyncReady: false,
    missingEnvVars,
  };
}

// ---------------------------------------------------------------------------
// Express Route Registration
// ---------------------------------------------------------------------------
export function registerPaymentRoutes(app: Express): void {
  app.get('/api/payments/status', (_req: Request, res: Response) => {
    res.json(getPaymentBackendStatus(process.env));
  });

  // Gumroad Ping Webhook (accepts application/x-www-form-urlencoded or application/json)
  app.post('/api/gumroad/webhook', (req: Request, res: Response) => {
    const headerToken = typeof req.headers['x-gumroad-token'] === 'string' ? req.headers['x-gumroad-token'].trim() : '';
    const queryToken = typeof req.query.token === 'string' ? req.query.token.trim() : '';
    const providedToken = headerToken || queryToken;

    const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;
    const validation = validateGumroadPing({
      providedToken,
      body,
      config: {
        webhookToken: (process.env.GUMROAD_WEBHOOK_TOKEN || '').trim(),
        sellerId: (process.env.GUMROAD_SELLER_ID || '').trim(),
        productId: (process.env.GUMROAD_PRODUCT_ID || '').trim(),
        productPermalink: (process.env.GUMROAD_PRODUCT_PERMALINK || 'jitalx-full-access').trim(),
        allowTest: process.env.GUMROAD_ALLOW_TEST === 'true',
      },
    });

    if (!validation.ok) {
      res.status(validation.httpStatus).json({ ok: false, error: validation.error });
      return;
    }

    const replayKey = `${validation.saleId}:${validation.action}`;
    if (processedGumroadEvents.has(replayKey)) {
      res.status(200).json({
        ok: true,
        duplicate: true,
        saleId: validation.saleId,
        action: validation.action,
      });
      return;
    }

    // Server-side Firestore license persistence requires confirmed user-owned Firebase project + IAM datastore access.
    // We never falsely report license activation if Firestore was not updated.
    res.status(503).json({
      ok: false,
      validated: true,
      code: 'FIRESTORE_SERVER_SYNC_NOT_ENABLED',
      action: validation.action,
      saleId: validation.saleId,
      buyerEmail: validation.buyerEmail,
      firebaseUid: validation.firebaseUid,
      message:
        'Gumroad notification passed cryptographic/business validation, but server-side Firestore license writes require confirming Firebase project ownership and granting roles/datastore.user to the runtime service account.',
    });
  });

  // Stripe Subscription Checkout Session
  app.post('/api/stripe/create-checkout-session', async (req: Request, res: Response) => {
    const token = extractBearerToken(req);
    if (!token) {
      res.status(401).json({ ok: false, error: 'Missing Authorization Bearer Firebase ID token.' });
      return;
    }

    let verifiedUser: VerifiedFirebaseToken;
    try {
      verifiedUser = await verifyFirebaseIdToken(token);
    } catch (err) {
      res.status(401).json({
        ok: false,
        error: err instanceof Error ? err.message : 'Invalid Firebase ID token.',
      });
      return;
    }

    const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
    if (!stripeSecretKey) {
      res.status(503).json({
        ok: false,
        code: 'STRIPE_NOT_CONFIGURED',
        error: 'Stripe is not configured on the server. Set STRIPE_SECRET_KEY and STRIPE_PRICE_* env vars.',
      });
      return;
    }

    const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;
    const planId = String(body.planId || '').trim();
    const resolvedPrice = resolveStripePlanPriceId(planId, process.env);
    if (!resolvedPrice.ok || !resolvedPrice.priceId) {
      res.status(400).json({ ok: false, error: resolvedPrice.error });
      return;
    }

    const origin = resolveRequestOrigin(req);
    const requestedSuccess = typeof body.successUrl === 'string' ? body.successUrl : '';
    const requestedCancel = typeof body.cancelUrl === 'string' ? body.cancelUrl : '';
    const successUrl = isSafeRedirectUrl(requestedSuccess, origin)
      ? requestedSuccess
      : `${origin}/account?stripe=success`;
    const cancelUrl = isSafeRedirectUrl(requestedCancel, origin)
      ? requestedCancel
      : `${origin}/pricing?stripe=cancel`;

    try {
      const form = new URLSearchParams();
      form.set('mode', 'subscription');
      form.set('line_items[0][price]', resolvedPrice.priceId);
      form.set('line_items[0][quantity]', '1');
      form.set('success_url', successUrl);
      form.set('cancel_url', cancelUrl);
      form.set('client_reference_id', verifiedUser.uid);
      if (verifiedUser.email) {
        form.set('customer_email', verifiedUser.email);
      }
      form.set('metadata[firebaseUid]', verifiedUser.uid);
      form.set('metadata[planId]', planId);
      form.set('subscription_data[metadata][firebaseUid]', verifiedUser.uid);
      form.set('subscription_data[metadata][planId]', planId);

      const stripeResp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: form.toString(),
      });

      const stripeData = (await stripeResp.json()) as { url?: string; error?: { message?: string } };
      if (!stripeResp.ok || !stripeData.url) {
        res.status(502).json({
          ok: false,
          error: stripeData.error?.message || `Stripe API error (${stripeResp.status}).`,
        });
        return;
      }

      res.status(200).json({ ok: true, url: stripeData.url });
    } catch {
      res.status(502).json({ ok: false, error: 'Failed to contact Stripe Checkout API.' });
    }
  });

  // Stripe Customer Billing Portal
  app.post('/api/stripe/create-portal-session', async (req: Request, res: Response) => {
    const token = extractBearerToken(req);
    if (!token) {
      res.status(401).json({ ok: false, error: 'Missing Authorization Bearer Firebase ID token.' });
      return;
    }

    try {
      await verifyFirebaseIdToken(token);
    } catch (err) {
      res.status(401).json({
        ok: false,
        error: err instanceof Error ? err.message : 'Invalid Firebase ID token.',
      });
      return;
    }

    const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
    if (!stripeSecretKey) {
      res.status(503).json({
        ok: false,
        code: 'STRIPE_NOT_CONFIGURED',
        error: 'Stripe Billing Portal requires STRIPE_SECRET_KEY on the server.',
      });
      return;
    }

    const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;
    const customerId = String(body.customerId || '').trim();
    if (!/^cus_[a-zA-Z0-9]{6,64}$/.test(customerId)) {
      res.status(400).json({ ok: false, error: 'A valid Stripe customerId (cus_...) is required.' });
      return;
    }

    const origin = resolveRequestOrigin(req);
    const returnUrl = `${origin}/account`;

    try {
      const form = new URLSearchParams();
      form.set('customer', customerId);
      form.set('return_url', returnUrl);

      const stripeResp = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: form.toString(),
      });

      const stripeData = (await stripeResp.json()) as { url?: string; error?: { message?: string } };
      if (!stripeResp.ok || !stripeData.url) {
        res.status(502).json({
          ok: false,
          error: stripeData.error?.message || `Stripe Portal API error (${stripeResp.status}).`,
        });
        return;
      }

      res.status(200).json({ ok: true, url: stripeData.url });
    } catch {
      res.status(502).json({ ok: false, error: 'Failed to contact Stripe Billing Portal API.' });
    }
  });
}

// Raw-body Stripe webhook handler (mounted BEFORE express.json())
export function handleStripeWebhookRaw(req: Request, res: Response): void {
  const sigHeader = typeof req.headers['stripe-signature'] === 'string' ? req.headers['stripe-signature'] : '';
  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(String(req.body || ''), 'utf8');
  const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || '').trim();

  if (!webhookSecret) {
    res.status(503).json({
      ok: false,
      error: 'STRIPE_WEBHOOK_SECRET is not configured on the server.',
    });
    return;
  }

  const verification = verifyStripeSignature({
    rawBody,
    signatureHeader: sigHeader,
    webhookSecret,
  });

  if (!verification.ok) {
    res.status(400).json({ ok: false, error: verification.error });
    return;
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody.toString('utf8')) as Record<string, unknown>;
  } catch {
    res.status(400).json({ ok: false, error: 'Invalid JSON payload.' });
    return;
  }

  const eventId = String(event.id || '').trim();
  if (!eventId) {
    res.status(400).json({ ok: false, error: 'Missing Stripe event id.' });
    return;
  }

  if (processedStripeEvents.has(eventId)) {
    res.status(200).json({ ok: true, duplicate: true, eventId });
    return;
  }

  const classified = classifyStripeWebhookEvent(event);
  if (!classified.handled) {
    processedStripeEvents.add(eventId);
    res.status(200).json({ ok: true, ignored: true, eventType: classified.eventType });
    return;
  }

  // Server-side Firestore license persistence requires confirmed Firebase project ownership + IAM access.
  res.status(503).json({
    ok: false,
    validated: true,
    code: 'FIRESTORE_SERVER_SYNC_NOT_ENABLED',
    eventId,
    action: classified.action,
    eventType: classified.eventType,
    firebaseUid: classified.firebaseUid || null,
    planId: classified.planId || null,
    message:
      'Stripe webhook signature verified, but server-side Firestore entitlement sync requires confirming Firebase project ownership and granting roles/datastore.user.',
  });
}
