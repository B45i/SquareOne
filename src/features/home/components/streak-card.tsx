import { Flame } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const DUMMY = { currentStreak: 7, longestStreak: 21, lastStudied: '2026-06-03' }

export function StreakCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="size-5 text-orange-500" />
          Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <span className="text-4xl font-bold">{DUMMY.currentStreak}</span>
          <span className="ml-1 text-muted-foreground">days</span>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <span>
            Best: <strong className="text-foreground">{DUMMY.longestStreak}</strong>
          </span>
          <span>
            Last:{' '}
            <strong className="text-foreground">
              {format(parseISO(DUMMY.lastStudied), 'MMM d')}
            </strong>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
