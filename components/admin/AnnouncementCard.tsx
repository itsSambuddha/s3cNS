// components/admin/AnnouncementCard.tsx
"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Send,
  Mail,
  Bell,
  MessageCircle,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Search,
  X,
  UserCheck,
  Megaphone,
  Zap
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

type Platform = 'email' | 'push'
type RecipientGroup = 'SENIOR_SECRETARIAT' | 'ALL_APPROVED' | 'INDIVIDUAL'

interface Member {
  _id: string
  displayName: string
  email: string
  photoURL?: string
  secretariatRole?: string
}

interface SendResults {
  totalRecipients: number
  emailsSent: number
  emailsFailed: number
  pushSent: boolean
  errors: string[]
  unreachablePushCount?: number
}

interface MemberWithPush extends Member {
  hasPushEnabled?: boolean
}

export function AnnouncementCard() {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [platforms, setPlatforms] = useState<Platform[]>(['email', 'push'])
  const [recipientsGroup, setRecipientsGroup] = useState<RecipientGroup>('SENIOR_SECRETARIAT')
  const [selectedIndividualIds, setSelectedIndividualIds] = useState<string[]>([])
  const [members, setMembers] = useState<MemberWithPush[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetchingMembers, setFetchingMembers] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<SendResults | null>(null)

  useEffect(() => {
    if (isOpen && recipientsGroup === 'INDIVIDUAL') {
      loadMembers()
    }
  }, [isOpen, recipientsGroup])

  const loadMembers = async (q = "") => {
    try {
      setFetchingMembers(true)
      const res = await fetch(`/api/secretariat/members?view=active&q=${encodeURIComponent(q)}`)
      if (res.ok) {
        const data = await res.json()
        setMembers(data.members || [])
      }
    } catch (err) {
      console.error("Failed to load members", err)
    } finally {
      setFetchingMembers(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (recipientsGroup === 'INDIVIDUAL') {
        loadMembers(searchQuery)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const togglePlatform = (p: Platform) => {
    setPlatforms(prev => 
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    )
  }

  const toggleMember = (id: string) => {
    setSelectedIndividualIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleSend = async () => {
    if (!title || !content) {
      setError("Please fill in both title and content.")
      return
    }
    if (platforms.length === 0) {
      setError("Please select at least one platform.")
      return
    }
    if (recipientsGroup === 'INDIVIDUAL' && selectedIndividualIds.length === 0) {
      setError("Please select at least one recipient.")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setResults(null)

      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          platforms,
          recipientsGroup,
          individualIds: recipientsGroup === 'INDIVIDUAL' ? selectedIndividualIds : undefined
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send announcement")

      setResults(data.results)
      setTitle("")
      setContent("")
      setSelectedIndividualIds([])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSendTestPush = async () => {
    try {
      setLoading(true)
      setError(null)
      setResults(null)
      
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: "Test Push Notification",
          content: "If you are reading this, your device is correctly registered and receiving native pushes! 🎉",
          platforms: ['push'],
          recipientsGroup: 'INDIVIDUAL',
          individualIds: [] // API will detect empty array + INDIVIDUAL and use current user for test
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send test push")
      
      setIsOpen(false) // Close composer on success
      alert("Test push dispatched! Please check your native notifications (and ensure DND is off).")
    } catch (err: any) {
      setError(`Test Push Failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
           whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.1)" }}
           transition={{ type: "spring", stiffness: 260, damping: 22 }}
           className="group relative overflow-hidden rounded-[2rem] border border-blue-200/60 bg-white p-6 shadow-xl shadow-blue-500/5 dark:border-white/5 dark:bg-white/5 cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-[40%] h-full bg-blue-400/5 blur-[60px] pointer-events-none group-hover:bg-blue-400/10 transition-colors" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/60 bg-blue-50/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
                  <Megaphone className="h-3 w-3" />
                  <span>Broadcast System</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 rounded-full text-[9px] font-bold bg-blue-50/50 hover:bg-blue-100/50 text-blue-600 border border-blue-200/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendTestPush();
                  }}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-2 w-2 animate-spin mr-1" /> : <Bell className="h-2 w-2 mr-1" />}
                  Test Push
                </Button>
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Send Announcement
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-zinc-400">
                  Broadcast messages to the entire team or specific members via Email and Push Notifications.
                </p>
              </div>
            </div>
            <div className="shrink-0">
               <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2.5 text-[11px] font-black uppercase tracking-wider text-white shadow-lg shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
                Open Composer →
              </span>
            </div>
          </div>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-[2rem] border-slate-200 bg-white p-0 shadow-2xl dark:border-white/5 dark:bg-[#030712]">
        <div className="flex flex-col h-[85vh] sm:h-auto max-h-[90vh]">
          <DialogHeader className="p-6 border-b border-slate-100 dark:border-white/5">
            <DialogTitle className="text-2xl font-black tracking-tight flex items-center justify-between">
              <span>Announcement Composer</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full text-[10px] font-black uppercase tracking-widest border-blue-200 text-blue-600 hover:bg-blue-50"
                onClick={handleSendTestPush}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Bell className="h-3 w-3 mr-2" />}
                Send Test Push to Me
              </Button>
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-slate-500">
              Compose and dispatch a broadcast across multiple channels.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <div className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Header Title</Label>
                <Input 
                  id="title"
                  placeholder="e.g. Important Update regarding Profile Pictures"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl border-slate-200 h-11 transition-all focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Message Content</Label>
                <Textarea 
                  id="content"
                  placeholder="Markdown or plain text..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  className="rounded-xl border-slate-200 resize-none transition-all focus:ring-blue-500/20"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Recipient Group</Label>
                  <Select value={recipientsGroup} onValueChange={(v: RecipientGroup) => {
                    setRecipientsGroup(v)
                    if (v !== 'INDIVIDUAL') setSelectedIndividualIds([])
                  }}>
                    <SelectTrigger className="rounded-xl border-slate-200 h-11">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="SENIOR_SECRETARIAT">Senior Secretariat</SelectItem>
                      <SelectItem value="ALL_APPROVED">All Approved Members</SelectItem>
                      <SelectItem value="INDIVIDUAL">Specific Individual(s)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Broadcast Channels</Label>
                  <div className="flex flex-wrap gap-2">
                    <PlatformToggle 
                      active={platforms.includes('email')} 
                      onClick={() => togglePlatform('email')}
                      icon={Mail}
                      label="Email"
                    />
                    <PlatformToggle 
                      active={platforms.includes('push')} 
                      onClick={() => togglePlatform('push')}
                      icon={Bell}
                      label="Push"
                    />
                  </div>
                  {platforms.includes('push') && (
                    <p className="mt-2 text-[10px] font-medium text-slate-400 italic">
                      Reach note: Only users with the portal app installed will receive native buzzing.
                    </p>
                  )}
                </div>
              </div>

              {recipientsGroup === 'INDIVIDUAL' && (
                <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-white/5 w-full overflow-hidden">
                   <div className="flex items-center justify-between mb-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Selected Members ({selectedIndividualIds.length})</Label>
                    {selectedIndividualIds.length > 0 && (
                      <button 
                        onClick={() => setSelectedIndividualIds([])}
                        className="text-[10px] font-black uppercase tracking-wider text-rose-600 hover:rose-700"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-10 text-xs rounded-xl border-slate-200 bg-white dark:bg-slate-900"
                    />
                    {fetchingMembers && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />}
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar w-full">
                    {members.map((m, idx) => (
                      <div 
                        key={m._id || m.email || idx}
                        onClick={() => toggleMember(m._id)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border border-transparent w-full",
                          selectedIndividualIds.includes(m._id) 
                            ? "bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/30" 
                            : "hover:bg-white dark:hover:bg-white/5 hover:border-slate-200 dark:hover:border-white/10"
                        )}
                      >
                        <div className="h-9 w-9 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 border border-white dark:border-white/5 shadow-sm">
                          {m.photoURL ? (
                            <img src={m.photoURL} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500 bg-slate-100 uppercase">
                              {m.displayName?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-[13px] font-bold text-slate-900 dark:text-white truncate">{m.displayName}</p>
                            {m.hasPushEnabled && (
                              <Badge variant="secondary" className="h-4 px-1 rounded text-[8px] bg-blue-100/50 text-blue-600 border-none font-black uppercase tracking-tighter">
                                <Zap className="h-2 w-2 mr-0.5 fill-current" />
                                Push
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">{m.secretariatRole} • {m.email}</p>
                        </div>
                        {selectedIndividualIds.includes(m._id) && (
                          <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" />
                        )}
                      </div>
                    ))}
                    {members.length === 0 && !fetchingMembers && (
                      <p className="text-center py-6 text-[13px] text-slate-400 italic">No members found matching your search.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <AnimatePresence>
              {(error || (results && results.errors.length > 0)) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-3"
                >
                  {error && (
                    <div className="flex items-start gap-3 rounded-2xl bg-rose-50 p-4 text-[13px] text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20">
                      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-black uppercase tracking-wider text-[11px]">System Error</p>
                        <p className="font-medium">{error}</p>
                      </div>
                    </div>
                  )}

                  {results && results.errors.length > 0 && (
                    <div className="flex flex-col gap-3 rounded-2xl bg-amber-50 p-4 text-[13px] text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p className="font-black uppercase tracking-wider text-[11px]">Dispatch Issues Detected</p>
                      </div>
                      <div className="space-y-2 border-t border-amber-200/50 pt-3 dark:border-amber-500/20">
                        <p className="font-bold text-xs">Some messages could not be delivered:</p>
                        <ul className="list-inside list-disc space-y-1 text-xs opacity-90">
                          {results.errors.map((err, i) => (
                            <li key={i} className="leading-relaxed font-medium">
                              {err}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {results && results.errors.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-4"
                >
                  <div className="flex flex-col gap-3 rounded-2xl p-4 text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 shadow-sm shadow-emerald-500/5">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        <p className="font-black uppercase tracking-wider text-[11px]">Broadcast Summary</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 border-t border-emerald-200/50 pt-4 dark:border-emerald-500/20">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black opacity-60 tracking-widest">Recipients</p>
                        <p className="text-lg font-black">{results.totalRecipients}</p>
                      </div>
                      {platforms.includes('email') && (
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-black opacity-60 tracking-widest">Emails Delivered</p>
                          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                            {results.emailsSent} / {results.totalRecipients}
                          </p>
                        </div>
                      )}
                      {platforms.includes('push') && (
                        <div className="space-y-3 col-span-2 border-t border-emerald-200/50 pt-3 dark:border-emerald-500/20">
                          <p className="text-[10px] uppercase font-black opacity-60 tracking-widest">Push Notification Status</p>
                          <div className="flex flex-col gap-2">
                             <p className="text-sm font-bold flex items-center gap-2">
                              {results.pushSent ? (
                                <>
                                  <CheckCircle2 className="h-4 w-4" />
                                  <span>Broadcast successfully dispatched.</span>
                                </>
                              ) : 'Failed to dispatch push.'}
                            </p>
                            {results.unreachablePushCount && results.unreachablePushCount > 0 && (
                              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-amber-700 dark:text-amber-400">
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1">Limited Push Reach</p>
                                <p className="font-medium text-[11px] leading-relaxed">
                                  {results.unreachablePushCount} recipients do not have registered devices. 
                                  They received the **Email** and **In-app Bell**, but no phone buzzing.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 rounded-b-[2rem]">
            <Button 
              onClick={handleSend} 
              disabled={loading}
              className="w-full rounded-2xl bg-blue-600 h-14 text-[15px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-blue-700 hover:scale-[1.01] active:scale-95 shadow-xl shadow-blue-500/25"
            >
              {loading ? (
                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
              ) : (
                <Send className="mr-3 h-6 w-6" />
              )}
              {loading ? "Processing Broadcast..." : "Dispatch Broadcast"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function PlatformToggle({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-[12px] font-black uppercase tracking-widest transition-all",
        active 
          ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200 shadow-sm" 
          : "border-slate-200 bg-white text-slate-400 hover:border-slate-300 dark:border-white/5 dark:bg-slate-900 dark:text-slate-500 hover:bg-slate-50"
      )}
    >
      <Icon className={cn("h-4 w-4", active ? "text-blue-600" : "text-slate-400")} />
      <span>{label}</span>
    </button>
  )
}
