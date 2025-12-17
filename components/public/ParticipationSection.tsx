"use client"

import React, { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { useOutsideClick } from "@/hooks/use-outside-click"
import { BackgroundGradient } from "@/components/ui/background-gradient"

type EventType = "INTRA_SECMUN" | "INTER_SECMUN" | "WORKSHOP" | "EDBLAZON_TIMES"

interface ActiveEventInfo {
  id: string
  name: string
  type: EventType
  status: "REG_OPEN" | "REG_CLOSED"
  registrationDeadline: string | null
}

interface EventsByTypeItem {
  type: EventType
  event: ActiveEventInfo | null
}

interface ActiveEventsResponse {
  eventsByType: EventsByTypeItem[]
}

interface CardData {
  type: EventType
  title: string
  description: string
  src: string
  event: ActiveEventInfo | null
}

export function ParticipationSection() {
  const [data, setData] = useState<ActiveEventsResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/public/active-events", {
          cache: "no-store",
        })
        if (!res.ok) return
        const json = (await res.json()) as ActiveEventsResponse
        setData(json)
      } catch (e) {
        console.error("Failed to load active events", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const eventsByType = data?.eventsByType ?? []
  const cards: CardData[] = eventsByType.map((item) => {
    const base: Omit<CardData, "event"> = {
      type: item.type,
      title:
        item.type === "INTRA_SECMUN"
          ? "Intra SECMUN"
          : item.type === "INTER_SECMUN"
          ? "Inter SECMUN"
          : item.type === "WORKSHOP"
          ? "Workshops"
          : "EdBlazon Times",
      description:
        item.type === "INTRA_SECMUN"
          ? "Closed-door intra-college conference for SEC delegates."
          : item.type === "INTER_SECMUN"
          ? "Flagship inter-institution MUN with curated committees."
          : item.type === "WORKSHOP"
          ? "Skill-building sessions on research, diplomacy, and debate."
          : "SECMUN's official press and media vertical.",
      src:
        item.type === "INTRA_SECMUN"
          ? "/images/intra.jpg"
          : item.type === "INTER_SECMUN"
          ? "/images/inter.jpg"
          : item.type === "WORKSHOP"
          ? "/images/workshop.jpg"
          : "/images/edblazon.jpg",
    }
    return { ...base, event: item.event }
  })

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <Header />
      {loading ? (
        <p className="mt-6 text-center text-sm text-slate-500">
          Loading opportunities…
        </p>
      ) : (
        <ExpandableCards cards={cards} />
      )}
    </section>
  )
}

function Header() {
  return (
    <div className="mb-8 text-center">
      <p className="text-xl font-bold uppercase tracking-[0.2em] text-blue-600">
        Participation
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
        Choose how you participate in SECMUN
      </h2>
      <p className="mt-2 text-sm text-slate-600 sm:text-base">
        Explore active conferences, workshops, and media roles curated by the
        Secretariat.
      </p>
    </div>
  )
}

function ExpandableCards({ cards }: { cards: CardData[] }) {
  const [active, setActive] = useState<CardData | boolean | null>(null)
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false)
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [active])

  useOutsideClick(ref, () => setActive(null))

  return (
    <>
      {/* Backdrop for expanded card */}
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 h-full w-full bg-black/20"
          />
        )}
      </AnimatePresence>

      {/* Expanded card */}
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 z-[100] grid place-items-center px-4">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: { duration: 0.05 },
              }}
              className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-white lg:hidden"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="flex h-full w-full max-w-[520px] flex-col overflow-hidden bg-white md:h-fit md:max-h-[90%] sm:rounded-3xl"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={400}
                  height={240}
                  src={active.src}
                  alt={active.title}
                  className="h-64 w-full object-cover object-top sm:rounded-t-3xl"
                />
              </motion.div>

              <div>
                <div className="flex items-start justify-between p-4">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="text-base font-medium text-slate-900"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-sm text-slate-600"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  {active.event && active.event.status === "REG_OPEN" ? (
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Link
                        href={`/register?eventType=${encodeURIComponent(
                          active.event.type,
                        )}&eventId=${encodeURIComponent(active.event.id)}`}
                        className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm"
                      >
                        Register now
                      </Link>
                    </motion.div>
                  ) : null}
                </div>
                <div className="relative px-4 pt-3 pb-6">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-40 flex-col items-start gap-3 overflow-auto text-xs text-slate-600 [mask:linear-gradient(to_bottom,white,white,transparent)] md:h-fit"
                  >
                    {active.event ? (
                      <>
                        <p>
                          <strong>Status:</strong>{" "}
                          {active.event.status === "REG_OPEN"
                            ? "Registrations open"
                            : "Registrations closed"}
                        </p>
                        {active.event.registrationDeadline && (
                          <p>
                            <strong>Deadline:</strong>{" "}
                            {new Date(
                              active.event.registrationDeadline,
                            ).toLocaleDateString()}
                          </p>
                        )}
                        <p>
                          You&apos;ll be redirected to the official SECMUN
                          registration interface where you can submit your
                          details and preferences.
                        </p>
                      </>
                    ) : (
                      <p>
                        The Secretariat will publish participation details for
                        this track soon. Follow @secmun2024 on Instagram for
                        announcements.
                      </p>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* Cards grid */}
      <ul className="mx-auto grid w-full max-w-5xl grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const isActiveEvent =
            card.event && card.event.status === "REG_OPEN"

          const cardContent = (
            <motion.div
              layoutId={`card-${card.title}-${id}`}
              key={card.title}
              onClick={() => setActive(card)}
              className="flex cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-3 transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-md"
            >
              <div className="flex w-full flex-col gap-3">
                <motion.div layoutId={`image-${card.title}-${id}`}>
                  <img
                    width={200}
                    height={120}
                    src={card.src}
                    alt={card.title}
                    className="h-40 w-full rounded-xl object-cover object-top"
                  />
                </motion.div>
                <div className="flex flex-col items-center text-center md:items-start md:text-left">
                  <motion.h3
                    layoutId={`title-${card.title}-${id}`}
                    className="text-sm font-semibold text-slate-900"
                  >
                    {card.title}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${card.description}-${id}`}
                    className="text-xs text-slate-600"
                  >
                    {card.description}
                  </motion.p>
                  {isActiveEvent && (
                    <span className="mt-2 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-blue-700">
                      Active now
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )

          return (
            <li key={card.title}>
              {isActiveEvent ? (
                <BackgroundGradient
                  animate
                  containerClassName="rounded-3xl"
                  className="rounded-2xl
                    bg-[radial-gradient(circle_at_0_0,#dbeafe,transparent_55%),radial-gradient(circle_at_100%_0,#1d4ed8,transparent_55%),radial-gradient(circle_at_0_100%,#60a5fa,transparent_55%),radial-gradient(circle_at_100%_100%,#ffffff,transparent_55%)]"
                >
                  {cardContent}
                </BackgroundGradient>
              ) : (
                cardContent
              )}
            </li>
          )
        })}
      </ul>
    </>
  )
}

const CloseIcon = () => (
  <motion.svg
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{
      opacity: 0,
      transition: { duration: 0.05 },
    }}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-black"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </motion.svg>
)
