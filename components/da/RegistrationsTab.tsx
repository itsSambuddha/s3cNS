// components/da/RegistrationsTab.tsx

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { waTo } from "@/lib/whatsapp"

type InterestType = "DELEGATE" | "CAMPUS_AMBASSADOR"
type DelegateStatus = "APPLIED" | "ALLOTTED" | "REJECTED" | "WITHDRAWN"

interface RegistrationRow {
  id: string
  eventId: string | null
  eventName: string | null
  eventType: string
  interestType: InterestType | null
  fullName: string
  email: string
  whatsAppNumber: string
  status: DelegateStatus
  emailSent: boolean
  whatsappSent: boolean
  registrationEmailSent: boolean
  registrationWhatsappSent: boolean
  createdAt: string
}

interface RegistrationsResponse {
  registrations: RegistrationRow[]
}

interface Props {
  selectedEventId?: string | null
  selectedInterestType?: InterestType | "ALL"
}

export function RegistrationsTab({
  selectedEventId,
  selectedInterestType = "ALL",
}: Props) {
  const [rows, setRows] = useState<RegistrationRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sendingInterest, setSendingInterest] = useState(false)
  const [sendingRegistration, setSendingRegistration] = useState(false)
  const [sendingRowId, setSendingRowId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (selectedEventId) params.set("eventId", selectedEventId)
        if (selectedInterestType !== "ALL")
          params.set("interestType", selectedInterestType)

        const res = await fetch(`/api/registrations?${params.toString()}`, {
          cache: "no-store",
        })
        if (!res.ok) {
          throw new Error(`Failed to load registrations: ${res.status}`)
        }
        const json = (await res.json()) as RegistrationsResponse
        if (!cancelled) {
          setRows(json.registrations)
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error("❌ Failed to load registrations:", msg)
        if (!cancelled) setError(msg)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [selectedEventId, selectedInterestType])

  async function reloadRows() {
    const params = new URLSearchParams()
    if (selectedEventId) params.set("eventId", selectedEventId)
    if (selectedInterestType !== "ALL")
      params.set("interestType", selectedInterestType)
    const reloadRes = await fetch(`/api/registrations?${params.toString()}`, {
      cache: "no-store",
    })
    if (reloadRes.ok) {
      const json = (await reloadRes.json()) as RegistrationsResponse
      setRows(json.registrations)
    }
  }

  async function sendBulk(mode: "INTEREST" | "REGISTRATION") {
    if (!selectedEventId) {
      setError("Please select an event before sending messages.")
      return
    }

    const setter = mode === "INTEREST" ? setSendingInterest : setSendingRegistration
    setter(true)
    setError(null)

    try {
      const res = await fetch("/api/registrations/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          eventId: selectedEventId,
          interestType: selectedInterestType === "ALL" ? null : selectedInterestType,
          channel: "BOTH",
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `Failed with status ${res.status}`)
      }

      await reloadRows()
      console.log(`✅ ${mode} messages sent successfully`, data)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`❌ Failed to send ${mode} messages:`, msg)
      setError(msg)
    } finally {
      setter(false)
    }
  }

  async function sendSingleEmail(
    mode: "INTEREST" | "REGISTRATION",
    registrationId: string,
  ) {
    setSendingRowId(registrationId)
    setError(null)
    try {
      const res = await fetch("/api/registrations/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          registrationId,
          channel: "EMAIL",
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || `Failed with status ${res.status}`)
      }
      await reloadRows()
      console.log(
        `✅ ${mode} EMAIL message sent for row ${registrationId}`,
        data,
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`❌ Failed to send ${mode} EMAIL for row:`, msg)
      setError(msg)
    } finally {
      setSendingRowId(null)
    }
  }

  function openInterestWhatsApp(row: RegistrationRow) {
    const msg = `Hi ${row.fullName}, thank you for showing interest in ${row.eventName}.`
    waTo(row.whatsAppNumber, msg)
  }

  function openRegistrationWhatsApp(row: RegistrationRow) {
    const msg = `Hi ${row.fullName}, please complete your registration for ${row.eventName}.`
    waTo(row.whatsAppNumber, msg)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Registrations</h2>
          <p className="text-xs text-gray-500">
            Showing interest submissions for the selected event and interest type.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={sendingInterest || !selectedEventId}
            onClick={() => sendBulk("INTEREST")}
          >
            {sendingInterest ? "Sending interest..." : "Send interest (all)"}
          </Button>
          <Button
            size="sm"
            disabled={sendingRegistration || !selectedEventId}
            onClick={() => sendBulk("REGISTRATION")}
          >
            {sendingRegistration
              ? "Sending registration..."
              : "Send registration (all)"}
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading registrations...</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-gray-500">No registrations found.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs font-medium text-gray-500">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">WhatsApp</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Interest sent</th>
                <th className="px-3 py-2">Registration sent</th>
                <th className="px-3 py-2">Actions</th>
                <th className="px-3 py-2">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y bg-white">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{r.fullName}</div>
                    {r.eventName && (
                      <div className="text-xs text-gray-500">{r.eventName}</div>
                    )}
                  </td>
                  <td className="px-3 py-2">{r.email}</td>
                  <td className="px-3 py-2">{r.whatsAppNumber}</td>
                  <td className="px-3 py-2 text-xs">
                    {r.interestType ?? "-"}
                  </td>
                  <td className="px-3 py-2 text-xs">{r.status}</td>
                  <td className="px-3 py-2 text-xs">
                    {r.emailSent || r.whatsappSent ? "Yes" : "No"}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {r.registrationEmailSent || r.registrationWhatsappSent
                      ? "Yes"
                      : "No"}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    <div className="flex flex-wrap gap-1">
                      {/* Interest EMAIL */}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={sendingRowId === r.id}
                        onClick={() => sendSingleEmail("INTEREST", r.id)}
                      >
                        IE
                      </Button>
                      {/* Interest WHATSAPP */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openInterestWhatsApp(r)}
                      >
                        IW
                      </Button>
                      {/* Registration EMAIL */}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={sendingRowId === r.id}
                        onClick={() => sendSingleEmail("REGISTRATION", r.id)}
                      >
                        RE
                      </Button>
                      {/* Registration WHATSAPP */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRegistrationWhatsApp(r)}
                      >
                        RW
                      </Button>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-500">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
