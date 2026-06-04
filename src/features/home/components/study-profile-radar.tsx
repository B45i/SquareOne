import ReactECharts from 'echarts-for-react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getSummary, getSubjectStats, getPeriodStats } from '@/lib/db/stats'
import { getSessions } from '@/lib/db/sessions'
import { getSubjects } from '@/lib/db/subjects'
import { QUERY_KEYS } from '@/lib/query-keys'

// Normalization targets — what "100%" looks like for each dimension
const TARGETS = {
  consistencyDays: 14,   // 2-week streak
  volumeMinPerDay: 30,   // 30 min/day average this week
  practiceTarget: 40,    // 40% of sessions being Practice
  challengeTarget: 30,   // 30% of sessions being Hard
}

function pct(value: number, max: number) {
  return Math.min(Math.round((value / max) * 100), 100)
}

export function StudyProfileRadar() {
  const { data: summary,       isLoading: l1 } = useQuery({ queryKey: [QUERY_KEYS.summary],              queryFn: getSummary })
  const { data: sessions = [], isLoading: l2 } = useQuery({ queryKey: [QUERY_KEYS.sessions],             queryFn: getSessions })
  const { data: stats = [],    isLoading: l3 } = useQuery({ queryKey: [QUERY_KEYS.subjectStats],         queryFn: getSubjectStats })
  const { data: subjects = [], isLoading: l4 } = useQuery({ queryKey: [QUERY_KEYS.subjects],             queryFn: getSubjects })
  const { data: weekStats,     isLoading: l5 } = useQuery({ queryKey: [QUERY_KEYS.periodStats, 'week'],  queryFn: () => getPeriodStats('week') })

  const isLoading = l1 || l2 || l3 || l4 || l5

  if (!summary || sessions.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Study Profile</CardTitle></CardHeader>
        <CardContent>
          {isLoading
            ? <Skeleton className="h-[260px] w-full" />
            : <p className="text-sm text-muted-foreground py-2">Complete a few sessions to see your profile.</p>}
        </CardContent>
      </Card>
    )
  }

  const totalSessions   = sessions.length
  const practiceCount   = sessions.filter(s => s.type === 'Practice').length
  const hardCount       = sessions.filter(s => s.difficulty === 'Hard').length
  const activeSubjects  = stats.filter(s => s.totalSessions > 0).length
  const totalSubjects   = subjects.length

  const scores = {
    Consistency: pct(summary.currentStreak,                        TARGETS.consistencyDays),
    Volume:      pct((weekStats?.totalMinutes ?? 0) / 7,           TARGETS.volumeMinPerDay),
    Variety:     totalSubjects > 0 ? pct(activeSubjects, totalSubjects) : 0,
    Practice:    pct((practiceCount / totalSessions) * 100,        TARGETS.practiceTarget),
    Challenge:   pct((hardCount    / totalSessions) * 100,         TARGETS.challengeTarget),
  }

  const axes = Object.keys(scores) as (keyof typeof scores)[]

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: () =>
        axes.map(k => `${k}: ${scores[k]}%`).join('<br/>'),
    },
    radar: {
      indicator: axes.map(name => ({ name, max: 100 })),
      center: ['50%', '54%'],
      radius: '68%',
      axisLine: { lineStyle: { color: '#1e293b' } },
      splitLine: { lineStyle: { color: '#1e293b' } },
      splitArea: { areaStyle: { color: ['#0f172a', '#111827'], opacity: 1 } },
      axisName: { color: '#64748b', fontSize: 11, padding: 4 },
    },
    series: [{
      type: 'radar',
      data: [{
        value: axes.map(k => scores[k]),
        name: 'Score',
        areaStyle: { color: 'rgba(34, 197, 94, 0.15)' },
        lineStyle: { color: '#22c55e', width: 2 },
        itemStyle: { color: '#22c55e' },
        symbol: 'circle',
        symbolSize: 4,
      }],
    }],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : (
          <ReactECharts option={option} style={{ height: 260 }} />
        )}
      </CardContent>
    </Card>
  )
}
