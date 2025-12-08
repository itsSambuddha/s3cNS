// components/secretariat/SeniorSecretariatCarousel.tsx
'use client'

import { useEffect, useState } from 'react'
import {
  Carousel,
  Card as AppleCard,
} from '@/components/ui/apple-cards-carousel'
import {
  leadershipMembers,
  type LeadershipMember,
} from '@/lib/secretariat/data'

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

const DEFAULT_AVATAR = 'https://avatars.githubusercontent.com/u/9919?v=4'

function roleLabel(role: string) {
  switch (role) {
    case 'PRESIDENT':
      return 'President'
    case 'SECRETARY_GENERAL':
      return 'Secretary General'
    case 'DIRECTOR_GENERAL':
      return 'Director General'
    case 'TEACHER':
      return 'Teacher In‑Charge'
    default:
      return role
  }
}

function mergeMember(
  staticMember: LeadershipMember,
  dbUsers: LeadershipUser[],
): LeadershipMember {
  const match = dbUsers.find(
    (u) => u.secretariatRole === staticMember.role, // static role key e.g. 'SECRETARY_GENERAL'
  )

  if (!match) return staticMember

  return {
    ...staticMember,
    name: match.displayName || staticMember.name,
    role: match.secretariatRole as LeadershipMember['role'],
    email: match.email || staticMember.email,
    phone: match.phone || staticMember.phone,
    academicDepartment:
      match.academicDepartment || staticMember.academicDepartment,
    year: match.year || staticMember.year,
    photoUrl: match.photoURL || staticMember.photoUrl,
  }
}

function toAppleCard(member: LeadershipMember) {
  return {
    src: member.photoUrl || DEFAULT_AVATAR,
    title: member.name,
    category: roleLabel(member.role),
    content: (
      <div className="space-y-2 text-sm text-neutral-800">
        <p className="font-semibold">{member.name}</p>
        <p className="text-xs font-medium text-sky-700">
          {roleLabel(member.role)}
        </p>
        <p className="text-[11px] text-neutral-500">
          {(member.academicDepartment || 'Department') +
            (member.year ? ` · ${member.year}` : '')}
        </p>
        {member.tagline && (
          <p className="pt-2 text-[11px] text-neutral-600">
            {member.tagline}
          </p>
        )}
        <div className="space-y-1 pt-3 text-[11px] text-neutral-600">
          <p>{member.email}</p>
          {member.phone && <p>{member.phone}</p>}
        </div>
      </div>
    ),
  }
}

export function SeniorSecretariatCarousel() {
  const [dbUsers, setDbUsers] = useState<LeadershipUser[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/secretariat/leadership')
        const data = await res.json()
        if (res.ok && Array.isArray(data.users)) setDbUsers(data.users)
      } catch (e) {
        console.error('leadership fetch error', e)
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
