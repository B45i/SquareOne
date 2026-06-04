import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { TimePeriod } from '@/lib/time-period'
import { TIME_PERIOD_LABELS } from '@/lib/time-period'
import { timePeriodAtom } from '@/store/time-period-store'
import { useAtom } from 'jotai'
import { ActiveSessionCard } from '../../sessions/components/active-session-card'
import { ActivityHeatmap } from '../components/activity-heatmap'
import { StreakCard } from '../components/streak-card'
import { StudyProfileRadar } from '../components/study-profile-radar'
import { SubjectBalanceRadar } from '../components/subject-balance-radar'
import { SubjectDistributionChart } from '../components/subject-distribution-chart'
import { TodayStatsCard } from '../components/today-stats-card'
import { WeeklyBarChart } from '../components/weekly-bar-chart'

const PERIODS: TimePeriod[] = ['today', 'week', 'month', 'alltime']

export function HomePage() {
  const [period, setPeriod] = useAtom(timePeriodAtom)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end">
        <Tabs value={period} onValueChange={v => setPeriod(v as TimePeriod)}>
          <TabsList className="shrink-0">
            {PERIODS.map(p => (
              <TabsTrigger key={p} value={p}>{TIME_PERIOD_LABELS[p]}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <ActiveSessionCard />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StreakCard />
        <TodayStatsCard />
      </div>
      <ActivityHeatmap />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <WeeklyBarChart />
        <SubjectDistributionChart />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SubjectBalanceRadar />
        <StudyProfileRadar />
      </div>
    </div>
  )
}
