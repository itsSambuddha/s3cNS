'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  FileText,
  FileType,
  FileCheck,
  FileSpreadsheet,
  Download,
  ExternalLink,
  Copy,
  Check,
  Maximize2,
  Presentation,
  Info,
  Sparkles,
} from 'lucide-react'

export type UtilityItem = {
  _id: string
  title: string
  description?: string
  category: string
  isFolder: boolean
  parentFolderId?: string | null
  filePath?: string
  fileName?: string
  fileSize: number
  fileType: 'ppt' | 'doc' | 'pdf' | 'excel' | 'image' | 'folder' | 'other'
  tags: string[]
  isPinned: boolean
  downloadCount: number
  uploadedBy?: string
  createdAt: string
}

interface DocumentViewerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: UtilityItem | null
  onDownload: (item: UtilityItem) => void
}

export default function DocumentViewerModal({
  open,
  onOpenChange,
  item,
  onDownload,
}: DocumentViewerModalProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'preview' | 'online'>('preview')
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin)
    }
  }, [])

  if (!item || !item.filePath) return null

  const fullUrl = `${origin}${item.filePath}`
  const isPdf = item.fileType === 'pdf' || item.filePath.toLowerCase().endsWith('.pdf')
  const isPpt = item.fileType === 'ppt' || item.filePath.toLowerCase().match(/\.(ppt|pptx|potx|key)$/i)
  const isImage = item.fileType === 'image' || item.filePath.toLowerCase().match(/\.(png|jpg|jpeg|webp|svg|gif)$/i)

  const googleDocsViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fullUrl)}&embedded=true`
  const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fullUrl)}`

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatSize = (bytes: number) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getItemIcon = () => {
    if (isPdf) return <FileCheck className="h-5 w-5 text-rose-400" />
    if (isPpt) return <FileType className="h-5 w-5 text-orange-400" />
    if (isImage) return <Sparkles className="h-5 w-5 text-amber-400" />
    return <FileText className="h-5 w-5 text-blue-400" />
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[92vh] flex flex-col p-0 overflow-hidden bg-slate-950 text-white border-white/10 backdrop-blur-2xl">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 shrink-0">
              {getItemIcon()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-sky-300">
                  {item.category}
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  {formatSize(item.fileSize)}
                </span>
              </div>
              <DialogTitle className="text-lg font-extrabold text-white truncate max-w-lg mt-0.5">
                {item.title}
              </DialogTitle>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {isPpt && (
              <div className="flex items-center rounded-xl bg-slate-900 border border-white/10 p-1 mr-2">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'preview'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Document View
                </button>
                <button
                  onClick={() => setActiveTab('online')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'online'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Office Online
                </button>
              </div>
            )}

            <Button
              onClick={() => onDownload(item)}
              className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl gap-1.5 px-3 py-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>

            <a
              href={item.filePath}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="Open full page in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </a>

            <button
              onClick={handleCopy}
              className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="Copy file URL"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Content Viewer Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/60 flex flex-col items-center justify-center min-h-[500px]">
          {isPdf ? (
            <iframe
              src={`${item.filePath}#toolbar=1`}
              className="w-full h-[620px] rounded-2xl border border-white/10 shadow-2xl bg-slate-900"
              title={item.title}
            />
          ) : isPpt ? (
            activeTab === 'online' ? (
              <iframe
                src={officeViewerUrl}
                className="w-full h-[620px] rounded-2xl border border-white/10 shadow-2xl bg-slate-900"
                title={`${item.title} Presentation`}
              />
            ) : (
              <div className="w-full max-w-3xl flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-white/10 bg-slate-900/90 shadow-2xl space-y-6">
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-lg">
                  <Presentation className="h-10 w-10" />
                </div>

                <div className="space-y-2 max-w-lg">
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description || 'PowerPoint presentation available for Secretariat viewing and offline download.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-4 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">File Format</span>
                    <span className="font-semibold text-orange-300 uppercase">{item.fileName?.split('.').pop() || 'PPTX'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">File Size</span>
                    <span className="font-semibold text-slate-200">{formatSize(item.fileSize)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Category</span>
                    <span className="font-semibold text-slate-200">{item.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Downloads</span>
                    <span className="font-semibold text-slate-200">{item.downloadCount}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href={item.filePath}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-5 py-2.5 transition-all"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Presentation in Tab
                  </a>
                  <Button
                    onClick={() => onDownload(item)}
                    className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-semibold text-xs rounded-2xl px-6 py-2.5 shadow-lg shadow-orange-500/20 gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Slides File
                  </Button>
                </div>
              </div>
            )
          ) : isImage ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <img
                src={item.filePath}
                alt={item.title}
                className="max-h-[580px] max-w-full rounded-2xl border border-white/10 shadow-2xl object-contain"
              />
              <p className="text-xs text-slate-400">{item.fileName}</p>
            </div>
          ) : (
            <iframe
              src={googleDocsViewerUrl}
              className="w-full h-[620px] rounded-2xl border border-white/10 shadow-2xl bg-slate-900"
              title={item.title}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
