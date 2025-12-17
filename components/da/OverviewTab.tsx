"use client"

import { ReactNode, useEffect, useState } from "react"
import clsx from "clsx"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip } from "@/components/ui/tooltip-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
        setLoading(true)
        const res = await fetch("/api/da/overview", { cache: "no-store" })
        if (!res.ok) {
          throw new Error(`Failed to load overview: ${res.status}`)
        }
        const json = (await res.json()) as OverviewResponse
        setData(json)
        setEvents(json.events)
      } catch (err) {
        console.error("Failed to load DA overview", err)
      } finally {
        setLoading(false)
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
      setEvents((prev) =>
        prev.map((e) => (e.id === updated.id ? { ...e, ...updated } : e)),
      )
    } catch (error) {
      console.error("Error updating event:", error)
      alert("Failed to save changes. Please try again.")
    }
  }

  async function deleteEvent() {
    if (!eventId) return
    const selected = events.find((e) => e.id === eventId)
    if (!selected) return

    if (!confirm(`Delete event "${selected.name}"? This cannot be undone.`)) {
      return
    }

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        alert(j.error || "Failed to delete event")
        return
      }

      const remaining = events.filter((e) => e.id !== eventId)
      setEvents(remaining)
      setEventId("")
      setDelegateLink("")
      setAmbassadorLink("")
      setData((prev) =>
        prev
          ? {
              ...prev,
              events: remaining,
            }
          : prev,
      )
    } catch (err) {
      console.error("Error deleting event:", err)
      alert("Error deleting event. Please try again.")
    }
  }

  if (!data || loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
        <p className="text-sm text-muted-foreground">Loading events…</p>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No events found. Create an event in the Events tab to see its overview.
      </p>
    )
  }

  const selected = events.find((e) => e.id === eventId) || null

  return (
    <div className="space-y-6 print:p-8">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Delegate Affairs overview
          </h2>
          <p className="text-xs text-muted-foreground">
            High-level stats and communication controls for each event.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <Select
            value={eventId}
            onValueChange={(v) => setEventId(v)}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selected && (
            <Button
              variant="destructive"
              size="sm"
              onClick={deleteEvent}
            >
              Delete event
            </Button>
          )}
        </div>
      </div>

      {/* Global stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat
          title="Total registrations"
          value={data.totalRegistrations}
        />
        <Stat
          title="Active events"
          value={events.filter((e) => e.status === "REG_OPEN").length}
        />
        <Stat title="Tracked events" value={events.length} />
      </div>

      {!selected ? (
        <p className="text-sm text-muted-foreground">
          Select an event to view detailed overview and configure links.
        </p>
      ) : (
        <>
          {/* Selected event header */}
          <Card className="flex flex-col gap-4 border-border/60 bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold">{selected.name}</h3>
              <p className="text-xs text-muted-foreground">
                {selected.type} · Created{" "}
                {new Date(selected.createdAt).toLocaleDateString()}
              </p>
              {selected.registrationDeadline && (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Registration deadline:{" "}
                  <span className="font-medium">
                    {new Date(
                      selected.registrationDeadline,
                    ).toLocaleDateString()}
                  </span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span
                className={clsx(
                  "inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold",
                  selected.status === "REG_OPEN"
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                    : "bg-slate-50 text-slate-600 ring-1 ring-slate-100",
                )}
              >
                {selected.status === "REG_OPEN"
                  ? "Registrations open"
                  : "Registrations closed"}
              </span>

              <button
                type="button"
                onClick={() =>
                  patchEvent({
                    status:
                      selected.status === "REG_OPEN"
                        ? "REG_CLOSED"
                        : "REG_OPEN",
                  })
                }
                className={clsx(
                  "relative inline-flex h-6 w-11 items-center rounded-full border transition-colors",
                  selected.status === "REG_OPEN"
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-slate-300 bg-slate-200",
                )}
              >
                <span
                  className={clsx(
                    "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                    selected.status === "REG_OPEN"
                      ? "translate-x-5"
                      : "translate-x-1",
                  )}
                />
              </button>
            </div>
          </Card>

          {/* Stats row */}
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat title="Total entries" value={selected.registrationCounts.total} />
            <Stat title="Delegates" value={selected.registrationCounts.delegates} />
            <Stat
              title="Campus Ambassadors"
              value={selected.registrationCounts.ambassadors}
            />
          </div>

          {/* Form links */}
          <Card className="space-y-4 border-border/60 bg-card/60 p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">
                Registration form links
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Used in registration emails and WhatsApp templates.
              </p>
            </div>

            <FormField
              label="Delegate form"
              tooltip="Sent to approved delegates in registration communications."
              value={delegateLink}
              onChange={setDelegateLink}
              onSave={() => patchEvent({ delegateFormLink: delegateLink })}
            />

            <FormField
              label="Campus ambassador form"
              tooltip="Sent to approved CAs in registration communications."
              value={ambassadorLink}
              onChange={setAmbassadorLink}
              onSave={() =>
                patchEvent({ ambassadorFormLink: ambassadorLink })
              }
            />
          </Card>

          {/* Communication preview + report */}
          <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
            <Card className="space-y-3 border-border/60 bg-card/60 p-4">
              <h3 className="text-sm font-semibold">
                Communication preview
              </h3>
              <Preview title="Interest email">
                Thank you for showing interest in{" "}
                <span className="font-semibold">{selected.name}</span>.
              </Preview>
              <Preview title="Registration email">
                Please complete the registration form to proceed with{" "}
                <span className="font-semibold">{selected.name}</span>.
              </Preview>
            </Card>

            <Card className="flex flex-col justify-between border-border/60 bg-card/60 p-4">
              <div>
                <h3 className="text-sm font-semibold">Quick actions</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Export a printable snapshot of current event metrics and
                  communication configuration.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={() => window.print()}
              >
                Download report
              </Button>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

/* Subcomponents */

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <Card className="border-border/60 bg-card/60 p-3">
      <p className="text-[11px] font-medium text-muted-foreground">
        {title}
      </p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
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
        <label className="mb-1 block cursor-help text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </label>
      </Tooltip>
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
        />
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : saved ? "Saved" : "Save"}
        </Button>
      </div>
      {value && (
        <p className="mt-1 break-all text-xs text-blue-600 underline">
          {value}
        </p>
      )}
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
    <div className="rounded-md border border-border/70 bg-background/60 p-3 text-sm">
      <p className="mb-1 text-[11px] font-semibold uppercase text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  )
}
