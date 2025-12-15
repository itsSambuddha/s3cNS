// components/da/RegistrationsTab.tsx
// FULLY REPLACEABLE — stable, minimal, production-safe

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Mail, MessageSquare } from "lucide-react"

type Registration = {
  _id: string
  eventType: string
  fullName: string
  email: string
  whatsAppNumber: string
  interestType?: "DELEGATE" | "CAMPUS_AMBASSADOR"
  emailSent?: boolean
  whatsappSent?: boolean
  createdAt: string
}

function formatEvent(type: string) {
  return type.replace(/_/g, " ")
}

function openWhatsApp(number: string, name: string, eventType: string) {
  const clean = number.replace(/\D/g, "")
  if (clean.length !== 10) {
    alert("Invalid phone number")
    return
  }

  const full = `91${clean}`
  const text = encodeURIComponent(
    `Hello ${name}, your interest for ${formatEvent(eventType)} has been registered. Delegate Affairs will contact you shortly.`,
  )

  window.open(`https://wa.me/${full}?text=${text}`, "_blank")
}

export function RegistrationsTab({
  selectedEventType,
}: {
  selectedEventType?: string
}) {
  const [data, setData] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const url = selectedEventType
      ? `/api/registrations?eventType=${selectedEventType}`
      : `/api/registrations`

    const res = await fetch(url)
    const json = await res.json()
    setData(json.data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [selectedEventType])

  async function send(reg: Registration, channel: "email" | "whatsapp") {
    setSending(reg._id + channel)

    if (channel === "whatsapp") {
      openWhatsApp(reg.whatsAppNumber, reg.fullName, reg.eventType)
    }

    await fetch("/api/registrations/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationId: reg._id,
        channel,
      }),
    })

    await load()
    setSending(null)
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading registrations…
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No registrations found.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Event</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="px-3 py-2 font-medium">
                  {r.fullName}
                </td>
                <td className="px-3 py-2">{r.email}</td>
                <td className="px-3 py-2">{r.whatsAppNumber}</td>
                <td className="px-3 py-2">
                  {formatEvent(r.eventType)}
                </td>
                <td className="px-3 py-2">
                  {r.interestType || "—"}
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      disabled={r.emailSent || sending === r._id + "email"}
                      onClick={() => send(r, "email")}
                    >
                      {sending === r._id + "email" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Mail className="h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                      disabled={
                        r.whatsappSent ||
                        sending === r._id + "whatsapp"
                      }
                      onClick={() => send(r, "whatsapp")}
                    >
                      {sending === r._id + "whatsapp" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MessageSquare className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
