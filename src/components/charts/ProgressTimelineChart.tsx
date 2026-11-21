import React, { useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { useLocale } from '../../context/LocaleContext';
import { cyberAudio } from '../../utils/cyberAudio';
import {
  AnalyticsPeriod,
  buildRealAnalyticsSeries,
  formatDurationShort,
} from '../../utils/analytics';
import {
  TrendingUp,
  Clock,
  Zap,
  Activity,
  BarChart2,
  Globe2,
  Gamepad2,
  Info,
} from 'lucide-react';

interface ProgressTimelineChartProps {
  compact?: boolean;
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
}

type ChartMetric = 'actions' | 'xp' | 'minutes';

export const ProgressTimelineChart: React.FC<ProgressTimelineChartProps> = ({
  compact = false,
  title,
  subtitle,
  showFilters = true,
}) => {
  const {
    activeProfile,
    progressEvents,
    sessionHistory,
    totalTrackedSeconds,
    globalMultiGameStats,
  } = useGame();
  const { locale, appCopy } = useLocale();
  const t = appCopy.stats;

  const [period, setPeriod] = useState<AnalyticsPeriod>('daily');
  const [scope, setScope] = useState<'active' | 'all'>('active');
  const [metric, setMetric] = useState<ChartMetric>('actions');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const series = useMemo(
    () =>
      buildRealAnalyticsSeries({
        events: progressEvents,
        sessions: sessionHistory,
        period,
        profileId: scope === 'all' ? 'all' : activeProfile.id,
        locale,
      }),
    [progressEvents, sessionHistory, period, scope, activeProfile.id, locale]
  );

  const scopedTrackedSeconds =
    scope === 'all' ? globalMultiGameStats.totalTrackedSeconds : totalTrackedSeconds;
  const scopedSessionsCount = useMemo(
    () =>
      scope === 'all'
        ? sessionHistory.length
        : sessionHistory.filter((s) => s.profileId === activeProfile.id).length,
    [sessionHistory, scope, activeProfile.id]
  );

  const getBucketValue = (idx: number): number => {
    const b = series.buckets[idx];
    if (!b) return 0;
    if (metric === 'actions') return b.actionsCount;
    if (metric === 'xp') return Math.max(0, b.xpDelta);
    return b.minutesPlayed;
  };

  const maxValue = useMemo(() => {
    const values = series.buckets.map((_, i) => getBucketValue(i));
    return Math.max(1, ...values);
  }, [series.buckets, metric]);

  // SVG dimensions
  const width = 640;
  const height = compact ? 190 : 240;
  const pad = { top: 24, right: 20, bottom: 38, left: 44 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const accentColor =
    metric === 'actions' ? '#00f0ff' : metric === 'xp' ? '#ff7b00' : '#ff2a85';

  const hoveredBucket = hoveredIdx !== null ? series.buckets[hoveredIdx] : null;

  const heading = title || t.realTelemetryTitle;
  const subheading = subtitle || t.realTelemetrySubtitle;

  return (
    <div className="relative jitalx-panel p-4 sm:p-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-1.5 bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff]">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold font-hud text-white tracking-wider uppercase">
              {heading}
            </h2>
            <span className="text-[10px] font-mono-code px-2 py-0.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 uppercase font-semibold">
              {locale === 'fr' ? 'DONNÉES RÉELLES' : 'REAL DATA'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{subheading}</p>
        </div>

        {/* Scope & Period controls */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Scope toggle */}
            <div className="flex p-0.5 bg-[#090216] border border-white/10">
              <button
                type="button"
                onClick={() => {
                  cyberAudio.playClick();
                  setScope('active');
                }}
                className={`px-2.5 py-1 text-[11px] font-mono-code flex items-center gap-1 cursor-pointer transition-colors ${
                  scope === 'active'
                    ? 'bg-[#00f0ff] text-[#120428] font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Gamepad2 className="w-3 h-3" />
                <span>{t.scopeActiveGame}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  cyberAudio.playClick();
                  setScope('all');
                }}
                className={`px-2.5 py-1 text-[11px] font-mono-code flex items-center gap-1 cursor-pointer transition-colors ${
                  scope === 'all'
                    ? 'bg-[#ff2a85] text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Globe2 className="w-3 h-3" />
                <span>{t.scopeAllGames}</span>
              </button>
            </div>

            {/* Period toggle */}
            <div className="flex p-0.5 bg-[#090216] border border-white/10">
              {(
                [
                  { id: 'daily', label: t.periodDaily },
                  { id: 'weekly', label: t.periodWeekly },
                  { id: 'monthly', label: t.periodMonthly },
                ] as { id: AnalyticsPeriod; label: string }[]
              ).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    cyberAudio.playClick();
                    setPeriod(p.id);
                  }}
                  className={`px-2.5 py-1 text-[11px] font-mono-code cursor-pointer transition-colors ${
                    period === p.id
                      ? 'bg-white/15 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Metric tabs */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-3">
          {(
            [
              { id: 'actions', label: t.actionsCompleted, icon: Activity, color: 'text-[#00f0ff]' },
              { id: 'xp', label: t.xpEarned, icon: Zap, color: 'text-[#ff7b00]' },
              { id: 'minutes', label: t.timeTracked, icon: Clock, color: 'text-[#ff2a85]' },
            ] as { id: ChartMetric; label: string; icon: React.ElementType; color: string }[]
          ).map((m) => {
            const Icon = m.icon;
            const active = metric === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  cyberAudio.playClick();
                  setMetric(m.id);
                }}
                className={`px-3 py-1 text-xs font-mono-code flex items-center gap-1.5 border cursor-pointer transition-colors ${
                  active
                    ? 'bg-white/10 border-[#00f0ff]/60 text-white font-semibold'
                    : 'bg-[#090216] border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Chart Body OR Honest Empty State */}
      <div className="mt-4">
        {!series.hasRealData ? (
          <div className="p-8 bg-[#090216] border border-white/10 text-center space-y-2">
            <BarChart2 className="w-8 h-8 text-slate-500 mx-auto" />
            <div className="text-sm font-hud font-bold uppercase text-white">
              {t.emptyHistoryTitle}
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {t.emptyHistoryDesc}
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono-code text-[#00f0ff]/80 pt-1">
              <Info className="w-3.5 h-3.5" />
              <span>
                {scope === 'all'
                  ? t.scopeAllGames
                  : `${t.scopeActiveGame}: ${activeProfile.name}`}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-[#090216] border border-white/10 p-3 sm:p-4">
            {/* Hover / summary bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-white/10 text-[11px] font-mono-code text-slate-300">
              {hoveredBucket ? (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-white font-bold">{hoveredBucket.label}</span>
                  <span className="text-[#00f0ff]">
                    {hoveredBucket.actionsCount} {t.actionsCompleted.toLowerCase()}
                  </span>
                  <span className="text-[#ff7b00]">
                    {hoveredBucket.xpDelta >= 0 ? `+${hoveredBucket.xpDelta}` : hoveredBucket.xpDelta} XP
                  </span>
                  <span className="text-[#ff2a85]">{hoveredBucket.minutesPlayed} min</span>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3 text-slate-400">
                  <span>
                    {scope === 'all'
                      ? t.scopeAllGames
                      : `${t.scopeActiveGame}: ${activeProfile.name}`}
                  </span>
                  <span>·</span>
                  <span className="text-slate-200">
                    {series.totalActions} {t.actionsCompleted.toLowerCase()}
                  </span>
                </div>
              )}
              <span className="text-[10px] text-slate-500 uppercase">
                {locale === 'fr' ? 'Survoler une barre pour le détail' : 'Hover any bar for details'}
              </span>
            </div>

            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto select-none"
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Horizontal grid lines */}
              {[0, 0.5, 1].map((ratio) => {
                const y = pad.top + plotH - ratio * plotH;
                const val = Math.round(maxValue * ratio * 10) / 10;
                return (
                  <g key={ratio}>
                    <line
                      x1={pad.left}
                      y1={y}
                      x2={pad.left + plotW}
                      y2={y}
                      stroke="rgba(255,255,255,0.08)"
                      strokeDasharray={ratio === 0 ? undefined : '3 3'}
                    />
                    <text
                      x={pad.left - 8}
                      y={y + 3}
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Bars */}
              {series.buckets.map((bucket, idx) => {
                const count = series.buckets.length || 1;
                const slotW = plotW / count;
                const barW = Math.max(14, Math.min(44, slotW * 0.56));
                const x = pad.left + idx * slotW + (slotW - barW) / 2;
                const val = getBucketValue(idx);
                const barH = val > 0 ? Math.max(4, (val / maxValue) * plotH) : 0;
                const y = pad.top + plotH - barH;
                const isHovered = hoveredIdx === idx;

                return (
                  <g
                    key={bucket.key}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(idx)}
                  >
                    {/* Invisible hover hit area */}
                    <rect
                      x={pad.left + idx * slotW}
                      y={pad.top}
                      width={slotW}
                      height={plotH + 24}
                      fill="transparent"
                    />
                    {/* Bar */}
                    <rect
                      x={x}
                      y={y}
                      width={barW}
                      height={barH}
                      rx={3}
                      fill={accentColor}
                      fillOpacity={isHovered ? 1 : 0.72}
                    />
                    {/* Value label above bar if non-zero */}
                    {val > 0 && (
                      <text
                        x={x + barW / 2}
                        y={y - 6}
                        fill="#ffffff"
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {metric === 'minutes' ? `${val}m` : val}
                      </text>
                    )}
                    {/* X-axis label */}
                    <text
                      x={x + barW / 2}
                      y={pad.top + plotH + 16}
                      fill={isHovered ? '#ffffff' : '#94a3b8'}
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {bucket.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>

      {/* Real Persisted Metrics Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/10">
        <div className="p-3 jitalx-panel-deep">
          <div className="text-[10px] font-mono-code text-slate-400 uppercase">
            {t.actionsCompleted}
          </div>
          <div className="text-lg font-bold font-mono-code text-[#00f0ff] tabular-nums mt-0.5">
            {series.totalActions}
          </div>
        </div>

        <div className="p-3 jitalx-panel-deep">
          <div className="text-[10px] font-mono-code text-slate-400 uppercase">{t.xpEarned}</div>
          <div className="text-lg font-bold font-mono-code text-[#ff7b00] tabular-nums mt-0.5">
            {series.totalXp >= 0 ? `+${series.totalXp}` : series.totalXp} XP
          </div>
        </div>

        <div className="p-3 jitalx-panel-deep">
          <div className="text-[10px] font-mono-code text-slate-400 uppercase">{t.timeTracked}</div>
          <div className="text-lg font-bold font-mono-code text-white tabular-nums mt-0.5">
            {formatDurationShort(scopedTrackedSeconds, locale)}
          </div>
        </div>

        <div className="p-3 jitalx-panel-deep">
          <div className="text-[10px] font-mono-code text-slate-400 uppercase">
            {t.sessionsCount}
          </div>
          <div className="text-lg font-bold font-mono-code text-[#ff2a85] tabular-nums mt-0.5">
            {scopedSessionsCount}
          </div>
        </div>
      </div>
    </div>
  );
};
