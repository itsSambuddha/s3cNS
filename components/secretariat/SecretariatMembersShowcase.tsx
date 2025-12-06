'use client'

import {
  AnimatedTestimonials,
  Testimonial,
} from '@/components/ui/animated-testimonials'
import {
  secretariatMembers,
  officeLabels,
  type SecretariatMember,
} from '@/lib/secretariat/data'

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
  const testimonials: Testimonial[] = secretariatMembers.map(toTestimonial)

  if (!testimonials.length) return null

    const currenDate = new Date();
  const currentYear = currenDate.getFullYear();
  const nextYear = currentYear + 1;


  return (
    <section className="mt-10 rounded-3xl border bg-slate-50/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
      <header className="mb-6 text-center sm:text-center">
<p className="text-[30px] font-semibold uppercase tracking-[0.18em] text-sky-600">
          SECMUN Under Secretary General Secretariat
        </p>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Meet the USG Secretariat of SEC-MUN of {currentYear}-{nextYear}
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
