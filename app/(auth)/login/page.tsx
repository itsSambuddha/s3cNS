'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { firebaseAuth, googleProvider } from '@/lib/auth/firebase'
import { Login04 } from '@/components/ui/login-04'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectTo = searchParams.get('from') || '/dashboard'

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
