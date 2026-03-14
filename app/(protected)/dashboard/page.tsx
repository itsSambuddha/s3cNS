"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useAppUser } from "@/hooks/useAppUser"
import { usePushRegistration } from "@/hooks/usePushRegistration"
import { FinanceCard } from "./FinanceCard"
import { canUseDaModule } from "@/lib/da/access"
import { canManageDelegationTeam } from "@/lib/delegation-team/access"

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

  const [summary, setSummary] = useState<{
    eventsCount: number
    pendingApprovals: number
  } | null>(null)

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const res = await fetch("/api/dashboard/summary")
        if (res.ok) {
          const data = await res.json()
          setSummary(data)
        }
      } catch (err) {
        console.error("Failed to load dashboard summary:", err)
      }
    }
    if (fbUser && appUser) {
      loadSummary()
    }
  }, [fbUser, appUser])

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

  // Simple onboarding redirect: if they haven't picked a role (or filled academic details), send to onboarding
  const hasOnboarded = appUser.secretariatRole !== "MEMBER" || !!appUser.year
  if (!hasOnboarded) {
    router.replace("/onboarding")
    return null
  }

  const displayName =
    appUser.displayName ?? appUser.email ?? "Secretariat member"

  // SHOW DA CARD ONLY FOR: role === ADMIN AND secretariatOffice === DELEGATION_AFFAIRS
  const showDaCard = canUseDaModule(appUser)

  // SHOW DELEGATION TEAM CARD FOR: President, SG, DG, Teachers, Admins
  const showDelegationTeamCard = canManageDelegationTeam(appUser)


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
        className="group relative overflow-hidden rounded-[2rem] border border-blue-200/60 bg-white p-8 shadow-xl shadow-blue-500/5 dark:border-white/5 dark:bg-[#030712]/80"
      >
        <div className="absolute top-0 right-0 w-[40%] h-full bg-blue-400/5 blur-[80px] pointer-events-none group-hover:bg-blue-400/10 transition-colors" />
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
              Authorized Workspace
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl leading-tight">
                Welcome back, {displayName}.
              </h1>
              <p className="max-w-xl text-sm font-medium text-slate-500 dark:text-zinc-400">
                This overview now reflects real events, finances, and
                approvals based on the live database.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/profile">
              <Button size="lg" variant="outline" className="rounded-full px-6 font-bold shadow-sm transition-all hover:bg-slate-50">
                View my profile
              </Button>
            </Link>
            <Button size="lg" className="rounded-full px-6 font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:scale-[1.03]">
              Create quick note
            </Button>
          </div>
        </div>
      </motion.div>

      {/* KPI cards */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        variants={pageStagger}
      >
        <motion.div
          variants={fadeInUp}
          whileHover={{
            y: -4,
            transition: { duration: 0.3 }
          }}
          className="group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-blue-500/5 dark:border-white/5 dark:bg-white/5"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Events
              </p>
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            </div>
            <div>
              <p className="text-4xl font-black text-slate-900 dark:text-white">
                {summary?.eventsCount ?? 0}
              </p>
              <p className="mt-1 text-xs font-bold text-slate-500 dark:text-zinc-500">
                Active SEC‑NEXUS events
              </p>
            </div>
            <Link
              href="/events"
              className="inline-flex h-9 items-center justify-center rounded-full bg-slate-50 px-4 text-[11px] font-black uppercase tracking-wider text-slate-900 transition-colors hover:bg-slate-100 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Open events →
            </Link>
          </div>
        </motion.div>

        <FinanceCard />

        <motion.div
          variants={fadeInUp}
          whileHover={{
            y: -4,
            transition: { duration: 0.3 }
          }}
          className="group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-emerald-500/5 dark:border-white/5 dark:bg-white/5"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Approvals
              </p>
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <div>
              <p className="text-4xl font-black text-slate-900 dark:text-white">
                {summary?.pendingApprovals ?? 0}
              </p>
              <p className="mt-1 text-xs font-bold text-slate-500 dark:text-zinc-500">
                Pending across all modules
              </p>
            </div>
            <Link
              href="/admin"
              className="inline-flex h-9 items-center justify-center rounded-full bg-slate-50 px-4 text-[11px] font-black uppercase tracking-wider text-slate-900 transition-colors hover:bg-slate-100 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              Open approvals →
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Module groups quick access */}
      <motion.div
        className="grid gap-4 lg:grid-cols-2"
        variants={pageStagger}
      >
        {[
          {
            title: "Operations",
            desc: "Tasks, meetings, and feedback workflows.",
            href: "#",
          },
          {
            title: "Events",
            desc: "SEC‑NEXUS events, delegates, and surveys.",
            href: "/events",
          },
          {
            title: "Finance",
            desc: "Budgets, expenses, and inventory.",
            href: "/finance",
          },
          {
            title: "Secretariat & Content",
            desc: "Members, directory, training, news, and achievements.",
            href: "/directory",
          },
        ].map((group) => (
          <motion.div
            key={group.title}
            variants={fadeInUp}
            whileHover={{ y: -5, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-blue-500/5 dark:border-white/5 dark:bg-white/5"
          >
            <div className="space-y-3">
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                {group.title}
              </h2>
              <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                {group.desc}
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <Link
                href={group.href}
                className="inline-flex h-10 items-center justify-center rounded-full bg-primary/10 px-4 text-[11px] font-black uppercase tracking-wider text-primary transition-colors hover:bg-primary/20"
              >
                View modules →
              </Link>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500 dark:bg-white/5 dark:text-zinc-500">
                Protected
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Delegate Affairs card – only for ADMIN + DELEGATION_AFFAIRS */}
      {showDaCard && (
        <motion.div
          variants={fadeInUp}
          whileHover={{
            y: -4,
            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
          }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="cursor-pointer rounded-xl border bg-card p-4 shadow-sm"
        >
          <Link href="/da" className="flex flex-col justify-between">
            <div className="space-y-1">
              <h2 className="text-base font-semibold">Delegate Affairs</h2>
              <p className="text-xs text-muted-foreground">
                Manage registrations, allotments, and portfolios for SECMUN
                events.
              </p>
            </div>
            <div className="mt-4">
              <span className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                Open DA module
              </span>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Delegation Team Management card – only for Senior Secretariat */}
      {showDelegationTeamCard && (
        <motion.div
          variants={fadeInUp}
          whileHover={{ y: -4, boxShadow: "0 18px 40px rgba(109, 40, 217, 0.08)" }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="group relative overflow-hidden rounded-[2rem] border border-violet-200/60 bg-white p-6 shadow-xl shadow-violet-500/5 dark:border-white/5 dark:bg-white/5 cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-[40%] h-full bg-violet-400/5 blur-[60px] pointer-events-none group-hover:bg-violet-400/10 transition-colors" />
          <Link href="/delegation-team" className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200/60 bg-violet-50/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
                  <span>🌏</span> Senior Secretariat
                </div>
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Delegation Team Management
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-zinc-400">
                  Enroll members, track attendance, record awards, and manage galleries for outbound conferences.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Members', 'Attendance', 'Awards', 'Gallery'].map(f => (
                  <span key={f} className="rounded-full bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-violet-600 dark:text-violet-300">
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-5 py-2.5 text-[11px] font-black uppercase tracking-wider text-white shadow-lg shadow-violet-500/20 group-hover:bg-violet-700 transition-colors">
                Open Module →
              </span>
            </div>
          </Link>
        </motion.div>
      )}
    </motion.div>
  )
}
