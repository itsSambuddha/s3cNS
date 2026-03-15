"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Wallet } from "lucide-react"
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
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition-all hover:shadow-xl dark:border-white/5 dark:bg-white/5 cursor-pointer"
      onClick={() => router.push("/finance/records?tab=budgets")}
    >
      <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Wallet size={20} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Finance
          </p>
        </div>

        <div>
          <div className="flex items-baseline gap-1">
            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              {onTrack}
            </p>
            <span className="text-lg font-bold text-slate-400">/ {total}</span>
          </div>
          <p className="text-xs font-bold text-slate-400 dark:text-zinc-500">
            Budgets on track
          </p>
        </div>

        {error && (
          <p className="text-[10px] font-bold text-destructive animate-pulse">{error}</p>
        )}

        <button className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 px-4 text-[11px] font-black uppercase tracking-wider text-white transition-all hover:scale-105">
          Ledger →
        </button>
      </div>
    </motion.div>
  )
}
