'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, MapPin, Calendar, ChevronDown, Loader2, Users, ClipboardCheck, Trophy, Globe, Trash2, Printer } from 'lucide-react'
import { useAppUser } from '@/hooks/useAppUser'
import { canManageDelegationTeam } from '@/lib/delegation-team/access'
import { DelegatesTab } from '@/components/delegation-team/DelegatesTab'
import { AttendanceTab } from '@/components/delegation-team/AttendanceTab'
import { AwardsGalleryTab } from '@/components/delegation-team/AwardsGalleryTab'
import type { OutboundConference } from '@/components/delegation-team/types'
import { ConferenceDatePicker } from '@/components/delegation-team/ConferenceDatePicker'
import { PrintLayout } from '@/components/delegation-team/PrintLayout'
import { PrintOverview, PrintAttendance } from '@/components/delegation-team/PrintViews'

type Tab = 'overview' | 'delegates' | 'attendance' | 'awards'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview',   label: 'Overview',    icon: <Globe className="w-3.5 h-3.5" /> },
  { id: 'delegates',  label: 'Members',     icon: <Users className="w-3.5 h-3.5" /> },
  { id: 'attendance', label: 'Attendance',  icon: <ClipboardCheck className="w-3.5 h-3.5" /> },
  { id: 'awards',     label: 'Awards & Gallery', icon: <Trophy className="w-3.5 h-3.5" /> },
]

export default function DelegationTeamPage() {
  const { user: appUser, loading } = useAppUser()
  const [conferences, setConferences] = useState<OutboundConference[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [conference, setConference] = useState<OutboundConference | null>(null)
  const [tab, setTab] = useState<Tab>('overview')
  const [fetching, setFetching] = useState(false)
  const [confirmDeleteConf, setConfirmDeleteConf] = useState(false)

  // New conference form
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newVenue, setNewVenue] = useState('')
  const [newDates, setNewDates] = useState<Date[]>([])
  const [creating, setCreating] = useState(false)

  // Overview editing
  const [editingOverview, setEditingOverview] = useState(false)
  const [ovName, setOvName] = useState('')
  const [ovVenue, setOvVenue] = useState('')
  const [ovDates, setOvDates] = useState<Date[]>([])
  const [savingOverview, setSavingOverview] = useState(false)

  const canManage = appUser ? canManageDelegationTeam(appUser) : false

  const loadConferences = useCallback(async () => {
    setFetching(true)
    const res = await fetch('/api/outbound-conference')
    if (res.ok) {
      const data = await res.json()
      setConferences(data)
      if (data.length > 0 && !selectedId) setSelectedId(data[0]._id)
    }
    setFetching(false)
  }, [selectedId])

  const loadConference = useCallback(async (id: string) => {
    const res = await fetch(`/api/outbound-conference/${id}`)
    if (res.ok) {
      const data = await res.json()
      setConference(data)
      setOvName(data.name)
      setOvVenue(data.venue ?? '')
      setOvDates(data.dates?.map((d: string) => new Date(d)) ?? [])
    }
  }, [])

  useEffect(() => { loadConferences() }, [])
  useEffect(() => { if (selectedId) loadConference(selectedId) }, [selectedId, loadConference])

  const createConference = async () => {
    if (!newName.trim()) return
    setCreating(true)
    const dates = newDates.sort((a, b) => a.getTime() - b.getTime()).map(d => d.toISOString().split('T')[0])
    const res = await fetch('/api/outbound-conference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, venue: newVenue, dates }),
    })
    if (res.ok) {
      const created = await res.json()
      setShowCreate(false)
      setNewName(''); setNewVenue(''); setNewDates([])
      await loadConferences()
      setSelectedId(created._id)
    }
    setCreating(false)
  }

  const saveOverview = async () => {
    if (!conference) return
    setSavingOverview(true)
    const dates = ovDates.sort((a, b) => a.getTime() - b.getTime()).map(d => d.toISOString().split('T')[0])
    await fetch(`/api/outbound-conference/${conference._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: ovName, venue: ovVenue, dates }),
    })
    setSavingOverview(false)
    setEditingOverview(false)
    if (selectedId) loadConference(selectedId)
    loadConferences()
  }

  const handleRefresh = () => { if (selectedId) loadConference(selectedId) }

  const deleteConference = async () => {
    if (!conference) return
    await fetch(`/api/outbound-conference/${conference._id}`, { method: 'DELETE' })
    setConference(null)
    setSelectedId(null)
    setConfirmDeleteConf(false)
    await loadConferences()
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )

  return (
    <>
      <div className="hidden print:block print:w-full print:bg-white print:z-50 print:text-black">
        {conference && (
          <PrintLayout title={tab === 'overview' ? 'Conference Overview' : tab === 'attendance' ? 'Attendance Report' : 'Report'} appUser={appUser} conference={conference}>
            {tab === 'overview' && <PrintOverview conference={conference} />}
            {tab === 'attendance' && <PrintAttendance conference={conference} />}
          </PrintLayout>
        )}
      </div>

    <div className="relative w-full max-w-[100vw] overflow-x-hidden px-4 py-8 print:hidden">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden print:hidden">
        <div className="absolute left-[-15%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[120px]" />
        <div className="absolute right-[-10%] top-[35%] h-[600px] w-[600px] rounded-full bg-violet-100/30 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl space-y-8">
        {/* Hero Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="group relative overflow-hidden rounded-[2rem] border border-blue-200/60 bg-white p-8 shadow-xl shadow-blue-500/5 dark:border-white/5 dark:bg-[#030712]/80">
          <div className="absolute top-0 right-0 w-[40%] h-full bg-violet-400/5 blur-[80px] pointer-events-none transition-colors group-hover:bg-violet-400/10" />
          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
                  Senior Secretariat
                </div>
                {!canManage && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:border-white/10 dark:bg-white/5">
                    View Only
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  Delegation Team Management
                </h1>
                <p className="max-w-xl text-sm font-medium text-slate-500 dark:text-zinc-400">
                  Manage outbound delegations sent to external MUN conferences to represent SECMUN.
                </p>
              </div>
            </div>
            {canManage && (
              <button onClick={() => setShowCreate(true)}
                className="self-start inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[11px] font-black uppercase tracking-wider text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-transform whitespace-nowrap">
                <PlusCircle className="w-4 h-4" /> New Conference
              </button>
            )}
          </div>
        </motion.div>

        {/* Create Conference Modal */}
        <AnimatePresence>
          {showCreate && (
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="rounded-2xl border border-blue-200/60 bg-blue-50/50 dark:bg-white/5 dark:border-white/10 p-6 space-y-5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">New Conference</p>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Fill in the details to start managing a delegation to an external conference.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block">Conference Name *</label>
                  <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. JU MUN 2026"
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/40 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block">Venue</label>
                  <input value={newVenue} onChange={e => setNewVenue(e.target.value)} placeholder="e.g. Jadavpur University"
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/40 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block">Conference Days</label>
                  <ConferenceDatePicker selected={newDates} onChange={setNewDates} />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={createConference} disabled={creating || !newName.trim()}
                  className="rounded-full bg-primary px-6 py-2 text-[11px] font-black uppercase tracking-wider text-primary-foreground disabled:opacity-50 hover:scale-105 transition-transform">
                  {creating ? 'Creating…' : 'Create Conference'}
                </button>
                <button onClick={() => setShowCreate(false)}
                  className="rounded-full border border-slate-200 dark:border-white/10 px-6 py-2 text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5">
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conference Selector */}
        {fetching ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : conferences.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 py-20 text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-3xl">🌏</div>
            <p className="text-lg font-black text-slate-900 dark:text-white">No conferences yet</p>
            <p className="mt-1 text-sm text-slate-400 dark:text-zinc-500">
              {canManage ? 'Click "New Conference" to add the first delegation.' : 'No outbound conferences have been recorded.'}
            </p>
          </div>
        ) : (
          <>
            {/* Conference Selector Row */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Conference</span>
              <div className="relative">
                <select value={selectedId ?? ''} onChange={e => setSelectedId(e.target.value)}
                  className="appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 pl-4 pr-9 py-2.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer min-w-[220px]">
                  {conferences.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              {conference && (
                <div className="flex flex-wrap gap-2 items-center">
                  {conference.venue && (
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1 text-[11px] font-bold text-slate-500">
                      <MapPin className="w-3 h-3" /> {conference.venue}
                    </div>
                  )}
                  {conference.dates?.length > 0 && (
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1 text-[11px] font-bold text-slate-500">
                      <Calendar className="w-3 h-3" /> {conference.dates.length} day{conference.dates.length !== 1 ? 's' : ''}
                    </div>
                  )}
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1 text-[11px] font-bold text-slate-500">
                    <Users className="w-3 h-3" /> {conference.delegates?.length ?? 0} member{conference.delegates?.length !== 1 ? 's' : ''}
                  </div>

                  {/* Delete conference */}
                  {canManage && (
                    confirmDeleteConf ? (
                      <div className="inline-flex items-center gap-2 ml-1">
                        <span className="text-[11px] font-black text-red-600">Delete "{conference.name}"?</span>
                        <button onClick={deleteConference}
                          className="rounded-full bg-red-600 px-3 py-1 text-[11px] font-black text-white hover:bg-red-700 transition-colors">
                          Yes, Delete
                        </button>
                        <button onClick={() => setConfirmDeleteConf(false)}
                          className="rounded-full border border-slate-200 dark:border-white/10 px-3 py-1 text-[11px] font-black text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDeleteConf(true)} title="Delete this conference"
                        className="inline-flex items-center gap-1.5 rounded-full border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-3 py-1 text-[11px] font-black text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors ml-1">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Main Card with Tabs */}
            {conference && (
              <motion.div key={conference._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-[2rem] border border-slate-200/60 dark:border-white/5 bg-white dark:bg-[#030712]/80 shadow-xl shadow-blue-500/5 overflow-hidden">

                {/* Tab Bar */}
                <div className="flex overflow-x-auto border-b border-slate-100 dark:border-white/5 px-6 pt-6 gap-1">
                  {TABS.map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                      className={`inline-flex items-center gap-2 rounded-t-2xl px-5 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                        ${tab === t.id
                          ? 'bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white border border-b-0 border-slate-200 dark:border-white/10'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}>
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6 sm:p-8">
                  <AnimatePresence mode="wait">
                    <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

                      {/* OVERVIEW TAB */}
                      {tab === 'overview' && (
                        <div className="space-y-6">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">Conference Details</h3>
                            <div className="flex flex-wrap gap-2">
                              <button onClick={() => window.print()}
                                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-white/5">
                                <Printer className="w-3.5 h-3.5" /> Print
                              </button>
                              {canManage && !editingOverview && (
                                <button onClick={() => setEditingOverview(true)}
                                  className="rounded-full border border-slate-200 dark:border-white/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-white/5">
                                  Edit Details
                                </button>
                              )}
                            </div>
                          </div>

                          {editingOverview ? (
                            <div className="space-y-4">
                              <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block">Conference Name</label>
                                  <input value={ovName} onChange={e => setOvName(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/40 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block">Venue</label>
                                  <input value={ovVenue} onChange={e => setOvVenue(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/40 text-slate-900 dark:text-white" />
                                </div>
                                <div className="sm:col-span-2">
                                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 block">Conference Days</label>
                                  <ConferenceDatePicker selected={ovDates} onChange={setOvDates} />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={saveOverview} disabled={savingOverview}
                                  className="rounded-full bg-primary px-6 py-2 text-[11px] font-black uppercase tracking-wider text-primary-foreground disabled:opacity-50 hover:scale-105 transition-transform">
                                  {savingOverview ? 'Saving…' : 'Save'}
                                </button>
                                <button onClick={() => setEditingOverview(false)}
                                  className="rounded-full border border-slate-200 dark:border-white/10 px-6 py-2 text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="grid gap-4 sm:grid-cols-3">
                              {[
                                { label: 'Conference Name', value: conference.name, icon: '🏛️' },
                                { label: 'Venue', value: conference.venue || 'Not specified', icon: '📍' },
                                { label: 'Conference Days', value: conference.dates?.length ? conference.dates.map(d => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })).join(' · ') : 'No dates set', icon: '📅' },
                              ].map(item => (
                                <div key={item.label} className="rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/3 p-5 space-y-2">
                                  <div className="text-lg">{item.icon}</div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{item.value}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Quick Stats */}
                          <div className="grid gap-3 sm:grid-cols-4">
                            {[
                              { label: 'Total Members', value: conference.delegates.length, color: 'text-blue-600 dark:text-blue-400' },
                              { label: 'Approved', value: conference.delegates.filter(d => d.status === 'APPROVED').length, color: 'text-emerald-600 dark:text-emerald-400' },
                              { label: 'Pending', value: conference.delegates.filter(d => d.status === 'PENDING').length, color: 'text-amber-600 dark:text-amber-400' },
                              { label: 'Awards Won', value: conference.delegates.filter(d => d.award).length + (conference.teamAward ? 1 : 0), color: 'text-purple-600 dark:text-purple-400' },
                            ].map(stat => (
                              <div key={stat.label} className="rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/3 p-4 text-center">
                                <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                                <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* DELEGATES TAB */}
                      {tab === 'delegates' && (
                        <DelegatesTab conference={conference} canManage={canManage} onRefresh={handleRefresh} />
                      )}

                      {/* ATTENDANCE TAB */}
                      {tab === 'attendance' && (
                        <AttendanceTab conference={conference} canManage={canManage} onRefresh={handleRefresh} />
                      )}

                      {/* AWARDS & GALLERY TAB */}
                      {tab === 'awards' && (
                        <AwardsGalleryTab conference={conference} canManage={canManage} onRefresh={handleRefresh} />
                      )}

                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
    </>
  )
}
