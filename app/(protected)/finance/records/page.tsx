// app/(protected)/finance/records/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useAppUser } from '@/hooks/useAppUser'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

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

const CATEGORIES = [
  'LOGISTICS',
  'PRINTING',
  'HOSPITALITY',
  'TECH',
  'MARKETING',
  'TRAVEL',
  'MISC',
]

export default function FinanceRecordsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user: fbUser, loading: authLoading } = useAuth()
  const { user: appUser, loading: appLoading } = useAppUser()

  const [records, setRecords] = useState<FinanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Add‑expense form state
  const [eventName, setEventName] = useState('')
  const [category, setCategory] = useState<string>('LOGISTICS')
  const [amount, setAmount] = useState<string>('')
  const [date, setDate] = useState<string>('')
  const [notes, setNotes] = useState('')

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

  const activeTab = searchParams.get('tab') || 'expenses'

  useEffect(() => {
    if (authLoading || appLoading) return
    if (!fbUser || !appUser) {
      router.replace('/login?from=/finance/records')
      return
    }
    if (!isFinanceAllowed) {
      setError('You do not have permission to access the Finance records.')
      setLoading(false)
      return
    }

    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(
          '/api/finance/records?type=EXPENSE&page=1&pageSize=50',
        )
        const json = await res.json()
        if (!res.ok) {
          throw new Error(json.error || 'Failed to load expenses')
        }
        setRecords((json.records || []) as FinanceRecord[])
      } catch (e: any) {
        setError(e?.message || 'Could not load records')
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

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        !search ||
        (r.eventName || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.notes || '').toLowerCase().includes(search.toLowerCase())
      const matchesCategory =
        categoryFilter === 'ALL' || r.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [records, search, categoryFilter])

  const exportToCSV = () => {
    if (!filteredRecords.length) return

    const headers = [
      'Date',
      'Event',
      'Category',
      'Amount',
      'Currency',
      'Status',
      'Notes',
    ]

    const rows = filteredRecords.map((r) => [
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
    link.setAttribute('download', 'secmun_finance_expenses.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const printTable = () => {
    const printContent = document.getElementById('expenses-table-print')
    if (!printContent) return

    const printWindow = window.open('', '', 'height=800,width=900')
    if (!printWindow) return

    printWindow.document.write('<html><head><title>Expenses</title>')
    printWindow.document.write(
      '<style>body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI";padding:24px;} table{border-collapse:collapse;width:100%;font-size:12px;} th,td{border:1px solid #e5e7eb;padding:6px 8px;text-align:left;} th{background:#f9fafb;font-weight:600;}</style>',
    )
    printWindow.document.write('</head><body>')
    printWindow.document.write(printContent.innerHTML)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  const resetForm = () => {
    setEventName('')
    setCategory('LOGISTICS')
    setAmount('')
    setDate('')
    setNotes('')
    setFormError(null)
  }

  const handleCreateExpense = async () => {
    if (!fbUser || !appUser) return

    if (!amount || !date) {
      setFormError('Amount and date are required.')
      return
    }

    const amt = Number(amount)
    if (Number.isNaN(amt) || amt <= 0) {
      setFormError('Enter a valid positive amount.')
      return
    }

    try {
      setSaving(true)
      setFormError(null)

      const res = await fetch('/api/finance/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'EXPENSE',
          eventName: eventName || null,
          category,
          amount: amt,
          currency: 'INR',
          status: 'PENDING',
          date,
          notes: notes || null,
          createdByUid: fbUser.uid,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || 'Could not create expense')
      }

      setRecords((prev) => [json.record as FinanceRecord, ...prev])
      resetForm()
      setDrawerOpen(false)
    } catch (e: any) {
      setFormError(e?.message || 'Could not create expense')
    } finally {
      setSaving(false)
    }
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
          Sign in to access the Finance records.
        </p>
      </div>
    )
  }

  if (!isFinanceAllowed) {
    return (
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Access restricted</h1>
        <p className="text-sm text-muted-foreground">
          The Finance records are only available to the Senior Secretariat and the Finance office.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-5"
      initial="hidden"
      animate="visible"
      variants={pageStagger}
    >
      {/* Header */}
      <motion.div
        variants={scaleIn}
        className="flex flex-col gap-3 rounded-2xl border bg-gradient-to-r from-slate-50 via-background to-emerald-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-5"
      >
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700/80">
            Finance records
          </p>
          <h1 className="text-xl font-semibold sm:text-2xl">
            Ledger for SEC‑MUN cycle
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            View and manage budgets, expenses, reimbursements, and dues with export‑ready tables.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDrawerOpen(true)}
          >
            Add expense
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-wrap gap-2 rounded-full border bg-muted/60 px-1.5 py-1.5 text-xs"
      >
        {[
          { id: 'budgets', label: 'Budgets' },
          { id: 'expenses', label: 'Expenses' },
          { id: 'reimbursements', label: 'Reimbursements' },
          { id: 'dues', label: 'Dues' },
        ].map((tab) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                const params = new URLSearchParams(
                  searchParams?.toString() || '',
                )
                params.set('tab', tab.id)
                router.replace(`/finance/records?${params.toString()}`)
              }}
              className={cn(
                'rounded-full px-3 py-1.5 transition-colors',
                active
                  ? 'bg-slate-900 text-slate-50'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </motion.div>

      {/* Only Expenses fully implemented for now */}
      {activeTab !== 'expenses' && (
        <motion.div variants={fadeInUp}>
          <Card className="rounded-2xl border bg-card/80 p-4 shadow-sm">
            <p className="text-sm font-medium">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ledger
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              This tab will mirror the Expenses workspace with its own filters
              and entry form once you are ready to expand it.
            </p>
          </Card>
        </motion.div>
      )}

      {activeTab === 'expenses' && (
        <motion.div variants={fadeInUp}>
          <Card className="rounded-2xl border bg-card/80 p-4 shadow-sm sm:p-5">
            {/* Filters + actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by event or notes…"
                    className="h-8 w-52 pr-8 text-xs sm:w-64"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[11px] text-muted-foreground">
                    ⌘K
                  </span>
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-8 rounded-full border bg-background px-2 text-[11px]"
                >
                  <option value="ALL">All categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={exportToCSV}
                  disabled={!filteredRecords.length}
                >
                  Export CSV
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={printTable}
                  disabled={!filteredRecords.length}
                >
                  Print
                </Button>
              </div>
            </div>

            {/* Table */}
            <div
              id="expenses-table-print"
              className="mt-4 overflow-hidden rounded-xl border bg-background"
            >
              <div className="max-h-[420px] overflow-auto">
                <table className="min-w-full border-collapse text-xs">
                  <thead className="bg-muted/60 text-[11px] uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="border-b px-3 py-2 text-left">Date</th>
                      <th className="border-b px-3 py-2 text-left">Event</th>
                      <th className="border-b px-3 py-2 text-left">
                        Category
                      </th>
                      <th className="border-b px-3 py-2 text-right">
                        Amount
                      </th>
                      <th className="border-b px-3 py-2 text-left">Status</th>
                      <th className="border-b px-3 py-2 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-3 py-4 text-center text-[11px] text-muted-foreground"
                        >
                          No expenses match your filters yet.
                        </td>
                      </tr>
                    )}
                    {filteredRecords.map((r) => (
                      <tr
                        key={r._id}
                        className="border-t text-[11px] hover:bg-muted/40"
                      >
                        <td className="px-3 py-2">
                          {new Date(r.date).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-3 py-2">
                          {r.eventName || (
                            <span className="text-muted-foreground">–</span>
                          )}
                        </td>
                        <td className="px-3 py-2">{r.category}</td>
                        <td className="px-3 py-2 text-right">
                          {formatCurrency(r.amount)}
                        </td>
                        <td className="px-3 py-2">
                          <StatusPill status={r.status} />
                        </td>
                        <td className="px-3 py-2 max-w-xs truncate">
                          {r.notes || (
                            <span className="text-muted-foreground">–</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {error && (
              <p className="mt-3 text-[11px] font-medium text-destructive">
                {error}
              </p>
            )}
          </Card>
        </motion.div>
      )}

      {/* Add expense drawer (simple side panel) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/30 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={() => {
              if (!saving) setDrawerOpen(false)
            }}
          />
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="relative z-50 flex h-full w-full max-w-sm flex-col border-l bg-card p-4 shadow-xl sm:p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  New expense
                </p>
                <p className="text-sm font-semibold">
                  Log a transaction for this SEC‑MUN cycle
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => !saving && setDrawerOpen(false)}
              >
                ✕
              </Button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="space-y-1">
                <Label htmlFor="eventName">Event (optional)</Label>
                <Input
                  id="eventName"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g. SEC‑MUN 2026, Training Camp, Intra MUN"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-8 w-full rounded-md border bg-background px-2 text-xs"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="amount">Amount (INR)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 1500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Printing placards for ECOSOC"
                />
              </div>

              {formError && (
                <p className="text-[11px] font-medium text-destructive">
                  {formError}
                </p>
              )}
            </div>

            <div className="mt-auto flex items-center justify-between pt-4 text-xs">
              <p className="text-muted-foreground">
                This entry will be visible in the main Finance dashboard and exports.
              </p>
              <Button
                size="sm"
                onClick={handleCreateExpense}
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </motion.div>
        </div>
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
