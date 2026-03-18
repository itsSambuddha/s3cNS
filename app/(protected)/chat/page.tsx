// app/(protected)/chat/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import ChatSidebar from '@/components/chat/ChatSidebar'
import ChatWindow from '@/components/chat/ChatWindow'
import { useAppUser } from '@/hooks/useAppUser'
import { cn } from '@/lib/utils'
import type { IChannel } from '@/lib/db/models/Channel'
import { IconLoader2 } from '@tabler/icons-react'

export default function ChatPage() {
  const { user, loading: userLoading } = useAppUser()
  const [channels, setChannels] = useState<IChannel[]>([])
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null)
  const [loadingChannels, setLoadingChannels] = useState(true)

  useEffect(() => {
    async function fetchChannels() {
      try {
        const response = await fetch('/api/chat/channels')
        const data = await response.json()
        if (response.ok) {
          setChannels(data.channels)
          setSelectedChannelId(prev => (prev || (data.channels.length > 0 ? data.channels[0]._id.toString() : null)))
        }
      } catch (err) {
        console.error('Failed to fetch channels:', err)
      } finally {
        setLoadingChannels(false)
      }
    }

    if (user) {
      fetchChannels()
    }
  }, [user]) // Removed selectedChannelId to prevent auto-reselection loops

  const selectedChannel = channels.find((c) => c._id.toString() === selectedChannelId) || null

  if (userLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <IconLoader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden relative bg-[#f2f3f5] dark:bg-[#0b141a] p-0 md:p-3 lg:p-4">
      <div className="flex flex-1 w-full h-full bg-white dark:bg-[#313338] shadow-2xl rounded-none md:rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 relative">
        {/* Sidebar View */}
        <div className={cn(
          "h-full border-r dark:border-white/5 transition-all duration-300",
          selectedChannelId ? "hidden md:block md:w-80" : "flex-1 md:w-80"
        )}>
          <ChatSidebar
            channels={channels}
            selectedChannelId={selectedChannelId}
            onSelectChannel={setSelectedChannelId}
            loading={loadingChannels}
            userUid={user?.uid || ''}
            userName={user?.displayName || user?.email || ''}
            onChannelCreated={(newChannel) => {
              setChannels(prev => {
                if (prev.some(c => c._id.toString() === newChannel._id.toString())) return prev
                return [newChannel, ...prev]
              })
            }}
          />
        </div>

        {/* Window View */}
        <div className={cn(
          "flex-1 h-full",
          !selectedChannelId ? "hidden md:block" : "block"
        )}>
          <ChatWindow
            key={selectedChannelId || 'none'}
            channel={selectedChannel}
            userUid={user?.uid || ''}
            onDeleteChannel={(id: string) => {
              setChannels(prev => prev.filter(c => c._id.toString() !== id))
              setSelectedChannelId(null)
            }}
            onBack={() => setSelectedChannelId(null)}
          />
        </div>
      </div>
    </div>
  )
}
