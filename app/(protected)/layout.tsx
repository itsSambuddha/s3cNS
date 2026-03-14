// app/(protected)/layout.tsx
'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useAppUser } from '@/hooks/useAppUser'
import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'
import { Button } from '@/components/ui/button'
import { ShieldAlert, Clock, XCircle } from 'lucide-react'

// These roles are auto-approved and bypass memberStatus checks
const BYPASS_ROLES = ['PRESIDENT', 'SECRETARY_GENERAL', 'DIRECTOR_GENERAL', 'TEACHER']

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { loading: authLoading } = useAuth()
  const { user: appUser, loading: appLoading } = useAppUser()

  const isLoading = authLoading || appLoading

  // Show a minimal spinner while loading auth/user state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">Loading workspace…</p>
        </div>
      </div>
    )
  }

  // If we have a user, check memberStatus (unless they belong to a bypass role)
  // If we have a user, check memberStatus (unless they belong to a bypass role)
  if (appUser && !BYPASS_ROLES.includes(appUser.secretariatRole)) {
    // Only show the "under review/rejected" screens if they have finished onboarding.
    const hasFinishedOnboarding = appUser.secretariatRole !== 'MEMBER' || !!appUser.year

    if (hasFinishedOnboarding) {
      if (appUser.memberStatus === 'APPLICANT') {
        return (
          <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="mx-auto max-w-lg text-center space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <Clock className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Your account is under review for approval
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A senior member of the Secretariat will review your application
                  shortly. You'll be able to access the workspace once your
                  account is approved.
                </p>
              </div>
              <Link href="/">
                <Button variant="outline" className="rounded-full px-6">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        )
      }

      if (appUser.memberStatus === 'REJECTED') {
        return (
          <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="mx-auto max-w-lg text-center space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                <XCircle className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Your account has been rejected
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Unfortunately, your secretariat application was not approved.
                  Please try again with a new account or contact a senior
                  Secretariat member for assistance.
                </p>
              </div>
              <Link href="/">
                <Button variant="outline" className="rounded-full px-6">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        )
      }
    }
  }

  // Approved / bypass — render normal layout
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <Sidebar />
      <div className="flex flex-1 flex-col">
        {/* Mobile navbar has menu, desktop navbar acts as topbar */}
        <Navbar />
        <main className="flex-1 px-3 py-4 sm:px-6 sm:py-6">
          <div className="mx-auto w-full max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
