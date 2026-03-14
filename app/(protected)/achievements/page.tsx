'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Award, Zap, Star, Medal, Trash2, Pencil, Check, X, ChevronDown, MapPin, Calendar } from 'lucide-react'
import { useAppUser } from '@/hooks/useAppUser'
import { canManageDelegationTeam } from '@/lib/delegation-team/access'

interface AchievementEntry {
  title: string
  category: string
  description: string
  conferenceId: string
  delegateId?: string
  isTeamAward: boolean
  awardKey?: string
}

interface ConferenceGroup {
  conferenceId: string
  conferenceName: string
  venue: string
  rawDate: string
  dateLabel: string
  teamPhotoUrl: string
  teamAward: string
  achievements: AchievementEntry[]
}

const INDIVIDUAL_AWARDS = [
  { value: 'BEST_DELEGATE',     label: '🥇 Best Delegate' },
  { value: 'HIGH_COMMENDATION', label: '🥈 High Commendation' },
  { value: 'SPECIAL_MENTION',   label: '🥉 Special Mention' },
  { value: 'VERBAL_MENTION',    label: '🎖️ Verbal Mention' },
]

const AWARD_ICONS = [
  <Trophy key="t" className="w-5 h-5 text-amber-500" />,
  <Award  key="a" className="w-5 h-5 text-blue-500" />,
  <Medal  key="m" className="w-5 h-5 text-emerald-500" />,
  <Zap    key="z" className="w-5 h-5 text-purple-500" />,
  <Star   key="s" className="w-5 h-5 text-rose-500" />,
]

const CATEGORY_COLORS: Record<string, string> = {
  'Team Award':   'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-500/20',
  'Individual':   'bg-blue-50   dark:bg-blue-500/10   text-blue-700   dark:text-blue-300   border-blue-200   dark:border-blue-500/20',
}

export default function AchievementsPage() {
  const { user: appUser } = useAppUser()
  const [groups, setGroups] = useState<ConferenceGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [editingKey, setEditingKey] = useState<string | null>(null)   // "confId-delegId" or "confId-team"
  const [editValue, setEditValue] = useState('')
  const [deletingKey, setDeletingKey] = useState<string | null>(null)
  const [savingKey, setSavingKey] = useState<string | null>(null)

  const canManage = appUser ? canManageDelegationTeam(appUser) : false
  const totalAwards = groups.reduce((s, g) => s + g.achievements.length, 0)

  const fetchGroups = useCallback(async () => {
    try {
      const res = await fetch('/api/achievements')
      if (res.ok) setGroups(await res.json())
    } catch (err) {
      console.error('Failed to load achievements:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchGroups() }, [fetchGroups])

  const patchConference = (confId: string, body: Record<string, unknown>) =>
    fetch(`/api/outbound-conference/${confId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    })

  const patchDelegate = (confId: string, delegateId: string, body: Record<string, unknown>) =>
    fetch(`/api/outbound-conference/${confId}/delegates`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delegateId, ...body }),
    })

  const handleDelete = async (a: AchievementEntry) => {
    const key = a.isTeamAward ? `${a.conferenceId}-team` : `${a.conferenceId}-${a.delegateId}`
    setDeletingKey(key)
    if (a.isTeamAward) await patchConference(a.conferenceId, { teamAward: '' })
    else if (a.delegateId) await patchDelegate(a.conferenceId, a.delegateId, { award: null })
    setDeletingKey(null)
    fetchGroups()
  }

  const startEdit = (a: AchievementEntry) => {
    const key = a.isTeamAward ? `${a.conferenceId}-team` : `${a.conferenceId}-${a.delegateId}`
    setEditingKey(key)
    setEditValue(a.isTeamAward ? a.title : (a.awardKey ?? ''))
  }

  const handleSave = async (a: AchievementEntry) => {
    const key = a.isTeamAward ? `${a.conferenceId}-team` : `${a.conferenceId}-${a.delegateId}`
    setSavingKey(key)
    if (a.isTeamAward) await patchConference(a.conferenceId, { teamAward: editValue })
    else if (a.delegateId) await patchDelegate(a.conferenceId, a.delegateId, { award: editValue || null })
    setSavingKey(null)
    setEditingKey(null)
    fetchGroups()
  }

  return (
    <main className="relative min-h-screen bg-background px-4 py-8 overflow-hidden">
      {/* Atmosphere blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute right-[-10%] top-[35%] h-[600px] w-[600px] rounded-full bg-amber-100/40 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-6xl space-y-12">
        {/* ── Header ── */}
        <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="group relative overflow-hidden rounded-[2rem] border border-amber-200/60 bg-white p-8 shadow-xl shadow-amber-500/5 dark:border-white/5 dark:bg-[#030712]/80">
            <div className="absolute top-0 right-0 w-[40%] h-full bg-amber-400/5 blur-[80px] pointer-events-none group-hover:bg-amber-400/10 transition-colors" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/60 bg-amber-50/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">
                    Honors &amp; Legacy
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-slate-50/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                    Sorted by date
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Institutional Achievements
                  </h1>
                  <p className="mt-1 max-w-xl text-sm font-medium text-slate-500 dark:text-zinc-400">
                    Celebrating excellence, diplomacy, and dedication at every conference SECMUN has attended.
                  </p>
                </div>
              </div>
              {!loading && totalAwards > 0 && (
                <div className="shrink-0 rounded-2xl border border-amber-200/60 bg-amber-50/50 dark:bg-amber-500/5 dark:border-amber-500/20 px-6 py-4 text-center">
                  <p className="text-4xl font-black text-amber-700 dark:text-amber-400">{totalAwards}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-600/70 mt-0.5">Awards Won</p>
                </div>
              )}
            </div>
          </div>
        </motion.header>

        {/* ── Body ── */}
        {loading ? (
          <div className="space-y-8">
            {[1, 2].map(i => (
              <div key={i} className="animate-pulse rounded-[2rem] border border-slate-100 dark:border-white/5 bg-white dark:bg-zinc-900/40 p-8 space-y-4">
                <div className="h-5 w-48 rounded-full bg-slate-100 dark:bg-white/10" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[1,2,3].map(j => <div key={j} className="h-24 rounded-2xl bg-slate-100 dark:bg-white/5" />)}
                </div>
              </div>
            ))}
          </div>
        ) : groups.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="h-20 w-20 rounded-3xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-4xl">🏆</div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">No achievements yet</h2>
            <p className="max-w-sm text-sm text-slate-400">
              Awards recorded in the Delegation Team module will appear here automatically.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-10">
            {groups.map((group, gi) => (
              <motion.section key={group.conferenceId}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.07 }}>

                {/* ── Conference Header ── */}
                <div className="relative mb-6 flex items-center gap-4">
                  <div className="shrink-0 h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg font-black shadow-md">
                    {gi + 1}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">{group.conferenceName}</h2>
                    <div className="flex flex-wrap gap-3 mt-0.5">
                      {group.venue && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500">
                          <MapPin className="w-3 h-3" /> {group.venue}
                        </span>
                      )}
                      {group.dateLabel && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500">
                          <Calendar className="w-3 h-3" /> {group.dateLabel}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* horizontal rule */}
                  <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent dark:from-white/10" />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  {/* ── Team Photo ── */}
                  {group.teamPhotoUrl && (
                    <div className="lg:col-span-1 lg:row-span-2">
                      <div className="sticky top-6 overflow-hidden rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={group.teamPhotoUrl} alt={`${group.conferenceName} team`}
                          className="w-full object-cover aspect-[3/4]" />
                        <div className="bg-white dark:bg-zinc-900 px-4 py-3">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Team Photo</p>
                          <p className="text-sm font-bold text-slate-700 dark:text-zinc-300">{group.conferenceName}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Awards ── */}
                  <div className={group.teamPhotoUrl ? 'lg:col-span-2' : 'lg:col-span-3'}>
                    {group.achievements.length === 0 ? (
                      <div className="flex items-center justify-center py-12 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-sm text-slate-400">
                        No awards recorded for this conference.
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {group.achievements.map((a, ai) => {
                          const key = a.isTeamAward ? `${a.conferenceId}-team` : `${a.conferenceId}-${a.delegateId}`
                          const isEditing  = editingKey  === key
                          const isDeleting = deletingKey === key
                          const isSaving   = savingKey   === key
                          return (
                            <motion.div key={key} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: ai * 0.05 }}
                              className="group/card relative rounded-2xl border border-slate-200/60 dark:border-white/5 bg-white dark:bg-zinc-900/40 p-5 shadow-sm hover:shadow-md transition-shadow">

                              {/* Manage buttons — hover reveal */}
                              {canManage && !isEditing && (
                                <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                  <button onClick={() => startEdit(a)}
                                    className="h-7 w-7 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 shadow-sm transition-all">
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                  <button onClick={() => handleDelete(a)} disabled={isDeleting}
                                    className="h-7 w-7 rounded-xl bg-white dark:bg-zinc-800 border border-red-100 dark:border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 shadow-sm transition-all disabled:opacity-50">
                                    {isDeleting ? <span className="animate-spin text-[9px]">⌛</span> : <Trash2 className="w-3 h-3" />}
                                  </button>
                                </div>
                              )}
                              {canManage && isEditing && (
                                <div className="absolute top-4 right-4 flex gap-1.5">
                                  <button onClick={() => handleSave(a)} disabled={isSaving}
                                    className="h-7 w-7 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center hover:bg-primary/20 disabled:opacity-50">
                                    <Check className="w-3 h-3" />
                                  </button>
                                  <button onClick={() => setEditingKey(null)}
                                    className="h-7 w-7 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-500 border border-slate-200 dark:border-white/10 flex items-center justify-center">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              )}

                              <div className="flex items-start gap-4">
                                <div className="shrink-0 h-10 w-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shadow-sm">
                                  {AWARD_ICONS[(ai) % AWARD_ICONS.length]}
                                </div>
                                <div className="flex-1 min-w-0 pr-12">
                                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider mb-1.5 ${CATEGORY_COLORS[a.category] ?? CATEGORY_COLORS['Individual']}`}>
                                    {a.category}
                                  </span>
                                  {isEditing ? (
                                    a.isTeamAward ? (
                                      <input value={editValue} onChange={e => setEditValue(e.target.value)} autoFocus
                                        className="w-full rounded-xl border border-primary/30 bg-white dark:bg-white/5 px-3 py-1.5 text-sm font-black outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white" />
                                    ) : (
                                      <div className="relative">
                                        <select value={editValue} onChange={e => setEditValue(e.target.value)}
                                          className="w-full appearance-none rounded-xl border border-primary/30 bg-white dark:bg-white/5 pl-3 pr-8 py-1.5 text-sm font-black outline-none focus:ring-2 focus:ring-primary/30 text-slate-900 dark:text-white">
                                          {INDIVIDUAL_AWARDS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                                      </div>
                                    )
                                  ) : (
                                    <h3 className="text-sm font-black tracking-tight text-slate-900 dark:text-white">{a.title}</h3>
                                  )}
                                  <p className="mt-1 text-xs font-medium text-slate-500 dark:text-zinc-400">{a.description}</p>
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </motion.section>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
