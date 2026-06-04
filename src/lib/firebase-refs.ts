import {
  collection,
  doc,
  type CollectionReference,
  type DocumentReference,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type {
  Subject,
  Topic,
  Session,
  SubjectStat,
  TopicStat,
  DailyStat,
  WeeklyStat,
  MonthlyStat,
  Summary,
} from '@/lib/firebase-types'

function converter<T>(): FirestoreDataConverter<T> {
  return {
    toFirestore: (data: T) => data as object,
    fromFirestore: (snap: QueryDocumentSnapshot) => ({ id: snap.id, ...snap.data() }) as T,
  }
}

export function subjectsRef(uid: string): CollectionReference<Subject> {
  return collection(db, 'users', uid, 'subjects').withConverter(converter<Subject>())
}

export function subjectRef(uid: string, subjectId: string): DocumentReference<Subject> {
  return doc(db, 'users', uid, 'subjects', subjectId).withConverter(converter<Subject>())
}

export function topicsRef(uid: string): CollectionReference<Topic> {
  return collection(db, 'users', uid, 'topics').withConverter(converter<Topic>())
}

export function topicRef(uid: string, topicId: string): DocumentReference<Topic> {
  return doc(db, 'users', uid, 'topics', topicId).withConverter(converter<Topic>())
}

export function sessionsRef(uid: string): CollectionReference<Session> {
  return collection(db, 'users', uid, 'sessions').withConverter(converter<Session>())
}

export function sessionRef(uid: string, sessionId: string): DocumentReference<Session> {
  return doc(db, 'users', uid, 'sessions', sessionId).withConverter(converter<Session>())
}

export function subjectStatRef(uid: string, subjectId: string): DocumentReference<SubjectStat> {
  return doc(db, 'users', uid, 'subjectStats', subjectId).withConverter(converter<SubjectStat>())
}

export function subjectStatsRef(uid: string): CollectionReference<SubjectStat> {
  return collection(db, 'users', uid, 'subjectStats').withConverter(converter<SubjectStat>())
}

export function topicStatRef(uid: string, topicId: string): DocumentReference<TopicStat> {
  return doc(db, 'users', uid, 'topicStats', topicId).withConverter(converter<TopicStat>())
}

export function topicStatsRef(uid: string): CollectionReference<TopicStat> {
  return collection(db, 'users', uid, 'topicStats').withConverter(converter<TopicStat>())
}

export function dailyStatRef(uid: string, date: string): DocumentReference<DailyStat> {
  return doc(db, 'users', uid, 'dailyStats', date).withConverter(converter<DailyStat>())
}

export function dailyStatsRef(uid: string): CollectionReference<DailyStat> {
  return collection(db, 'users', uid, 'dailyStats').withConverter(converter<DailyStat>())
}

export function weeklyStatRef(uid: string, weekStart: string): DocumentReference<WeeklyStat> {
  return doc(db, 'users', uid, 'weeklyStats', weekStart).withConverter(converter<WeeklyStat>())
}

export function weeklyStatsRef(uid: string): CollectionReference<WeeklyStat> {
  return collection(db, 'users', uid, 'weeklyStats').withConverter(converter<WeeklyStat>())
}

export function monthlyStatRef(uid: string, month: string): DocumentReference<MonthlyStat> {
  return doc(db, 'users', uid, 'monthlyStats', month).withConverter(converter<MonthlyStat>())
}

export function summaryRef(uid: string): DocumentReference<Summary> {
  return doc(db, 'users', uid, 'stats', 'summary').withConverter(converter<Summary>())
}
