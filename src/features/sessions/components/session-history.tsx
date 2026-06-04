import { format, parseISO } from 'date-fns'
import { Calendar, Clock, Flame, Minus, Sprout } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getSessions } from '@/lib/db/sessions'
import { getSubjects } from '@/lib/db/subjects'
import { getAllTopics } from '@/lib/db/topics'
import type { SessionDifficulty } from '@/lib/firebase-types'
import { QUERY_KEYS } from '@/lib/query-keys'
import { SessionTypeIcon } from './session-type-icon'

const DIFFICULTY_CONFIG: Record<SessionDifficulty, { icon: React.ElementType; className: string }> = {
  Easy:   { icon: Sprout, className: 'text-emerald-500' },
  Medium: { icon: Minus,  className: 'text-amber-500' },
  Hard:   { icon: Flame,  className: 'text-red-500' },
}

const TYPE_COLORS: Record<string, string> = {
  Practice: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Learning: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  Revision: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
}

export function SessionHistory() {
  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: [QUERY_KEYS.sessions],
    queryFn: getSessions,
  })
  const { data: subjects = [] } = useQuery({ queryKey: [QUERY_KEYS.subjects], queryFn: getSubjects })
  const { data: topics = [] } = useQuery({ queryKey: [QUERY_KEYS.topics], queryFn: getAllTopics })

  if (sessionsLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[72px] rounded-xl" />
        ))}
      </div>
    )
  }

  if (sessions.length === 0) {
    return <p className="text-sm text-muted-foreground">No sessions yet.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {sessions.map(session => {
        const subject = subjects.find(s => s.id === session.subjectId)
        const topic = topics.find(t => t.id === session.topicId)
        const diff = session.difficulty ? DIFFICULTY_CONFIG[session.difficulty] : null
        const DiffIcon = diff?.icon
        const typeClass = TYPE_COLORS[session.type] ?? 'bg-muted text-muted-foreground'

        return (
          <Card key={session.id}>
            <CardContent className="flex items-center gap-4 py-3 px-4">
              <div className="size-11 rounded-lg bg-background flex items-center justify-center text-2xl shrink-0 select-none shadow-sm">
                {subject?.emoji ?? '📚'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-semibold leading-tight">{subject?.name ?? '…'}</span>
                  <span className="text-muted-foreground/50">·</span>
                  <span className="text-muted-foreground truncate">{topic?.name ?? '…'}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5 shrink-0" />
                    {format(parseISO(session.date), 'MMM d')}
                  </span>
                  {session.durationMinutes != null && (
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5 shrink-0" />
                      {session.durationMinutes}m
                    </span>
                  )}
                  {diff && DiffIcon && (
                    <span className={`flex items-center gap-1 ${diff.className}`}>
                      <DiffIcon className="size-3.5 shrink-0" />
                      {session.difficulty}
                    </span>
                  )}
                </div>
              </div>

              <Badge className={`shrink-0 border-0 font-medium gap-1.5 ${typeClass}`}>
                <SessionTypeIcon type={session.type} />
                {session.type}
              </Badge>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
