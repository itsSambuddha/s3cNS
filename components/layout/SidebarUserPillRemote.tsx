// components/layout/SidebarUserPillRemote.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type DbUser = {
  displayName?: string | null
  email?: string | null
  photoURL?: string | null
  role?: string | null
  secretariatRole?: string | null
  office?: string | null
}

export function SidebarUserPillRemote() {
  const [user, setUser] = useState<DbUser | null>(null)
  const [loading, setLoading] = useState(true)

useEffect(() => {
  let cancelled = false

  const load = async () => {
    console.log("SidebarUserPill: fetching /api/users/me")
    try {
      const res = await fetch("/api/users/me", { cache: "no-store" })
      console.log("SidebarUserPill: status", res.status)
      if (!res.ok) {
        if (!cancelled) setUser(null)
        return
      }
      const data = await res.json()
      console.log("SidebarUserPill: data", data)
      if (!cancelled) setUser(data.user ?? null)
    } catch (e) {
      console.error("SidebarUserPill error", e)
      if (!cancelled) setUser(null)
    } finally {
      if (!cancelled) setLoading(false)
    }
  }

  load()
  return () => {
    cancelled = true
  }
}, [])


  if (loading || !user) return null

  const name = user.displayName || user.email || "Secretariat user"
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const avatarUrl = user.photoURL ?? undefined
  const role = user.role ?? undefined
  const secRole = user.secretariatRole ?? undefined
  const office = user.office ?? undefined

  // Admin: show role only
  // Office bearer: show office only
  // Others: role · secretariatRole (if both)
  let subtitle = ""
  if (role === "ADMIN") {
    subtitle = role
  } else if (role === "OFFICE_BEARER") {
    subtitle = office || "Office bearer"
  } else {
    subtitle = role || ""
    if (secRole) {
      subtitle = subtitle ? `${subtitle} · ${secRole}` : secRole
    }
  }

  return (
    <Link
      href="/profile"
      className="group flex items-center gap-2 rounded-2xl bg-white/80 px-2 py-1.5 text-xs text-slate-800 shadow-sm hover:bg-white dark:bg-slate-800/90 dark:text-slate-100 dark:hover:bg-slate-700"
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={name}
          className="h-7 w-7 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500 text-[11px] font-semibold text-white">
          {initials}
        </div>
      )}

      <div className="flex flex-col">
        <span className="truncate text-[11px] font-medium">{name}</span>
        {subtitle && (
          <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {subtitle}
          </span>
        )}
      </div>
    </Link>
  )
}
