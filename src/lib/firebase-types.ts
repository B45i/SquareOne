import type { Timestamp } from 'firebase/firestore'

export interface Subject {
  id: string
  name: string
  color: string
  emoji: string
  isDefault: boolean
  createdAt: Timestamp
}

export interface Topic {
  id: string
  subjectId: string
  name: string
  createdAt: Timestamp
}

export type SessionType = 'Learning' | 'Practice' | 'Revision'
export type SessionDifficulty = 'Easy' | 'Medium' | 'Hard'

export interface Session {
  id: string
  subjectId: string
  topicId: string
  date: string             // "YYYY-MM-DD"
  startTime: Timestamp
  endTime: Timestamp | null
  durationMinutes: number | null
  type: SessionType
  difficulty: SessionDifficulty | null
  referenceLink: string | null
  notes: string | null
  completed: boolean
  createdAt: Timestamp
}

// ---- Stats ----

export interface SubjectStat {
  totalMinutes: number
  totalSessions: number
  lastStudied: string      // "YYYY-MM-DD"
}

export interface TopicStat {
  totalMinutes: number
  totalSessions: number
  lastStudied: string      // "YYYY-MM-DD"
}

export interface DailyStat {
  date: string             // "YYYY-MM-DD"
  totalMinutes: number
  totalSessions: number
}

export interface WeeklyStat {
  weekStart: string        // "YYYY-MM-DD" — Monday of the week
  totalMinutes: number
  totalSessions: number
}

export interface MonthlyStat {
  month: string            // "YYYY-MM"
  totalMinutes: number
  totalSessions: number
}

export interface Summary {
  totalMinutes: number
  totalSessions: number
  currentStreak: number
  longestStreak: number
  lastStudied: string      // "YYYY-MM-DD"
  topicsCovered: number
}
