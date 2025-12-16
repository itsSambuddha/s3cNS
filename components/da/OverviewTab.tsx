"use client"

import { ReactNode, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip } from "@/components/ui/tooltip-card"
import clsx from "clsx"

type EventItem = {
  _id: string
  name: string
  type: string
  status: "REG_OPEN" | "REG_CLOSED"
  delegateFormLink?: string
  ambassadorFormLink?: string
}

type OverviewResponse = {
  event: EventItem
  stats: {
    total: number
    interest: {
      emailSent: number
      whatsappSent: number
    }
    registration: {
      emailSent: number
      whatsappSent: number
    }
  }
}

export function OverviewTab() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [eventId, setEventId] = useState("")
  const [data, setData] = useState<OverviewResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const [delegateLink, setDelegateLink] = useState("")
  const [ambassadorLink, setAmbassadorLink] = useState("")

  /* ---------------- Load events ---------------- */
  useEffect(() => {
    fetch("/api/events")
      .then(r => r.json())
      .then(j => j.success && setEvents(j.data))
  }, [])

  /* ---------------- Load overview ---------------- */
  useEffect(() => {
    if (!eventId) return
    setLoading(true)

    fetch(`/api/da/overview?eventId=${eventId}`)
      .then(r => r.json())
      .then(j => {
        if (j.success) {
          setData(j)
          setDelegateLink(j.event.delegateFormLink || "")
          setAmbassadorLink(j.event.ambassadorFormLink || "")
        }
      })
      .finally(() => setLoading(false))
  }, [eventId])

  /* ---------------- Update event ---------------- */
  async function patchEvent(payload: Partial<EventItem>) {
    if (!data) return
    try {
      const response = await fetch(`/api/da/events/${data.event._id}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        throw new Error(`Failed to update: ${response.statusText}`)
      }
      setData({
        ...data,
        event: { ...data.event, ...payload },
      })
    } catch (error) {
      console.error("Error updating event:", error)
      alert("Failed to save changes. Please try again.")
    }
  }

  if (!events.length) {
    return <p className="text-sm text-muted-foreground">Loading events…</p>
  }

  return (
    <div className="space-y-8 print:p-8">
      {/* ================= Event Selector ================= */}
      <select
        value={eventId}
        onChange={e => setEventId(e.target.value)}
        className="rounded-md border px-3 py-2 text-sm"
      >
        <option value="">Select event</option>
        {events.map(e => (
          <option key={e._id} value={e._id}>
            {e.name} — {e.type}
          </option>
        ))}
      </select>

      {loading && <p>Loading overview…</p>}

      {data && (
        <>
          {/* ================= Header ================= */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{data.event.name}</h2>
              <p className="text-sm text-muted-foreground">{data.event.type}</p>
            </div>

            <div className="flex items-center gap-5">
              <span
                className={clsx(
                  "rounded-full px-5 py-2 text-l font-bold",
                  data.event.status === "REG_OPEN"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700",
                )}
              >
                {data.event.status === "REG_OPEN" ? "Open" : "Closed"}
              </span>

              <input
                type="checkbox"
                checked={data.event.status === "REG_OPEN"}
                onChange={() =>
                  patchEvent({
                    status:
                      data.event.status === "REG_OPEN"
                        ? "REG_CLOSED"
                        : "REG_OPEN",
                  })
                }
              />
            </div>
          </div>

          {/* ================= Stats ================= */}
          <div className="grid grid-cols-3 gap-4">
            <Stat title="Total entries" value={data.stats.total} />

            {/* <CommStat
              title="Interest"
              email={data.stats.interest.emailSent}
              whatsapp={data.stats.interest.whatsappSent}
              enabled
            /> */}

            {/* <CommStat
              title="Registration"
              email={data.stats.registration.emailSent}
              whatsapp={data.stats.registration.whatsappSent}
              enabled={!!data.event.delegateFormLink}
            /> */}
          </div>

          {/* ================= Form Links ================= */}
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
              onSave={() =>
                patchEvent({ ambassadorFormLink: ambassadorLink })
              }
            />
          </Card>

          {/* ================= Preview ================= */}
          <Card className="p-4 space-y-3">
            <h3 className="font-medium">Communication preview</h3>
            <Preview title="Interest email">
              Thank you for showing interest in {data.event.name}.
            </Preview>
            <Preview title="Registration email">
              Please complete the registration form to proceed.
            </Preview>
          </Card>

          {/* ================= Report ================= */}
          <Button variant="outline" onClick={() => window.print()}>
            Download report
          </Button>
        </>
      )}
    </div>
  )
}

/* ================= Subcomponents ================= */

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </Card>
  )
}

function CommStat({
  title,
  email,
  whatsapp,
  enabled,
}: {
  title: string
  email: number
  whatsapp: number
  enabled: boolean
}) {
  return (
    <Card className="p-4 space-y-2">
      <p className="text-xs text-muted-foreground">{title}</p>
      <div className="flex gap-2">
        <CommButton label="Email" active={email > 0} enabled={enabled} />
        <CommButton label="WhatsApp" active={whatsapp > 0} enabled={enabled} />
      </div>
    </Card>
  )
}

function CommButton({
  label,
  active,
  enabled,
}: {
  label: string
  active: boolean
  enabled: boolean
}) {
  return (
    <button
      disabled={!enabled}
      className={clsx(
        "rounded px-3 py-1 text-xs font-medium",
        active
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700",
        !enabled && "opacity-40 cursor-not-allowed",
      )}
    >
      {label}
    </button>
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
  onSave: () => Promise<void>
}) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000) // Reset after 2 seconds
    } catch (error) {
      // Error already handled in patchEvent
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
        <Input value={value} onChange={e => onChange(e.target.value)} />
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
