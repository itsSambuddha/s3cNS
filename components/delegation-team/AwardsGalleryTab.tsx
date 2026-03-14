'use client'
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Upload, Phone, User, Camera } from 'lucide-react'
import type { OutboundConference, DelegateAward } from './types'
import { AWARD_OPTIONS, TEAM_AWARD_PRESETS } from './types'

interface Props {
  conference: OutboundConference
  canManage: boolean
  onRefresh: () => void
}

export function AwardsGalleryTab({ conference, canManage, onRefresh }: Props) {
  const [saving, setSaving] = useState(false)
  const [teamAward, setTeamAward] = useState(conference.teamAward ?? '')
  const [photoContactName, setPhotoContactName] = useState(conference.photoContactName ?? '')
  const [photoContactNo, setPhotoContactNo] = useState(conference.photoContactNo ?? '')
  const [teamPhotoUrl, setTeamPhotoUrl] = useState(conference.teamPhotoUrl ?? '')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const approved = conference.delegates.filter(d => d.status === 'APPROVED')

  const saveTeamAward = async () => {
    setSaving(true)
    await fetch(`/api/outbound-conference/${conference._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamAward }),
    })
    setSaving(false)
    onRefresh()
  }

  const patchDelegate = async (delegateId: string, award: DelegateAward) => {
    await fetch(`/api/outbound-conference/${conference._id}/delegates`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delegateId, award }),
    })
    onRefresh()
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPhoto(true)
    const reader = new FileReader()
    reader.onload = async () => {
      const url = reader.result as string
      setTeamPhotoUrl(url)
      await fetch(`/api/outbound-conference/${conference._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamPhotoUrl: url }),
      })
      setUploadingPhoto(false)
      onRefresh()
    }
    reader.readAsDataURL(file)
  }

  const saveGalleryContact = async () => {
    setSaving(true)
    await fetch(`/api/outbound-conference/${conference._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoContactName, photoContactNo }),
    })
    setSaving(false)
    onRefresh()
  }

  const awardLabel = (award: DelegateAward) => AWARD_OPTIONS.find(o => o.value === award)?.label ?? 'No Award'

  return (
    <div className="space-y-8">

      {/* Section 1: Individual Awards */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center">
            <Trophy className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">Individual Awards</h3>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500">Set awards for approved delegates</p>
          </div>
        </div>

        {approved.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 py-10 text-center">
            <p className="text-sm text-slate-400 dark:text-zinc-500">No approved delegates yet</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {approved.map((d, idx) => (
              <motion.div key={d._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                className={`relative rounded-2xl border p-4 transition-all
                  ${d.award ? 'border-amber-200 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-500/5' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5'}`}>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="font-black text-slate-900 dark:text-white text-sm">{d.fullName}</p>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500">{d.committeeReceived || d.committeeChoice || 'No committee assigned'}</p>
                  </div>
                  {canManage ? (
                    <select
                      value={d.award ?? ''}
                      onChange={e => patchDelegate(d._id, (e.target.value || null) as DelegateAward)}
                      className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-400/40">
                      {AWARD_OPTIONS.map(o => (
                        <option key={String(o.value)} value={o.value ?? ''}>{o.label}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`inline-flex rounded-xl px-3 py-1.5 text-sm font-black text-center justify-center
                      ${d.award ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' : 'bg-slate-50 dark:bg-white/5 text-slate-400'}`}>
                      {awardLabel(d.award)}
                    </span>
                  )}
                </div>
                {d.award && <div className="absolute top-3 right-3 text-base">🏆</div>}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 dark:border-white/5" />

      {/* Section 2: Team Award */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
            <span className="text-base">🎖️</span>
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">Team Award</h3>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500">Award for the entire SECMUN delegation</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-5 space-y-4">
          {canManage ? (
            <>
              <div className="flex flex-wrap gap-2">
                {TEAM_AWARD_PRESETS.map(preset => (
                  <button key={preset} onClick={() => setTeamAward(preset)}
                    className={`rounded-full border px-4 py-1.5 text-[11px] font-black uppercase tracking-wide transition-colors
                      ${teamAward === preset ? 'border-blue-400 bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300' : 'border-slate-200 dark:border-white/10 text-slate-500 hover:border-blue-300 hover:text-blue-600'}`}>
                    {preset}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 items-center">
                <input value={teamAward} onChange={e => setTeamAward(e.target.value)}
                  placeholder="Or type a custom award…"
                  className="flex-1 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/40 text-slate-900 dark:text-white" />
                <button onClick={saveTeamAward} disabled={saving}
                  className="rounded-xl bg-primary px-5 py-2.5 text-[11px] font-black uppercase tracking-wider text-primary-foreground disabled:opacity-50 hover:scale-105 transition-transform">
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </>
          ) : (
            <p className={`text-lg font-black ${teamAward ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-zinc-500'}`}>
              {teamAward || 'No team award recorded'}
            </p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 dark:border-white/5" />

      {/* Section 3: Gallery */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
            <Camera className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">Gallery</h3>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500">Team photo and contact for other pictures</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Team Photo Upload */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-5 space-y-4">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Team Photo</p>
            {teamPhotoUrl ? (
              <div className="relative">
                <img src={teamPhotoUrl} alt="Team Photo" className="w-full rounded-xl object-cover aspect-video" />
                {canManage && (
                  <button onClick={() => fileRef.current?.click()}
                    className="absolute bottom-2 right-2 rounded-xl bg-black/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white hover:bg-black/80 flex items-center gap-1">
                    <Upload className="w-3 h-3" /> Change
                  </button>
                )}
              </div>
            ) : (
              canManage ? (
                <button onClick={() => fileRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 py-10 text-slate-400 hover:border-primary/40 hover:text-primary transition-colors">
                  <Upload className="w-6 h-6" />
                  <span className="text-[11px] font-black uppercase tracking-widest">{uploadingPhoto ? 'Uploading…' : 'Upload Team Photo'}</span>
                </button>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-slate-300 dark:text-zinc-600">
                  <Camera className="w-8 h-8 mb-2" />
                  <span className="text-xs">No photo uploaded</span>
                </div>
              )
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </div>

          {/* Photo Contact */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-5 space-y-4">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Photo Contact</p>
            <p className="text-xs text-slate-500 dark:text-zinc-500 leading-relaxed">Person to contact for all other pictures taken during the conference.</p>
            {canManage ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1"><User className="w-3 h-3" /> Name</label>
                  <input value={photoContactName} onChange={e => setPhotoContactName(e.target.value)}
                    placeholder="Contact person's name"
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/40 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1"><Phone className="w-3 h-3" /> Contact No</label>
                  <input value={photoContactNo} onChange={e => setPhotoContactNo(e.target.value)}
                    placeholder="+91 00000 00000"
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/40 text-slate-900 dark:text-white" />
                </div>
                <button onClick={saveGalleryContact} disabled={saving}
                  className="w-full rounded-xl bg-primary py-2.5 text-[11px] font-black uppercase tracking-wider text-primary-foreground disabled:opacity-50 hover:scale-[1.02] transition-transform">
                  {saving ? 'Saving…' : 'Save Contact'}
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{photoContactName || '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{photoContactNo || '—'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
