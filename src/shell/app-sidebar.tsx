import { House, Settings, Timer } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { ROUTES } from '@/lib/routes'
import { NavUser } from './nav-user'
import logoSvg from '@/assets/logo.svg'

interface NavItem {
  route: string
  label: string
  icon: React.ElementType
  matchPrefix?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { route: ROUTES.HOME,     label: 'Home',     icon: House },
  { route: ROUTES.SESSIONS, label: 'Sessions', icon: Timer },
  { route: ROUTES.SETTINGS, label: 'Settings', icon: Settings, matchPrefix: true },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-2 py-4">
        <div className="flex items-center gap-2 px-2">
          <img src={logoSvg} alt="SquareOne" className="size-7 shrink-0" />
          <span className="text-base font-bold tracking-tight group-data-[collapsible=icon]:hidden">
            SquareOne
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(({ route, label, icon: Icon, matchPrefix }) => (
                <SidebarMenuItem key={route}>
                  <SidebarMenuButton
                    asChild
                    isActive={matchPrefix ? location.pathname.startsWith(route) : location.pathname === route}
                    tooltip={label}
                  >
                    <Link to={route}>
                      <Icon className="size-4" />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
