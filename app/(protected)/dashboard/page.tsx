// app/(protected)/dashboard/page.tsx
'use client'

import { useAuth } from '@/hooks/useAuth'

export default function DashboardPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <p>Loading dashboard…</p>
  }

  if (!user) {
    return <p>You are not signed in. Go to the home page and sign in.</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Signed in as {user.email ?? user.displayName ?? 'Unknown user'}.
      </p>
    </div>
  )
}
