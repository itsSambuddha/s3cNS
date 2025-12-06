'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from 'firebase/auth'
import { firebaseAuth, googleProvider } from '@/lib/auth/firebase'
import { Login04 } from '@/components/ui/login-04'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  const redirectTo = searchParams.get('from') || '/dashboard'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        // User is already logged in, redirect to dashboard
        router.push(redirectTo)
      } else {
        setCheckingAuth(false)
      }
    })

    return () => unsubscribe()
  }, [router, redirectTo])

  const setAuthCookieAndRedirect = async () => {
    const user = firebaseAuth.currentUser
    if (!user) return

    const idToken = await user.getIdToken(true)

    const res = await fetch('/api/auth/set-cookie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Failed to establish session')
    }

    router.push(redirectTo)
  }

  const handleEmailSubmit = async (values: { email: string; password: string }) => {
    setLoading(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(firebaseAuth, values.email, values.password)
      await setAuthCookieAndRedirect()
    } catch (e: any) {
      setError(e?.message || 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      await signInWithPopup(firebaseAuth, googleProvider)
      await setAuthCookieAndRedirect()
    } catch (e: any) {
      setError(e?.message || 'Unable to sign in with Google')
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Login04
          onEmailSubmit={handleEmailSubmit}
          onGoogleSubmit={handleGoogleSubmit}
          loading={loading}
          error={error ?? undefined}
        />
      </div>
    </div>
  )
}
