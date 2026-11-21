import React, { useState } from 'react';
import { AppRoute, InquiryPlatform, InquiryType } from '../types';
import { useAuth } from '../context/AuthContext';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    if (name.trim().length < 2) {
      setFormFeedback({ type: 'error', text: 'Please enter your name or creator handle (at least 2 characters).' });
      return;
    }
    if (!email.includes('@') || email.trim().length < 5) {
      setFormFeedback({ type: 'error', text: 'Please enter a valid contact email address.' });
      return;
    }
    if (message.trim().length < 10) {
      setFormFeedback({ type: 'error', text: 'Please share a brief message (at least 10 characters).' });
      return;
    }

    if (!user) {
      setFormFeedback({
        type: 'error',
        text: 'Sign in with Google to submit directly into our verified creator queue, or use the direct email button below.',
      });
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
          text: `Your inquiry (${result.id}) has been securely recorded. Our team at 10JITAL Production will reply to ${email.trim()}.`,
        });
        setMessage('');
        setChannelUrl('');
      } else {
        setFormFeedback({ type: 'error', text: result.error || 'Submission failed.' });
      }
    } catch {
      setFormFeedback({
        type: 'error',
        text: 'Could not save inquiry right now. You can send it directly via email using the button below.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const mailtoHref = `mailto:${STRIPE_CONFIG.contactEmail}?subject=${encodeURIComponent(
    `[JITALX Creator Inquiry] ${inquiryType} - ${name || 'Streamer'}`
  )}&body=${encodeURIComponent(
    `Name / Handle: ${name}\nPlatform: ${platform}\nChannel URL: ${channelUrl}\n\nMessage:\n${message}`
  )}`;

  return (
    <div className="min-h-screen bg-[#120428] text-slate-100 flex flex-col">
      <CommercialNav activeRoute="streamers" onNavigate={onNavigate} language="en" />

      <main className="flex-1">
        {/* ================================================================= */}
        {/* 1. HERO — INTERNATIONAL GTA 6 STREAMER LAUNCH                     */}
        {/* ================================================================= */}
        <section className="relative overflow-hidden border-b border-[#ff2a85]/25">
          <div className="absolute top-0 right-0 w-[460px] h-[460px] bg-[#ff2a85]/16 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-[380px] h-[380px] bg-[#00f0ff]/12 rounded-full blur-[130px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="text-xs font-mono-code text-[#00f0ff] uppercase tracking-widest">
                JITALX · THE STREAMER COMMAND HUB · Independent Open-World Overlay Suite
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-hud font-bold text-white leading-[1.08] max-w-2xl">
                Turn your open-world marathon into a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#00f0ff]">
                  live tactical broadcast
                </span>
              </h1>

              <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl">
                JITALX pairs a customizable second-screen mission tracker with a built-in OBS and
                TikTok Live Studio overlay. Built for upcoming open-world marathons (including
                community GTA VI streams once released) using your own custom checklists or our
                editable fictional demo presets.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    cyberAudio.playTargetAcquired();
                    onNavigate('app');
                  }}
                  className="px-7 py-4 bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#ff2a85] hover:brightness-110 text-white font-hud font-bold text-sm uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-[0_0_28px_rgba(255,42,133,0.5)] transition-all"
                >
                  <span>Try JITALX Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    cyberAudio.playChirp();
                    onNavigate('overlay');
                  }}
                  className="px-6 py-4 bg-[#1b0838] hover:bg-[#2a0c54] border border-[#00f0ff]/55 text-[#00f0ff] font-hud font-bold text-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Video className="w-4 h-4" />
                  <span>Open OBS Overlay Studio</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono-code text-slate-400 pt-2">
                <span>OBS Browser Source Ready</span>
                <span aria-hidden="true">·</span>
                <span>1920x1080 Landscape &amp; 9:16 Vertical</span>
                <span aria-hidden="true">·</span>
                <span>No Credit Card Required</span>
              </div>
            </div>

            {/* Right Column: Live Broadcast Architecture Preview Card */}
            <div className="lg:col-span-5 bg-[#180633] border border-[#ff2a85]/45 p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#ff2a85]/25 pb-3">
                <span className="text-xs font-mono-code text-[#00f0ff] uppercase tracking-wider">
                  Stream Output Architecture
                </span>
                <span className="text-xs font-mono-code text-[#ff7b00] font-semibold">
                  OBS + TikTok Live
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="p-3.5 bg-[#0e0320] border border-[#ff2a85]/25 flex items-start gap-3">
                  <Monitor className="w-5 h-5 text-[#00f0ff] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-hud font-bold text-white">16:9 Twitch &amp; YouTube Layout</div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Neon 16:9 webcam frame, synchronized 100% completion bar, active mission
                      tracker, and live stopwatch built for 1080p capture.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-[#0e0320] border border-[#ff2a85]/25 flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-[#ff2a85] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-hud font-bold text-white">9:16 TikTok Live Vertical Mode</div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      One-click vertical layout preset keeping your webcam, mission progress, and
                      timer crystal clear on mobile screens.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-[#0e0320] border border-[#ff2a85]/25 flex items-start gap-3">
                  <Layers className="w-5 h-5 text-[#ff7b00] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-hud font-bold text-white">3 Instant OBS Backdrop Modes</div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Switch between Transparent Browser Source, Chroma Key Green (#00ff00), and a
                      Sunset Néon &ldquo;Starting Soon&rdquo; waiting screen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. STREAMER ADVANTAGES                                            */}
        {/* ================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-mono-code text-[#ff7b00] uppercase tracking-widest">
              01. Why Creators Use JITALX
            </div>
            <h2 className="text-3xl font-hud font-bold text-white">
              Designed for high-retention open-world launch streams
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every module is engineered to reduce broadcast friction while giving viewers real-time
              context on your custom playthrough goals. Included universes are fictional, fully editable demo data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#180633] border border-[#ff2a85]/30 p-6 space-y-3">
              <Compass className="w-6 h-6 text-[#00f0ff]" />
              <h3 className="font-hud font-bold text-lg text-white">Live Mission &amp; Collectible Sync</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Check off mission steps, hidden collectibles, vehicles, or trophies on your second
                monitor and watch your live OBS HUD progress bar update immediately.
              </p>
            </div>

            <div className="bg-[#180633] border border-[#ff2a85]/30 p-6 space-y-3">
              <Clock className="w-6 h-6 text-[#ff7b00]" />
              <h3 className="font-hud font-bold text-lg text-white">Session Timer &amp; Challenge Counter</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Built-in Start/Pause/Reset marathon timer plus a live customizable challenge or
                attempt counter right inside the OBS overlay.
              </p>
            </div>

            <div className="bg-[#180633] border border-[#ff2a85]/30 p-6 space-y-3">
              <Video className="w-6 h-6 text-[#ff2a85]" />
              <h3 className="font-hud font-bold text-lg text-white">Clean Capture Mode (Key H)</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Press <code className="font-mono-code text-[#00f0ff]">H</code> or copy the direct
                OBS Browser Source URL to hide all editor controls and capture pure graphics.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 3. CREATOR & PARTNERSHIP PROGRAM (HONEST — ZERO FAKE PARTNERS)    */}
        {/* ================================================================= */}
        <section className="border-y border-[#ff2a85]/25 bg-[#15052e]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono-code text-[#00f0ff] uppercase tracking-widest">
                <Handshake className="w-4 h-4 text-[#ff2a85]" />
                <span>02. Creators &amp; Partnerships</span>
              </div>
              <h2 className="text-3xl font-hud font-bold text-white">
                Partner with JITALX for your next marathon
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                We are opening early creator collaborations for Twitch, YouTube, Kick, and TikTok
                Live broadcasters preparing story runs, 100% completion challenges, and community
                open-world events.
              </p>

              <div className="space-y-3 pt-2 text-sm text-slate-200">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00f0ff] shrink-0 mt-1" />
                  <span>Direct feedback channel with the JITALX engineering team for custom overlay widgets.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#ff2a85] shrink-0 mt-1" />
                  <span>Early access to upcoming creator overlay presets and multi-game profiles.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#ff7b00] shrink-0 mt-1" />
                  <span>Co-branded community giveaways and affiliate launch collaboration options.</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    cyberAudio.playClick();
                    onNavigate('app');
                  }}
                  className="px-5 py-3 bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 border border-[#00f0ff]/55 text-[#00f0ff] font-hud font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Try JITALX Free First →
                </button>
              </div>
            </div>

            {/* =============================================================== */}
            {/* 4. PROFESSIONAL CONTACT & PARTNERSHIP FORM                      */}
            {/* =============================================================== */}
            <div className="lg:col-span-7 bg-[#180633] border border-[#ff2a85]/40 p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ff2a85]/25 pb-4">
                <div>
                  <h3 className="font-hud font-bold text-xl text-white">
                    Creator &amp; Business Contact
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Reach 10JITAL Production for creator partnerships, press kits, or commercial licensing.
                  </p>
                </div>
                {!user && (
                  <button
                    type="button"
                    onClick={() => void signInWithGoogle()}
                    className="px-3 py-1.5 bg-[#0e0320] hover:bg-[#240a4a] border border-[#00f0ff]/50 text-[#00f0ff] text-xs font-mono-code cursor-pointer"
                  >
                    Sign in with Google
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="creator-name" className="text-xs font-mono-code text-slate-300 block">
                      Name or Creator Handle *
                    </label>
                    <input
                      id="creator-name"
                      type="text"
                      required
                      maxLength={80}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex / @AlexLive"
                      className="w-full bg-[#0e0320] border border-[#ff2a85]/35 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#00f0ff]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="creator-email" className="text-xs font-mono-code text-slate-300 block">
                      Business Email *
                    </label>
                    <input
                      id="creator-email"
                      type="email"
                      required
                      maxLength={160}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="creator@domain.com"
                      className="w-full bg-[#0e0320] border border-[#ff2a85]/35 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#00f0ff]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="creator-platform" className="text-xs font-mono-code text-slate-300 block">
                      Primary Platform
                    </label>
                    <select
                      id="creator-platform"
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as InquiryPlatform)}
                      className="w-full bg-[#0e0320] border border-[#ff2a85]/35 px-3 py-2.5 text-sm text-white focus:border-[#00f0ff]"
                    >
                      <option value="twitch">Twitch</option>
                      <option value="youtube">YouTube</option>
                      <option value="tiktok">TikTok Live</option>
                      <option value="kick">Kick</option>
                      <option value="agency">Talent Agency</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="creator-type" className="text-xs font-mono-code text-slate-300 block">
                      Inquiry Type
                    </label>
                    <select
                      id="creator-type"
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value as InquiryType)}
                      className="w-full bg-[#0e0320] border border-[#ff2a85]/35 px-3 py-2.5 text-sm text-white focus:border-[#00f0ff]"
                    >
                      <option value="creator_partnership">Creator Partnership</option>
                      <option value="streamer_access">Streamer Early Access</option>
                      <option value="press_media">Press &amp; Media</option>
                      <option value="commercial">Commercial / Licensing</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="creator-url" className="text-xs font-mono-code text-slate-300 block">
                      Channel URL (Optional)
                    </label>
                    <input
                      id="creator-url"
                      type="url"
                      maxLength={240}
                      value={channelUrl}
                      onChange={(e) => setChannelUrl(e.target.value)}
                      placeholder="https://twitch.tv/..."
                      className="w-full bg-[#0e0320] border border-[#ff2a85]/35 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#00f0ff]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="creator-message" className="text-xs font-mono-code text-slate-300 block">
                    Message &amp; Stream Setup Details *
                  </label>
                  <textarea
                    id="creator-message"
                    rows={4}
                    required
                    minLength={10}
                    maxLength={1500}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your channel, streaming format (16:9 / 9:16), or partnership goals..."
                    className="w-full bg-[#0e0320] border border-[#ff2a85]/35 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#00f0ff] resize-y"
                  />
                </div>

                {formFeedback && (
                  <div
                    className={`p-3 text-xs font-mono-code border ${
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
                    <ShieldCheck className="w-4 h-4 text-[#00f0ff]" />
                    <span>
                      {user
                        ? `Verified account: ${user.email}`
                        : 'Sign in to submit in-app, or email directly'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <a
                      href={mailtoHref}
                      className="px-4 py-2.5 bg-[#0e0320] hover:bg-[#240a4a] border border-[#00f0ff]/45 text-[#00f0ff] text-xs font-hud font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Direct Email</span>
                    </a>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] hover:brightness-110 text-white text-xs font-hud font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submitting ? 'Sending...' : 'Submit Inquiry'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#ff2a85]/25 bg-[#0e0320] py-8 px-4 text-center text-xs font-mono-code text-slate-400 space-y-1.5">
        <p>© 2026 10JITAL Production · JITALX · THE STREAMER COMMAND HUB</p>
        <p className="text-[11px] text-slate-500">
          JITALX is an independent streamer command hub and OBS overlay tool and is not affiliated with or endorsed by Rockstar Games or Take-Two Interactive.
        </p>
      </footer>
    </div>
  );
};
