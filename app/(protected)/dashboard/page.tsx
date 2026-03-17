"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useAppUser } from "@/hooks/useAppUser"
import { FinanceCard } from "./FinanceCard"
import { 
  BarChart3, 
  Calendar, 
  CheckCircle2, 
  Flag, 
  Globe, 
  LayoutDashboard, 
  ShieldCheck, 
  Users, 
  Wallet, 
  Zap,
  ArrowRight
} from "lucide-react"
import { canUseDaModule } from "@/lib/da/access"
import { canManageDelegationTeam } from "@/lib/delegation-team/access"
// import { AnnouncementCard } from "@/components/admin/AnnouncementCard"

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

  // Admin Card Access
  const showAdminCard = appUser && (
    appUser.role === 'ADMIN' || 
    appUser.role === 'TEACHER' ||
    ['PRESIDENT', 'SECRETARY_GENERAL', 'DIRECTOR_GENERAL', 'TEACHER'].includes(appUser.secretariatRole)
  )


  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-min"
      initial="hidden"
      animate="visible"
      variants={pageStagger}
    >
      {/* Row 1: Welcome Card (Full Width Header) */}
      <motion.div
        variants={scaleIn}
        className="md:col-span-12 group relative overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white p-10 shadow-2xl shadow-slate-200/50 dark:border-white/5 dark:bg-[#030712]/80 dark:shadow-none min-h-[400px]"
      >
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-blue-400/15 transition-all duration-1000" />
        
        <div className="relative z-10 h-full flex flex-col justify-between gap-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              System Active
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white lg:text-8xl leading-[0.85]">
                Welcome Back,<br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400 italic">
                  {displayName}.
                </span>
              </h1>
              <p className="max-w-2xl text-lg font-medium text-slate-500 dark:text-zinc-400 leading-relaxed">
                Your unified command center for institutional operations, global conference coordination, and secure financial management.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center pt-4">
            <Link href="/profile">
              <Button size="lg" variant="outline" className="rounded-2xl px-8 h-12 font-bold shadow-sm transition-all hover:bg-slate-50 hover:scale-[1.02] border-slate-200 dark:border-white/10 dark:hover:bg-white/5">
                Account Settings
              </Button>
            </Link>
            <Button size="lg" className="rounded-2xl px-8 h-12 font-bold bg-slate-900 text-white shadow-xl shadow-slate-900/10 transition-all hover:scale-[1.05] hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
              Launch Task Center
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Row 2: Primaries (Bento Starts Here) */}
      <motion.div
        variants={fadeInUp}
        whileHover={{ scale: 1.01 }}
        className="md:col-span-8 group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl dark:border-white/5 dark:bg-white/5"
      >
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 h-full">
          <div className="space-y-6 max-w-md">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Calendar size={24} />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Events Hub</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-none">SECMUN Repository</h2>
              <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 leading-relaxed">
                Aggregated repository for conferences, participation trails, and analytics.
              </p>
              <div className="flex gap-4 items-center">
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{summary?.eventsCount ?? 0}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Events</span>
                </div>
                <div className="h-8 w-px bg-slate-100 dark:bg-white/10" />
                <div className="flex gap-2">
                  {['Live Data', 'Stats'].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full border border-slate-100 bg-slate-50 text-[9px] font-bold text-slate-400 dark:bg-white/5 dark:border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Link
            href="/events"
            className="shrink-0 inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-blue-600 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-110 active:scale-95"
          >
            <ArrowRight size={28} />
          </Link>
        </div>
      </motion.div>

      <div className="md:col-span-4">
        <FinanceCard />
      </div>

      {/* Row 3: Secondaries */}
      <motion.div
        variants={fadeInUp}
        whileHover={{ y: -5 }}
        className="md:col-span-3 group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl dark:border-white/5 dark:bg-white/5"
      >
        <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Approvals</p>
          </div>
          <div>
            <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
              {summary?.pendingApprovals ?? 0}
            </p>
            <p className="text-xs font-bold text-slate-400 dark:text-zinc-500">Awaiting Auth</p>
          </div>
          <Link
            href="/secretariat/usg-approvals"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 px-4 text-[11px] font-black uppercase tracking-wider text-white transition-all hover:scale-105"
          >
            Access List →
          </Link>
        </div>
      </motion.div>

      {showAdminCard && (
        <motion.div
  variants={fadeInUp}
  whileHover={{ scale: 1.02 }}
  className="md:col-span-4 group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl dark:border-white/5 dark:bg-white/5"
>
  <div className="space-y-6">
    <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center dark:bg-white/10 text-slate-900 dark:text-white">
      <Zap size={24} />
    </div>
    <div className="space-y-2">
      <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Admin</h2>
      <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 leading-relaxed">
        Admin tools and protocols.
      </p>
    </div>
    <Link
      href="/admin"
      className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-50 dark:bg-white/10 px-6 text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-white transition-all hover:bg-slate-100"
    >
      Protocols →
    </Link>
  </div>
</motion.div>
      )}

      <motion.div
        variants={fadeInUp}
        className="md:col-span-5 group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl dark:border-white/5 dark:bg-white/5"
      >
        <div className="flex flex-col h-full justify-between gap-8">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300">
              <Users size={24} />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Directorate</h2>
              <p className="text-sm font-medium text-slate-500 dark:text-zinc-400 leading-relaxed">
                Member registry and verified achievements.
              </p>
            </div>
          </div>
          <Link
            href="/directory"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 px-6 text-[11px] font-black uppercase tracking-wider text-white transition-all hover:bg-slate-800"
          >
            Access Records →
          </Link>
        </div>
      </motion.div>

      {/* Row 4+: Conditional Admin Modules */}
      {showDelegationTeamCard && (
        <motion.div variants={fadeInUp} className="md:col-span-12">
          {/* <AnnouncementCard /> */}
        </motion.div>
      )}

      {showDaCard && (
        <motion.div
          variants={fadeInUp}
          className="md:col-span-12 group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-10 dark:border-white/5 dark:bg-[#030712]/80 shadow-sm"
        >
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-slate-900/5 to-transparent pointer-events-none dark:from-white/5" />
          <Link href="/da" className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest dark:bg-white dark:text-slate-900">
                <ShieldCheck size={10} className="mr-1" />
                Secure Module
              </div>
              <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">Delegate Affairs Directorate</h2>
              <p className="max-w-xl text-base font-medium text-slate-500 dark:text-zinc-400 text-lg">
                Execute administrative control over registrations and committee allocations.
              </p>
            </div>
            <Button size="lg" className="rounded-2xl h-14 px-8 font-black uppercase text-[12px] bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl">
              Open Directory →
            </Button>
          </Link>
        </motion.div>
      )}

      {showDelegationTeamCard && (
        <motion.div
          variants={fadeInUp}
          className="md:col-span-12 group relative overflow-hidden rounded-[2.5rem] border border-violet-200/60 bg-white p-10 dark:border-white/5 dark:bg-[#030712]/80 shadow-xl shadow-violet-500/5"
        >
          <div className="absolute top-0 right-0 w-1/2 h-full bg-violet-400/5 blur-[100px] pointer-events-none group-hover:bg-violet-400/10 transition-all duration-700" />
          <Link href="/delegation-team" className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/60 bg-violet-50/70 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                <Flag size={10} className="mr-1" />
                Executive Command
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">Delegation Team Command</h2>
                <p className="max-w-2xl text-lg font-medium text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Unified platform for outbound conference logistics, attendance tracking, and achievement verification.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {['Ops Control', 'Data Vault', 'Media Library'].map(f => (
                  <span key={f} className="rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-violet-600 dark:text-violet-300">
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <span className="inline-flex items-center justify-center rounded-2xl bg-violet-600 h-16 px-10 text-[13px] font-black uppercase tracking-widest text-white shadow-2xl shadow-violet-500/40 hover:bg-violet-700 transition-all hover:scale-105 active:scale-95">
              Initialize System →
            </span>
          </Link>
        </motion.div>
      )}
    </motion.div>
  )
}
