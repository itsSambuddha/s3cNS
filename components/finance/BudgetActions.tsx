'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

type BudgetItem = {
  id: string
  budgetItem: string
  units: string
  pricePerUnit: string
  remarks: string
}

export function BudgetActions({
  items,
  eventName,
}: {
  items: BudgetItem[]
  eventName: string
}) {
  const router = useRouter()
  const { user } = useAuth()
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateProposal = async () => {
    if (!user) {
      setError('You must be signed in to send a proposal.')
      return
    }

    try {
      setSending(true)
      setError(null)

      const lineItems = items.map((row) => {
        const units = Number(row.units || 0)
        const price = Number(row.pricePerUnit || 0)
        const amount =
          !Number.isNaN(units) && !Number.isNaN(price) ? units * price : 0

        return {
          label: row.budgetItem,
          category: 'GENERAL',
          units,
          pricePerUnit: price,
          amount,
        }
      })

      const res = await fetch('/api/finance/proposals/from-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Finance proposal – ${eventName}`,
          eventName,
          toEmails: [], // can fill later in proposals page
          sections: [
            { heading: 'Objective', body: 'To secure funding for the event budget items listed below.' },
            { heading: 'Justification', body: 'The budget breakdown provides a detailed cost analysis for all necessary expenses to successfully execute the event.' },
            { heading: 'Notes', body: 'Please review the budget items and approve the funding request.' },
          ],
          lineItems,
          createdByUid: user.uid,
        }),
      })

      const json = await res.json()

      if (!res.ok) throw new Error(json.error || 'Failed to create proposal')

      const proposalId = json.proposalId as string

      // Redirect to proposals workspace with this proposal selected
      router.push(`/finance/proposals?id=${proposalId}`)
    } catch (e: any) {
      console.error('Error creating proposal:', e)
      setError(e?.message || 'Could not create proposal from budget')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        size="sm"
        variant="outline"
        onClick={handleCreateProposal}
        disabled={sending}
      >
        {sending ? 'Preparing…' : 'Send via email'}
      </Button>
      {error && (
        <p className="text-[11px] text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
