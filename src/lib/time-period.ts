export type TimePeriod = 'today' | 'week' | 'month' | 'alltime'

export const TIME_PERIOD_LABELS: Record<TimePeriod, string> = {
  today: 'Today',
  week: 'This Week',
  month: 'This Month',
  alltime: 'All Time',
}
