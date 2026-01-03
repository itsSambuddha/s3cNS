// app/admin/page.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  ShieldCheck,
  UserCog,
  UserMinus2,
  ArrowRight,
  ArrowUpDown,
  Building2,
  Newspaper,
  Plus,
  CalendarDays,
  ReceiptIndianRupee,
  KeyRound,
  ShieldAlert,
  Database,
  MailWarning,
  HardDrive,
} from "lucide-react"

type SecretariatSummary = {
  total: number
  active: number
  byRole: Record<string, number>
  byOffice: Record<string, number>
}

type GazetteSummary = {
  issues: number
}

type SystemHealth = {
  dbOk: boolean
  dbMessage?: string
  emailOk: boolean
  emailMessage?: string
  storageOk: boolean
  storageUsedMb?: number
}

type AdminSummary = {
  secretariat: SecretariatSummary
  gazette: GazetteSummary
  system: SystemHealth
}

const DEFAULT_SUMMARY: AdminSummary = {
  secretariat: {
    total: 0,
    active: 0,
    byRole: {},
    byOffice: {},
  },
  gazette: {
    issues: 0,
  },
  system: {
    dbOk: true,
    dbMessage: "OK",
    emailOk: true,
    emailMessage: "OK",
    storageOk: true,
    storageUsedMb: 0,
  },
}

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<AdminSummary>(DEFAULT_SUMMARY)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/admin/summary", {
          credentials: "include",
        })
        if (!res.ok) {
          console.error("Failed to load admin summary", res.status)
          setSummary(DEFAULT_SUMMARY)
          return
        }
        const data = await res.json()
        setSummary({
          secretariat: data.secretariat ?? DEFAULT_SUMMARY.secretariat,
          gazette: data.gazette ?? DEFAULT_SUMMARY.gazette,
          system: data.system ?? DEFAULT_SUMMARY.system,
        })
      } catch (e) {
        console.error("Admin summary error", e)
        setSummary(DEFAULT_SUMMARY)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const currentYear = new Date().getFullYear()
  const { secretariat, gazette, system } = summary

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 px-5 py-6 text-slate-50 shadow-sm sm:px-7">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -left-10 top-[-20%] h-40 w-40 rounded-full bg-sky-500/30 blur-3xl" />
          <div className="absolute bottom-0 right-[-5%] h-48 w-48 rounded-full bg-emerald-400/25 blur-3xl" />
        </div>

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/15 px-3 py-1 text-[11px] font-medium text-sky-100">
              <ShieldCheck className="h-3 w-3" />
              <span>SECMUN admin console · {currentYear}</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Administration & control center
            </h1>
            <p className="max-w-xl text-xs text-slate-200/80 sm:text-sm">
              Manage Secretariat structure, Gazette issues, events, finance
              shortcuts, access control, and system health in one unified view.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
            <Badge
              variant="outline"
              className="border-sky-300/70 bg-sky-500/10 text-[10px] text-sky-50"
            >
              Active secretariat: {secretariat.active}/{secretariat.total}
            </Badge>
            <Badge
              variant="outline"
              className="border-indigo-300/70 bg-indigo-500/10 text-[10px] text-indigo-50"
            >
              Gazette issues: {gazette.issues}
            </Badge>
          </div>
        </div>
      </section>

      {/* 1. Secretariat management */}
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
        <Card className="border-slate-200/70 bg-white/90 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-sky-600" />
              <div>
                <h2 className="text-sm font-semibold">
                  Secretariat management
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Promote, reassign, deactivate, and configure permissions for
                  Secretariat members.
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="border-sky-200 bg-sky-50/80 text-[10px] font-medium text-sky-700"
            >
              People
            </Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Roles & offices */}
            <AdminLinkCard
              icon={UserCog}
              title="Roles & offices"
              description="Change secretariat roles, move members between offices, and enforce structure."
              href="/admin/secretariat/members"
              primary
            />
            {/* Senior secretariat */}
            {/* <AdminLinkCard
              icon={ShieldCheck}
              title="Senior Secretariat"
              description="Set President, Secretary General, and Director General for the current cycle."
              href="/admin/secretariat/senior"
            /> */}
            {/* Permissions */}
            <AdminLinkCard
              icon={KeyRound}
              title="Permissions & capabilities"
              description="Toggle admin flags such as finance or events management for each member."
              href="/admin/settings/permissions"
            />
            {/* Deactivate / delete */}
            <AdminLinkCard
              icon={UserMinus2}
              title="Deactivate or delete members"
              description="Safely deactivate former secretariat members or remove test accounts."
              href="/admin/secretariat/members?view=inactive"
              danger
            />
          </div>
        </Card>

        {/* Secretariat composition + audit preview */}
        <div className="space-y-4">
          {/* Composition summary */}
          <Card className="border-slate-200/70 bg-slate-50/90 p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-700" />
                <h3 className="text-sm font-semibold">
                  Secretariat composition
                </h3>
              </div>
              <Badge variant="outline" className="text-[10px]">
                Overview
              </Badge>
            </div>
            <div className="grid gap-2 text-[11px] text-slate-600 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  By role
                </p>
                {Object.keys(secretariat.byRole).length === 0 && (
                  <p className="text-[11px] text-slate-500">
                    No secretariat roles recorded yet.
                  </p>
                )}
                {Object.entries(secretariat.byRole).map(([role, count]) => (
                  <div
                    key={role}
                    className="flex items-center justify-between rounded-md bg-white/80 px-2 py-1"
                  >
                    <span>{role.replace(/_/g, " ")}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  By office
                </p>
                {Object.keys(secretariat.byOffice).length === 0 && (
                  <p className="text-[11px] text-slate-500">
                    No offices assigned yet.
                  </p>
                )}
                {Object.entries(secretariat.byOffice).map(
                  ([office, count]) => (
                    <div
                      key={office}
                      className="flex items-center justify-between rounded-md bg-white/80 px-2 py-1"
                    >
                      <span>
                        {office === "UNASSIGNED"
                          ? "Unassigned"
                          : office.replace(/_/g, " ")}
                      </span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </Card>

          {/* Audit log placeholder */}
          <Card className="border-slate-200/70 bg-white/95 p-4 shadow-sm">
            <div className="mb-1 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-slate-700" />
                <h3 className="text-sm font-semibold">
                  Secretariat change history
                </h3>
              </div>
              <Badge variant="outline" className="text-[10px]">
                Coming soon
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              This panel will show an audit log of role changes, office
              reassignments, deactivations, and permission edits once logging is
              enabled.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 h-6 rounded-full text-[11px]"
              asChild
            >
              <Link href="/admin/audit/secretariat">
                View full audit log
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </Card>
        </div>
      </section>

      {/* 2. Gazette & events/finance shortcuts */}
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
        {/* Gazette */}
        <Card className="border-slate-200/70 bg-white/90 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-indigo-600" />
              <div>
                <h2 className="text-sm font-semibold">Gazette & issues</h2>
                <p className="text-[11px] text-muted-foreground">
                  Upload new issues, and maintain volume/issue metadata for the
                  Gazette.
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="border-indigo-200 bg-indigo-50/80 text-[10px] font-medium text-indigo-700"
            >
              Publications
            </Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <AdminLinkCard
              icon={Plus}
              title="Upload new issue"
              description="Upload a Gazette PDF and set its volume, issue number, and theme."
              href="/admin/gazette/new"
              primary
            />
<AdminLinkCard
  icon={Newspaper}
  title="Manage issues"
  description="Edit titles, themes, read time, and visibility of existing issues."
  href="/admin/gazette/manage"
/>

          </div>
        </Card>

        {/* Events & Finance shortcuts */}
        <Card className="border-slate-200/70 bg-white/90 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-emerald-600" />
              <div>
                <h2 className="text-sm font-semibold">Events & finance</h2>
                <p className="text-[11px] text-muted-foreground">
                  Jump into Delegations Affairs and Finance modules from a
                  single place.
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="border-emerald-200 bg-emerald-50/80 text-[10px] font-medium text-emerald-700"
            >
              Redirects
            </Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <AdminLinkCard
              icon={CalendarDays}
              title="Manage events (DA)"
              description="Open Delegations Affairs to create or edit events, committees, and sessions."
              href="/da"
              primary
            />
            <AdminLinkCard
              icon={ReceiptIndianRupee}
              title="Budgets & reimbursements"
              description="Open Finance to view event budgets and process reimbursements."
              href="/finance"
            />
          </div>
        </Card>
      </section>

      {/* 3. Access control & system health */}
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
        {/* Access control */}
        {/* <Card className="border-slate-200/70 bg-white/90 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-slate-800" />
              <div>
                <h2 className="text-sm font-semibold">Access control</h2>
                <p className="text-[11px] text-muted-foreground">
                  Configure who can see and change what across the admin
                  console.
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px]">
              Roles & permissions
            </Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <AdminLinkCard
              icon={Users}
              title="Admin & module access"
              description="Assign who can access Secretariat, Gazette, Events, and Finance modules."
              href="/admin/settings/permissions"
              primary
            />
            <AdminLinkCard
              icon={ShieldAlert}
              title="Security & audit"
              description="Review permission changes and important security‑related events."
              href="/admin/audit/security"
            />
          </div>
        </Card> */}

        {/* System health */}
        <Card className="border-slate-200/70 bg-slate-50/90 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-slate-800" />
              <div>
                <h2 className="text-sm font-semibold">System health</h2>
                <p className="text-[11px] text-muted-foreground">
                  Status of core infrastructure used by this platform.
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px]">
              Live status
            </Badge>
          </div>

          <div className="grid gap-2 text-[11px] text-slate-700 sm:grid-cols-3">
            <HealthItem
              icon={Database}
              label="Database"
              ok={system.dbOk}
              message={system.dbMessage ?? "OK"}
            />
            <HealthItem
              icon={MailWarning}
              label="Email / SMTP"
              ok={system.emailOk}
              message={system.emailMessage ?? "OK"}
            />
            {/* <HealthItem
              icon={HardDrive}
              label="Storage"
              ok={system.storageOk}
              message={
                typeof system.storageUsedMb === "number"
                  ? `${system.storageUsedMb.toFixed(1)} MB used`
                  : "OK"
              }
            /> */}
          </div>
        </Card>
      </section>
    </div>
  )
}

/* ===== Subcomponents ===== */

type AdminLinkCardProps = {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  href: string
  primary?: boolean
  danger?: boolean
}

function AdminLinkCard({
  icon: Icon,
  title,
  description,
  href,
  primary,
  danger,
}: AdminLinkCardProps) {
  return (
    <Link href={href} className="block">
      <motion.div
        className={`group h-full rounded-xl border p-3 text-xs shadow-sm transition-colors ${
          danger
            ? "border-rose-200/80 bg-rose-50/80 hover:border-rose-300 hover:bg-rose-50"
            : primary
            ? "border-slate-200/80 bg-slate-50/80 hover:border-slate-300 hover:bg-white"
            : "border-slate-200/70 bg-slate-50/60 hover:border-slate-300 hover:bg-white"
        }`}
        whileHover={{ y: -2, scale: 1.01 }}
      >
        <div className="mb-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/80 shadow-sm">
              <Icon className="h-3.5 w-3.5 text-slate-800" />
            </div>
            <p className="text-[13px] font-semibold text-slate-900">
              {title}
            </p>
          </div>
          <ArrowRight className="h-3 w-3 text-slate-400 transition-transform group-hover:translate-x-0.5" />
        </div>
        <p className="text-[11px] text-slate-600">{description}</p>
      </motion.div>
    </Link>
  )
}

type HealthItemProps = {
  icon: React.ComponentType<{ className?: string }>
  label: string
  ok: boolean
  message: string
}

function HealthItem({ icon: Icon, label, ok, message }: HealthItemProps) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-white/80 px-2 py-2">
      <div
        className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
          ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
        }`}
      >
        <Icon className="h-3 w-3" />
      </div>
      <div>
        <p className="text-[11px] font-medium text-slate-900">{label}</p>
        <p className="text-[10px] text-slate-600">{message}</p>
      </div>
    </div>
  )
}
