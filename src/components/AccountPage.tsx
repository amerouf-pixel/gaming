import React, { useState, useEffect } from 'react';
import { AppRoute, GameProfile, PaymentBackendStatus, StreamPlatform, UniverseTheme } from '../types';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { useLocale, LanguageSwitcher } from '../context/LocaleContext';
import { INITIAL_PROFILES } from '../data/initialData';
import {
  buildGumroadCheckoutUrl,
  fetchPaymentBackendStatus,
  openStripeBillingPortal,
  STRIPE_CONFIG,
} from '../services/stripeConfig';
import { cyberAudio } from '../utils/cyberAudio';
import { CommercialNav } from './CommercialNav';
import {
  User,
  LogIn,
  LogOut,
  ShieldCheck,
  CloudUpload,
  CloudDownload,
  Trash2,
  Plus,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Gamepad2,
  ArrowRight,
  Save,
  ExternalLink,
  Pencil,
  Download,
  X,
} from 'lucide-react';

interface AccountPageProps {
  onNavigate: (route: AppRoute) => void;
}

interface ActionFeedback {
  type: 'success' | 'warning' | 'error';
  text: string;
  showJsonExportAction?: boolean;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
  const {
    user,
    account,
    isAuthReady,
    isSigningIn,
    authError,
    cloudError,
    clearCloudError,
    customProfiles,
    cloudSnapshots,
    getIdToken,
    signInWithGoogle,
    signOut,
    updateAccountProfile,
    createCustomProfile,
    updateCustomProfile,
    deleteCustomProfile,
    saveCloudSnapshot,
    deleteCloudSnapshot,
  } = useAuth();

  const {
    profiles,
    activeProfile,
    setActiveProfile,
    addLocalCustomProfile,
    updateLocalCustomProfile,
    removeLocalCustomProfile,
    missions,
    collectibles,
    vehicles,
    objectives,
    notes,
    mapMarkers,
    customMapUrl,
    overallProgress,
    stats,
    exportBackup,
    restoreSnapshotData,
  } = useGame();

  const { locale, copy } = useLocale();
  const t = copy.account;

  const [paymentStatus, setPaymentStatus] = useState<PaymentBackendStatus | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [billingFeedback, setBillingFeedback] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void fetchPaymentBackendStatus().then((status) => {
      if (active) setPaymentStatus(status);
    });
    return () => {
      active = false;
    };
  }, []);

  // Profile Editor Form
  const [displayName, setDisplayName] = useState('');
  const [gamerTag, setGamerTag] = useState('');
  const [streamChannel, setStreamChannel] = useState('');
  const [streamPlatform, setStreamPlatform] = useState<StreamPlatform>('twitch');
  const [preferredTheme, setPreferredTheme] = useState<UniverseTheme>('sunset-neon');
  const [profileFeedback, setProfileFeedback] = useState<ActionFeedback | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // New Custom Universe Profile Form
  const [newProfName, setNewProfName] = useState('');
  const [newProfUniverse, setNewProfUniverse] = useState('');
  const [newProfTag, setNewProfTag] = useState('Runner_01');
  const [newProfTheme, setNewProfTheme] = useState<UniverseTheme>('sunset-neon');
  const [newProfIcon, setNewProfIcon] = useState<'Sun' | 'Zap' | 'Flame' | 'Gamepad2'>('Gamepad2');
  const [newProfPreset, setNewProfPreset] = useState<'empty' | 'starter'>('empty');
  const [creatingProfile, setCreatingProfile] = useState(false);
  const [customProfileFeedback, setCustomProfileFeedback] = useState<ActionFeedback | null>(null);

  // Inline Edit Custom Profile state
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editProfName, setEditProfName] = useState('');
  const [editProfUniverse, setEditProfUniverse] = useState('');
  const [editProfTag, setEditProfTag] = useState('');
  const [editProfTheme, setEditProfTheme] = useState<UniverseTheme>('sunset-neon');
  const [editProfIcon, setEditProfIcon] = useState<'Sun' | 'Zap' | 'Flame' | 'Gamepad2'>('Gamepad2');

  // Cloud Snapshots state
  const [syncingCloud, setSyncingCloud] = useState(false);
  const [cloudFeedback, setCloudFeedback] = useState<ActionFeedback | null>(null);

  useEffect(() => {
    if (account) {
      setDisplayName(account.displayName);
      setGamerTag(account.gamerTag);
      setStreamChannel(account.streamChannel);
      setStreamPlatform(account.streamPlatform);
      setPreferredTheme(account.preferredTheme);
    }
  }, [account]);

  const currentTier = account?.subscriptionTier || 'free';
  const currentStatus = account?.subscriptionStatus || 'active';
  const currentPlanCopy = copy.plans[currentTier] || copy.plans.free;
  const gumroadHref = buildGumroadCheckoutUrl({ email: user?.email, uid: user?.uid });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    setProfileFeedback(null);
    const result = await updateAccountProfile({
      displayName,
      gamerTag,
      streamChannel,
      streamPlatform,
      preferredTheme,
    });
    if (result.ok) {
      cyberAudio.playFanfare();
      setProfileFeedback({ type: 'success', text: t.profileSavedMsg });
    } else {
      setProfileFeedback({ type: 'error', text: result.error || t.profileSaveErr });
    }
    setSavingProfile(false);
  };

  const handleCreateGameProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfName.trim() || !newProfUniverse.trim()) return;
    setCreatingProfile(true);
    setCustomProfileFeedback(null);

    if (user) {
      const result = await createCustomProfile({
        name: newProfName.trim(),
        universe: newProfUniverse.trim(),
        playerTag: newProfTag.trim() || 'Runner_01',
        avatarIcon: newProfIcon,
        theme: newProfTheme,
      });
      if (result.ok && result.profile) {
        setActiveProfile(result.profile);
        cyberAudio.playChirp();
        setNewProfName('');
        setNewProfUniverse('');
        setCustomProfileFeedback({
          type: 'success',
          text: t.cloudProfileCreated.replace('{name}', result.profile.name),
        });
      } else {
        setCustomProfileFeedback({
          type: 'error',
          text: result.error || t.cloudProfileCreateErr,
        });
      }
    } else {
      const localCreated = addLocalCustomProfile(
        {
          name: newProfName.trim(),
          universe: newProfUniverse.trim(),
          playerTag: newProfTag.trim() || 'Runner_01',
          avatarIcon: newProfIcon,
          theme: newProfTheme,
        },
        newProfPreset
      );
      setActiveProfile(localCreated);
      cyberAudio.playChirp();
      setNewProfName('');
      setNewProfUniverse('');
      setCustomProfileFeedback({
        type: 'success',
        text: t.localProfileCreated.replace('{name}', localCreated.name),
      });
    }

    setCreatingProfile(false);
  };

  const startEditProfile = (p: GameProfile) => {
    setEditingProfileId(p.id);
    setEditProfName(p.name);
    setEditProfUniverse(p.universe);
    setEditProfTag(p.playerTag);
    setEditProfTheme(p.theme || 'sunset-neon');
    const validIcon = ['Sun', 'Zap', 'Flame', 'Gamepad2'].includes(p.avatarIcon)
      ? (p.avatarIcon as 'Sun' | 'Zap' | 'Flame' | 'Gamepad2')
      : 'Gamepad2';
    setEditProfIcon(validIcon);
  };

  const handleSaveEditProfile = async (profileId: string, isCloudCustom: boolean) => {
    if (!editProfName.trim() || !editProfUniverse.trim()) return;
    setCustomProfileFeedback(null);
    const payload = {
      name: editProfName.trim(),
      universe: editProfUniverse.trim(),
      playerTag: editProfTag.trim() || 'Runner_01',
      theme: editProfTheme,
      avatarIcon: editProfIcon,
    };

    if (isCloudCustom && user) {
      const res = await updateCustomProfile(profileId, payload);
      if (!res.ok) {
        setCustomProfileFeedback({
          type: 'error',
          text: res.error || (locale === 'fr' ? 'Mise à jour Cloud impossible.' : 'Cloud update failed.'),
        });
        return;
      }
    } else {
      updateLocalCustomProfile(profileId, payload);
    }

    setEditingProfileId(null);
    cyberAudio.playChirp();
    setCustomProfileFeedback({
      type: 'success',
      text:
        locale === 'fr'
          ? `Profil « ${payload.name} » mis à jour.`
          : `Profile "${payload.name}" updated.`,
    });
  };

  const handleDeleteGameProfile = async (profileId: string, isCloudCustom: boolean) => {
    setCustomProfileFeedback(null);
    if (isCloudCustom && user) {
      const res = await deleteCustomProfile(profileId);
      if (!res.ok) {
        setCustomProfileFeedback({
          type: 'error',
          text: res.error || t.cloudProfileDeleteErr,
        });
        return;
      }
      if (activeProfile.id === profileId) {
        setActiveProfile(INITIAL_PROFILES[0]);
      }
      setCustomProfileFeedback({ type: 'success', text: t.cloudProfileDeleted });
    } else {
      removeLocalCustomProfile(profileId);
      setCustomProfileFeedback({ type: 'success', text: t.localProfileDeleted });
    }
  };

  const handleOpenStripePortal = async () => {
    setBillingFeedback(null);
    if (STRIPE_CONFIG.portalUrl) {
      window.location.href = STRIPE_CONFIG.portalUrl;
      return;
    }
    if (!user || !account?.stripeCustomerId) {
      setBillingFeedback(
        locale === 'fr'
          ? 'Aucun abonnement Stripe actif associé à ce compte.'
          : 'No active Stripe customer record is linked to this account yet.'
      );
      return;
    }
    setPortalLoading(true);
    const token = await getIdToken();
    if (!token) {
      setBillingFeedback(
        locale === 'fr'
          ? 'Session expirée : reconnectez-vous avec Google.'
          : 'Session expired: please sign in with Google again.'
      );
      setPortalLoading(false);
      return;
    }
    const res = await openStripeBillingPortal({
      firebaseIdToken: token,
      customerId: account.stripeCustomerId,
    });
    setPortalLoading(false);
    if (res.ok && res.url) {
      window.location.href = res.url;
    } else {
      setBillingFeedback(res.error || 'Stripe Billing Portal unavailable.');
    }
  };

  const handleCloudBackup = async () => {
    if (!user) return;
    setSyncingCloud(true);
    setCloudFeedback(null);
    const result = await saveCloudSnapshot({
      profileId: activeProfile.id,
      profileName: activeProfile.name,
      overallProgress,
      missionsDone: stats.missionsDone,
      missionsTotal: stats.missionsTotal,
      collectiblesDone: stats.collectiblesDone,
      collectiblesTotal: stats.collectiblesTotal,
      missions,
      collectibles,
      vehicles,
      objectives,
      notes,
      mapMarkers,
      customMapUrl,
    });
    if (result.ok) {
      cyberAudio.playFanfare();
      const omittedCount = result.omittedVehicleImages || 0;
      const omittedMap = Boolean(result.omittedCustomMap);
      if (omittedCount > 0 || omittedMap) {
        const detail =
          locale === 'fr'
            ? `Snapshot « ${activeProfile.name} » (${overallProgress}%) enregistré dans Firestore. Attention : ${omittedCount} image(s) locale(s) de véhicule${
                omittedMap ? ' + carte locale base64' : ''
              } non incluse(s) (limite 1 Mo Firestore). Utilisez l’Export JSON pour archiver vos images locales, ou utilisez des URL HTTPS.`
            : `Snapshot "${activeProfile.name}" (${overallProgress}%) saved to Firestore. Warning: ${omittedCount} local vehicle image(s)${
                omittedMap ? ' + base64 custom map' : ''
              } were omitted due to Firestore 1 MB limits. Use JSON Export below to archive local images, or host images via HTTPS URLs.`;
        setCloudFeedback({
          type: 'warning',
          text: detail,
          showJsonExportAction: true,
        });
      } else {
        setCloudFeedback({
          type: 'success',
          text: t.snapshotSavedMsg
            .replace('{name}', activeProfile.name)
            .replace('{progress}', String(overallProgress)),
        });
      }
    } else {
      setCloudFeedback({
        type: 'error',
        text: result.error || t.snapshotSaveErr,
        showJsonExportAction: true,
      });
    }
    setSyncingCloud(false);
  };

  const handleDeleteSnapshot = async (snapshotId: string) => {
    setCloudFeedback(null);
    const result = await deleteCloudSnapshot(snapshotId);
    if (result.ok) {
      setCloudFeedback({ type: 'success', text: t.snapshotDeletedMsg });
    } else {
      setCloudFeedback({
        type: 'error',
        text: result.error || t.snapshotDeleteErr,
      });
    }
  };

  const inputClass =
    'w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-[#00f0ff] focus:outline-none transition-colors';

  return (
    <div className="min-h-screen bg-[#0a0910] text-slate-100 flex flex-col font-sans overflow-x-hidden">
      <CommercialNav activeRoute="account" onNavigate={onNavigate} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-white/[0.08] pb-7">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-mono-code text-[#00f0ff] uppercase tracking-[0.14em]">
                {t.kicker}
              </p>
              <LanguageSwitcher />
            </div>
            <h1 className="text-3xl sm:text-4xl font-hud font-bold text-white tracking-tight">
              {t.heading}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('app')}
              className="px-4 py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-[#00f0ff] text-xs font-semibold tracking-wide flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>{t.backToHud}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {user && (
              <button
                type="button"
                onClick={() => void signOut()}
                className="px-4 py-2.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/40 text-rose-200 text-xs font-semibold tracking-wide flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.signOut}</span>
              </button>
            )}
          </div>
        </div>

        {cloudError && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/60 text-xs font-mono-code text-rose-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{cloudError}</span>
            </div>
            <button
              type="button"
              onClick={clearCloudError}
              className="text-rose-300 hover:text-white underline cursor-pointer shrink-0"
            >
              {t.dismiss}
            </button>
          </div>
        )}

        {/* Auth Panel when Signed Out */}
        {isAuthReady && !user && (
          <div className="rounded-2xl bg-[#110e1c] border border-[#ff2a85]/40 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-[#00f0ff] text-xs font-mono-code uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>{t.authKicker}</span>
              </div>
              <h2 className="text-2xl font-hud font-bold text-white">{t.authHeading}</h2>
              <p className="text-sm text-slate-300 leading-relaxed">{t.authDesc}</p>
              {authError && (
                <p className="text-xs font-mono-code text-rose-300 bg-rose-950/50 border border-rose-500/40 rounded-lg p-2.5">
                  {authError}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => void signInWithGoogle()}
              disabled={isSigningIn}
              className="px-6 py-3.5 rounded-lg bg-gradient-to-r from-[#ff2a85] via-[#ff5c4d] to-[#ff7b00] hover:brightness-110 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 shadow-[0_10px_28px_-8px_rgba(255,42,133,0.5)] disabled:opacity-60 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>{isSigningIn ? t.signingInBtn : t.signInBtn}</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7 cols: Account Profile & Multi-Game Profiles Manager */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl bg-[#110e1c] border border-white/10 p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
                <div className="flex items-center gap-2.5">
                  <User className="w-5 h-5 text-[#00f0ff]" />
                  <h2 className="font-hud font-bold text-lg text-white">{t.identityTitle}</h2>
                </div>
                {user && (
                  <span className="text-xs font-mono-code text-emerald-400 truncate max-w-[220px]">
                    {user.email}
                  </span>
                )}
              </div>

              {user ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="acc-display" className="text-xs font-mono-code text-slate-300 block">
                        {t.displayNameLabel}
                      </label>
                      <input
                        id="acc-display"
                        type="text"
                        required
                        maxLength={80}
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="acc-tag" className="text-xs font-mono-code text-slate-300 block">
                        {t.gamerTagLabel}
                      </label>
                      <input
                        id="acc-tag"
                        type="text"
                        required
                        maxLength={40}
                        value={gamerTag}
                        onChange={(e) => setGamerTag(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="acc-channel" className="text-xs font-mono-code text-slate-300 block">
                        {t.streamChannelLabel}
                      </label>
                      <input
                        id="acc-channel"
                        type="text"
                        maxLength={120}
                        placeholder={t.streamChannelPlaceholder}
                        value={streamChannel}
                        onChange={(e) => setStreamChannel(e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="acc-platform" className="text-xs font-mono-code text-slate-300 block">
                        {t.platformLabel}
                      </label>
                      <select
                        id="acc-platform"
                        value={streamPlatform}
                        onChange={(e) => setStreamPlatform(e.target.value as StreamPlatform)}
                        className={inputClass}
                      >
                        <option value="twitch">Twitch</option>
                        <option value="youtube">YouTube</option>
                        <option value="tiktok">TikTok Live</option>
                        <option value="kick">Kick</option>
                        <option value="multi">{t.platformMulti}</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="acc-theme" className="text-xs font-mono-code text-slate-300 block">
                        {t.themeLabel}
                      </label>
                      <select
                        id="acc-theme"
                        value={preferredTheme}
                        onChange={(e) => setPreferredTheme(e.target.value as UniverseTheme)}
                        className={inputClass}
                      >
                        <option value="sunset-neon">{t.themeSunset}</option>
                        <option value="cyber-grid">{t.themeCyber}</option>
                        <option value="open-world">{t.themeOpenWorld}</option>
                      </select>
                    </div>
                  </div>

                  {profileFeedback && (
                    <div
                      className={`text-xs font-mono-code p-3 rounded-lg border flex items-center gap-2 ${
                        profileFeedback.type === 'success'
                          ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                          : 'bg-rose-950/50 border-rose-500/50 text-rose-200'
                      }`}
                    >
                      {profileFeedback.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                      )}
                      <span>{profileFeedback.text}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-5 py-2.5 rounded-lg bg-[#00f0ff] hover:bg-[#4ff6ff] text-[#0a0910] font-semibold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingProfile ? t.savingProfileBtn : t.saveProfileBtn}</span>
                  </button>
                </form>
              ) : (
                <p className="text-sm text-slate-400">{t.signInToEditProfile}</p>
              )}
            </div>

            {/* Multi-Game Universe Profiles Manager (Isolated Workspaces + Inline Edit) */}
            <div className="rounded-2xl bg-[#110e1c] border border-white/10 p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
                <div className="flex items-center gap-2.5">
                  <Gamepad2 className="w-5 h-5 text-[#ff7b00]" />
                  <div>
                    <h2 className="font-hud font-bold text-lg text-white">{t.profilesTitle}</h2>
                    <p className="text-[11px] text-slate-400">
                      {locale === 'fr'
                        ? 'Chaque profil isole totalement ses missions, collectibles, garage, carte, notes et statistiques.'
                        : 'Each game profile strictly isolates its own missions, collectibles, garage, map, notes, and analytics.'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono-code text-slate-400 tabular-nums shrink-0">
                  {profiles.length} {t.profilesAvailable}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profiles.map((p) => {
                  const isActive = activeProfile.id === p.id;
                  const isCloudCustom = customProfiles.some((cp) => cp.id === p.id);
                  const isEditing = editingProfileId === p.id;

                  if (isEditing) {
                    return (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-xl border border-[#00f0ff]/60 bg-black/50 space-y-2.5 sm:col-span-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono-code text-[#00f0ff] uppercase">
                            {locale === 'fr' ? 'Modifier le profil de jeu' : 'Edit Game Profile'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingProfileId(null)}
                            className="p-1 text-slate-400 hover:text-white cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            maxLength={60}
                            value={editProfName}
                            onChange={(e) => setEditProfName(e.target.value)}
                            className="rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 text-xs text-white"
                            placeholder={t.profileNamePlaceholder}
                          />
                          <input
                            type="text"
                            maxLength={60}
                            value={editProfUniverse}
                            onChange={(e) => setEditProfUniverse(e.target.value)}
                            className="rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 text-xs text-white"
                            placeholder={t.profileUniversePlaceholder}
                          />
                          <input
                            type="text"
                            maxLength={40}
                            value={editProfTag}
                            onChange={(e) => setEditProfTag(e.target.value)}
                            className="rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 text-xs text-white"
                            placeholder={t.profileTagPlaceholder}
                          />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <select
                            value={editProfTheme}
                            onChange={(e) => setEditProfTheme(e.target.value as UniverseTheme)}
                            className="rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 text-xs text-white"
                          >
                            <option value="sunset-neon">{t.themeOptSunset}</option>
                            <option value="cyber-grid">{t.themeOptCyber}</option>
                            <option value="open-world">{t.themeOptOpenWorld}</option>
                          </select>
                          <select
                            value={editProfIcon}
                            onChange={(e) =>
                              setEditProfIcon(e.target.value as 'Sun' | 'Zap' | 'Flame' | 'Gamepad2')
                            }
                            className="rounded-lg bg-black/50 border border-white/15 px-2.5 py-1.5 text-xs text-white"
                          >
                            <option value="Sun">{t.iconSun}</option>
                            <option value="Flame">{t.iconFlame}</option>
                            <option value="Zap">{t.iconZap}</option>
                            <option value="Gamepad2">{t.iconGamepad}</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => void handleSaveEditProfile(p.id, isCloudCustom)}
                            className="px-3 py-1.5 rounded-lg bg-[#00f0ff] text-[#0a0910] font-semibold text-xs uppercase cursor-pointer"
                          >
                            {locale === 'fr' ? 'Valider' : 'Save'}
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={p.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-2 transition-colors ${
                        isActive
                          ? 'bg-[#ff2a85]/12 border-[#ff2a85]/65'
                          : 'bg-black/35 border-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          cyberAudio.playClick();
                          setActiveProfile(p);
                        }}
                        className="text-left min-w-0 flex-1 cursor-pointer"
                      >
                        <div className="font-hud font-bold text-sm text-white truncate">
                          {p.name}
                        </div>
                        <div className="text-xs font-mono-code text-slate-400 truncate">
                          {p.universe} ·{' '}
                          {p.isCustom ? (isCloudCustom ? t.badgeCloud : t.badgeLocal) : t.badgeDemo}
                        </div>
                      </button>

                      <div className="flex items-center gap-1 shrink-0">
                        {isActive && (
                          <span className="text-[10px] font-mono-code text-[#00f0ff] uppercase font-semibold mr-1">
                            {t.badgeActive}
                          </span>
                        )}
                        {p.isCustom && (
                          <>
                            <button
                              type="button"
                              onClick={() => startEditProfile(p)}
                              className="p-1.5 rounded-md text-slate-400 hover:text-[#00f0ff] hover:bg-white/[0.05] cursor-pointer transition-colors"
                              title={locale === 'fr' ? 'Modifier ce profil' : 'Edit this profile'}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteGameProfile(p.id, isCloudCustom)}
                              className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-white/[0.05] cursor-pointer transition-colors"
                              title={t.deleteProfileTitle}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {customProfileFeedback && (
                <div
                  className={`text-xs font-mono-code p-3 rounded-lg border flex items-center gap-2 ${
                    customProfileFeedback.type === 'success'
                      ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                      : 'bg-rose-950/50 border-rose-500/50 text-rose-200'
                  }`}
                >
                  {customProfileFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{customProfileFeedback.text}</span>
                </div>
              )}

              <form
                onSubmit={handleCreateGameProfile}
                className="pt-4 border-t border-white/[0.08] space-y-3"
              >
                <div className="text-xs font-mono-code text-[#00f0ff] uppercase">
                  {user ? t.createProfileHeadingCloud : t.createProfileHeadingLocal}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    maxLength={60}
                    value={newProfName}
                    onChange={(e) => setNewProfName(e.target.value)}
                    placeholder={t.profileNamePlaceholder}
                    className="rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#00f0ff] focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    maxLength={60}
                    value={newProfUniverse}
                    onChange={(e) => setNewProfUniverse(e.target.value)}
                    placeholder={t.profileUniversePlaceholder}
                    className="rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#00f0ff] focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    maxLength={40}
                    value={newProfTag}
                    onChange={(e) => setNewProfTag(e.target.value)}
                    placeholder={t.profileTagPlaceholder}
                    className="rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-xs text-white focus:border-[#00f0ff] focus:outline-none"
                  />
                  <select
                    value={newProfTheme}
                    onChange={(e) => setNewProfTheme(e.target.value as UniverseTheme)}
                    className="rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-xs text-white focus:border-[#00f0ff] focus:outline-none"
                  >
                    <option value="sunset-neon">{t.themeOptSunset}</option>
                    <option value="cyber-grid">{t.themeOptCyber}</option>
                    <option value="open-world">{t.themeOptOpenWorld}</option>
                  </select>
                  <select
                    value={newProfIcon}
                    onChange={(e) =>
                      setNewProfIcon(e.target.value as 'Sun' | 'Zap' | 'Flame' | 'Gamepad2')
                    }
                    className="rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-xs text-white focus:border-[#00f0ff] focus:outline-none"
                  >
                    <option value="Gamepad2">{t.iconGamepad}</option>
                    <option value="Sun">{t.iconSun}</option>
                    <option value="Flame">{t.iconFlame}</option>
                    <option value="Zap">{t.iconZap}</option>
                  </select>
                  <select
                    value={newProfPreset}
                    onChange={(e) => setNewProfPreset(e.target.value as 'empty' | 'starter')}
                    className="rounded-lg bg-black/40 border border-white/15 px-3 py-2 text-xs text-white focus:border-[#00f0ff] focus:outline-none"
                  >
                    <option value="empty">
                      {locale === 'fr' ? 'Espace vierge' : 'Clean Empty Game'}
                    </option>
                    <option value="starter">
                      {locale === 'fr' ? 'Modèle découverte' : 'Starter Example'}
                    </option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={creatingProfile}
                  className="px-4 py-2.5 rounded-lg bg-white text-[#0a0910] hover:bg-[#00f0ff] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{creatingProfile ? t.creatingProfileBtn : t.addProfileBtn}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right 5 cols: Verified License Status & Manual Cloud Snapshots */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl bg-[#110e1c] border border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#ff7b00]" />
                  <h2 className="font-hud font-bold text-lg text-white">{t.billingTitle}</h2>
                </div>
                <span
                  className={`text-xs font-mono-code uppercase font-semibold ${
                    currentStatus === 'active' ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {currentTier} · {currentStatus}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-black/35 border border-[#00f0ff]/25 space-y-1.5">
                <div className="text-xs font-mono-code text-slate-400 uppercase">
                  {t.firestoreStatusLabel}
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-hud font-bold text-xl text-white">
                    {currentPlanCopy.name}
                  </span>
                  <span className="font-mono-code font-bold text-[#00f0ff] tabular-nums">
                    {currentPlanCopy.priceDisplay}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{t.firestoreStatusNote}</p>
              </div>

              {/* Real Server-Side Readiness Diagnostic */}
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between py-1.5 border-b border-white/[0.08]">
                  <span>{t.launchOfferRow}</span>
                  <span className="text-[#00f0ff] font-mono-code">{t.gumroadActiveTag}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-white/[0.08]">
                  <span>
                    {locale === 'fr' ? 'Webhook Gumroad serveur' : 'Server Gumroad Webhook'}
                  </span>
                  <span
                    className={`font-mono-code ${
                      paymentStatus?.gumroadWebhookConfigured ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {paymentStatus?.gumroadWebhookConfigured
                      ? locale === 'fr'
                        ? 'Configuré'
                        : 'Configured'
                      : locale === 'fr'
                      ? 'Variables requises'
                      : 'Env vars required'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-white/[0.08]">
                  <span>{t.stripeRow}</span>
                  <span
                    className={`font-mono-code ${
                      paymentStatus?.stripeCheckoutConfigured ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {paymentStatus?.stripeCheckoutConfigured ? t.stripeKeyDetected : t.stripeNotActive}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span>
                    {locale === 'fr'
                      ? 'Sync auto Licence → Firestore'
                      : 'Auto License → Firestore Sync'}
                  </span>
                  <span
                    className={`font-mono-code ${
                      paymentStatus?.firestoreServerSyncReady ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {paymentStatus?.firestoreServerSyncReady
                      ? locale === 'fr'
                        ? 'Actif'
                        : 'Active'
                      : locale === 'fr'
                      ? 'En attente IAM'
                      : 'Pending IAM'}
                  </span>
                </div>
              </div>

              {billingFeedback && (
                <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-xs font-mono-code text-amber-200">
                  {billingFeedback}
                </div>
              )}

              <div className="flex flex-wrap gap-2.5 pt-2">
                <a
                  href={gumroadHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => cyberAudio.playChirp()}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#ff2a85] via-[#ff5c4d] to-[#ff7b00] hover:brightness-110 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 text-center transition-all"
                >
                  <span>{t.gumroadBtn}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => onNavigate('pricing')}
                  className="py-2.5 px-4 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-[#00f0ff] font-semibold text-xs uppercase tracking-wider cursor-pointer transition-colors"
                >
                  {t.pricingBtn}
                </button>
                {(STRIPE_CONFIG.portalUrl || account?.stripeCustomerId) && (
                  <button
                    type="button"
                    onClick={() => void handleOpenStripePortal()}
                    disabled={portalLoading}
                    className="py-2.5 px-4 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-slate-200 font-semibold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
                  >
                    {portalLoading ? '...' : t.portalBtn}
                  </button>
                )}
              </div>
            </div>

            {/* Manual Cloud Progression Snapshots */}
            <div className="rounded-2xl bg-[#110e1c] border border-[#00f0ff]/25 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
                <div className="flex items-center gap-2">
                  <CloudUpload className="w-5 h-5 text-[#00f0ff]" />
                  <h2 className="font-hud font-bold text-lg text-white">{t.snapshotsTitle}</h2>
                </div>
                <span className="text-xs font-mono-code text-slate-400 tabular-nums">
                  {cloudSnapshots.length} {t.snapshotsCountLabel}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
                <p>{t.snapshotsDesc}</p>
                <p className="text-[11px] text-slate-500">{t.snapshotsImageNote}</p>
              </div>

              {user ? (
                <>
                  <button
                    type="button"
                    onClick={() => void handleCloudBackup()}
                    disabled={syncingCloud}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#00f0ff]/12 hover:bg-[#00f0ff]/22 border border-[#00f0ff]/50 text-[#00f0ff] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    <CloudUpload className="w-4 h-4" />
                    <span>
                      {syncingCloud
                        ? t.savingSnapshotBtn
                        : t.saveSnapshotBtn.replace('{progress}', String(overallProgress))}
                    </span>
                  </button>

                  {cloudFeedback && (
                    <div
                      className={`p-3 rounded-lg border text-xs font-mono-code space-y-2 ${
                        cloudFeedback.type === 'success'
                          ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                          : cloudFeedback.type === 'warning'
                          ? 'bg-amber-950/50 border-amber-500/50 text-amber-200'
                          : 'bg-rose-950/50 border-rose-500/50 text-rose-200'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {cloudFeedback.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        )}
                        <span className="leading-relaxed">{cloudFeedback.text}</span>
                      </div>
                      {cloudFeedback.showJsonExportAction && (
                        <button
                          type="button"
                          onClick={() => exportBackup('active')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>
                            {locale === 'fr'
                              ? 'Exporter JSON complet (avec images)'
                              : 'Export Full JSON (with local images)'}
                          </span>
                        </button>
                      )}
                    </div>
                  )}

                  {cloudSnapshots.length === 0 ? (
                    <p className="text-xs text-slate-400 leading-relaxed">{t.snapshotsEmpty}</p>
                  ) : (
                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {cloudSnapshots.map((snap) => (
                        <div
                          key={snap.id}
                          className="p-3.5 rounded-xl bg-black/35 border border-white/[0.08] flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-hud font-bold text-white truncate">
                              {snap.profileName} · {snap.overallProgress}%
                            </div>
                            <div className="text-[11px] font-mono-code text-slate-400 tabular-nums">
                              {t.snapshotMissionsLabel} {snap.missionsDone}/{snap.missionsTotal} ·{' '}
                              {t.snapshotCollectiblesLabel} {snap.collectiblesDone}/
                              {snap.collectiblesTotal} · {t.snapshotMarkersLabel}{' '}
                              {snap.mapMarkers?.length ?? 0}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                const res = restoreSnapshotData({
                                  profileId: snap.profileId,
                                  missions: snap.missions,
                                  collectibles: snap.collectibles,
                                  vehicles: snap.vehicles,
                                  objectives: snap.objectives,
                                  notes: snap.notes,
                                  mapMarkers: snap.mapMarkers,
                                  customMapUrl: snap.customMapUrl,
                                });
                                cyberAudio.playFanfare();
                                const preservedNote =
                                  res.preservedLocalImages > 0
                                    ? locale === 'fr'
                                      ? ` (${res.preservedLocalImages} image(s) locale(s) conservée(s))`
                                      : ` (${res.preservedLocalImages} local vehicle image(s) preserved)`
                                    : '';
                                setCloudFeedback({
                                  type: 'success',
                                  text: `${t.snapshotRestoredMsg.replace(
                                    '{name}',
                                    snap.profileName
                                  )}${preservedNote}`,
                                });
                              }}
                              className="p-1.5 rounded-lg bg-[#00f0ff]/12 hover:bg-[#00f0ff]/25 border border-[#00f0ff]/45 text-[#00f0ff] cursor-pointer transition-colors"
                              title={t.restoreSnapshotTitle}
                            >
                              <CloudDownload className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteSnapshot(snap.id)}
                              className="p-1.5 rounded-lg bg-white/[0.04] hover:text-rose-400 text-slate-400 border border-white/10 cursor-pointer transition-colors"
                              title={t.deleteSnapshotTitle}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-slate-400 leading-relaxed">{t.snapshotsSignInHint}</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/[0.08] bg-[#08070d] py-6 px-4 text-center text-xs font-mono-code text-slate-400">
        {copy.footer.copyright}
      </footer>
    </div>
  );
};
