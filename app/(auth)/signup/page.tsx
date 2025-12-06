// app/signup/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Signup04 } from '@/components/ui/signup-04'
import { signUpWithEmail } from '@/lib/auth/firebase'
import { setSession, syncUser } from '@/lib/auth/utils'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: {
    name: string
    email: string
    password: string
  }) => {
    setLoading(true)
    setError(null)
    try {
      const user = await signUpWithEmail(values.name, values.email, values.password)
      await syncUser(user)
      await setSession(user.uid)
      router.push('/dashboard')
    } catch (e: any) {
      setError(e?.message || 'Unable to sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Signup04
          onSubmit={handleSubmit}
          loading={loading}
          error={error ?? undefined}
        />
      </div>
    </div>
  )
}
