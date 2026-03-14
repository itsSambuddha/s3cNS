// app/(protected)/profile/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useAppUser } from '@/hooks/useAppUser'
import RoleOnboarding from '@/components/secretariat/role-onboarding'
import { ProfileView } from '@/components/secretariat/ProfileView'

export default function ProfilePage() {
  const router = useRouter()
  const { user: fbUser, loading: authLoading } = useAuth()
  const { user: appUser, loading: appLoading } = useAppUser() 

  if (authLoading || appLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="space-y-2 text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-xs text-muted-foreground">
            Loading your profile…
          </p>
        </div>
      </div>
    )
  }

  if (!fbUser || !appUser) {
    router.replace('/login?from=/profile')
    return null
  }

  return (
    <div className="flex min-h-[520px] items-center justify-center px-3 py-6 sm:px-4 sm:py-10">
      <div className="w-full max-w-6xl">
        <ProfileView user={appUser} />
      </div>
    </div>
  )
}
