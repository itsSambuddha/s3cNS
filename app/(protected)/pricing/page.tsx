// app/pricing/page.tsx
"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import Image from "next/image"
import g_pay_q_r from ".//(support)/_assest//g_pay_q_r.png"

export default function PricingPage() {
  const [qrOpen, setQrOpen] = useState(false)
    const [secondsLeft, setSecondsLeft] = useState(3)

  // auto‑close after 3 seconds when opened
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
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, type: "spring", stiffness: 170, damping: 22 }}
          className="space-y-3 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-400">
            Pricing
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">
            s3cNS is free to use for our Members.
          </h1>
          <p className="text-2xl md:text-3xl text-slate-100">
            However, if you like it and find it helpful, you can buy me .
          </p>
          <p className="text-2xl md:text-3xl text-slate-100, font-sans-serif, font-bold">
             WHITE MONSTER

          </p>
          <p className="mx-auto max-w-2xl text-sm text-slate-400 md:text-base">
            BTW this is a simple free plan for the Secretariat, plus an optional tip jar for
            ongoing development.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Free card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="flex flex-col rounded-3xl border border-white/5 bg-[#020617] p-6 shadow-[0_26px_70px_rgba(15,23,42,0.75)]"
          >
            <p className="text-sm font-semibold text-sky-400">
              Secretariat workspace
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-white">Free</h2>
            <p className="mt-1 text-sm text-slate-300">
              All the core tools the SEC‑MUN Secretariat needs to run conferences.
            </p>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-semibold text-white">₹0</span>
              <span className="text-xs text-slate-400">per academic year</span>
            </div>

            <ul className="mt-4 space-y-2 text-sm text-slate-100">
              <li className="flex items-start gap-2">
                <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>Unlimited conferences per academic year</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>Finance workspace &amp; basic reporting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>Comms rail: email + WhatsApp + in‑app alerts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>Archives &amp; inventory for handovers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>Access for current Secretariat only</span>
              </li>
            </ul>

            <button
              type="button"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-white/95 px-5 text-sm font-semibold text-slate-900 hover:bg-white"
            >
              Continue Free (Obv)
            </button>
          </motion.div>

          {/* Support card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative flex flex-col rounded-3xl border border-sky-500/50 bg-gradient-to-b from-[#020617] via-[#020617] to-[#020617] p-6 shadow-[0_40px_110px_rgba(56,189,248,0.45)]"
          >
            <span className="absolute -top-3 right-5 rounded-full bg-sky-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-950">
              Optional support
            </span>

            <p className="text-sm font-semibold text-sky-400">
              Support the platform
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-white">
              Pay whatever you like
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              If s3cNS saves your Secretariat time and chaos, you can buy the developer a
              coffee so the platform keeps improving.
            </p>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-semibold text-white">₹ </span>
              <span className="text-xs text-slate-400">per your kindness</span>
            </div>

            <ul className="mt-4 space-y-2 text-sm text-slate-100">
              <li className="flex items-start gap-2">
                <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>Everything in Free</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>Priority bug fixes for your Secretariat</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>Input on roadmap &amp; new modules</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>Your name in the changelog credits</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={() => setQrOpen(true)}
              className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-sky-500 px-5 text-sm font-semibold text-slate-950 hover:bg-sky-400"
            >
              Show UPI QR
            </button>
          </motion.div>
        </div>
      </div>

      {/* QR Popup (only controlled by qrOpen) */}
       {qrOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-xl rounded-3xl border border-slate-700 bg-[#020617] p-6 text-center shadow-[0_40px_140px_rgba(15,23,42,0.95)]"
          >
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-medium text-sky-400">UPI payment QR</span>
              <span>
                Auto‑closing in{" "}
                <span className="font-semibold text-sky-300">
                  {secondsLeft}s
                </span>
              </span>
            </div>

            <div className="mt-4 flex justify-center">
              <div className="rounded-3xl border border-slate-700 bg-slate-900 p-5">
                <Image
                  src={g_pay_q_r}
                  alt="GPay UPI QR Code"
                  width={320}
                  height={320}
                  className="h-100 w-100 object-contain"
                />
              </div>
            </div>

            <p className="mt-4 text-[11px] text-slate-400">
              Scan with Google Pay or any UPI app. This window will close
              automatically for privacy.
            </p>
          </motion.div>
        </div>
      )}
    </main>
  )
}
