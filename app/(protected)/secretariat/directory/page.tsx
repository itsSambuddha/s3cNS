"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search, User, Mail, MapPin, Shield, Filter, GraduationCap } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Member = {
  _id: string
  displayName: string
  email: string
  phone?: string
  secretariatRole: string
  office: string | null
  academicDepartment?: string
  year?: string
  photoURL?: string
  memberStatus: string
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
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
          }
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
              photoURL: m.photoURL,
              memberStatus: m.memberStatus,
            }))
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

  return (
    <main className="relative min-h-screen bg-background px-4 py-8 overflow-hidden">
      {/* Atmosphere Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute right-[-10%] top-[35%] h-[600px] w-[600px] rounded-full bg-slate-100/40 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3EaseFilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/baseFilter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      <div className="mx-auto max-w-7xl space-y-12">
        <header>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative overflow-hidden rounded-[2rem] border border-blue-200/60 bg-white p-8 shadow-xl shadow-blue-500/5 dark:border-white/5 dark:bg-[#030712]/80"
          >
            <div className="absolute top-0 right-0 w-[40%] h-full bg-blue-400/5 blur-[80px] pointer-events-none transition-colors group-hover:bg-blue-400/10" />

            <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
                    Operational Directory
                  </div>
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Institutional Census
                  </h1>
                  <p className="max-w-xl text-sm font-medium text-slate-500 dark:text-zinc-400">
                    Search and connect with the secretariat, staff, and leadership of SECMUN.
                  </p>
                </div>
              </div>
              <div className="relative w-full max-w-sm flex flex-col gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search by name, role, or department..."
                    className="pl-10 rounded-full h-12 border-slate-200 bg-slate-50/50 backdrop-blur-sm focus:ring-blue-500/20"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </header>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> SECURE ACCESS ONLY</span>
            <span>·</span>
            <span>{members.length} Members Indexed</span>
          </div>

          <div className="flex items-center gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="h-9 w-[180px] rounded-full border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">
                <Filter className="mr-2 w-3.5 h-3.5" />
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="PRESIDENT">President</SelectItem>
                <SelectItem value="SECRETARY_GENERAL">Sec‑Gen</SelectItem>
                <SelectItem value="DIRECTOR_GENERAL">Dir‑Gen</SelectItem>
                <SelectItem value="TEACHER">Teacher</SelectItem>
                <SelectItem value="USG">USG</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100" />
              <div className="h-4 w-32 rounded bg-slate-100" />
            </div>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p>No members found matching your criteria.</p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {members.map((member) => (
              <motion.div
                key={member._id}
                variants={item}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-[2.5rem] border border-blue-200/60 bg-white p-8 shadow-xl shadow-blue-500/5 dark:border-white/5 dark:bg-zinc-900/40"
              >
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm bg-slate-50">
                      <img
                        src={member.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.displayName)}&background=random`}
                        alt={member.displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-black text-slate-900 dark:text-white leading-tight line-clamp-1" title={member.displayName}>
                        {member.displayName}
                      </h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                        {roleLabel(member.secretariatRole)}
                      </p>
                      <span className="inline-block px-1.5 py-0.5 rounded-full bg-emerald-50 text-[8px] font-black uppercase tracking-widest text-emerald-700 border border-emerald-100">
                        {member.memberStatus}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-white/5 text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {member.academicDepartment || "Department"} · {member.year || "--"}
                      </span>
                    </div>
                    {member.office && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">{member.office.replace(/_/g, " ")}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate" title={member.email}>{member.email}</span>
                    </div>
                  </div>

                  {/* <button className="w-full py-2 rounded-xl bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-slate-900">
                    View Full Profile
                  </button> */}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  )
}
