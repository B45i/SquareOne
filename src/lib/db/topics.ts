import { deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { getUid } from '@/lib/firebase'
import { topicRef, topicsRef } from '@/lib/firebase-refs'
import type { Topic } from '@/lib/firebase-types'

interface AddTopicInput {
  name: string
  subjectId: string
}

export async function getTopicsBySubject(subjectId: string): Promise<Topic[]> {
  const q = query(topicsRef(getUid()), where('subjectId', '==', subjectId), orderBy('name'))
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data())
}

export async function getAllTopics(): Promise<Topic[]> {
  const snap = await getDocs(topicsRef(getUid()))
  return snap.docs.map(d => d.data())
}

export async function addTopic(input: AddTopicInput): Promise<string> {
  const ref = doc(topicsRef(getUid()))
  await setDoc(ref, {
    id: ref.id,
    ...input,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateTopic(topicId: string, fields: Partial<AddTopicInput>): Promise<void> {
  await updateDoc(topicRef(getUid(), topicId), fields as Record<string, unknown>)
}

export async function deleteTopic(topicId: string): Promise<void> {
  await deleteDoc(topicRef(getUid(), topicId))
}
