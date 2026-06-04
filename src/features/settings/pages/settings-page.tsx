import { ROUTES } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'

const TABS = [
  { label: 'Subjects', to: ROUTES.SETTINGS_SUBJECTS },
  { label: 'Topics', to: ROUTES.SETTINGS_TOPICS },
]

export function SettingsPage() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname === ROUTES.SETTINGS) {
      navigate(ROUTES.SETTINGS_SUBJECTS, { replace: true })
    }
  }, [location.pathname, navigate])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-1 border-b">
        {TABS.map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              location.pathname === to
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </Link>
        ))}
      </div>

      <Outlet />
    </div>
  )
}
