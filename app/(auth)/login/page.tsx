'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Login04 } from '@/components/ui/login-04'
import { signInWithGoogle } from '@/lib/auth/firebase'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      const userCredential = await signInWithGoogle()
      const { user } = userCredential

      await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          picture: user.photoURL,
        }),
      })

      const idToken = await user.getIdToken()

      await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      })

      router.push('/')
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
          onEmailSubmit={async () => {
            // TODO: plug in your auth logic here
          }}
          onGoogleSubmit={handleGoogleSignIn}
          loading={loading}
          error={error ?? undefined}
          // adjust props to match generated component API
        />
      </div>
    </div>
  )
}
