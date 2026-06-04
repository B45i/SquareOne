import { deleteDoc, doc, getDocs, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { getUid } from '@/lib/firebase'
import { subjectRef, subjectsRef } from '@/lib/firebase-refs'
import type { Subject } from '@/lib/firebase-types'

interface AddSubjectInput {
  name: string
  color: string
  emoji: string
}

interface UpdateSubjectInput {
  name?: string
  color?: string
  emoji?: string
}

export async function getSubjects(): Promise<Subject[]> {
  const snap = await getDocs(subjectsRef(getUid()))
  return snap.docs.map(d => d.data())
}

export async function addSubject(input: AddSubjectInput): Promise<string> {
  const ref = doc(subjectsRef(getUid()))
  await setDoc(ref, {
    id: ref.id,
    ...input,
    isDefault: false,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateSubject(subjectId: string, fields: UpdateSubjectInput): Promise<void> {
  await updateDoc(subjectRef(getUid(), subjectId), fields as Record<string, unknown>)
}

export async function deleteSubject(subjectId: string): Promise<void> {
  await deleteDoc(subjectRef(getUid(), subjectId))
}
