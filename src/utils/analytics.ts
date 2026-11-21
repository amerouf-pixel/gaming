import { ProgressEvent, SessionRecord } from '../types';

export type AnalyticsPeriod = 'daily' | 'weekly' | 'monthly';

export interface AnalyticsBucket {
  key: string;
  label: string;
  actionsCount: number;
  completionsCount: number;
  xpDelta: number;
  minutesPlayed: number;
}

export interface AnalyticsSeriesResult {
  period: AnalyticsPeriod;
  hasRealData: boolean;
  buckets: AnalyticsBucket[];
  totalActions: number;
  totalCompletions: number;
  totalXp: number;
  totalMinutes: number;
}

export function toLocalDateKey(dateInput: Date | number): string {
  const d = typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getIsoWeekKey(date: Date): { key: string; label: string } {
  const copy = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = copy.getUTCDay() || 7;
  copy.setUTCDate(copy.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(copy.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((copy.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  const key = `${copy.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
  return { key, label: `W${String(weekNo).padStart(2, '0')}` };
}

function getMonthKey(date: Date, locale: 'en' | 'fr'): { key: string; label: string } {
  const year = date.getFullYear();
  const monthIdx = date.getMonth();
  const key = `${year}-${String(monthIdx + 1).padStart(2, '0')}`;
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsFr = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const label = (locale === 'fr' ? monthsFr : monthsEn)[monthIdx] || key;
  return { key, label };
}

/**
 * Aggregates REAL persisted progressEvents and sessionHistory into Daily / Weekly / Monthly buckets.
 * Never fabricates data: if no events and no sessions match the scope, `hasRealData` is `false`.
 */
export function buildRealAnalyticsSeries(params: {
  events: ProgressEvent[];
  sessions: SessionRecord[];
  period: AnalyticsPeriod;
  profileId: string | 'all';
  locale?: 'en' | 'fr';
  nowMs?: number;
}): AnalyticsSeriesResult {
  const { events, sessions, period, profileId, locale = 'en', nowMs = Date.now() } = params;
  const now = new Date(nowMs);

  const scopedEvents =
    profileId === 'all' ? events : events.filter((e) => e.profileId === profileId);
  const scopedSessions =
    profileId === 'all' ? sessions : sessions.filter((s) => s.profileId === profileId);

  const bucketList: AnalyticsBucket[] = [];
  const bucketMap = new Map<string, AnalyticsBucket>();

  if (period === 'daily') {
    const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayNamesFr = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const key = toLocalDateKey(d);
      const label = `${(locale === 'fr' ? dayNamesFr : dayNamesEn)[d.getDay()]} ${d.getDate()}`;
      const bucket: AnalyticsBucket = {
        key,
        label,
        actionsCount: 0,
        completionsCount: 0,
        xpDelta: 0,
        minutesPlayed: 0,
      };
      bucketList.push(bucket);
      bucketMap.set(key, bucket);
    }

    for (const ev of scopedEvents) {
      const target = bucketMap.get(ev.dateKey || toLocalDateKey(ev.timestamp));
      if (!target) continue;
      target.actionsCount += 1;
      if (ev.delta > 0) target.completionsCount += ev.delta;
      target.xpDelta += ev.xpDelta || 0;
    }

    for (const sess of scopedSessions) {
      const target = bucketMap.get(sess.dateKey || toLocalDateKey(sess.startedAt));
      if (!target) continue;
      target.minutesPlayed += sess.durationSeconds / 60;
    }
  } else if (period === 'weekly') {
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i * 7);
      const { key, label } = getIsoWeekKey(d);
      if (!bucketMap.has(key)) {
        const bucket: AnalyticsBucket = {
          key,
          label,
          actionsCount: 0,
          completionsCount: 0,
          xpDelta: 0,
          minutesPlayed: 0,
        };
        bucketList.push(bucket);
        bucketMap.set(key, bucket);
      }
    }

    for (const ev of scopedEvents) {
      const { key } = getIsoWeekKey(new Date(ev.timestamp));
      const target = bucketMap.get(key);
      if (!target) continue;
      target.actionsCount += 1;
      if (ev.delta > 0) target.completionsCount += ev.delta;
      target.xpDelta += ev.xpDelta || 0;
    }

    for (const sess of scopedSessions) {
      const { key } = getIsoWeekKey(new Date(sess.startedAt));
      const target = bucketMap.get(key);
      if (!target) continue;
      target.minutesPlayed += sess.durationSeconds / 60;
    }
  } else {
    // monthly (last 6 months)
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const { key, label } = getMonthKey(d, locale);
      const bucket: AnalyticsBucket = {
        key,
        label,
        actionsCount: 0,
        completionsCount: 0,
        xpDelta: 0,
        minutesPlayed: 0,
      };
      bucketList.push(bucket);
      bucketMap.set(key, bucket);
    }

    for (const ev of scopedEvents) {
      const { key } = getMonthKey(new Date(ev.timestamp), locale);
      const target = bucketMap.get(key);
      if (!target) continue;
      target.actionsCount += 1;
      if (ev.delta > 0) target.completionsCount += ev.delta;
      target.xpDelta += ev.xpDelta || 0;
    }

    for (const sess of scopedSessions) {
      const { key } = getMonthKey(new Date(sess.startedAt), locale);
      const target = bucketMap.get(key);
      if (!target) continue;
      target.minutesPlayed += sess.durationSeconds / 60;
    }
  }

  // Round minutes for clean rendering
  let totalActions = 0;
  let totalCompletions = 0;
  let totalXp = 0;
  let totalMinutes = 0;

  for (const b of bucketList) {
    b.minutesPlayed = Math.round(b.minutesPlayed * 10) / 10;
    totalActions += b.actionsCount;
    totalCompletions += b.completionsCount;
    totalXp += b.xpDelta;
    totalMinutes += b.minutesPlayed;
  }

  const hasRealData = scopedEvents.length > 0 || scopedSessions.some((s) => s.durationSeconds >= 5);

  return {
    period,
    hasRealData,
    buckets: bucketList,
    totalActions,
    totalCompletions,
    totalXp,
    totalMinutes: Math.round(totalMinutes * 10) / 10,
  };
}

export function formatDurationShort(totalSeconds: number, locale: 'en' | 'fr' = 'en'): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
  if (m > 0) return `${m}m ${String(s).padStart(2, '0')}s`;
  return locale === 'fr' ? `${s} s` : `${s}s`;
}
