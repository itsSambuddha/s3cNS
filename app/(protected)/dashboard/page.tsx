'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useAppUser } from '@/hooks/useAppUser'
import { usePushRegistration } from '@/hooks/usePushRegistration'
import { FinanceCard } from './FinanceCard'



const pageStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
}

export default function DashboardPage() {
  const router = useRouter()
  const { user: fbUser, loading: authLoading } = useAuth()
  const { user: appUser, loading: appLoading } = useAppUser()
  usePushRegistration()

  if (authLoading || appLoading) {
    return (
      <div className="space-y-2">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (!fbUser || !appUser) {
    return (
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">You are not signed in</h1>
        <p className="text-sm text-muted-foreground">
          Go back to the home page and sign in to access the dashboard.
        </p>
        <Link href="/login">
          <Button size="sm">Go to login</Button>
        </Link>
      </div>
    )
  }

  // If the user is still MEMBER, send them to onboarding page
  if (appUser.secretariatRole === 'MEMBER') {
    router.replace('/onboarding')
    return null
  }

  const displayName = appUser.displayName ?? appUser.email ?? 'Secretariat member'

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={pageStagger}
    >
      {/* Header strip */}
      <motion.div
        variants={scaleIn}
        className="flex flex-col gap-3 rounded-2xl border bg-gradient-to-r from-primary/5 via-background to-emerald-50/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-5"
      >
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-primary/80">
            Dashboard
          </p>
          <h1 className="text-xl font-semibold sm:text-2xl">
            Welcome back, {displayName}.
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            This overview will soon reflect your real events, finances, and approvals based on your role.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
            <Link href="/profile">
              <Button size="sm" variant="outline">
                View my profile
              </Button>
            </Link>

          <Button size="sm">Create quick note</Button>
        </div>
      </motion.div>

      {/* KPI cards */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        variants={pageStagger}
      >
        <motion.div
          variants={fadeInUp}
          whileHover={{ y: -4, boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="cursor-pointer rounded-xl border bg-card p-4 shadow-sm"
        >
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Events
          </p>
          <p className="mt-2 text-2xl font-semibold">3</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Active SEC‑NEXUS events
          </p>
          <Link
            href="/events"
            className="mt-3 inline-block text-xs font-medium text-primary"
          >
            Open events →
          </Link>
        </motion.div>

        <FinanceCard />

        <motion.div
          variants={fadeInUp}
          whileHover={{ y: -4, boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="cursor-pointer rounded-xl border bg-card p-4 shadow-sm"
        >
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Approvals
          </p>
          <p className="mt-2 text-2xl font-semibold">5</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Pending across all modules
          </p>
          <Link
            href="/admin"
            className="mt-3 inline-block text-xs font-medium text-primary"
          >
            Open approvals →
          </Link>
        </motion.div>
      </motion.div>

      {/* Module groups quick access */}
      <motion.div
        className="grid gap-4 lg:grid-cols-2"
        variants={pageStagger}
      >
        {[
          {
            title: 'Operations',
            desc: 'Tasks, meetings, and feedback workflows.',
            href: '#',
          },
          {
            title: 'Events',
            desc: 'SEC‑NEXUS events, delegates, and surveys.',
            href: '/events',
          },
          {
            title: 'Finance',
            desc: 'Budgets, expenses, and inventory.',
            href: '/finance',
          },
          {
            title: 'Secretariat & Content',
            desc: 'Members, directory, training, news, and achievements.',
            href: '/directory',
          },
        ].map((group) => (
          <motion.div
            key={group.title}
            variants={fadeInUp}
            whileHover={{ y: -3, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="group flex flex-col justify-between rounded-xl border bg-card p-4 shadow-sm"
          >
            <div>
              <h2 className="text-sm font-semibold sm:text-base">
                {group.title}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {group.desc}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <Link
                href={group.href}
                className="font-medium text-primary group-hover:underline"
              >
                View modules →
              </Link>
              <span className="rounded-full bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                Protected
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
