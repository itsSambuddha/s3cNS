// app/(protected)/dashboard/page.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import Footer from '@/components/layout/Footer'

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
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">You are not signed in</h1>
        <p className="text-sm text-muted-foreground">
          Go back to the home page and sign in to access the dashboard.
        </p>
        <Link href="/">
          <Button size="sm">Return to home</Button>
        </Link>
      </div>
    )
  }

  const displayName = user.displayName ?? user.email ?? 'Secretariat member'

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
          <Button size="sm" variant="outline">
            View my profile
          </Button>
          <Button size="sm">Create quick note</Button>
        </div>
      </motion.div>

      {/* KPI cards */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        variants={pageStagger}
      >
        {[

          {
            label: 'Events',
            value: '3',
            subtitle: 'Active SEC‑NEXUS events',
            href: '/events',
          },
          {
            label: 'Finance',
            value: '12 / 14',
            subtitle: 'Budgets currently on track',
            href: '/finance',
          },
          {
            label: 'Approvals',
            value: '5',
            subtitle: 'Pending across all modules',
            href: '/admin',
          },
        ].map((card) => (
          <motion.div
            key={card.label}
            variants={fadeInUp}
            whileHover={{ y: -4, boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="cursor-pointer rounded-xl border bg-card p-4 shadow-sm"
          >
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-semibold">{card.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {card.subtitle}
            </p>
            <Link
              href={card.href}
              className="mt-3 inline-block text-xs font-medium text-primary"
            >
              Open {card.label.toLowerCase()} →
            </Link>
          </motion.div>
        ))}
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
      <Footer />
    </motion.div>
    
  )
}
