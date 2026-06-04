import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { ROUTES } from '@/lib/routes'
import { Outlet, useLocation } from 'react-router'
import { AppSidebar } from './app-sidebar'

const PAGE_TITLES: Record<string, string> = {
  [ROUTES.HOME]: 'Home',
  [ROUTES.SESSIONS]: 'Sessions',
  [ROUTES.SETTINGS]: 'Settings',
  [ROUTES.SETTINGS_SUBJECTS]: 'Subjects',
  [ROUTES.SETTINGS_TOPICS]: 'Topics',
}

function usePageTitle(): string {
  const { pathname } = useLocation()
  return PAGE_TITLES[pathname] ?? ''
}

export function AppLayout() {
  const title = usePageTitle()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          {title && <span className="text-sm font-medium">{title}</span>}
        </header>
        <div className="p-6 overflow-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
