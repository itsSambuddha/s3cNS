// app/onboarding/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useAppUser } from '@/hooks/useAppUser'
import { RoleOnboarding } from '@/components/secretariat/RoleOnBoarding'

export default function OnboardingPage() {
  const router = useRouter()
  const { user: fbUser, loading: authLoading } = useAuth()
  const { user: appUser, loading: appLoading } = useAppUser()

  // Redirect rules
  useEffect(() => {
    if (authLoading) return

    if (!fbUser) {
      router.replace('/login?from=/onboarding')
      return
    }
  }, [authLoading, fbUser, router])

  useEffect(() => {
    if (authLoading || appLoading) return
    if (!appUser) return

    // If user already has a real secretariat role, send to dashboard
    if (appUser.secretariatRole !== 'MEMBER') {
      router.replace('/dashboard')
    }
  }, [authLoading, appLoading, appUser, router])

  if (authLoading || appLoading || !fbUser || !appUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
          <p className="mt-4 text-sm text-muted-foreground">
            Preparing your onboarding…
          </p>
        </div>
      </div>
    )
  }

  if (appUser.secretariatRole !== 'MEMBER') {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-3 py-6 sm:px-4 sm:py-10">
      <div className="w-full max-w-6xl">
        <RoleOnboarding
          initialName={appUser.displayName ?? appUser.email}
          initialEmail={appUser.email}
        />
      </div>
    </div>
  )
}
