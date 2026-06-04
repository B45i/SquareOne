import ReactECharts from 'echarts-for-react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getSubjectStats } from '@/lib/db/stats'
import { getSubjects } from '@/lib/db/subjects'
import { QUERY_KEYS } from '@/lib/query-keys'

export function SubjectBalanceRadar() {
  const { data: stats = [], isLoading: statsLoading } = useQuery({
    queryKey: [QUERY_KEYS.subjectStats],
    queryFn: getSubjectStats,
  })
  const { data: subjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: [QUERY_KEYS.subjects],
    queryFn: getSubjects,
  })

  const isLoading = statsLoading || subjectsLoading

  const items = stats.flatMap(stat => {
    const subj = subjects.find(s => s.id === stat.id)
    return subj ? [{ name: `${subj.emoji} ${subj.name}`, minutes: stat.totalMinutes }] : []
  })

  const maxMinutes = Math.max(...items.map(i => i.minutes), 1)

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params: { name: string; value: number[] }) =>
        items.map((item, i) => `${item.name}: ${params.value[i]}m`).join('<br/>'),
    },
    radar: {
      indicator: items.map(i => ({ name: i.name, max: maxMinutes })),
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
        value: items.map(i => i.minutes),
        name: 'Minutes',
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
        <CardTitle>Subject Balance</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : items.length < 3 ? (
          <p className="text-sm text-muted-foreground py-2">Need at least 3 subjects with sessions.</p>
        ) : (
          <ReactECharts option={option} style={{ height: 260 }} />
        )}
      </CardContent>
    </Card>
  )
}
