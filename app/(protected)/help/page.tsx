'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import Image from 'next/image'
import {
  IconBrandGoogle,
  IconUserCircle,
  IconSchool,
  IconUserCheck,
  IconShieldCheck,
  IconArrowRight,
  IconCheck,
  IconArchive,
  IconEye,
  IconEyeOff,
  IconLock,
  IconCrown,
  IconUserBolt,
  IconUsers,
  IconBriefcase,
  IconFingerprint,
  IconActivity,
  IconLayersIntersect,
  IconCash,
  IconCalendarEvent,
  IconFileText,
  IconSettingsAutomation,
  IconSparkles,
  IconChevronRight,
  IconX,
  IconRefresh,
  IconTrash,
  IconUserMinus,
  IconDatabase,
  IconKey
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
})

// --- DATA ---

const roles = [
  {
    id: 'leadership',
    title: 'President & Secretary General',
    icon: <IconCrown className="w-8 h-8" />,
    color: 'bg-amber-500',
    desc: 'The ultimate authority. Overseers of the entire institutional mesh.',
    powers: [
      'Full administrative access to all modules.',
      'Approval authority over USGs and new members.',
      'Encryption-level control over global registries.'
    ]
  },
  {
    id: 'dg',
    title: 'Director General',
    icon: <IconBriefcase className="w-8 h-8" />,
    color: 'bg-blue-600',
    desc: 'The operational masterminds of secretariat workflows.',
    powers: [
      'High-level resource allocation management.',
      'Performance audit across all USG sectors.',
      'Deployment coordination for major events.'
    ]
  },
  {
    id: 'tic',
    title: 'Teacher in Charge',
    icon: <IconSchool className="w-8 h-8" />,
    color: 'bg-emerald-600',
    desc: 'The faculty mentors and authoritative advisors.',
    powers: [
      'Audit-only access to financial and doc logs.',
      'Formal signature authority for proposals.',
      'Policy-level guidance for all departments.'
    ]
  },
  {
    id: 'usg',
    title: 'Under-Secretary General',
    icon: <IconUserBolt className="w-8 h-8" />,
    color: 'bg-purple-600',
    desc: 'Portfolio leaders managing specialized offices.',
    powers: [
      'Full control over departmental module tools.',
      'Task delegation to sectoral member groups.',
      'Strategic reporting to the Directorate.'
    ]
  },
  {
    id: 'member',
    title: 'Members',
    icon: <IconUsers className="w-8 h-8" />,
    color: 'bg-slate-600',
    desc: 'The core workforce executing daily operations.',
    powers: [
      'Routine task execution in assigned offices.',
      'Document contribution and registry updates.',
      'Standardized internal comms access.'
    ]
  }
]

const modules = [
  {
    id: 'finance',
    title: 'Finance',
    icon: <IconCash className="w-10 h-10" />,
    stats: 'Secured Lattice',
    body: 'Institutional budget management with multi-tier approval encryption.'
  },
  {
    id: 'events',
    title: 'Events',
    icon: <IconCalendarEvent className="w-10 h-10" />,
    stats: 'Real-time Sync',
    body: 'The operational heartbeat for scheduling and technical log orchestration.'
  },
  {
    id: 'documents',
    title: 'Documents',
    icon: <IconFileText className="w-10 h-10" />,
    stats: 'Cloud Native',
    body: 'Encrypted library for circulars, allotments, and research files.'
  },
  {
    id: 'admin',
    title: 'Admin',
    icon: <IconSettingsAutomation className="w-10 h-10" />,
    stats: 'RBAC Active',
    body: 'The core engine for role mapping and organizational stability.'
  }
]

// --- COMPONENTS ---

const EditorialSubtitle = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="flex items-center justify-center gap-2 mb-6"
  >
    <div className="h-0.5 w-6 bg-blue-600" />
    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">{children}</span>
    <div className="h-0.5 w-6 bg-blue-600" />
  </motion.div>
)

export default function RefinedWalkthrough() {
  const [activeRole, setActiveRole] = useState(roles[0])
  const [viewType, setViewType] = useState<'guest' | 'member'>('guest')
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Parallax for Club Logo - Using window scroll for reliable tracking in layout
  const { scrollYProgress } = useScroll()

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -500])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 25])
  const springY1 = useSpring(y1, { stiffness: 60, damping: 15 })

  const handleSummarise = async () => {
    try {
      setLoading(true)
      setDrawerOpen(true)
      setSummary(null)

      const text = roles.map(r => r.title + ': ' + r.desc).join('\n') +
        modules.map(m => m.title + ': ' + m.body).join('\n')

      const res = await fetch('/api/docs/summarise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!res.ok) throw new Error('API Failure')

      const json = await res.json()
      setSummary(json.summary as string)
    } catch (e) {
      setSummary("Oops Sorry, Intelligence core temporarily offline. Please review manually.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden", montserrat.className)}>

      <motion.div
        style={{ y: springY1, rotate }}
        className="fixed top-[15%] right-[-5%] opacity-[0.07] scale-150 pointer-events-none -z-20"
      >
        <img src="/logo/club-logo.png" alt="" className="w-[500px] h-[500px] object-contain" />
      </motion.div>

      <motion.div
        style={{ y: y2 }}
        className="fixed bottom-[-5%] left-[-10%] opacity-[0.05] scale-125 pointer-events-none -z-20"
      >
        <img src="/logo/club-logo.png" alt="" className="w-[400px] h-[400px] object-contain" />
      </motion.div>

      {/* FLOATING GEMINI CORE */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSummarise}
        className="fixed bottom-10 right-10 z-[100] h-16 w-16 rounded-full bg-slate-950 text-white shadow-2xl flex items-center justify-center group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative">
          {loading ? <IconRefresh className="animate-spin w-5 h-5" /> : <Image src="/logo/gemini-color.svg" alt="Gemini" width={20} height={20} />}
        </div>
      </motion.button>

      {/* GEMINI SUMMARY DRAWER */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-white border-l border-slate-100 shadow-2xl z-[120] p-10"
            >
              <button onClick={() => setDrawerOpen(false)} className="mb-8 text-slate-300 hover:text-slate-900 transition-colors"><IconX size={24} /></button>
              <div className="flex items-center gap-2 mb-6">
                <Image src="/logo/gemini-color.svg" alt="Gemini" width={16} height={16} />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-600">AI Synthesizer</span>
              </div>
              <h2 className="text-3xl font-black tracking-tighter mb-6 italic">The Essence.</h2>
              <div className="text-sm text-slate-500 leading-relaxed font-medium space-y-4">
                {loading ? (
                  <div className="space-y-3">
                    <div className="h-3 bg-slate-50 rounded-full w-full animate-pulse" />
                    <div className="h-3 bg-slate-50 rounded-full w-5/6 animate-pulse" />
                    <div className="h-3 bg-slate-50 rounded-full w-4/6 animate-pulse" />
                  </div>
                ) : (
                  <p className={cn(summary?.includes("Oops") ? "text-rose-500 font-bold" : "")}>"{summary}"</p>
                )}
              </div>
              <div className="mt-16 pt-8 border-t border-slate-50 text-[9px] font-bold text-slate-200 uppercase tracking-widest">
                Processed via Gemini Core
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="relative z-10">

        {/* EDITORIAL HERO SECTION - REDUCED TO L */}
        <section className="min-h-[80vh] flex flex-col justify-center p-6 md:p-10 relative">
          <div className="max-w-5xl mx-auto w-full text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-12 flex justify-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-600/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <div className="relative p-8 rounded-[3rem] bg-white shadow-xl border border-slate-50">
                    <img src="/logo/s3cnsLogo.svg" alt="s3cNS" className="h-20 w-20 md:h-32 md:w-32 object-contain" />
                  </div>
                </div>
              </div>

              <EditorialSubtitle>Knowledge Center 0.1</EditorialSubtitle>
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-tight mb-10 uppercase">
                System<br />
                <span className="text-blue-600 italic">Manual</span>.
              </h1>

              <p className="text-lg md:text-xl text-slate-400 font-medium max-w-xl mx-auto leading-relaxed italic border-x-2 border-slate-100 px-8 py-2">
                "Institutional protocols for the s3cNS Secretariat Management infrastructure."
              </p>
            </motion.div>
          </div>
        </section>

        {/* SECTION 01: IDENTITY SPREAD - REDUCED TO M/S */}
        <section className="py-32 px-6 md:px-10 bg-slate-50 relative overflow-hidden">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-16 items-start">
            <div className="lg:col-span-1">
              <EditorialSubtitle>01 / Identity</EditorialSubtitle>
              <h2 className="text-4xl font-black tracking-tighter mb-4 italic leading-tight">The Entrance.</h2>
              <p className="text-base text-slate-400 font-medium leading-relaxed italic">
                Universal synchronization with the s3cNS Identity Lattice via Google Auth.
              </p>
            </div>
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group flex flex-col items-center text-center">
                  <div className="absolute inset-0 bg-blue-600 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500" />
                  <div className="relative group-hover:text-white transition-colors">
                    <IconBrandGoogle size={40} className="mb-6 mx-auto" />
                    <h4 className="text-lg font-black tracking-tight mb-2 uppercase">Institutional Auth</h4>
                    <p className="text-xs font-medium opacity-60 italic">Verified secretariat emails bypass passwords for encryption.</p>
                  </div>
                </div>
                <div className="bg-slate-950 p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden flex flex-col items-center text-center">
                  <IconShieldCheck size={40} className="mb-6 text-blue-500 mx-auto" stroke={1.5} />
                  <h4 className="text-lg font-black tracking-tight mb-2 uppercase">Session Mesh</h4>
                  <p className="text-xs font-medium opacity-40 italic">Real-time state verification ensures operational lattice integrity.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 02: SYSTEM MAP - HIGH-TECH CIRCUIT MAP */}
        <section className="py-40 px-6 md:px-10 overflow-hidden relative bg-slate-50/50">
          {/* Circuit Background Grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="max-w-6xl mx-auto relative">
            <div className="text-center mb-32 relative z-10">
              <EditorialSubtitle>02 / Lifecycle</EditorialSubtitle>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-tight mb-4">
                The <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-400">Circuit</span>.
              </h2>
              <p className="text-lg text-slate-400 font-medium italic mt-4 max-w-xl mx-auto leading-relaxed">
                "Visualizing the institutional handshake through the secure data lattice."
              </p>
            </div>

            <div className="relative">
              {/* DYNAMIC SVG CIRCUIT PATH */}
              <svg className="absolute left-[23px] md:left-1/2 top-0 bottom-0 w-full h-full -translate-x-[23px] md:-translate-x-1/2 pointer-events-none z-0" style={{ height: 'calc(100% + 40px)' }}>
                <motion.path
                  d="M 50% 0 L 50% 100%"
                  stroke="url(#circuit-gradient)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="10 10"
                  className="hidden md:block"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <defs>
                  <linearGradient id="circuit-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                    <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="space-y-12 relative z-10">
                {[
                  { phase: '01', title: 'Identity Handshake', tag: '[AUTH_PENDING]', icon: <IconFingerprint size={28} />, desc: 'Institutional sync detected. A dormant profile awaits authentication. System entry is currently restricted.' },
                  { phase: '02', title: 'Administrative Audit', tag: '[REGISTRY_AUDIT]', icon: <IconShieldCheck size={28} />, desc: 'The Directorate reviews the credentials. Office assignment and role mapping are finalized within the registry.' },
                  { phase: '03', title: 'Lattice Activation', tag: '[LATTICE_ACTIVE]', icon: <IconActivity size={28} />, desc: 'The profile goes live. Departmental permissions are active. The secretariat toolkit is now fully accessible.' },
                  { phase: '04', title: 'Institutional Transition', tag: '[TENURE_ARCHIVE]', icon: <IconArchive size={28} />, desc: 'Tenure concludes. Write-access transitions to read-only status. Legacies are preserved in the institutional archive.' },
                  { phase: '05', title: 'Secure Expunging', tag: '[DATA_PURGE]', icon: <IconTrash size={28} />, desc: 'Account termination complete. Cloud records are sanitized. Personal data is permanently purged from the secure mesh.' }
                ].map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: "backOut" }}
                    className={cn(
                      "group relative flex flex-col md:flex-row items-center gap-10 md:gap-0 w-full",
                      i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    )}
                  >
                    {/* Card Node */}
                    <div className="w-full md:w-[42%]">
                      <div className="relative p-10 rounded-[3.5rem] bg-white border border-slate-100 shadow-[0_5px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_60px_-15px_rgba(59,130,246,0.15)] transition-all duration-700 group/card overflow-hidden">
                        {/* Corner Accent */}
                        <div className="absolute top-0 right-0 p-8">
                          <div className="h-6 w-6 border-t-2 border-r-2 border-blue-100 group-hover/card:border-blue-600 transition-colors duration-500" />
                        </div>

                        <div className="flex flex-col gap-6">
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-mono font-black text-blue-600 tracking-tighter opacity-40">{step.tag}</span>
                            <div className="h-[1px] flex-grow bg-slate-100" />
                          </div>

                          <h4 className="text-3xl font-black tracking-tighter uppercase italic leading-none">{step.title}</h4>

                          <p className="text-xs text-slate-400 font-medium italic leading-relaxed relative overflow-hidden">
                            <motion.span
                              initial={{ y: "100%" }}
                              whileInView={{ y: 0 }}
                              transition={{ duration: 0.5, delay: 0.5 }}
                            >
                              "{step.desc}"
                            </motion.span>
                          </p>

                          <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-200 group-hover/card:text-blue-200 transition-colors">Phase Protocol {step.phase}</span>
                            <div className="h-2 w-2 rounded-full bg-slate-100 group-hover/card:bg-blue-600 group-hover/card:animate-pulse transition-all" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CENTRAL NEURAL NODE */}
                    <div className="relative z-20 flex items-center justify-center group/node">
                      {/* Outer Rings */}
                      <div className="absolute inset-0 scale-[2.5] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                        <div className="absolute inset-0 border border-blue-400/20 rounded-full animate-[spin_5s_linear_infinite]" />
                        <div className="absolute inset-0 border border-dashed border-blue-400/30 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
                      </div>

                      <div className="w-16 h-16 rounded-[2rem] bg-slate-950 text-white shadow-2xl flex items-center justify-center group-hover:bg-blue-600 transition-all duration-700 rotate-[45deg] group-hover:rotate-[0deg] relative overflow-hidden">
                        <div className="-rotate-[45deg] group-hover:rotate-0 transition-transform duration-700">
                          {step.icon}
                        </div>
                        {/* Inner Scanline */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-1/2 w-full -translate-y-full animate-[scan_2s_linear_infinite]" />
                      </div>

                      {/* Lateral Connector (Desktop Only) */}
                      <div className={cn(
                        "hidden md:block absolute top-1/2 -translate-y-1/2 w-16 h-[2px] bg-slate-100 z-0",
                        i % 2 === 0 ? "left-full origin-left" : "right-full origin-right"
                      )}>
                        <motion.div
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          className="w-full h-full bg-blue-600 shadow-[0_0_10px_#3b82f6]"
                        />
                      </div>
                    </div>

                    {/* Spacer for reverse layout */}
                    <div className="hidden md:block md:w-[42%]" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes scan {
              from { transform: translateY(-100%); }
              to { transform: translateY(200%); }
            }
          `}</style>
        </section>

        {/* SECTION 03: THE MATRIX - REDUCED TO M/S */}
        <section className="py-32 px-6 md:px-10 bg-slate-950 text-white relative overflow-hidden">
          <div className="max-w-5xl mx-auto">
            <div className="mb-20 text-center">
              <EditorialSubtitle>03 / Lattice</EditorialSubtitle>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 italic uppercase">The Matrix.</h2>
              <p className="text-base text-slate-600 font-medium italic">Defined authorization mapping levels.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-4 space-y-2">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setActiveRole(role)}
                    className={cn(
                      "w-full px-6 py-5 rounded-[1.5rem] transition-all duration-500 flex items-center gap-4",
                      activeRole.id === role.id ? "bg-white text-slate-950 shadow-lg" : "bg-white/5 text-slate-600 hover:text-slate-400"
                    )}
                  >
                    <div className={cn("h-2 w-2 rounded-full", activeRole.id === role.id ? role.color : "bg-slate-800")} />
                    <span className="text-xs font-black uppercase text-left">{role.title}</span>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeRole.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white/5 backdrop-blur-3xl border border-white/5 p-10 md:p-12 rounded-[3.5rem] flex flex-col items-center text-center"
                  >
                    <h3 className="text-3xl font-black tracking-tighter mb-4 italic uppercase">{activeRole.title}</h3>
                    <p className="text-sm text-slate-400 font-medium italic mb-10 leading-relaxed max-w-sm">"{activeRole.desc}"</p>

                    <div className="grid gap-3 w-full">
                      {activeRole.powers.map((power, i) => (
                        <div key={i} className="flex items-center justify-center gap-4 p-5 rounded-[1.5rem] bg-white/5 border border-white/5">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{power}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 04: THE TOOLS - REDUCED TO M/S */}
        <section className="py-32 px-6 md:px-10 bg-white relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-24">
              <EditorialSubtitle>04 / Armory</EditorialSubtitle>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter italic uppercase leading-none mb-4">The Tools.</h2>
              <p className="text-base text-slate-400 font-medium italic">High-fidelity operational modules.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {modules.map((mod) => (
                <div key={mod.id} className="bg-slate-50 p-8 rounded-[3rem] text-center aspect-square flex flex-col justify-center items-center hover:bg-white hover:shadow-xl transition-all group">
                  <div className="text-slate-200 mb-6 group-hover:text-blue-600 transition-colors">{mod.icon}</div>
                  <h4 className="text-xl font-black tracking-tighter mb-2 italic uppercase">{mod.title}</h4>
                  <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-4 italic">{mod.stats}</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">"{mod.body}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 05: THE LATTICE - REDUCED TO M/S & VISIBILITY FIXED */}
        <section className="py-32 px-6 md:px-10 bg-slate-50 rounded-[5rem] relative z-20 mx-4 mb-20 shadow-sm">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <EditorialSubtitle>05 / Perspective</EditorialSubtitle>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter italic uppercase">The Lattice.</h2>
            </div>

            <div className="flex justify-center mb-16">
              <div className="bg-white p-2 rounded-full border border-slate-100 flex gap-2">
                {[
                  { id: 'guest', label: 'Public View' },
                  { id: 'member', label: 'Internal View' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setViewType(tab.id as any)}
                    className={cn(
                      "px-10 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all",
                      viewType === tab.id ? "bg-slate-950 text-white shadow-lg shadow-blue-500/10" : "text-slate-400 hover:text-slate-900"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                key={viewType}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="aspect-video bg-white rounded-[3rem] shadow-xl relative overflow-hidden flex items-center justify-center p-12 border border-slate-100"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#FFFFFF_0%,_#EFF6FF_100%)] opacity-80" />
                <div className="relative text-center">
                  {viewType === 'guest' ? (
                    <IconEyeOff size={80} className="text-slate-200 mx-auto mb-6" />
                  ) : (
                    <IconLock size={80} className="text-blue-600 mx-auto mb-6" />
                  )}
                  <h3 className="text-3xl font-black italic tracking-tighter text-slate-900 mb-2 uppercase">{viewType === 'guest' ? 'Institutional Hub' : 'Command Center'}</h3>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest opacity-40">Integrity Check: Active</p>
                </div>
              </motion.div>

              <div className="space-y-10 text-center lg:text-left">
                <p className="text-2xl md:text-3xl font-black italic tracking-tighter leading-tight text-slate-900">
                  {viewType === 'guest'
                    ? '"A transparent window into the legacies of our secretariat."'
                    : '"Absolute operational oversight for active leads."'}
                </p>
                <div className="grid gap-3">
                  {(viewType === 'guest' ? ['Legacy Archive', 'Public Circulars', 'General Resource Index'] : ['Financial Auditing', 'Member Progress Logs', 'Technical Files']).map((item) => (
                    <div key={item} className="flex items-center gap-4 pb-4 border-b border-slate-100">
                      <div className="h-2 w-2 rounded-full bg-blue-600 shadow-sm" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CLOSURE */}
        <section className="py-32 px-6 md:px-10 text-center">
          <div className="h-0.5 w-16 bg-slate-950 mx-auto mb-12" />
          <p className="text-[10px] font-black uppercase tracking-[0.8em] text-slate-200 mb-12 text-center ml-[0.8em]">Technical Protocol Termination</p>
          <h3 className="text-4xl md:text-6xl font-black tracking-tighter italic text-slate-500 uppercase">
            s3cNS Mesh 2026.
          </h3>
        </section>

      </main>

      {/* FOOTER - REDUCED SIZES */}
      {/* <footer className="p-12 md:p-20 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-10 bg-white relative z-30">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <img src="/logo/s3cnsLogo.svg" alt="s3cNS" className="h-12 mb-6" />
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">
                        Documentation Authority / UNIT 02<br />
                        Secretariat operational support.
                    </p>
                </div>
                <div className="text-center md:text-right">
                    <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-200">
                        St. Edmund's College, Shillong<br />
                        SECMUN 2025-26 ACADEMIC CYCLE
                    </p>
                </div>
            </footer> */}
    </div>
  )
}
