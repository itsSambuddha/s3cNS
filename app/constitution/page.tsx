// app/constitution/page.tsx
"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { MandateContent } from "./MandateContent"
import { ConstitutionContent } from "./ConstitutionContent"
import Sidebar from "@/components/layout/Sidebar"
import Navbar from "@/components/layout/Navbar"
import MobileNav from "@/components/layout/MobileNav"

type TabKey = "mandate" | "constitution"

const NAV_ITEMS: { id: string; label: string; group: TabKey }[] = [
  // Mandate
  { id: "mandate-overview", label: "Mandate overview", group: "mandate" },
  { id: "mandate-structure", label: "Secretariat structure", group: "mandate" },
  {
    id: "mandate-departments",
    label: "Departments in brief",
    group: "mandate",
  },
  { id: "mandate-playbook", label: "Conference playbook", group: "mandate" },
  // Constitution
  { id: "const-preamble", label: "Preamble", group: "constitution" },
  { id: "const-1", label: "Art. 1 – Name & purpose", group: "constitution" },
  { id: "const-2", label: "Art. 2 – Membership", group: "constitution" },
  { id: "const-3", label: "Art. 3 – Structure", group: "constitution" },
  {
    id: "const-4",
    label: "Art. 4–6 – Roles & tenure",
    group: "constitution",
  },
  {
    id: "const-5",
    label: "Art. 7–10 – Operations",
    group: "constitution",
  },
  {
    id: "const-6",
    label: "Art. 11–13 – Conduct & dissolution",
    group: "constitution",
  },
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

          <div className="mx-auto w-full max-w-6xl relative px-4 pt-10 lg:px-6">
            <section className="mb-16 text-center space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-700">
                Institutional Memory
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl dark:text-white leading-[1.1]">
                Mandate & <br className="sm:hidden" /> Constitution
              </h1>
              <p className="mx-auto max-w-2xl text-lg font-medium text-slate-500 leading-relaxed dark:text-zinc-400">
                A single, navigable space for how SECMUN is structured, how
                conferences run, and the Articles that formally govern every role and
                decision.
              </p>
            </section>

            {/* Layout: left nav + right content */}
            <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,2fr)]">
              {/* Sidebar */}
              <aside className="self-start space-y-4 lg:sticky lg:top-20">
                {/* Tab switch */}
                <div className="rounded-3xl border border-blue-200/60 bg-white/80 p-2 text-xs backdrop-blur shadow-xl shadow-blue-500/5 dark:bg-zinc-900/90">
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab("mandate")}
                      className={`rounded-2xl px-3 py-2.5 font-black uppercase tracking-wider transition-all duration-300 ${activeTab === "mandate"
                          ? "bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900"
                          : "text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                        }`}
                    >
                      Mandate
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("constitution")}
                      className={`rounded-2xl px-3 py-2.5 font-black uppercase tracking-wider transition-all duration-300 ${activeTab === "constitution"
                          ? "bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900"
                          : "text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                        }`}
                    >
                      Articles
                    </button>
                  </div>
                </div>

                {/* Outline */}
                <div className="rounded-3xl border border-blue-200/60 bg-white/90 p-6 text-xs shadow-xl shadow-blue-500/5 backdrop-blur dark:bg-zinc-900/90">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Outline · {activeTab}
                  </p>
                  <ul className="mt-6 space-y-2">
                    {NAV_ITEMS.filter((i) => i.group === activeTab).map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => scrollTo(item.id)}
                          className="w-full rounded-xl px-3 py-2 text-left text-[12px] font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Email + help */}
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-4 text-xs shadow-sm backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Get the Constitution by email
                  </p>
                  <form onSubmit={handleSend} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="h-8 flex-1 rounded-full border border-slate-200 px-3 text-[11px] text-slate-800 outline-none ring-blue-200 placeholder:text-slate-400 focus:ring-2"
                      />
                      <button
                        type="submit"
                        disabled={sending}
                        className="inline-flex h-8 items-center justify-center rounded-full bg-slate-900 px-3 text-[11px] font-semibold text-white disabled:opacity-60"
                      >
                        {sending ? "Sending…" : "Send"}
                      </button>
                    </div>
                    {sent === "ok" && (
                      <p className="text-[11px] text-emerald-600">Sent to {email}.</p>
                    )}
                    {sent === "error" && (
                      <p className="text-[11px] text-red-600">
                        Could not send. Try again later.
                      </p>
                    )}
                  </form>

                  <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-blue-50 px-3 py-2 text-[11px] text-blue-800">
                    <span>wanna know how s3cNS helps your work get easier?</span>
                    <a
                      href="/help"
                      className="rounded-full bg-blue-700 px-3 py-1 text-[11px] font-semibold text-white"
                    >
                      Click here
                    </a>
                  </div>
                </div>

                {/* Appendix PDF – mini A4 card + fullscreen on click */}
                <button
                  type="button"
                  onClick={() => setShowAppendixFull(true)}
                  className="w-full rounded-2xl border border-slate-200 bg-white/95 p-3 text-xs shadow-sm backdrop-blur text-left hover:border-blue-300 hover:shadow-md transition"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Appendix
                  </p>
                  <p className="mt-1 text-[12px] font-semibold text-slate-900">
                    Constitution Appendix (PDF)
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Click to view the full appendix.
                  </p>

                  {/* Mini A4-style dummy preview */}
                  <div className="mt-2 flex justify-center">
                    <div className="relative h-40 w-28 overflow-hidden rounded-[6px] border border-slate-200 bg-slate-50 shadow-sm">
                      <div className="absolute inset-0 flex flex-col">
                        <div className="h-4 bg-slate-200/80" />
                        <div className="mt-2 space-y-1 px-2">
                          <div className="h-1.5 rounded bg-slate-200" />
                          <div className="h-1.5 w-5/6 rounded bg-slate-200" />
                          <div className="h-1.5 w-4/6 rounded bg-slate-200" />
                          <div className="h-1.5 w-2/3 rounded bg-slate-200" />
                        </div>
                      </div>
                      <div className="pointer-events-none absolute inset-0 rounded-[6px] ring-1 ring-slate-900/5" />
                    </div>
                  </div>
                </button>
              </aside>

              {/* Main content – tabs render different components */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 18,
                }}
                className="space-y-8"
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
