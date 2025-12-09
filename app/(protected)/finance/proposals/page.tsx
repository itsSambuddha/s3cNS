// app/(protected)/finance/proposals/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

type ProposalSection = {
  heading: string
  body: string
}

type ProposalLineItem = {
  id: string
  label: string
  category?: string
  units?: string
  pricePerUnit?: string
  amount: number
}

type Proposal = {
  _id?: string
  title: string
  eventName?: string | null
  toEmails: string[]
  status: 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED'
  sections: ProposalSection[]
  lineItems: ProposalLineItem[]
}

function emptyProposal(): Proposal {
  return {
    title: 'New SEC-MUN Finance Proposal',
    eventName: '',
    toEmails: [],
    status: 'DRAFT',
    sections: [
      { heading: 'Objective', body: '' },
      { heading: 'Justification', body: '' },
      { heading: 'Notes', body: '' },
    ],
    lineItems: [
      {
        id: crypto.randomUUID(),
        label: '',
        category: '',
        units: '1',
        pricePerUnit: '0',
        amount: 0,
      },
    ],
  }
}

export default function FinanceProposalsPage() {
  const { user: fbUser } = useAuth()

  const [proposals, setProposals] = useState<Proposal[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Proposal>(emptyProposal())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load list on mount
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/finance/proposals')
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Failed to load proposals')

        const list = (json.proposals || []) as any[]
        setProposals(list as any)

        if (list.length > 0) {
          const first = list[0]
          setSelectedId(first._id)
          setDraft(fromApi(first))
        } else {
          setSelectedId(null)
          setDraft(emptyProposal())
        }
      } catch (e: any) {
        setError(e?.message || 'Could not load proposals')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const fromApi = (p: any): Proposal => ({
    _id: p._id,
    title: p.title,
    eventName: p.eventName,
    toEmails: p.toEmails || [],
    status: p.status || 'DRAFT',
    sections: (p.sections || []) as ProposalSection[],
    lineItems: (p.lineItems || []).map((li: any) => ({
      id: li.id || crypto.randomUUID(),
      label: li.label,
      category: li.category,
      units: String(li.units ?? ''),
      pricePerUnit: String(li.pricePerUnit ?? ''),
      amount: li.amount ?? 0,
    })),
  })

  const totalAmount = useMemo(
    () => draft.lineItems.reduce((sum, li) => sum + (li.amount || 0), 0),
    [draft.lineItems],
  )

  const handleSelect = (p: any) => {
    setSelectedId(p._id)
    setDraft(fromApi(p))
  }

  const handleNew = () => {
    setSelectedId(null)
    setDraft(emptyProposal())
  }

  const updateSection = (idx: number, body: string) => {
    setDraft((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) =>
        i === idx ? { ...s, body } : s,
      ),
    }))
  }

  const updateLineItem = (id: string, patch: Partial<ProposalLineItem>) => {
    setDraft((prev) => {
      const items = prev.lineItems.map((li) => {
        if (li.id !== id) return li
        const updated = { ...li, ...patch }
        const unitsNum = Number(updated.units ?? 0)
        const priceNum = Number(updated.pricePerUnit ?? 0)
        const amount =
          !Number.isNaN(unitsNum) && !Number.isNaN(priceNum)
            ? unitsNum * priceNum
            : 0
        return { ...updated, amount }
      })
      return { ...prev, lineItems: items }
    })
  }

  const addLineItem = () => {
    setDraft((prev) => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        {
          id: crypto.randomUUID(),
          label: '',
          category: '',
          units: '1',
          pricePerUnit: '0',
          amount: 0,
        },
      ],
    }))
  }

  const removeLineItem = (id: string) => {
    setDraft((prev) => {
      if (prev.lineItems.length === 1) return prev
      return {
        ...prev,
        lineItems: prev.lineItems.filter((li) => li.id !== id),
      }
    })
  }

  const handleEmailsChange = (value: string) => {
    const emails = value
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean)
    setDraft((prev) => ({ ...prev, toEmails: emails }))
  }

  const saveDraft = async () => {
    if (!fbUser) {
      setError('You must be signed in to save a proposal.')
      return
    }
    try {
      setSaving(true)
      setError(null)

      const res = await fetch('/api/finance/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedId || undefined,
          title: draft.title,
          eventName: draft.eventName,
          toEmails: draft.toEmails,
          sections: draft.sections,
          lineItems: draft.lineItems.map((li) => ({
            label: li.label,
            category: li.category,
            units: Number(li.units ?? 0),
            pricePerUnit: Number(li.pricePerUnit ?? 0),
            amount: li.amount,
          })),
          createdByUid: fbUser.uid,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to save proposal')

      const saved = fromApi(json.proposal)
      setSelectedId(saved._id!)
      setDraft(saved)

      setProposals((prev) => {
        const exists = prev.find((p) => p._id === saved._id)
        if (exists) {
          return prev.map((p) => (p._id === saved._id ? saved : p))
        }
        return [saved, ...prev]
      })
    } catch (e: any) {
      setError(e?.message || 'Could not save proposal')
    } finally {
      setSaving(false)
    }
  }

  const sendProposal = async () => {
    if (!selectedId) {
      setError('Save the proposal before sending.')
      return
    }
    try {
      setSending(true)
      setError(null)

      const res = await fetch(`/api/finance/proposals/${selectedId}/send`, {
        method: 'POST',
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to send proposal')

      alert('Proposal email sent successfully.')
    } catch (e: any) {
      setError(e?.message || 'Could not send proposal')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[260px,minmax(0,1fr)]">
      {/* Sidebar */}
      <Card className="flex h-full flex-col rounded-2xl border bg-card/80 p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Proposals
          </p>
          <Button size="sm" variant="outline" onClick={handleNew}>
            New
          </Button>
        </div>
        <div className="flex-1 overflow-auto">
          {proposals.length === 0 && (
            <p className="px-1 py-2 text-xs text-muted-foreground">
              No proposals yet. Click “New” to create one.
            </p>
          )}
          <div className="space-y-1">
            {proposals.map((p: any) => (
              <button
                key={p._id}
                type="button"
                onClick={() => handleSelect(p)}
                className={cn(
                  'w-full rounded-lg px-2 py-1.5 text-left text-xs transition-colors',
                  selectedId === p._id
                    ? 'bg-slate-900 text-slate-50'
                    : 'hover:bg-muted',
                )}
              >
                <p className="line-clamp-1 font-medium">{p.title}</p>
                <p className="line-clamp-1 text-[11px] text-muted-foreground">
                  {p.eventName || 'SEC-MUN event'} · {p.status}
                </p>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Editor */}
      <Card className="space-y-4 rounded-2xl border bg-card/80 p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <Input
              value={draft.title}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, title: e.target.value }))
              }
              className="h-9 text-sm"
            />
            <Input
              value={draft.eventName || ''}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, eventName: e.target.value }))
              }
              placeholder="Event name (e.g. SEC-MUN 2026)"
              className="h-8 text-xs"
            />
            <Input
              value={draft.toEmails.join(', ')}
              onChange={(e) => handleEmailsChange(e.target.value)}
              placeholder="Recipient emails (comma separated)"
              className="h-8 text-xs"
            />
            <p className="text-[10px] text-muted-foreground">
              Internal id: {selectedId || 'none'}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 text-xs">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={saveDraft}
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save draft'}
              </Button>
              <Button
                size="sm"
                onClick={sendProposal}
                disabled={sending || !selectedId}
              >
                {sending ? 'Sending…' : 'Send via email'}
              </Button>
            </div>
            {error && (
              <p className="max-w-xs text-right text-[11px] text-destructive">
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[2fr,minmax(260px,0.9fr)]">
          {/* Sections */}
          <div className="space-y-3">
            {draft.sections.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {s.heading}
                </p>
                <Textarea
                  value={s.body}
                  onChange={(e) => updateSection(idx, e.target.value)}
                  className="min-h-[80px] text-xs"
                />
              </div>
            ))}
          </div>

          {/* Budget table */}
          <div className="space-y-2 text-xs">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Budget items
            </p>
            <div className="overflow-hidden rounded-xl border bg-background">
              <div className="max-h-[260px] overflow-auto">
                <table className="min-w-full border-collapse text-xs">
                  <thead className="bg-muted/60 text-[11px] uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="border-b px-3 py-2 text-left">Item</th>
                      <th className="border-b px-3 py-2 text-left">Category</th>
                      <th className="border-b px-3 py-2 text-right">Units</th>
                      <th className="border-b px-3 py-2 text-right">
                        Price / unit
                      </th>
                      <th className="border-b px-3 py-2 text-right">Amount</th>
                      <th className="border-b px-3 py-2 text-center">✕</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draft.lineItems.map((li) => (
                      <tr key={li.id} className="border-t text-[11px]">
                        <td className="px-3 py-2">
                          <Input
                            value={li.label}
                            onChange={(e) =>
                              updateLineItem(li.id, { label: e.target.value })
                            }
                            className="h-7 text-[11px]"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            value={li.category || ''}
                            onChange={(e) =>
                              updateLineItem(li.id, {
                                category: e.target.value,
                              })
                            }
                            className="h-7 text-[11px]"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <Input
                            type="number"
                            value={li.units ?? ''}
                            onChange={(e) =>
                              updateLineItem(li.id, {
                                units: e.target.value,
                              })
                            }
                            className="h-7 text-right text-[11px]"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <Input
                            type="number"
                            value={li.pricePerUnit ?? ''}
                            onChange={(e) =>
                              updateLineItem(li.id, {
                                pricePerUnit: e.target.value,
                              })
                            }
                            className="h-7 text-right text-[11px]"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          {li.amount}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            className={cn(
                              'inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px]',
                              draft.lineItems.length === 1
                                ? 'cursor-not-allowed bg-muted text-muted-foreground'
                                : 'bg-rose-50 text-rose-700 hover:bg-rose-100',
                            )}
                            onClick={() => removeLineItem(li.id)}
                            disabled={draft.lineItems.length === 1}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
              <button
                type="button"
                className="rounded-full border px-2 py-0.5 text-[11px] hover:bg-muted"
                onClick={addLineItem}
              >
                + Add line item
              </button>
              <span className="font-medium">
                Total: {totalAmount}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
