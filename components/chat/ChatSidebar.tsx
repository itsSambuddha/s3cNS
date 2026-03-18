// components/chat/ChatSidebar.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { IChannel } from '@/lib/db/models/Channel'
import { IconHash, IconMessagePlus, IconUsers, IconSearch, IconX, IconLoader2 } from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ChatSidebarProps {
  channels: IChannel[]
  selectedChannelId: string | null
  onSelectChannel: (id: string) => void
  userUid: string
  userName: string
  loading?: boolean
  onChannelCreated?: (channel: IChannel) => void
}

export default function ChatSidebar({ 
  channels, 
  selectedChannelId, 
  onSelectChannel, 
  userUid,
  userName,
  loading,
  onChannelCreated
}: ChatSidebarProps) {
  const [isDmModalOpen, setIsDmModalOpen] = useState(false)
  const [contacts, setContacts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loadingContacts, setLoadingContacts] = useState(false)

  const fetchContacts = async () => {
    setLoadingContacts(true)
    try {
      const res = await fetch('/api/chat/contacts')
      const data = await res.json()
      setContacts(data.contacts || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingContacts(false)
    }
  }

  useEffect(() => {
    if (isDmModalOpen) fetchContacts()
  }, [isDmModalOpen])

  const startDm = async (targetUid: string) => {
    try {
      const res = await fetch('/api/chat/channels/dm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUid })
      })
      const newChannel = await res.json()
      if (onChannelCreated) onChannelCreated(newChannel)
      onSelectChannel(newChannel._id.toString())
      setIsDmModalOpen(false)
    } catch (err) {
      alert('Failed to start DM')
    }
  }

  const filteredContacts = contacts.filter(c => 
    c.displayName?.toLowerCase().includes(search.toLowerCase()) || 
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  const groups = channels.filter(c => c.type === 'GROUP')
  const dms = channels.filter(c => c.type === 'DM')

  return (
    <div className="flex flex-col h-full bg-[#f2f3f5] dark:bg-[#2b2d31] transition-colors overflow-hidden">
      {/* Sidebar Header */}
      <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-[#949ba4]">
            Comm Center
          </h2>
          <span className="rounded-full bg-amber-400 dark:bg-amber-500 px-2 py-0.5 text-[10px] font-black text-amber-950 shadow-[0_0_15px_rgba(251,191,36,0.5)] animate-pulse">
            BETA
          </span>
        </div>
        <button 
          onClick={() => setIsDmModalOpen(true)}
          className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-all text-sky-600 dark:text-sky-400 active:scale-90"
        >
          <IconMessagePlus className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar pb-10">
        {/* Groups Section */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 mb-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-[#949ba4]">
              <IconUsers className="h-3 w-3" />
              <span>Channels</span>
            </div>
          </div>
          <div className="space-y-0.5">
            {groups.map((channel) => {
              const isActive = selectedChannelId === channel._id.toString()
              return (
                <button
                  key={channel._id.toString()}
                  onClick={() => onSelectChannel(channel._id.toString())}
                  className={cn(
                    'group relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-sky-500 text-white shadow-[0_4px_12px_rgba(14,165,233,0.3)]'
                      : 'text-slate-600 dark:text-[#949ba4] hover:bg-slate-200 dark:hover:bg-[#35373c] hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  <div className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all",
                    isActive ? "bg-white/20" : "bg-black/5 dark:bg-black/20"
                  )}>
                    <IconHash className="h-4 w-4" />
                  </div>
                  <span className="truncate flex-1 text-left">{channel.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* DMs Section */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 mb-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-[#949ba4]">
              <IconMessagePlus className="h-3 w-3" />
              <span>Direct Messages</span>
            </div>
          </div>
          <div className="space-y-0.5">
            {dms.map((channel) => {
              const parts = channel.name.split(' & ')
              const otherName = parts.find(p => !p.toLowerCase().includes(userName.toLowerCase())) || channel.name
              const initial = otherName.match(/[a-zA-Z]/)?.[0] || '?'
              const isActive = selectedChannelId === channel._id.toString()
              
              return (
                <button
                  key={channel._id.toString()}
                  onClick={() => onSelectChannel(channel._id.toString())}
                  className={cn(
                    'group relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-all duration-200',
                    isActive
                      ? 'bg-white dark:bg-[#404249] shadow-md border border-black/5 dark:border-white/5'
                      : 'text-slate-600 dark:text-[#949ba4] hover:bg-slate-200 dark:hover:bg-[#35373c] hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  {/* Active Indicator Pill */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="absolute -left-1 w-1 h-6 bg-sky-500 rounded-r-full" 
                    />
                  )}
                  
                  <div className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-black uppercase transition-all shadow-sm",
                    isActive 
                      ? "bg-sky-500 text-white" 
                      : "bg-white dark:bg-[#1e1f22] text-slate-500 dark:text-[#949ba4] border border-black/5 dark:border-white/5"
                  )}>
                    {initial}
                  </div>
                  <div className="flex flex-1 flex-col items-start overflow-hidden">
                    <span className={cn(
                      "w-full truncate font-bold leading-tight",
                      isActive ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-[#949ba4]"
                    )}>
                      {otherName.replace(/\(.*?\)\s/g, '')}
                    </span>
                    <span className={cn(
                      "w-full truncate text-[10px] mt-0.5 font-medium",
                      isActive ? "text-sky-500" : "text-slate-400 dark:text-zinc-500"
                    )}>
                      {channel.lastMessage?.content || 'Say hello...'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* DM Modal */}
      <AnimatePresence>
        {isDmModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDmModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#313338] border border-black/5 dark:border-white/10"
            >
              <div className="flex items-center justify-between p-6 pb-2">
                <h3 className="text-xl font-black tracking-tight">Select Member</h3>
                <button onClick={() => setIsDmModalOpen(false)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                  <IconX className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 pt-2">
                <div className="relative mb-6">
                  <IconSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search by name or role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-2xl border-none bg-slate-100 py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-sky-500/50 outline-none dark:bg-[#1e1f22]"
                  />
                </div>

                <div className="max-h-[400px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {loadingContacts ? (
                    <div className="flex h-32 items-center justify-center flex-col gap-2">
                      <IconLoader2 className="h-6 w-6 animate-spin text-sky-500" />
                      <p className="text-xs text-slate-400">Fetching users...</p>
                    </div>
                  ) : filteredContacts.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 text-sm">No members found matching "{search}"</div>
                  ) : filteredContacts.map(contact => (
                    <button
                      key={contact.uid}
                      onClick={() => startDm(contact.uid)}
                      className="group flex w-full items-center gap-4 rounded-2xl p-3 text-left hover:bg-sky-500/5 dark:hover:bg-sky-500/10 transition-all border border-transparent hover:border-sky-500/20"
                    >
                      <div className="relative shrink-0">
                        <div className="h-12 w-12 overflow-hidden rounded-full transition-transform group-hover:scale-105 shadow-md">
                          {contact.photoURL ? (
                            <img src={contact.photoURL} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-sky-500 text-white font-black text-lg">
                              {(contact.displayName || contact.email)[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black truncate">{contact.displayName || contact.email.split('@')[0]}</p>
                        <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest truncate">{contact.secretariatRole || contact.role}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <IconMessagePlus className="h-5 w-5 text-sky-500" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
