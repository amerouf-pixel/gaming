import React, { useMemo, useState } from 'react';
import {
  ScrollText,
  Target,
  Timer,
  Car,
  PawPrint,
  ShieldAlert,
  ShoppingBag,
  Cpu,
  Smartphone,
  Trophy,
  GitBranch,
  CheckCircle2,
  Circle,
  Lock,
  ArrowRight,
  Zap,
  Globe,
  Scale,
  Egg,
  Ban,
  Coins,
  Gauge,
  Mountain,
  Leaf,
  Waves,
  Calculator,
  Percent,
  Layers,
  MapPin,
} from 'lucide-react';
import {
  APAC_MARKETS,
  APAC_STATS,
  BONUS_RULES,
  COMPANIONS,
  EGGS,
  INCUBATION_BASE_MINUTES,
  INCUBATION_REDUCTION_MINUTES,
  INCUBATORS,
  KPIS,
  LOOP_STEPS,
  MONETIZATION_RULES,
  ONBOARDING_BEATS,
  PITY,
  RAID_RULES,
  RARITIES,
  ROADMAP_PHASES,
  SPEC_META,
  TECH_PILLARS,
  V3_CHANGES,
  VARIANTS,
  VEHICLE_PHASES,
} from '../../data/specV3';
import { Companion, EggId, Rarity, SpecSectionId, V3Change } from '../../types';

type IconComponent = React.ComponentType<{ className?: string }>;

const SECTION_NAV: { id: SpecSectionId; label: string; icon: IconComponent }[] = [
  { id: 'vision', label: 'Vision', icon: Target },
  { id: 'boucle', label: 'Boucle', icon: Timer },
  { id: 'vehicules', label: 'Véhicules', icon: Car },
  { id: 'compagnons', label: 'Compagnons', icon: PawPrint },
  { id: 'raids', label: 'Raids', icon: ShieldAlert },
  { id: 'monetisation', label: 'Monétisation', icon: ShoppingBag },
  { id: 'technique', label: 'Technique', icon: Cpu },
  { id: 'onboarding', label: 'Onboarding', icon: Smartphone },
  { id: 'kpis', label: 'KPIs', icon: Trophy },
  { id: 'roadmap', label: 'Roadmap', icon: GitBranch },
];

const TONE_STYLES: Record<V3Change['tone'], { text: string; border: string; bg: string }> = {
  cyan: { text: 'text-cyan-300', border: 'border-cyan-500/40', bg: 'bg-cyan-500/10' },
  emerald: { text: 'text-emerald-300', border: 'border-emerald-500/40', bg: 'bg-emerald-500/10' },
  amber: { text: 'text-amber-300', border: 'border-amber-500/40', bg: 'bg-amber-500/10' },
  rose: { text: 'text-rose-300', border: 'border-rose-500/40', bg: 'bg-rose-500/10' },
  violet: { text: 'text-violet-300', border: 'border-violet-500/40', bg: 'bg-violet-500/10' },
};

const EGG_ICONS: Record<EggId, IconComponent> = {
  celeste: Mountain,
  automne: Leaf,
  abysses: Waves,
};

const getRarity = (id: Rarity) => RARITIES.find((r) => r.id === id) ?? RARITIES[0];

const SectionTitle: React.FC<{ icon: IconComponent; title: string; subtitle: string }> = ({
  icon: Icon,
  title,
  subtitle,
}) => (
  <div className="flex items-start gap-3">
    <div className="p-2 bg-slate-900 border border-slate-800 flex-shrink-0">
      <Icon className="w-5 h-5 text-cyan-400" />
    </div>
    <div>
      <h2 className="font-hud font-bold text-lg text-white uppercase tracking-wide">{title}</h2>
      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{subtitle}</p>
    </div>
  </div>
);

const StatTile: React.FC<{ label: string; value: string; detail?: string; accent?: string }> = ({
  label,
  value,
  detail,
  accent = 'text-cyan-300',
}) => (
  <div className="bg-[#050811] border border-slate-800 p-3">
    <div className="text-[10px] font-mono-code uppercase tracking-wider text-slate-500">{label}</div>
    <div className={`font-hud font-bold text-sm mt-1 ${accent}`}>{value}</div>
    {detail && <div className="text-[10px] font-mono-code text-slate-500 mt-0.5">{detail}</div>}
  </div>
);

/* ========================================================================== */
/* VISION                                                                     */
/* ========================================================================== */

const VisionSection: React.FC = () => (
  <div className="space-y-5">
    <div className="bg-[#0c1322] border border-cyan-950/80 p-5 rounded-2xl">
      <SectionTitle
        icon={Target}
        title="Vision & positionnement APAC"
        subtitle="Courses d’arcade de 90 secondes + gestion d’un Sanctuaire Zen, avec des compagnons qui produisent même hors-ligne."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
        {APAC_STATS.map((stat) => (
          <div key={stat.label} className="bg-slate-950/70 border border-slate-800 p-4">
            <div className="font-hud font-bold text-2xl text-cyan-300">{stat.value}</div>
            <div className="text-xs text-slate-200 font-semibold mt-1">{stat.label}</div>
            <div className="text-[10px] font-mono-code text-slate-500 mt-1">{stat.detail}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-mono-code text-slate-400">
        <Globe className="w-3.5 h-3.5 text-cyan-400" />
        <span className="uppercase tracking-wider">Marchés prioritaires :</span>
        {APAC_MARKETS.map((market) => (
          <span key={market} className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300">
            {market}
          </span>
        ))}
      </div>

      <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
        <Scale className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>
          Les bookings moyens par joueur payant reculent de 13 % : la v3 impose une tarification
          régionale basse et un modèle fondé sur le volume, pas sur le prix unitaire.
        </span>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {V3_CHANGES.map((change) => {
        const tone = TONE_STYLES[change.tone];
        return (
          <div
            key={change.id}
            className={`bg-[#0c1322] border ${tone.border} p-4 rounded-2xl flex flex-col gap-2`}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className={`font-hud font-bold text-sm ${tone.text}`}>{change.title}</h3>
              <span
                className={`text-[9px] font-mono-code uppercase px-1.5 py-0.5 ${tone.bg} ${tone.text} ${tone.border} border whitespace-nowrap`}
              >
                v3
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{change.description}</p>
            <div className="mt-auto pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-mono-code text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{change.impact}</span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);


/* ========================================================================== */
/* BOUCLE DE JEU & INCUBATION ACTIVE                                          */
/* ========================================================================== */

const BoucleSection: React.FC = () => {
  const [races, setRaces] = useState(0);
  const [gamePassActive, setGamePassActive] = useState(false);

  const racesNeeded = Math.ceil(INCUBATION_BASE_MINUTES / INCUBATION_REDUCTION_MINUTES);
  const remaining = Math.max(0, INCUBATION_BASE_MINUTES - races * INCUBATION_REDUCTION_MINUTES);
  const isHatched = remaining === 0;
  const realMinutes = races * 1.5;
  const acceleratedEggs = gamePassActive ? 4 : 2;

  return (
    <div className="space-y-5">
      <div className="bg-[#0c1322] border border-cyan-950/80 p-5 rounded-2xl">
        <SectionTitle
          icon={Timer}
          title="Boucle courte de 2 minutes"
          subtitle="Course d’arcade de 90 secondes, réduction active de l’incubation, éclosion et gestion en 30 secondes."
        />

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-3 mt-5">
          {LOOP_STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="bg-slate-950/70 border border-slate-800 p-4 flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono-code uppercase text-slate-500">
                    Étape {index + 1}
                  </span>
                  <span className="text-xs font-mono-code font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 whitespace-nowrap">
                    {step.duration}
                  </span>
                </div>
                <h3 className="font-hud font-bold text-sm text-white mt-2">{step.title}</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{step.description}</p>
              </div>
              {index < LOOP_STEPS.length - 1 && (
                <div className="hidden md:flex items-center justify-center text-slate-600">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Calculateur d'incubation */}
        <div className="bg-[#0c1322] border border-cyan-950/80 p-5 rounded-2xl">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-cyan-400" />
            <h3 className="font-hud font-bold text-sm text-white uppercase">
              Calculateur d’incubation
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Un œuf = {INCUBATION_BASE_MINUTES} min. Chaque course terminée retire{' '}
            {INCUBATION_REDUCTION_MINUTES} min au compteur.
          </p>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span
              className={`font-hud font-bold text-4xl ${
                isHatched ? 'text-emerald-300' : 'text-cyan-300'
              }`}
            >
              {remaining}
              <span className="text-lg ml-1">min</span>
            </span>
            <span className="text-xs font-mono-code text-slate-400">
              {isHatched
                ? `Œuf prêt après ${races} course${races > 1 ? 's' : ''} (${realMinutes.toFixed(
                    1
                  )} min réelles)`
                : `${racesNeeded - races} course${racesNeeded - races > 1 ? 's' : ''} restante${
                    racesNeeded - races > 1 ? 's' : ''
                  }`}
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={racesNeeded + 1}
            step={1}
            value={races}
            onChange={(e) => setRaces(Number(e.target.value))}
            className="w-full mt-4 accent-cyan-400 cursor-pointer"
            aria-label="Nombre de courses terminées"
          />

          <div className="flex items-center justify-between text-[10px] font-mono-code text-slate-500 mt-1">
            <span>0 course</span>
            <span>{racesNeeded + 1} courses</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <StatTile label="Courses" value={`${races}`} detail="90 s chacune" />
            <StatTile
              label="Temps retiré"
              value={`${races * INCUBATION_REDUCTION_MINUTES} min`}
              detail="−3 min / course"
              accent="text-emerald-300"
            />
            <StatTile
              label="Temps réel"
              value={`${realMinutes.toFixed(1)} min`}
              detail="hors gestion"
              accent="text-amber-300"
            />
          </div>

          <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/30 text-[11px] text-cyan-200 flex items-start gap-2">
            <Zap className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>
              Deux courses suffisent : {racesNeeded * 1.5} min réelles +{' '}
              {racesNeeded * INCUBATION_REDUCTION_MINUTES} min retirées = éclosion au retour au
              Sanctuaire.
            </span>
          </div>
        </div>

        {/* Incubateurs */}
        <div className="bg-[#0c1322] border border-cyan-950/80 p-5 rounded-2xl">
          <div className="flex items-center gap-2">
            <Egg className="w-4 h-4 text-amber-400" />
            <h3 className="font-hud font-bold text-sm text-white uppercase">
              Économie des incubateurs
            </h3>
          </div>

          <div className="space-y-2 mt-3">
            {INCUBATORS.map((incubator) => (
              <div
                key={incubator.id}
                className={`p-3 border flex items-start justify-between gap-3 ${
                  incubator.paid
                    ? 'bg-amber-500/5 border-amber-500/30'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-hud font-bold text-xs text-white">{incubator.label}</span>
                    <span
                      className={`text-[9px] font-mono-code uppercase px-1.5 py-0.5 border ${
                        incubator.paid
                          ? 'text-amber-300 border-amber-500/40 bg-amber-500/10'
                          : 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10'
                      }`}
                    >
                      {incubator.cost}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{incubator.detail}</div>
                </div>
                <div className="text-[10px] font-mono-code text-slate-500 text-right">
                  {incubator.unlock}
                </div>
              </div>
            ))}
          </div>

          <label className="flex items-center gap-2 mt-4 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={gamePassActive}
              onChange={(e) => setGamePassActive(e.target.checked)}
              className="accent-amber-400 cursor-pointer"
            />
            <span className="text-[11px] font-mono-code text-slate-300">
              Simuler le GamePass (4 œufs accélérés simultanément)
            </span>
          </label>

          <div className="mt-2 text-[11px] font-mono-code text-slate-400">
            Œufs accélérés par course :{' '}
            <span className="text-cyan-300 font-bold">{acceleratedEggs}</span> ×{' '}
            <span className="text-emerald-300 font-bold">−3 min</span> ={' '}
            <span className="text-amber-300 font-bold">
              {acceleratedEggs * INCUBATION_REDUCTION_MINUTES} min
            </span>{' '}
            retirées au total
          </div>
        </div>
      </div>
    </div>
  );
};


/* ========================================================================== */
/* VÉHICULES & PHYSIQUE                                                       */
/* ========================================================================== */

const VehiculesSection: React.FC = () => (
  <div className="space-y-4">
    <div className="bg-[#0c1322] border border-cyan-950/80 p-5 rounded-2xl">
      <SectionTitle
        icon={Car}
        title="Véhicules, physique et budget"
        subtitle="Physique par sphère de collision (SphereCast type Mario Kart) : rapide à régler, impossible à retourner dans le décor, très légère pour le processeur mobile."
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
        <StatTile label="Budget Phase 1" value={SPEC_META.phase1Budget} detail="développement" />
        <StatTile label="Phase 0" value="4 semaines" detail="boîte grise" accent="text-emerald-300" />
        <StatTile
          label="Phase 1"
          value="Mois 2 et 3"
          detail="lancement MVP"
          accent="text-amber-300"
        />
        <StatTile label="Ultime" value="5 s" detail="Mode Esprit du Dragon" accent="text-violet-300" />
      </div>
    </div>

    <div className="space-y-2">
      {VEHICLE_PHASES.map((item) => (
        <div
          key={item.id}
          className={`bg-[#0c1322] border p-4 rounded-2xl ${
            item.delivered ? 'border-slate-800' : 'border-slate-800/60 opacity-80'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="flex items-center gap-2 lg:w-52 flex-shrink-0">
              {item.delivered ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <Lock className="w-4 h-4 text-slate-500 flex-shrink-0" />
              )}
              <div>
                <div className="text-[10px] font-mono-code uppercase text-slate-500">
                  {item.phase}
                </div>
                <div className="font-hud font-bold text-sm text-white">{item.vehicle}</div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="text-[11px] text-slate-300 flex items-start gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>{item.technical}</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-start gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{item.role}</span>
              </div>
            </div>

            <span
              className={`self-start lg:self-center text-[9px] font-mono-code uppercase px-2 py-0.5 border whitespace-nowrap ${
                item.delivered
                  ? 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10'
                  : 'text-slate-400 border-slate-700 bg-slate-900'
              }`}
            >
              {item.delivered ? 'Phase 1 / MVP' : 'Après validation'}
            </span>
          </div>
        </div>
      ))}
    </div>

    <div className="bg-[#0c1322] border border-violet-500/30 p-4 rounded-2xl flex items-start gap-3">
      <Zap className="w-4 h-4 text-violet-300 flex-shrink-0 mt-0.5" />
      <div className="text-xs text-slate-300">
        <span className="font-hud font-bold text-violet-300 uppercase">Mode Esprit du Dragon · </span>
        jauge de drift pleine → aura de dragon pendant 5 s, lévitation assistée au-dessus du sol et
        pièces doublées. Le dragon est donc jouable dès le jour 1 sans physique de vol.
      </div>
    </div>
  </div>
);


/* ========================================================================== */
/* COMPAGNONS, RARETÉS & PITY                                                 */
/* ========================================================================== */

const LUCK_SHIFT: Record<Rarity, number> = {
  commune: -5,
  rare: -3,
  epique: 5,
  legendaire: 2.5,
  mythique: 0.5,
};

const CompanionsSection: React.FC = () => {
  const [eggFilter, setEggFilter] = useState<EggId | 'all'>('all');
  const [luckBoost, setLuckBoost] = useState(false);
  const [openedEggs, setOpenedEggs] = useState(0);

  const odds = useMemo(
    () =>
      RARITIES.map((tier) => ({
        ...tier,
        displayChance: Math.max(
          0,
          Number((tier.chance + (luckBoost ? LUCK_SHIFT[tier.id] : 0)).toFixed(1))
        ),
      })),
    [luckBoost]
  );

  const epicPity = PITY.epicEvery - (openedEggs % PITY.epicEvery);
  const legendaryPity = PITY.legendaryEvery - (openedEggs % PITY.legendaryEvery);

  const filteredCompanions = COMPANIONS.filter(
    (companion) => eggFilter === 'all' || companion.egg === eggFilter
  );

  return (
    <div className="space-y-4">
      <div className="bg-[#0c1322] border border-cyan-950/80 p-5 rounded-2xl">
        <SectionTitle
          icon={PawPrint}
          title="15 compagnons · 45 variantes"
          subtitle="3 œufs × 5 paliers de rareté. Fusion : 3 Normaux = 1 Doré, 3 Dorés = 1 Arc-en-ciel."
        />

        <div className="space-y-2 mt-5">
          {odds.map((tier) => (
            <div key={tier.id} className="flex items-center gap-3">
              <span
                className={`w-24 text-[11px] font-mono-code font-bold uppercase flex-shrink-0 ${tier.textClass}`}
              >
                {tier.label}
              </span>
              <div className="flex-1 h-2 bg-slate-900 overflow-hidden">
                <div
                  className={`h-full ${tier.barClass}`}
                  style={{ width: `${Math.max(tier.displayChance, 0.4)}%` }}
                />
              </div>
              <span className={`w-16 text-right text-xs font-mono-code ${tier.textClass}`}>
                {tier.displayChance} %
              </span>
              <span className="w-24 text-right text-[10px] font-mono-code text-slate-500">
                {tier.companions} modèles
              </span>
            </div>
          ))}
        </div>

        <label className="flex items-center gap-2 mt-4 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={luckBoost}
            onChange={(e) => setLuckBoost(e.target.checked)}
            className="accent-amber-400 cursor-pointer"
          />
          <span className="text-[11px] font-mono-code text-slate-300">
            Simuler un boost de chance actif (les pourcentages affichés se mettent à jour)
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pity */}
        <div className="bg-[#0c1322] border border-amber-500/30 p-5 rounded-2xl">
          <div className="flex items-center gap-2">
            <Egg className="w-4 h-4 text-amber-400" />
            <h3 className="font-hud font-bold text-sm text-white uppercase">Système de Pity</h3>
          </div>

          <div className="mt-3 p-3 bg-slate-950/70 border border-slate-800 text-[11px] font-mono-code text-slate-300">
            Épique garanti tous les {PITY.epicEvery} œufs — Légendaire garanti tous les{' '}
            {PITY.legendaryEvery} œufs
          </div>

          <div className="flex items-center gap-3 mt-4">
            <label className="text-[11px] font-mono-code text-slate-400" htmlFor="pity-input">
              Œufs ouverts
            </label>
            <input
              id="pity-input"
              type="number"
              min={0}
              value={openedEggs}
              onChange={(e) => setOpenedEggs(Math.max(0, Number(e.target.value) || 0))}
              className="w-24 px-2 py-1 bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            <StatTile
              label="Épique dans"
              value={`${epicPity} œuf${epicPity > 1 ? 's' : ''}`}
              detail={`${Math.floor(openedEggs / PITY.epicEvery)} garantie(s) obtenue(s)`}
              accent="text-violet-300"
            />
            <StatTile
              label="Légendaire dans"
              value={`${legendaryPity} œuf${legendaryPity > 1 ? 's' : ''}`}
              detail={`${Math.floor(openedEggs / PITY.legendaryEvery)} garantie(s) obtenue(s)`}
              accent="text-amber-300"
            />
          </div>

          <div className="mt-3 text-[11px] text-slate-400 flex items-start gap-2">
            <Percent className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <span>
              Probabilités exactes affichées avant l’achat et recalculées dynamiquement quand un
              boost de chance est actif.
            </span>
          </div>
        </div>


        {/* Fusion */}
        <div className="bg-[#0c1322] border border-cyan-950/80 p-5 rounded-2xl">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="font-hud font-bold text-sm text-white uppercase">
              Fusion & variantes cosmétiques
            </h3>
          </div>

          <div className="space-y-2 mt-3">
            {VARIANTS.map((variant) => (
              <div
                key={variant.id}
                className="p-3 bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-3"
              >
                <div>
                  <div className={`font-hud font-bold text-xs ${variant.textClass}`}>
                    {variant.label}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{variant.rule}</div>
                </div>
                <span className="text-xs font-mono-code text-slate-300 whitespace-nowrap">
                  ×{variant.multiplier}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <StatTile label="Modèles 3D" value="15" detail="3 œufs × 5" />
            <StatTile label="Variantes" value="3" detail="Normal / Doré / Arc-en-ciel" />
            <StatTile
              label="Collection"
              value="45"
              detail="dès le jour 1"
              accent="text-emerald-300"
            />
          </div>
        </div>
      </div>

      {/* Bonus autorisés / interdits */}
      <div className="bg-[#0c1322] border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-2">
          <Ban className="w-4 h-4 text-rose-400" />
          <h3 className="font-hud font-bold text-sm text-white uppercase">
            Matrice des bonus de compagnon
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
          {BONUS_RULES.map((rule) => (
            <div
              key={rule.id}
              className={`p-3 border flex items-start gap-2.5 ${
                rule.allowed
                  ? 'bg-slate-950/60 border-slate-800'
                  : 'bg-rose-500/5 border-rose-500/40'
              }`}
            >
              {rule.allowed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <Ban className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <div
                  className={`text-xs font-hud font-bold ${
                    rule.allowed ? 'text-slate-200' : 'text-rose-300'
                  }`}
                >
                  {rule.label}{' '}
                  <span className="font-mono-code text-[10px] text-slate-500">
                    {rule.allowed ? '/ autorisé' : '/ interdit'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{rule.impact}</div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Filtres par œuf */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setEggFilter('all')}
          className={`px-3 py-1.5 text-xs font-mono-code whitespace-nowrap border cursor-pointer transition-colors ${
            eggFilter === 'all'
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          Tous les œufs ({COMPANIONS.length})
        </button>
        {EGGS.map((egg) => {
          const Icon = EGG_ICONS[egg.id];
          const count = COMPANIONS.filter((c) => c.egg === egg.id).length;
          return (
            <button
              key={egg.id}
              onClick={() => setEggFilter(egg.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-code whitespace-nowrap border cursor-pointer transition-colors ${
                eggFilter === egg.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${egg.accentClass}`} />
              <span>
                {egg.name} ({count})
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filteredCompanions.map((companion) => (
          <CompanionCard key={companion.id} companion={companion} />
        ))}
      </div>
    </div>
  );
};

const CompanionCard: React.FC<{ companion: Companion }> = ({ companion }) => {
  const rarity = getRarity(companion.rarity);
  const egg = EGGS.find((e) => e.id === companion.egg);
  const EggIcon = EGG_ICONS[companion.egg];
  const { production, style, magnet, defense, luck } = companion.bonus;

  return (
    <div className={`bg-[#0c1322] border p-4 flex flex-col gap-2 ${rarity.borderClass}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <EggIcon className={`w-3.5 h-3.5 ${egg?.accentClass ?? 'text-slate-400'}`} />
            <span className="text-[10px] font-mono-code uppercase text-slate-500 truncate">
              {egg?.name}
            </span>
          </div>
          <h4 className="font-hud font-bold text-sm text-white truncate">{companion.name}</h4>
        </div>
        <span
          className={`text-[9px] font-mono-code uppercase px-1.5 py-0.5 border whitespace-nowrap ${rarity.bgClass} ${rarity.textClass} ${rarity.borderClass}`}
        >
          {rarity.label} · {rarity.chance} %
        </span>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">{companion.blurb}</p>

      <div className="grid grid-cols-2 gap-1.5 mt-auto pt-2 border-t border-slate-800/80 text-[10px] font-mono-code">
        <span className="flex items-center gap-1 text-slate-300">
          <Coins className="w-3 h-3 text-amber-400" /> +{production} /min
        </span>
        <span className="flex items-center gap-1 text-slate-300">
          <Gauge className="w-3 h-3 text-emerald-400" /> +{style} % style
        </span>
        <span className="flex items-center gap-1 text-slate-300">
          <MapPin className="w-3 h-3 text-cyan-400" /> +{magnet} studs
        </span>
        <span className="flex items-center gap-1 text-slate-300">
          <ShieldAlert className="w-3 h-3 text-violet-400" /> −{defense} % pillage
        </span>
        <span className="flex items-center gap-1 text-slate-300 col-span-2">
          <Percent className="w-3 h-3 text-rose-400" /> +{luck} % chance d’œuf
        </span>
      </div>

      <div className="text-[10px] font-mono-code text-slate-500">
        Élément : <span className="text-slate-300">{companion.element}</span>
      </div>
    </div>
  );
};


/* ========================================================================== */
/* RAIDS                                                                      */
/* ========================================================================== */

const RaidsSection: React.FC = () => (
  <div className="space-y-4">
    <div className="bg-[#0c1322] border border-cyan-950/80 p-5 rounded-2xl">
      <SectionTitle
        icon={ShieldAlert}
        title="Raids sans perte définitive"
        subtitle="Un raid pille uniquement les pièces non récoltées et endort temporairement un compagnon actif."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-5">
        {RAID_RULES.map((rule) => (
          <div
            key={rule.id}
            className={`p-4 border flex items-start gap-3 ${
              rule.allowed ? 'bg-slate-950/60 border-slate-800' : 'bg-rose-500/5 border-rose-500/40'
            }`}
          >
            {rule.allowed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Ban className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <div
                className={`font-hud font-bold text-xs ${
                  rule.allowed ? 'text-slate-200' : 'text-rose-300'
                }`}
              >
                {rule.title}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{rule.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <StatTile label="Coffre pillé" value="Pièces non récoltées" detail="seule ressource volée" />
      <StatTile
        label="Compagnon endormi"
        value="1 par raid"
        detail="production stoppée"
        accent="text-amber-300"
      />
      <StatTile
        label="Réveil"
        value="1 clic ou revanche"
        detail="fantôme = chrono enregistré"
        accent="text-emerald-300"
      />
    </div>

    <div className="bg-[#0c1322] border border-emerald-500/30 p-4 rounded-2xl flex items-start gap-3">
      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
      <div className="text-xs text-slate-300">
        <span className="font-hud font-bold text-emerald-300 uppercase">
          Zéro perte définitive ·{' '}
        </span>
        aucun compagnon, aucune variante et aucun œuf en incubateur ne peut être volé. La défense du
        Sanctuaire réduit seulement le pourcentage de pièces pillables.
      </div>
    </div>
  </div>
);


/* ========================================================================== */
/* MONÉTISATION & CONFORMITÉ                                                  */
/* ========================================================================== */

const MonetisationSection: React.FC = () => (
  <div className="space-y-4">
    <div className="bg-[#0c1322] border border-cyan-950/80 p-5 rounded-2xl">
      <SectionTitle
        icon={ShoppingBag}
        title="Monétisation & conformité légale"
        subtitle="Gain de temps, collection et cosmétique uniquement. Aucun avantage de pilotage, probabilités affichées avant l’achat."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-5">
        {MONETIZATION_RULES.map((rule) => (
          <div key={rule.id} className="p-4 bg-slate-950/60 border border-slate-800">
            <div className="font-hud font-bold text-xs text-cyan-300">{rule.title}</div>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{rule.description}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-[#0c1322] border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-amber-400" />
          <h3 className="font-hud font-bold text-sm text-white uppercase">PolicyService</h3>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Au chargement, le serveur interroge la politique du joueur. Si les objets aléatoires payants
          sont restreints, l’œuf en Robux est remplacé par un achat direct à prix fixe.
        </p>
        <pre className="mt-3 p-3 bg-slate-950 border border-slate-800 text-[10px] font-mono-code text-cyan-200 overflow-x-auto leading-relaxed">
{`local policy = PolicyService:GetPolicyInfoForPlayerAsync(player)
if policy.ArePaidRandomItemsRestricted then
    -- Remplacer l'œuf aléatoire par un achat direct
    offerDirectCompanion(player)
end`}
        </pre>
      </div>

      <div className="bg-[#0c1322] border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400" />
          <h3 className="font-hud font-bold text-sm text-white uppercase">Regional Pricing</h3>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          L’option de tarification régionale automatique de Roblox est activée sur tous les Passes et
          Produits Développeurs.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {['Indonésie', 'Vietnam', 'Thaïlande', 'Philippines'].map((market) => (
            <span
              key={market}
              className="px-2 py-1 text-[10px] font-mono-code bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
            >
              {market}
            </span>
          ))}
        </div>
        <div className="mt-3 text-[11px] text-slate-400 flex items-start gap-2">
          <Percent className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <span>
            Pity affiché en permanence au-dessus de l’œuf : Épique tous les {PITY.epicEvery} œufs,
            Légendaire tous les {PITY.legendaryEvery} œufs.
          </span>
        </div>
      </div>
    </div>
  </div>
);


/* ========================================================================== */
/* ARCHITECTURE TECHNIQUE                                                     */
/* ========================================================================== */

const TechniqueSection: React.FC = () => (
  <div className="space-y-4">
    <div className="bg-[#0c1322] border border-cyan-950/80 p-5 rounded-2xl">
      <SectionTitle
        icon={Cpu}
        title="Architecture mobile (cible 2 Go de RAM)"
        subtitle="Une seule Place, un seul chargement : le Sanctuaire et la piste cohabitent à 10 000 studs d’écart."
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
        <StatTile label="Écart Sanctuaire / piste" value="10 000 studs" detail="même Place" />
        <StatTile label="Transition Torii" value="< 1 s" detail="RequestStreamAroundAsync" accent="text-emerald-300" />
        <StatTile label="Joueurs / serveur" value="12 max" detail="60 FPS constants" accent="text-amber-300" />
        <StatTile label="Cible" value="2 Go RAM" detail="Android entrée de gamme" accent="text-violet-300" />
      </div>
    </div>

    <div className="space-y-2">
      {TECH_PILLARS.map((pillar) => (
        <div
          key={pillar.id}
          className="bg-[#0c1322] border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-3"
        >
          <div className="flex-1">
            <div className="font-hud font-bold text-sm text-white">{pillar.title}</div>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{pillar.detail}</p>
          </div>
          {pillar.metric && (
            <span className="self-start sm:self-center text-[10px] font-mono-code text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2 py-1 whitespace-nowrap">
              {pillar.metric}
            </span>
          )}
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="bg-[#0c1322] border border-emerald-500/30 p-4 rounded-2xl">
        <div className="flex items-center gap-2 text-emerald-300 font-hud font-bold text-xs uppercase">
          <Leaf className="w-4 h-4" />
          Région de lancement
        </div>
        <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
          {SPEC_META.launchRegion} : lumière du jour et crépuscule doré, couleurs très saturées,
          faible nombre de sources lumineuses dynamiques.
        </p>
      </div>
      <div className="bg-[#0c1322] border border-rose-500/30 p-4 rounded-2xl">
        <div className="flex items-center gap-2 text-rose-300 font-hud font-bold text-xs uppercase">
          <Lock className="w-4 h-4" />
          Reporté en Phase 3
        </div>
        <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
          Néon City (pluie, reflets, néons gourmands en GPU) reste hors du MVP pour tenir la cible
          60 FPS sur mobile d’entrée de gamme.
        </p>
      </div>
    </div>
  </div>
);

/* ========================================================================== */
/* ONBOARDING                                                                 */
/* ========================================================================== */

const OnboardingSection: React.FC = () => (
  <div className="space-y-4">
    <div className="bg-[#0c1322] border border-cyan-950/80 p-5 rounded-2xl">
      <SectionTitle
        icon={Smartphone}
        title="60 premières secondes, sans texte"
        subtitle="Aucun menu d’accueil : le joueur est lancé à pleine vitesse avant même de comprendre qu’il a rejoint une course."
      />

      <div className="space-y-2 mt-5">
        {ONBOARDING_BEATS.map((beat, index) => (
          <div
            key={beat.id}
            className="relative bg-slate-950/60 border border-slate-800 p-4 flex flex-col sm:flex-row gap-3"
          >
            <div className="flex items-center gap-3 sm:w-40 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center font-hud font-bold text-xs text-cyan-300">
                {index + 1}
              </div>
              <span className="text-[11px] font-mono-code font-bold text-amber-300 whitespace-nowrap">
                {beat.window}
              </span>
            </div>
            <div>
              <div className="font-hud font-bold text-sm text-white">{beat.title}</div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{beat.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <StatTile label="Menu d’accueil" value="Aucun" detail="jeu immédiat" accent="text-emerald-300" />
        <StatTile label="1er compagnon" value="≤ 45 s" detail="éclosion scriptée" />
        <StatTile label="1re course" value="≤ 60 s" detail="portail Torii" accent="text-amber-300" />
      </div>
    </div>
  </div>
);


/* ========================================================================== */
/* KPIs                                                                       */
/* ========================================================================== */

const KpiCard: React.FC<{ kpi: (typeof KPIS)[number] }> = ({ kpi }) => {
  const normalised = kpi.inverted
    ? 100
    : Math.min(100, Math.round((kpi.thresholdValue / Math.max(1, kpi.ambitionValue)) * 100));

  return (
    <div className="bg-[#0c1322] border border-slate-800 p-4 rounded-2xl">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[10px] font-mono-code uppercase tracking-wider text-slate-500">
            Validation Phase 1
          </div>
          <h3 className="font-hud font-bold text-sm text-white mt-0.5">{kpi.label}</h3>
        </div>
        <Trophy className="w-4 h-4 text-amber-400 flex-shrink-0" />
      </div>

      <div className="flex items-end justify-between gap-3 mt-3">
        <div>
          <div className="text-[10px] font-mono-code uppercase text-slate-500">Seuil</div>
          <div className="font-hud font-bold text-lg text-cyan-300">{kpi.threshold}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono-code uppercase text-slate-500">Ambition</div>
          <div className="font-hud font-bold text-sm text-emerald-300">{kpi.ambition}</div>
        </div>
      </div>

      <div className="mt-3 h-1.5 bg-slate-900 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400"
          style={{ width: `${normalised}%` }}
        />
      </div>

      <div className="mt-3 text-[11px] text-slate-400 flex items-start gap-1.5">
        <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
        <span>{kpi.lever}</span>
      </div>
    </div>
  );
};

const KpisSection: React.FC = () => (
  <div className="space-y-4">
    <div className="bg-[#0c1322] border border-cyan-950/80 p-5 rounded-2xl">
      <SectionTitle
        icon={Trophy}
        title="Indicateurs de réussite"
        subtitle="Le passage en Phase 2 est conditionné par la rétention J1 et la durée de session mesurées en production."
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {KPIS.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </div>

    <div className="bg-[#0c1322] border border-amber-500/30 p-4 rounded-2xl flex items-start gap-3">
      <GitBranch className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
      <div className="text-xs text-slate-300">
        <span className="font-hud font-bold text-amber-300 uppercase">Porte de sortie · </span>
        Phase 2 uniquement si Rétention J1 ≥ 18 à 20 % et Durée de session ≥ 18 à 20 minutes.
      </div>
    </div>
  </div>
);


/* ========================================================================== */
/* ROADMAP                                                                    */
/* ========================================================================== */

const STATUS_STYLES: Record<
  (typeof ROADMAP_PHASES)[number]['status'],
  { label: string; text: string; border: string; bg: string }
> = {
  done: {
    label: 'Terminé',
    text: 'text-emerald-300',
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500/10',
  },
  active: {
    label: 'En cours',
    text: 'text-cyan-300',
    border: 'border-cyan-500/50',
    bg: 'bg-cyan-500/10',
  },
  locked: {
    label: 'Verrouillé',
    text: 'text-slate-400',
    border: 'border-slate-700',
    bg: 'bg-slate-900',
  },
};

const RoadmapSection: React.FC = () => (
  <div className="space-y-3">
    {ROADMAP_PHASES.map((phase) => {
      const status = STATUS_STYLES[phase.status];
      return (
        <div
          key={phase.id}
          className={`bg-[#0c1322] border p-5 rounded-2xl ${
            phase.status === 'active' ? 'border-cyan-500/40' : 'border-slate-800'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 flex items-center justify-center border flex-shrink-0 ${status.border} ${status.bg}`}
            >
              {phase.status === 'done' ? (
                <CheckCircle2 className={`w-4 h-4 ${status.text}`} />
              ) : phase.status === 'active' ? (
                <Circle className={`w-4 h-4 ${status.text} animate-pulse`} />
              ) : (
                <Lock className={`w-4 h-4 ${status.text}`} />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-hud font-bold text-sm text-white">{phase.phase}</span>
                <span className="text-[10px] font-mono-code text-slate-500">{phase.window}</span>
                <span
                  className={`text-[9px] font-mono-code uppercase px-1.5 py-0.5 border ${status.text} ${status.border} ${status.bg}`}
                >
                  {status.label}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 mt-1">{phase.scope}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3 sm:pl-12">
            {phase.deliverables.map((deliverable) => (
              <span
                key={deliverable}
                className="text-[10px] font-mono-code text-slate-300 bg-slate-950/70 border border-slate-800 px-2 py-1"
              >
                {deliverable}
              </span>
            ))}
          </div>

          {phase.gate && (
            <div className="mt-3 sm:ml-12 p-2.5 bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200">
              {phase.gate}
            </div>
          )}
        </div>
      );
    })}
  </div>
);


/* ========================================================================== */
/* VUE PRINCIPALE                                                             */
/* ========================================================================== */

export const SpecView: React.FC<{ initialSection?: SpecSectionId }> = ({
  initialSection = 'vision',
}) => {
  const [section, setSection] = useState<SpecSectionId>(initialSection);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#070c18] via-[#091022] to-[#050912] border border-cyan-900/60 p-6 sm:p-7">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-[280px] h-[280px] bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono-code">
            <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 font-bold uppercase tracking-wider">
              {SPEC_META.version}
            </span>
            <span className="text-slate-500">
              {SPEC_META.date} · {SPEC_META.author}
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400 uppercase">Pré-production MVP</span>
          </div>

          <h1 className="mt-2 text-2xl sm:text-3xl font-bold font-hud text-white flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-cyan-400" />
            {SPEC_META.title}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl">
            {SPEC_META.subtitle} — consolidation de la course d’arcade, des compagnons et du
            Sanctuaire Zen pour un lancement mobile en Asie-Pacifique.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
            <StatTile
              label="Région de lancement"
              value="Vallée des Cerisiers"
              detail={SPEC_META.launchRegion}
            />
            <StatTile
              label="Budget Phase 1"
              value={SPEC_META.phase1Budget}
              detail="développement"
              accent="text-emerald-300"
            />
            <StatTile
              label="Serveur"
              value={`${SPEC_META.maxPlayersPerServer} joueurs`}
              detail="Place unique"
              accent="text-amber-300"
            />
            <StatTile
              label="Cible technique"
              value="60 FPS"
              detail={SPEC_META.targetDevice}
              accent="text-violet-300"
            />
          </div>
        </div>
      </div>

      {/* Navigation interne */}
      <div className="sticky top-16 z-20 -mx-4 px-4 py-2 bg-[#090d16]/95 backdrop-blur-md border-y border-cyan-950/60">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {SECTION_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-mono-code whitespace-nowrap border cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {section === 'vision' && <VisionSection />}
      {section === 'boucle' && <BoucleSection />}
      {section === 'vehicules' && <VehiculesSection />}
      {section === 'compagnons' && <CompanionsSection />}
      {section === 'raids' && <RaidsSection />}
      {section === 'monetisation' && <MonetisationSection />}
      {section === 'technique' && <TechniqueSection />}
      {section === 'onboarding' && <OnboardingSection />}
      {section === 'kpis' && <KpisSection />}
      {section === 'roadmap' && <RoadmapSection />}
    </div>
  );
};

