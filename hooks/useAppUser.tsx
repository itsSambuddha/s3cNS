// hooks/useAppUser.ts
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'

export type AppUser = {
  _id: string
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  role: 'ADMIN' | 'LEADERSHIP' | 'TEACHER' | 'OFFICE_BEARER' | 'MEMBER'
  phone?: string
  rollNo?: string
  year?: string
  academicDepartment?: string
  secretariatRole: 'PRESIDENT' | 'SECRETARY_GENERAL' | 'DIRECTOR_GENERAL' | 'USG' | 'TEACHER' | 'MEMBER'
  office: string | null
  memberStatus: 'ACTIVE' | 'ALUMNI' | 'APPLICANT' | 'REJECTED'
  canManageMembers: boolean
  canApproveUSG: boolean
  canManageFinance: boolean
  canManageEvents: boolean
}

type State = {
  user: AppUser | null
  loading: boolean
  error: string | null
}

export function useAppUser(): State {
  const { user: fbUser, loading: authLoading } = useAuth()
  const [state, setState] = useState<State>({
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (authLoading) return
    if (!fbUser) {
      setState({ user: null, loading: false, error: null })
      return
    }

    let cancelled = false

    const load = async () => {
      setState((s) => ({ ...s, loading: true }))
      try {
        // no admin verification yet – just pass uid/email
        const res = await fetch('/api/users/me', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
          }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Failed to load user')
        }
        const data = await res.json()
        if (!cancelled) {
          setState({ user: data.user as AppUser, loading: false, error: null })
        }
      } catch (e: any) {
        if (!cancelled) {
          setState({
            user: null,
            loading: false,
            error: e?.message || 'Failed to load user',
          })
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [authLoading, fbUser])

  return state
}
