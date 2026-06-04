import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { ActiveSessionCard } from '../components/active-session-card'
import { SessionHistory } from '../components/session-history'
import { StartSessionDialog } from '../components/start-session-dialog'

export function SessionsPage() {
  const [startOpen, setStartOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end">
        <Button onClick={() => setStartOpen(true)}>
          <Plus className="size-4" />
          New Session
        </Button>
      </div>

      <ActiveSessionCard />

      <div>
        <h2 className="mb-3 text-lg font-medium">History</h2>
        <SessionHistory />
      </div>

      <StartSessionDialog
        key={startOpen ? 'open' : 'closed'}
        open={startOpen}
        onOpenChange={setStartOpen}
      />
    </div>
  )
}
