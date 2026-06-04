import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getDailyStats } from '@/lib/db/stats'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useQuery } from '@tanstack/react-query'
import { addDays, format, subDays } from 'date-fns'
import ReactECharts from 'echarts-for-react'
import { useEffect, useRef, useState } from 'react'

const TODAY = new Date()
const START_DATE = subDays(TODAY, 364)
const NUM_WEEKS = 53
const LEFT_PAD = 24
const TOP_PAD = 24

export function ActivityHeatmap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [cs, setCs] = useState(13)
  const gapColor = 'oklch(0.218 0.008 223.9)';

  useEffect(() => {
    const el = containerRef.current
    if (!el) return



    const ro = new ResizeObserver(([entry]) => {
      setCs(Math.max(8, Math.floor((entry.contentRect.width - LEFT_PAD) / NUM_WEEKS)))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { data: dailyStats = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.dailyStats],
    queryFn: getDailyStats,
  })

  const byDate = Object.fromEntries(dailyStats.map(d => [d.date, d.totalSessions]))
  const heatmapData: [string, number][] = Array.from({ length: 365 }, (_, i) => {
    const date = format(addDays(START_DATE, i), 'yyyy-MM-dd')
    return [date, byDate[date] ?? 0]
  })

  const chartHeight = TOP_PAD + 7 * cs + 4

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params: { value: [string, number] }) => {
        const [date, sessions] = params.value
        return `${date}: ${sessions} session${sessions !== 1 ? 's' : ''}`
      },
    },
    visualMap: {
      show: false,
      min: 0,
      max: 4,
      inRange: { color: ['#1e293b', '#166534', '#15803d', '#16a34a', '#22c55e'] },
    },
    calendar: {
      left: LEFT_PAD,
      top: TOP_PAD,
      right: 0,
      bottom: 0,
      range: [format(START_DATE, 'yyyy-MM-dd'), format(TODAY, 'yyyy-MM-dd')],
      cellSize: [cs, cs],
      splitLine: { show: false },
      itemStyle: { color: 'transparent', borderWidth: 0 },
      yearLabel: { show: false },
      monthLabel: { fontSize: 10, color: '#64748b', nameMap: 'en', margin: 4 },
      dayLabel: { show: true, firstDay: 1, color: '#64748b', fontSize: 10, margin: 4 },
    },
    series: [{
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: heatmapData,
      itemStyle: { borderWidth: 2, borderColor: gapColor },
    }],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div ref={containerRef}>
          {isLoading ? (
            <Skeleton className="w-full" style={{ height: chartHeight }} />
          ) : (
            <ReactECharts
              key={cs}
              option={option}
              style={{ height: chartHeight, width: '100%' }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
