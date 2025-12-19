"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, useScroll, useTransform, easeOut, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { FlipWords } from "@/components/ui/flip-words"
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
    transition: { staggerChildren: 0.08 },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOut },
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
        className="pointer-events-none absolute inset-x-0 -top-40 -z-20 h-[520px] bg-[url('/hero/secmun-hero.jpg')] bg-cover bg-center opacity-[0.16]"
      />
      <motion.div
        style={{ y: yGlow }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-[-15%] top-[-20%] h-80 w-80 rounded-full bg-blue-500/25 blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-72 w-72 rounded-full bg-sky-400/25 blur-3xl" />
      </motion.div>

      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-14 sm:pt-20 lg:flex-row lg:items-center">
        {/* --- LEFT: CONTENT --- */}
        <motion.div
          className="flex-1 space-y-6"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-background/80 px-3 py-1 text-[11px] text-muted-foreground shadow-sm backdrop-blur sm:text-xs"
            variants={fadeInUp}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Secretariat OS · SECMUN · 2025–26
          </motion.div>

          <motion.div className="space-y-4" variants={fadeInUp}>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Run SECMUN{" "}
              <span className="relative inline-block">
                <span className="absolute inset-x-0 bottom-1 h-3 rounded-full bg-blue-500/25 blur-sm" />
                <FlipWords
                  words={words}
                  className="relative inline-block text-primary"
                />
              </span>{" "}
              from one workspace.
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              s3cNS is the operating system for St. Edmund’s MUN Secretariat:
              conferences, finances, archives, and handovers in a single,
              secure place.
            </p>
          </motion.div>

          {/* MAIN BUTTONS */}
          <motion.div className="flex flex-wrap gap-3" variants={fadeInUp}>
            <Button
              size="lg"
              onClick={handlePrimaryClick}
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading
                ? "Checking session…"
                : user
                ? "Open Secretariat workspace"
                : "Sign in to Secretariat workspace"}
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://sec.edu.in" target="_blank" rel="noreferrer">
                Visit St. Edmund’s College website
              </a>
            </Button>
          </motion.div>

          {/* --- FEATURE BULLETS (New Addition) --- */}
          <motion.div
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground/80 font-medium pt-2"
            variants={fadeInUp}
          >
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-500/70" />
              <span>Built around real SECMUN processes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-cyan-500/70" />
              <span>Fast on campus Wi-Fi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-500/70" />
              <span>No spreadsheets</span>
            </div>
          </motion.div>
        </motion.div>

        {/* --- RIGHT: REACTOR CORE HUD --- */}
        <motion.div
          className="flex-1 lg:pl-10 flex items-center justify-center py-10 lg:py-"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="relative w-[360px] h-[360px] sm:w-[460px] sm:h-[460px] flex items-center justify-center">
            {/* 0. BACKGROUND MATRIX */}
            <div
              className="absolute inset-[-20%] z-0"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(34,211,238,0.1) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                opacity: 0.9,
              }}
            />

            {/* 1. OUTER RINGS */}
            {/* Static thin ring */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-900/20 shadow-[0_0_30px_rgba(6,182,212,0.05)]" />
            
            {/* Rotating Dotted Ring */}
            <svg className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] animate-[spin_80s_linear_infinite] opacity-100">
              <circle cx="50%" cy="50%" r="48%" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3 12" />
            </svg>

            {/* 2. REACTOR CHASSIS */}
            <div className="absolute inset-[15%] rounded-full bg-accent-foreground shadow-[inset_0_0_60px_rgba(0,0,0,0.9),0_0_40px_rgba(6,182,212,0.15)] border-2 border-slate-100 flex items-center justify-center overflow-hidden z-10 group">
                
                {/* Glow Bloom */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_60%)] group-hover:bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.25)_0%,transparent_60%)] transition-all duration-500" />

                {/* --- SEGMENTED ARCS (IRON MAN STYLE) --- */}
                
                {/* Outer Thick Arc (Clockwise) */}
                <svg className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] animate-[spin_10s_linear_infinite]">
                   <circle cx="50%" cy="50%" r="44%" fill="none" stroke="#22d3ee" strokeWidth="6" strokeDasharray="100 280" strokeLinecap="round" className="opacity-80 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                </svg>

                {/* Middle Detail Arc (Counter-Clockwise) */}
                <svg className="absolute inset-8 w-[calc(100%-4rem)] h-[calc(100%-4rem)] animate-[spin_15s_linear_infinite_reverse]">
                   <circle cx="50%" cy="50%" r="42%" fill="none" stroke="#0e7490" strokeWidth="4" strokeDasharray="60 180" strokeLinecap="round" className="opacity-" />
                   <circle cx="50%" cy="50%" r="42%" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="20 220" strokeDashoffset="-40" className="opacity-50" />
                </svg>

                {/* Inner Spinner (Fast) */}
                <svg className="absolute inset-[35%] w-[30%] h-[30%] animate-[spin_3s_linear_infinite]">
                    <circle cx="50%" cy="50%" r="46%" fill="none" stroke="white" strokeWidth="1" strokeDasharray="5 20" className="opacity-60" />
                </svg>


                {/* --- CPU STATS (Embedded) --- */}
                <div className="absolute top-[42%] w-full flex justify-between px-8 z-30 pointer-events-none select-none">
                     <div className="text-right">
                        <span className="block text-xl md:text-2xl font-black text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] tabular-nums">{cpuLeft}</span>
                        <span className="text-[9px] text-cyan-600 font-bold">GHz</span>
                     </div>
                     <div className="text-left">
                        <span className="block text-xl md:text-2xl font-black text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] tabular-nums">{cpuRight}</span>
                        <span className="text-[9px] text-cyan-600 font-bold">GHz</span>
                     </div>
                </div>
                <div className="absolute top-[30%] text-[9px] text-cyan-700 tracking-[0.2em] font-bold opacity-60 pointer-events-none">CPU SPEED</div>


                {/* --- POWER BUTTON (Trigger) --- */}
                <button 
                  onClick={triggerDestruction} 
                  className="relative z-40 mt-3 group/btn rounded-full transition-transform active:scale-95"
                  aria-label="Initiate System Shutdown"
                >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-b from-slate-900 to-black border-[3px] border-cyan-900/50 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.15)] group-hover/btn:border-red-500/50 group-hover/btn:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all duration-300">
                         <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.2)_0%,transparent_70%)] group-hover/btn:bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.2)_0%,transparent_70%)] transition-colors" />
                         <Power className="w-6 h-6 text-cyan-200 drop-shadow-[0_0_5px_cyan] group-hover/btn:text-red-400 group-hover/btn:drop-shadow-[0_0_10px_red] transition-all duration-300" />
                    </div>
                </button>
            </div>

            {/* 3. ORBITAL MODULES (Synced) */}
            
            {/* Top Left: Delegate Affairs */}
            <motion.div className="absolute top-0 left-[-8%] z-30" animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                <div className="bg-slate-900/90 backdrop-blur border border-cyan-800/40 px-3 py-2 rounded-lg shadow-xl flex items-center gap-3 min-w-[140px]">
                    <div className="p-1.5 bg-cyan-950/60 rounded border border-cyan-900/50"><Users className="w-3 h-3 text-cyan-400" /></div>
                    <div><div className="text-[9px] text-cyan-100 font-bold">DELEGATE AFFAIRS</div><div className="text-[8px] text-slate-500 font-mono tracking-wider">SYNCED</div></div>
                </div>
            </motion.div>

            {/* Top Right: Finance */}
            <motion.div className="absolute top-[12%] right-[-10%] z-30" animate={{ y: [0, 6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
                <div className="bg-slate-900/90 backdrop-blur border border-cyan-800/40 px-3 py-2 rounded-lg shadow-xl flex items-center gap-3 min-w-[140px]">
                    <div className="p-1.5 bg-cyan-950/60 rounded border border-cyan-900/50"><PieChart className="w-3 h-3 text-cyan-400" /></div>
                    <div><div className="text-[9px] text-cyan-100 font-bold">FINANCE</div><div className="text-[8px] text-slate-500 font-mono tracking-wider">SYNCED</div></div>
                </div>
            </motion.div>

            {/* Bottom Left: Communication */}
            <motion.div className="absolute bottom-[10%] left-[-8%] z-30" animate={{ y: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
                <div className="bg-slate-900/90 backdrop-blur border border-cyan-800/40 px-3 py-2 rounded-lg shadow-xl flex items-center gap-3 min-w-[140px]">
                    <div className="p-1.5 bg-cyan-950/60 rounded border border-cyan-900/50"><MessageSquare className="w-3 h-3 text-cyan-400" /></div>
                    <div><div className="text-[9px] text-cyan-100 font-bold">COMMUNICATION</div><div className="text-[8px] text-slate-500 font-mono tracking-wider">SYNCED</div></div>
                </div>
            </motion.div>

            {/* Bottom Right: Logistics */}
            <motion.div className="absolute bottom-[20%] right-[-10%] z-30" animate={{ y: [0, -5, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}>
                <div className="bg-slate-900/90 backdrop-blur border border-cyan-800/40 px-3 py-2 rounded-lg shadow-xl flex items-center gap-3 min-w-[140px]">
                    <div className="p-1.5 bg-cyan-950/60 rounded border border-cyan-900/50"><Truck className="w-3 h-3 text-cyan-400" /></div>
                    <div><div className="text-[9px] text-cyan-100 font-bold">LOGISTICS</div><div className="text-[8px] text-slate-500 font-mono tracking-wider">SYNCED</div></div>
                </div>
            </motion.div>

            {/* 4. STATUS PILLS */}
            {/* Ping (Top) */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-30">
              <div className="bg-black/80 backdrop-blur border border-cyan-900/50 rounded-full px-5 py-1.5 flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                <Activity className="w-3 h-3 text-cyan-400" />
                <span className="text-[10px] text-cyan-100 font-mono font-bold">PING {ping} ms</span>
              </div>
            </div>

            {/* Online (Bottom) */}
            <div className="absolute -bottom-8 right-[20%] z-30">
              <div className="bg-black/80 backdrop-blur border border-emerald-900/50 rounded-full px-5 py-1.5 flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <Globe className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-emerald-100 font-bold tracking-widest">ONLINE</span>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  )
}