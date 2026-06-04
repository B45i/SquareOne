import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import { AppLayout } from '@/shell/app-layout'
import { AuthGuard } from '@/shell/auth-guard'
import { GuestGuard } from '@/shell/guest-guard'
import { LoginPage } from '@/features/auth/pages/login-page'
import { HomePage } from '@/features/home/pages/home-page'
import { SessionsPage } from '@/features/sessions/pages/sessions-page'
import { SettingsPage } from '@/features/settings/pages/settings-page'
import { SubjectsPage } from '@/features/settings/pages/subjects-page'
import { TopicsPage } from '@/features/settings/pages/topics-page'
import { ROUTES } from '@/lib/routes'

const router = createBrowserRouter([
  { path: '/', element: <Navigate to={ROUTES.HOME} replace /> },
  {
    element: <GuestGuard />,
    children: [{ path: ROUTES.LOGIN, element: <LoginPage /> }],
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: ROUTES.HOME, element: <HomePage /> },
          { path: ROUTES.SESSIONS, element: <SessionsPage /> },
          {
            path: ROUTES.SETTINGS,
            element: <SettingsPage />,
            children: [
              { path: ROUTES.SETTINGS_SUBJECTS, element: <SubjectsPage /> },
              { path: ROUTES.SETTINGS_TOPICS, element: <TopicsPage /> },
            ],
          },
        ],
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
