import ReactECharts from 'echarts-for-react'
import { useAtomValue } from 'jotai'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getBarChartData } from '@/lib/db/stats'
import { QUERY_KEYS } from '@/lib/query-keys'
import { timePeriodAtom } from '@/store/time-period-store'
import type { TimePeriod } from '@/lib/time-period'

const TITLES: Record<Exclude<TimePeriod, 'today'>, string> = {
  week: 'Daily Study Time',
  month: 'Daily Study Time',
  alltime: 'Weekly Study Time',
}

export function WeeklyBarChart() {
  const period = useAtomValue(timePeriodAtom)

  const { data = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.barChart, period === 'today' ? 'week' : period],
    queryFn: () => getBarChartData(period === 'today' ? 'week' : period),
    enabled: period !== 'today',
  })

  if (period === 'today') return null

  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 36, right: 8, top: 8, bottom: 28 },
    xAxis: {
      type: 'category',
      data: data.map(d => d.label),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 11, color: '#94a3b8' },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 11, color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#1e293b' } },
    },
    series: [{
      data: data.map(d => d.minutes),
      type: 'bar',
      barMaxWidth: 28,
      itemStyle: { color: '#22c55e', borderRadius: [4, 4, 0, 0] },
    }],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{TITLES[period]}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : (
          <ReactECharts option={option} style={{ height: 200 }} />
        )}
      </CardContent>
    </Card>
  )
}
