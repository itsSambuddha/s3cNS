"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

type FinanceSummary = {
  totalBudgets: number
  budgetsOnTrack: number
}

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

export function FinanceCard() {
  const router = useRouter()
  const [data, setData] = useState<FinanceSummary | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setError(null)
        const res = await fetch("/api/dashboard/finance/summary")
        const json = await res.json()
        if (!res.ok)
          throw new Error(json.error || "Failed to load finance data")
        setData(json as FinanceSummary)
      } catch (e: any) {
        setError(e?.message || "Could not load finance data")
      }
    }
    load()
  }, [])

  const onTrack = data?.budgetsOnTrack ?? 0
  const total = data?.totalBudgets ?? 0

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{
        y: -4,
        transition: { duration: 0.3 }
      }}
      className="group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-blue-500/5 dark:border-white/5 dark:bg-white/5 cursor-pointer"
      onClick={() => router.push("/finance/records?tab=budgets")}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Finance
          </p>
          <div className="h-2 w-2 rounded-full bg-blue-500" />
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <p className="text-4xl font-black text-slate-900 dark:text-white">
              {onTrack}
            </p>
            <span className="text-lg font-bold text-slate-400">/ {total}</span>
          </div>
          <p className="mt-1 text-xs font-bold text-slate-500 dark:text-zinc-500">
            Budgets currently on track
          </p>
        </div>

        {error && (
          <p className="text-[10px] font-bold text-destructive">{error}</p>
        )}

        <button className="inline-flex h-9 items-center justify-center rounded-full bg-slate-50 px-4 text-[11px] font-black uppercase tracking-wider text-slate-900 transition-colors hover:bg-slate-100 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
          Open finance →
        </button>
      </div>
    </motion.div>
  )
}
