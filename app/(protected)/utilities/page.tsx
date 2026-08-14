'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderKanban,
  FileText,
  FileSpreadsheet,
  FileType,
  Download,
  Search,
  Upload,
  Pin,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Layers,
  FileCheck,
  FolderPlus,
  Folder,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import UploadUtilityModal from '@/components/utilities/UploadUtilityModal'
import CreateFolderModal from '@/components/utilities/CreateFolderModal'
import DocumentViewerModal from '@/components/utilities/DocumentViewerModal'
import { useAppUser } from '@/hooks/useAppUser'
import { Eye } from 'lucide-react'

type UtilityItem = {
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

type BreadcrumbItem = {
  _id: string
  title: string
}

const CATEGORIES = [
  'All',
  'Presentation Templates',
  'Rules of Procedure',
  'Session Documents',
  'Design Assets',
  'Handbooks & Guides',
  'General',
]

const FILE_TYPES = [
  { label: 'All Items', value: 'All' },
  { label: 'Folders Only', value: 'folder' },
  { label: 'PPT / Slides', value: 'ppt' },
  { label: 'DOC / Word', value: 'doc' },
  { label: 'PDF Documents', value: 'pdf' },
  { label: 'Excel / Sheets', value: 'excel' },
]

export default function UtilitiesPage() {
  const { user: appUser } = useAppUser()
  const [resources, setResources] = useState<UtilityItem[]>([])
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedFileType, setSelectedFileType] = useState('All')

  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [selectedViewerItem, setSelectedViewerItem] = useState<UtilityItem | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchResources = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (selectedCategory !== 'All') params.append('category', selectedCategory)
      if (selectedFileType !== 'All') params.append('fileType', selectedFileType)
      if (currentFolderId) {
        params.append('parentFolderId', currentFolderId)
      } else {
        params.append('parentFolderId', 'null')
      }

      const res = await fetch(`/api/utilities?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        setResources(json.resources || [])
        setBreadcrumbs(json.breadcrumbs || [])
      }
    } catch (err) {
      console.error('Failed to load utilities:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResources()
  }, [selectedCategory, selectedFileType, currentFolderId])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchResources()
  }

  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolderId(folderId)
    setSearch('')
  }

  const handleDownload = async (item: UtilityItem) => {
    if (!item.filePath) return
    const link = document.createElement('a')
    link.href = item.filePath
    link.download = item.fileName || item.title
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    try {
      await fetch(`/api/utilities/${item._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'incrementDownload' }),
      })
      setResources((prev) =>
        prev.map((r) => (r._id === item._id ? { ...r, downloadCount: r.downloadCount + 1 } : r))
      )
    } catch (err) {
      console.warn('Failed to increment download count:', err)
    }
  }

  const handleTogglePin = async (item: UtilityItem) => {
    const nextPinned = !item.isPinned
    setResources((prev) =>
      prev.map((r) => (r._id === item._id ? { ...r, isPinned: nextPinned } : r))
    )
    try {
      await fetch(`/api/utilities/${item._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: nextPinned }),
      })
    } catch (err) {
      console.error('Failed to update pin state:', err)
    }
  }

  const handleDelete = async (item: UtilityItem) => {
    const confirmMsg = item.isFolder
      ? `Are you sure you want to delete folder "${item.title}" and ALL subfolders/files inside it?`
      : `Are you sure you want to delete file "${item.title}"?`

    if (!confirm(confirmMsg)) return

    setResources((prev) => prev.filter((r) => r._id !== item._id))
    try {
      await fetch(`/api/utilities/${item._id}`, { method: 'DELETE' })
      fetchResources()
    } catch (err) {
      console.error('Failed to delete item:', err)
    }
  }

  const copyLink = (item: UtilityItem) => {
    if (!item.filePath) return
    const fullUrl = window.location.origin + item.filePath
    navigator.clipboard.writeText(fullUrl)
    setCopiedId(item._id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatSize = (bytes: number) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getBadgeStyle = (item: UtilityItem) => {
    if (item.isFolder) {
      return { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'Folder', icon: Folder }
    }
    switch (item.fileType) {
      case 'ppt':
        return { bg: 'bg-orange-500/10 text-orange-400 border-orange-500/20', label: 'PPT Presentation', icon: FileType }
      case 'doc':
        return { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'Word Document', icon: FileText }
      case 'pdf':
        return { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', label: 'PDF Document', icon: FileCheck }
      case 'excel':
        return { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Excel Sheet', icon: FileSpreadsheet }
      default:
        return { bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20', label: 'Utility File', icon: FolderKanban }
    }
  }

  // Current folder name for modal headers
  const activeFolderName = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].title : undefined

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/90 to-sky-950/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Offline Resource Vault & Folders</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Secretariat <span className="bg-gradient-to-r from-sky-400 via-amber-400 to-indigo-400 bg-clip-text text-transparent">Utilities</span>
            </h1>
            <p className="text-sm leading-relaxed text-slate-300">
              Create custom folders and subfolders to organize your PPTs, DOCs, PDFs, and session assets. Everything is stored locally for instant offline availability.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setIsCreateFolderOpen(true)}
              variant="outline"
              className="border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold rounded-2xl px-4 py-2.5 shadow-lg shadow-amber-500/10 transition-all hover:scale-105 gap-2"
            >
              <FolderPlus className="h-4 w-4 text-amber-400" />
              New Folder
            </Button>

            <Button
              onClick={() => setIsUploadOpen(true)}
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold rounded-2xl px-5 py-2.5 shadow-lg shadow-sky-500/20 transition-all hover:scale-105 gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload File
            </Button>

            <Button
              onClick={fetchResources}
              variant="outline"
              size="icon"
              className="rounded-2xl border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              title="Refresh Resources"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation Trail */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <button
            onClick={() => navigateToFolder(null)}
            className={`flex items-center gap-1 font-bold transition-colors ${
              currentFolderId === null ? 'text-sky-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Folder className="h-4 w-4" />
            <span>Root Vault</span>
          </button>

          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb._id}>
              <ChevronRight className="h-3.5 w-3.5 text-slate-600 shrink-0" />
              <button
                onClick={() => navigateToFolder(crumb._id)}
                className={`font-semibold transition-colors truncate max-w-[160px] ${
                  idx === breadcrumbs.length - 1 ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {crumb.title}
              </button>
            </React.Fragment>
          ))}
        </div>

        {currentFolderId && (
          <Button
            onClick={() => {
              if (breadcrumbs.length > 1) {
                navigateToFolder(breadcrumbs[breadcrumbs.length - 2]._id)
              } else {
                navigateToFolder(null)
              }
            }}
            variant="ghost"
            size="sm"
            className="text-xs text-slate-400 hover:text-white gap-1 h-7 rounded-lg"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Parent Folder
          </Button>
        )}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-2xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                  : 'border border-slate-700/50 bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search folders, PPTs, DOCs..."
            className="w-full rounded-2xl border border-slate-700/60 bg-slate-900/80 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </form>
      </div>

      {/* File Type Sub-Filters */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Show:</span>
        {FILE_TYPES.map((ft) => (
          <button
            key={ft.value}
            onClick={() => setSelectedFileType(ft.value)}
            className={`rounded-xl px-2.5 py-1 text-[11px] font-medium transition-all ${
              selectedFileType === ft.value
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {ft.label}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-44 rounded-3xl border border-white/5 bg-slate-900/50 animate-pulse p-5"
            />
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/10 rounded-3xl bg-slate-900/40">
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3">
            <FolderPlus className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white">This folder is empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Upload custom PPTs, DOCs, PDFs, or create subfolders inside this location.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <Button
              onClick={() => setIsCreateFolderOpen(true)}
              className="bg-amber-600 hover:bg-amber-500 text-white text-xs rounded-xl gap-2"
            >
              <FolderPlus className="h-4 w-4" />
              Create Subfolder
            </Button>
            <Button
              onClick={() => setIsUploadOpen(true)}
              className="bg-sky-600 hover:bg-sky-500 text-white text-xs rounded-xl gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload File
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {resources.map((item) => {
              const badge = getBadgeStyle(item)
              const BadgeIcon = badge.icon
              return (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => {
                    if (item.isFolder) {
                      navigateToFolder(item._id)
                    } else {
                      setSelectedViewerItem(item)
                    }
                  }}
                  className={`group relative flex flex-col justify-between rounded-3xl border p-5 transition-all duration-300 hover:shadow-xl cursor-pointer ${
                    item.isFolder
                      ? 'hover:border-amber-500/40 hover:bg-slate-900/90'
                      : 'hover:border-sky-500/40 hover:bg-slate-900/90'
                  } ${
                    item.isPinned
                      ? 'border-sky-500/30 bg-gradient-to-b from-slate-900/90 to-sky-950/20 shadow-sky-500/5'
                      : 'border-white/10 bg-slate-900/70 hover:border-white/20 hover:bg-slate-900'
                  }`}
                >
                  {/* Top Bar: Extension Badge & Pin */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${badge.bg}`}
                    >
                      <BadgeIcon className="h-3.5 w-3.5" />
                      <span>{badge.label}</span>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleTogglePin(item)}
                        className={`rounded-full p-1.5 transition-colors ${
                          item.isPinned
                            ? 'text-sky-400 bg-sky-500/10 hover:bg-sky-500/20'
                            : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                        }`}
                        title={item.isPinned ? 'Unpin resource' : 'Pin resource'}
                      >
                        <Pin className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(item)}
                        className="rounded-full p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete resource"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5 mb-4">
                    <h2 className="text-base font-bold text-white leading-snug line-clamp-2 group-hover:text-amber-300 transition-colors flex items-center gap-2">
                      {item.isFolder && <Folder className="h-4 w-4 text-amber-400 shrink-0" />}
                      <span>{item.title}</span>
                    </h2>
                    {item.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Tags & Metadata */}
                  <div className="space-y-3 pt-3 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-white/5 border border-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{item.isFolder ? 'Folder' : formatSize(item.fileSize)}</span>
                      <span>{item.isFolder ? 'Click to open' : `${item.downloadCount} downloads`}</span>
                    </div>

                    {/* Actions Bar */}
                    {item.isFolder ? (
                      <Button
                        onClick={() => navigateToFolder(item._id)}
                        className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-semibold text-xs rounded-xl gap-2 py-2"
                      >
                        <Folder className="h-3.5 w-3.5" />
                        Open Folder &rarr;
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          onClick={() => setSelectedViewerItem(item)}
                          className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-medium text-xs rounded-xl gap-1.5 py-2 shadow-sm"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View File
                        </Button>

                        <button
                          onClick={() => handleDownload(item)}
                          className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                          title="Download File"
                        >
                          <Download className="h-4 w-4" />
                        </button>

                        {item.filePath && (
                          <button
                            onClick={() => copyLink(item)}
                            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                            title="Copy file path URL"
                          >
                            {copiedId === item._id ? (
                              <Check className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Create Folder Modal */}
      <CreateFolderModal
        open={isCreateFolderOpen}
        onOpenChange={setIsCreateFolderOpen}
        parentFolderId={currentFolderId}
        parentFolderName={activeFolderName}
        onSuccess={fetchResources}
      />

      {/* Upload Modal */}
      <UploadUtilityModal
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        parentFolderId={currentFolderId}
        parentFolderName={activeFolderName}
        onSuccess={fetchResources}
      />

      {/* Document & PPT Viewer Modal */}
      <DocumentViewerModal
        open={!!selectedViewerItem}
        onOpenChange={(open) => !open && setSelectedViewerItem(null)}
        item={selectedViewerItem}
        onDownload={handleDownload}
      />
    </div>
  )
}
