// components/da/RegistrationsTab.tsx

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { waTo } from "@/lib/whatsapp"
import Image from "next/image"

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

export function RegistrationsTab() {
  const [rows, setRows] = useState<RegistrationRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // local event + interest filters
  const [selectedEventId, setSelectedEventId] = useState<string>("")
  const [selectedInterestType, setSelectedInterestType] =
    useState<InterestType | "ALL">("ALL")

  const [sendingInterest, setSendingInterest] = useState(false)
  const [sendingRegistration, setSendingRegistration] = useState(false)
  const [sendingRowId, setSendingRowId] = useState<string | null>(null)

  // derive unique events from rows for dropdown
  const uniqueEvents = Array.from(
    new Map(
      rows
        .filter((r) => r.eventId && r.eventName)
        .map((r) => [r.eventId as string, r.eventName as string]),
    ).entries(),
  ).map(([id, name]) => ({ id, name }))

  // load whenever filters change
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

  // BULK EMAIL: INTEREST / REGISTRATION
  async function sendBulk(mode: "INTEREST" | "REGISTRATION") {
    if (!selectedEventId) {
      setError("Select an event to use bulk send.")
      return
    }

    setError(null)
    const setter =
      mode === "INTEREST" ? setSendingInterest : setSendingRegistration
    setter(true)

    try {
      const res = await fetch("/api/registrations/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          eventId: selectedEventId,
          interestType:
            selectedInterestType === "ALL" ? null : selectedInterestType,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `Failed with status ${res.status}`)
      }

      await reloadRows()
      console.log(`✅ ${mode} EMAIL messages sent successfully`, data)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`❌ Failed to send ${mode} messages:`, msg)
      setError(msg)
    } finally {
      setter(false)
    }
  }

  // SINGLE EMAIL
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
      {/* Header + filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
            Database Interface
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Registrations</h2>
          <p className="text-sm font-medium text-slate-500 max-w-lg dark:text-zinc-400">
            Filter by event and interest type, then send emails in bulk or per
            registrant.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 md:items-center">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold transition-all focus:ring-2 focus:ring-blue-500/20 dark:bg-white/5 dark:border-white/10"
          >
            <option value="">All events</option>
            {uniqueEvents.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>

          <select
            value={selectedInterestType}
            onChange={(e) =>
              setSelectedInterestType(
                e.target.value === "ALL"
                  ? "ALL"
                  : (e.target.value as InterestType),
              )
            }
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold transition-all focus:ring-2 focus:ring-blue-500/20 dark:bg-white/5 dark:border-white/10"
          >
            <option value="ALL">All interests</option>
            <option value="DELEGATE">Delegate</option>
            <option value="CAMPUS_AMBASSADOR">Campus ambassador</option>
          </select>

          <Button
            variant="outline"
            size="lg"
            disabled={sendingInterest || !selectedEventId}
            onClick={() => sendBulk("INTEREST")}
            className="rounded-xl font-bold border-slate-200 shadow-sm"
          >
            {sendingInterest ? "Sending..." : "Bulk Interest"}
          </Button>
          <Button
            size="lg"
            disabled={sendingRegistration || !selectedEventId}
            onClick={() => sendBulk("REGISTRATION")}
            className="rounded-xl font-bold bg-slate-900 text-white shadow-lg shadow-slate-900/10 dark:bg-white dark:text-slate-900"
          >
            {sendingRegistration
              ? "Sending..."
              : "Bulk Registration"}
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
        <div className="overflow-x-auto rounded-[2rem] border border-blue-200/60 bg-white shadow-xl shadow-blue-500/5 dark:bg-zinc-900/40">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:bg-white/5">
              <tr>
                <th className="px-6 py-4">Participant</th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">WhatsApp</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Interest</th>
                <th className="px-4 py-4">Reg. Link</th>
                <th className="px-4 py-4">Actions</th>
                <th className="px-6 py-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y bg-white">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {r.fullName}
                    </div>
                    {r.eventName && (
                      <div className="text-xs text-gray-500">
                        {r.eventName}
                      </div>
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
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled={sendingRowId === r.id}
                        onClick={() => sendSingleEmail("INTEREST", r.id)}
                        title="Send interest email"
                      >
                        <Image
                          src="/logo/Gmail_Logo.svg"
                          alt="Email"
                          width={16}
                          height={16}
                        />
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openInterestWhatsApp(r)}
                        title="Send interest WhatsApp"
                      >
                        <Image
                          src="/logo/WhatsApp.svg"
                          alt="WhatsApp"
                          width={16}
                          height={16}
                        />
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled={sendingRowId === r.id}
                        onClick={() => sendSingleEmail("REGISTRATION", r.id)}
                        title="Send registration email"
                      >
                        <Image
                          src="/logo/Gmail_Logo.svg"
                          alt="Email"
                          width={16}
                          height={16}
                        />
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openRegistrationWhatsApp(r)}
                        title="Send registration WhatsApp"
                      >
                        <Image
                          src="/logo/WhatsApp.svg"
                          alt="WhatsApp"
                          width={16}
                          height={16}
                        />
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
