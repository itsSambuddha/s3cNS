import { useEffect, useState } from "react"
import { onAuthStateChanged, getIdToken } from "firebase/auth"
import { firebaseAuth as auth } from '@/lib/auth/firebase'

export function useAuth() {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        const token = await getIdToken(fbUser, true)
        const res = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()

        // fall back to Firebase fields if API fails
        const merged = data.user ?? {
          uid: fbUser.uid,
          displayName: fbUser.displayName,
          email: fbUser.email,
          photoURL: fbUser.photoURL,
          role: "MEMBER",
          secretariatRole: null,
        }

        setUser(merged)
      } catch (e) {
        console.error("useAuth /api/me error", e)
        setUser({
          uid: fbUser.uid,
          displayName: fbUser.displayName,
          email: fbUser.email,
          photoURL: fbUser.photoURL,
          role: "MEMBER",
          secretariatRole: null,
        })
      } finally {
        setLoading(false)
      }
    })

    return () => unsub()
  }, [])

  return { user, loading }
}
