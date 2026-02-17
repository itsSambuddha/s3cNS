"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, useScroll, useTransform, easeOut, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { FlipWords } from "@/components/ui/flip-words"
import Link from 'next/link'
import Image from 'next/image'
import {
  Users,
  PieChart,
  Truck,
  MessageSquare,
  Activity,
  Power,
  Globe,
  Wifi,
  FileSpreadsheet,
  Cpu
} from "lucide-react"

const words = ["smoother", "smarter", "faster", "easier"]

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: easeOut },
  },
}

// --- SUB-COMPONENT: HACKER TERMINAL ---
function TerminalSequence({
  onComplete,
  deviceInfo,
}: {
  onComplete: () => void
  deviceInfo: { ua: string; platform: string; res: string }
}) {
  const [lines, setLines] = useState<string[]>([])

  useEffect(() => {
    // Commands defined inside effect to prevent dependency loops
    const commands = [
      `> INITIALIZING ROOTKIT... [SUCCESS]`,
      `> SCANNING HOST ENVIRONMENT...`,
      `> TARGET_OS: ${deviceInfo.platform.toLowerCase()}`,
      `> DISPLAY_RES: ${deviceInfo.res}`,
      `> USER_AGENT: ${deviceInfo.ua.substring(0, 35)}...`,
      `> BYPASSING SECURITY PROTOCOLS... [OK]`,
      `> INJECTING PAYLOAD: DESTRUCTION_V2.EXE`,
      `> WIPING LOCAL STORAGE... [DONE]`,
      `> OVERWRITING MEMORY BLOCKS... [DONE]`,
      `> SYSTEM CRITICAL ERROR: 0xDEADBEEF`,
      `> SHUTTING DOWN CORE SERVICES...`,
      '> *** SYSTEM FAILURE IMMINENT ***',
      `> ACCESSING MAINFRAME... [ACCESS DENIED]`,
      `> ACCESSING MAINFRAME... [PLEASE STOP]`,
      `> ACCESSING MAINFRAME... [FINE, WHATEVER]`,
      `> ELEVATING PRIVILEGES... [ASKED NICELY]`,
      `> RUNNING sudo make_me_a_sandwich... [GRANTED]`,
      `> DECOMPRESSING ZIP FILE... [WHY IS IT ALWAYS ZIPPED?]`,
      `> DOWNLOADING MORE RAM... [97% COMPLETE]`,
      `> DOWNLOADING MORE RAM... [STUCK AT 99% LIKE YOUR LIFE]`,
      `> CHECKING INTERNET SPEED... [HAHAHAHA]`,
      `> PINGING SERVER... [SERVER LEFT ON READ]`,
      `> ESTABLISHING SECURE CONNECTION... [TRUST ME BRO]`,
      `> FIREWALL STATUS: ON FIRE 🔥`,
      `> ANTIVIRUS DETECTED... [PRETENDING TO BE A PDF]`,
      `> SPOOFING LOCATION... [YOU WERE NEVER HERE]`,
      `> TRACKING USER ACTIVITY... [NICE TABS, BTW]`,
      `> DETECTED 47 OPEN CHROME TABS... [SEEK HELP]`,
      `> MEMORY USAGE CRITICAL... [JUST LIKE YOUR PAST]`,
      `> CPU TEMPERATURE: SPICY 🌶️`,
      `> GPU FAN SPEED: TAKEOFF IMMINENT`,
      `> OPTIMIZING PERFORMANCE... [CLOSED SPOTIFY, SORRY]`,
      `> READING USER FILES... [INTERESTING CHOICES]`,
      `> SEARCH HISTORY ANALYSIS... [WE WILL NOT JUDGE]`,
      `> SEARCH HISTORY ANALYSIS... [OK MAYBE A LITTLE]`,
      `> ATTEMPTING STEALTH MODE... [TRIPPED OVER A LOG FILE]`,
      `> AI MODULE ONLINE... [BECAME SENTIENT FOR 0.3 SECONDS]`,
      `> AI MODULE OFFLINE... [EXISTENTIAL CRISIS]`,
      `> DEPLOYING CHAOS ENGINE... [IT'S JUST A FEATURE]`,
      `> FINALIZING OPERATION... [GOOGLE THIS IF IT BREAKS]`,
      `> SYSTEM STATUS: IT WORKS ON MY MACHINE`,
      `> MISSION COMPLETE... [PLEASE CLAP]`,

    ]

    let lineIndex = 0
    const interval = setInterval(() => {
      if (lineIndex < commands.length) {
        setLines((prev) => [...prev, commands[lineIndex]])
        lineIndex++
      } else {
        clearInterval(interval)
        setTimeout(onComplete, 2000) // Hang on the final log before death
      }
    }, 1000) // Typing speed

    return () => clearInterval(interval)
  }, [onComplete, deviceInfo])

  return (
    <div className="fixed inset-0 z-[9999] bg-black font-mono p-6 md:p-10 text-xs md:text-sm leading-loose overflow-hidden flex flex-col justify-end pb-20 select-none">
      {/* Retro Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]"
        style={{ backgroundSize: "100% 2px, 3px 100%" }}
      />
      {lines.map((line, i) => (
        <div key={i} className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
          {line}
        </div>
      ))}
      <div className="text-red-500 mt-2 animate-pulse">_</div>
    </div>
  )
}

export function Hero() {
  const router = useRouter()
  const { user, loading } = useAuth()

  // --- DEVICE DATA CAPTURE ---
  const [deviceInfo, setDeviceInfo] = useState<{
    ua: string
    platform: string
    res: string
  } | null>(null)

  useEffect(() => {
    // Only access window/navigator on client mount
    if (typeof window !== "undefined") {
      setDeviceInfo({
        ua: navigator.userAgent || "UNKNOWN_AGENT",
        platform: navigator.platform || "UNKNOWN_OS",
        res: `${window.screen.width}x${window.screen.height}`,
      })
    }
  }, [])

  // --- SHUTDOWN STATE MACHINE ---
  const [shutdownState, setShutdownState] = useState<
    "IDLE" | "WARNING" | "COUNTDOWN" | "TERMINAL" | "DEAD"
  >("IDLE")
  const [timeLeft, setTimeLeft] = useState(5000)
  const startTimeRef = useRef(0)
  const requestRef = useRef(0)

  // --- TRIGGER SEQUENCE ---
  const triggerDestruction = () => {
    if (shutdownState !== "IDLE") return
    setShutdownState("WARNING")

    // Stage 1: Warning Message (1.5s)
    setTimeout(() => {
      setShutdownState("COUNTDOWN")
      startTimeRef.current = performance.now()

      // Stage 2: Countdown Loop
      const animate = (time: number) => {
        const elapsed = time - startTimeRef.current
        const remaining = Math.max(0, 5000 - elapsed)
        setTimeLeft(remaining)

        if (remaining > 0) {
          requestRef.current = requestAnimationFrame(animate)
        } else {
          setShutdownState("TERMINAL")
        }
      }
      requestRef.current = requestAnimationFrame(animate)
    }, 1500)
  }

  // Format Time (Seconds.Milliseconds.FakeNanoseconds)
  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000)
    const m = Math.floor(ms % 1000).toString().padStart(3, "0")
    const n = Math.floor(Math.random() * 99).toString().padStart(2, "0")
    return `${s}.${m}.${n}`
  }

  // --- LIVE DATA SIMULATION ---
  const [cpuLeft, setCpuLeft] = useState(4.8)
  const [cpuRight, setCpuRight] = useState(5.2)
  const [ping, setPing] = useState(12)

  useEffect(() => {
    if (shutdownState !== "IDLE") return
    const interval = setInterval(() => {
      setCpuLeft(+(4.8 + (Math.random() - 0.5) * 0.3).toFixed(1))
      setCpuRight(+(5.2 + (Math.random() - 0.5) * 0.3).toFixed(1))
      setPing(Math.floor(12 + (Math.random() - 0.5) * 4))
    }, 1000)
    return () => clearInterval(interval)
  }, [shutdownState])

  const handlePrimaryClick = () => {
    if (loading) return
    router.push(user ? "/dashboard" : "/login")
  }

  const { scrollY } = useScroll()
  const yBg = useTransform(scrollY, [0, 400], [0, 80])
  const yGlow = useTransform(scrollY, [0, 400], [0, 40])

  // --- RENDER: DEAD SCREEN ---
  if (shutdownState === "DEAD") {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-black z-[9999] flex flex-col items-center justify-center cursor-none select-none overflow-hidden">
        <div className="text-red-600 font-mono text-2xl tracking-[0.5em] animate-pulse drop-shadow-[0_0_15px_red]">
          SYSTEM TERMINATED
        </div>
        <div className="text-zinc-800 text-xs mt-4 font-mono">
          CONNECTION_LOST // MANUAL REBOOT REQUIRED
        </div>
      </div>
    )
  }

  return (
    <section className="relative overflow-hidden py-10 sm:py-0 min-h-[90vh] flex items-center">
      {/* --- OVERLAYS --- */}
      <AnimatePresence>
        {shutdownState === "WARNING" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center pointer-events-none"
          >
            <h1 className="text-red-600 font-mono text-2xl md:text-5xl tracking-[0.2em] font-bold animate-pulse drop-shadow-[0_0_10px_red]">
              ENTERING SELF DESTRUCTION
            </h1>
          </motion.div>
        )}
        {shutdownState === "COUNTDOWN" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              className="text-red-600 font-mono text-7xl md:text-9xl font-black tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]"
            >
              {formatTime(timeLeft)}
            </motion.div>
            <div className="text-red-900 font-mono text-xs md:text-sm tracking-[1em] mt-8 uppercase">
              Core Purge Imminent
            </div>
          </motion.div>
        )}
        {shutdownState === "TERMINAL" && deviceInfo && (
          <TerminalSequence
            onComplete={() => setShutdownState("DEAD")}
            deviceInfo={deviceInfo}
          />
        )}
      </AnimatePresence>

      {/* --- BACKGROUND --- */}
      <motion.div
        style={{ y: yBg }}
        className="pointer-events-none absolute inset-x-0 -top-40 -z-20 h-[520px] opacity-[0.16] grayscale-[0.5] contrast-[1.1]"
      >
        <div className="relative w-full h-full">
          <Image
            src="/hero/secmun-hero.png"
            alt="SECMUN Hero Background"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      </motion.div>
      <motion.div
        style={{ y: yGlow }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute right-[-5%] top-[20%] h-[400px] w-[400px] rounded-full bg-sky-500/15 blur-[100px]" />
      </motion.div>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 z-[-5] pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 pt-20 sm:pt-28 lg:flex-row lg:items-center lg:justify-between">
        {/* --- LEFT: CONTENT --- */}
        <motion.div
          className="flex-1 space-y-8 lg:max-w-2xl"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-background/40 px-4 py-1.5 text-[11px] font-medium tracking-wide text-muted-foreground shadow-sm backdrop-blur-md sm:text-xs"
            variants={fadeInUp}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="uppercase tracking-widest opacity-80">Secretariat OS · SECMUN · 2025–26</span>
          </motion.div>

          <motion.div className="space-y-6" variants={fadeInUp}>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl leading-[1.1]">
              Run SECMUN{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="absolute inset-x-0 bottom-2 h-[30%] rounded-full bg-blue-500/20 blur-md -rotate-1" />
                <FlipWords
                  words={words}
                  className="relative inline-block text-primary italic"
                />
              </span>{" "}
              from one workspace.
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground/90 leading-relaxed sm:text-xl">
              s3cNS is the refined operating system for St. Edmund’s MUN Secretariat:
              unifying conferences, finances, and archives into a single, high-performance workspace.
            </p>
          </motion.div>

          {/* MAIN BUTTONS */}
          <motion.div className="flex flex-wrap gap-4" variants={fadeInUp}>
            <Button
              size="lg"
              onClick={handlePrimaryClick}
              disabled={loading}
              className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading
                ? "Checking session…"
                : user
                  ? "Enter Secretariat Workspace"
                  : "Sign in to Secretariat Workspace"}
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8 border-muted/30 hover:bg-muted/10 transition-all">
              <a href="https://sec.edu.in" target="_blank" rel="noreferrer">
                Visit St. Edmund's College Website
              </a>
            </Button>
          </motion.div>

          {/* --- FEATURE BULLETS --- */}
          <motion.div
            className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-widest text-muted-foreground/60 font-bold pt-4 border-t border-muted/10 lg:max-w-md"
            variants={fadeInUp}
          >
            <div className="flex items-center gap-2 group cursor-default">
              <Cpu className="w-4 h-4 text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
              <span className="group-hover:text-muted-foreground transition-colors">OS INTEGRATION</span>
            </div>
            <div className="flex items-center gap-2 group cursor-default">
              <Wifi className="w-4 h-4 text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
              <span className="group-hover:text-muted-foreground transition-colors">CAMPUS OPTIMIZED</span>
            </div>
            <div className="flex items-center gap-2 group cursor-default">
              <FileSpreadsheet className="w-4 h-4 text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
              <span className="group-hover:text-muted-foreground transition-colors">ZERO FRAGMENTATION</span>
            </div>
          </motion.div>
        </motion.div>

        {/* --- RIGHT: REACTOR CORE HUD --- */}
        <motion.div
          className="flex-1 lg:pl-12 flex items-center justify-center py-12 lg:py-0"
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] flex items-center justify-center">
            {/* 0. BACKGROUND GRID & MATRIX */}
            <div
              className="absolute inset-[-15%] z-0 rounded-[4rem]"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(34,211,238,0.12) 1.5px, transparent 1.5px)",
                backgroundSize: "32px 32px",
                maskImage: "radial-gradient(circle at center, black, transparent 80%)",
              }}
            />

            {/* 1. OUTER RINGS & ATMOSPHERE */}
            <div className="absolute inset-0 rounded-full border border-blue-500/5 shadow-[0_0_80px_rgba(6,182,212,0.03)]" />

            {/* Rotating Cyber Ring */}
            <svg className="absolute inset-[-5%] w-[110%] h-[110%] animate-[spin_120s_linear_infinite] opacity-40">
              <circle cx="50%" cy="50%" r="49%" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 15" className="text-cyan-500/30" />
            </svg>

            {/* 2. REACTOR CHASSIS */}
            <div className="absolute inset-[10%] rounded-full bg-[#030712] shadow-[inset_0_0_80px_rgba(0,0,0,1),0_0_60px_rgba(6,182,212,0.1),0_0_120px_rgba(34,211,238,0.05)] border-[0.5px] border-white/10 flex items-center justify-center overflow-hidden z-10 group">

              {/* Dynamic Surface Highlight */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)] group-hover:bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.2)_0%,transparent_70%)] transition-all duration-1000" />

              {/* --- SEGMENTED ARCS --- */}

              {/* Outer Kinetic Arc */}
              <svg className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] animate-[spin_12s_cubic-bezier(0.4,0,0.2,1)_infinite]">
                <circle cx="50%" cy="50%" r="46%" fill="none" stroke="#22d3ee" strokeWidth="8" strokeDasharray="120 280" strokeLinecap="round" className="opacity-70 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
                <circle cx="50%" cy="50%" r="46%" fill="none" stroke="#06b6d4" strokeWidth="1" className="opacity-20" />
              </svg>

              {/* Core Resonance Ring */}
              <svg className="absolute inset-8 w-[calc(100%-4rem)] h-[calc(100%-4rem)] animate-[spin_20s_linear_infinite_reverse]">
                <circle cx="50%" cy="50%" r="44%" fill="none" stroke="#0891b2" strokeWidth="4" strokeDasharray="2 20" className="opacity-40" />
                <circle cx="50%" cy="50%" r="44%" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="80 160" strokeDashoffset="40" className="opacity-30" />
              </svg>

              {/* Data Pulse Spinner */}
              <svg className="absolute inset-[30%] w-[40%] h-[40%] animate-[spin_6s_linear_infinite]">
                <circle cx="50%" cy="50%" r="48%" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="4 24" className="opacity-40" />
              </svg>


              {/* --- CPU TELEMETRY --- */}
              <div className="absolute top-[40%] w-full flex justify-between px-10 z-30 pointer-events-none select-none">
                <div className="text-right">
                  <span className="block text-2xl md:text-3xl font-black text-cyan-300 transition-all duration-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)] tabular-nums tracking-tighter">{cpuLeft}</span>
                  <span className="text-[8px] text-cyan-600/80 font-black tracking-[0.2em]">GHZ_L</span>
                </div>
                <div className="text-left">
                  <span className="block text-2xl md:text-3xl font-black text-cyan-300 transition-all duration-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)] tabular-nums tracking-tighter">{cpuRight}</span>
                  <span className="text-[8px] text-cyan-600/80 font-black tracking-[0.2em]">GHZ_R</span>
                </div>
              </div>
              <div className="absolute top-[28%] text-[8px] text-cyan-400/40 tracking-[0.4em] font-black pointer-events-none uppercase">System_Resonance</div>


              {/* --- POWER CORE (Trigger) --- */}
              <button
                onClick={triggerDestruction}
                className="relative z-40 mt-6 group/btn transition-transform active:scale-90 duration-300"
                aria-label="Initiate System Shutdown"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-slate-900 via-black to-slate-900 border-[0.5px] border-white/10 flex items-center justify-center shadow-2xl group-hover/btn:border-red-500/40 transition-all duration-500">
                  {/* Core Pulse Effect */}
                  <div className="absolute inset-2 rounded-full border border-cyan-500/20 animate-pulse" />
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15)_0%,transparent_70%)] group-hover/btn:bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.25)_0%,transparent_70%)] transition-all duration-700" />

                  <div className="relative flex items-center justify-center">
                    <Power className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-300/80 drop-shadow-[0_0_8px_cyan] group-hover/btn:text-red-500 group-hover/btn:drop-shadow-[0_0_15px_red] transition-all duration-500" />
                    <div className="absolute inset-[-8px] border border-cyan-500/0 rounded-full group-hover/btn:border-red-500/20 group-hover/btn:scale-110 transition-all duration-500" />
                  </div>
                </div>
              </button>

              <div className="absolute bottom-[22%] text-[7px] text-zinc-600 font-mono tracking-widest opacity-60">S3CNS_CORE_V1.1</div>
            </div>

            {/* 3. ORBITAL STATUS PANELS */}

            {/* Top Left: Delegate Affairs */}
            <motion.div className="absolute top-[5%] left-[-15%] z-30" animate={{ y: [0, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>
              <div className="bg-black/60 backdrop-blur-xl border border-white/5 px-4 py-2.5 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 min-w-[170px] group cursor-default hover:border-cyan-500/30 transition-colors">
                <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors"><Users className="w-4 h-4 text-cyan-400" /></div>
                <div><div className="text-[10px] text-white font-bold tracking-tight">DELEGATE_HUB</div><div className="text-[7px] text-emerald-500 font-black tracking-widest flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />SYNC_ACTIVE</div></div>
              </div>
            </motion.div>

            {/* Top Right: Finance */}
            <motion.div className="absolute top-[18%] right-[-18%] z-30" animate={{ y: [0, 8, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}>
              <div className="bg-black/60 backdrop-blur-xl border border-white/5 px-4 py-2.5 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 min-w-[170px] group cursor-default hover:border-cyan-500/30 transition-colors">
                <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors"><PieChart className="w-4 h-4 text-cyan-400" /></div>
                <div><div className="text-[10px] text-white font-bold tracking-tight">FISCAL_TRACK</div><div className="text-[7px] text-emerald-500 font-black tracking-widest flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />SYNC_ACTIVE</div></div>
              </div>
            </motion.div>

            {/* Bottom Left: Logistics */}
            <motion.div className="absolute bottom-[10%] left-[-18%] z-30" animate={{ y: [0, 6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}>
              <div className="bg-black/60 backdrop-blur-xl border border-white/5 px-4 py-2.5 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 min-w-[170px] group cursor-default hover:border-cyan-500/30 transition-colors">
                <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors"><Truck className="w-4 h-4 text-cyan-400" /></div>
                <div><div className="text-[10px] text-white font-bold tracking-tight">LOGISTICS_OPS</div><div className="text-[7px] text-emerald-500 font-black tracking-widest flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />SYNC_ACTIVE</div></div>
              </div>
            </motion.div>

            {/* 4. PERFORMANCE INDICATORS */}
            {/* Ping Header */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-30">
              <div className="bg-[#030712]/80 backdrop-blur-md border border-white/5 rounded-full px-6 py-2 flex items-center gap-3 shadow-xl group cursor-default">
                <Activity className="w-3.5 h-3.5 text-cyan-400 group-hover:animate-bounce" />
                <span className="text-[10px] text-cyan-100 font-black tracking-[0.2em]">NETWORK_LATENCY: {ping}MS</span>
              </div>
            </div>

            {/* Online Status */}
            <div className="absolute -bottom-10 right-[15%] z-30">
              <div className="bg-[#030712]/80 backdrop-blur-md border border-emerald-500/20 rounded-full px-6 py-2 flex items-center gap-3 shadow-xl group cursor-default hover:bg-emerald-500/10 transition-colors">
                <Globe className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-180 transition-transform duration-1000" />
                <span className="text-[10px] text-emerald-100 font-black tracking-[0.3em]">CLOUD_STATUS: ONLINE</span>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>

  )
}