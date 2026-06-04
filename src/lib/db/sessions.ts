import {
  doc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { format } from 'date-fns'
import { db, getUid } from '@/lib/firebase'
import {
  dailyStatRef,
  monthlyStatRef,
  sessionRef,
  sessionsRef,
  subjectStatRef,
  summaryRef,
  topicStatRef,
  weeklyStatRef,
} from '@/lib/firebase-refs'
import type { Session, SessionDifficulty, SessionType } from '@/lib/firebase-types'
import { computeStreak, mondayOf } from '@/lib/session-utils'

interface StartSessionInput {
  subjectId: string
  topicId: string
  type: SessionType
}

export interface FinishSessionInput {
  sessionId: string
  subjectId: string
  topicId: string
  date: string
  durationMinutes: number
  difficulty: SessionDifficulty
  referenceLink: string | null
  notes: string | null
}

export async function getSessions(): Promise<Session[]> {
  const q = query(
    sessionsRef(getUid()),
    where('completed', '==', true),
    orderBy('date', 'desc'),
    limit(50),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data())
}

export async function getActiveSession(): Promise<Session | null> {
  const q = query(sessionsRef(getUid()), where('completed', '==', false), limit(1))
  const snap = await getDocs(q)
  return snap.empty ? null : snap.docs[0].data()
}

export async function startSession(input: StartSessionInput): Promise<string> {
  const uid = getUid()
  const ref = doc(sessionsRef(uid))
  await setDoc(ref, {
    id: ref.id,
    ...input,
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: serverTimestamp(),
    endTime: null,
    durationMinutes: null,
    difficulty: null,
    referenceLink: null,
    notes: null,
    completed: false,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function finishSession(input: FinishSessionInput): Promise<void> {
  const uid = getUid()
  const { sessionId, subjectId, topicId, date, durationMinutes, difficulty, referenceLink, notes } = input

  await runTransaction(db, async tx => {
    const summarySnap = await tx.get(summaryRef(uid))
    const summary = summarySnap.data()

    const newStreak = computeStreak(summary?.lastStudied, date, summary?.currentStreak ?? 0)
    const newLongest = Math.max(newStreak, summary?.longestStreak ?? 0)
    const weekStart = mondayOf(date)
    const month = date.substring(0, 7)

    tx.update(sessionRef(uid, sessionId), {
      endTime: serverTimestamp(),
      durationMinutes,
      difficulty,
      referenceLink,
      notes,
      completed: true,
    })

    tx.set(
      subjectStatRef(uid, subjectId),
      { totalMinutes: increment(durationMinutes), totalSessions: increment(1), lastStudied: date },
      { merge: true },
    )

    tx.set(
      topicStatRef(uid, topicId),
      { totalMinutes: increment(durationMinutes), totalSessions: increment(1), lastStudied: date },
      { merge: true },
    )

    tx.set(
      dailyStatRef(uid, date),
      { date, totalMinutes: increment(durationMinutes), totalSessions: increment(1) },
      { merge: true },
    )

    tx.set(
      weeklyStatRef(uid, weekStart),
      { weekStart, totalMinutes: increment(durationMinutes), totalSessions: increment(1) },
      { merge: true },
    )

    tx.set(
      monthlyStatRef(uid, month),
      { month, totalMinutes: increment(durationMinutes), totalSessions: increment(1) },
      { merge: true },
    )

    tx.set(
      summaryRef(uid),
      {
        totalMinutes: increment(durationMinutes),
        totalSessions: increment(1),
        lastStudied: date,
        currentStreak: newStreak,
        longestStreak: newLongest,
      },
      { merge: true },
    )
  })
}

export async function deleteSession(session: Session): Promise<void> {
  const uid = getUid()

  if (!session.completed) {
    await runTransaction(db, async tx => { tx.delete(sessionRef(uid, session.id)) })
    return
  }

  const mins = session.durationMinutes ?? 0
  const weekStart = mondayOf(session.date)
  const month = session.date.substring(0, 7)
  const decrement = { totalMinutes: increment(-mins), totalSessions: increment(-1) }

  await runTransaction(db, async tx => {
    tx.delete(sessionRef(uid, session.id))
    tx.set(subjectStatRef(uid, session.subjectId), decrement, { merge: true })
    tx.set(topicStatRef(uid, session.topicId), decrement, { merge: true })
    tx.set(dailyStatRef(uid, session.date), decrement, { merge: true })
    tx.set(weeklyStatRef(uid, weekStart), decrement, { merge: true })
    tx.set(monthlyStatRef(uid, month), decrement, { merge: true })
    tx.set(summaryRef(uid), decrement, { merge: true })
  })
}

export async function updateSession(
  sessionId: string,
  fields: Partial<Pick<Session, 'notes' | 'referenceLink' | 'type'>>,
): Promise<void> {
  await updateDoc(sessionRef(getUid(), sessionId), fields)
}
