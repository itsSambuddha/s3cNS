"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

type Prefs = {
  pushEnabled?: boolean
  budget?: boolean
  approvals?: boolean
  events?: boolean
  tasks?: boolean
  security?: boolean
  announcements?: boolean
}

const rows: { key: keyof Prefs; label: string; desc: string }[] = [
  { key: "budget", label: "Budget & Finance", desc: "Budgets, expenses, inventory alerts." },
  { key: "approvals", label: "Approvals & Admin", desc: "Requests, roles, and overdue approvals." },
  { key: "events", label: "Events & Delegates", desc: "Event changes and delegate updates." },
  { key: "tasks", label: "Operations & Tasks", desc: "Tasks, meetings, and feedback." },
  { key: "security", label: "Security", desc: "New device logins and security changes." },
  { key: "announcements", label: "Announcements", desc: "SEC‑NEXUS announcements and broadcasts." },
]

export function NotificationSettingsForm({
  userId,
  prefs: initialPrefs,
}: {
  userId: string
  prefs: Prefs
}) {
  const [prefs, setPrefs] = useState<Prefs>({
    pushEnabled: initialPrefs.pushEnabled ?? true,
    budget: initialPrefs.budget ?? true,
    approvals: initialPrefs.approvals ?? true,
    events: initialPrefs.events ?? true,
    tasks: initialPrefs.tasks ?? true,
    security: initialPrefs.security ?? true,
    announcements: initialPrefs.announcements ?? true,
  })
  const [saving, setSaving] = useState(false)

  const update = (key: keyof Prefs, value: boolean) =>
    setPrefs((p) => ({ ...p, [key]: value }))

  async function onSave() {
    setSaving(true)
    try {
      await fetch("/api/settings/notification-prefs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, prefs }),
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4 rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Enable push on this device</p>
          <p className="text-xs text-muted-foreground">
            Turn off to stop all web push notifications on this browser.
          </p>
        </div>
        <Switch
          checked={!!prefs.pushEnabled}
          onCheckedChange={(v) => update("pushEnabled", v)}
        />
      </div>

      <div className="h-px bg-border" />

      {rows.map((row) => (
        <div key={row.key} className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">{row.label}</p>
            <p className="text-xs text-muted-foreground">{row.desc}</p>
          </div>
          <Switch
            checked={!!(prefs as any)[row.key]}
            onCheckedChange={(v) => update(row.key, v)}
          />
        </div>
      ))}

      <Button onClick={onSave} size="sm" disabled={saving}>
        {saving ? "Saving..." : "Save changes"}
      </Button>
    </div>
  )
}