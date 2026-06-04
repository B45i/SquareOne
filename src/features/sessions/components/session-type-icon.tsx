import { BookOpen, Dumbbell, RotateCcw } from 'lucide-react'
import type { SessionType } from '@/lib/firebase-types'

const CONFIG: Record<SessionType, { icon: React.ElementType; className: string }> = {
  Learning: { icon: BookOpen,   className: 'text-violet-500' },
  Practice: { icon: Dumbbell,   className: 'text-blue-500' },
  Revision: { icon: RotateCcw,  className: 'text-orange-500' },
}

interface SessionTypeIconProps {
  type: SessionType
  className?: string
}

export function SessionTypeIcon({ type, className }: SessionTypeIconProps) {
  const { icon: Icon, className: colorClass } = CONFIG[type]
  return <Icon className={`size-3.5 shrink-0 ${colorClass} ${className ?? ''}`} />
}
