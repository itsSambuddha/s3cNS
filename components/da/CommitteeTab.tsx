"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip } from "@/components/ui/tooltip-card"
import { Printer, Plus, Trash2, Lock } from "lucide-react"
import clsx from "clsx"

/* =========================
   TYPES
========================= */

type DistributionRow = {
  name: string
  delegates: number
  note?: string
}

/* =========================
   COMPONENT
========================= */

export function CommitteeTab() {
  /* ---------- State ---------- */
  const [totalDelegates, setTotalDelegates] = useState<number | "">("")
  const [newCommittee, setNewCommittee] = useState("")
  const [committees, setCommittees] = useState<string[]>(["IPC"])
  const [error, setError] = useState<string | null>(null)
  const [calculated, setCalculated] = useState(false)

  /* ---------- Derived ---------- */
  const otherCommittees = committees.filter(c => c !== "IPC")

  const ipcDelegates = otherCommittees.length * 4

  const distribution: DistributionRow[] = useMemo(() => {
    if (
      !calculated ||
      typeof totalDelegates !== "number" ||
      totalDelegates < ipcDelegates ||
      otherCommittees.length === 0
    ) {
      return []
    }

    const remaining = totalDelegates - ipcDelegates
    const base = Math.floor(remaining / otherCommittees.length)
    const remainder = remaining % otherCommittees.length

    const rows: DistributionRow[] = []

    // IPC row (explicit logic)
    rows.push({
      name: "IPC",
      delegates: ipcDelegates,
      note: `4 × ${otherCommittees.length}`,
    })

    otherCommittees.forEach((c, idx) => {
      rows.push({
        name: c,
        delegates: base + (idx < remainder ? 1 : 0),
      })
    })

    return rows
  }, [calculated, totalDelegates, committees])

  /* =========================
     ACTIONS
  ========================= */

  function addCommittee() {
    const name = newCommittee.trim().toUpperCase()
    if (!name || name === "IPC") {
      setError("Invalid or reserved committee name.")
      return
    }
    if (committees.includes(name)) {
      setError("Committee already added.")
      return
    }

    setCommittees(prev => [...prev, name])
    setNewCommittee("")
    setError(null)
    setCalculated(false)
  }

  function removeCommittee(name: string) {
    setCommittees(prev => prev.filter(c => c !== name))
    setCalculated(false)
  }

  function calculate() {
    if (typeof totalDelegates !== "number" || totalDelegates < 1) {
      setError("Enter a valid total delegate count.")
      return
    }
    if (otherCommittees.length === 0) {
      setError("At least one non-IPC committee is required.")
      return
    }
    if (totalDelegates < ipcDelegates) {
      setError(
        `Minimum required delegates: ${ipcDelegates} (IPC = 4 × ${otherCommittees.length})`,
      )
      return
    }

    setError(null)
    setCalculated(true)
  }

  /* =========================
     UI
  ========================= */

  return (
    <div className="space-y-8">
      {/* ================= Header ================= */}
      <div>
        <h1 className="text-xl font-semibold">Committee Planning Simulator</h1>
        <p className="text-sm text-muted-foreground">
          Pre-allocation modelling tool for Delegate Affairs
        </p>
      </div>

      {/* ================= Inputs ================= */}
      <Card className="p-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Total Delegates
            </label>
            <Input
              type="number"
              value={totalDelegates}
              onChange={e =>
                setTotalDelegates(
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              placeholder="e.g. 120"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Add Committee
            </label>
            <div className="flex gap-2">
              <Input
                value={newCommittee}
                onChange={e => setNewCommittee(e.target.value)}
                placeholder="e.g. UNHRC"
              />
              <Button size="icon" onClick={addCommittee}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </Card>

      {/* ================= Committees ================= */}
      <Card className="p-4 space-y-3">
        <h3 className="text-sm font-medium">Committees</h3>

        <div className="flex flex-wrap gap-2">
          {committees.map(c => (
            <div
              key={c}
              className={clsx(
                "flex items-center gap-2 rounded-full border px-3 py-1 text-sm",
                c === "IPC"
                  ? "bg-slate-100 text-slate-700"
                  : "bg-white",
              )}
            >
              {c === "IPC" && <Lock className="h-3 w-3" />}
              <span>{c}</span>
              {c !== "IPC" && (
                <button
                  onClick={() => removeCommittee(c)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
              {c === "IPC" && (
                <span className="text-xs text-muted-foreground">
                  fixed
                </span>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* ================= Calculate ================= */}
      <div>
        <Button onClick={calculate}>Calculate Distribution</Button>
      </div>

      {/* ================= Results ================= */}
      {calculated && distribution.length > 0 && (
        <Card className="p-4 space-y-4">
          <h3 className="text-sm font-medium">
            Delegate Distribution
          </h3>

          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="py-1">Committee</th>
                <th className="py-1">Delegates</th>
                <th className="py-1">Logic</th>
              </tr>
            </thead>
            <tbody>
              {distribution.map(row => (
                <tr key={row.name} className="border-t">
                  <td className="py-1 font-medium">
                    {row.name}
                  </td>
                  <td className="py-1">{row.delegates}</td>
                  <td className="py-1 text-xs text-muted-foreground">
                    {row.note || "Even distribution"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary */}
          <div className="grid gap-3 sm:grid-cols-4 text-sm">
            <Summary label="Total delegates" value={totalDelegates} />
            <Summary label="IPC delegates" value={ipcDelegates} />
            <Summary
              label="Remaining"
              value={
                typeof totalDelegates === "number"
                  ? totalDelegates - ipcDelegates
                  : "—"
              }
            />
            <Summary
              label="Committees"
              value={committees.length}
            />
          </div>
        </Card>
      )}

      {/* ================= Actions ================= */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Print / Export
        </Button>

        <Tooltip content="This data is stored temporarily in memory. Please print or export to avoid losing it.">
          <span className="cursor-help text-xs text-muted-foreground">
            Temporary data
          </span>
        </Tooltip>
      </div>
    </div>
  )
}

/* =========================
   SUBCOMPONENTS
========================= */

function Summary({
  label,
  value,
}: {
  label: string
  value: number | string
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-base font-semibold">{value}</p>
    </div>
  )
}
