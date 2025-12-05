// app/(root)/page.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

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
  const router = useRouter()
  const { user, loading } = useAuth()

  const handlePrimaryClick = () => {
    if (loading) return
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="space-y-16 pb-16 sm:space-y-24 sm:pb-24">
      {/* HERO */}
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-3 pt-10 sm:px-4 sm:pt-16 lg:flex-row lg:items-center">
        <motion.div
          className="flex-1 space-y-5"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-[11px] text-muted-foreground sm:text-xs"
            variants={fadeInUp}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Mobile‑first · PWA‑ready · Built for SECMUN
          </motion.div>

          <motion.div className="space-y-4" variants={fadeInUp}>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              One platform for every
              <span className="block text-primary">SECMUN operation.</span>
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              s3cNS centralizes attendance, events, finances, documents, and
              secretariat workflows into a single, secure dashboard that works
              beautifully on phones and desktops.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-3"
            variants={fadeInUp}
          >
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={handlePrimaryClick}
              disabled={loading}
            >
              {loading
                ? 'Checking session…'
                : user
                ? 'Go to dashboard'
                : 'Sign in to dashboard'}
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              disabled
            >
              Explore public modules (soon)
            </Button>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-4 text-xs text-muted-foreground sm:text-sm"
            variants={fadeInUp}
          >
            <span>• Fast on low‑end devices</span>
            <span>• Works great as a PWA</span>
            <span>• Designed for non‑technical users</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mx-auto w-full max-w-md rounded-2xl border bg-card/80 p-4 shadow-sm sm:p-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Today&apos;s snapshot
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
                <span>Attendance marked</span>
                <span className="font-semibold">78%</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
                <span>Budgets on track</span>
                <span className="font-semibold text-emerald-500">12 / 14</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
                <span>Active events</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
                <span>Pending approvals</span>
                <span className="font-semibold text-amber-500">5</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* BEFORE / AFTER SECTION */}
      <motion.section
        className="border-y bg-muted/40"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={staggerContainer}
      >
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
              <li>• Separate sheets for attendance, budgets, and events</li>
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
              <li>• Unified dashboard for attendance, events, and finance</li>
              <li>• Secretariat‑level insights across years</li>
              <li>• Automated flows for routine, approvals, and reporting</li>
            </ul>
          </motion.div>
        </div>
      </motion.section>

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
            { title: 'Operations', desc: 'Attendance, tasks, meetings, and feedback workflows.' },
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
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Sign in now
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
