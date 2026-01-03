"use client"

import { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "motion/react"
import {
  Search,
  UserCircle2,
  Users,
  GraduationCap,
  Filter,
  Mail,
  Phone,
} from "lucide-react"

type Member = {
  _id: string
  displayName: string
  email: string
  phone?: string
  secretariatRole: string
  office: string | null
  academicDepartment?: string
  year?: string
}

function roleLabel(role: string) {
  switch (role) {
    case "PRESIDENT":
      return "President"
    case "SECRETARY_GENERAL":
      return "Secretary General"
    case "DIRECTOR_GENERAL":
      return "Director General"
    case "TEACHER":
      return "Teacher"
    case "USG":
      return "Under Secretary‑General"
    default:
      return role.replace(/_/g, " ")
  }
}

export default function SecretariatDirectoryPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (q) params.set("q", q)
        if (roleFilter && roleFilter !== "all") params.set("role", roleFilter)

        const res = await fetch(
          `/api/secretariat/members?${params.toString()}`,
          {
            credentials: "include",
          },
        )

        if (!res.ok) {
          const errorText = await res.text()
          console.error("Secretariat members error:", res.status, errorText)
          if (!cancelled) setMembers([])
          return
        }

        const data = await res.json()

        if (!cancelled) {
          setMembers(
            (data.members || []).map((m: any): Member => ({
              _id: m._id,
              displayName: m.displayName || m.email,
              email: m.email,
              phone: m.phone,
              secretariatRole: m.secretariatRole,
              office: m.office ?? null,
              academicDepartment: m.academicDepartment,
              year: m.year,
            })),
          )
        }
      } catch (e) {
        console.error("Failed to fetch members:", e)
        if (!cancelled) setMembers([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [q, roleFilter])

  const leadership = useMemo(
    () =>
      members.filter((m) =>
        ["PRESIDENT", "SECRETARY_GENERAL", "DIRECTOR_GENERAL"].includes(
          m.secretariatRole,
        ),
      ),
    [members],
  )

  const teachers = useMemo(
    () => members.filter((m) => m.secretariatRole === "TEACHER"),
    [members],
  )

  const usgsByOffice = useMemo(() => {
    const result: Record<string, Member[]> = {}
    members
      .filter((m) => m.secretariatRole === "USG")
      .forEach((m) => {
        const key = m.office || "UNASSIGNED"
        if (!result[key]) result[key] = []
        result[key].push(m)
      })
    return result
  }, [members])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border bg-gradient-to-br from-slate-50 to-slate-100/80 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] font-medium text-sky-700">
            <Users className="h-3 w-3" />
            <span>Secretariat directory</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            People behind SECMUN
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Browse the Secretariat by role, office, and department. Designed as
            a quick reference when you need to contact the right person.
          </p>
        </div>

        {/* Search + filters */}
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-60">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              className="w-full pl-8 text-xs"
              placeholder="Search by name or email"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-36 text-xs">
                <Filter className="mr-1 h-3 w-3 text-muted-foreground" />
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="PRESIDENT">President</SelectItem>
                <SelectItem value="SECRETARY_GENERAL">Sec‑Gen</SelectItem>
                <SelectItem value="DIRECTOR_GENERAL">Dir‑Gen</SelectItem>
                <SelectItem value="TEACHER">Teacher</SelectItem>
                <SelectItem value="USG">USG</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading directory…</p>
      )}

      {!loading && (
        <div className="space-y-7">
          {/* Leadership */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <UserCircle2 className="h-4 w-4 text-sky-600" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-700">
                  Leadership
                </h2>
              </div>
              <p className="text-[11px] text-muted-foreground">
                President, Secretary General, and Director General.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {leadership.map((m, index) => (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.04, type: "spring", stiffness: 260, damping: 20 }}
                  whileHover={{ y: -3, scale: 1.01 }}
                >
                  <Card className="group relative overflow-hidden border-slate-200/80 bg-white/90 p-4 shadow-sm transition-colors hover:border-sky-200">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500/70 via-sky-400/60 to-sky-500/70 opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{m.displayName}</p>
                      <Badge
                        variant="outline"
                        className="border-sky-200 bg-sky-50/80 text-[10px] font-medium text-sky-700"
                      >
                        {roleLabel(m.secretariatRole)}
                      </Badge>
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <GraduationCap className="h-3 w-3" />
                      <span>{m.academicDepartment || "Department"}</span>
                      <span>·</span>
                      <span>{m.year || "--"}</span>
                    </p>
                    <div className="mt-2 space-y-1 text-[11px] text-muted-foreground">
                      <p className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{m.email}</span>
                      </p>
                      {m.phone && (
                        <p className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{m.phone}</span>
                        </p>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
              {leadership.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No leadership members defined yet.
                </p>
              )}
            </div>
          </section>

          {/* Teachers */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-emerald-600" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-700">
                  Teachers in‑charge
                </h2>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Faculty members advising SECMUN.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {teachers.map((m, index) => (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.04, type: "spring", stiffness: 260, damping: 20 }}
                  whileHover={{ y: -3, scale: 1.01 }}
                >
                  <Card className="relative overflow-hidden border-slate-200/80 bg-white/90 p-4 shadow-sm transition-colors hover:border-emerald-200">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500/70 via-emerald-400/60 to-emerald-500/70 opacity-0 transition-opacity hover:opacity-100" />
                    <p className="text-sm font-semibold">{m.displayName}</p>
                    <p className="mt-0.5 text-[11px] font-medium text-emerald-700">
                      Teacher In‑Charge
                    </p>
                    <div className="mt-2 space-y-1 text-[11px] text-muted-foreground">
                      <p className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{m.email}</span>
                      </p>
                      {m.phone && (
                        <p className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{m.phone}</span>
                        </p>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
              {teachers.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No teachers added yet.
                </p>
              )}
            </div>
          </section>

          {/* USGs by office */}
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-600" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-700">
                  Under Secretaries‑General
                </h2>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Organised by office for quick routing.
              </p>
            </div>

            {Object.keys(usgsByOffice).length === 0 && (
              <p className="text-xs text-muted-foreground">
                No USGs added yet.
              </p>
            )}

            {Object.entries(usgsByOffice).map(([office, list]) => (
              <div
                key={office}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-indigo-200 bg-indigo-50/80 text-[11px] font-medium text-indigo-700"
                    >
                      {office === "UNASSIGNED"
                        ? "Unassigned office"
                        : office.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {list.length} USG
                    {list.length === 1 ? "" : "s"}
                  </Badge>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {list.map((m, index) => (
                    <motion.div
                      key={m._id}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ delay: index * 0.03, type: "spring", stiffness: 260, damping: 20 }}
                      whileHover={{ y: -2, scale: 1.005 }}
                    >
                      <Card className="border-slate-200/80 bg-white/95 p-4 text-xs shadow-sm">
                        <p className="text-sm font-semibold">{m.displayName}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {roleLabel(m.secretariatRole)}
                        </p>
                        <p className="mt-2 text-[11px] text-muted-foreground">
                          {m.academicDepartment || "Department"} ·{" "}
                          {m.year || "--"}
                        </p>
                        <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{m.email}</span>
                        </p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>
      )}
    </div>
  )
}
