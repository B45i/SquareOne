import logoSvg from '@/assets/logo.svg'
import { Button } from '@/components/ui/button'
import { auth, googleProvider } from '@/lib/firebase'
import { signInWithPopup } from 'firebase/auth'
import { BarChart2, BookOpen, Flame } from 'lucide-react'
import { useState } from 'react'

const FEATURES = [
  { icon: BookOpen, label: 'Log sessions by subject and topic' },
  { icon: Flame, label: 'Build and maintain a daily streak' },
  { icon: BarChart2, label: 'Visualize progress over time' },
]

export function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGoogleSignIn() {
    setLoading(true)
    setError('')
    try {
      await signInWithPopup(auth, googleProvider)
    } catch {
      setError('Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm flex flex-col gap-10">

        <div className="flex flex-col items-center gap-4 text-center">
          <img src={logoSvg} alt="SquareOne" className="size-16" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">SquareOne</h1>
            <p className="text-muted-foreground text-sm mt-1">Study tracker</p>
          </div>
        </div>

        <ul className="flex flex-col gap-3">
          {FEATURES.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted">
                <Icon className="size-3.5" />
              </span>
              {label}
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3">
          <Button
            className="w-full py-6"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Continue with Google'}
          </Button>
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
        </div>

      </div>
    </div>
  )
}
