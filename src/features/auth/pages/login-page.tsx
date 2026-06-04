import { useState } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-8 w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-4xl font-bold tracking-tight">SquareOne</span>
          <p className="text-muted-foreground text-sm">
            Track your interview prep. Build your streak.
          </p>
        </div>

        <Card className="w-full">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg">Welcome back</CardTitle>
            <CardDescription>Sign in to continue</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Continue with Google'}
            </Button>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground text-center">
          Your data is private and only visible to you.
        </p>
      </div>
    </div>
  )
}
