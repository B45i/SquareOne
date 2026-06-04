import { Clock, BookOpen } from 'lucide-react'
import { useAtomValue } from 'jotai'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getPeriodStats } from '@/lib/db/stats'
import { QUERY_KEYS } from '@/lib/query-keys'
import { TIME_PERIOD_LABELS } from '@/lib/time-period'
import { timePeriodAtom } from '@/store/time-period-store'

export function TodayStatsCard() {
  const period = useAtomValue(timePeriodAtom)

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.periodStats, period],
    queryFn: () => getPeriodStats(period),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{TIME_PERIOD_LABELS[period]}</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="size-4" />
            <span className="text-sm">Minutes</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-10 w-16" />
          ) : (
            <span className="text-4xl font-bold">{data?.totalMinutes ?? 0}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <BookOpen className="size-4" />
            <span className="text-sm">Sessions</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-10 w-10" />
          ) : (
            <span className="text-4xl font-bold">{data?.totalSessions ?? 0}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
