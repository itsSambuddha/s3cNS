// app/(root)/page.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from 'firebase/auth'
import { firebaseAuth } from '@/lib/auth/firebase'
import { SeniorSecretariatCarousel } from '@/components/secretariat/SeniorSecretariatCarousel'
import { SecretariatMembersShowcase } from '@/components/secretariat/SecretariatMembersShowcase'
import { LandingNavbar } from '@/components/layout/LandingNavbar'
import { LampSection } from '@/components/landing/LampSection'
import { Hero } from '@/components/landing/Hero'
import { SecmunFeatures } from '@/components/landing/secmunFeatures'
import { SecmunGlobe } from '@/components/landing/secmunGlobe'

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

export default function LandingPage() {
  const { user, loading } = useAuth()

  const handleLogout = async () => {
    await signOut(firebaseAuth)
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: '' }),
    })
    window.location.href = '/'
  }

  return (
    
    <div className="space-y-16 pb-16 sm:space-y-24 sm:pb-24">
      <Hero />
      
      {/* BEFORE / AFTER SECTION */}
      
      <motion.section
        className="border-y bg-muted/40"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={staggerContainer}
      >
       {/* <LampSection />  */}
        <div className="mx-auto grid max-w-6xl gap-8 px-3 py-10 sm:px-4 sm:py-14 md:grid-cols-2">
          
          <motion.div variants={fadeInUp}>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Before s3cNS
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Spreadsheets, scattered forms, manual emails, and lost history
              between secretariats.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Separate sheets for budgets, and events</li>
              <li>• No shared record of member performance</li>
              <li>• Manual reminders and error‑prone approvals</li>
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              After s3cNS
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              A single, mobile‑ready system that captures every action with an
              audit trail and clear ownership.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Unified dashboard for events, and finance</li>
              <li>• Secretariat‑level insights across years</li>
              <li>• Automated flows for approvals, and reporting</li>
            </ul>
          </motion.div>
        </div>
      </motion.section>
      
      {/* LEADERSHIP CAROUSEL */}
<section className="mt-12 px-4 sm:px-6 lg:px-8">
  <motion.div
  
    className="mx-auto max-w-5xl"
    initial={{ opacity: 0, y: 24, scale: 0.96 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ type: 'spring', stiffness: 220, damping: 22 }}
  >
    
    <SeniorSecretariatCarousel />
    
  </motion.div>
  <div className="mt-8 flex justify-center">
    <Link href="/secretariat">
      <Button variant="outline" size="lg">
        Click here to see the complete secretariat
      </Button>
    </Link>
  </div>
</section>
{/* <section className="mt-10 px-4 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-5xl">
    <SecretariatMembersShowcase />
  </div>
</section> */}
      {/* MODULE GROUPS SECTION */}
      <motion.section
        className="mx-auto max-w-6xl px-3 sm:px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={staggerContainer}
      >
        <motion.div className="mb-6 space-y-3" variants={fadeInUp}>
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Everything your SECMUN secretariat needs.
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Clear areas instead of dozens of menus. Each group below expands
            into focused modules inside the dashboard.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            { title: 'Operations', desc: 'Tasks, meetings, and feedback workflows.' },
            { title: 'Events', desc: 'SEC‑NEXUS events and delegate CRM.' },
            { title: 'Finance', desc: 'Budgets, expenses, and club assets.' },
            { title: 'Secretariat', desc: 'Members, directory, and training resources.' },
            { title: 'Content', desc: 'News, achievements, and social scheduling.' },
            { title: 'Reports & Admin', desc: 'Reports, analytics, notifications, and integrations.' },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              transition={{ delay: idx * 0.05 }}
              className="group rounded-xl border bg-card/80 p-4 shadow-sm transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-md"
            >
              <h3 className="text-sm font-semibold sm:text-base">
                {item.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {item.desc}
              </p>
              <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-primary/80 group-hover:text-primary">
                View modules
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>
          <SecmunFeatures />
          <SecmunGlobe />
      
      {/* FINAL CTA */}
      <motion.section
        className="mx-auto max-w-6xl px-3 sm:px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <div className="rounded-2xl border bg-gradient-to-r from-primary/10 via-primary/5 to-emerald-50/40 px-4 py-6 sm:px-6 sm:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold sm:text-xl">
                Ready to run SECMUN like a real organization?
              </h2>
              <p className="text-sm text-muted-foreground sm:text-base">
                Sign in with your SECMUN account and explore the dashboard.
              </p>
            </div>

            {!loading && (
              user ? (
                <Button onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto">
                    Sign in now
                  </Button>
                </Link>
              )
            )}
          </div>
        </div>
      </motion.section>
    </div>
  )
}
