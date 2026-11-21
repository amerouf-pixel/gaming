import React, { useState } from 'react';
import { AppRoute, SubscriptionTier } from '../types';
import { cyberAudio } from '../utils/cyberAudio';
import {
  GUMROAD_PRODUCT_URL,
  SUBSCRIPTION_PLANS,
  SubscriptionPlanDefinition,
  isStripePlanReady,
} from '../services/stripeConfig';
import { CatalogCategoryId } from '../i18n/locale';
import { useLocale, LanguageSwitcher } from '../context/LocaleContext';
import { DISCORD_INVITE_URL, DiscordIcon } from '../config/community';
import { CommercialNav } from './CommercialNav';
import { CheckoutTerminal } from './CheckoutTerminal';
import heroStudioImg from '../assets/images/chitalix_hero_studio_1795218833743.jpg';
import flagshipProductImg from '../assets/images/chitalix_product_jitalx_1795218833865.jpg';
import studioCraftImg from '../assets/images/chitalix_studio_craft_1795218833622.jpg';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Cpu,
  ExternalLink,
  Gauge,
  Globe,
  Layers,
  Lock,
  Radio,
  Share2,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Unlock,
  Video,
  X,
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp?: () => void;
  onNavigate?: (route: AppRoute) => void;
}

const CATALOG_CATEGORY_IDS: CatalogCategoryId[] = [
  'all',
  'studio-kits',
  'templates',
  'saas-tools',
  'applications',
  'websites',
  'marketing',
  'creator-resources',
];

const PLAN_CATEGORY_MAP: Record<SubscriptionTier, CatalogCategoryId[]> = {
  lifetime: ['applications', 'creator-resources', 'studio-kits', 'saas-tools'],
  free: ['applications', 'creator-resources'],
  pro_monthly: ['saas-tools'],
  creator: ['creator-resources', 'marketing', 'saas-tools'],
};

const PLAN_MEDIA_MAP: Record<SubscriptionTier, { image: string; alt: string }> = {
  lifetime: {
    image: flagshipProductImg,
    alt: 'JITALX Full Access dual-screen command hub and vertical broadcast layout',
  },
  free: {
    image: heroStudioImg,
    alt: 'JITALX Starter Edition browser command hub workspace',
  },
  pro_monthly: {
    image: studioCraftImg,
    alt: 'JITALX Pro Monthly creator workflow and cloud setup',
  },
  creator: {
    image: flagshipProductImg,
    alt: 'JITALX Creator Studio multi-platform broadcast overlay suite',
  },
};

interface CatalogEntry {
  plan: SubscriptionPlanDefinition;
  title: string;
  shortDescription: string;
  categoryLabel: string;
  categories: CatalogCategoryId[];
  priceText: string;
  currencyNote: string;
  statusLabel: string;
  image: string;
  imageAlt: string;
  highlights: string[];
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onNavigate }) => {
  const { locale, copy: t } = useLocale();
  const [selectedCategory, setSelectedCategory] = useState<CatalogCategoryId>('all');
  const [activeProductId, setActiveProductId] = useState<SubscriptionTier | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [tuningLevel, setTuningLevel] = useState<number>(42);
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [craftImgFailed, setCraftImgFailed] = useState(false);
  const [failedProductImages, setFailedProductImages] = useState<Record<string, boolean>>({});

  const navigateTo = (route: AppRoute) => {
    if (onNavigate) {
      onNavigate(route);
    } else if (route === 'app' && onEnterApp) {
      onEnterApp();
    }
  };

  /**
   * Maps strictly the real existing commercial products/plans in the codebase (`SUBSCRIPTION_PLANS`)
   * into the 10JITALX international catalog categories without inventing fictitious records.
   */
  const catalogEntries: CatalogEntry[] = SUBSCRIPTION_PLANS.map((plan) => {
    const localized = t.plans[plan.id];
    const media = PLAN_MEDIA_MAP[plan.id];
    return {
      plan,
      title: localized.name,
      shortDescription: localized.tagline,
      categoryLabel: localized.categoryLabel,
      categories: PLAN_CATEGORY_MAP[plan.id],
      priceText: localized.priceDisplay,
      currencyNote: localized.billingCycle,
      statusLabel: localized.statusLabel,
      image: media.image,
      imageAlt: media.alt,
      highlights: localized.features,
    };
  });

  const filteredCatalog =
    selectedCategory === 'all'
      ? catalogEntries
      : catalogEntries.filter((entry) => entry.categories.includes(selectedCategory));

  const activeProduct = activeProductId
    ? catalogEntries.find((entry) => entry.plan.id === activeProductId) || null
    : null;

  const currentSpeed = Math.min(100, Math.round(58 + (42 * tuningLevel) / 100));
  const currentArmor = Math.min(100, Math.round(40 + (55 * tuningLevel) / 100));
  const isMaxTuning = tuningLevel >= 100;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setTuningLevel(val);
    if (val === 100) {
      cyberAudio.playFanfare();
    } else if (val % 15 === 0) {
      cyberAudio.playClick();
    }
  };

  const scrollToSection = (sectionId: string) => {
    cyberAudio.playClick();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleShare = async (customTitle?: string) => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const title = customTitle || '10JITAL PROD — Ideas in Action.';
    const text =
      locale === 'fr'
        ? 'Découvrez 10JITAL PROD : kits studio, templates, outils SaaS, applications et logiciels créateurs comme JITALX.'
        : 'Explore 10JITAL PROD: studio kits, templates, SaaS tools, apps, and creator broadcast software including JITALX.';

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch {
        // User canceled or Web Share unavailable; fall through to clipboard
      }
    }

    try {
      await navigator.clipboard?.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2400);
    } catch {
      // Clipboard blocked in restricted sandbox
    }
  };

  const handleProductAction = (planId: SubscriptionTier) => {
    cyberAudio.playChirp();
    if (planId === 'free') {
      setActiveProductId(null);
      navigateTo('app');
      return;
    }
    if (planId === 'lifetime') {
      setActiveProductId(null);
      setShowCheckout(true);
      return;
    }
    setActiveProductId(null);
    navigateTo('pricing');
  };

  if (showCheckout) {
    return (
      <CheckoutTerminal
        planName="JITALX FULL ACCESS"
        price="7.00"
        duration={
          locale === 'fr'
            ? 'PAIEMENT UNIQUE · ACCÈS À VIE'
            : 'ONE-TIME PAYMENT · LIFETIME ACCESS'
        }
        redirectUrl={GUMROAD_PRODUCT_URL}
        onClose={() => setShowCheckout(false)}
      />
    );
  }

  const shareOrigin = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
  const shareTextEncoded = encodeURIComponent(
    locale === 'fr'
      ? '10JITAL PROD — Ideas in Action. Kits studio, outils SaaS, apps et logiciel créateur JITALX.'
      : '10JITAL PROD — Ideas in Action. Studio kits, SaaS tools, apps & JITALX creator software.'
  );

  const trustIcons = [
    <ShieldCheck key="shield" className="w-5 h-5 text-[#00f0ff]" />,
    <Lock key="lock" className="w-5 h-5 text-[#ff7b00]" />,
    <Layers key="layers" className="w-5 h-5 text-[#ff2a85]" />,
    <Globe key="globe" className="w-5 h-5 text-emerald-400" />,
  ];

  return (
    <div className="min-h-screen bg-[#0a0910] text-slate-100 flex flex-col font-sans selection:bg-[#ff2a85]/30 selection:text-[#00f0ff] overflow-x-hidden">
      <CommercialNav activeRoute="landing" onNavigate={navigateTo} />

      <main className="flex-1">
        {/* ================================================================= */}
        {/* 1. HERO SECTION — 10JITAL PROD                                    */}
        {/* ================================================================= */}
        <section className="relative border-b border-white/[0.08] overflow-hidden">
          {/* Controlled ambient studio gradient */}
          <div
            className="absolute -top-24 left-1/4 w-[520px] h-[520px] rounded-full blur-[150px] pointer-events-none opacity-45"
            style={{
              background:
                'radial-gradient(circle, rgba(255,42,133,0.28) 0%, rgba(255,123,0,0.12) 45%, transparent 72%)',
            }}
          />
          <div
            className="absolute -bottom-32 right-0 w-[480px] h-[480px] rounded-full blur-[150px] pointer-events-none opacity-40"
            style={{
              background:
                'radial-gradient(circle, rgba(0,240,255,0.22) 0%, rgba(18,4,40,0.1) 55%, transparent 75%)',
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              {/* Left Column: Positioning & Primary Action */}
              <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-mono-code tracking-[0.16em] uppercase text-[#00f0ff]">
                    {t.hero.kicker}
                  </p>
                  <LanguageSwitcher />
                </div>

                <h1
                  className="font-hud font-bold text-white leading-[1.05] tracking-tight"
                  style={{
                    fontSize: 'clamp(2.45rem, 4.6vw, 4.1rem)',
                    textWrap: 'balance',
                  }}
                >
                  {t.hero.headline}
                </h1>

                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
                  {t.hero.description}
                </p>

                {/* Primary & Secondary CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                  <button
                    type="button"
                    onClick={() => scrollToSection('catalog')}
                    className="px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#ff2a85] via-[#ff5c4d] to-[#ff7b00] hover:brightness-110 text-white font-semibold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_12px_32px_-8px_rgba(255,42,133,0.55)] whitespace-nowrap"
                  >
                    <span>{t.hero.primaryCta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToSection('studio')}
                    className="px-6 py-3.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.09] border border-white/15 text-slate-100 font-semibold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <span>{t.hero.secondaryCta}</span>
                  </button>
                </div>

                {/* Clean unboxed verifiable highlights */}
                <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-400">
                  <span className="text-slate-200">{t.hero.trustItems[0]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t.hero.trustItems[1]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t.hero.trustItems[2]}</span>
                  <span aria-hidden="true">·</span>
                  <button
                    type="button"
                    onClick={() => void handleShare()}
                    className="inline-flex items-center gap-1.5 text-[#00f0ff] hover:text-white transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{shareCopied ? t.hero.copiedLabel : t.hero.shareLabel}</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Editorial Studio Visual Anchor */}
              <div className="lg:col-span-6 flex">
                <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#120d1d] min-h-[300px] sm:min-h-[380px] lg:h-full flex flex-col justify-end">
                  {!heroImgFailed ? (
                    <img
                      src={heroStudioImg}
                      alt="10JITAL PROD dark architectural software design studio"
                      referrerPolicy="no-referrer"
                      loading="eager"
                      onError={() => setHeroImgFailed(true)}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1b0838] via-[#120428] to-[#0a0910] flex items-center justify-center">
                      <Globe className="w-16 h-16 text-[#00f0ff]/40" />
                    </div>
                  )}

                  {/* Measured contrast scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0910]/95 via-[#0a0910]/35 to-transparent pointer-events-none" />

                  <div className="relative z-10 p-6 sm:p-7 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-mono-code text-[#00f0ff] uppercase tracking-wider">
                        {t.hero.flagshipKicker}
                      </p>
                      <h2 className="font-hud font-bold text-xl sm:text-2xl text-white">
                        {t.hero.flagshipTitle}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-md">
                        {t.hero.flagshipDesc}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        cyberAudio.playTargetAcquired();
                        navigateTo('demo');
                      }}
                      className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0 self-start sm:self-end"
                    >
                      <span>{t.hero.tryDemoCta}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. PRODUCT CATALOG (REAL ACTIVE RECORDS ONLY)                     */}
        {/* ================================================================= */}
        <section id="catalog" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl space-y-2.5">
              <p className="text-xs font-mono-code text-[#ff7b00] uppercase tracking-[0.14em]">
                {t.catalog.kicker}
              </p>
              <h2
                className="font-hud font-bold text-3xl sm:text-4xl text-white tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                {t.catalog.heading}
              </h2>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                {t.catalog.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigateTo('pricing')}
              className="text-sm font-medium text-[#00f0ff] hover:text-white inline-flex items-center gap-1.5 cursor-pointer self-start lg:self-auto whitespace-nowrap transition-colors"
            >
              <span>{t.catalog.comparePlansCta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Category Filter Bar */}
          <div
            role="tablist"
            aria-label="Product categories"
            className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-8 border-b border-white/[0.08]"
          >
            {CATALOG_CATEGORY_IDS.map((categoryId) => {
              const isSelected = selectedCategory === categoryId;
              return (
                <button
                  key={categoryId}
                  role="tab"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => {
                    cyberAudio.playClick();
                    setSelectedCategory(categoryId);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-white text-[#0a0910] font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {t.catalog.categories[categoryId]}
                </button>
              );
            })}
          </div>

          {/* Catalog Grid or Honest Empty State */}
          {filteredCatalog.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#110e1c] p-10 sm:p-12 text-center space-y-4">
              <Layers className="w-9 h-9 text-[#00f0ff]/75 mx-auto" />
              <div className="space-y-1.5 max-w-lg mx-auto">
                <h3 className="font-hud font-bold text-xl text-white">
                  {t.catalog.emptyTitle}: {t.catalog.categories[selectedCategory]}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {t.catalog.emptyDescription}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="px-4 py-2.5 rounded-lg bg-white text-[#0a0910] hover:bg-[#00f0ff] text-xs font-semibold cursor-pointer transition-colors"
                >
                  {t.catalog.emptyViewAll}
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('streamers')}
                  className="px-4 py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
                >
                  {t.catalog.emptyAction}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCatalog.map((item) => {
                const isFeatured = item.plan.id === 'lifetime';
                const imgBroken = failedProductImages[item.plan.id];
                const stripeReady = isStripePlanReady(item.plan.id);

                return (
                  <article
                    key={item.plan.id}
                    className={`group rounded-2xl overflow-hidden border transition-all duration-200 flex flex-col justify-between bg-[#110e1c] ${
                      isFeatured
                        ? 'border-[#ff2a85]/55 hover:border-[#00f0ff]/70'
                        : 'border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div>
                      {/* Product Preview Media */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0a0812] border-b border-white/[0.06]">
                        {!imgBroken ? (
                          <img
                            src={item.image}
                            alt={item.imageAlt}
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            onError={() =>
                              setFailedProductImages((prev) => ({ ...prev, [item.plan.id]: true }))
                            }
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#1b0838] to-[#0a0910] flex flex-col items-center justify-center gap-2 text-slate-400">
                            <Layers className="w-8 h-8 text-[#00f0ff]" />
                            <span className="text-xs font-mono-code">{item.title}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#110e1c]/80 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* Product Copy & Unboxed Metadata */}
                      <div className="p-6 space-y-3">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono-code">
                          <span className={isFeatured ? 'text-[#ff7b00] font-semibold' : 'text-[#00f0ff]'}>
                            {item.statusLabel}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{item.categoryLabel}</span>
                        </div>

                        <div className="flex items-baseline justify-between gap-4">
                          <h3 className="font-hud font-bold text-xl sm:text-2xl text-white">
                            {item.title}
                          </h3>
                          <div className="text-right shrink-0">
                            <div className="font-mono-code font-bold text-xl text-white tabular-nums">
                              {item.priceText}
                            </div>
                            <div className="text-[11px] font-mono-code text-slate-400">
                              {item.currencyNote}
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-slate-300 leading-relaxed">
                          {item.shortDescription}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 pb-6 pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          cyberAudio.playClick();
                          setActiveProductId(item.plan.id);
                        }}
                        className="text-xs font-semibold text-slate-200 hover:text-[#00f0ff] transition-colors cursor-pointer"
                      >
                        {t.catalog.viewDetails} →
                      </button>

                      {item.plan.id === 'lifetime' ? (
                        <button
                          type="button"
                          onClick={() => handleProductAction('lifetime')}
                          className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] hover:brightness-110 text-white text-xs font-semibold tracking-wide inline-flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap"
                        >
                          <span>{t.catalog.buyOnGumroad}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : item.plan.id === 'free' ? (
                        <button
                          type="button"
                          onClick={() => handleProductAction('free')}
                          className="px-4 py-2.5 rounded-lg bg-white text-[#0a0910] hover:bg-[#00f0ff] text-xs font-semibold tracking-wide inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
                        >
                          <span>{t.catalog.openFreeApp}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleProductAction(item.plan.id)}
                          className="px-4 py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
                        >
                          <span>{stripeReady ? t.catalog.continueStripe : t.catalog.comingSoonStripe}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* ================================================================= */}
        {/* 3. DISCOVER 10JITALX — STUDIO CRAFT & INTERACTIVE SHOWCASE        */}
        {/* ================================================================= */}
        <section
          id="studio"
          className="border-y border-white/[0.08] bg-[#0e0c17] py-16 lg:py-24 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto space-y-14">
            {/* Editorial Split: Studio Capabilities + Photography */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-mono-code text-[#00f0ff] uppercase tracking-[0.14em]">
                    {t.studio.kicker}
                  </p>
                  <h2
                    className="font-hud font-bold text-3xl sm:text-4xl text-white tracking-tight"
                    style={{ textWrap: 'balance' }}
                  >
                    {t.studio.heading}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                    {t.studio.subtitle}
                  </p>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[16/10] bg-[#120d1d]">
                  {!craftImgFailed ? (
                    <img
                      src={studioCraftImg}
                      alt="10JITAL PROD product design system and engineering craft"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={() => setCraftImgFailed(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1b0838] to-[#0a0910] flex items-center justify-center">
                      <SlidersHorizontal className="w-10 h-10 text-[#00f0ff]/60" />
                    </div>
                  )}
                </div>
              </div>

              {/* Numbered Studio Disciplines */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {t.studio.pillars.map((pillar) => (
                  <div
                    key={pillar.index}
                    className="rounded-xl border border-white/10 bg-[#120f1e] p-6 flex flex-col justify-between space-y-4 hover:border-white/20 transition-colors"
                  >
                    <span className="font-mono-code text-xs text-slate-500">{pillar.index}.</span>
                    <div className="space-y-2">
                      <h3 className="font-hud font-bold text-lg text-white">{pillar.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{pillar.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preserved Interactive Studio Widget & Direct Product Pathways */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-6 border-t border-white/[0.08]">
              <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-[#120f1e] p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-mono-code text-[#ff7b00] uppercase tracking-wider">
                    {t.studio.previewKicker}
                  </p>
                  <h3 className="font-hud font-bold text-2xl sm:text-3xl text-white">
                    {t.studio.previewHeading}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {t.studio.previewDesc}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                  <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/[0.07] flex items-center gap-2.5">
                    <Radio className="w-4 h-4 text-[#00f0ff] shrink-0" />
                    <span>{t.studio.previewFeat1}</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/[0.07] flex items-center gap-2.5">
                    <Video className="w-4 h-4 text-[#ff2a85] shrink-0" />
                    <span>{t.studio.previewFeat2}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      cyberAudio.playTargetAcquired();
                      navigateTo('app');
                    }}
                    className="px-5 py-3 rounded-lg bg-white text-[#0a0910] hover:bg-[#00f0ff] text-xs font-semibold tracking-wide inline-flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <span>{t.studio.launchWorkspace}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      cyberAudio.playChirp();
                      navigateTo('overlay');
                    }}
                    className="px-5 py-3 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-slate-100 text-xs font-semibold tracking-wide inline-flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Video className="w-3.5 h-3.5 text-[#ff2a85]" />
                    <span>{t.studio.openObsStudio}</span>
                  </button>
                </div>
              </div>

              {/* Preserved Interactive Vehicle Tuning Gauge Demo */}
              <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-[#120f1e] p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div>
                    <span className="text-[11px] font-mono-code text-[#00f0ff] uppercase tracking-wider">
                      {t.studio.widgetKicker}
                    </span>
                    <h3 className="font-hud font-bold text-xl text-white mt-0.5">SOLARIS APEX GT</h3>
                  </div>
                  <span className="text-xs font-mono-code text-slate-400">{t.studio.widgetTag}</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center text-xs font-mono-code mb-1.5">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Gauge className="w-3.5 h-3.5 text-[#00f0ff]" />
                        {t.studio.speedLabel}
                      </span>
                      <span className="text-[#00f0ff] font-semibold tabular-nums">
                        {currentSpeed} / 100
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-black/50 overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-[#ff2a85] to-[#00f0ff] transition-all duration-150"
                        style={{ width: `${currentSpeed}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-mono-code mb-1.5">
                      <span className="text-slate-300 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-[#ff7b00]" />
                        {t.studio.armorLabel}
                      </span>
                      <span className="text-[#ff7b00] font-semibold tabular-nums">
                        {currentArmor} / 100
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-black/50 overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-[#ff7b00] to-[#ff2a85] transition-all duration-150"
                        style={{ width: `${currentArmor}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-black/35 border border-white/[0.08] space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono-code">
                      <label htmlFor="studio-tuning-slider" className="text-slate-200 flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-[#ff7b00]" />
                        <span>{t.studio.sliderLabel}</span>
                      </label>
                      <span className="text-white font-semibold tabular-nums">{tuningLevel}%</span>
                    </div>
                    <input
                      id="studio-tuning-slider"
                      type="range"
                      min="0"
                      max="100"
                      value={tuningLevel}
                      onChange={handleSliderChange}
                      className="w-full h-2 rounded-lg bg-white/10 accent-[#ff2a85] cursor-pointer"
                    />
                  </div>
                </div>

                {isMaxTuning ? (
                  <button
                    type="button"
                    onClick={() => handleProductAction('lifetime')}
                    className="w-full py-3.5 px-4 rounded-lg bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] hover:brightness-110 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>{t.studio.unlockCta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs font-mono-code text-slate-400">
                    <span className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-[#ff2a85]" />
                      {t.studio.lockedHint}
                    </span>
                    <span className="text-[#00f0ff] tabular-nums">{tuningLevel}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. VERIFIABLE TRUST & GLOBAL SHARING                              */}
        {/* ================================================================= */}
        <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-mono-code text-[#00f0ff] uppercase tracking-[0.14em]">
                {t.trust.kicker}
              </p>
              <h2 className="font-hud font-bold text-2xl sm:text-3xl text-white">
                {t.trust.heading}
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">{t.trust.subtitle}</p>
            </div>

            {/* Social Sharing Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => void handleShare()}
                className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-xs font-medium text-slate-200 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span>{shareCopied ? t.trust.linkCopied : t.trust.copyLink}</span>
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${shareTextEncoded}&url=${shareOrigin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-xs font-medium text-slate-200 inline-flex items-center gap-1.5 transition-colors"
              >
                <span>{t.trust.shareX}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareOrigin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-xs font-medium text-slate-200 inline-flex items-center gap-1.5 transition-colors"
              >
                <span>{t.trust.shareLinkedIn}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {t.trust.cards.map((card, idx) => (
              <div
                key={card.title}
                className="rounded-xl border border-white/10 bg-[#110e1c] p-5 space-y-2"
              >
                {trustIcons[idx]}
                <h3 className="font-hud font-bold text-base text-white">{card.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>

          {/* Official Discord Community Banner */}
          <div className="rounded-2xl border border-[#5865F2]/40 bg-gradient-to-r from-[#5865F2]/15 via-[#120e24] to-[#110e1c] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4 max-w-2xl">
              <div className="w-11 h-11 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/50 flex items-center justify-center shrink-0">
                <DiscordIcon className="w-6 h-6 text-[#8c96ff]" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-mono-code uppercase tracking-[0.14em] text-[#8c96ff]">
                  {t.trust.communityKicker}
                </p>
                <h3 className="font-hud font-bold text-xl text-white">
                  {t.trust.communityTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {t.trust.communityDesc}
                </p>
              </div>
            </div>

            <a
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => cyberAudio.playChirp()}
              className="px-5 py-3 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs sm:text-sm font-semibold tracking-wide inline-flex items-center gap-2 transition-colors shadow-[0_10px_28px_-8px_rgba(88,101,242,0.65)] whitespace-nowrap shrink-0"
            >
              <DiscordIcon className="w-4 h-4" />
              <span>{t.trust.joinDiscordCta}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </section>
      </main>

      {/* ================================================================= */}
      {/* PRODUCT DETAIL MODAL (DISCOVERY -> DETAILS -> CHECKOUT)           */}
      {/* ================================================================= */}
      {activeProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-detail-title"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-[#120e1e] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="text-xs font-mono-code text-[#00f0ff]">
                {activeProduct.statusLabel} · {activeProduct.categoryLabel}
              </div>
              <button
                type="button"
                onClick={() => setActiveProductId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                aria-label="Close product details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <h2 id="product-detail-title" className="font-hud font-bold text-2xl text-white">
                  {activeProduct.title}
                </h2>
                <div className="font-mono-code text-2xl font-bold text-[#00f0ff] tabular-nums">
                  {activeProduct.priceText}{' '}
                  <span className="text-xs text-slate-400 font-normal">
                    {activeProduct.currencyNote}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {activeProduct.shortDescription}
              </p>

              <div className="space-y-2.5 pt-2 border-t border-white/10">
                <h3 className="text-xs font-mono-code uppercase tracking-wider text-slate-400">
                  {t.catalog.includedHeading}
                </h3>
                <ul className="space-y-2.5 text-sm text-slate-200">
                  {activeProduct.highlights.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/10 bg-[#0d0a16] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => void handleShare(`10JITALX — ${activeProduct.title}`)}
                className="px-3.5 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-slate-200 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span>{shareCopied ? t.hero.copiedLabel : t.catalog.shareProduct}</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveProductId(null);
                    navigateTo('demo');
                  }}
                  className="px-4 py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-xs font-semibold text-slate-200 cursor-pointer"
                >
                  {t.catalog.interactiveDemo}
                </button>
                <button
                  type="button"
                  onClick={() => handleProductAction(activeProduct.plan.id)}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] hover:brightness-110 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>
                    {activeProduct.plan.id === 'lifetime'
                      ? t.catalog.proceedCheckout
                      : activeProduct.plan.id === 'free'
                      ? t.catalog.launchFreeApp
                      : t.catalog.viewPlanDetails}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* QUIET GLOBAL FOOTER                                               */}
      {/* ================================================================= */}
      <footer className="border-t border-white/[0.08] bg-[#08070d] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="font-hud font-bold text-base tracking-[0.14em] text-white">
                10JITALX
              </span>
              <LanguageSwitcher />
            </div>
            <p className="text-xs text-slate-400">{t.footer.copyright}</p>
            <p className="text-[11px] text-slate-500">{t.footer.disclaimer}</p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-slate-400">
            <button
              type="button"
              onClick={() => scrollToSection('catalog')}
              className="hover:text-white cursor-pointer"
            >
              {t.footer.products}
            </button>
            <button
              type="button"
              onClick={() => navigateTo('demo')}
              className="hover:text-white cursor-pointer"
            >
              {t.footer.demo}
            </button>
            <button
              type="button"
              onClick={() => navigateTo('pricing')}
              className="hover:text-white cursor-pointer"
            >
              {t.footer.pricing}
            </button>
            <button
              type="button"
              onClick={() => navigateTo('streamers')}
              className="hover:text-white cursor-pointer"
            >
              {t.footer.creators}
            </button>
            <button
              type="button"
              onClick={() => navigateTo('overlay')}
              className="hover:text-white cursor-pointer"
            >
              {t.footer.obsStudio}
            </button>
            <button
              type="button"
              onClick={() => navigateTo('account')}
              className="hover:text-white cursor-pointer"
            >
              {t.footer.account}
            </button>
            <a
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#8c96ff] hover:text-white transition-colors"
            >
              <DiscordIcon className="w-3.5 h-3.5" />
              <span>{t.footer.discord}</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
