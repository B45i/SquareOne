import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Square } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getActiveSession } from '@/lib/db/sessions'
import { getSubjects } from '@/lib/db/subjects'
import { getAllTopics } from '@/lib/db/topics'
import type { Session } from '@/lib/firebase-types'
import { QUERY_KEYS } from '@/lib/query-keys'
import { FinishSessionDialog } from './finish-session-dialog'

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function ActiveCard({ session }: { session: Session }) {
  const [elapsed, setElapsed] = useState(() =>
    Math.floor((Date.now() - session.startTime.toMillis()) / 1000),
  )
  const [finishOpen, setFinishOpen] = useState(false)

  const { data: subjects = [] } = useQuery({ queryKey: [QUERY_KEYS.subjects], queryFn: getSubjects })
  const { data: topics = [] } = useQuery({ queryKey: [QUERY_KEYS.topics], queryFn: getAllTopics })

  const subject = subjects.find(s => s.id === session.subjectId)
  const topic = topics.find(t => t.id === session.topicId)

  useEffect(() => {
    const id = setInterval(() => setElapsed(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-base">
            <span>Active Session</span>
            <Badge variant="outline" className="font-mono text-base px-3 py-1">
              {formatElapsed(elapsed)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">
              {subject ? `${subject.emoji} ${subject.name}` : '…'} — {topic?.name ?? '…'}
            </span>
            <span className="text-sm text-muted-foreground">{session.type}</span>
          </div>
          <Button onClick={() => setFinishOpen(true)}>
            <Square className="size-4" />
            Finish
          </Button>
        </CardContent>
      </Card>

      <FinishSessionDialog
        key={finishOpen ? 'open' : 'closed'}
        open={finishOpen}
        onOpenChange={setFinishOpen}
        session={session}
        defaultDurationMinutes={Math.max(1, Math.floor(elapsed / 60))}
      />
    </>
  )
}

export function ActiveSessionCard() {
  const { data: session, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.activeSession],
    queryFn: getActiveSession,
  })

  if (isLoading) return <Skeleton className="h-[104px] rounded-xl" />
  if (!session) return null

  return <ActiveCard session={session} />
}
