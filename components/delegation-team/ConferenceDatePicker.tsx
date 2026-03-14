'use client'
import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { CalendarDays, X } from 'lucide-react'

interface Props {
  selected: Date[]
  onChange: (dates: Date[]) => void
}

export function ConferenceDatePicker({ selected, onChange }: Props) {
  const [open, setOpen] = useState(false)

  const sorted = [...selected].sort((a, b) => a.getTime() - b.getTime())

  const fmt = (d: Date) =>
    d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-sm font-medium text-left outline-none focus:ring-2 focus:ring-primary/40 hover:border-primary/40 transition-colors"
      >
        <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
        {sorted.length === 0 ? (
          <span className="text-slate-400">Select conference days…</span>
        ) : (
          <span className="text-slate-900 dark:text-white truncate">
            {sorted.length === 1
              ? fmt(sorted[0])
              : `${fmt(sorted[0])} → ${fmt(sorted[sorted.length - 1])} (${sorted.length} days)`}
          </span>
        )}
      </button>

      {/* Popover */}
      {open && (
        <div className="absolute z-50 mt-2 left-0 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl shadow-black/10 p-4 min-w-[300px]">
          {/* Selected chips */}
          {sorted.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {sorted.map(d => (
                <span key={d.toISOString()}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                  {d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  <button type="button" onClick={() => onChange(selected.filter(s => s.toDateString() !== d.toDateString()))}>
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <DayPicker
            mode="multiple"
            selected={selected}
            onSelect={(days) => onChange(days ?? [])}
            className="rdp-custom"
          />

          <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-3">
            <span className="text-[11px] font-bold text-slate-400">{sorted.length} day{sorted.length !== 1 ? 's' : ''} selected</span>
            <button type="button" onClick={() => setOpen(false)}
              className="rounded-xl bg-primary px-4 py-1.5 text-[11px] font-black uppercase tracking-wider text-primary-foreground hover:scale-105 transition-transform">
              Done
            </button>
          </div>
        </div>
      )}

      {/* Styles to match app theme */}
      <style>{`
        .rdp-custom { --rdp-accent-color: var(--primary, #6d28d9); }
        .rdp-custom .rdp-day_selected,
        .rdp-custom .rdp-selected .rdp-day_button { background-color: var(--primary, #6d28d9) !important; color: white !important; border-radius: 10px !important; }
        .rdp-custom .rdp-day_button { border-radius: 10px !important; font-weight: 600; }
        .rdp-custom .rdp-month_caption { font-weight: 900; font-size: 0.85rem; letter-spacing: 0.04em; }
        .rdp-custom .rdp-nav button { border-radius: 10px !important; }
      `}</style>
    </div>
  )
}
