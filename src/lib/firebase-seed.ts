import { getDocs, writeBatch, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { subjectsRef } from '@/lib/firebase-refs'

const DEFAULT_SUBJECTS = [
  { name: 'JavaScript',    emoji: '🟨', color: '#F7DF1E' },
  { name: 'React',         emoji: '⚛️',  color: '#61DAFB' },
  { name: 'TypeScript',    emoji: '🔷', color: '#3178C6' },
  { name: 'Node.js',       emoji: '🟩', color: '#339933' },
  { name: 'System Design', emoji: '🏗️', color: '#6366F1' },
  { name: 'DSA',           emoji: '🧠', color: '#F59E0B' },
  { name: 'Behavioral',    emoji: '🗣️', color: '#10B981' },
]

export async function seedDefaultSubjects(uid: string): Promise<void> {
  const existing = await getDocs(subjectsRef(uid))
  if (!existing.empty) return

  const batch = writeBatch(db)
  for (const subject of DEFAULT_SUBJECTS) {
    const ref = doc(subjectsRef(uid))
    batch.set(ref, {
      id: ref.id,
      ...subject,
      isDefault: true,
      createdAt: serverTimestamp(),
    })
  }
  await batch.commit()
}
