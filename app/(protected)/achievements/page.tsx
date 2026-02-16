'use client'

import { motion } from "framer-motion"
import { Trophy, Award, Star, Medal, Target, Zap } from "lucide-react"

const achievements = [
  {
    title: "Best Delegation",
    event: "SECMUN 2025",
    date: "March 2025",
    category: "Club Award",
    icon: <Trophy className="w-6 h-6 text-amber-500" />,
    description: "Awarded for exceptional performance and diplomatic excellence across all committees.",
    color: "from-amber-500/10 to-orange-500/10"
  },
  {
    title: "Outstanding Diplomacy",
    event: "St. Xavier's MUN",
    date: "December 2024",
    category: "Individual",
    icon: <Award className="w-6 h-6 text-blue-500" />,
    description: "Recognized for superior negotiation skills and mastery over international law.",
    color: "from-blue-500/10 to-indigo-500/10"
  },
  {
    title: "Best Journalist",
    event: "EdBlazon Times",
    date: "October 2024",
    category: "Media",
    icon: <Zap className="w-6 h-6 text-purple-500" />,
    description: "Awarded for investigative reporting and editorial precision during the conference.",
    color: "from-purple-500/10 to-fuchsia-500/10"
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

export default function AchievementsPage() {
  return (
    <main className="relative min-h-screen bg-background px-4 py-8 overflow-hidden">
      {/* Atmosphere Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute right-[-10%] top-[35%] h-[600px] w-[600px] rounded-full bg-amber-100/40 blur-[140px]" />
        {/* Grainy Texture */}
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
            <div className="absolute top-0 right-0 w-[40%] h-full bg-amber-400/5 blur-[80px] pointer-events-none transition-colors group-hover:bg-amber-400/10" />

            <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/60 bg-amber-50/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">
                  Wall of Honor
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Institutional Achievements
                  </h1>
                  <p className="max-w-xl text-sm font-medium text-slate-500 dark:text-zinc-400">
                    Celebrating the excellence, diplomacy, and dedication of the SECMUN community.
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
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {achievements.map((achievement, idx) => (
            <motion.div
              key={idx}
              variants={item}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative overflow-hidden rounded-[2.5rem] border border-blue-200/60 bg-white p-8 shadow-xl shadow-blue-500/5 dark:border-white/5 dark:bg-zinc-900/40"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 blur-[40px] pointer-events-none opacity-20 bg-gradient-to-br ${achievement.color}`} />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 shadow-sm group-hover:scale-110 transition-transform duration-500">
                    {achievement.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {achievement.date}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50/50 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-500 dark:bg-white/5 dark:border-white/5">
                    {achievement.category}
                  </div>
                  <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                    {achievement.title}
                  </h3>
                  <p className="text-[11px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                    {achievement.event}
                  </p>
                </div>

                <p className="text-sm font-medium text-slate-500 leading-relaxed dark:text-zinc-400">
                  {achievement.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  )
}
