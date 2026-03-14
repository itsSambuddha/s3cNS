'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import type { OutboundConference } from './types'

interface Props {
  conference: OutboundConference
  canManage: boolean
  onRefresh: () => void
}

export function AttendanceTab({ conference, canManage, onRefresh }: Props) {
  const [saving, setSaving] = useState<string | null>(null)

  const approved = conference.delegates.filter(d => d.status === 'APPROVED')
  const dates = conference.dates ?? []

  const toggleAttendance = async (delegateId: string, date: string, current: 'PRESENT' | 'ABSENT' | undefined) => {
    const next = current === 'PRESENT' ? 'ABSENT' : 'PRESENT'
    setSaving(`${delegateId}-${date}`)
    await fetch(`/api/outbound-conference/${conference._id}/attendance`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delegateId, date, value: next }),
    })
    setSaving(null)
    onRefresh()
  }

  if (dates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-2xl">📅</div>
        <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">No conference days defined.</p>
        <p className="text-xs text-slate-400 dark:text-zinc-500">Add dates in the Overview tab first.</p>
      </div>
    )
  }

  if (approved.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-2xl">👥</div>
        <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">No approved delegates yet.</p>
        <p className="text-xs text-slate-400 dark:text-zinc-500">Approve delegates from the Members tab first.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white">Daily Attendance</h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Marking attendance for {approved.length} approved delegate{approved.length !== 1 ? 's' : ''} across {dates.length} day{dates.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/60 dark:border-white/5">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-white/5">
              <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Delegate</th>
              {dates.map(date => (
                <th key={date} className="px-4 py-3 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
                  <div>{new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {approved.map((d, idx) => (
              <motion.tr key={d._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.04 }}
                className="border-t border-slate-100 dark:border-white/5">
                <td className="px-5 py-3">
                  <div className="font-bold text-slate-900 dark:text-white">{d.fullName}</div>
                  <div className="text-[10px] text-slate-400 dark:text-zinc-500">{[d.semester, d.dept].filter(Boolean).join(' · ')}</div>
                </td>
                {dates.map(date => {
                  const val = d.attendanceDays?.[date]
                  const key = `${d._id}-${date}`
                  const isLoading = saving === key
                  return (
                    <td key={date} className="px-4 py-3 text-center">
                      <button
                        disabled={!canManage || isLoading}
                        onClick={() => toggleAttendance(d._id, date, val)}
                        className={`inline-flex h-9 w-20 items-center justify-center rounded-xl text-[11px] font-black uppercase tracking-wider border transition-all
                          ${val === 'PRESENT' ? 'bg-emerald-100 border-emerald-200 text-emerald-700 hover:bg-emerald-200' :
                          val === 'ABSENT' ? 'bg-red-100 border-red-200 text-red-700 hover:bg-red-200' :
                          'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'}
                          ${!canManage ? 'cursor-default' : 'cursor-pointer'}
                          ${isLoading ? 'opacity-50 animate-pulse' : ''}`}
                      >
                        {isLoading ? '…' : val === 'PRESENT' ? '✓ Present' : val === 'ABSENT' ? '✗ Absent' : '—'}
                      </button>
                    </td>
                  )
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-[11px] font-bold">
        <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-emerald-400" />Present</div>
        <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-red-400" />Absent</div>
        <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-slate-300" />Not marked</div>
      </div>
    </div>
  )
}
