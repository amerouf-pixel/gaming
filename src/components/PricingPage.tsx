import React, { useState, useEffect } from 'react';
import { AppRoute, PaymentBackendStatus, SubscriptionTier } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLocale, LanguageSwitcher } from '../context/LocaleContext';
import {
  buildGumroadCheckoutUrl,
  fetchPaymentBackendStatus,
  SUBSCRIPTION_PLANS,
  isStripePlanReady,
  prepareStripeCheckoutSession,
} from '../services/stripeConfig';
import { cyberAudio } from '../utils/cyberAudio';
import { CommercialNav } from './CommercialNav';
import {
  Check,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  ArrowRight,
  Lock,
  ExternalLink,
} from 'lucide-react';

interface PricingPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const { user, account, signInWithGoogle, getIdToken } = useAuth();
  const { locale, copy } = useLocale();
  const t = copy.pricing;
  const [stripeNotice, setStripeNotice] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<PaymentBackendStatus | null>(null);
  const [busyPlan, setBusyPlan] = useState<SubscriptionTier | null>(null);

  useEffect(() => {
    let active = true;
    void fetchPaymentBackendStatus().then((status) => {
      if (active) setBackendStatus(status);
    });
    return () => {
      active = false;
    };
  }, []);

  const stripeReady = Boolean(backendStatus?.stripeCheckoutConfigured);
  const gumroadHref = buildGumroadCheckoutUrl({ email: user?.email, uid: user?.uid });

  const handleSelectPlan = async (planId: SubscriptionTier) => {
    cyberAudio.playChirp();
    setStripeNotice(null);

    if (planId === 'free') {
      onNavigate('app');
      return;
    }

    if (planId !== 'pro_monthly' && planId !== 'creator') return;

    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!plan) return;
    const localizedPlan = copy.plans[planId];

    if (isStripePlanReady(planId, backendStatus)) {
      setBusyPlan(planId);
      if (!user) {
        const signedIn = await signInWithGoogle();
        if (!signedIn) {
          setBusyPlan(null);
          return;
        }
      }
      const token = await getIdToken();
      if (!token) {
        setBusyPlan(null);
        setStripeNotice(
          locale === 'fr'
            ? 'Veuillez vous connecter avec Google avant de démarrer un abonnement Stripe.'
            : 'Please sign in with Google before starting a Stripe subscription.'
        );
        return;
      }
      const res = await prepareStripeCheckoutSession({
        planId,
        firebaseIdToken: token,
        successUrl: `${window.location.origin}/account?billing=success`,
        cancelUrl: `${window.location.origin}/pricing?billing=cancel`,
      });
      setBusyPlan(null);
      if (res.ok && res.url) {
        window.location.href = res.url;
        return;
      }
      setStripeNotice(res.message);
      return;
    }

    setStripeNotice(
      locale === 'fr'
        ? `La formule mensuelle "${localizedPlan.name}" attend la configuration des clés serveur Stripe (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, ${plan.stripePriceEnvKey}). Pour acheter dès maintenant, utilisez l'offre officielle à 7 € sur Gumroad.`
        : `The monthly "${localizedPlan.name}" tier awaits server Stripe configuration (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, ${plan.stripePriceEnvKey}). To purchase today, use the official €7.00 Full Access launch offer on Gumroad.`
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0910] text-slate-100 flex flex-col font-sans overflow-x-hidden">
      <CommercialNav activeRoute="pricing" onNavigate={onNavigate} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-mono-code text-[#ff7b00] uppercase tracking-[0.14em]">
              {t.kicker}
            </p>
            <LanguageSwitcher />
          </div>
          <h1
            className="text-3xl sm:text-5xl font-hud font-bold text-white leading-tight tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            {t.heading}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{t.subtitle}</p>
        </div>

        {/* Honest Payment Status Banner */}
        <div className="rounded-2xl bg-[#110e1c] border border-white/10 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-[#00f0ff] shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-1">
              <div>
                <strong className="text-white">{t.activePaymentLabel}</strong>{' '}
                <span className="text-[#00f0ff]">{t.activePaymentValue}</span>
              </div>
              <div className="text-xs text-slate-400">
                {stripeReady ? t.stripeReadyNote : t.stripePendingNote}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('account')}
            className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-xs font-semibold text-[#00f0ff] cursor-pointer whitespace-nowrap shrink-0 transition-colors"
          >
            {t.myAccountCta}
          </button>
        </div>

        {stripeNotice && (
          <div className="rounded-xl p-4 bg-[#171126] border border-[#ff7b00]/50 text-sm text-slate-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#ff7b00] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-semibold text-[#ff7b00]">{t.noticeTitle}</div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{stripeNotice}</p>
            </div>
          </div>
        )}

        {/* 4 Subscription Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const localized = copy.plans[plan.id];
            const isCurrent = account?.subscriptionTier === plan.id;
            const isGumroadLifetime = plan.id === 'lifetime';
            const planStripeReady = isStripePlanReady(plan.id, backendStatus);

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl flex flex-col justify-between p-6 border transition-all ${
                  plan.recommended
                    ? 'bg-gradient-to-b from-[#1a112c] to-[#110e1c] border-[#ff2a85]/70 shadow-[0_18px_40px_-14px_rgba(255,42,133,0.35)]'
                    : 'bg-[#110e1c] border-white/10 hover:border-white/25'
                }`}
              >
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    {localized.badge && (
                      <div className="text-[11px] font-mono-code font-semibold uppercase tracking-wider text-[#ff7b00]">
                        {localized.badge}
                      </div>
                    )}
                    <h2 className="font-hud font-bold text-xl text-white">{localized.name}</h2>
                    <p className="text-xs text-slate-300 leading-relaxed">{localized.tagline}</p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.08]">
                    <div className="text-3xl font-bold font-mono-code text-white tabular-nums">
                      {localized.priceDisplay}
                    </div>
                    <div className="text-xs font-mono-code text-slate-400 mt-0.5">
                      {localized.billingCycle}
                    </div>
                  </div>

                  <ul className="space-y-2.5 pt-2 text-xs text-slate-200">
                    {localized.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-white/[0.08] space-y-2.5">
                  {isGumroadLifetime && !isCurrent ? (
                    <a
                      href={gumroadHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => cyberAudio.playChirp()}
                      className="w-full py-3 px-4 rounded-lg font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff2a85] via-[#ff5c4d] to-[#ff7b00] text-white hover:brightness-110"
                    >
                      <span>{t.buyGumroadCta}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void handleSelectPlan(plan.id)}
                      disabled={isCurrent || busyPlan === plan.id}
                      className={`w-full py-3 px-4 rounded-lg font-semibold text-xs tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-default ${
                        plan.id === 'free'
                          ? 'bg-white text-[#0a0910] hover:bg-[#00f0ff]'
                          : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/15'
                      }`}
                    >
                      <span>
                        {busyPlan === plan.id
                          ? '...'
                          : isCurrent
                          ? t.currentPlanCta
                          : plan.id === 'free'
                          ? t.startFreeCta
                          : planStripeReady
                          ? t.subscribeStripeCta
                          : t.comingSoonCta}
                      </span>
                      {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  )}

                  <div className="text-[11px] font-mono-code text-slate-400 text-center">
                    {plan.id === 'free'
                      ? t.freeSubtext
                      : isGumroadLifetime
                      ? t.gumroadSubtext
                      : planStripeReady
                      ? t.stripeActiveSubtext
                      : `${t.stripePendingSubtext} (${plan.stripePriceEnvKey})`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Matrix */}
        <div className="rounded-2xl bg-[#110e1c] border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-[#0d0a16]">
                <th className="py-3.5 px-5 font-hud uppercase text-slate-300">{t.matrixHeader}</th>
                {SUBSCRIPTION_PLANS.map((p) => (
                  <th key={p.id} className="py-3.5 px-5 font-hud uppercase text-white">
                    {copy.plans[p.id].name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.07] font-mono-code text-xs">
              <tr>
                <td className="py-3.5 px-5 text-slate-300">{t.matrixProfiles}</td>
                {SUBSCRIPTION_PLANS.map((p) => (
                  <td key={p.id} className="py-3.5 px-5 text-slate-200">
                    {copy.plans[p.id].limits.customProfiles}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 px-5 text-slate-300">{t.matrixCloud}</td>
                {SUBSCRIPTION_PLANS.map((p) => (
                  <td key={p.id} className="py-3.5 px-5 text-slate-200">
                    {copy.plans[p.id].limits.cloudSnapshots}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 px-5 text-slate-300">{t.matrixOverlay}</td>
                {SUBSCRIPTION_PLANS.map((p) => (
                  <td key={p.id} className="py-3.5 px-5 text-slate-200">
                    {copy.plans[p.id].limits.overlayBranding}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 px-5 text-slate-300">{t.matrixSupport}</td>
                {SUBSCRIPTION_PLANS.map((p) => (
                  <td key={p.id} className="py-3.5 px-5 text-slate-200">
                    {copy.plans[p.id].limits.supportLevel}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Security Note */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 border-t border-white/[0.08] pt-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00f0ff] shrink-0" />
            <span>{t.securityAuth}</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#ff7b00] shrink-0" />
            <span>{t.securityPayment}</span>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/[0.08] bg-[#08070d] py-6 px-4 text-center text-xs font-mono-code text-slate-400">
        {copy.footer.copyright}
      </footer>
    </div>
  );
};
