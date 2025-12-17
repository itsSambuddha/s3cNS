"use client"

import { ReactNode, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip } from "@/components/ui/tooltip-card"
import clsx from "clsx"

type EventStatus = "REG_OPEN" | "REG_CLOSED"
type EventType = "INTRA_SECMUN" | "INTER_SECMUN" | "WORKSHOP" | "EDBLAZON_TIMES"

type EventSummary = {
  id: string
  name: string
  type: EventType
  status: EventStatus
  registrationDeadline: string | null
  delegateFormLink: string | null
  ambassadorFormLink: string | null
  createdAt: string
  registrationCounts: {
    total: number
    delegates: number
    ambassadors: number
  }
}

type OverviewResponse = {
  totalRegistrations: number
  events: EventSummary[]
}

export function OverviewTab() {
  const [events, setEvents] = useState<EventSummary[]>([])
  const [eventId, setEventId] = useState("")
  const [data, setData] = useState<OverviewResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const [delegateLink, setDelegateLink] = useState("")
  const [ambassadorLink, setAmbassadorLink] = useState("")

  // Load overview once
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/da/overview", { cache: "no-store" })
        if (!res.ok) {
          throw new Error(`Failed to load overview: ${res.status}`)
        }
        const json = (await res.json()) as OverviewResponse
        setData(json)
        setEvents(json.events)
      } catch (err) {
        console.error("Failed to load DA overview", err)
      }
    }
    load()
  }, [])

  // When eventId changes, sync links from data
  useEffect(() => {
    if (!eventId || !data) return
    const ev = data.events.find((e) => e.id === eventId)
    if (!ev) return
    setDelegateLink(ev.delegateFormLink || "")
    setAmbassadorLink(ev.ambassadorFormLink || "")
  }, [eventId, data])

  async function patchEvent(payload: Partial<EventSummary>) {
    if (!eventId) return
    try {
      const res = await fetch(`/api/da/events/${eventId}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        throw new Error(`Failed to update: ${res.status}`)
      }
      const json = await res.json()
      const updated = json.event as EventSummary

      setData((prev) =>
        prev
          ? {
              ...prev,
              events: prev.events.map((e) =>
                e.id === updated.id ? { ...e, ...updated } : e,
              ),
            }
          : prev,
      )
    } catch (error) {
      console.error("Error updating event:", error)
      alert("Failed to save changes. Please try again.")
    }
  }

  if (!data || events.length === 0) {
    return <p className="text-sm text-muted-foreground">Loading events…</p>
  }

  const selected = events.find((e) => e.id === eventId) || null

  return (
    <div className="space-y-8 print:p-8">
      {/* Event selector */}
      <select
        value={eventId}
        onChange={(e) => setEventId(e.target.value)}
        className="rounded-md border px-3 py-2 text-sm"
      >
        <option value="">Select event</option>
        {events.map((e) => (
          <option key={e.id} value={e.id}>
            {e.name} — {e.type}
          </option>
        ))}
      </select>

      {!selected && <p className="text-sm text-muted-foreground">Select an event to view overview.</p>}

      {selected && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{selected.name}</h2>
              <p className="text-sm text-muted-foreground">{selected.type}</p>
            </div>

            <div className="flex items-center gap-5">
              <span
                className={clsx(
                  "rounded-full px-5 py-2 text-l font-bold",
                  selected.status === "REG_OPEN"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700",
                )}
              >
                {selected.status === "REG_OPEN" ? "Open" : "Closed"}
              </span>

              <input
                type="checkbox"
                checked={selected.status === "REG_OPEN"}
                onChange={() =>
                  patchEvent({
                    status:
                      selected.status === "REG_OPEN"
                        ? "REG_CLOSED"
                        : "REG_OPEN",
                  })
                }
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Stat title="Total entries" value={selected.registrationCounts.total} />
            <Stat title="Delegates" value={selected.registrationCounts.delegates} />
            <Stat
              title="Campus Ambassadors"
              value={selected.registrationCounts.ambassadors}
            />
          </div>

          {/* Form Links */}
          <Card className="space-y-4 p-4">
            <h3 className="font-medium">Registration Forms</h3>

            <FormField
              label="Delegate form"
              tooltip="Sent to approved delegates"
              value={delegateLink}
              onChange={setDelegateLink}
              onSave={() => patchEvent({ delegateFormLink: delegateLink })}
            />

            <FormField
              label="Campus Ambassador form"
              tooltip="Sent to approved CAs"
              value={ambassadorLink}
              onChange={setAmbassadorLink}
              onSave={() => patchEvent({ ambassadorFormLink: ambassadorLink })}
            />
          </Card>

          {/* Preview */}
          <Card className="p-4 space-y-3">
            <h3 className="font-medium">Communication preview</h3>
            <Preview title="Interest email">
              Thank you for showing interest in {selected.name}.
            </Preview>
            <Preview title="Registration email">
              Please complete the registration form to proceed.
            </Preview>
          </Card>

          {/* Report */}
          <Button variant="outline" onClick={() => window.print()}>
            Download report
          </Button>
        </>
      )}
    </div>
  )
}

/* Subcomponents */

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </Card>
  )
}

function FormField({
  label,
  tooltip,
  value,
  onChange,
  onSave,
}: {
  label: string
  tooltip: string
  value: string
  onChange: (v: string) => void
  onSave: () => Promise<void> | void
}) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Tooltip content={tooltip}>
        <label className="mb-1 block cursor-help text-sm font-medium">
          {label}
        </label>
      </Tooltip>
      <div className="flex gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : saved ? "Saved" : "Save"}
        </Button>
      </div>
    </div>
  )
}

function Preview({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-md border bg-muted p-3 text-sm">
      <p className="mb-1 text-xs font-semibold uppercase">{title}</p>
      {children}
    </div>
  )
}
