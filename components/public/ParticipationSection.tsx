"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type EventType = "INTRA_SECMUN" | "INTER_SECMUN" | "WORKSHOP" | "EDBLAZON_TIMES"

type ActiveMap = Record<EventType, boolean>

const initialState: ActiveMap = {
  INTRA_SECMUN: false,
  INTER_SECMUN: false,
  WORKSHOP: false,
  EDBLAZON_TIMES: false,
}

export function ParticipationSection() {
  const [active, setActive] = useState<ActiveMap | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch("/api/public/active-events")
        if (!res.ok) throw new Error("Failed to load events")
        const data = (await res.json()) as Partial<ActiveMap>
        if (!cancelled) setActive({ ...initialState, ...data })
      } catch (e) {
        if (!cancelled) setError("Could not load event status right now.")
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const cards: { type: EventType; title: string; desc: string }[] = [
    {
      type: "INTRA_SECMUN",
      title: "Intra SECMUN",
      desc: "Closed-door intra-college conference for SEC delegates.",
    },
    {
      type: "INTER_SECMUN",
      title: "Inter SECMUN",
      desc: "Flagship inter-college SECMUN conference.",
    },
    {
      type: "WORKSHOP",
      title: "Workshops",
      desc: "Skill-building workshops and training sessions.",
    },
    {
      type: "EDBLAZON_TIMES",
      title: "EdBlazon Times",
      desc: "Editorial and journalism-focused experiences.",
    },
  ]

  const state = active ?? initialState

  return (
    <section className="bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-8 space-y-2 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Participate in a SECMUN event
          </h2>
          <p className="text-sm text-muted-foreground">
            Choose your event and submit your registration. Delegate Affairs will review every application carefully.
          </p>
          {error && (
            <p className="text-xs text-destructive">
              {error}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const open = state[card.type]
            return (
              <div
                key={card.type}
                className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold">{card.title}</h3>
                    <span
                      className={
                        "rounded-full px-2 py-0.5 text-xs " +
                        (open
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-muted text-muted-foreground")
                      }
                    >
                      {open ? "Registrations open" : "Not active"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4">
                  {open ? (
                    <Link
                      href={`/register?eventType=${card.type}`}
                      className="inline-flex w-full items-center justify-center rounded-full bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition hover:bg-primary/90"
                    >
                      Register now
                    </Link>
                  ) : (
                    <button
                      className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-full bg-muted px-3 py-2 text-xs font-medium text-muted-foreground"
                      disabled
                    >
                      This event is not active now
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
