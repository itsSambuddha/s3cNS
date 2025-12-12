// components/finance/BudgetDesigner.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { BudgetActions } from './BudgetActions'

type BudgetItemRow = {
  id: string
  budgetItem: string
  units: string
  pricePerUnit: string
  remarks: string
}

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export function BudgetDesigner({
  eventId,
  eventName,
}: {
  eventId?: string
  eventName?: string
}) {
  const { user: fbUser } = useAuth()
  const [items, setItems] = useState<BudgetItemRow[]>([
    {
      id: crypto.randomUUID(),
      budgetItem: '',
      units: '1',
      pricePerUnit: '0',
      remarks: '',
    },
  ])

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [delegates, setDelegates] = useState<string>('')

  useEffect(() => {
    const loadExisting = async () => {
      if (!eventId && !eventName) return
      try {
        setLoading(true)
        setError(null)
        const params = new URLSearchParams()
        if (eventId) params.set('eventId', eventId)
        if (eventName) params.set('eventName', eventName)

        const res = await fetch(`/api/finance/budgets?${params.toString()}`)
        const json = await res.json()

        if (!res.ok) {
          throw new Error(json.error || 'Failed to load budget')
        }

        const loaded = (json.items || []) as any[]
        if (!loaded.length) return

        setItems(
          loaded.map((it) => ({
            id: it.id || crypto.randomUUID(),
            budgetItem: it.budgetItem || '',
            units: String(it.units ?? 1),
            pricePerUnit: String(it.pricePerUnit ?? 0),
            remarks: it.remarks || '',
          })),
        )
      } catch (e: any) {
        setError(e?.message || 'Could not load budget')
      } finally {
        setLoading(false)
      }
    }
    loadExisting()
  }, [eventId, eventName])

  const totals = useMemo(() => {
    let total = 0
    items.forEach((row) => {
      const units = Number(row.units)
      const price = Number(row.pricePerUnit)
      if (!Number.isNaN(units) && !Number.isNaN(price) && units > 0 && price >= 0) {
        total += units * price
      }
    })
    const delegatesCount = Number(delegates)
    const perHead =
      !Number.isNaN(delegatesCount) && delegatesCount > 0
        ? total / delegatesCount
        : 0
    return { total, perHead }
  }, [items, delegates])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)

  const updateRow = (id: string, patch: Partial<BudgetItemRow>) => {
    setItems((prev) =>
      prev.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    )
  }

  const addRow = () => {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        budgetItem: '',
        units: '1',
        pricePerUnit: '0',
        remarks: '',
      },
    ])
  }

  const removeRow = (id: string) => {
    setItems((prev) => (prev.length === 1 ? prev : prev.filter((r) => r.id !== id)))
  }

  const handleSave = async () => {
    if (!fbUser) {
      setError('You must be signed in to save a budget.')
      return
    }
    if (!eventId && !eventName) {
      setError('Select or provide an event before saving.')
      return
    }

    try {
      setSaving(true)
      setError(null)
      setInfo(null)

      const cleaned = items.filter(
        (it) =>
          it.budgetItem.trim().length > 0 &&
          Number(it.units) > 0 &&
          Number(it.pricePerUnit) >= 0,
      )

      const res = await fetch('/api/finance/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: eventId || null,
          eventName: eventName || null,
          createdByUid: fbUser.uid,
          items: cleaned.map((it) => ({
            budgetItem: it.budgetItem,
            units: Number(it.units),
            pricePerUnit: Number(it.pricePerUnit),
            remarks: it.remarks,
          })),
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save budget')
      }

      setInfo('Budget saved. Existing records were overwritten.')
    } catch (e: any) {
      setError(e?.message || 'Could not save budget')
    } finally {
      setSaving(false)
    }
  }

  const exportToCSV = () => {
    if (!items.length) return

    const headers = [
      'Budget Item',
      'Units',
      'Price per Unit (INR)',
      'Total Budget (INR)',
      'Remarks',
    ]

    const rows = items.map((row) => {
      const units = Number(row.units)
      const price = Number(row.pricePerUnit)
      const total =
        !Number.isNaN(units) && !Number.isNaN(price) ? units * price : 0

      return [
        row.budgetItem,
        row.units,
        row.pricePerUnit,
        String(total),
        row.remarks.replace(/\n/g, ' '),
      ]
    })

    const csvContent =
      [headers, ...rows]
        .map((row) =>
          row
            .map((cell) => {
              const needsQuotes = /[",\n]/.test(cell)
              const escaped = cell.replace(/"/g, '""')
              return needsQuotes ? `"${escaped}"` : cell
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
    link.setAttribute('download', 'secmun_budget_items.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const printBudget = () => {
    const section = document.getElementById('budget-designer-print')
    if (!section) return

    const printWindow = window.open('', '', 'height=800,width=900')
    if (!printWindow) return

    printWindow.document.write('<html><head><title>Budget</title>')
    printWindow.document.write(
      '<style>body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI";padding:24px;} table{border-collapse:collapse;width:100%;font-size:12px;} th,td{border:1px solid #e5e7eb;padding:6px 8px;text-align:left;} th{background:#f9fafb;font-weight:600;}</style>',
    )
    printWindow.document.write('</head><body>')
    printWindow.document.write(section.innerHTML)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[2fr,minmax(260px,0.9fr)]">
      {/* Main grid */}
      <Card className="rounded-2xl border bg-card/80 p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Budget Designer
            </p>
            <p className="text-sm text-muted-foreground">
              Define detailed budget items for this event or initiative.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="delegates" className="text-[11px]">
                Delegates
              </Label>
              <Input
                id="delegates"
                value={delegates}
                onChange={(e) => setDelegates(e.target.value)}
                placeholder="e.g. 120"
                className="h-7 w-20 text-[11px]"
              />
            </div>
            <Button size="sm" variant="outline" onClick={addRow}>
              + Add item
            </Button>
          </div>
        </div>


        <div
          id="budget-designer-print"
          className="mt-3 overflow-hidden rounded-xl border bg-background"
        >
          <div className="max-h-[420px] overflow-auto">
            <table className="min-w-full border-collapse text-xs">
              <thead className="bg-muted/60 text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="border-b px-3 py-2 text-left">Budget Item</th>
                  <th className="border-b px-3 py-2 text-right">Units</th>
                  <th className="border-b px-3 py-2 text-right">
                    Price / Unit (₹)
                  </th>
                  <th className="border-b px-3 py-2 text-right">
                    Total Budget (₹)
                  </th>
                  <th className="border-b px-3 py-2 text-left">Remarks</th>
                  <th className="border-b px-3 py-2 text-center">Remove</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {items.map((row) => {
                    const units = Number(row.units)
                    const price = Number(row.pricePerUnit)
                    const rowTotal =
                      !Number.isNaN(units) && !Number.isNaN(price)
                        ? units * price
                        : 0

                    return (
                      <motion.tr
                        key={row.id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="border-t text-[11px] hover:bg-muted/40"
                      >
                        <td className="px-3 py-2">
                          <Input
                            value={row.budgetItem}
                            onChange={(e) =>
                              updateRow(row.id, { budgetItem: e.target.value })
                            }
                            placeholder="e.g. Food, Printing, Hospitality"
                            className="h-7 text-[11px]"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <Input
                            type="number"
                            min="0"
                            value={row.units}
                            onChange={(e) =>
                              updateRow(row.id, { units: e.target.value })
                            }
                            className="h-7 text-right text-[11px]"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <Input
                            type="number"
                            min="0"
                            value={row.pricePerUnit}
                            onChange={(e) =>
                              updateRow(row.id, {
                                pricePerUnit: e.target.value,
                              })
                            }
                            className="h-7 text-right text-[11px]"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          {formatCurrency(rowTotal)}
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            value={row.remarks}
                            onChange={(e) =>
                              updateRow(row.id, { remarks: e.target.value })
                            }
                            placeholder="Optional notes"
                            className="h-7 text-[11px]"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            className={cn(
                              'inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px]',
                              items.length === 1
                                ? 'cursor-not-allowed bg-muted text-muted-foreground'
                                : 'bg-rose-50 text-rose-700 hover:bg-rose-100',
                            )}
                            onClick={() => removeRow(row.id)}
                            disabled={items.length === 1}
                          >
                            ✕
                          </button>
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-[11px] font-medium text-destructive">
            {error}
          </p>
        )}
        {info && (
          <p className="mt-3 text-[11px] font-medium text-emerald-700">
            {info}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <Button
            size="sm"
            variant="outline"
            onClick={exportToCSV}
            disabled={!items.length}
          >
            Export CSV
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={printBudget}
            disabled={!items.length}
          >
            Print Budget
          </Button>
          <BudgetActions items={items} eventName={eventName || 'SECMUN Event'} />
        </div>
        <div className="mt-4 flex items-center justify-end gap-2 text-xs">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? 'Saving…' : 'Save budget'}
          </Button>
        </div>
      </Card>

      {/* Summary card */}
      <Card className="rounded-2xl border bg-slate-950 text-slate-50">
        <div className="space-y-3 p-4 sm:p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400">
            Budget summary
          </p>
          <div className="space-y-2 text-xs text-slate-200">
            <div className="flex items-center justify-between">
              <span>Total estimated</span>
              <span className="text-sm font-semibold">
                {formatCurrency(totals.total)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Per‑delegate (est.)</span>
              <span className="text-sm font-semibold">
                {totals.perHead > 0
                  ? formatCurrency(Math.round(totals.perHead))
                  : '—'}
              </span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            These figures update live as you adjust units and prices. Saving
            will overwrite previous budget entries for this event in the ledger.
          </div>
        </div>
      </Card>
    </div>
  )
}
