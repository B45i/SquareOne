import { differenceInCalendarDays, format, parseISO, startOfISOWeek } from 'date-fns'

export function mondayOf(date: string): string {
  return format(startOfISOWeek(parseISO(date)), 'yyyy-MM-dd')
}

export function computeStreak(
  lastStudied: string | undefined,
  today: string,
  currentStreak: number,
): number {
  if (!lastStudied) return 1

  const diff = differenceInCalendarDays(parseISO(today), parseISO(lastStudied))

  if (diff === 0) return currentStreak
  if (diff === 1) return currentStreak + 1
  if (diff > 1) return 1
  return currentStreak
}
