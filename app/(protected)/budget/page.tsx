'use client'

import { motion } from "framer-motion"
import { LayoutGrid, PieChart, TrendingUp, ShieldCheck, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const planningAreas = [
  {
    title: "Hospitality & Venue",
    allocation: "₹ 45,000",
    status: "Planning",
    icon: <LayoutGrid className="w-5 h-5 text-blue-500" />,
    utilization: 0,
    color: "from-blue-500/10 to-indigo-500/10"
  },
  {
    title: "Marketing & PR",
    allocation: "₹ 12,000",
    status: "Active",
    icon: <Zap className="w-5 h-5 text-purple-500" />,
    utilization: 45,
    color: "from-purple-500/10 to-fuchsia-500/10"
  },
  {
    title: "Research & Materials",
    allocation: "₹ 8,000",
    status: "Draft",
    icon: <PieChart className="w-5 h-5 text-emerald-500" />,
    utilization: 0,
    color: "from-emerald-500/10 to-teal-500/10"
  }
]

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

export default function BudgetPage() {
  return (
    <main className="relative min-h-screen bg-background px-4 py-8 overflow-hidden">
      {/* Atmosphere Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute right-[-10%] top-[35%] h-[600px] w-[600px] rounded-full bg-indigo-100/40 blur-[140px]" />
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
                    Strategic Allocation
                  </div>
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Budget Planning Control
                  </h1>
                  <p className="max-w-xl text-sm font-medium text-slate-500 dark:text-zinc-400">
                    Map out expenditures, event allocations, and resource distribution for the upcoming SECMUN cycle.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </header>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 lg:grid-cols-3"
        >
          {/* Summary Card */}
          <motion.div
            variants={item}
            className="lg:col-span-2 relative overflow-hidden rounded-[2.5rem] border border-blue-200/60 bg-white p-8 shadow-xl shadow-blue-500/5 dark:border-white/5 dark:bg-zinc-900/40"
          >
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Planning Overview</h3>
                <TrendingUp className="w-6 h-6 text-slate-400" />
              </div>

              <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Projected Total</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white">₹ 85,000</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Allocated</p>
                  <p className="text-3xl font-black text-blue-600 dark:text-blue-400">₹ 65,000</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Unassigned</p>
                  <p className="text-3xl font-black text-slate-400">₹ 20,000</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                  <span className="text-slate-500">Resource Saturation</span>
                  <span className="text-slate-900 dark:text-white">76%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "76%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar CTA Card */}
          <motion.div
            variants={item}
            className="relative overflow-hidden rounded-[2.5rem] border border-slate-900 bg-[#030712] p-8 text-white shadow-2xl"
          >
            <div className="space-y-6">
              <ShieldCheck className="w-10 h-10 text-blue-400" />
              <div className="space-y-2">
                <h3 className="text-xl font-black tracking-tight">Institutional Shield</h3>
                <p className="text-sm font-medium text-zinc-400 leading-relaxed">
                  All budget proposals must be ratified by the President and Secretary General before execution.
                </p>
              </div>
              <button className="w-full rounded-2xl bg-white py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-900 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                Propose New Budget
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Areas Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {planningAreas.map((area, idx) => (
            <motion.div
              key={idx}
              variants={item}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-[2.5rem] border border-blue-200/60 bg-white p-8 shadow-xl shadow-blue-500/5 dark:border-white/5 dark:bg-zinc-900/40"
            >
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5">
                    {area.icon}
                  </div>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                    area.status === 'Active' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                      area.status === 'Planning' ? "bg-blue-50 text-blue-700 border-blue-100" :
                        "bg-slate-50 text-slate-500 border-slate-100"
                  )}>
                    {area.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-slate-900 dark:text-white">{area.title}</h4>
                  <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{area.allocation}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  )
}
