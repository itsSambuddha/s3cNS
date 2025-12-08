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
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={pageStagger}
    >
      {/* Hero strip */}
      <motion.div
        variants={scaleIn}
        className="flex flex-col gap-3 rounded-2xl border bg-gradient-to-r from-emerald-50 via-background to-sky-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-5"
      >
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700/80">
            Finance
          </p>
          <h1 className="text-xl font-semibold sm:text-2xl">
            SEC‑MUN Finance & Assets
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Track budgets, expenses, reimbursements, dues, and inventory — all from a single control room.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push('/finance/records?mode=expense')}
          >
            Add expense
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push('/finance/records?mode=budget')}
          >
            Add budget
          </Button>
          <Button
            size="sm"
            onClick={() => router.push('/finance/inventory')}
          >
            Manage inventory
          </Button>
        </div>
      </motion.div>

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
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
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
          badge={`${pending.count} request${pending.count === 1 ? '' : 's'}`}
          accent="sky"
        />
        <KpiCard
          label="Outstanding dues"
          value={formatCurrency(dues.totalAmount)}
          badge={`${dues.count} member${dues.count === 1 ? '' : 's'}`}
          accent="amber"
        />
      </motion.div>

      {/* Charts + insights row */}
      <motion.div
        className="grid gap-4 lg:grid-cols-3"
        variants={pageStagger}
      >
        {/* Placeholder chart card */}
        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <Card className="h-full rounded-2xl border bg-card/80 p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Spending by category
                </p>
                <p className="text-sm font-semibold">
                  Visual overview of where money is going
                </p>
              </div>
            </div>
            <div className="mt-4 h-[220px] rounded-xl border border-dashed border-slate-200/80 bg-slate-50/60 p-4 text-center text-xs text-muted-foreground">
              {/* Later: integrate Recharts / another chart lib here */}
              <div className="flex h-full flex-col items-center justify-center gap-2">
                <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-50">
                  Chart coming soon
                </span>
                <p className="max-w-xs text-[11px]">
                  Hook this card to <code>summary.expensesByCategory</code> for a donut or bar chart.
                  The data is already available in the API.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Insights card */}
        <motion.div variants={fadeInUp}>
          <Card className="h-full rounded-2xl border bg-slate-950 text-slate-50">
            <div className="space-y-3 p-4 sm:p-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
                Finance insights
              </p>
              <div className="space-y-2 text-xs text-slate-200">
                <p>
                  Use this space to call out anomalies — spikes in printing, over‑budget events, or pending reimbursements that need leadership attention.
                </p>
                <p className="text-slate-400">
                  Once you add more data, you can surface automatic “flags” here (e.g., “Hospitality exceeded budget by 18% for SEC‑MUN 2026.”).
                </p>
              </div>
              <div className="mt-3 space-y-1 text-[11px] text-slate-400">
                <p>Tip: Keep all reimbursements inside the system to have an audit‑ready trail for college authorities.</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Recent activity table */}
      <motion.div variants={fadeInUp}>
        <Card className="rounded-2xl border bg-card/80 p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Recent expenses
              </p>
              <p className="text-sm text-muted-foreground">
                Last 10 entries logged in the system.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={exportRecentToCSV}
                disabled={!recent.length}
              >
                Export CSV
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={printRecent}
                disabled={!recent.length}
              >
                Print table
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push('/finance/records')}
              >
                Open full ledger
              </Button>
            </div>
          </div>

          <div
            id="recent-expenses-print"
            className="mt-4 overflow-hidden rounded-xl border bg-background"
          >
            <div className="max-h-[360px] overflow-auto">
              <table className="min-w-full border-collapse text-xs">
                <thead className="bg-muted/60 text-[11px] uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="border-b px-3 py-2 text-left">Date</th>
                    <th className="border-b px-3 py-2 text-left">Event</th>
                    <th className="border-b px-3 py-2 text-left">Category</th>
                    <th className="border-b px-3 py-2 text-right">Amount</th>
                    <th className="border-b px-3 py-2 text-left">Status</th>
                    <th className="border-b px-3 py-2 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 py-4 text-center text-[11px] text-muted-foreground"
                      >
                        No expenses have been logged yet.
                      </td>
                    </tr>
                  )}
                  {recent.map((r) => (
                    <tr
                      key={r._id}
                      className="border-t text-[11px] hover:bg-muted/40"
                    >
                      <td className="px-3 py-2">
                        {new Date(r.date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-3 py-2">
                        {r.eventName || <span className="text-muted-foreground">–</span>}
                      </td>
                      <td className="px-3 py-2">{r.category}</td>
                      <td className="px-3 py-2 text-right">
                        {formatCurrency(r.amount)}
                      </td>
                      <td className="px-3 py-2">
                        <StatusPill status={r.status} />
                      </td>
                      <td className="px-3 py-2 max-w-xs truncate">
                        {r.notes || <span className="text-muted-foreground">–</span>}
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
  const accentClass =
    accent === 'sky'
      ? 'bg-sky-50 text-sky-800 border-sky-100'
      : accent === 'amber'
      ? 'bg-amber-50 text-amber-800 border-amber-100'
      : 'bg-emerald-50 text-emerald-800 border-emerald-100'

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -4, boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)' }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="rounded-xl border bg-card p-4 shadow-sm"
    >
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <p className="text-xl font-semibold sm:text-2xl">{value}</p>
        {badge && (
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-medium',
              accentClass,
            )}
          >
            {badge}
          </span>
        )}
      </div>
      {hint && (
        <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
      )}
    </motion.div>
  )
}

function StatusPill({ status }: { status: string }) {
  const normalized = status.toUpperCase()
  let color =
    'bg-slate-100 text-slate-700 border-slate-200'

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
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
        color,
      )}
    >
      {normalized}
    </span>
  )
}
