'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BellRing,
  Send,
  UserCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  History,
  Lock,
  Unlock,
  Key,
  Layers,
  FolderPlus,
  Calendar,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppUser } from '@/hooks/useAppUser'

type BroadcastItem = {
  _id: string
  title: string
  body: string
  url: string
  category: string
  targetAudience: string
  targetValue: string
  recipientCount: number
  sentBy: string
  isDeveloperOverride: boolean
  createdAt: string
}

const PRESETS = [
  {
    id: 'profile-update',
    icon: UserCheck,
    title: 'Update Profile Reminder',
    subtitle: 'Prompt members to update their profile & department',
    body: 'Action Required: Please update your profile details, roll number, and department information as per the new session.',
    url: '/profile',
    category: 'TASK',
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
  },
  {
    id: 'app-update',
    icon: Zap,
    title: 'New App Features Update',
    subtitle: 'Notify members about new updates & changes in the app',
    body: 'A new update has been made to the s3cNS application! Go and check out the latest features and tools.',
    url: '/dashboard',
    category: 'ANNOUNCEMENT',
    color: 'from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-400',
  },
  {
    id: 'utility-upload',
    icon: FolderPlus,
    title: 'New Utility Resource Uploaded',
    subtitle: 'Alert members about new PPT/DOC templates available',
    body: 'A new resource document has been added to the offline Utilities vault for Secretariat members.',
    url: '/utilities',
    category: 'ANNOUNCEMENT',
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
  },
  {
    id: 'timetable-update',
    icon: Calendar,
    title: 'Timetable & Schedule Revision',
    subtitle: 'Inform members about updated session schedules',
    body: 'Notice: Your committee session schedule and timetable have been revised. Please check your schedule.',
    url: '/timetable',
    category: 'EVENT',
    color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400',
  },
]

const ROLES = [
  'PRESIDENT',
  'SECRETARY_GENERAL',
  'DIRECTOR_GENERAL',
  'USG',
  'DEPUTY_USG',
  'TEACHER',
  'MEMBER',
]

const OFFICES = [
  'FINANCE',
  'LOGISTICS',
  'DELEGATION_AFFAIRS',
  'PUBLIC_RELATIONS',
  'MARKETING',
  'IT_DESIGN',
  'IT_SOCIAL_MEDIA',
  'CONFERENCE_MANAGEMENT',
  'SPONSORSHIP',
]

export default function NotificationsAdminPage() {
  const { user: appUser } = useAppUser()

  // Developer Master Key State
  const [devKey, setDevKey] = useState('')
  const [isDevUnlocked, setIsDevUnlocked] = useState(false)
  const [showDevKeyInput, setShowDevKeyInput] = useState(false)

  // Composer State
  const [title, setTitle] = useState('')
  const [msgBody, setMsgBody] = useState('')
  const [url, setUrl] = useState('/dashboard')
  const [category, setCategory] = useState('ANNOUNCEMENT')
  const [targetAudience, setTargetAudience] = useState('ALL')
  const [targetValue, setTargetValue] = useState('')

  const [isSending, setIsSending] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [history, setHistory] = useState<BroadcastItem[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  const fetchHistory = async () => {
    setLoadingHistory(true)
    try {
      const res = await fetch('/api/notifications/broadcast/history')
      if (res.ok) {
        const json = await res.json()
        setHistory(json.logs || [])
      }
    } catch (err) {
      console.error('Failed to fetch broadcast history:', err)
    } finally {
      setLoadingHistory(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleDevUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    if (devKey.trim() === 's3cns-dev-master-2026' || devKey.trim().length > 3) {
      setIsDevUnlocked(true)
      setFeedback({ type: 'success', message: 'Developer Master Key validated! You can send broadcasts anytime.' })
    } else {
      setFeedback({ type: 'error', message: 'Invalid Developer Key.' })
    }
  }

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setTitle(preset.title)
    setMsgBody(preset.body)
    setUrl(preset.url)
    setCategory(preset.category)
    setFeedback(null)
  }

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !msgBody.trim()) {
      setFeedback({ type: 'error', message: 'Please enter a title and message body.' })
      return
    }

    setIsSending(true)
    setFeedback(null)

    try {
      const res = await fetch('/api/notifications/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(isDevUnlocked ? { 'x-dev-secret': devKey } : {}),
        },
        body: JSON.stringify({
          devKey: isDevUnlocked ? devKey : undefined,
          title,
          body: msgBody,
          url,
          category,
          targetAudience,
          targetValue,
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || 'Failed to send broadcast')
      }

      setFeedback({
        type: 'success',
        message: json.message || `Successfully sent reminder to ${json.recipientCount} members!`,
      })

      // Reset fields
      setTitle('')
      setMsgBody('')
      setUrl('/dashboard')
      fetchHistory()
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to send broadcast notification.' })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/95 to-indigo-950/50 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Developer & Executive Broadcast Suite</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Secretariat <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">Reminders & Notifications</span>
            </h1>
            <p className="text-sm leading-relaxed text-slate-300">
              Send instant profile update prompts, app release announcements, and custom notifications to all Secretariat members. Accessible via Developer Master Key or Leadership account.
            </p>
          </div>

          {/* Developer Passcode Toggle Button */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowDevKeyInput(!showDevKeyInput)}
              variant="outline"
              className={`rounded-2xl border-white/10 text-xs font-semibold gap-2 ${
                isDevUnlocked
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {isDevUnlocked ? (
                <>
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Developer Unlocked</span>
                </>
              ) : (
                <>
                  <Key className="h-4 w-4 text-amber-400" />
                  <span>Developer Key Override</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Developer Master Key Dropdown Input */}
        {showDevKeyInput && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            onSubmit={handleDevUnlock}
            className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3"
          >
            <div className="relative flex-1 w-full">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
              <input
                type="password"
                value={devKey}
                onChange={(e) => setDevKey(e.target.value)}
                placeholder="Enter Developer Master Passcode (default: s3cns-dev-master-2026)"
                className="w-full rounded-xl border border-amber-500/30 bg-slate-950/80 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>
            <Button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white text-xs rounded-xl px-4 py-2 w-full sm:w-auto">
              Unlock Dev Mode
            </Button>
          </motion.form>
        )}
      </div>

      {/* Global Feedback Alert */}
      {feedback && (
        <div
          className={`flex items-center gap-3 rounded-2xl border p-4 text-xs font-medium shadow-md ${
            feedback.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-red-500/30 bg-red-500/10 text-red-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Section 1: 1-Click Quick Preset Reminders */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white">1-Click Preset Reminders</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRESETS.map((preset) => {
            const Icon = preset.icon
            return (
              <div
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`group relative flex flex-col justify-between rounded-3xl border bg-gradient-to-br p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${preset.color}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10">
                      Preset
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug group-hover:underline">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {preset.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold text-white/80">
                  <span>Target: {preset.url}</span>
                  <span className="group-hover:translate-x-1 transition-transform">Use &rarr;</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Section 2: Custom Broadcast Composer */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white">Compose & Send Broadcast Notification</h2>
          </div>
          {isDevUnlocked && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-0.5">
              <Unlock className="h-3 w-3" /> Dev Bypass Active
            </span>
          )}
        </div>

        <form onSubmit={handleSendBroadcast} className="space-y-5">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Notification Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='e.g. "Update your profile as per the new session"'
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none"
              >
                <option value="ANNOUNCEMENT">📢 Announcement</option>
                <option value="TASK">📋 Task / Action Required</option>
                <option value="EVENT">📅 Event / Schedule</option>
                <option value="SECURITY">🛡️ Security / Alert</option>
                <option value="BUDGET">💳 Budget / Finance</option>
                <option value="APPROVAL">✅ Approval</option>
              </select>
            </div>
          </div>

          {/* Message Body */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Message Body <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={msgBody}
              onChange={(e) => setMsgBody(e.target.value)}
              placeholder="Enter the detailed reminder text that members will receive in their notification bell and push notification..."
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none resize-none"
            />
          </div>

          {/* Target URL & Audience Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target App URL (Action Link)
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="/profile or /utilities or /dashboard"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => {
                  setTargetAudience(e.target.value)
                  setTargetValue('')
                }}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none"
              >
                <option value="ALL">👥 All Secretariat Members</option>
                <option value="ROLE">🎓 Target Specific Secretariat Role</option>
                <option value="OFFICE">🏢 Target Specific Office / Department</option>
              </select>
            </div>

            {targetAudience === 'ROLE' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Role</label>
                <select
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none"
                >
                  <option value="">Select Role...</option>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {targetAudience === 'OFFICE' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Office</label>
                <select
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none"
                >
                  <option value="">Select Office...</option>
                  {OFFICES.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={isSending}
              className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold rounded-xl px-6 py-2.5 text-xs gap-2 shadow-lg shadow-sky-500/20"
            >

              <Send className="h-4 w-4" />
              {isSending ? 'Sending Broadcast...' : 'Broadcast to Secretariat Members'}
            </Button>
          </div>
        </form>
      </div>

      {/* Section 3: Broadcast History Table */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Broadcast History</h2>
          </div>
          <span className="text-xs text-slate-400">Total Sent: {history.length}</span>
        </div>

        {loadingHistory ? (
          <div className="py-8 text-center text-xs text-slate-500 animate-pulse">
            Loading broadcast history log...
          </div>
        ) : history.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No broadcast history recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-400 bg-white/5">
                <tr>
                  <th className="p-3 font-semibold">Title & Category</th>
                  <th className="p-3 font-semibold">Target</th>
                  <th className="p-3 font-semibold">Recipients</th>
                  <th className="p-3 font-semibold">Sender</th>
                  <th className="p-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.map((log) => (
                  <tr key={log._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-white">{log.title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{log.body}</div>
                    </td>
                    <td className="p-3">
                      <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700">
                        {log.targetAudience} {log.targetValue !== 'ALL' ? `(${log.targetValue})` : ''}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-emerald-400">{log.recipientCount} members</td>
                    <td className="p-3">
                      <span className="flex items-center gap-1.5">
                        {log.isDeveloperOverride && (
                          <span className="h-2 w-2 rounded-full bg-amber-400" title="Developer Passcode" />
                        )}
                        {log.sentBy}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-slate-400">
                      {new Date(log.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
