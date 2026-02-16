'use client'

import { motion } from "framer-motion"
import { Search, User, Mail, Phone, MapPin, Shield, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"

const members = [
  {
    name: "Sambuddha Nath",
    role: "Secretary General",
    department: "Executive",
    email: "sg@secmun.in",
    image: "https://avatars.githubusercontent.com/u/9919?v=4",
    status: "Active"
  },
  {
    name: "Shwet Veer Vrish",
    role: "Director General",
    department: "Executive",
    email: "dg@secmun.in",
    image: "https://avatars.githubusercontent.com/u/9919?v=4",
    status: "Active"
  },
  {
    name: "Jane Doe",
    role: "USG DA",
    department: "Delegate Affairs",
    email: "da@secmun.in",
    image: "https://avatars.githubusercontent.com/u/9919?v=4",
    status: "On-site"
  }
]

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

export default function DirectoryPage() {
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
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by name, role, or department..."
                  className="pl-10 rounded-full h-12 border-slate-200 bg-slate-50/50 backdrop-blur-sm focus:ring-blue-500/20"
                />
              </div>
            </div>
          </motion.div>
        </header>

        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> SECURE ACCESS ONLY</span>
            <span>·</span>
            <span>{members.length} Members Indexed</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">
            <Filter className="w-3.5 h-3.5" /> Filter Results
          </button>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {members.map((member, idx) => (
            <motion.div
              key={idx}
              variants={item}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-[2.5rem] border border-blue-200/60 bg-white p-8 shadow-xl shadow-blue-500/5 dark:border-white/5 dark:bg-zinc-900/40"
            >
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-slate-900 dark:text-white leading-tight">{member.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">{member.role}</p>
                    <span className="inline-block px-1.5 py-0.5 rounded-full bg-emerald-50 text-[8px] font-black uppercase tracking-widest text-emerald-700 border border-emerald-100">
                      {member.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-white/5 text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{member.department}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{member.email}</span>
                  </div>
                </div>

                <button className="w-full py-2 rounded-xl bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-slate-900">
                  View Full Profile
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  )
}
