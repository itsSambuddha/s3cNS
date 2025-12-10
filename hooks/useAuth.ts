// hooks/useAuth.ts
'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { firebaseAuth } from '@/lib/auth/firebase'

type AuthState = {
  user: User | null
  loading: boolean
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsub()
  }, [])

  return { user, loading }
}
