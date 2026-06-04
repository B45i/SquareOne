import { Loader2 } from 'lucide-react'
import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/hooks/use-auth'
import { ROUTES } from '@/lib/routes'

export function GuestGuard() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (user) return <Navigate to={ROUTES.HOME} replace />

  return <Outlet />
}
