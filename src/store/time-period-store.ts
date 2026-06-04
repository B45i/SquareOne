import { atom } from 'jotai'
import type { TimePeriod } from '@/lib/time-period'

export const timePeriodAtom = atom<TimePeriod>('today')
