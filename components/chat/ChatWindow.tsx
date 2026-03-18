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
  IconFileDescription,
  IconTrash,
  IconArrowLeft,
  IconChecks,
  IconEdit,
  IconArrowBackUp,
  IconMessagePlus
} from '@tabler/icons-react'
import type { IChannel } from '@/lib/db/models/Channel'
import type { IMessage, IAttachment } from '@/lib/db/models/Message'
import { format, isSameDay } from 'date-fns'

interface ChatWindowProps {
  channel: IChannel | null
  userUid: string
  onDeleteChannel?: (id: string) => void
  onBack?: () => void
}

const COMMON_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏']

export default function ChatWindow({ channel, userUid, onDeleteChannel, onBack }: ChatWindowProps) {
  const { messages, loading, sendMessage, editMessage, deleteMessage, reactToMessage } = useChat(channel?._id.toString() || null)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<IMessage | null>(null)
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
        await sendMessage(input, attachments, replyingTo?._id as any)
        setReplyingTo(null)
      }
      setInput('')
      setAttachments([])
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSending(false)
    }
  }

  const startEdit = (msg: IMessage) => {
    setEditingId(msg._id.toString())
    setInput(msg.content)
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
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
      <div className="flex flex-1 items-center justify-center bg-slate-50 dark:bg-[#313338]">
        <div className="text-center p-8 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl">
          <IconMessagePlus className="h-12 w-12 mx-auto mb-4 opacity-10" />
          <p className="text-slate-400 dark:text-zinc-500 font-medium">Select a conversation to start messaging</p>
        </div>
      </div>
    )
  }

  const groupedMessages: { [date: string]: IMessage[] } = messages.reduce((groups: any, msg) => {
    const date = format(new Date(msg.createdAt), 'yyyy-MM-dd')
    if (!groups[date]) groups[date] = []
    groups[date].push(msg)
    return groups
  }, {})

  return (
    <div className="flex flex-1 flex-col bg-white dark:bg-[#313338] h-full overflow-hidden relative">
      {/* Header - Unified Integrated Style */}
      <div className="flex h-16 shrink-0 items-center justify-between px-4 md:px-6 border-b border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/10 backdrop-blur-xl z-30">
        <div className="flex items-center gap-3 overflow-hidden">
          <button 
            onClick={onBack}
            className="flex md:hidden p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 transition-all active:scale-90"
          >
            <IconArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-base line-clamp-1 tracking-tight">
              {channel.name}
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-[0.15em]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {channel.type === 'DM' ? 'Identity Verified' : 'Official Channel'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {channel.type === 'DM' && (
            <button
              onClick={handleDeleteChannel}
              className="rounded-xl p-2.5 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 active:scale-90"
              title="Delete"
            >
              <IconTrash className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Area - High Fidelity & Immersive */}
      <div className="flex-1 overflow-y-auto relative custom-scrollbar scroll-smooth" ref={scrollRef}>
        {/* Ghost Logo Watermark */}
        <div 
          className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.015] dark:opacity-[0.03] pointer-events-none select-none overflow-hidden"
          style={{ 
            backgroundImage: 'url("/logo/club-logo.png")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'clamp(280px, 40%, 450px) auto',
            filter: 'grayscale(1) invert(var(--dark-mode, 0))'
          }}
        />

        <div className="relative z-10 p-4 md:p-8 space-y-10 min-h-full">
          {loading && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 gap-4">
              <IconLoader2 className="h-8 w-8 animate-spin text-sky-500" />
              <p className="text-xs font-black uppercase tracking-widest opacity-40">Decrypting messages...</p>
            </div>
          ) : Object.keys(groupedMessages).length === 0 ? (
            <div className="flex h-80 flex-col items-center justify-center text-slate-400 gap-6">
              <div className="h-20 w-20 rounded-[2.5rem] bg-slate-50 dark:bg-black/20 flex items-center justify-center shadow-inner border border-black/5 dark:border-white/5">
                <IconSend className="h-8 w-8 opacity-20" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.2em]">Start a conversation</p>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date} className="space-y-10">
                <div className="flex justify-center sticky top-2 z-20">
                  <span className="rounded-2xl bg-white/70 dark:bg-[#1e1f22]/70 shadow-xl border border-black/5 dark:border-white/5 px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-zinc-300 backdrop-blur-2xl">
                    {isSameDay(new Date(date), new Date()) ? 'Today' : 
                     isSameDay(new Date(date), new Date(Date.now() - 86400000)) ? 'Yesterday' :
                     format(new Date(date), 'MMMM d, yyyy')}
                  </span>
                </div>

                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {msgs.filter(m => !m.deleted).map((msg) => {
                      const isOwn = msg.senderId === userUid || (msg as any).isOptimistic
                      const canEdit = isOwn && !msg.deleted && (new Date().getTime() - new Date(msg.createdAt).getTime()) < 5 * 60 * 1000
                      
                      // Fix: Handle both populated and unpopulated replyTo
                      // Fix: Exhaustive and robust replyTo data extraction
                      const rt = msg.replyTo as any
                      const replyToData = (rt && typeof rt === 'object' && (rt.content || rt.text)) 
                        ? rt 
                        : (rt ? messages.find(m => m._id?.toString() === rt.toString()) : null)

                      return (
                        <motion.div
                          key={msg._id?.toString()}
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className={cn(
                            'flex flex-col gap-1.5 px-2 group relative max-w-full',
                            isOwn ? 'items-end' : 'items-start',
                            (msg as any).isOptimistic && 'opacity-60'
                          )}
                        >
                          {!isOwn && (
                            <span className="ml-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">
                              {msg.senderName}
                            </span>
                          )}
                          
                          <div className={cn(
                            'flex items-end gap-3 relative max-w-[95%] md:max-w-[80%]',
                            isOwn ? 'flex-row-reverse' : 'flex-row'
                          )}>
                            <div
                              className={cn(
                                'relative w-full rounded-[20px] px-5 py-3.5 text-[15px] shadow-sm transition-all duration-300',
                                isOwn
                                  ? 'bg-sky-500 text-white rounded-tr-none'
                                  : 'bg-white text-slate-900 dark:bg-[#202c33] dark:text-[#e9edef] rounded-tl-none border border-black/5 dark:border-white/5',
                                msg.deleted && 'italic opacity-60'
                              )}
                            >
                              {/* Integrated Reply Quote - High Visibility */}
                              {replyToData && (
                                <div className={cn(
                                  "mb-3 p-3 rounded-xl border-l-[4px] text-[13px] transition-all",
                                  isOwn 
                                    ? "bg-sky-600/50 border-white/80 text-white" 
                                    : "bg-slate-100 dark:bg-zinc-900/80 border-sky-500 text-slate-700 dark:text-zinc-200 shadow-sm"
                                )}>
                                  <p className="font-black text-[10px] uppercase tracking-wider mb-0.5 opacity-80">
                                    {replyToData.senderName}
                                  </p>
                                  <p className="line-clamp-2 opacity-90 leading-tight italic">"{replyToData.content}"</p>
                                </div>
                              )}

                              <div className="whitespace-pre-wrap leading-[1.5] select-text font-medium">
                                {msg.content}
                              </div>

                              {msg.attachments && msg.attachments.length > 0 && (
                                <div className="mt-4 grid grid-cols-1 gap-3">
                                  {msg.attachments.map((att: any, i: number) => (
                                    <div key={i} className="rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 bg-black/5 dark:bg-black/20 shadow-inner">
                                      {att.type.startsWith('image/') ? (
                                        <img src={att.url} alt={att.name} className="max-h-96 h-auto w-full object-cover hover:scale-[1.02] transition-transform duration-500 cursor-zoom-in" />
                                      ) : (
                                        <a href={att.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 text-xs hover:bg-black/5 transition-colors group/att">
                                          <div className="p-3 bg-sky-500/10 dark:bg-white/10 rounded-2xl text-sky-600 dark:text-white transition-transform group-hover/att:scale-110">
                                            <IconFileDescription className="h-6 w-6" />
                                          </div>
                                          <div className="flex flex-col min-w-0">
                                            <span className="font-black truncate opacity-90">{att.name}</span>
                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-40 mt-0.5">Verified Document</span>
                                          </div>
                                        </a>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className={cn(
                                'mt-2.5 flex items-center justify-end gap-2 text-[9px] font-black uppercase tracking-widest opacity-50',
                                isOwn ? 'text-white' : 'text-slate-500 dark:text-[#a0bacb]'
                              )}>
                                <span>{format(new Date(msg.createdAt), 'HH:mm')}</span>
                                {msg.edited && <span>• Edited</span>}
                                {isOwn && !msg.deleted && (
                                  <IconChecks className={cn("h-4 w-4", (msg.readBy?.length || 0) > 1 ? "text-white" : "text-white/40")} />
                                )}
                              </div>

                              {/* Reactions - Clean Pill Design */}
                              {msg.reactions && msg.reactions.length > 0 && (
                                <div className={cn(
                                  "absolute -bottom-4 flex flex-wrap gap-1.5 transition-all z-10",
                                  isOwn ? "right-2" : "left-2"
                                )}>
                                  {Object.entries(
                                    msg.reactions.reduce((acc: any, curr) => {
                                      acc[curr.emoji] = (acc[curr.emoji] || 0) + 1
                                      return acc
                                    }, {})
                                  ).map(([emoji, count]: any) => (
                                    <button
                                      key={emoji}
                                      onClick={() => reactToMessage(msg._id.toString(), emoji)}
                                      className="flex items-center gap-1.5 rounded-full bg-white dark:bg-[#3b4a54] px-2.5 py-1.5 text-xs shadow-xl border border-black/5 dark:border-white/5 hover:scale-110 active:scale-95 transition-all font-black"
                                    >
                                      <span>{emoji}</span>
                                      <span className="opacity-60">{count}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Actions Overlay - Animated & Fluid */}
                            {!msg.deleted && (
                              <div className={cn(
                                "flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto translate-y-2 group-hover:translate-y-0",
                                isOwn ? "mr-2" : "ml-2"
                              )}>
                                <div className="flex bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl rounded-2xl border border-black/5 shadow-2xl p-1 gap-1">
                                  {COMMON_EMOJIS.map(emoji => (
                                    <button
                                      key={emoji}
                                      onClick={() => reactToMessage(msg._id.toString(), emoji)}
                                      className="p-1 px-2 hover:bg-sky-500/10 hover:scale-125 rounded-xl transition-all"
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => setReplyingTo(msg)}
                                    className="p-2.5 rounded-full bg-white dark:bg-zinc-800 text-slate-500 hover:text-sky-500 border border-black/5 shadow-lg hover:scale-110 active:scale-90 transition-all"
                                    title="Reply"
                                  >
                                    <IconArrowBackUp className="h-4 w-4" />
                                  </button>
                                  {isOwn && canEdit && (
                                    <button 
                                      onClick={() => startEdit(msg)}
                                      className="p-2.5 rounded-full bg-white dark:bg-zinc-800 text-slate-500 hover:text-sky-500 border border-black/5 shadow-lg hover:scale-110 active:scale-90 transition-all"
                                      title="Edit"
                                    >
                                      <IconEdit className="h-4 w-4" />
                                    </button>
                                  )}
                                  {isOwn && (
                                    <button 
                                      onClick={() => deleteMessage(msg._id.toString())}
                                      className="p-2.5 rounded-full bg-white dark:bg-zinc-800 text-slate-500 hover:text-red-500 border border-black/5 shadow-lg hover:scale-110 active:scale-90 transition-all"
                                      title="Delete"
                                    >
                                      <IconTrash className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </div>
            ))
          )}
          <div className="h-6" ref={scrollRef} />
        </div>
      </div>

      {/* Input Section - Optimized & Brand-Solid */}
      <div className="relative z-40 bg-white/80 dark:bg-[#202c33]/80 backdrop-blur-2xl p-4 md:p-6 border-t dark:border-white/5">
        <form onSubmit={handleSend} className="max-w-7xl mx-auto flex flex-col gap-4">
          {/* Floating Reply Banner */}
          <AnimatePresence>
            {replyingTo && (
              <motion.div 
                initial={{ height: 0, opacity: 0, scale: 0.95 }}
                animate={{ height: 'auto', opacity: 1, scale: 1 }}
                exit={{ height: 0, opacity: 0, scale: 0.95 }}
                className="overflow-hidden rounded-3xl bg-slate-50 dark:bg-black/20 border-l-[6px] border-sky-500 shadow-sm"
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2 mb-1">
                      <IconArrowBackUp className="h-3 w-3 text-sky-500" />
                      <p className="text-[10px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-widest">
                        Replying to {replyingTo.senderName}
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-zinc-400 truncate font-medium">
                      {replyingTo.content}
                    </p>
                  </div>
                  <button 
                    onClick={() => setReplyingTo(null)}
                    className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                  >
                    <IconX className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {editingId && (
            <div className="flex items-center justify-between rounded-2xl bg-sky-500/5 p-4 text-xs font-black text-sky-600 dark:text-sky-400 border border-sky-500/20">
              <div className="flex items-center gap-2 uppercase tracking-widest">
                <IconEdit className="h-4 w-4" />
                <span>Modification Mode</span>
              </div>
              <button onClick={() => { setEditingId(null); setInput(''); }} className="hover:underline">Discard Changes</button>
            </div>
          )}

          <div className="relative flex items-end gap-4 overflow-visible">
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
                "flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl transition-all active:scale-90 shadow-sm",
                isUploading 
                  ? "bg-sky-100 animate-pulse text-sky-500" 
                  : "bg-slate-50 hover:bg-slate-100 dark:bg-[#2a3942] dark:hover:bg-[#35454f] text-slate-500 dark:text-zinc-400"
              )}
            >
              {isUploading ? <IconLoader2 className="h-6 w-6 animate-spin" /> : <IconPaperclip className="h-6 w-6" />}
            </button>

            <div className="flex-1 relative flex flex-col gap-3">
              {/* Attachment Chips */}
              <AnimatePresence>
                {attachments.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex flex-wrap gap-2"
                  >
                    {attachments.map((file, i) => (
                      <div key={i} className="group relative pr-10 pl-4 py-2 rounded-2xl bg-white dark:bg-zinc-800 border border-black/5 shadow-xl text-[11px] font-black uppercase tracking-wider max-w-[180px]">
                        <span className="truncate block opacity-80">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(i)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          <IconX className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend(e)
                  }
                }}
                placeholder="Message securely..."
                className="w-full max-h-60 min-h-[52px] resize-none rounded-[1.5rem] bg-slate-50 border-none py-4 px-6 text-[15px] focus:ring-2 focus:ring-sky-500/20 focus:outline-none dark:bg-[#2a3942] dark:text-[#e9edef] placeholder:text-slate-400 dark:placeholder:text-[#8696a0] shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] leading-relaxed h-[52px] font-medium"
                rows={1}
              />
            </div>

            <button
              type="submit"
              disabled={(!input.trim() && attachments.length === 0) || sending}
              className={cn(
                "flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl transition-all duration-500 shadow-xl active:scale-95 disabled:scale-100 disabled:opacity-30 disabled:shadow-none",
                (!input.trim() && attachments.length === 0) 
                  ? "bg-slate-200 dark:bg-zinc-700 text-slate-400" 
                  : "bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/30 scale-105"
              )}
            >
              {sending ? (
                <IconLoader2 className="h-7 w-7 animate-spin px-1" />
              ) : (
                <IconSend className="h-6 w-6 ml-1 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
