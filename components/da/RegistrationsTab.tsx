"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Mail, MessageSquare } from "lucide-react"
import clsx from "clsx"

type Registration = {
  _id: string
  fullName: string
  email: string
  whatsAppNumber: string
  eventType: string
  interestType?: "DELEGATE" | "CAMPUS_AMBASSADOR"

  // Interest
  emailSent?: boolean
  whatsappSent?: boolean

  // Registration
  registrationEmailSent?: boolean
  registrationWhatsappSent?: boolean
}

function formatEvent(type: string) {
  return type.replace(/_/g, " ")
}

/* =========================
   WhatsApp Normalizer
========================= */
function openWhatsApp(
  rawNumber: string,
  message: string,
) {
  // remove everything except digits
  let num = rawNumber.replace(/\D/g, "")

  // handle +91 / 91 / plain 10 digit
  if (num.startsWith("91") && num.length === 12) {
    num = num.slice(2)
  }

  if (num.length !== 10) {
    alert(`Invalid phone number: ${rawNumber}`)
    return
  }

  const url = `https://wa.me/91${num}?text=${encodeURIComponent(message)}`
  window.open(url, "_blank")
}

interface RegistrationsTabProps {
  selectedEventType?: string
}

export function RegistrationsTab({
  selectedEventType,
}: RegistrationsTabProps) {
  const [rows, setRows] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const res = await fetch("/api/registrations")
    const json = await res.json()
    setRows(json.data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function send(
    r: Registration,
    channel: "email" | "whatsapp",
    kind: "interest" | "registration",
  ) {
    const key = `${r._id}-${kind}-${channel}`
    setSending(key)

    if (channel === "whatsapp") {
      const msg =
        kind === "interest"
          ? `Hello ${r.fullName}, your interest for ${formatEvent(
              r.eventType,
            )} has been recorded.`
          : `Hello ${r.fullName}, please complete your registration for ${formatEvent(
              r.eventType,
            )} using the form sent to you.`

      openWhatsApp(r.whatsAppNumber, msg)
    }

    await fetch("/api/registrations/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationId: r._id,
        channel,
        kind,
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

  if (!rows.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No registrations found.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-3 py-2 text-left">Name</th>
            <th className="px-3 py-2 text-left">Email</th>
            <th className="px-3 py-2 text-left">Phone</th>
            <th className="px-3 py-2 text-left">Event</th>
            <th className="px-3 py-2 text-left">Interest</th>
            <th className="px-3 py-2 text-left">Registration</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => (
            <tr key={r._id} className="border-t">
              <td className="px-3 py-2 font-medium">{r.fullName}</td>
              <td className="px-3 py-2">{r.email}</td>
              <td className="px-3 py-2">{r.whatsAppNumber}</td>
              <td className="px-3 py-2">{formatEvent(r.eventType)}</td>

              {/* ========== INTEREST ========== */}
              <td className="px-3 py-2">
                <div className="flex gap-2">
                  <CommButton
                    active={!!r.emailSent}
                    loading={sending === `${r._id}-interest-email`}
                    onClick={() =>
                      send(r, "email", "interest")
                    }
                  >
                    <Mail className="h-4 w-4" />
                  </CommButton>

                  <CommButton
                    active={!!r.whatsappSent}
                    loading={sending === `${r._id}-interest-whatsapp`}
                    onClick={() =>
                      send(r, "whatsapp", "interest")
                    }
                  >
                    <MessageSquare className="h-4 w-4" />
                  </CommButton>
                </div>
              </td>

              {/* ========== REGISTRATION ========== */}
              <td className="px-3 py-2">
                <div className="flex gap-2">
                  <CommButton
                    active={!!r.registrationEmailSent}
                    loading={sending === `${r._id}-registration-email`}
                    onClick={() =>
                      send(r, "email", "registration")
                    }
                  >
                    <Mail className="h-4 w-4" />
                  </CommButton>

                  <CommButton
                    active={!!r.registrationWhatsappSent}
                    loading={sending === `${r._id}-registration-whatsapp`}
                    onClick={() =>
                      send(r, "whatsapp", "registration")
                    }
                  >
                    <MessageSquare className="h-4 w-4" />
                  </CommButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* =========================
   Button Component
========================= */
function CommButton({
  active,
  loading,
  onClick,
  children,
}: {
  active: boolean
  loading?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Button
      size="icon"
      variant="outline"
      disabled={loading}
      onClick={onClick}
      className={clsx(
        active
          ? "bg-green-100 text-green-700 border-green-300"
          : "bg-red-100 text-red-700 border-red-300",
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        children
      )}
    </Button>
  )
}
