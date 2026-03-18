// app/(protected)/chat/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import ChatSidebar from '@/components/chat/ChatSidebar'
import ChatWindow from '@/components/chat/ChatWindow'
import { useAppUser } from '@/hooks/useAppUser'
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
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <ChatSidebar
        channels={channels}
        selectedChannelId={selectedChannelId}
        onSelectChannel={setSelectedChannelId}
        loading={loadingChannels}
        userUid={user?.uid || ''}
        userName={user?.displayName || user?.email || ''}
      />
      <ChatWindow
        key={selectedChannelId || 'none'}
        channel={selectedChannel}
        userUid={user?.uid || ''}
        onDeleteChannel={(id) => {
          setChannels(prev => prev.filter(c => c._id.toString() !== id))
          setSelectedChannelId(null)
        }}
      />
    </div>
  )
}
