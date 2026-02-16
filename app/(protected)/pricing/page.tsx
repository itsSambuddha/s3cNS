// app/(protected)/pricing/page.tsx
"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import Image from "next/image"
import { Check, Coffee, Zap, CreditCard, ChevronRight, Sparkles, X } from "lucide-react"
import g_pay_q_r from ".//(support)/_assest//g_pay_q_r.png"
import { Button } from "@/components/ui/button"

export default function PricingPage() {
  const [qrOpen, setQrOpen] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(30)

  useEffect(() => {
    if (!qrOpen) return

    setSecondsLeft(30)
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
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
    <main className="relative min-h-screen bg-background px-4 py-8 overflow-hidden">
      {/* Atmosphere Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute right-[-10%] top-[35%] h-[600px] w-[600px] rounded-full bg-slate-100/40 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3EaseFilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/baseFilter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      <div className="mx-auto max-w-7xl space-y-16">
        <header className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
                Access & Support
              </div>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-6xl">
              Free for Members. <br />
              <span className="text-blue-600">Built for Excellence.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base font-medium text-slate-500 dark:text-zinc-400">
              s3cNS is proprietary software provided free to the SECMUN Secretariat.
              Help sustain development by buying me a <span className="font-black text-slate-900 dark:text-white">White Monster</span>.
            </p>
          </motion.div>
        </header>

        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {/* Free Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group relative overflow-hidden rounded-[2.5rem] border border-blue-100 bg-white p-10 shadow-xl shadow-blue-500/5 dark:border-white/5 dark:bg-[#030712]/40"
          >
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-white/5">
                  <Zap className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Secretariat</h2>
                <p className="text-sm font-medium text-slate-500">Full platform access for active members.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">₹0</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">/ academic year</span>
              </div>

              <ul className="space-y-4">
                {[
                  "Unlimited conference management",
                  "Advanced Finance workspace",
                  "Automated Comms rail (WhatsApp/Email)",
                  "Institutional Archive & Library",
                  "Biometric & Secure Auth suite"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-zinc-400">
                    <Check className="w-4 h-4 text-blue-600" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button className="w-full rounded-full bg-slate-900 dark:bg-white dark:text-black py-7 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-slate-500/10">
                Active Member Access <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          {/* Support Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group relative overflow-hidden rounded-[2.5rem] border border-blue-600/20 bg-blue-600/5 p-10 shadow-2xl shadow-blue-500/10 dark:border-blue-500/10 dark:bg-blue-600/5"
          >
            <div className="absolute top-0 right-0 p-4">
              <div className="rounded-full bg-blue-600 px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em] text-white">
                Optional Support
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                  <Coffee className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Tip Jar</h2>
                <p className="text-sm font-medium text-slate-500">Fuel the development of future modules.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">Custom</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">/ your kindness</span>
              </div>

              <ul className="space-y-4">
                {[
                  "Everything in Secretariat plan",
                  "Priority support for your team",
                  "Direct input on roadmap",
                  "Custom module requests",
                  "Legend status in changelogs"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-zinc-400">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button onClick={() => setQrOpen(true)} className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white py-7 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-blue-600/20">
                Support Development <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {qrOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-blue-200/60 bg-white p-8 shadow-2xl dark:border-white/5 dark:bg-zinc-900"
            >
              <button
                onClick={() => setQrOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-8 pt-4">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-700">
                    UPI Payment
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Scan to support</h3>
                  <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Auto-closing in <span className="text-blue-600">{secondsLeft}s</span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="relative p-6 rounded-[2rem] border-2 border-dashed border-blue-200 bg-slate-50 dark:border-white/10 dark:bg-black/20">
                    <Image
                      src={g_pay_q_r}
                      alt="UPI QR Code"
                      width={280}
                      height={280}
                      className="rounded-xl grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                </div>

                <p className="text-center text-[11px] font-medium text-slate-400">
                  Scan with GPay, PhonePe, or any UPI app. <br />
                  Data privacy is guaranteed.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}
