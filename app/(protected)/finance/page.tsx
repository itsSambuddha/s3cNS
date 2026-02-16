// app/(protected)/finance/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useAppUser } from '@/hooks/useAppUser'
import { cn } from '@/lib/utils'

type SummaryResponse = {
  totalsByType: { _id: string; totalAmount: number }[]
  expensesByCategory: { _id: string; totalAmount: number }[]
  pendingReimbursements: { count: number; totalAmount: number }
  outstandingDues: { count: number; totalAmount: number }
}

type FinanceRecord = {
  _id: string
  type: string
  eventName?: string | null
  category: string
  amount: number
  currency: string
  status: string
  date: string
  notes?: string | null
}

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

export default function FinanceDashboardPage() {
  const router = useRouter()
  const { user: fbUser, loading: authLoading } = useAuth()
  const { user: appUser, loading: appLoading } = useAppUser()

  const [summary, setSummary] = useState<SummaryResponse | null>(null)
  const [recent, setRecent] = useState<FinanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isFinanceAllowed = useMemo(() => {
    if (!appUser) return false
    const leadershipRoles = [
      'PRESIDENT',
      'SECRETARY_GENERAL',
      'DIRECTOR_GENERAL',
    ]
    const financeOffice = appUser.office === 'FINANCE'
    const senior =
      leadershipRoles.includes(appUser.secretariatRole) ||
      appUser.role === 'ADMIN'
    return senior || financeOffice
  }, [appUser])

  useEffect(() => {
    if (authLoading || appLoading) return
    if (!fbUser || !appUser) {
      router.replace('/login?from=/finance')
      return
    }
    if (!isFinanceAllowed) {
      setError('You do not have permission to access the Finance module.')
      setLoading(false)
      return
    }

    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        const [summaryRes, recentRes] = await Promise.all([
          fetch('/api/finance/records/summary'),
          fetch(
            '/api/finance/records?type=EXPENSE&page=1&pageSize=10',
          ),
        ])

        const summaryJson = await summaryRes.json()
        const recentJson = await recentRes.json()

        if (!summaryRes.ok) {
          throw new Error(summaryJson.error || 'Failed to load summary')
        }
        if (!recentRes.ok) {
          throw new Error(recentJson.error || 'Failed to load recent records')
        }

        setSummary(summaryJson as SummaryResponse)
        setRecent((recentJson.records || []) as FinanceRecord[])
      } catch (e: any) {
        setError(e?.message || 'Could not load finance data')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [authLoading, appLoading, fbUser, appUser, isFinanceAllowed, router])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)

  const totalsByType = Array.isArray(summary?.totalsByType) ? summary?.totalsByType : []
  const totalBudget = totalsByType.find((t) => t._id === 'BUDGET')?.totalAmount || 0
  const totalExpenses =
    totalsByType.find((t) => t._id === 'EXPENSE')?.totalAmount || 0
  const budgetRemaining = Math.max(totalBudget - totalExpenses, 0)

  const pending = summary?.pendingReimbursements || { count: 0, totalAmount: 0 }
  const dues = summary?.outstandingDues || { count: 0, totalAmount: 0 }

  const exportRecentToCSV = () => {
    if (!recent.length) return

    const headers = [
      'Date',
      'Event',
      'Category',
      'Amount',
      'Currency',
      'Status',
      'Notes',
    ]

    const rows = recent.map((r) => [
      new Date(r.date).toLocaleDateString('en-IN'),
      r.eventName || '',
      r.category,
      r.amount.toString(),
      r.currency,
      r.status,
      (r.notes || '').replace(/\n/g, ' '),
    ])

    const csvContent =
      [headers, ...rows]
        .map((row) =>
          row
            .map((cell) => {
              const needsQuotes = /[",\n]/.test(cell)
              const escaped = cell.replace(/"/g, '""')
              return needsQuotes ? `"${escaped}"` : escaped
            })
            .join(','),
        )
        .join('\n') + '\n'

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'secmun_finance_recent_expenses.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const printRecent = () => {
    const printContent = document.getElementById('recent-expenses-print')
    if (!printContent) return

    const printWindow = window.open('', '', 'height=800,width=900')
    if (!printWindow) return

    printWindow.document.write('<html><head><title>Recent expenses</title>')
    printWindow.document.write(
      '<style>body{font-family:system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI";padding:24px;} table{border-collapse:collapse;width:100%;font-size:12px;} th,td{border:1px solid #e5e7eb;padding:6px 8px;text-align:left;} th{background:#f9fafb;font-weight:600;}</style>',
    )
    printWindow.document.write('</head><body>')
    printWindow.document.write(printContent.innerHTML)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  if (authLoading || appLoading || loading) {
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
          Sign in to access the Finance dashboard.
        </p>
      </div>
    )
  }

  if (!isFinanceAllowed) {
    return (
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Access restricted</h1>
        <p className="text-sm text-muted-foreground">
          The Finance module is only available to the Senior Secretariat and the Finance office.
        </p>
      </div>
    )
  }

  return (
    <main className="relative min-h-screen bg-background px-4 py-8 overflow-hidden">
      {/* Atmosphere Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute right-[-10%] top-[35%] h-[600px] w-[600px] rounded-full bg-emerald-100/40 blur-[140px]" />
        {/* Grainy Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3EaseFilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/baseFilter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      <motion.div
        className="mx-auto max-w-7xl space-y-12"
        initial="hidden"
        animate="visible"
        variants={pageStagger}
      >
        {/* Hero strip */}
        <header>
          <motion.div
            variants={scaleIn}
            className="group relative overflow-hidden rounded-[2rem] border border-blue-200/60 bg-white p-8 shadow-xl shadow-blue-500/5 dark:border-white/5 dark:bg-[#030712]/80"
          >
            <div className="absolute top-0 right-0 w-[40%] h-full bg-emerald-400/5 blur-[80px] pointer-events-none transition-colors group-hover:bg-emerald-400/10" />

            <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                  Finance Management
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    SEC‑MUN Finance & Assets
                  </h1>
                  <p className="max-w-xl text-sm font-medium text-slate-500 dark:text-zinc-400">
                    Track budgets, expenses, reimbursements, dues, and inventory — all from a single control room.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-6 font-bold shadow-sm transition-all hover:bg-slate-50"
                  onClick={() => router.push('/finance/records?mode=expense')}
                >
                  Add expense
                </Button>
                <Button
                  size="lg"
                  className="rounded-full px-6 font-bold bg-slate-900 text-white shadow-lg shadow-slate-900/10 transition-all hover:scale-[1.03] dark:bg-white dark:text-slate-900"
                  onClick={() => router.push('/finance/inventory')}
                >
                  Manage inventory
                </Button>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Error banner */}
        {error && (
          <motion.div
            variants={fadeInUp}
            className="rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-xs text-destructive"
          >
            {error}
          </motion.div>
        )}

        {/* KPI row */}
        <motion.div
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
          variants={pageStagger}
        >
          <KpiCard
            label="Total budget planned"
            value={formatCurrency(totalBudget)}
            hint="All budget records for this cycle"
          />
          <KpiCard
            label="Total expenses logged"
            value={formatCurrency(totalExpenses)}
            hint="Approved and pending expenses"
          />
          <KpiCard
            label="Pending reimbursements"
            value={formatCurrency(pending.totalAmount)}
            badge={`${pending.count} requests`}
            accent="sky"
          />
          <KpiCard
            label="Outstanding dues"
            value={formatCurrency(dues.totalAmount)}
            badge={`${dues.count} members`}
            accent="amber"
          />
        </motion.div>

        {/* Charts + insights row */}
        <motion.div
          className="grid gap-6 lg:grid-cols-3"
          variants={pageStagger}
        >
          {/* Placeholder chart card */}
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <Card className="h-full rounded-[2.5rem] border border-blue-200/60 bg-white p-8 shadow-xl shadow-blue-500/5 dark:border-white/5 dark:bg-zinc-900/40">
              <div className="flex flex-col gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
                  Analytics
                </div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Spending trends</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                  Visual overview of where money is going
                </p>
              </div>
              <div className="mt-8 h-[240px] rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center dark:border-white/10 dark:bg-white/5">
                <div className="flex h-full flex-col items-center justify-center gap-4">
                  <span className="rounded-full bg-slate-900 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white dark:bg-white dark:text-slate-900">
                    Engine processing data
                  </span>
                  <p className="max-w-xs text-xs font-medium text-slate-400">
                    Standardizing categories and preparing visual projection for this cycle.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Insights card */}
          <motion.div variants={fadeInUp}>
            <Card className="h-full rounded-[2.5rem] border border-slate-900 bg-[#030712] p-8 text-white shadow-2xl">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                  Strategic Intelligence
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black tracking-tight leading-tight">Financial Insights</h3>
                  <div className="space-y-4 text-sm font-medium text-zinc-400 leading-relaxed">
                    <p>
                      Use this space to call out anomalies — spikes in printing, over‑budget events, or pending reimbursements that need leadership attention.
                    </p>
                    <p>
                      Once you add more data, you can surface automatic “flags” here (e.g., “Hospitality exceeded budget by 18% for SEC‑MUN 2026.”).
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-[11px] font-bold text-zinc-500">
                    Prudential Tip: Keep all reimbursements inside the system to have an audit‑ready trail for college authorities.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Recent activity table */}
        <motion.div variants={fadeInUp}>
          <Card className="rounded-[2.5rem] border border-blue-200/60 bg-white p-8 shadow-xl shadow-blue-500/5 dark:border-white/5 dark:bg-zinc-900/40">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
                  Audit Trail
                </div>
                <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Recent Ledger</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full font-bold"
                  onClick={exportRecentToCSV}
                  disabled={!recent.length}
                >
                  Export CSV
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full font-bold"
                  onClick={printRecent}
                  disabled={!recent.length}
                >
                  Print table
                </Button>
                <Button
                  size="sm"
                  className="rounded-full bg-slate-900 font-bold text-white transition-transform hover:scale-[1.03] dark:bg-white dark:text-slate-900"
                  onClick={() => router.push('/finance/records')}
                >
                  Open full ledger
                </Button>
              </div>
            </div>

            <div
              id="recent-expenses-print"
              className="mt-8 overflow-hidden rounded-3xl border border-blue-200/60 bg-white dark:border-white/5 dark:bg-[#030712]/40"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-sm">
                  <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left">Date</th>
                      <th className="px-4 py-4 text-left">Event</th>
                      <th className="px-4 py-4 text-left">Category</th>
                      <th className="px-4 py-4 text-right">Amount</th>
                      <th className="px-4 py-4 text-left">Status</th>
                      <th className="px-6 py-4 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {recent.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-12 text-center text-sm font-medium text-slate-400"
                        >
                          No expenses have been logged yet.
                        </td>
                      </tr>
                    )}
                    {recent.map((r) => (
                      <tr
                        key={r._id}
                        className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-white/5"
                      >
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                          {new Date(r.date).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-4 py-4 font-medium text-slate-500 dark:text-zinc-400">
                          {r.eventName || <span className="opacity-40">–</span>}
                        </td>
                        <td className="px-4 py-4 font-bold text-slate-900 dark:text-white">{r.category}</td>
                        <td className="px-4 py-4 text-right font-black text-slate-900 dark:text-white">
                          {formatCurrency(r.amount)}
                        </td>
                        <td className="px-4 py-4">
                          <StatusPill status={r.status} />
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate text-xs font-medium text-slate-500 dark:text-zinc-400">
                          {r.notes || <span className="opacity-40">–</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </main>
  )
}

function KpiCard({
  label,
  value,
  hint,
  badge,
  accent = 'emerald',
}: {
  label: string
  value: string
  hint?: string
  badge?: string
  accent?: 'emerald' | 'sky' | 'amber'
}) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="group relative overflow-hidden rounded-3xl border border-blue-200/60 bg-white p-6 shadow-xl shadow-blue-500/5 dark:border-white/5 dark:bg-zinc-900/40"
    >
      <div className={cn(
        "absolute top-0 right-0 w-24 h-24 blur-[40px] pointer-events-none opacity-20",
        accent === 'sky' ? "bg-sky-400" : accent === 'amber' ? "bg-amber-400" : "bg-emerald-400"
      )} />

      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
        {label}
      </p>
      <div className="mt-4 flex items-baseline justify-between gap-2">
        <p className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{value}</p>
        {badge && (
          <span
            className={cn(
              'rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-sm border',
              accent === 'sky' ? 'bg-sky-50 text-sky-700 border-sky-100' :
                accent === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                  'bg-emerald-50 text-emerald-700 border-emerald-100'
            )}
          >
            {badge}
          </span>
        )}
      </div>
      {hint && (
        <p className="mt-4 text-[11px] font-bold text-slate-400">{hint}</p>
      )}
    </motion.div>
  )
}

function StatusPill({ status }: { status: string }) {
  const normalized = status.toUpperCase()
  let color = 'bg-slate-100 text-slate-700 border-slate-200'

  if (normalized === 'PENDING') {
    color = 'bg-amber-50 text-amber-800 border-amber-200'
  } else if (normalized === 'APPROVED' || normalized === 'PAID') {
    color = 'bg-emerald-50 text-emerald-800 border-emerald-200'
  } else if (normalized === 'REJECTED' || normalized === 'OVERDUE') {
    color = 'bg-rose-50 text-rose-800 border-rose-200'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide',
        color,
      )}
    >
      {normalized}
    </span>
  )
}
