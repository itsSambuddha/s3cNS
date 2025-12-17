// components/public/ParticipationSection.tsx

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type EventType = "INTRA_SECMUN" | "INTER_SECMUN" | "WORKSHOP" | "EDBLAZON_TIMES"

interface ActiveEventInfo {
  id: string
  name: string
  type: EventType
  status: "REG_OPEN" | "REG_CLOSED"
  registrationDeadline: string | null
  delegateFormLink: string | null
  ambassadorFormLink: string | null
}

interface EventsByTypeItem {
  type: EventType
  event: ActiveEventInfo | null
}

interface ActiveEventsResponse {
  eventsByType: EventsByTypeItem[]
}

const LABELS: Record<EventType, { title: string; description: string }> = {
  INTRA_SECMUN: {
    title: "Intra SECMUN",
    description: "Closed-door intra-college conference for SEC delegates.",
  },
  INTER_SECMUN: {
    title: "Inter SECMUN",
    description: "Flagship inter-college SECMUN conference.",
  },
  WORKSHOP: {
    title: "Workshops",
    description: "Skill-building workshops and training sessions.",
  },
  EDBLAZON_TIMES: {
    title: "EdBlazon Times",
    description: "Editorial and journalism-focused experiences.",
  },
}

export function ParticipationSection() {
  const [data, setData] = useState<EventsByTypeItem[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch("/api/public/active-events", { cache: "no-store" })
        if (!res.ok) {
          throw new Error(`Failed to load active events: ${res.status}`)
        }
        const json = (await res.json()) as ActiveEventsResponse
        if (!cancelled) {
          setData(json.eventsByType)
        }
      } catch (err) {
        console.error("❌ Failed to load active events", err)
        if (!cancelled) setData([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  function renderCard(type: EventType) {
    const item = data?.find((i) => i.type === type) ?? null
    const ev = item?.event ?? null
    const { title, description } = LABELS[type]

    const isActive = !!ev
    const href = isActive
      ? `/register?eventType=${encodeURIComponent(type)}&eventId=${encodeURIComponent(ev.id)}`
      : undefined

    return (
      <div
        key={type}
        className="flex flex-col rounded-xl border bg-white p-4 shadow-sm"
      >
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
            }`}
          >
            {isActive ? "Active" : "Not active"}
          </span>

          {isActive ? (
            <Link
              href={href!}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Register interest →
            </Link>
          ) : (
            <span className="text-xs text-gray-400">Registrations closed</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <section className="py-12">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Participate in a SECMUN event
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Choose your event and submit your registration. Delegate Affairs will review every application carefully.
        </p>

        {loading ? (
          <p className="mt-6 text-sm text-gray-500">Loading events...</p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {renderCard("INTRA_SECMUN")}
            {renderCard("INTER_SECMUN")}
            {renderCard("WORKSHOP")}
            {renderCard("EDBLAZON_TIMES")}
          </div>
        )}
      </div>
    </section>
  )
}
