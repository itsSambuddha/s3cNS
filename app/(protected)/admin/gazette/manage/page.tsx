// app/admin/gazette/manage/page.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
  ArrowDownToLine,
  FileText,
  Trash2,
  Pencil,
  Newspaper,
} from "lucide-react"
import type { GazetteIssue } from "@/lib/gazette"

type GazetteIssueWithFile = GazetteIssue & {
  fileName: string
}

export default function GazetteManagePage() {
  const [issues, setIssues] = useState<GazetteIssueWithFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingIssue, setEditingIssue] = useState<GazetteIssueWithFile | null>(
    null,
  )

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/gazette/list", { cache: "no-store" })
        if (!res.ok) {
          const text = await res.text()
          console.error("gazette list error", res.status, text)
          setError("Failed to load Gazette issues.")
          setIssues([])
          return
        }
        const data = await res.json()
        setIssues(data.issues ?? [])
      } catch (e) {
        console.error("gazette list error", e)
        setError("Failed to load Gazette issues.")
        setIssues([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const latest = issues.find((i) => i.isLatest)
  const archive = issues.filter((i) => !i.isLatest)

  const handleDelete = async (fileName: string) => {
    if (
      !window.confirm(
        `Delete ${fileName}? This removes the PDF from /public/gazette.`,
      )
    ) {
      return
    }

    try {
      const res = await fetch("/api/admin/gazette/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName }),
      })
      if (!res.ok) {
        const text = await res.text()
        console.error("delete gazette error", res.status, text)
        alert("Failed to delete file. Check console for details.")
        return
      }
      setIssues((prev) => prev.filter((i) => i.fileName !== fileName))
    } catch (e) {
      console.error("delete gazette exception", e)
      alert("Unexpected error while deleting.")
    }
  }

  const openMetadataHint = (issue: GazetteIssueWithFile) => {
    setEditingIssue(issue)
  }

  return (
    <main className="relative flex-1 overflow-hidden px-3 pt-4 pb-0 sm:px-6 sm:pt-6 sm:pb-0">
      {/* background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-15%] top-[-10%] h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute right-[-10%] top-[35%] h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-[20%] h-52 w-52 rounded-full bg-indigo-200/25 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-10 lg:px-6">
        {/* Header */}
        <section className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-600">
              <Newspaper className="h-3 w-3" />
              <span>SECMUN Gazette · Admin</span>
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
              Manage Gazette issues
            </h1>
            <p className="mt-2 max-w-xl text-xs text-slate-600">
              This view mirrors the public Gazette but lets you delete PDFs and
              see how to adjust metadata in <code>lib/gazette.ts</code>.
            </p>
          </div>
          <Link
            href="/gazette"
            className="text-[11px] font-medium text-slate-600 underline-offset-4 hover:underline"
          >
            View public Gazette
          </Link>
        </section>

        {loading && (
          <p className="text-xs text-slate-500">Loading issues…</p>
        )}
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}

        {!loading && !error && issues.length === 0 && (
          <p className="text-xs text-slate-500">
            No Gazette issues found. Upload a PDF from the admin page first.
          </p>
        )}

        {!loading && !error && issues.length > 0 && (
          <section className="space-y-8 pb-10">
            {/* Latest issue admin card */}
            {latest && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur"
              >
                <div className="border-b border-slate-100 px-5 pb-3 pt-4 sm:px-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600">
                      Featured issue
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span>{latest.date}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>{latest.readingTime} read</span>
                    </div>
                  </div>
                  <h2 className="mt-2 text-lg font-semibold text-slate-900 sm:text-xl">
                    {latest.title}
                  </h2>
                  <p className="mt-1 text-[13px] text-slate-700">
                    {latest.subtitle}
                  </p>
                  <p className="mt-2 text-[12px] text-slate-500">
                    {latest.theme}
                  </p>
                </div>

                <div className="flex flex-col items-start justify-between gap-4 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
                  <div className="flex gap-3">
                    <Link
                      href={latest.filePath}
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>Open PDF</span>
                    </Link>
                    <a
                      href={latest.filePath}
                      download
                      className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-medium text-slate-800 hover:border-slate-400"
                    >
                      <ArrowDownToLine className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openMetadataHint(latest)}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-medium text-slate-800 hover:border-slate-400"
                    >
                      <Pencil className="h-3 w-3" />
                      <span>View metadata hint</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(latest.filePath.split("/").pop() || "")
                      }
                      className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-medium text-rose-700 hover:border-rose-300"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete PDF</span>
                    </button>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Archive heading */}
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900">
                All issues
              </h3>
              <p className="text-[11px] text-slate-500">
                Admin view: you can open, download, view metadata hints, or delete.
              </p>
            </div>

            {/* Archive list */}
            {archive.length === 0 ? (
              <p className="text-sm text-slate-500">
                Only one issue exists; upload more to build an archive.
              </p>
            ) : (
              <div className="space-y-3">
                {archive.map((issue, index) => (
                  <motion.article
                    key={issue.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: index * 0.04,
                    }}
                    whileHover={{ y: -2 }}
                    className="group flex items-stretch justify-between gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 text-xs shadow-sm"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span className="uppercase tracking-[0.18em] text-slate-400">
                          {issue.date}
                        </span>
                        <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-block" />
                        <span className="text-slate-500">
                          {issue.readingTime} read
                        </span>
                      </div>
                      <h4 className="mt-1 text-sm font-semibold text-slate-900">
                        {issue.title}
                      </h4>
                      <p className="mt-1 text-[12px] text-slate-700">
                        {issue.subtitle}
                      </p>
                      <p className="mt-2 text-[11px] text-slate-500">
                        {issue.theme}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between gap-2 sm:w-52">
                      <div className="flex w-full gap-2">
                        <Link
                          href={issue.filePath}
                          target="_blank"
                          className="relative inline-flex w-full items-center justify-center gap-1 rounded-full bg-slate-900/95 px-3 py-1 text-[11px] font-semibold text-slate-50"
                        >
                          <FileText className="h-3 w-3" />
                          <span className="relative">Read</span>
                        </Link>
                        <a
                          href={issue.filePath}
                          download
                          className="inline-flex w-full items-center justify-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-medium text-slate-800 hover:border-slate-400"
                        >
                          <ArrowDownToLine className="h-3 w-3" />
                          <span>Download</span>
                        </a>
                      </div>
                      <div className="flex w-full gap-2">
                        <button
                          type="button"
                          onClick={() => openMetadataHint(issue)}
                          className="inline-flex w-full items-center justify-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-medium text-slate-800 hover:border-slate-400"
                        >
                          <Pencil className="h-3 w-3" />
                          <span>Metadata</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(issue.filePath.split("/").pop() || "")
                          }
                          className="inline-flex w-full items-center justify-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-medium text-rose-700 hover:border-rose-300"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Metadata hint panel */}
        {editingIssue && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/90 p-4 text-[11px] text-slate-700">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="font-semibold text-slate-900">
                Metadata hint for {editingIssue.filePath.split("/").pop()}
              </p>
              <button
                type="button"
                className="text-[11px] text-slate-500 underline-offset-4 hover:underline"
                onClick={() => setEditingIssue(null)}
              >
                Close
              </button>
            </div>
            <p className="mb-2">
              To customize how this issue appears on the public Gazette page,
              add or update an entry in <code>MANUAL_METADATA</code> inside{" "}
              <code>lib/gazette.ts</code> keyed by the exact filename:
            </p>
            <pre className="mb-2 overflow-x-auto rounded bg-slate-900/95 p-3 text-[10px] text-slate-100">
{`// lib/gazette.ts
const MANUAL_METADATA: Record<string, Partial<GazetteIssue>> = {
  "${editingIssue.filePath.split("/").pop()}": {
    title: "${editingIssue.title}",
    subtitle: "${editingIssue.subtitle}",
    theme: "${editingIssue.theme}",
    readingTime: "${editingIssue.readingTime}",
  },
  // ...
}`}
            </pre>
            <p>
              After editing <code>lib/gazette.ts</code>, restart the dev server
              so changes to metadata are picked up.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
