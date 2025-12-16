// components/da/OverviewTab.tsx
"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Tooltip } from "@/components/ui/tooltip-card"

type OverviewStats = {
  totalRegistrations: number
  interestCount: number
  registrationLinksSent: number
  emailSent: number
  whatsappSent: number
}

export function OverviewTab() {
  const [stats, setStats] = useState<OverviewStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/da/overview")
        const json = await res.json()
        if (json.success) setStats(json.data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading overview…</p>
  }

  if (!stats) {
    return <p className="text-sm text-destructive">Failed to load overview</p>
  }

  const Item = ({
    label,
    value,
    tooltip,
  }: {
    label: string
    value: number
    tooltip: string
  }) => (
    <Card className="p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        <Tooltip content={tooltip}>
          <span className="cursor-help">{label}</span>
        </Tooltip>
      </p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </Card>
  )

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Delegate Affairs Overview</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Item
          label="Total entries"
          value={stats.totalRegistrations}
          tooltip="Total records created in DA (interest + registrations)"
        />
        <Item
          label="Interest submitted"
          value={stats.interestCount}
          tooltip="Users who submitted interest (delegate or CA)"
        />
        <Item
          label="Forms sent"
          value={stats.registrationLinksSent}
          tooltip="Registration links sent to interested participants"
        />
        <Item
          label="Emails sent"
          value={stats.emailSent}
          tooltip="Total successful email communications"
        />
        <Item
          label="WhatsApp sent"
          value={stats.whatsappSent}
          tooltip="Total successful WhatsApp communications"
        />
      </div>
    </div>
  )
}
