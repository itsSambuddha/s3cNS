// components/chat/ChatWindow.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useChat } from '@/hooks/useChat'
import { cn } from '@/lib/utils'
import { useUploadThing } from '@/lib/uploadthing'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  IconSend, 
  IconPaperclip, 
  IconLoader2, 
  IconX, 
  IconFileTypePdf, 
  IconFileDescription,
  IconTrash 
} from '@tabler/icons-react'
import type { IChannel } from '@/lib/db/models/Channel'
import type { IMessage, IAttachment } from '@/lib/db/models/Message'
import { format } from 'date-fns'
import { IconChecks, IconCheck } from '@tabler/icons-react'

interface ChatWindowProps {
  channel: IChannel | null
  userUid: string
  onDeleteChannel?: (id: string) => void
}

export default function ChatWindow({ channel, userUid, onDeleteChannel }: ChatWindowProps) {
  const { messages, loading, sendMessage, editMessage, deleteMessage } = useChat(channel?._id.toString() || null)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<IAttachment[]>([])
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { startUpload, isUploading } = useUploadThing('chatAttachment', {
    onClientUploadComplete: (res: any) => {
      const newAttachments = res.map((f: any) => ({
        url: f.url,
        name: f.name,
        type: f.type || (f.name.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream'),
        size: f.size
      }))
      setAttachments((prev) => [...prev, ...newAttachments])
    },
    onUploadError: (err) => {
      alert(`Upload failed: ${err.message}`)
    }
  })

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!input.trim() && attachments.length === 0) || sending) return

    setSending(true)
    try {
      if (editingId) {
        await editMessage(editingId, input)
        setEditingId(null)
      } else {
        await sendMessage(input, attachments)
      }
      setInput('')
      setAttachments([])
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSending(false)
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const startEdit = (msg: IMessage) => {
    setEditingId(msg._id.toString())
    setInput(msg.content)
  }

  const handleDeleteChannel = async () => {
    if (!channel || !confirm('Are you sure you want to delete this conversation? This will clear all messages for everyone.')) return
    try {
      const res = await fetch(`/api/chat/channels/${channel._id}`, { method: 'DELETE' })
      if (res.ok) {
        onDeleteChannel?.(channel._id.toString())
      } else {
        alert('Failed to delete channel')
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (!channel) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-50 dark:bg-zinc-900">
        <div className="text-center">
          <p className="text-slate-500 dark:text-zinc-400">Select a channel to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col bg-white dark:bg-[#030712]">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-6">
        <div>
          <h3 className="font-bold text-sm md:text-base line-clamp-1">
            {channel.name}
          </h3>
          <p className="text-[10px] md:text-xs text-slate-500 dark:text-zinc-500 uppercase tracking-tight">
            {channel.type === 'DM' ? 'Direct Message' : channel.description}
          </p>
        </div>
        
        {channel.type === 'DM' && (
          <button
            onClick={handleDeleteChannel}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
            title="Delete Conversation"
          >
            <IconTrash className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={scrollRef}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <IconLoader2 className="h-6 w-6 animate-spin text-sky-500" />
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId === userUid
            const canEdit = isOwn && !msg.deleted && (new Date().getTime() - new Date(msg.createdAt).getTime()) < 5 * 60 * 1000
            
            return (
              <div
                key={msg._id.toString()}
                className={cn('flex flex-col group', isOwn ? 'items-end' : 'items-start')}
              >
                {!isOwn && (
                  <span className="mb-1 px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {msg.senderName}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  {isOwn && !msg.deleted && (
                    <div className="invisible group-hover:visible flex items-center gap-1">
                      {canEdit && (
                        <button 
                          onClick={() => startEdit(msg)}
                          className="text-[10px] text-slate-400 hover:text-sky-500"
                        >
                          Edit
                        </button>
                      )}
                      <button 
                        onClick={() => deleteMessage(msg._id.toString())}
                        className="text-[10px] text-slate-400 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm',
                      isOwn
                        ? 'bg-sky-500 text-white'
                        : 'bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-zinc-100',
                      msg.deleted && 'italic opacity-50'
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {msg.attachments.map((file, idx) => (
                          <div key={idx} className="overflow-hidden rounded-lg">
                            {file.type.startsWith('image/') ? (
                              <img src={file.url} alt={file.name} className="max-h-64 rounded-lg object-cover" />
                            ) : (
                              <a 
                                href={file.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className={cn(
                                  "flex items-center gap-2 rounded-lg p-2 text-xs transition-colors",
                                  isOwn ? "bg-white/10 hover:bg-white/20" : "bg-slate-200/50 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10"
                                )}
                              >
                                {file.type.includes('pdf') ? <IconFileTypePdf className="h-4 w-4" /> : <IconFileDescription className="h-4 w-4" />}
                                <span className="truncate max-w-[150px]">{file.name}</span>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-400">
                   <span>{format(new Date(msg.createdAt), 'HH:mm')}</span>
                   {msg.edited && <span>(edited)</span>}
                   {isOwn && !msg.deleted && (
                     <div className="flex items-center gap-1">
                       {(msg.readBy?.length || 0) > 1 ? (
                         <div className="flex items-center text-sky-500" title={`Seen by: ${msg.readBy?.filter(r => r.userId !== userUid).length} people`}>
                           <IconChecks className="h-3 w-3" />
                           <span className="ml-0.5">Read</span>
                         </div>
                       ) : (
                         <IconCheck className="h-3 w-3" />
                       )}
                     </div>
                   )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="border-t p-4">
        {editingId && (
          <div className="mb-2 flex items-center justify-between rounded-lg bg-sky-50 px-3 py-1 text-xs text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            <span>Editing message...</span>
            <button onClick={() => { setEditingId(null); setInput(''); }} className="font-bold underline">Cancel</button>
          </div>
        )}

        {/* Attachment Previews */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-2 flex flex-wrap gap-2"
            >
              {attachments.map((file, i) => (
                <div key={i} className="group relative rounded-lg border bg-slate-50 p-2 dark:bg-zinc-800">
                  <div className="flex items-center gap-2 pr-6">
                    {file.type.startsWith('image/') ? (
                      <div className="h-8 w-8 overflow-hidden rounded bg-slate-200">
                        <img src={file.url} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <IconFileDescription className="h-5 w-5 text-slate-400" />
                    )}
                    <span className="max-w-[100px] truncate text-[10px]">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(i)}
                    className="absolute right-1 top-1 rounded-full p-0.5 hover:bg-slate-200 dark:hover:bg-white/10"
                  >
                    <IconX className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative flex items-center gap-2">
          <input
            type="file"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files?.length) {
                startUpload(Array.from(e.target.files))
              }
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition-colors",
              isUploading ? "animate-pulse bg-slate-100" : "hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/5"
            )}
          >
            {isUploading ? <IconLoader2 className="h-5 w-5 animate-spin" /> : <IconPaperclip className="h-5 w-5" />}
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend(e)
              }
            }}
            placeholder={`Message ${channel.type === 'DM' ? channel.name : '#' + channel.name}`}
            className="flex-1 max-h-32 min-h-10 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-sky-500 focus:outline-none dark:border-white/10 dark:bg-zinc-800 dark:focus:border-sky-500"
            rows={1}
          />
          <button
            type="submit"
            disabled={(!input.trim() && attachments.length === 0) || sending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            {sending ? (
              <IconLoader2 className="h-5 w-5 animate-spin" />
            ) : (
              <IconSend className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
