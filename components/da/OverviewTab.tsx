"use client"

import { ReactNode, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import clsx from "clsx"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip } from "@/components/ui/tooltip-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Users,
  UserCheck,
  Mic2,
  Trash2,
  ExternalLink,
  Calendar,
  Clock,
  MoreHorizontal,
  RefreshCw,
  FileText,
  Mail,
  Download
} from "lucide-react"

type EventStatus = "REG_OPEN" | "REG_CLOSED"
type EventType = "INTRA_SECMUN" | "INTER_SECMUN" | "WORKSHOP" | "EDBLAZON_TIMES"

type EventSummary = {
  id: string
  name: string
  type: EventType
  status: EventStatus
  registrationDeadline: string | null
  delegateFormLink: string | null
  ambassadorFormLink: string | null
  journalistFormLink: string | null
  videoJournalistFormLink: string | null
  participantFormLink: string | null
  createdAt: string
  registrationCounts: {
    total: number
    delegates: number
    ambassadors: number
  }
}

type OverviewResponse = {
  totalRegistrations: number
  events: EventSummary[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export function OverviewTab() {
  const [events, setEvents] = useState<EventSummary[]>([])
  const [eventId, setEventId] = useState("")
  const [data, setData] = useState<OverviewResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const [delegateLink, setDelegateLink] = useState("")
  const [ambassadorLink, setAmbassadorLink] = useState("")
  const [journalistLink, setJournalistLink] = useState("")
  const [vjLink, setVjLink] = useState("")
  const [participantLink, setParticipantLink] = useState("")

  // Load overview once
  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const res = await fetch("/api/da/overview", { cache: "no-store" })
        if (!res.ok) {
          throw new Error(`Failed to load overview: ${res.status}`)
        }
        const json = (await res.json()) as OverviewResponse
        setData(json)
        setEvents(json.events)
      } catch (err) {
        console.error("Failed to load DA overview", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // When eventId changes, sync links from data
  useEffect(() => {
    if (!eventId || !data) return
    const ev = data.events.find((e) => e.id === eventId)
    if (!ev) return
    setDelegateLink(ev.delegateFormLink || "")
    setAmbassadorLink(ev.ambassadorFormLink || "")
    setJournalistLink(ev.journalistFormLink || "")
    setVjLink(ev.videoJournalistFormLink || "")
    setParticipantLink(ev.participantFormLink || "")
  }, [eventId, data])

  async function patchEvent(payload: Partial<EventSummary>) {
    if (!eventId) return
    try {
      const res = await fetch(`/api/da/events/${eventId}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        throw new Error(`Failed to update: ${res.status}`)
      }
      const json = await res.json()
      const updated = json.event
      const updatedId = updated.id || updated._id

      setData((prev) =>
        prev
          ? {
            ...prev,
            events: prev.events.map((e) =>
              e.id === updatedId ? { ...e, ...updated } : e,
            ),
          }
          : prev,
      )
      setEvents((prev) =>
        prev.map((e) => (e.id === updatedId ? { ...e, ...updated } : e)),
      )
    } catch (error) {
      console.error("Error updating event:", error)
      alert("Failed to save changes. Please try again.")
    }
  }

  async function deleteEvent() {
    if (!eventId) return
    const selected = events.find((e) => e.id === eventId)
    if (!selected) return

    if (!confirm(`Delete event "${selected.name}"? This cannot be undone.`)) {
      return
    }

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        alert(j.error || "Failed to delete event")
        return
      }

      const remaining = events.filter((e) => e.id !== eventId)
      setEvents(remaining)
      setEventId("")
      setDelegateLink("")
      setAmbassadorLink("")
      setJournalistLink("")
      setVjLink("")
      setParticipantLink("")
      setData((prev) =>
        prev
          ? {
            ...prev,
            events: remaining,
          }
          : prev,
      )
    } catch (err) {
      console.error("Error deleting event:", err)
      alert("Error deleting event. Please try again.")
    }
  }

  if (!data || loading) {
    return (
      <div className="space-y-6 p-1">
        <div className="flex gap-4">
          <div className="h-32 w-full animate-pulse rounded-2xl bg-muted/50" />
          <div className="h-32 w-full animate-pulse rounded-2xl bg-muted/50" />
          <div className="h-32 w-full animate-pulse rounded-2xl bg-muted/50" />
        </div>
        <div className="h-96 w-full animate-pulse rounded-3xl bg-muted/30" />
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground glass rounded-3xl"
      >
        <Calendar className="w-12 h-12 mb-4 opacity-50" />
        <h3 className="text-lg font-heading font-medium">No events found</h3>
        <p className="text-sm">Create an event in the Events tab to see its overview.</p>
      </motion.div>
    )
  }

  const selected = events.find((e) => e.id === eventId) || null

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 print:p-8"
    >
      {/* Page header */}
      <motion.div variants={item} className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-border/40 pb-6">
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Delegate Affairs
          </h2>
          <p className="mt-2 text-base text-muted-foreground max-w-lg">
            Manage registrations, track metrics, and configure public forms for your events.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <div className="glass-input rounded-md px-1">
            <Select
              value={eventId}
              onValueChange={(v) => setEventId(v)}
            >
              <SelectTrigger className="w-full sm:w-64 border-0 bg-transparent focus:ring-0">
                <SelectValue placeholder="Select event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((e) => (
                  <SelectItem key={e.id} value={e.id} className="cursor-pointer">
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selected && (
            <Button
              variant="destructive"
              size="sm"
              onClick={deleteEvent}
              className="shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </motion.div>

      {/* Global stats */}
      <motion.div variants={item} className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Registrations"
          value={data.totalRegistrations}
          icon={<Users className="w-5 h-5 text-primary" />}
          gradient="from-blue-500/10 to-indigo-500/10"
        />
        <StatCard
          title="Active Events"
          value={events.filter((e) => e.status === "REG_OPEN").length}
          icon={<RefreshCw className="w-5 h-5 text-emerald-500" />}
          gradient="from-emerald-500/10 to-teal-500/10"
        />
        <StatCard
          title="Tracked Events"
          value={events.length}
          icon={<Calendar className="w-5 h-5 text-amber-500" />}
          gradient="from-amber-500/10 to-orange-500/10"
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border/50 rounded-3xl"
          >
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
              <MoreHorizontal className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-base text-muted-foreground">
              Select an event above to view detailed metrics and configuration.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Selected event header */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-heading font-bold">{selected.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-primary/10 text-primary">
                      {selected.type.replace("_", " ")}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Created {new Date(selected.createdAt).toLocaleDateString()}
                    </span>
                    {selected.registrationDeadline && (
                      <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                        <Calendar className="w-3.5 h-3.5" />
                        Deadline: {new Date(selected.registrationDeadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={clsx(
                    "flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-md transition-all",
                    selected.status === "REG_OPEN"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : "bg-slate-500/10 border-slate-500/20 text-slate-600 dark:text-slate-400"
                  )}>
                    <span className="relative flex h-2.5 w-2.5">
                      {selected.status === "REG_OPEN" && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      )}
                      <span className={clsx(
                        "relative inline-flex rounded-full h-2.5 w-2.5",
                        selected.status === "REG_OPEN" ? "bg-emerald-500" : "bg-slate-500"
                      )}></span>
                    </span>
                    <span className="text-sm font-medium">
                      {selected.status === "REG_OPEN" ? "Registrations Open" : "Registrations Closed"}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() =>
                      patchEvent({
                        status: selected.status === "REG_OPEN" ? "REG_CLOSED" : "REG_OPEN",
                      })
                    }
                    className="rounded-full shadow-sm"
                  >
                    {selected.status === "REG_OPEN" ? "Close" : "Open"}
                  </Button>
                </div>
              </div>

              {/* Stats row inside the card */}
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <MiniStat
                  label="Total Entries"
                  value={selected.registrationCounts.total}
                  subtext="All categories"
                />
                <MiniStat
                  label="Delegates"
                  value={selected.registrationCounts.delegates}
                  subtext="Confirmed delegates"
                  highlight
                />
                <MiniStat
                  label="Ambassadors"
                  value={selected.registrationCounts.ambassadors}
                  subtext="Campus reps"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[1.8fr,1.2fr]">
              {/* Form links */}
              <div className="glass rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg">public Links</h3>
                  </div>
                  <p className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                    Auto-saved
                  </p>
                </div>

                <div className="space-y-5">
                  {(selected.type === "INTRA_SECMUN" || selected.type === "INTER_SECMUN") && (
                    <>
                      <FormField
                        label="Delegate Registration"
                        tooltip="Public link for delegate registration"
                        value={delegateLink}
                        onChange={setDelegateLink}
                        onSave={() => patchEvent({ delegateFormLink: delegateLink })}
                        icon={<Users className="w-4 h-4" />}
                      />
                      <FormField
                        label="Ambassador Registration"
                        tooltip="Public link for campus ambassador registration"
                        value={ambassadorLink}
                        onChange={setAmbassadorLink}
                        onSave={() => patchEvent({ ambassadorFormLink: ambassadorLink })}
                        icon={<Mic2 className="w-4 h-4" />}
                      />
                    </>
                  )}

                  {selected.type === "EDBLAZON_TIMES" && (
                    <>
                      <FormField
                        label="Journalist Application"
                        tooltip="Public link for journalist application"
                        value={journalistLink}
                        onChange={setJournalistLink}
                        onSave={() => patchEvent({ journalistFormLink: journalistLink })}
                        icon={<FileText className="w-4 h-4" />}
                      />
                      <FormField
                        label="Video Journalist Application"
                        tooltip="Public link for VJ application"
                        value={vjLink}
                        onChange={setVjLink}
                        onSave={() => patchEvent({ videoJournalistFormLink: vjLink })}
                        icon={<FileText className="w-4 h-4" />}
                      />
                    </>
                  )}

                  {selected.type === "WORKSHOP" && (
                    <FormField
                      label="Participant Registration"
                      tooltip="Public link for workshop participants"
                      value={participantLink}
                      onChange={setParticipantLink}
                      onSave={() => patchEvent({ participantFormLink: participantLink })}
                      icon={<UserCheck className="w-4 h-4" />}
                    />
                  )}
                </div>
              </div>

              {/* Right Column: Previews & Actions */}
              <div className="flex flex-col gap-6">
                {/* Quick Actions */}
                <div className="glass rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Download className="w-4 h-4 text-blue-500" />
                    </div>
                    <h3 className="font-heading font-semibold">Reports</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Generate comprehensive PDF reports for this event's metrics and settings.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full justify-between group"
                    onClick={() => window.print()}
                  >
                    Download Summary
                    <Download className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </div>

                {/* Email Preview */}
                <div className="glass rounded-2xl p-6 space-y-4 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Mail className="w-4 h-4 text-purple-500" />
                    </div>
                    <h3 className="font-heading font-semibold">Communication</h3>
                  </div>

                  <div className="space-y-3">
                    <Preview title="Interest Confirmation">
                      <p>Thank you for showing interest in <span className="font-semibold text-primary">{selected.name}</span>.</p>
                    </Preview>
                    <Preview title="Next Steps">
                      <p>Please complete the registration form to proceed with <span className="font-semibold text-primary">{selected.name}</span>.</p>
                    </Preview>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* Subcomponents */

function StatCard({ title, value, icon, gradient }: { title: string; value: number; icon: ReactNode; gradient: string }) {
  return (
    <Card className={clsx("relative overflow-hidden border-border/40 bg-card/40 p-5 transition-all hover:-translate-y-1 hover:shadow-lg")}>
      <div className={clsx("absolute inset-0 bg-gradient-to-br opacity-50", gradient)} />
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-heading font-bold">{value}</p>
        </div>
        <div className="p-3 rounded-xl bg-background/50 backdrop-blur-sm shadow-sm ring-1 ring-black/5 dark:ring-white/10">
          {icon}
        </div>
      </div>
    </Card>
  )
}

function MiniStat({ label, value, subtext, highlight }: { label: string; value: number; subtext: string; highlight?: boolean }) {
  return (
    <div className={clsx(
      "p-4 rounded-xl border backdrop-blur-sm transition-colors",
      highlight ? "bg-primary/5 border-primary/20" : "bg-background/40 border-border/30"
    )}>
      <p className="text-2xl font-bold font-heading">{value}</p>
      <p className={clsx("font-medium text-sm", highlight ? "text-primary" : "text-foreground")}>{label}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{subtext}</p>
    </div>
  )
}

function FormField({
  label,
  tooltip,
  value,
  onChange,
  onSave,
  icon
}: {
  label: string
  tooltip: string
  value: string
  onChange: (v: string) => void
  onSave: () => Promise<void> | void
  icon: ReactNode
}) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="group">
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-muted-foreground/70">{icon}</span>}
        <Tooltip content={tooltip}>
          <label className="block cursor-help text-sm font-medium text-foreground/80 group-hover:text-primary transition-colors">
            {label}
          </label>
        </Tooltip>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1 glass-input rounded-md transition-all focus-within:ring-2 focus-within:ring-primary/20">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            className="border-0 bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/40"
          />
        </div>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={saving}
          className={clsx(
            "min-w-[80px] transition-all",
            saved ? "bg-emerald-500 hover:bg-emerald-600" : ""
          )}
        >
          {saving ? "Saving…" : saved ? "Saved" : "Save"}
        </Button>
      </div>
      {value && (
        <a href={value} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-center gap-1 text-xs text-blue-500 hover:underline opacity-80 hover:opacity-100">
          <ExternalLink className="w-3 h-3" />
          Test Link
        </a>
      )}
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
    <div className="rounded-xl border border-border/40 bg-background/40 p-4 text-sm backdrop-blur-sm">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
        {title}
      </p>
      <div className="text-foreground/90 leading-relaxed">
        {children}
      </div>
    </div>
  )
}
