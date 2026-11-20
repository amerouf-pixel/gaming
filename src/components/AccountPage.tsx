import React, { useState, useEffect } from 'react';
import { AppRoute, StreamPlatform, UniverseTheme } from '../types';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { SUBSCRIPTION_PLANS, isStripeConfigured, STRIPE_CONFIG } from '../services/stripeConfig';
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
  Gamepad2,
  ArrowRight,
  Save,
} from 'lucide-react';

interface AccountPageProps {
  onNavigate: (route: AppRoute) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
  const {
    user,
    account,
    isAuthReady,
    isSigningIn,
    authError,
    customProfiles,
    cloudSnapshots,
    signInWithGoogle,
    signOut,
    updateAccountProfile,
    createCustomProfile,
    deleteCustomProfile,
    saveCloudSnapshot,
    deleteCloudSnapshot,
  } = useAuth();

  const {
    profiles,
    activeProfile,
    setActiveProfile,
    addLocalCustomProfile,
    removeLocalCustomProfile,
    missions,
    collectibles,
    vehicles,
    objectives,
    notes,
    overallProgress,
    stats,
    restoreSnapshotData,
  } = useGame();

  // Profile Editor Form
  const [displayName, setDisplayName] = useState('');
  const [gamerTag, setGamerTag] = useState('');
  const [streamChannel, setStreamChannel] = useState('');
  const [streamPlatform, setStreamPlatform] = useState<StreamPlatform>('twitch');
  const [preferredTheme, setPreferredTheme] = useState<UniverseTheme>('sunset-neon');
  const [profileFeedback, setProfileFeedback] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // New Custom Universe Profile Form
  const [newProfName, setNewProfName] = useState('');
  const [newProfUniverse, setNewProfUniverse] = useState('');
  const [newProfTag, setNewProfTag] = useState('Runner_01');
  const [newProfTheme, setNewProfTheme] = useState<UniverseTheme>('sunset-neon');
  const [newProfIcon, setNewProfIcon] = useState<'Sun' | 'Zap' | 'Flame' | 'Gamepad2'>('Sun');
  const [creatingProfile, setCreatingProfile] = useState(false);

  // Cloud Sync state
  const [syncingCloud, setSyncingCloud] = useState(false);
  const [cloudMessage, setCloudMessage] = useState<string | null>(null);

  useEffect(() => {
    if (account) {
      setDisplayName(account.displayName);
      setGamerTag(account.gamerTag);
      setStreamChannel(account.streamChannel);
      setStreamPlatform(account.streamPlatform);
      setPreferredTheme(account.preferredTheme);
    }
  }, [account]);

  const currentPlan =
    SUBSCRIPTION_PLANS.find((p) => p.id === (account?.subscriptionTier || 'free')) ||
    SUBSCRIPTION_PLANS[0];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    setProfileFeedback(null);
    try {
      await updateAccountProfile({
        displayName,
        gamerTag,
        streamChannel,
        streamPlatform,
        preferredTheme,
      });
      cyberAudio.playFanfare();
      setProfileFeedback('Profil enregistré et synchronisé dans Firestore.');
    } catch {
      setProfileFeedback('Erreur lors de la sauvegarde du profil.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCreateGameProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfName.trim() || !newProfUniverse.trim()) return;
    setCreatingProfile(true);
    try {
      if (user) {
        const created = await createCustomProfile({
          name: newProfName.trim(),
          universe: newProfUniverse.trim(),
          playerTag: newProfTag.trim() || 'Runner_01',
          avatarIcon: newProfIcon,
          theme: newProfTheme,
        });
        if (created) {
          setActiveProfile(created);
        }
      } else {
        const localCreated = addLocalCustomProfile({
          name: newProfName.trim(),
          universe: newProfUniverse.trim(),
          playerTag: newProfTag.trim() || 'Runner_01',
          avatarIcon: newProfIcon,
          theme: newProfTheme,
        });
        setActiveProfile(localCreated);
      }
      cyberAudio.playChirp();
      setNewProfName('');
      setNewProfUniverse('');
    } finally {
      setCreatingProfile(false);
    }
  };

  const handleCloudBackup = async () => {
    if (!user) return;
    setSyncingCloud(true);
    setCloudMessage(null);
    try {
      const ok = await saveCloudSnapshot({
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
      });
      if (ok) {
        cyberAudio.playFanfare();
        setCloudMessage('Instantané de progression sauvegardé sur votre espace cloud.');
      }
    } catch {
      setCloudMessage('Impossible de sauvegarder sur le cloud pour le moment.');
    } finally {
      setSyncingCloud(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#120428] text-slate-100 flex flex-col">
      <CommercialNav activeRoute="account" onNavigate={onNavigate} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ff2a85]/25 pb-6">
          <div>
            <div className="text-xs font-mono-code text-[#00f0ff] uppercase tracking-widest">
              Espace Membre · Profils · Abonnement
            </div>
            <h1 className="text-3xl font-hud font-bold text-white mt-1">
              Compte &amp; Synchronisation JITALX
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('app')}
              className="px-4 py-2 bg-[#1b0838] hover:bg-[#2a0c54] border border-[#00f0ff]/45 text-[#00f0ff] text-xs font-hud font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <span>Retour au HUD</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {user && (
              <button
                onClick={() => void signOut()}
                className="px-4 py-2 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/40 text-rose-200 text-xs font-hud font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Déconnexion</span>
              </button>
            )}
          </div>
        </div>

        {/* Auth Panel when Signed Out */}
        {isAuthReady && !user && (
          <div className="bg-[#180633] border border-[#ff2a85]/45 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-[#00f0ff] text-xs font-mono-code uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Authentification sécurisée Firebase</span>
              </div>
              <h2 className="text-2xl font-hud font-bold text-white">
                Connectez-vous pour synchroniser vos profils et votre abonnement
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Votre compte Google crée automatiquement un espace privé protégé dans Firestore
                pour sauvegarder vos profils de jeu, vos instantanés de progression et gérer vos
                formules d&apos;abonnement.
              </p>
              {authError && (
                <p className="text-xs font-mono-code text-rose-300 bg-rose-950/50 border border-rose-500/40 p-2.5">
                  {authError}
                </p>
              )}
            </div>

            <button
              onClick={() => void signInWithGoogle()}
              disabled={isSigningIn}
              className="px-6 py-3.5 bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] hover:brightness-110 text-white font-hud font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 shadow-[0_0_24px_rgba(255,42,133,0.45)] disabled:opacity-60"
            >
              <LogIn className="w-4 h-4" />
              <span>{isSigningIn ? 'Connexion en cours...' : 'Continuer avec Google'}</span>
            </button>
          </div>
        )}

        {/* Main 2-Column Account Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7 cols: Account Profile & Cloud Sync */}
          <div className="lg:col-span-7 space-y-6">
            {/* Authenticated Profile Settings */}
            <div className="bg-[#180633] border border-[#ff2a85]/30 p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#ff2a85]/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <User className="w-5 h-5 text-[#00f0ff]" />
                  <h2 className="font-hud font-bold text-lg text-white">
                    Identité Joueur &amp; Streamer
                  </h2>
                </div>
                {user && (
                  <span className="text-xs font-mono-code text-emerald-400">
                    {user.email}
                  </span>
                )}
              </div>

              {user ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="acc-display" className="text-xs font-mono-code text-slate-300 block">
                        Nom affiché
                      </label>
                      <input
                        id="acc-display"
                        type="text"
                        required
                        maxLength={80}
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-[#0e0320] border border-[#ff2a85]/35 px-3 py-2 text-sm text-white focus:border-[#00f0ff]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="acc-tag" className="text-xs font-mono-code text-slate-300 block">
                        Gamer Tag / Pseudo OBS
                      </label>
                      <input
                        id="acc-tag"
                        type="text"
                        required
                        maxLength={40}
                        value={gamerTag}
                        onChange={(e) => setGamerTag(e.target.value)}
                        className="w-full bg-[#0e0320] border border-[#ff2a85]/35 px-3 py-2 text-sm text-white focus:border-[#00f0ff]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="acc-channel" className="text-xs font-mono-code text-slate-300 block">
                        Chaîne de stream
                      </label>
                      <input
                        id="acc-channel"
                        type="text"
                        maxLength={120}
                        placeholder="twitch.tv/votrechaine"
                        value={streamChannel}
                        onChange={(e) => setStreamChannel(e.target.value)}
                        className="w-full bg-[#0e0320] border border-[#ff2a85]/35 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-[#00f0ff]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="acc-platform" className="text-xs font-mono-code text-slate-300 block">
                        Plateforme principale
                      </label>
                      <select
                        id="acc-platform"
                        value={streamPlatform}
                        onChange={(e) => setStreamPlatform(e.target.value as StreamPlatform)}
                        className="w-full bg-[#0e0320] border border-[#ff2a85]/35 px-3 py-2 text-sm text-white focus:border-[#00f0ff]"
                      >
                        <option value="twitch">Twitch</option>
                        <option value="youtube">YouTube</option>
                        <option value="tiktok">TikTok Live</option>
                        <option value="kick">Kick</option>
                        <option value="multi">Multi-stream</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="acc-theme" className="text-xs font-mono-code text-slate-300 block">
                        Thème favori
                      </label>
                      <select
                        id="acc-theme"
                        value={preferredTheme}
                        onChange={(e) => setPreferredTheme(e.target.value as UniverseTheme)}
                        className="w-full bg-[#0e0320] border border-[#ff2a85]/35 px-3 py-2 text-sm text-white focus:border-[#00f0ff]"
                      >
                        <option value="sunset-neon">Sunset Néon</option>
                        <option value="cyber-grid">Secteur Cyber</option>
                        <option value="open-world">Monde Libre</option>
                      </select>
                    </div>
                  </div>

                  {profileFeedback && (
                    <div className="text-xs font-mono-code text-[#00f0ff] bg-[#0e0320] border border-[#00f0ff]/40 p-2.5">
                      {profileFeedback}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-5 py-2.5 bg-[#00f0ff] hover:bg-[#4ff6ff] text-[#120428] font-hud font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingProfile ? 'Enregistrement...' : 'Enregistrer le profil'}</span>
                  </button>
                </form>
              ) : (
                <p className="text-sm text-slate-400">
                  Connectez-vous avec Google ci-dessus pour personnaliser votre profil cloud.
                </p>
              )}
            </div>

            {/* Game Universe Profiles Manager (Works both Local & Cloud-Synced!) */}
            <div className="bg-[#180633] border border-[#ff2a85]/30 p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#ff2a85]/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <Gamepad2 className="w-5 h-5 text-[#ff7b00]" />
                  <h2 className="font-hud font-bold text-lg text-white">
                    Gestion des Profils &amp; Univers de Jeu
                  </h2>
                </div>
                <span className="text-xs font-mono-code text-slate-400">
                  {profiles.length} profils disponibles
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profiles.map((p) => {
                  const isActive = activeProfile.id === p.id;
                  const isCloudCustom = customProfiles.some((cp) => cp.id === p.id);
                  return (
                    <div
                      key={p.id}
                      className={`p-3.5 border flex items-center justify-between gap-2 ${
                        isActive
                          ? 'bg-[#ff2a85]/15 border-[#ff2a85]'
                          : 'bg-[#0e0320] border-[#ff2a85]/25'
                      }`}
                    >
                      <button
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
                          {p.universe} · {p.playerTag}
                        </div>
                      </button>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isActive && (
                          <span className="text-[10px] font-mono-code text-[#00f0ff] uppercase">
                            Actif
                          </span>
                        )}
                        {p.isCustom && (
                          <button
                            onClick={() => {
                              if (isCloudCustom && user) {
                                void deleteCustomProfile(p.id);
                              } else {
                                removeLocalCustomProfile(p.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 cursor-pointer"
                            title="Supprimer ce profil personnalisé"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Create Custom Universe Form */}
              <form
                onSubmit={handleCreateGameProfile}
                className="pt-4 border-t border-[#ff2a85]/20 space-y-3"
              >
                <div className="text-xs font-mono-code text-[#00f0ff] uppercase">
                  Créer un nouveau profil de jeu ({user ? 'synchronisé cloud' : 'local'})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    maxLength={60}
                    value={newProfName}
                    onChange={(e) => setNewProfName(e.target.value)}
                    placeholder="Nom du profil (ex: GTA 6 — Run 100%)"
                    className="bg-[#0e0320] border border-[#ff2a85]/35 px-3 py-2 text-xs text-white placeholder-slate-500"
                  />
                  <input
                    type="text"
                    required
                    maxLength={60}
                    value={newProfUniverse}
                    onChange={(e) => setNewProfUniverse(e.target.value)}
                    placeholder="Univers / Campagne (ex: Campagne Principale)"
                    className="bg-[#0e0320] border border-[#ff2a85]/35 px-3 py-2 text-xs text-white placeholder-slate-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    maxLength={40}
                    value={newProfTag}
                    onChange={(e) => setNewProfTag(e.target.value)}
                    placeholder="Tag joueur"
                    className="bg-[#0e0320] border border-[#ff2a85]/35 px-3 py-2 text-xs text-white"
                  />
                  <select
                    value={newProfTheme}
                    onChange={(e) => setNewProfTheme(e.target.value as UniverseTheme)}
                    className="bg-[#0e0320] border border-[#ff2a85]/35 px-3 py-2 text-xs text-white"
                  >
                    <option value="sunset-neon">Thème Sunset Néon</option>
                    <option value="cyber-grid">Thème Secteur Cyber</option>
                    <option value="open-world">Thème Monde Libre</option>
                  </select>
                  <select
                    value={newProfIcon}
                    onChange={(e) =>
                      setNewProfIcon(e.target.value as 'Sun' | 'Zap' | 'Flame' | 'Gamepad2')
                    }
                    className="bg-[#0e0320] border border-[#ff2a85]/35 px-3 py-2 text-xs text-white"
                  >
                    <option value="Sun">Icône Soleil</option>
                    <option value="Flame">Icône Flamme</option>
                    <option value="Zap">Icône Éclair</option>
                    <option value="Gamepad2">Icône Manette</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={creatingProfile}
                  className="px-4 py-2 bg-[#ff2a85]/20 hover:bg-[#ff2a85]/35 border border-[#ff2a85]/60 text-white text-xs font-hud font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{creatingProfile ? 'Création...' : 'Ajouter le profil'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right 5 cols: Subscription / Stripe Billing & Cloud Snapshots */}
          <div className="lg:col-span-5 space-y-6">
            {/* Subscription & Stripe Management */}
            <div className="bg-[#180633] border border-[#ff2a85]/35 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#ff2a85]/20 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#ff7b00]" />
                  <h2 className="font-hud font-bold text-lg text-white">Abonnement &amp; Stripe</h2>
                </div>
                <span className="text-xs font-mono-code text-emerald-400 uppercase">
                  {account?.subscriptionStatus || 'active'}
                </span>
              </div>

              <div className="p-4 bg-[#0e0320] border border-[#00f0ff]/30 space-y-1.5">
                <div className="text-xs font-mono-code text-slate-400 uppercase">Formule actuelle</div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-hud font-bold text-xl text-white">{currentPlan.name}</span>
                  <span className="font-mono-code font-bold text-[#00f0ff]">
                    {currentPlan.priceDisplay}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{currentPlan.billingCycle}</p>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="font-mono-code text-[11px] uppercase text-slate-400">
                  Préparation Stripe
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-white/10">
                  <span>Clé publique Stripe</span>
                  <span className={isStripeConfigured() ? 'text-emerald-400 font-mono-code' : 'text-amber-400 font-mono-code'}>
                    {isStripeConfigured() ? 'Configurée' : 'À configurer (.env)'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-white/10">
                  <span>Endpoint Checkout</span>
                  <span className="text-slate-200 font-mono-code truncate max-w-[180px]">
                    {STRIPE_CONFIG.checkoutEndpoint}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span>Paiement réel</span>
                  <span className="text-slate-300 font-mono-code">
                    {isStripeConfigured() ? 'Prêt sur validation' : 'Désactivé (Sécurisé)'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                <button
                  onClick={() => onNavigate('pricing')}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#ff2a85] to-[#ff7b00] hover:brightness-110 text-white font-hud font-bold text-xs uppercase tracking-wider cursor-pointer text-center"
                >
                  Voir les formules
                </button>
                {STRIPE_CONFIG.portalUrl && (
                  <a
                    href={STRIPE_CONFIG.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-4 bg-[#0e0320] border border-[#00f0ff]/45 text-[#00f0ff] font-hud font-bold text-xs uppercase tracking-wider"
                  >
                    Portail Stripe
                  </a>
                )}
              </div>
            </div>

            {/* Cloud Progression Snapshots */}
            <div className="bg-[#180633] border border-[#00f0ff]/30 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#ff2a85]/20 pb-3">
                <div className="flex items-center gap-2">
                  <CloudUpload className="w-5 h-5 text-[#00f0ff]" />
                  <h2 className="font-hud font-bold text-lg text-white">Sauvegardes Cloud</h2>
                </div>
                <span className="text-xs font-mono-code text-slate-400">
                  {cloudSnapshots.length} snapshot(s)
                </span>
              </div>

              {user ? (
                <>
                  <button
                    onClick={() => void handleCloudBackup()}
                    disabled={syncingCloud}
                    className="w-full py-2.5 px-4 bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 border border-[#00f0ff]/55 text-[#00f0ff] font-hud font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <CloudUpload className="w-4 h-4" />
                    <span>
                      {syncingCloud
                        ? 'Synchronisation...'
                        : `Sauvegarder l'état actuel (${overallProgress}%)`}
                    </span>
                  </button>

                  {cloudMessage && (
                    <div className="p-2.5 bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-mono-code flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{cloudMessage}</span>
                    </div>
                  )}

                  {cloudSnapshots.length === 0 ? (
                    <p className="text-xs text-slate-400">
                      Aucun instantané cloud enregistré. Cliquez ci-dessus pour synchroniser vos
                      missions, collectibles, véhicules, objectifs et notes.
                    </p>
                  ) : (
                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {cloudSnapshots.map((snap) => (
                        <div
                          key={snap.id}
                          className="p-3 bg-[#0e0320] border border-[#ff2a85]/25 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-hud font-bold text-white truncate">
                              {snap.profileName} · {snap.overallProgress}%
                            </div>
                            <div className="text-[11px] font-mono-code text-slate-400">
                              Missions {snap.missionsDone}/{snap.missionsTotal} · Collectibles{' '}
                              {snap.collectiblesDone}/{snap.collectiblesTotal}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                restoreSnapshotData({
                                  missions: snap.missions,
                                  collectibles: snap.collectibles,
                                  vehicles: snap.vehicles,
                                  objectives: snap.objectives,
                                  notes: snap.notes,
                                });
                                cyberAudio.playFanfare();
                                setCloudMessage(`Instantané "${snap.profileName}" restauré !`);
                              }}
                              className="p-1.5 bg-[#00f0ff]/15 hover:bg-[#00f0ff]/30 border border-[#00f0ff]/45 text-[#00f0ff] cursor-pointer"
                              title="Restaurer cet instantané"
                            >
                              <CloudDownload className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => void deleteCloudSnapshot(snap.id)}
                              className="p-1.5 bg-slate-900 hover:text-rose-400 text-slate-400 border border-slate-800 cursor-pointer"
                              title="Supprimer cet instantané"
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
                <p className="text-xs text-slate-400">
                  Connectez-vous avec Google pour activer la sauvegarde cloud multi-appareils dans
                  Firestore (l&apos;export/import JSON local reste disponible hors-ligne dans Stats).
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#ff2a85]/25 bg-[#0e0320] py-6 px-4 text-center text-xs font-mono-code text-slate-400">
        © 2026 10JITAL Production · JITALX · THE STREAMER COMMAND HUB
      </footer>
    </div>
  );
};
