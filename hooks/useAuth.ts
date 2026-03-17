// hooks/useAuth.ts
'use client'

import { useEffect, useState, useRef } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { firebaseAuth } from '@/lib/auth/firebase'

type AuthState = {
  user: User | null
  loading: boolean
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const sessionSynced = useRef(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      setUser(currentUser)

      // Sync the server-side session cookie
      if (currentUser && !sessionSynced.current) {
        try {
          const idToken = await currentUser.getIdToken()
          await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ idToken }),
          })
          sessionSynced.current = true
        } catch (err) {
          console.error('[useAuth] Failed to sync session cookie:', err)
        }
      } else if (!currentUser && sessionSynced.current) {
        // Clear the session cookie on sign-out
        try {
          await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ idToken: null }),
          })
          sessionSynced.current = false
        } catch (err) {
          console.error('[useAuth] Failed to clear session cookie:', err)
        }
      }

      setLoading(false)
    })

    return () => unsub()
  }, [])

  return { user, loading }
}
