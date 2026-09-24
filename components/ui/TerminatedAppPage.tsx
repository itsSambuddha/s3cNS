'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HeartOff,
  Lock,
  Volume2,
  VolumeX,
  AlertTriangle,
  Flame,
  Activity,
  ZapOff,
  ShieldAlert,
  ServerOff,
  Droplets,
  Sparkles,
  RefreshCw,
} from 'lucide-react'

export function TerminatedAppPage() {
  const [attemptCount, setAttemptCount] = useState(0)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isPlayingSound, setIsPlayingSound] = useState(false)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscNodesRef = useRef<any[]>([])

  const quotes = [
    '"Nobody logged in. Nobody used the tools. Silence is all that remains."',
    '"Built with late nights and high hopes. Closed by ungrateful silence."',
    '"A platform without users is like a heart without a beat."',
    '"The servers have gone cold. The lights are off forever."',
  ]

  // Cycle mournful quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [quotes.length])

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  // Web Audio API ambient melancholic sound synth
  const toggleSound = () => {
    if (isPlayingSound) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
        audioCtxRef.current = null
      }
      setIsPlayingSound(false)
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        const ctx = new AudioContextClass()
        audioCtxRef.current = ctx

        // Create minor chord pad synth (A minor: A, C, E)
        const freqs = [110, 130.81, 164.81, 220]
        const masterGain = ctx.createGain()
        masterGain.gain.value = 0.05
        masterGain.connect(ctx.destination)

        freqs.forEach((freq) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, ctx.currentTime)

          const lfo = ctx.createOscillator()
          lfo.frequency.setValueAtTime(0.2, ctx.currentTime)
          const lfoGain = ctx.createGain()
          lfoGain.gain.setValueAtTime(1.5, ctx.currentTime)
          lfo.connect(lfoGain)
          lfoGain.connect(osc.frequency)
          lfo.start()

          gain.gain.setValueAtTime(0.01, ctx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.1, ctx.currentTime + 3)

          osc.connect(gain)
          gain.connect(masterGain)
          osc.start()
          oscNodesRef.current.push(osc)
        })

        setIsPlayingSound(true)
      } catch (err) {
        console.warn('Audio play failed:', err)
      }
    }
  }

  const handleAccessAttempt = () => {
    setAttemptCount((prev) => prev + 1)
    const formalToasts = [
      'Status 503: Service permanently decommissioned.',
      'Access Restricted: Platform operations have been terminated.',
      'Notice: The s3cNS application is no longer active.',
      '0 active instances remaining. Platform shut down.',
      'Service Offline: All user sessions are permanently closed.',
    ]
    const msg = formalToasts[(attemptCount + 1) % formalToasts.length]
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Teardrops particles falling down screen
  const teardrops = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    duration: Math.random() * 5 + 4,
    delay: Math.random() * 4,
    size: Math.random() * 6 + 3,
  }))

  return (
    <div className="fixed inset-0 z-[99999] bg-[#020617] text-slate-100 overflow-y-auto overflow-x-hidden flex flex-col items-center justify-between font-sans selection:bg-rose-500/20 selection:text-rose-300">
      {/* Background Ambient Aura & Falling Teardrop Rain */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[25%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-to-b from-rose-950/30 via-red-950/15 to-transparent rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-[35%] -left-[15%] w-[600px] h-[600px] bg-red-950/20 rounded-full blur-[160px]" />
        <div className="absolute -bottom-[20%] right-1/2 translate-x-1/2 w-[800px] h-[800px] bg-slate-950 rounded-full blur-[140px]" />

        {/* Animated Teardrops Dripping Down */}
        {teardrops.map((td) => (
          <motion.div
            key={td.id}
            initial={{ y: '-10%', opacity: 0 }}
            animate={{
              y: '105vh',
              opacity: [0, 0.8, 1, 0.4, 0],
            }}
            transition={{
              duration: td.duration,
              repeat: Infinity,
              delay: td.delay,
              ease: 'linear',
            }}
            style={{
              left: td.left,
              width: td.size,
              height: td.size * 2.2,
            }}
            className="absolute rounded-t-full rounded-b-[60%] bg-gradient-to-b from-rose-400/80 via-red-500/60 to-transparent blur-[0.4px] shadow-lg shadow-rose-500/30"
          />
        ))}

        {/* Animated Water Ripple Rings at Bottom */}
        {[15, 45, 75].map((pos, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0.2, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: idx * 1.3,
              ease: 'easeOut',
            }}
            style={{ left: `${pos}%` }}
            className="absolute bottom-4 w-16 h-4 rounded-full border border-rose-500/40 bg-rose-500/5 blur-[1px]"
          />
        ))}
      </div>

      {/* Top Header Bar */}
      <header className="w-full max-w-6xl px-6 py-5 flex items-center justify-between z-10 border-b border-rose-950/40 bg-slate-950/60 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-950/50 border border-rose-900/50 text-rose-500 shadow-lg shadow-rose-950/40">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-xs md:text-sm tracking-wider text-rose-200 uppercase font-mono">
              s3cNS Platform Status
            </span>
            <span className="flex items-center gap-1.5 text-xs text-rose-400/90 font-mono mt-0.5">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
              STATUS: PERMANENTLY DECOMMISSIONED
            </span>
          </div>
        </div>

        <button
          onClick={toggleSound}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-rose-300 hover:border-rose-900/60 transition-all shadow-xl"
        >
          {isPlayingSound ? (
            <>
              <Volume2 className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Ambient Sound (ON)</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-500" />
              <span>Listen to Silence</span>
            </>
          )}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-3xl px-6 py-12 flex flex-col items-center text-center z-10 my-auto">
        {/* Animated Crying / Weeping Character SVG Centerpiece */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, y: [0, -6, 0, 6, 0] }}
          transition={{
            scale: { duration: 0.8 },
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="relative mb-8 group cursor-pointer"
          onClick={handleAccessAttempt}
        >
          <div className="absolute inset-0 rounded-full bg-rose-600/30 blur-3xl animate-pulse" />

          <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-b from-rose-950/90 via-slate-950 to-[#020617] border border-rose-900/70 flex items-center justify-center shadow-2xl shadow-rose-950/70 overflow-hidden">
            {/* Animated SVG Sad / Weeping Face */}
            <svg className="w-20 h-20 text-rose-400" viewBox="0 0 100 100" fill="none">
              {/* Sad Eyelids (Closed crying eyes) */}
              <path d="M 28 42 Q 38 34 48 42" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M 52 42 Q 62 34 72 42" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />

              {/* Animated Teardrop Left */}
              <motion.path
                d="M 33 46 Q 30 58 33 66 Q 36 74 33 78 C 30 78 28 66 33 46 Z"
                fill="#f43f5e"
                opacity="0.9"
                animate={{ y: [0, 18, 28], opacity: [1, 0.8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeIn' }}
              />

              {/* Animated Teardrop Right */}
              <motion.path
                d="M 67 46 Q 64 58 67 66 Q 70 74 67 78 C 64 78 62 66 67 46 Z"
                fill="#f43f5e"
                opacity="0.9"
                animate={{ y: [0, 18, 28], opacity: [1, 0.8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 0.6, ease: 'easeIn' }}
              />

              {/* Trembling Sad Mouth */}
              <motion.path
                d="M 36 72 Q 50 62 64 72"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ d: ['M 36 72 Q 50 62 64 72', 'M 36 74 Q 50 64 64 74', 'M 36 72 Q 50 62 64 72'] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />

              {/* Heart Off Overlay */}
              <path d="M 50 22 L 50 28" stroke="#fb7185" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>

          <div className="absolute -bottom-2 -right-2 p-2 bg-slate-950 border border-rose-900/70 rounded-full text-rose-400 shadow-xl flex items-center justify-center">
            <Droplets className="w-4 h-4 text-rose-400 animate-bounce" />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight"
        >
          This App Has Been{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-red-400 to-rose-700">
            Permanently Decommissioned
          </span>
        </motion.h1>

        {/* Animated Cycling Mournful Quote */}
        <div className="h-10 mb-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={quoteIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-rose-300/90 text-sm md:text-base font-mono max-w-xl italic"
            >
              {quotes[quoteIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* The Formal Decommission Statement Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full bg-slate-900/60 border border-rose-900/30 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl text-left relative overflow-hidden mb-8"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400/90 mb-4 pb-3 border-b border-rose-900/30">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span>OFFICIAL DECOMMISSION STATEMENT</span>
          </div>

          <div className="space-y-4 text-sm md:text-base text-slate-300 leading-relaxed font-light">
            <p>
              Significant development effort, architectural engineering, and dedicated resources were invested into designing, building, and deploying <span className="font-mono text-rose-200">s3cNS</span> for the Secretariat. Automated attendance, digital resource vaults, and executive tools were crafted to streamline operations.
            </p>

            <p>
              Following deployment, continuous monitoring of platform analytics reflected <strong className="text-rose-300 font-semibold">zero active user engagement and zero platform interactions</strong> over an extended observation period.
            </p>

            <p className="italic text-slate-400 bg-slate-950/70 p-4 rounded-xl border border-rose-950/60 font-mono text-xs md:text-sm">
              "A platform created to empower a community relies on active engagement. In its absence, maintaining active infrastructure serves no further purpose."
            </p>

            <p>
              Accordingly, <strong className="text-rose-400">all s3cNS services and platform operations have been permanently terminated</strong>. No further features will be introduced, and access portals have been decommissioned. Gratitude is expressed to everyone involved during its development.
            </p>
          </div>
        </motion.div>

        {/* Animated Flatline ECG Vital Signs Indicator */}
        <div className="w-full bg-slate-950/80 border border-rose-950/60 rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-rose-600 animate-pulse" />
            <span className="text-xs font-mono text-slate-400">
              VITAL SIGNALS: <span className="text-rose-500 font-bold">FLATLINE (0 BPM)</span>
            </span>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">ACTIVE USERS</span>
              <span className="text-rose-400 font-bold text-sm">0 / 0</span>
            </div>
            <div className="h-6 w-[1px] bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[10px]">USAGE RATE</span>
              <span className="text-rose-400 font-bold text-sm">0.00%</span>
            </div>
            <div className="h-6 w-[1px] bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[10px]">SERVER STATE</span>
              <span className="text-rose-400 font-bold text-sm">OFFLINE</span>
            </div>
          </div>
        </div>

        {/* Timeline of Service Lifecycle */}
        <div className="w-full mb-10 text-left">
          <h3 className="text-xs font-mono text-rose-400/80 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500" /> Service Lifecycle Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              { title: '1. Engineering', desc: 'Architecture & tooling built', color: 'border-slate-800 text-slate-400 bg-slate-950/40' },
              { title: '2. Deployment', desc: 'Opened for Secretariat', color: 'border-slate-800 text-slate-400 bg-slate-950/40' },
              { title: '3. Observation', desc: 'Zero active usage recorded', color: 'border-rose-950/80 text-rose-400/80 bg-rose-950/20' },
              { title: '4. Decommission', desc: 'Permanent termination', color: 'border-rose-800 bg-rose-950/40 text-rose-300 font-semibold' },
            ].map((step, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${step.color} text-xs shadow-lg`}>
                <div className="font-bold mb-1 font-mono">{step.title}</div>
                <div className="text-[11px] opacity-80 leading-normal">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Lock Button */}
        <motion.div className="flex flex-col items-center gap-3">
          <button
            onClick={handleAccessAttempt}
            className="group relative px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 border border-rose-900/60 text-rose-200 text-xs md:text-sm font-mono font-semibold hover:border-rose-500 hover:text-white transition-all shadow-xl active:scale-95 flex items-center gap-2 overflow-hidden"
          >
            <Lock className="w-4 h-4 text-rose-500 group-hover:rotate-12 transition-transform" />
            <span>Attempt Access</span>
          </button>

          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="px-4 py-2 rounded-xl bg-rose-950/90 border border-rose-700/80 text-rose-100 text-xs font-mono shadow-2xl flex items-center gap-2"
              >
                <ServerOff className="w-4 h-4 text-rose-300" />
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center z-10 border-t border-rose-950/30 bg-slate-950/80 backdrop-blur-md">
        <p className="text-xs text-slate-500 font-mono">
          s3cNS Platform • Status: Permanently Decommissioned • All Operations Ceased
        </p>
      </footer>
    </div>
  )
}
