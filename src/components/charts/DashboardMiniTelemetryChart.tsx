import React, { useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { useLocale } from '../../context/LocaleContext';
import { cyberAudio } from '../../utils/cyberAudio';
import { buildRealAnalyticsSeries, formatDurationShort } from '../../utils/analytics';
import { TrendingUp, ChevronRight, Clock, Activity } from 'lucide-react';

interface DashboardMiniTelemetryChartProps {
  onNavigateToStats?: () => void;
}

export const DashboardMiniTelemetryChart: React.FC<DashboardMiniTelemetryChartProps> = ({
  onNavigateToStats,
}) => {
  const {
    activeProfile,
    progressEvents,
    sessionHistory,
    totalTrackedSeconds,
    sessionSeconds,
    setCurrentTab,
  } = useGame();
  const { locale, appCopy } = useLocale();
  const tHome = appCopy.home;
  const tStats = appCopy.stats;

  const series = useMemo(
    () =>
      buildRealAnalyticsSeries({
        events: progressEvents,
        sessions: sessionHistory,
        period: 'daily',
        profileId: activeProfile.id,
        locale,
      }),
    [progressEvents, sessionHistory, activeProfile.id, locale]
  );

  const maxActions = useMemo(
    () => Math.max(1, ...series.buckets.map((b) => b.actionsCount)),
    [series.buckets]
  );

  return (
    <div className="jitalx-panel p-4 sm:p-5 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#00f0ff]/10 border border-[#00f0ff]/35 text-[#00f0ff]">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-hud font-bold text-sm sm:text-base text-white uppercase tracking-wider">
                {tHome.telemetryHeading}
              </h3>
              <span className="text-[10px] font-mono-code px-1.5 py-0.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 uppercase">
                {locale === 'fr' ? 'RÉEL · 7J' : 'REAL · 7D'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {activeProfile.name} · {series.totalActions} {tStats.actionsCompleted.toLowerCase()}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            cyberAudio.playClick();
            if (onNavigateToStats) {
              onNavigateToStats();
            } else {
              setCurrentTab('stats');
            }
          }}
          className="flex items-center gap-1 text-[11px] font-hud text-[#00f0ff] hover:text-white px-2.5 py-1 border border-[#00f0ff]/40 hover:border-[#00f0ff] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>{tHome.openStats}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {!series.hasRealData ? (
        <div className="mt-3 p-4 bg-[#090216] border border-white/10 text-xs text-slate-400 flex items-center justify-between gap-3">
          <span>{tStats.emptyHistoryDesc}</span>
          <span className="font-mono-code text-[#00f0ff] shrink-0 tabular-nums">
            {formatDurationShort(sessionSeconds, locale)}
          </span>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          {/* 7-day real bar chart */}
          <div className="grid grid-cols-7 gap-2 items-end h-24 px-2 pt-4 pb-1 bg-[#090216] border border-white/10">
            {series.buckets.map((bucket) => {
              const pct =
                bucket.actionsCount > 0
                  ? Math.max(12, Math.round((bucket.actionsCount / maxActions) * 100))
                  : 4;
              return (
                <div
                  key={bucket.key}
                  className="flex flex-col items-center justify-end h-full gap-1"
                  title={`${bucket.label}: ${bucket.actionsCount} ${tStats.actionsCompleted.toLowerCase()}, ${bucket.minutesPlayed} min`}
                >
                  <div className="text-[10px] font-mono-code text-slate-300 tabular-nums">
                    {bucket.actionsCount > 0 ? bucket.actionsCount : ''}
                  </div>
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className={`w-full transition-all ${
                        bucket.actionsCount > 0
                          ? 'bg-gradient-to-t from-[#ff2a85] to-[#00f0ff]'
                          : 'bg-white/10'
                      }`}
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <div className="text-[9px] font-mono-code text-slate-400 truncate max-w-full">
                    {bucket.label.split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-code text-slate-300 px-1">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#00f0ff]" />
              {tStats.actionsCompleted}: <strong className="text-white">{series.totalActions}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#ff7b00]" />
              {tStats.timeTracked}:{' '}
              <strong className="text-white">
                {formatDurationShort(totalTrackedSeconds, locale)}
              </strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
