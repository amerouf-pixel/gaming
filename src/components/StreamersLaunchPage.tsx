import React, { useState, useEffect } from 'react';
import { AppRoute, InquiryPlatform, InquiryType } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLocale, LanguageSwitcher } from '../context/LocaleContext';
import { STRIPE_CONFIG } from '../services/stripeConfig';
import { cyberAudio } from '../utils/cyberAudio';
import { CommercialNav } from './CommercialNav';
import {
  Video,
  Monitor,
  Smartphone,
  Compass,
  Layers,
  Clock,
  ArrowRight,
  Mail,
  CheckCircle2,
  Handshake,
  ShieldCheck,
  Send,
} from 'lucide-react';

interface StreamersLaunchPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const StreamersLaunchPage: React.FC<StreamersLaunchPageProps> = ({ onNavigate }) => {
  const { user, signInWithGoogle, submitCreatorInquiry } = useAuth();
  const { copy } = useLocale();
  const t = copy.streamers;

  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [channelUrl, setChannelUrl] = useState('');
  const [platform, setPlatform] = useState<InquiryPlatform>('twitch');
  const [inquiryType, setInquiryType] = useState<InquiryType>('creator_partnership');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Sync name & email automatically when a visitor signs in with Google on this page
  useEffect(() => {
    if (!user) return;
    setName((prev) => (prev.trim() ? prev : user.displayName || ''));
    setEmail((prev) => (prev.trim() ? prev : user.email || ''));
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    if (name.trim().length < 2) {
      setFormFeedback({ type: 'error', text: t.errName });
      return;
    }
    if (!email.includes('@') || email.trim().length < 5) {
      setFormFeedback({ type: 'error', text: t.errEmail });
      return;
    }
    if (message.trim().length < 10) {
      setFormFeedback({ type: 'error', text: t.errMessage });
      return;
    }

    if (!user) {
      setFormFeedback({ type: 'error', text: t.errSignInRequired });
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitCreatorInquiry({
        name: name.trim(),
        email: email.trim(),
        channelUrl: channelUrl.trim(),
        platform,
        inquiryType,
        message: message.trim(),
      });

      if (result.ok) {
        cyberAudio.playFanfare();
        setFormFeedback({
          type: 'success',
          text: t.successRecorded
            .replace('{id}', result.id || '')
            .replace('{email}', email.trim()),
        });
        setMessage('');
        setChannelUrl('');
      } else {
        setFormFeedback({ type: 'error', text: result.error || t.errSubmitFailed });
      }
    } catch {
      setFormFeedback({ type: 'error', text: t.errSaveCatch });
    } finally {
      setSubmitting(false);
    }
  };

  const mailtoHref = `mailto:${STRIPE_CONFIG.contactEmail}?subject=${encodeURIComponent(
    `[JITALX Creator Inquiry] ${inquiryType} - ${name || 'Streamer'}`
  )}&body=${encodeURIComponent(
    `Name / Handle: ${name}\nPlatform: ${platform}\nChannel URL: ${channelUrl}\n\nMessage:\n${message}`
  )}`;

  const archIcons = [
    <Monitor key="mon" className="w-5 h-5 text-[#00f0ff] shrink-0 mt-0.5" />,
    <Smartphone key="phone" className="w-5 h-5 text-[#ff2a85] shrink-0 mt-0.5" />,
    <Layers key="layers" className="w-5 h-5 text-[#ff7b00] shrink-0 mt-0.5" />,
  ];

  const whyIcons = [
    <Compass key="comp" className="w-6 h-6 text-[#00f0ff]" />,
    <Clock key="clock" className="w-6 h-6 text-[#ff7b00]" />,
    <Video key="vid" className="w-6 h-6 text-[#ff2a85]" />,
  ];

  const inputClass =
    'w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#00f0ff] focus:outline-none transition-colors';

  return (
    <div className="min-h-screen bg-[#0a0910] text-slate-100 flex flex-col font-sans overflow-x-hidden">
      <CommercialNav activeRoute="streamers" onNavigate={onNavigate} />

      <main className="flex-1">
        {/* 1. HERO */}
        <section className="relative overflow-hidden border-b border-white/[0.08]">
          <div className="absolute -top-24 right-0 w-[460px] h-[460px] bg-[#ff2a85]/14 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute -bottom-24 left-10 w-[380px] h-[380px] bg-[#00f0ff]/12 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xs font-mono-code text-[#00f0ff] uppercase tracking-[0.14em]">
                  {t.kicker}
                </p>
                <LanguageSwitcher />
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-hud font-bold text-white leading-[1.06] tracking-tight max-w-2xl"
                style={{ textWrap: 'balance' }}
              >
                {t.headlinePrefix}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#00f0ff]">
                  {t.headlineAccent}
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                {t.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    cyberAudio.playTargetAcquired();
                    onNavigate('app');
                  }}
                  className="px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#ff2a85] via-[#ff5c4d] to-[#ff7b00] hover:brightness-110 text-white font-semibold text-sm tracking-wide flex items-center gap-2 cursor-pointer shadow-[0_10px_30px_-8px_rgba(255,42,133,0.5)] transition-all"
                >
                  <span>{t.tryFreeCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    cyberAudio.playChirp();
                    onNavigate('overlay');
                  }}
                  className="px-5 py-3.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-slate-100 font-semibold text-sm tracking-wide flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Video className="w-4 h-4 text-[#00f0ff]" />
                  <span>{t.openStudioCta}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono-code text-slate-400 pt-1">
                <span>{t.trustItems[0]}</span>
                <span aria-hidden="true">·</span>
                <span>{t.trustItems[1]}</span>
                <span aria-hidden="true">·</span>
                <span>{t.trustItems[2]}</span>
              </div>
            </div>

            {/* Right Column: Live Broadcast Architecture Preview Card */}
            <div className="lg:col-span-5 rounded-2xl bg-[#110e1c] border border-white/10 p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
                <span className="text-xs font-mono-code text-[#00f0ff] uppercase tracking-wider">
                  {t.archTitle}
                </span>
                <span className="text-xs font-mono-code text-[#ff7b00] font-semibold">
                  {t.archTag}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                {t.archCards.map((card, idx) => (
                  <div
                    key={card.title}
                    className="p-3.5 rounded-xl bg-black/35 border border-white/[0.08] flex items-start gap-3"
                  >
                    {archIcons[idx]}
                    <div>
                      <div className="font-hud font-bold text-white">{card.title}</div>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. STREAMER ADVANTAGES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
          <div className="max-w-2xl space-y-2.5">
            <div className="text-xs font-mono-code text-[#ff7b00] uppercase tracking-[0.14em]">
              {t.whyKicker}
            </div>
            <h2 className="text-3xl font-hud font-bold text-white tracking-tight">
              {t.whyHeading}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">{t.whySubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.whyCards.map((card, idx) => (
              <div
                key={card.title}
                className="rounded-2xl bg-[#110e1c] border border-white/10 p-6 space-y-3 hover:border-white/20 transition-colors"
              >
                {whyIcons[idx]}
                <h3 className="font-hud font-bold text-lg text-white">{card.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. CREATOR & PARTNERSHIP PROGRAM + CONTACT FORM */}
        <section className="border-y border-white/[0.08] bg-[#0e0c17]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono-code text-[#00f0ff] uppercase tracking-[0.14em]">
                <Handshake className="w-4 h-4 text-[#ff2a85]" />
                <span>{t.partnerKicker}</span>
              </div>
              <h2 className="text-3xl font-hud font-bold text-white tracking-tight">
                {t.partnerHeading}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">{t.partnerDesc}</p>

              <div className="space-y-3 pt-2 text-sm text-slate-200">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00f0ff] shrink-0 mt-1" />
                  <span>{t.partnerBullets[0]}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#ff2a85] shrink-0 mt-1" />
                  <span>{t.partnerBullets[1]}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#ff7b00] shrink-0 mt-1" />
                  <span>{t.partnerBullets[2]}</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    cyberAudio.playClick();
                    onNavigate('app');
                  }}
                  className="px-5 py-2.5 rounded-lg bg-[#00f0ff]/12 hover:bg-[#00f0ff]/22 border border-[#00f0ff]/50 text-[#00f0ff] font-semibold text-xs uppercase tracking-wider cursor-pointer transition-colors"
                >
                  {t.tryFreeFirstCta} →
                </button>
              </div>
            </div>

            {/* 4. CONTACT FORM */}
            <div className="lg:col-span-7 rounded-2xl bg-[#110e1c] border border-white/10 p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
                <div>
                  <h3 className="font-hud font-bold text-xl text-white">{t.contactTitle}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{t.contactSubtitle}</p>
                </div>
                {!user && (
                  <button
                    type="button"
                    onClick={() => void signInWithGoogle()}
                    className="px-3.5 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-[#00f0ff]/45 text-[#00f0ff] text-xs font-mono-code cursor-pointer transition-colors"
                  >
                    {t.signInGoogleBtn}
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="creator-name" className="text-xs font-mono-code text-slate-300 block">
                      {t.nameLabel}
                    </label>
                    <input
                      id="creator-name"
                      type="text"
                      required
                      maxLength={80}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.namePlaceholder}
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="creator-email" className="text-xs font-mono-code text-slate-300 block">
                      {t.emailLabel}
                    </label>
                    <input
                      id="creator-email"
                      type="email"
                      required
                      maxLength={160}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="creator-platform" className="text-xs font-mono-code text-slate-300 block">
                      {t.platformLabel}
                    </label>
                    <select
                      id="creator-platform"
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as InquiryPlatform)}
                      className={inputClass}
                    >
                      <option value="twitch">Twitch</option>
                      <option value="youtube">YouTube</option>
                      <option value="tiktok">TikTok Live</option>
                      <option value="kick">Kick</option>
                      <option value="agency">{t.platformAgency}</option>
                      <option value="other">{t.platformOther}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="creator-type" className="text-xs font-mono-code text-slate-300 block">
                      {t.inquiryTypeLabel}
                    </label>
                    <select
                      id="creator-type"
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value as InquiryType)}
                      className={inputClass}
                    >
                      <option value="creator_partnership">
                        {t.inquiryTypes.creator_partnership}
                      </option>
                      <option value="streamer_access">{t.inquiryTypes.streamer_access}</option>
                      <option value="press_media">{t.inquiryTypes.press_media}</option>
                      <option value="commercial">{t.inquiryTypes.commercial}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="creator-url" className="text-xs font-mono-code text-slate-300 block">
                      {t.channelUrlLabel}
                    </label>
                    <input
                      id="creator-url"
                      type="url"
                      maxLength={240}
                      value={channelUrl}
                      onChange={(e) => setChannelUrl(e.target.value)}
                      placeholder="https://twitch.tv/..."
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="creator-message" className="text-xs font-mono-code text-slate-300 block">
                    {t.messageLabel}
                  </label>
                  <textarea
                    id="creator-message"
                    rows={4}
                    required
                    minLength={10}
                    maxLength={1500}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.messagePlaceholder}
                    className={`${inputClass} resize-y`}
                  />
                </div>

                {formFeedback && (
                  <div
                    className={`p-3 rounded-lg text-xs font-mono-code border ${
                      formFeedback.type === 'success'
                        ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-300'
                        : 'bg-rose-950/50 border-rose-500/60 text-rose-200'
                    }`}
                  >
                    {formFeedback.text}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-[#00f0ff] shrink-0" />
                    <span>
                      {user ? `${t.verifiedAccountPrefix} ${user.email}` : t.signInHint}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <a
                      href={mailtoHref}
                      className="px-4 py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-[#00f0ff] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{t.directEmailBtn}</span>
                    </a>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#ff2a85] via-[#ff5c4d] to-[#ff7b00] hover:brightness-110 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submitting ? t.submittingBtn : t.submitBtn}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.08] bg-[#08070d] py-8 px-4 text-center text-xs font-mono-code text-slate-400 space-y-1.5">
        <p>{copy.footer.copyright}</p>
        <p className="text-[11px] text-slate-500">{t.footerDisclaimer}</p>
      </footer>
    </div>
  );
};
