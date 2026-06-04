import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useSetAtom } from 'jotai'
import { auth } from '@/lib/firebase'
import { authLoadingAtom, userAtom } from '@/store/auth-store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useSetAtom(userAtom)
  const setLoading = useSetAtom(authLoadingAtom)

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
  }, [setUser, setLoading])

  return <>{children}</>
}
