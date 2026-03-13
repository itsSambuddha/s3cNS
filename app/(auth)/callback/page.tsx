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
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
        <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
      </div>
      <p className="mt-6 text-sm font-medium text-slate-500 tracking-wide">Finalizing secure session...</p>
    </div>
  )
}
