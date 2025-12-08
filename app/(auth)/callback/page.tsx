'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Handle the callback logic here, then redirect
    // For now, we'll just redirect to the dashboard
    router.push('/dashboard')
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <p className="mt-4 text-sm text-muted-foreground">Please wait...</p>
      </div>
    </div>
  )
}
