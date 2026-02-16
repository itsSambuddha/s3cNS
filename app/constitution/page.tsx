// app/constitution/page.tsx
"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { MandateContent } from "./MandateContent"
import { ConstitutionContent } from "./ConstitutionContent"
import Sidebar from "@/components/layout/Sidebar"
import Navbar from "@/components/layout/Navbar"
import MobileNav from "@/components/layout/MobileNav"
import { Sparkles, FileText, X } from "lucide-react"

type TabKey = "mandate" | "constitution"

const NAV_ITEMS: { id: string; label: string; group: TabKey }[] = [
  // Mandate
  { id: "mandate-overview", label: "Secretariat Nucleus", group: "mandate" },
  { id: "mandate-structure", label: "Leadership Command", group: "mandate" },
  { id: "mandate-departments", label: "Operational Offices", group: "mandate" },
  { id: "mandate-junior-secretariat", label: "Junior Secretariat", group: "mandate" },
  { id: "mandate-tenure", label: "Tenure & Protocols", group: "mandate" },
  { id: "mandate-eb", label: "Executive Board", group: "mandate" },
  { id: "mandate-playbook", label: "Operational Blueprint", group: "mandate" },
  // Constitution
  { id: "const-preamble", label: "Formal Preamble", group: "constitution" },
  { id: "const-1", label: "Art. 01 – Name & Purpose", group: "constitution" },
  { id: "const-2", label: "Art. 02 – Membership", group: "constitution" },
  { id: "const-3", label: "Art. 03 – Structure", group: "constitution" },
  { id: "const-4", label: "Art. 04 – Roles & Hierarchy", group: "constitution" },
  { id: "const-6", label: "Art. 06 – Selection", group: "constitution" },
  { id: "const-7", label: "Art. 07 – Operations", group: "constitution" },
  { id: "const-10", label: "Art. 10 – Ethics", group: "constitution" },
  { id: "const-12", label: "Art. 12 – Certification", group: "constitution" },
]

export default function ConstitutionPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("mandate")
  const [email, setEmail] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState<"idle" | "ok" | "error">("idle")
  const [showAppendixFull, setShowAppendixFull] = useState(false)

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 96,
      behavior: "smooth",
    })
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || sending) return
    setSending(true)
    setSent("idle")
    try {
      const res = await fetch("/api/constitution/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      setSent(res.ok ? "ok" : "error")
    } catch {
      setSent("error")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="relative flex-1 px-3 pt-4 pb-0 sm:px-6 sm:pt-6 sm:pb-0 overflow-hidden">
          {/* soft background gradient */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-[-15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[120px]" />
            <div className="absolute right-[-10%] top-[35%] h-[600px] w-[600px] rounded-full bg-sky-100/40 blur-[140px]" />
            <div className="absolute bottom-0 left-[20%] h-[400px] w-[400px] rounded-full bg-indigo-100/30 blur-[100px]" />
            {/* Grainy Texture */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3BaseFilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/baseFilter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
          </div>

          <div className="mx-auto w-full max-w-7xl relative px-4 pt-16 lg:px-6">
            <section className="mb-20 text-center space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 dark:bg-blue-500/10 dark:border-blue-500/20">
                Official Institutional Ledger
              </div>
              <h1 className="text-6xl font-black tracking-tighter text-slate-950 sm:text-9xl dark:text-white leading-[0.85]">
                Mandate & <br /> <span className="text-blue-600">Constitution.</span>
              </h1>
              <p className="mx-auto max-w-2xl text-xl font-medium text-slate-500 leading-relaxed dark:text-zinc-400">
                The supreme governing framework of the SECMUN Secretariat. <br className="hidden md:block" />
                A single point of truth for protocol, structure, and institutional ethics.
              </p>
            </section>

            {/* Layout: left nav + right content */}
            <section className="grid gap-16 lg:grid-cols-[320px,1fr]">
              {/* Sidebar */}
              <aside className="self-start space-y-8 lg:sticky lg:top-24">
                {/* Tab switch */}
                <div className="rounded-[2.5rem] border border-blue-200/60 bg-white/80 p-2 backdrop-blur-3xl shadow-2xl shadow-blue-500/10 dark:bg-zinc-900/90 dark:border-white/5 transition-all hover:bg-white">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab("mandate")}
                      className={`rounded-[2rem] px-3 py-3 font-black text-[11px] uppercase tracking-widest transition-all duration-700 ${activeTab === "mandate"
                        ? "bg-blue-600 text-white shadow-2xl shadow-blue-600/30 ring-4 ring-blue-600/10"
                        : "text-slate-400 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-white"
                        }`}
                    >
                      Mandate
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("constitution")}
                      className={`rounded-[2rem] px-3 py-3 font-black text-[11px] uppercase tracking-widest transition-all duration-700 ${activeTab === "constitution"
                        ? "bg-blue-600 text-white shadow-2xl shadow-blue-600/30 ring-4 ring-blue-600/10"
                        : "text-slate-400 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-white"
                        }`}
                    >
                      Articles
                    </button>
                  </div>
                </div>

                {/* Outline */}
                <div className="rounded-[3rem] border border-blue-200/60 bg-white/80 p-10 shadow-2xl shadow-blue-500/[0.03] backdrop-blur-3xl dark:bg-zinc-900/90 dark:border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-10 font-mono">
                    Navigation Index
                  </p>
                  <ul className="space-y-1">
                    {NAV_ITEMS.filter((i) => i.group === activeTab).map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => scrollTo(item.id)}
                          className="w-full group flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all duration-300 hover:bg-blue-50 dark:hover:bg-white/5"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-200 transition-colors group-hover:bg-blue-600" />
                          <span className="text-[13px] font-bold text-slate-600 group-hover:text-slate-950 dark:text-zinc-400 dark:group-hover:text-white">
                            {item.label}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Email + help */}
                <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/90 p-8 shadow-sm backdrop-blur-2xl dark:bg-zinc-900/40 dark:border-white/5">
                  <div className="absolute -right-4 -top-4 opacity-[0.05]">
                    <Sparkles className="w-24 h-24 text-blue-600" />
                  </div>
                  <p className="relative z-10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 font-mono">
                    Dispatch Copy
                  </p>
                  <form onSubmit={handleSend} className="relative z-10 space-y-4">
                    <div className="space-y-2">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="officer.email@secmun.org"
                        className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 text-xs text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:bg-black/20 dark:border-white/10 dark:text-white"
                      />
                      <button
                        type="submit"
                        disabled={sending}
                        className="w-full h-12 flex items-center justify-center rounded-2xl bg-slate-950 px-4 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-blue-600 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-blue-600 dark:hover:text-white shadow-lg"
                      >
                        {sending ? "Dispatching..." : "Send to Inbox"}
                      </button>
                    </div>
                    {sent === "ok" && (
                      <p className="text-[10px] font-bold text-emerald-600 text-center uppercase tracking-wider">Transmission Successful</p>
                    )}
                    {sent === "error" && (
                      <p className="text-[10px] font-bold text-red-600 text-center uppercase tracking-wider">Transmission Interrupted</p>
                    )}
                  </form>
                </div>

                {/* Appendix PDF Card */}
                <button
                  type="button"
                  onClick={() => setShowAppendixFull(true)}
                  className="group relative w-full overflow-hidden rounded-[2.5rem] border border-blue-200/60 bg-white/95 p-8 text-left transition-all duration-500 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10 dark:bg-zinc-900/60 dark:border-white/5"
                >
                  <div className="absolute right-8 top-8 opacity-20 transition-transform duration-500 group-hover:scale-110">
                    <FileText className="w-10 h-10 text-blue-600" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                    Official Appendix
                  </p>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight mb-4">
                    Institutional <br /> Annexures
                  </h4>

                  <div className="mt-6 flex justify-center">
                    <div className="relative h-44 w-32 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 dark:border-white/10 dark:bg-black">
                      <div className="absolute top-0 left-0 h-4 w-full bg-slate-100 dark:bg-white/5" />
                      <div className="mt-8 space-y-2 px-3">
                        <div className="h-1.5 w-full rounded bg-slate-100 dark:bg-white/5" />
                        <div className="h-1.5 w-5/6 rounded bg-slate-100 dark:bg-white/5" />
                        <div className="h-1.5 w-4/6 rounded bg-slate-100 dark:bg-white/5" />
                        <div className="pt-2 h-1.5 w-full rounded bg-slate-100 dark:bg-white/5" />
                        <div className="h-1.5 w-2/3 rounded bg-slate-100 dark:bg-white/5" />
                      </div>
                      <div className="absolute bottom-4 left-3 right-3 h-1 w-full bg-blue-500/10" />
                    </div>
                  </div>
                </button>
              </aside>

              {/* Main content – tabs render different components */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-12"
              >
                {activeTab === "mandate" ? (
                  <MandateContent />
                ) : (
                  <ConstitutionContent />
                )}
              </motion.div>
            </section>
          </div>

          {/* Fullscreen Appendix overlay */}
          {showAppendixFull && (
            <>
              <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
              <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95">
                <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                      Appendix
                    </p>
                    <p className="text-sm font-semibold text-slate-50">
                      Constitution Appendix (PDF)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAppendixFull(false)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-500 bg-slate-900 text-slate-100 text-sm hover:bg-slate-800"
                    aria-label="Close appendix"
                  >
                    ×
                  </button>
                </div>
                <div className="flex-1 px-2 pb-4 pt-1 sm:px-4 sm:pb-6">
                  <div className="h-full w-full overflow-hidden rounded-xl border border-slate-700 bg-black">
                    <object
                      data="/Constitution/Appendix.pdf"
                      type="application/pdf"
                      className="h-full w-full"
                    >
                      <div className="flex h-full items-center justify-center p-4">
                        <p className="text-xs text-slate-200 text-center">
                          Your browser cannot display embedded PDFs.{" "}
                          <a
                            href="/Constitution/Appendix.pdf"
                            className="text-blue-300 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open the appendix in a new tab
                          </a>
                          .
                        </p>
                      </div>
                    </object>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
