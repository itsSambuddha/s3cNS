'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, Pencil, Check, X, ChevronDown, Users, User, Trash2 } from 'lucide-react'
import type { OutboundDelegate, OutboundConference, DelegateStatus } from './types'
import { STATUS_COLORS } from './types'

interface Props {
  conference: OutboundConference
  canManage: boolean
  onRefresh: () => void
}

type DelegationType = 'SINGLE' | 'DOUBLE'

const EMPTY_PERSON = { fullName: '', semester: '', dept: '', rollNo: '', contactNo: '' }
const EMPTY_SHARED = { experience: '', attendance: 0, committeeChoice: '', committeeReceived: '', portfolioReceived: '', paid: false }

// ─── Hoisted to module level to prevent remount on every keystroke ────────────

interface StatusDropdownProps {
  status: DelegateStatus
  delegateId: string
  canManage: boolean
  onPatch: (id: string, data: Record<string, unknown>) => void
}
function StatusDropdown({ status, delegateId, canManage, onPatch }: StatusDropdownProps) {
  const [open, setOpen] = useState(false)
  const cls = `inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${STATUS_COLORS[status]}`
  if (!canManage) return <span className={cls}>{status}</span>
  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)} className={cls + ' cursor-pointer'}>
        {status} <ChevronDown className="w-3 h-3" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute z-40 top-8 left-0 flex flex-col bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden min-w-[130px]">
            {(['PENDING', 'APPROVED', 'REJECTED'] as DelegateStatus[]).map(s => (
              <button key={s} onClick={() => { onPatch(delegateId, { status: s }); setOpen(false) }}
                className={`px-4 py-2.5 text-[11px] font-black uppercase tracking-wide hover:bg-slate-50 dark:hover:bg-white/5 text-left border-b border-slate-50 dark:border-white/5 last:border-0 ${STATUS_COLORS[s]}`}>
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface FieldProps {
  value: string | number
  label: string
  editing: boolean
  type?: string
  onChange: (v: string | number) => void
}
function Field({ value, label, editing, type = 'text', onChange }: FieldProps) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
      {editing ? (
        <input type={type} value={value as string}
          onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
          className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2 py-1 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white" />
      ) : (
        <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">{String(value) || '—'}</p>
      )}
    </div>
  )
}

type PersonState = typeof EMPTY_PERSON
interface PersonFieldsProps {
  person: PersonState
  setPerson: (v: PersonState) => void
  label: string
}
function PersonFields({ person, setPerson, label }: PersonFieldsProps) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
        <User className="w-3 h-3" /> {label}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {([
          { key: 'fullName',  label: 'Full Name *', span: true },
          { key: 'semester',  label: 'Semester' },
          { key: 'dept',      label: 'Department' },
          { key: 'rollNo',    label: 'College Roll No' },
          { key: 'contactNo', label: 'Contact No' },
        ] as { key: keyof PersonState; label: string; span?: boolean }[]).map(f => (
          <div key={f.key} className={f.span ? 'col-span-2 sm:col-span-1' : ''}>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block">{f.label}</label>
            <input value={person[f.key]}
              onChange={e => setPerson({ ...person, [f.key]: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
        ))}
      </div>
    </div>
  )
}

interface DelegateCardProps {
  d: OutboundDelegate
  canManage: boolean
  conferenceId: string
  onPatch: (id: string, data: Record<string, unknown>) => void
  onDelete: (id: string) => Promise<void>
  onRefresh: () => void
}
function DelegateCard({ d, canManage, onPatch, onDelete, onRefresh }: DelegateCardProps) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<Partial<OutboundDelegate>>({ ...d })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const save = async () => {
    setSaving(true)
    await onPatch(d._id, form)
    setSaving(false)
    setEditing(false)
    onRefresh()
  }

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return }
    setDeleting(true)
    await onDelete(d._id)
    setDeleting(false)
  }

  const setField = (key: keyof OutboundDelegate, v: string | number | boolean) =>
    setForm(p => ({ ...p, [key]: v }))

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`group/card relative rounded-2xl border p-5 transition-all
        ${d.status === 'APPROVED' ? 'border-emerald-200/60 dark:border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-500/5'
        : d.status === 'REJECTED' ? 'border-red-200/60 dark:border-red-500/20 bg-red-50/10 dark:bg-red-500/5'
        : 'border-slate-200/60 dark:border-white/5 bg-white dark:bg-white/5'}`}>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          {editing ? (
            <input value={form.fullName ?? ''}
              onChange={e => setField('fullName', e.target.value)}
              className="w-full rounded-xl border border-primary/30 bg-white dark:bg-white/5 px-3 py-1.5 text-base font-black outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white mb-2" />
          ) : (
            <h3 className="text-base font-black text-slate-900 dark:text-white">{d.fullName}</h3>
          )}
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            <StatusDropdown status={d.status} delegateId={d._id} canManage={canManage} onPatch={onPatch} />
            {d.paid && (
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-700 dark:text-emerald-400">✓ Paid</span>
            )}
            {d.award && (
              <span className="rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-2 py-0.5 text-[10px] font-black text-amber-700 dark:text-amber-400">
                🏆 {d.award.replace(/_/g, ' ')}
              </span>
            )}
          </div>
        </div>

        {canManage && (
          <div className="flex gap-1 shrink-0">
            {editing ? (
              <>
                <button onClick={save} disabled={saving} title="Save"
                  className="h-8 w-8 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center hover:bg-primary/20 disabled:opacity-50">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => { setEditing(false); setForm({ ...d }); setConfirmDelete(false) }} title="Cancel"
                  className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-500 flex items-center justify-center hover:bg-slate-200">
                  <X className="w-3.5 h-3.5" />
                </button>
                {confirmDelete ? (
                  <button onClick={handleDelete} disabled={deleting}
                    className="flex items-center gap-1.5 rounded-xl bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 px-3 h-8 text-[10px] font-black uppercase tracking-wide hover:bg-red-200 disabled:opacity-50">
                    {deleting ? '…' : '⚠️ Confirm'}
                  </button>
                ) : (
                  <button onClick={handleDelete} title="Remove member"
                    className="h-8 w-8 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-400 border border-red-100 dark:border-red-500/20 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            ) : (
              <button onClick={() => { setForm({ ...d }); setEditing(true) }}
                className="h-8 w-8 rounded-xl border border-slate-200 dark:border-white/10 text-slate-400 flex items-center justify-center hover:text-primary hover:border-primary/30 opacity-0 group-hover/card:opacity-100 transition-all">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Fields */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <Field label="Semester"            editing={editing} value={form.semester ?? d.semester ?? ''} onChange={v => setField('semester', v)} />
        <Field label="Department"          editing={editing} value={form.dept ?? d.dept ?? ''} onChange={v => setField('dept', v)} />
        <Field label="Roll No"             editing={editing} value={form.rollNo ?? d.rollNo ?? ''} onChange={v => setField('rollNo', v)} />
        <Field label="Contact"             editing={editing} value={form.contactNo ?? d.contactNo ?? ''} onChange={v => setField('contactNo', v)} />
        <Field label="Committee Choice"    editing={editing} value={form.committeeChoice ?? d.committeeChoice ?? ''} onChange={v => setField('committeeChoice', v)} />
        <Field label="Committee Received"  editing={editing} value={form.committeeReceived ?? d.committeeReceived ?? ''} onChange={v => setField('committeeReceived', v)} />
        <Field label="Portfolio Received"  editing={editing} value={form.portfolioReceived ?? d.portfolioReceived ?? ''} onChange={v => setField('portfolioReceived', v)} />
        <Field label="Experience"          editing={editing} value={form.experience ?? d.experience ?? ''} onChange={v => setField('experience', v)} />
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Attendance</p>
          {editing ? (
            <input type="number" min={0} max={100} value={form.attendance ?? 0}
              onChange={e => setField('attendance', Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2 py-1 text-xs font-medium outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white" />
          ) : (
            <div className="flex items-center gap-2 pt-1">
              <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-white/10">
                <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${Math.min(d.attendance ?? 0, 100)}%` }} />
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-zinc-300 shrink-0">{d.attendance ?? 0}%</span>
            </div>
          )}
        </div>
      </div>

      {editing && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/5">
          <button type="button" onClick={() => setField('paid', !form.paid)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-colors
              ${form.paid ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-500'}`}>
            {form.paid ? <><Check className="w-3.5 h-3.5" /> Paid</> : 'Mark as Paid'}
          </button>
        </div>
      )}
    </motion.div>
  )
}

// ─── Main exported component ──────────────────────────────────────────────────

export function DelegatesTab({ conference, canManage, onRefresh }: Props) {
  const [adding, setAdding] = useState(false)
  const [delegationType, setDelegationType] = useState<DelegationType>('SINGLE')
  const [personA, setPersonA] = useState({ ...EMPTY_PERSON })
  const [personB, setPersonB] = useState({ ...EMPTY_PERSON })
  const [shared, setShared] = useState({ ...EMPTY_SHARED })
  const [saving, setSaving] = useState(false)

  const patchDelegate = async (delegateId: string, data: Record<string, unknown>) => {
    await fetch(`/api/outbound-conference/${conference._id}/delegates`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delegateId, ...data }),
    })
    onRefresh()
  }

  const deleteDelegate = async (delegateId: string) => {
    await fetch(`/api/outbound-conference/${conference._id}/delegates`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delegateId }),
    })
    onRefresh()
  }

  const postDelegate = async (payload: Record<string, unknown>) => {
    await fetch(`/api/outbound-conference/${conference._id}/delegates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  }

  const addDelegates = async () => {
    if (!personA.fullName.trim()) return
    setSaving(true)
    const doubleId = delegationType === 'DOUBLE' ? Math.random().toString(36).substring(2, 15) : null
    await postDelegate({ ...personA, ...shared, doubleDelegateId: doubleId })
    if (delegationType === 'DOUBLE' && personB.fullName.trim()) {
      await postDelegate({ ...personB, ...shared, doubleDelegateId: doubleId })
    }
    setSaving(false)
    setPersonA({ ...EMPTY_PERSON })
    setPersonB({ ...EMPTY_PERSON })
    setShared({ ...EMPTY_SHARED })
    setAdding(false)
    onRefresh()
  }

  const resetForm = () => {
    setAdding(false)
    setPersonA({ ...EMPTY_PERSON })
    setPersonB({ ...EMPTY_PERSON })
    setShared({ ...EMPTY_SHARED })
  }

  const approved = conference.delegates.filter(d => d.status === 'APPROVED').length
  const pending  = conference.delegates.filter(d => d.status === 'PENDING').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">Delegation Members</h3>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-xs text-slate-500 dark:text-zinc-400">{conference.delegates.length} enrolled</span>
            {approved > 0 && <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">· {approved} approved</span>}
            {pending  > 0 && <span className="text-[10px] font-black text-amber-600 dark:text-amber-400">· {pending} pending</span>}
          </div>
        </div>
        {canManage && (
          <button onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-[11px] font-black uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            <PlusCircle className="w-3.5 h-3.5" /> Add Member
          </button>
        )}
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-blue-200/60 bg-blue-50/40 dark:bg-white/5 dark:border-white/10 p-6 space-y-5">

            {/* Delegation Type Toggle */}
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-[11px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Delegation Type</p>
              <div className="flex rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-white/5 text-[11px] font-black uppercase tracking-wider">
                {([
                  { type: 'SINGLE' as const, icon: <User key="s" className="w-3 h-3" />, lbl: 'Single' },
                  { type: 'DOUBLE' as const, icon: <Users key="d" className="w-3 h-3" />, lbl: 'Double' },
                ]).map(({ type, icon, lbl }) => (
                  <button key={type} type="button" onClick={() => setDelegationType(type)}
                    className={`flex items-center gap-1.5 px-4 py-2 transition-colors
                      ${delegationType === type ? 'bg-primary text-primary-foreground' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                    {icon} {lbl}
                  </button>
                ))}
              </div>
              {delegationType === 'DOUBLE' && (
                <span className="text-[10px] text-slate-400">Two delegates — shared committee & experience</span>
              )}
            </div>

            {/* Person details */}
            <div className={`grid gap-6 ${delegationType === 'DOUBLE' ? 'lg:grid-cols-2' : ''}`}>
              <div className="rounded-xl border border-slate-200/60 dark:border-white/5 bg-white dark:bg-white/3 p-4">
                <PersonFields person={personA} setPerson={setPersonA}
                  label={delegationType === 'DOUBLE' ? 'Delegate 1' : 'Delegate Details'} />
              </div>
              {delegationType === 'DOUBLE' && (
                <div className="rounded-xl border border-slate-200/60 dark:border-white/5 bg-white dark:bg-white/3 p-4">
                  <PersonFields person={personB} setPerson={setPersonB} label="Delegate 2" />
                </div>
              )}
            </div>

            {/* Shared details */}
            <div className="rounded-xl border border-slate-200/60 dark:border-white/5 bg-white dark:bg-white/3 p-4 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {delegationType === 'DOUBLE' ? 'Shared Details (applies to both)' : 'Additional Details'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {([
                  { key: 'experience',        label: 'Experience',           type: 'text'   },
                  { key: 'committeeChoice',   label: 'Committee Choice',     type: 'text'   },
                  { key: 'committeeReceived', label: 'Committee Received',   type: 'text'   },
                  { key: 'portfolioReceived', label: 'Portfolio Received',   type: 'text'   },
                  { key: 'attendance',        label: 'Attendance %',         type: 'number' },
                ] as { key: keyof typeof EMPTY_SHARED; label: string; type: string }[]).map(f => (
                  <div key={f.key}>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block">{f.label}</label>
                    <input type={f.type}
                      value={shared[f.key] as string | number}
                      onChange={e => setShared(p => ({ ...p, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40" />
                  </div>
                ))}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block">Paid</label>
                  <button type="button" onClick={() => setShared(p => ({ ...p, paid: !p.paid }))}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition-colors
                      ${shared.paid ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-500'}`}>
                    {shared.paid ? <><Check className="w-3.5 h-3.5" /> Paid</> : 'Unpaid'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={addDelegates} disabled={saving || !personA.fullName.trim()}
                className="rounded-full bg-primary px-6 py-2.5 text-[11px] font-black uppercase tracking-wider text-primary-foreground disabled:opacity-50 hover:scale-105 transition-transform">
                {saving ? 'Saving…' : delegationType === 'DOUBLE' ? 'Add Both Delegates' : 'Add Member'}
              </button>
              <button onClick={resetForm}
                className="rounded-full border border-slate-200 dark:border-white/10 px-6 py-2.5 text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-white/5">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Grid */}
      {conference.delegates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-2xl">👥</div>
          <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">No members yet. Add the first one!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {conference.delegates.map(d => (
            <DelegateCard
              key={d._id}
              d={d}
              canManage={canManage}
              conferenceId={conference._id}
              onPatch={patchDelegate}
              onDelete={deleteDelegate}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      )}
    </div>
  )
}
