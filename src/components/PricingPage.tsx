import React, { useState } from 'react';
import { AppRoute, SubscriptionTier } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  SUBSCRIPTION_PLANS,
  isStripeConfigured,
  isStripePlanReady,
  prepareStripeCheckoutSession,
} from '../services/stripeConfig';
import { cyberAudio } from '../utils/cyberAudio';
import { CommercialNav } from './CommercialNav';
import { CheckoutTerminal } from './CheckoutTerminal';
import {
  Check,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  ArrowRight,
  Lock,
} from 'lucide-react';

// COLLER MON LIEN GUMROAD OU WHOP ICI
const DEFAULT_PAYMENT_URL = 'https://gumroad.com/l/jitalx-full-access';

interface PricingPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const { user, account, signInWithGoogle } = useAuth();
  const [stripeNotice, setStripeNotice] = useState<string | null>(null);
  const [terminalPlan, setTerminalPlan] = useState<{
    planName: string;
    price: string;
    duration: string;
    redirectUrl?: string;
  } | null>(null);

  const stripeReady = isStripeConfigured();

  const handleSelectPlan = async (planId: SubscriptionTier) => {
    cyberAudio.playChirp();
    setStripeNotice(null);

    if (planId === 'free') {
      onNavigate('app');
      return;
    }

    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!plan) return;

    // If Stripe is configured with live/test keys and Price ID, launch real Checkout endpoint
    if (isStripePlanReady(planId)) {
      if (!user) {
        const signedIn = await signInWithGoogle();
        if (!signedIn) return;
      }
      const res = await prepareStripeCheckoutSession({
        planId,
        priceId: plan.stripePriceId,
        userId: user?.uid || '',
        userEmail: user?.email || '',
        successUrl: `${window.location.origin}/account?billing=success`,
        cancelUrl: `${window.location.origin}/pricing?billing=cancel`,
      });
      if (res.ok && res.url) {
        window.location.href = res.url;
        return;
      }
      setStripeNotice(res.message);
      return;
    }

    // Stripe not yet configured: keep real payments safely disabled and inform clearly
    if (planId === 'lifetime') {
      setTerminalPlan({
        planName: 'JITALX FULL ACCESS',
        price: '7.00',
        duration: 'PAIEMENT UNIQUE · ACCÈS À VIE',
        redirectUrl: DEFAULT_PAYMENT_URL,
      });
      return;
    }

    setStripeNotice(
      `La formule "${plan.name}" est prête pour Stripe (${plan.stripePriceEnvKey}), mais aucun paiement réel n'est activé tant que vos clés Stripe ne sont pas configurées dans les variables d'environnement.`
    );
  };

  return (
    <div className="min-h-screen bg-[#120428] text-slate-100 flex flex-col">
      <CommercialNav activeRoute="pricing" onNavigate={onNavigate} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        {/* Heading */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-mono-code text-[#ff7b00] uppercase tracking-widest">
            Architecture multi-formules · Prêt pour Stripe
          </div>
          <h1 className="text-3xl sm:text-5xl font-hud font-bold text-white leading-tight">
            Des formules claires pour joueurs solo et streamers
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Commencez gratuitement sans carte bancaire, passez à l&apos;accès à vie (offre de
            lancement 7 €) ou choisissez Creator Studio pour vos diffusions OBS et TikTok Live.
          </p>
        </div>

        {/* Stripe Integration Readiness Banner */}
        <div className="bg-[#180633] border border-[#00f0ff]/35 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-[#00f0ff] shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              <strong className="text-white">Statut passerelle Stripe :</strong>{' '}
              {stripeReady ? (
                <span className="text-emerald-400">
                  Clé publique détectée. Vérifiez vos Price IDs et le webhook serveur.
                </span>
              ) : (
                <span className="text-slate-300">
                  Mode préparation actif — aucun paiement réel n&apos;est débité sans configuration
                  explicite de <code className="font-mono-code text-[#00f0ff]">VITE_STRIPE_PUBLISHABLE_KEY</code> et de l&apos;API serveur.
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('account')}
            className="px-3.5 py-2 bg-[#0e0320] hover:bg-[#240a4a] border border-[#ff2a85]/40 text-xs font-hud font-bold text-[#00f0ff] uppercase tracking-wider cursor-pointer whitespace-nowrap shrink-0"
          >
            Gérer mon abonnement
          </button>
        </div>

        {stripeNotice && (
          <div className="p-4 bg-[#1b0838] border border-[#ff7b00]/60 text-sm text-slate-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#ff7b00] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-semibold text-[#ff7b00]">Paiement Stripe non activé</div>
              <p className="text-xs sm:text-sm text-slate-300">{stripeNotice}</p>
            </div>
          </div>
        )}

        {/* 4 Subscription Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = account?.subscriptionTier === plan.id;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between p-6 border transition-all ${
                  plan.recommended
                    ? 'bg-gradient-to-b from-[#230948] to-[#14042c] border-2 border-[#ff2a85] shadow-[0_0_32px_rgba(255,42,133,0.3)]'
                    : 'bg-[#180633] border-[#ff2a85]/30 hover:border-[#00f0ff]/55'
                }`}
              >
                {plan.badge && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] text-white text-[10px] font-mono-code font-bold px-2.5 py-1 uppercase tracking-wider">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="pt-1">
                    <h2 className="font-hud font-bold text-xl text-white">{plan.name}</h2>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{plan.tagline}</p>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <div className="text-3xl font-bold font-mono-code text-[#00f0ff]">
                      {plan.priceDisplay}
                    </div>
                    <div className="text-xs font-mono-code text-slate-400 mt-0.5">
                      {plan.billingCycle}
                    </div>
                  </div>

                  <ul className="space-y-2.5 pt-2 text-xs text-slate-200">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 space-y-2">
                  <button
                    onClick={() => void handleSelectPlan(plan.id)}
                    disabled={isCurrent}
                    className={`w-full py-3 px-4 font-hud font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-default ${
                      plan.recommended
                        ? 'bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#00f0ff] text-white hover:brightness-110'
                        : plan.id === 'free'
                        ? 'bg-[#0e0320] hover:bg-[#260b4d] text-white border border-[#00f0ff]/45'
                        : 'bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 text-[#00f0ff] border border-[#00f0ff]/50'
                    }`}
                  >
                    <span>
                      {isCurrent
                        ? 'Formule active'
                        : plan.id === 'free'
                        ? 'Commencer gratuitement'
                        : plan.id === 'lifetime'
                        ? 'Offre lancement · 7 €'
                        : 'Préparer via Stripe'}
                    </span>
                    {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                  <div className="text-[10px] font-mono-code text-slate-500 text-center">
                    {plan.id === 'free'
                      ? 'Accès immédiat sans inscription'
                      : isStripePlanReady(plan.id)
                      ? 'Stripe Checkout actif'
                      : `Variable Stripe : ${plan.stripePriceEnvKey}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Matrix */}
        <div className="bg-[#180633] border border-[#ff2a85]/30 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#ff2a85]/30 bg-[#0e0320]">
                <th className="py-3.5 px-4 font-hud uppercase text-slate-300">Capacité</th>
                {SUBSCRIPTION_PLANS.map((p) => (
                  <th key={p.id} className="py-3.5 px-4 font-hud uppercase text-white">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 font-mono-code text-xs">
              <tr>
                <td className="py-3 px-4 text-slate-300">Profils & Univers</td>
                {SUBSCRIPTION_PLANS.map((p) => (
                  <td key={p.id} className="py-3 px-4 text-slate-200">
                    {p.limits.customProfiles}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-300">Sauvegarde Cloud</td>
                {SUBSCRIPTION_PLANS.map((p) => (
                  <td key={p.id} className="py-3 px-4 text-slate-200">
                    {p.limits.cloudSnapshots}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-300">Branding Overlay OBS</td>
                {SUBSCRIPTION_PLANS.map((p) => (
                  <td key={p.id} className="py-3 px-4 text-slate-200">
                    {p.limits.overlayBranding}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-300">Support</td>
                {SUBSCRIPTION_PLANS.map((p) => (
                  <td key={p.id} className="py-3 px-4 text-slate-200">
                    {p.limits.supportLevel}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Security Note */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 border-t border-[#ff2a85]/20 pt-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00f0ff]" />
            <span>Authentification Firebase sécurisée et règles Firestore vérifiées par compte.</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#ff7b00]" />
            <span>Aucune donnée bancaire n&apos;est stockée par JITALX (délégation Stripe Checkout).</span>
          </div>
        </div>
      </main>

      {/* Optional Launch Offer CheckoutTerminal Modal */}
      {terminalPlan && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md">
          <CheckoutTerminal
            planName={terminalPlan.planName}
            price={terminalPlan.price}
            duration={terminalPlan.duration}
            redirectUrl={terminalPlan.redirectUrl}
            onClose={() => setTerminalPlan(null)}
            onSuccess={() => {
              setTerminalPlan(null);
              onNavigate('app');
            }}
          />
        </div>
      )}

      <footer className="border-t border-[#ff2a85]/25 bg-[#0e0320] py-6 px-4 text-center text-xs font-mono-code text-slate-400">
        © 2026 10JITAL Production · JITALX · THE STREAMER COMMAND HUB
      </footer>
    </div>
  );
};
