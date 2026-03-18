// hooks/useChat.ts
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { IMessage } from '@/lib/db/models/Message'
import type { IChannel } from '@/lib/db/models/Channel'

/**
 * Custom hook for managing real-time chat state via polling.
 * Pauses fetching when the tab is hidden to conserve resources.
 */
export function useChat(channelId: string | null) {
  const [messages, setMessages] = useState<IMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState(true)
  
  const lastFetchRef = useRef<string | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchMessages = useCallback(async (isInitial = false) => {
    if (!channelId) return

    try {
      if (isInitial && messages.length === 0) setLoading(true)
      
      const url = (isInitial || !lastFetchRef.current)
        ? `/api/chat/messages?channelId=${channelId}&limit=50`
        : `/api/chat/messages?channelId=${channelId}&since=${lastFetchRef.current}`

      const response = await fetch(url)
      
      if (response.status === 404) {
        setIsPolling(false)
        return
      }
      
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to fetch messages')

      if (isInitial) {
        if (data.messages?.length > 0) {
          lastFetchRef.current = data.messages[data.messages.length - 1].createdAt
          setMessages((prev) => {
            // Merge and avoid duplicates
            const existingIds = new Set(prev.map(m => m._id.toString()))
            const newUniqueMsgs = data.messages.filter((m: any) => !existingIds.has(m._id.toString()))
            
            // Update readBy for existing messages if they've changed
            const updatedPrev = prev.map(m => {
              const match = data.messages.find((nm: any) => nm._id.toString() === m._id.toString())
              return match ? { ...m, readBy: match.readBy || [] } : m
            })

            return [...updatedPrev, ...newUniqueMsgs]
          })
        }
      } else if (data.messages && data.messages.length > 0) {
        setMessages((prev) => {
          const existingIds = new Set(prev.map(m => m._id.toString()))
          const newUniqueMsgs = data.messages.filter((m: any) => !existingIds.has(m._id.toString()))
          if (newUniqueMsgs.length === 0) return prev
          return [...prev, ...newUniqueMsgs]
        })
        lastFetchRef.current = data.messages[data.messages.length - 1].createdAt
      }
      
      setError(null)
    } catch (err: any) {
      console.error('Chat polling error:', err)
      setError(err.message)
    } finally {
      if (isInitial) setLoading(false)
    }
  }, [channelId])

  // Handle Visibility Change
  useEffect(() => {
    const handleVisibility = () => {
      setIsPolling(!document.hidden)
      if (!document.hidden && channelId) {
        fetchMessages(false) // Catch up immediately on focus
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [channelId, fetchMessages])

  // Polling Trigger
  useEffect(() => {
    // Reset state on channel change
    setMessages([])
    lastFetchRef.current = null
    
    if (!channelId) return

    fetchMessages(true)

    const interval = setInterval(() => {
      if (isPolling) {
        fetchMessages(false)
      }
    }, 3000)

    pollingIntervalRef.current = interval
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
    }
  }, [channelId, isPolling, fetchMessages])

  const sendMessage = async (content: string, attachments: any[] = [], replyTo?: string) => {
    if (!channelId || !content.trim()) return

    try {
      // Optimistic Update
      const tempId = `temp-${Date.now()}`
      const tempMsg: any = {
        _id: tempId,
        channelId,
        senderId: 'me', // Will be replaced by real user info in UI usually, or use user.uid if available
        senderName: 'You',
        content,
        attachments: attachments || [],
        replyTo: replyTo || undefined,
        readBy: [],
        createdAt: new Date().toISOString(),
        isOptimistic: true // Marker for UI
      }
      
      setMessages(prev => [...prev, tempMsg])

      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId, content, attachments, replyTo }),
      })
      const data = await response.json()

      if (!response.ok) {
        // Rollback optimistic update on error
        setMessages(prev => prev.filter(m => m._id.toString() !== tempId))
        throw new Error(data.error || 'Failed to send message')
      }

      // Replace optimistic message with real message
      setMessages(prev => prev.map(m => m._id.toString() === tempId ? data.message : m))
      lastFetchRef.current = data.message.createdAt
      
      return data.message
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const editMessage = async (messageId: string, content: string) => {
    try {
      const response = await fetch(`/api/chat/messages/${messageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to edit message')

      setMessages((prev) => prev.map((m) => ((m._id as any)?.toString() === messageId ? data.message : m)))
      return data.message
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const deleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/chat/messages/${messageId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to delete message')

      setMessages((prev) =>
        prev.filter((m) => (m._id as any)?.toString() !== messageId) as IMessage[]
      )
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const reactToMessage = async (messageId: string, emoji: string) => {
    try {
      const response = await fetch(`/api/chat/messages/${messageId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to react')

      setMessages((prev) => prev.map((m) => ((m._id as any)?.toString() === messageId ? data.message : m)))
      return data.message
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return { messages, loading, error, isPolling, sendMessage, editMessage, deleteMessage, reactToMessage }
}
