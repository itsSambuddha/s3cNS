'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type FinanceSummary = {
  totalBudgets: number
  budgetsOnTrack: number
}

export function FinanceCard() {
  const router = useRouter()
  const [data, setData] = useState<FinanceSummary | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setError(null)
        const res = await fetch('/api/dashboard/finance/summary')
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Failed to load finance data')
        setData(json as FinanceSummary)
      } catch (e: any) {
        setError(e?.message || 'Could not load finance data')
      }
    }
    load()
  }, [])

  const onTrack = data?.budgetsOnTrack ?? 0
  const total = data?.totalBudgets ?? 0

  return (
    <Card className="flex h-full flex-col justify-between rounded-2xl border bg-card/80 p-4 shadow-sm">
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Finance
        </p>
        <p className="text-2xl font-semibold">
          {onTrack}{' '}
          <span className="text-base text-muted-foreground">/ {total}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Budgets currently on track
        </p>
        {error && (
          <p className="mt-1 text-[11px] text-destructive">
            {error}
          </p>
        )}
      </div>
      <Button
        variant="link"
        size="sm"
        className="mt-2 px-0 text-xs font-medium"
        onClick={() => router.push('/finance/records?tab=budgets')}
      >
        Open finance →
      </Button>
    </Card>
  )
}
