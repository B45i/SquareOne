import ReactECharts from 'echarts-for-react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getSubjectStats } from '@/lib/db/stats'
import { getSubjects } from '@/lib/db/subjects'
import { QUERY_KEYS } from '@/lib/query-keys'

export function SubjectDistributionChart() {
  const { data: stats = [], isLoading: statsLoading } = useQuery({
    queryKey: [QUERY_KEYS.subjectStats],
    queryFn: getSubjectStats,
  })
  const { data: subjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: [QUERY_KEYS.subjects],
    queryFn: getSubjects,
  })

  const isLoading = statsLoading || subjectsLoading

  const items = stats
    .flatMap(stat => {
      const subj = subjects.find(s => s.id === stat.id)
      return subj ? [{ label: `${subj.emoji}  ${subj.name}`, sessions: stat.totalSessions, color: subj.color }] : []
    })
    .sort((a, b) => a.sessions - b.sessions)

  const option = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 8, right: 16, top: 8, bottom: 8, containLabel: true },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 11, color: '#64748b' },
      splitLine: { lineStyle: { color: '#1e293b' } },
    },
    yAxis: {
      type: 'category',
      data: items.map(d => d.label),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 12, color: '#94a3b8', rich: {} },
    },
    series: [{
      type: 'bar',
      barMaxWidth: 20,
      data: items.map(d => ({
        value: d.sessions,
        itemStyle: { color: d.color, borderRadius: [0, 4, 4, 0] },
      })),
    }],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessions by Subject</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">No data yet.</p>
        ) : (
          <ReactECharts option={option} style={{ height: Math.max(160, items.length * 32) }} />
        )}
      </CardContent>
    </Card>
  )
}
