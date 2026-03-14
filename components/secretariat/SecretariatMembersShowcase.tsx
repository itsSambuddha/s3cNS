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
  type OfficeKey,
} from '@/lib/secretariat/data'

type USGUser = {
  _id: string
  displayName?: string
  academicDepartment?: string
  year?: string
  office: string | null
  secretariatRole: string
  photoURL?: string
}

function toTestimonial(member: SecretariatMember): Testimonial {
  const officeLabel =
    officeLabels[member.office] ?? member.office.replace(/_/g, ' ')

  // Use the actual role from the database if available, else default to USG
  const roleName = member.roleTitle || 'Under Secretary‑General'

  return {
    name: member.name,
    designation: `${roleName} · ${officeLabel}`,
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

  // Create a combined list:
  // For each OfficeKey, check if we have ACTIVE USGs/Deputies in the database.
  // If yes, show all of them. If no, show the static placeholder for that office.
  const officeKeys: OfficeKey[] = [
    'FINANCE',
    'LOGISTICS',
    'DELEGATIONS',
    'ACADEMICS',
    'PUBLIC_RELATIONS',
    'MARKETING',
    'IT_DESIGN',
    'IT_SOCIAL_MEDIA',
    'CONFERENCE_MANAGEMENT',
  ]

  const mergedMembers: SecretariatMember[] = []

  officeKeys.forEach((key) => {
    const activeInOffice = dbUsers.filter((u) => u.office === key)
    if (activeInOffice.length > 0) {
      activeInOffice.forEach((user) => {
        const roleLabel =
          user.secretariatRole === 'DEPUTY_USG'
            ? 'Deputy Under Secretary‑General'
            : 'Under Secretary‑General'

        mergedMembers.push({
          id: user._id,
          name: user.displayName || 'To be announced',
          roleTitle: roleLabel,
          office: user.office as OfficeKey,
          photoUrl: user.photoURL || '/placeholders/member.jpg',
          email: '',
          academicDepartment: user.academicDepartment,
          year: user.year,
        })
      })
    } else {
      // Fallback to static placeholder for this office
      const placeholder = secretariatMembers.find((m) => m.office === key)
      if (placeholder) mergedMembers.push(placeholder)
    }
  })

  const testimonials: Testimonial[] = mergedMembers.map(toTestimonial)
  if (!testimonials.length) return null

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const nextYear = currentYear + 1

  return (
    <section className="mt-16 relative w-full max-w-[100vw] overflow-x-hidden rounded-3xl sm:rounded-[2.5rem] border border-blue-200/60 bg-white dark:bg-[#030712]/60 p-4 sm:p-12 shadow-xl shadow-blue-500/5 group">
      <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-emerald-500/5 blur-[100px] pointer-events-none" />

      <header className="relative z-10 mb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/50 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
          Operational Secretariat
        </div>        <div className="space-y-2">
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl text-slate-900 dark:text-white leading-none">
            The USG Bureau
          </h2>
          <p className="text-lg font-bold text-emerald-600/80 dark:text-emerald-400">
            Strategic Pillar of {currentYear}-{nextYear}
          </p>
        </div>
        <p className="max-w-2xl mx-auto text-sm text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
          Under Secretaries‑General and secretariat members for Delegation
          Affairs, Sponsorship, Marketing, Finance, IT, PR, Conference
          Management, and Logistics.
        </p>
      </header>

      <AnimatedTestimonials testimonials={testimonials} />
    </section>
  )
}
