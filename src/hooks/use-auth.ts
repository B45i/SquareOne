import { useAtomValue } from 'jotai'
import { authLoadingAtom, userAtom } from '@/store/auth-store'

export function useAuth() {
  const user = useAtomValue(userAtom)
  const loading = useAtomValue(authLoadingAtom)
  return { user, loading }
}
