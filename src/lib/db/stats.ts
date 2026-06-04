import { addDays, format, getDaysInMonth, parseISO, startOfISOWeek, startOfMonth, subDays } from 'date-fns'
import { getDoc, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { getUid } from '@/lib/firebase'
import {
  dailyStatRef,
  dailyStatsRef,
  monthlyStatRef,
  subjectStatsRef,
  summaryRef,
  topicStatsRef,
  weeklyStatRef,
  weeklyStatsRef,
} from '@/lib/firebase-refs'
import type { DailyStat, SubjectStat, Summary, TopicStat, WeeklyStat } from '@/lib/firebase-types'
import type { TimePeriod } from '@/lib/time-period'
import { mondayOf } from '@/lib/session-utils'

export interface PeriodStats {
  totalMinutes: number
  totalSessions: number
}

export interface BarDataPoint {
  label: string
  minutes: number
}

export async function getSummary(): Promise<Summary | undefined> {
  const snap = await getDoc(summaryRef(getUid()))
  return snap.data()
}

export async function getSubjectStats(): Promise<(SubjectStat & { id: string })[]> {
  const snap = await getDocs(subjectStatsRef(getUid()))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getTopicStats(): Promise<(TopicStat & { id: string })[]> {
  const snap = await getDocs(topicStatsRef(getUid()))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getDailyStats(): Promise<DailyStat[]> {
  const startDate = format(subDays(new Date(), 365), 'yyyy-MM-dd')
  const q = query(
    dailyStatsRef(getUid()),
    where('date', '>=', startDate),
    orderBy('date', 'asc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data())
}

export async function getWeeklyStats(): Promise<WeeklyStat[]> {
  const q = query(weeklyStatsRef(getUid()), orderBy('weekStart', 'desc'), limit(12))
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data())
}

export async function getPeriodStats(period: TimePeriod): Promise<PeriodStats> {
  const uid = getUid()
  const today = format(new Date(), 'yyyy-MM-dd')

  if (period === 'today') {
    const snap = await getDoc(dailyStatRef(uid, today))
    const data = snap.data()
    return { totalMinutes: data?.totalMinutes ?? 0, totalSessions: data?.totalSessions ?? 0 }
  }
  if (period === 'week') {
    const snap = await getDoc(weeklyStatRef(uid, mondayOf(today)))
    const data = snap.data()
    return { totalMinutes: data?.totalMinutes ?? 0, totalSessions: data?.totalSessions ?? 0 }
  }
  if (period === 'month') {
    const snap = await getDoc(monthlyStatRef(uid, today.substring(0, 7)))
    const data = snap.data()
    return { totalMinutes: data?.totalMinutes ?? 0, totalSessions: data?.totalSessions ?? 0 }
  }
  // alltime
  const snap = await getDoc(summaryRef(uid))
  const data = snap.data()
  return { totalMinutes: data?.totalMinutes ?? 0, totalSessions: data?.totalSessions ?? 0 }
}

export async function getBarChartData(period: Exclude<TimePeriod, 'today'>): Promise<BarDataPoint[]> {
  const uid = getUid()

  if (period === 'week') {
    const monday = startOfISOWeek(new Date())
    const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i))
    const start = format(days[0], 'yyyy-MM-dd')
    const end = format(days[6], 'yyyy-MM-dd')
    const q = query(dailyStatsRef(uid), where('date', '>=', start), where('date', '<=', end))
    const snap = await getDocs(q)
    const byDate: Record<string, number> = {}
    snap.docs.forEach(d => { byDate[d.data().date] = d.data().totalMinutes })
    return days.map(d => ({
      label: format(d, 'EEE'),
      minutes: byDate[format(d, 'yyyy-MM-dd')] ?? 0,
    }))
  }

  if (period === 'month') {
    const now = new Date()
    const firstOfMonth = startOfMonth(now)
    const days = Array.from({ length: getDaysInMonth(now) }, (_, i) => addDays(firstOfMonth, i))
    const start = format(firstOfMonth, 'yyyy-MM-dd')
    const end = format(days[days.length - 1], 'yyyy-MM-dd')
    const q = query(dailyStatsRef(uid), where('date', '>=', start), where('date', '<=', end))
    const snap = await getDocs(q)
    const byDate: Record<string, number> = {}
    snap.docs.forEach(d => { byDate[d.data().date] = d.data().totalMinutes })
    return days.map(d => ({
      label: format(d, 'd'),
      minutes: byDate[format(d, 'yyyy-MM-dd')] ?? 0,
    }))
  }

  // alltime — last 12 weeks
  const q = query(weeklyStatsRef(uid), orderBy('weekStart', 'desc'), limit(12))
  const snap = await getDocs(q)
  return snap.docs
    .map(d => d.data())
    .reverse()
    .map(w => ({ label: format(parseISO(w.weekStart), 'MMM d'), minutes: w.totalMinutes }))
}
