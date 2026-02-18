"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import Image from "next/image"
import { Check, Coffee, Zap, ChevronRight, Sparkles, X, Smartphone, Terminal, Code2, ShieldCheck, RefreshCw, UserCircle2 } from "lucide-react"
import g_pay_q_r from ".//(support)/_assest//g_pay_q_r.png"
import { Button } from "@/components/ui/button"

export default function PricingPage() {
  const [qrOpen, setQrOpen] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(30)

  // TODO: REPLACE WITH ACTUAL UPI ID
  const UPI_ID = "sidhusamsk@oksbi"
  const UPI_NAME = "ShwetVeer Vrish"

  const upiDeepLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&cu=INR`

  useEffect(() => {
    if (!qrOpen) return

    setSecondsLeft(30)
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    const timeout = setTimeout(() => {
      setQrOpen(false)
    }, 30000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [qrOpen])

  return (
    <main className="relative min-h-screen bg-[#020617] overflow-hidden selection:bg-sky-500/30 font-sans text-slate-100">
      {/* Cinematic Chaos Layer */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.1),transparent_50%),radial-gradient(circle_at_100%_100%,rgba(255,255,255,0.02),transparent_40%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/10 via-sky-400/5 to-transparent pointer-events-none" />

      {/* Ghost Background Text (Matches Footer) */}
      <div className="fixed top-0 left-0 right-0 flex justify-center opacity-[0.05] select-none pointer-events-none pt-20 -z-10">
        <span className="text-[30vw] font-black tracking-tighter leading-none text-white/20">
          S3CNS
        </span>
      </div>

      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#1e293b33_1px,transparent_1px),linear-gradient(to_bottom,#1e293b33_1px,transparent_1px)] bg-[size:32px_32px]"></div>


      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <header className="text-center space-y-12 mb-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-sky-400/20 bg-sky-400/5 px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-sky-400">
              {/* <Sparkles className="w-3 h-3" /> */}
              <span>THE HONEST TRUTH</span>
            </div>

            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white leading-none uppercase">
                S3CNS IS <br className="md:hidden" />
                <span className="text-sky-400">ESSENTIALLY</span> FREE.
              </h1>
            </div>

            <div className="space-y-6">
              <p className="text-sm md:text-base text-zinc-500 font-bold max-w-xl mx-auto leading-relaxed uppercase tracking-[0.1em]">
                BUT IF THIS TOOL SAVED YOUR SANITY FROM THE DEPTHS OF <span className="text-zinc-300">SECRETARIAT HELL</span>, YOU CAN FUEL MINE WITH A
              </p>

              <div className="relative inline-block py-6">
                <motion.div
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(255,255,255,0.1)",
                      "0 0 40px rgba(255,255,255,0.4)",
                      "0 0 20px rgba(255,255,255,0.1)"
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="relative text-6xl md:text-9xl font-black tracking-tighter text-white uppercase italic leading-none"
                >
                  WHITE MONSTER
                </motion.div>
                <div className="mt-6 flex items-center justify-center gap-4">
                  <div className="h-[1px] w-12 bg-sky-500/20" />
                  <div className="text-[9px] font-black text-sky-500/40 tracking-[0.6em] uppercase">
                    NUCLEAR CAFFEINE LEVELS DETECTED
                  </div>
                  <div className="h-[1px] w-12 bg-sky-500/20" />
                </div>
              </div>
            </div>
          </motion.div>
        </header>

        <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto items-stretch">
          {/* Bento Card: Broke Student */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 group-hover:border-white/20 transition-all duration-300" />

            <div className="relative h-full flex flex-col p-10 md:p-12 space-y-8">
              <div className="flex items-center justify-between">
                <div className="bg-white/10 p-3 rounded-2xl">
                  <Code2 className="w-6 h-6 text-zinc-400" />
                </div>
                <div className="px-3 py-1 rounded-full border border-white/5 bg-white/5">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">PURE AUDACITY</span>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-black text-white leading-tight uppercase tracking-tight">
                  AUDACIOUS <br /> BROKE STUDENT
                </h2>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-6xl font-black text-white">₹0</span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">/ ETERNITY</span>
                </div>
              </div>

              {/* Refined Life Stats */}
              <div className="space-y-6 pt-6 border-t border-white/5">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[9px] font-black tracking-[0.2em] uppercase">
                    <span className="text-zinc-500">CONFIDENCE LEVEL</span>
                    <span className="text-white">100%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5 }} className="h-full bg-sky-400" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[9px] font-black tracking-[0.2em] uppercase">
                    <span className="text-zinc-500">SLEEP REMAINING</span>
                    <span className="text-white">NONE</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full" />
                </div>
              </div>

              <ul className="space-y-4 flex-1">
                {[
                  "FULL SYSTEM ACCESS (NO FILTER)",
                  "I PROMISE IT WORKS (MOSTLY)",
                  "LEGAL PROTECTION: NON-EXISTENT",
                  "MY THOUGHTS, PRAYERS & PITY",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-bold text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-tight">
                    <div className="w-1 h-1 rounded-full bg-zinc-800 group-hover:bg-sky-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="pt-6">
                <Button variant="ghost" className="w-full h-16 rounded-[1.5rem] border border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] transition-all">
                  <span className="flex items-center gap-3">
                    LEAVE FOR FREE <ChevronRight className="w-4 h-4" />
                  </span>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Bento Card: Support Tier */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-sky-500/5 backdrop-blur-xl rounded-[2.5rem] border border-sky-500/20 group-hover:border-sky-400/40 transition-all duration-300" />

            <div className="relative h-full flex flex-col p-10 md:p-12 space-y-8">
              <div className="flex items-center justify-between">
                <div className="bg-sky-500/10 p-3 rounded-2xl border border-sky-500/20">
                  <Coffee className="w-6 h-6 text-sky-400" />
                </div>
                <div className="px-3 py-1 rounded-full border border-sky-400/20 bg-sky-400/10">
                  <span className="text-[9px] font-black text-sky-400 uppercase tracking-widest">REVERED SUPPLIER</span>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-black text-white leading-tight uppercase tracking-tight">
                  WHITE MONSTER <br /> SUPPLIER
                </h2>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-white to-blue-400">PAY</span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">/ BE A HERO</span>
                </div>
              </div>

              {/* Refined Health Stats */}
              <div className="space-y-6 pt-6 border-t border-sky-500/10">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[9px] font-black tracking-[0.2em] uppercase text-sky-400">
                    <span className="opacity-60">DEV HEART RATE</span>
                    <span>140 BPM</span>
                  </div>
                  <div className="w-full h-1 bg-sky-500/10 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-full w-1/3 bg-gradient-to-r from-transparent via-sky-400 to-transparent"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center text-[9px] font-black tracking-[0.2em] uppercase">
                  <span className="text-zinc-500">KARMA OVERFLOW</span>
                  <span className="text-sky-400">STORMING</span>
                </div>
              </div>

              <ul className="space-y-4 flex-1">
                {[
                  "PRIORITY BUG FIXES (MAYBE)",
                  "DIRECT LINE TO MY TACHYCARDIA",
                  "GOOD KARMA MULTIPLIER (∞)",
                  "LEGAL STATUS: ABSOLUTE LEGEND",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-bold text-sky-100/70 group-hover:text-white transition-colors uppercase tracking-tight">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="pt-6">
                <Button
                  onClick={() => setQrOpen(true)}
                  className="w-full h-16 rounded-[1.5rem] bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02]"
                >
                  <span className="flex items-center gap-3">
                    PURCHASE MY SOUL <Zap className="w-4 h-4 fill-white animate-pulse" />
                  </span>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {qrOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQrOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 100 }}
              className="relative w-full max-w-full md:max-w-4xl h-[92vh] md:h-auto bg-[#020817] border-t md:border border-white/10 rounded-t-[3rem] md:rounded-[2.5rem] p-8 md:p-14 shadow-2xl overflow-y-auto md:overflow-hidden fixed bottom-0 md:relative"
            >
              {/* Scanline Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%),linear-gradient(90deg,rgba(56,189,248,0.03),rgba(59,130,246,0.01),rgba(37,99,235,0.03))] z-10 pointer-events-none bg-[length:100%_4px,4px_100%]" />

              {/* Close Button */}
              <button
                onClick={() => setQrOpen(false)}
                className="absolute top-8 right-8 p-3 rounded-full bg-slate-900/80 backdrop-blur-sm border border-white/10 hover:border-white/20 text-slate-400 hover:text-white transition-all z-30 shadow-2xl group"
              >
                <X className="w-5 h-5 transition-transform group-hover:rotate-90 group-hover:scale-110" />
              </button>

              <div className="relative z-20 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

                {/* Left Side: Text Content */}
                <div className="flex-1 space-y-10 text-left w-full lg:w-auto">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-6 bg-sky-500 rounded-full" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-400">
                        TRANSACTION_PENDING
                      </span>
                    </div>

                    <h3 className="text-4xl md:text-7xl font-black text-white leading-tight md:leading-[1.1] tracking-tight">
                      Scan to <br className="hidden md:block" />
                      <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">
                        Energize.
                      </span>
                    </h3>

                    <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed max-w-md">
                      Initiate a one-time peer-to-peer caffeine transfer via any UPI-enabled terminal.
                    </p>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-6 md:gap-12 pt-0 md:pt-4">
                    <div className="flex items-center lg:flex-col lg:items-start gap-3 lg:gap-2">
                      <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0" />
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white leading-tight">END-TO-END</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-tight hidden lg:block">ENCRYPTED</p>
                      </div>
                    </div>
                    <div className="flex items-center lg:flex-col lg:items-start gap-3 lg:gap-2">
                      <RefreshCw className="w-5 h-5 text-sky-400 shrink-0" />
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white leading-tight">INSTANT</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-tight hidden lg:block">VERIFICATION</p>
                      </div>
                    </div>
                  </div>

                  {/* Timer Button */}
                  <div className="pt-2 md:pt-4 hidden md:block">
                    <div className="inline-flex items-center px-10 py-3 rounded-full border border-white/20 bg-white/5 text-[11px] font-black uppercase tracking-[0.2em] text-white">
                      LINK TERMINATES IN {secondsLeft}S
                    </div>
                  </div>
                </div>

                {/* Right Side: QR Container */}
                <div className="w-full lg:w-auto">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative p-[1px] md:p-2.5 rounded-[3.5rem] bg-gradient-to-br from-sky-400 via-white/50 to-blue-600 shadow-[0_0_60px_rgba(56,189,248,0.3)] group"
                  >
                    <div className="bg-[#f8fafc] md:bg-[#f8fafc] dark:md:bg-[#f8fafc] bg-opacity-10 backdrop-blur-3xl rounded-[3.4rem] md:rounded-[3.2rem] p-6 md:p-10 flex flex-col items-center border border-white/10 md:border-none">
                      {/* Merchant/Avatar Header */}
                      <div className="flex items-center gap-3 mb-6 md:mb-8">
                        <div className="w-10 h-10 md:w-8 md:h-8 rounded-full bg-sky-500/10 border border-sky-400/20 overflow-hidden flex items-center justify-center text-sky-400">
                          <UserCircle2 className="w-full h-full p-1" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] md:text-sm font-black text-white md:text-slate-600 tracking-tight uppercase">ShwetVeer Vrish</span>
                          <span className="text-[9px] font-bold text-sky-400/60 md:hidden uppercase tracking-widest">Verified Developer</span>
                        </div>
                      </div>

                      <div className="relative w-full aspect-square max-w-[280px] md:w-80 md:h-80 group/qr">
                        {/* Holographic Glow for Mobile */}
                        <div className="absolute inset-0 bg-sky-400/20 md:hidden blur-2xl rounded-full opacity-50 group-hover/qr:opacity-80 transition-opacity" />
                        <div className="relative bg-white p-6 rounded-[2.5rem] md:rounded-[2.3rem] shadow-2xl">
                          <Image
                            src={g_pay_q_r}
                            alt="UPI QR Code"
                            width={400}
                            height={400}
                            className="w-full h-full object-contain mix-blend-multiply"
                            priority
                          />
                        </div>
                      </div>

                      <div className="mt-8 text-center space-y-4 md:space-y-6">
                        <div className="space-y-1">
                          <p className="text-[9px] md:text-[10px] font-black text-sky-400 md:text-slate-400 uppercase tracking-[0.2em]">
                            UPI ENDPOINT
                          </p>
                          <p className="text-[11px] md:text-xs font-mono font-bold text-white md:text-slate-500 break-all px-4">
                            sidhusamsk@oksbi
                          </p>
                        </div>
                        <p className="text-[10px] md:text-xs font-bold text-slate-400 tracking-tight flex items-center justify-center gap-2">
                          <Smartphone className="w-3 h-3 md:hidden" />
                          Scan with any UPI application
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

              </div>

              {/* Modal Footer Hardware Label */}
              <div className="absolute bottom-6 md:bottom-10 left-0 right-0 text-center z-20 hidden md:block">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
                  HARDWARE DETECTION: HIGH-RES TERMINAL REQUIRED
                </p>
              </div>

              {/* Mobile Pay Bar */}
              <div className="lg:hidden mt-8 md:mt-12 w-full sticky bottom-0 z-30 pt-4 bg-[#020817]/80 backdrop-blur-xl">
                <a
                  href={upiDeepLink}
                  className="flex items-center justify-center gap-3 w-full py-5 bg-gradient-to-r from-sky-400 to-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_-10px_30px_rgba(56,189,248,0.2)] active:scale-95 transition-all"
                >
                  <Zap className="w-4 h-4 fill-white" /> ENERGIZE NOW
                </a>
                <div className="py-4 text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                    LINK EXPIRES IN {secondsLeft}S
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main >
  )
}
