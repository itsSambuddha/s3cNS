// components/secretariat/SeniorSecretariatCarousel.tsx
"use client"

import { useEffect, useState } from "react"
import {
  Carousel,
  Card as AppleCard,
} from "@/components/ui/apple-cards-carousel"
import {
  leadershipMembers,
  type LeadershipMember,
} from "@/lib/secretariat/data"
import { BackgroundGradient } from "@/components/ui/background-gradient"

type LeadershipUser = {
  _id: string
  displayName?: string
  email: string
  phone?: string
  academicDepartment?: string
  year?: string
  secretariatRole: string
  photoURL?: string
}

const DEFAULT_AVATAR = "https://avatars.githubusercontent.com/u/9919?v=4"

function roleLabel(role: string) {
  switch (role) {
    case "PRESIDENT":
      return "President"
    case "SECRETARY_GENERAL":
      return "Secretary General"
    case "DIRECTOR_GENERAL":
      return "Director General"
    case "TEACHER":
      return "Teacher In‑Charge"
    default:
      return role
  }
}

function mergeMember(
  staticMember: LeadershipMember,
  dbUsers: LeadershipUser[],
): LeadershipMember {
  const match = dbUsers.find(
    (u) => u.secretariatRole === staticMember.role,
  )

  if (!match) return staticMember

  return {
    ...staticMember,
    name: match.displayName || staticMember.name,
    role: match.secretariatRole as LeadershipMember["role"],
    email: match.email || staticMember.email,
    phone: match.phone || staticMember.phone,
    academicDepartment:
      match.academicDepartment || staticMember.academicDepartment,
    year: match.year || staticMember.year,
    photoUrl: match.photoURL || staticMember.photoUrl,
  }
}

/**
 * Detail layout used inside the AppleCard modal.
 * AppleCard already shows title + category at the top,
 * so this content starts below that and stays compact.
 */
function SeniorDetailContent(member: LeadershipMember) {
  return (
    <div className="grid max-h-[70vh] gap-6 overflow-y-auto p-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,0.9fr)] md:p-8">
      {/* left: compact text column */}
      <div className="flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* name + role are already rendered by AppleCard via title/category */}

          <p className="text-xs text-slate-500">
            {member.academicDepartment && <span>{member.academicDepartment}</span>}
            {member.academicDepartment && member.year && <span> · </span>}
            {member.year && <span>{member.year}</span>}
          </p>
          {member.tagline && (
            <p className="mt-2 text-xs text-slate-600">
              {member.tagline}
            </p>
          )}
        </div>

        <div className="mt-2 space-y-1 text-[11px] text-slate-500">
          <p>{member.email}</p>
          {member.phone && <p>{member.phone}</p>}
        </div>
      </div>

      {/* right: smaller 3:4 gradient photo card */}
      <div className="flex items-center justify-center">
        <BackgroundGradient className="relative h-[260px] w-[190px] rounded-[20px] bg-white p-2.5 dark:bg-zinc-900 sm:h-[280px] sm:w-[205px]">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[16px] bg-slate-900/5 dark:bg-zinc-800/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.photoUrl || DEFAULT_AVATAR}
              alt={member.name}
              className="h-full w-full object-cover"
            />
          </div>
        </BackgroundGradient>
      </div>
    </div>
  )
}

function toAppleCard(member: LeadershipMember) {
  return {
    src: member.photoUrl || DEFAULT_AVATAR,
    title: member.name,                 // top heading in AppleCard
    category: roleLabel(member.role),   // small label in AppleCard
    content: <SeniorDetailContent {...member} />,
  }
}

export function SeniorSecretariatCarousel() {
  const [dbUsers, setDbUsers] = useState<LeadershipUser[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/secretariat/leadership")
        const data = await res.json()
        if (res.ok && Array.isArray(data.users)) setDbUsers(data.users)
      } catch (e) {
        console.error("leadership fetch error", e)
      }
    }
    load()
  }, [])

  const mergedMembers: LeadershipMember[] = leadershipMembers.map((m) =>
    mergeMember(m, dbUsers),
  )

  const cards = mergedMembers.map(toAppleCard)
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const nextYear = currentYear + 1

  if (!cards.length) return null

  return (
    <section className="relative max-w-[100vw] rounded-3xl sm:rounded-[2.5rem] border border-blue-200/60 dark:border-white/5 bg-white dark:bg-[#030712]/60 p-4 sm:p-12 shadow-xl shadow-blue-500/5 overflow-x-hidden group">
      {/* Dynamic Background Atmosphere */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-500/5 blur-[120px] pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-1000" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <header className="relative z-10 mb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-blue-700">
          Executive High Command
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl text-slate-900 dark:text-white leading-none">
            The Senior Secretariat
          </h2>
          <p className="text-lg font-bold text-blue-600/80 dark:text-blue-400">
            SECMUN Session {currentYear}—{nextYear}
          </p>
        </div>
        <p className="max-w-2xl mx-auto text-sm text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
          The central executive body responsible for the strategic direction,
          operational integrity, and legacy of St. Edmund's Model United Nations.
        </p>
      </header>

      <div className="relative z-10 w-full lg:px-4">
        <Carousel
          items={cards.map((card, index) => (
            <AppleCard key={card.title + index} card={card} index={index} />
          ))}
        />
      </div>
    </section>

  )
}
