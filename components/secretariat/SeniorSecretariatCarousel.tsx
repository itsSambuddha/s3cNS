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
    <section className="rounded-3xl border bg-slate-50/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
      <header className="mb-6 text-center">
        <p className="text-[30px] font-semibold uppercase tracking-[0.18em] text-sky-600">
          SECMUN Senior Secretariat
        </p>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Meet the Senior Secretariat of SEC-MUN of {currentYear}-{nextYear}
        </h2>
        <p className="text-xs text-muted-foreground sm:text-sm">
          President, Secretary General, Director General, and Teachers in
          Charge.
        </p>
      </header>

      <div className="w-full">
        <Carousel
          items={cards.map((card, index) => (
            <AppleCard key={card.title + index} card={card} index={index} />
          ))}
        />
      </div>
    </section>
  )
}
