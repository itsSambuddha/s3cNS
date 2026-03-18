// components/chat/ChatSidebar.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { IChannel } from '@/lib/db/models/Channel'
import { IconHash, IconLock, IconMessagePlus, IconUsers, IconSearch, IconX, IconLoader2 } from '@tabler/icons-react'
import { motion } from 'framer-motion'

interface ChatSidebarProps {
  channels: IChannel[]
  selectedChannelId: string | null
  onSelectChannel: (id: string) => void
  userUid: string
  userName: string
  loading?: boolean
}

export default function ChatSidebar({ 
  channels, 
  selectedChannelId, 
  onSelectChannel, 
  userUid,
  userName,
  loading 
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
    <div className="flex w-64 flex-col border-r bg-slate-50 dark:bg-[#030712] dark:border-white/5">
      <div className="flex h-16 items-center justify-between px-4 border-b dark:border-white/5">
        <h2 className="text-lg font-bold">Channels</h2>
        <button 
          onClick={() => setIsDmModalOpen(true)}
          className="p-1 hover:bg-slate-200 dark:hover:bg-white/5 rounded-lg transition-colors"
          title="New Direct Message"
        >
          <IconMessagePlus className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Groups Section */}
        <div>
          <div className="flex items-center gap-2 px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <IconUsers className="h-3 w-3" />
            <span>Groups</span>
          </div>
          <div className="space-y-0.5">
            {groups.map((channel) => (
              <button
                key={channel._id.toString()}
                onClick={() => onSelectChannel(channel._id.toString())}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all',
                  selectedChannelId === channel._id.toString()
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                    : 'text-slate-600 hover:bg-slate-200 dark:text-zinc-400 dark:hover:bg-white/5'
                )}
              >
                <IconHash className="h-4 w-4 shrink-0" />
                <span className="truncate">{channel.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* DMs Section */}
        <div>
          <div className="flex items-center gap-2 px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <IconMessagePlus className="h-3 w-3" />
            <span>Direct Messages</span>
          </div>
          <div className="space-y-0.5">
            {dms.map((channel) => {
              const parts = channel.name.split(' & ')
              const otherName = parts.find(p => !p.toLowerCase().includes(userName.toLowerCase())) || channel.name
              const initial = otherName.match(/[a-zA-Z]/)?.[0] || '?'
              return (
                <button
                  key={channel._id.toString()}
                  onClick={() => onSelectChannel(channel._id.toString())}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all',
                    selectedChannelId === channel._id.toString()
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                      : 'text-slate-600 hover:bg-slate-200 dark:text-zinc-400 dark:hover:bg-white/5'
                  )}
                >
                  <div className="h-5 w-5 rounded-full bg-slate-300 dark:bg-zinc-700 flex items-center justify-center text-[8px] font-bold text-white uppercase shrink-0">
                    {initial}
                  </div>
                  <span className="truncate text-left">{otherName}</span>
                </button>
              )
            })}
            {dms.length === 0 && (
              <p className="px-3 text-[10px] text-slate-400 italic">No recent DMs</p>
            )}
          </div>
        </div>
      </div>

      {/* DM Modal */}
      {isDmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between border-b p-4 dark:border-white/5">
              <h3 className="font-bold">New Direct Message</h3>
              <button onClick={() => setIsDmModalOpen(false)}><IconX className="h-5 w-5" /></button>
            </div>
            
            <div className="p-4">
              <div className="relative mb-4">
                <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search members..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:border-sky-500 focus:outline-none dark:border-white/10 dark:bg-zinc-800"
                />
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1">
                {loadingContacts ? (
                  <div className="flex h-20 items-center justify-center"><IconLoader2 className="h-5 w-5 animate-spin" /></div>
                ) : filteredContacts.map(contact => (
                  <button
                    key={contact.uid}
                    onClick={() => startDm(contact.uid)}
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-800">
                      {contact.photoURL ? <img src={contact.photoURL} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center font-bold text-slate-400">{contact.displayName?.[0] || contact.email[0]}</div>}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{contact.displayName || contact.email.split('@')[0]}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{contact.secretariatRole || contact.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
