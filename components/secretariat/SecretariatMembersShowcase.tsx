// components/secretariat/SecretariatMembersShowcase.tsx
'use client'

import { useEffect, useState } from 'react'
import {
  AnimatedTestimonials,
  type Testimonial,
} from '@/components/ui/animated-testimonials'
import {
  secretariatMembers,
  officeLabels,
  type SecretariatMember,
} from '@/lib/secretariat/data'

type USGUser = {
  _id: string
  displayName?: string
  academicDepartment?: string
  year?: string
  office: string | null
  photoURL?: string
}

function mergeMember(
  staticMember: SecretariatMember,
  dbUsers: USGUser[],
): SecretariatMember {
  const match = dbUsers.find(
    (u) => u.office === staticMember.office, // static office key
  )

  if (!match) return staticMember

  return {
    ...staticMember,
    name: match.displayName || staticMember.name,
    academicDepartment:
      match.academicDepartment || staticMember.academicDepartment,
    year: match.year || staticMember.year,
    photoUrl: match.photoURL || staticMember.photoUrl,
    office: (match.office as SecretariatMember['office']) ?? staticMember.office,
  }
}

function toTestimonial(member: SecretariatMember): Testimonial {
  const officeLabel =
    officeLabels[member.office] ?? member.office.replace(/_/g, ' ')

  return {
    name: member.name,
    designation: `${member.roleTitle} · ${officeLabel}`,
    quote:
      `${member.academicDepartment || 'Department'}` +
      (member.year ? ` · ${member.year}` : ''),
    src: member.photoUrl,
  }
}

export function SecretariatMembersShowcase() {
  const [dbUsers, setDbUsers] = useState<USGUser[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/secretariat/usg')
        const data = await res.json()
        if (res.ok && Array.isArray(data.users)) setDbUsers(data.users)
      } catch (e) {
        console.error('usg fetch error', e)
      }
    }
    load()
  }, [])

  const mergedMembers: SecretariatMember[] = secretariatMembers.map((m) =>
    mergeMember(m, dbUsers),
  )

  const testimonials: Testimonial[] = mergedMembers.map(toTestimonial)
  if (!testimonials.length) return null

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const nextYear = currentYear + 1

  return (
    <section className="mt-10 rounded-3xl border bg-slate-50/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
      <header className="mb-6 text-center sm:text-center">
        <p className="text-[30px] font-semibold uppercase tracking-[0.18em] text-sky-600">
          SECMUN Under Secretary General Secretariat
        </p>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Meet the USG Secretariat of SECMUN of {currentYear}-{nextYear}
        </h2>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Under Secretaries‑General and secretariat members for Delegation
          Affairs, Sponsorship, Marketing, Finance, IT, PR, Conference
          Management, and Logistics.
        </p>
      </header>

      <AnimatedTestimonials testimonials={testimonials} />
    </section>
  )
}
