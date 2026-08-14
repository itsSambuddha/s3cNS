'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

interface UploadUtilityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentFolderId?: string | null
  parentFolderName?: string
  onSuccess: () => void
}

const CATEGORIES = [
  'Presentation Templates',
  'Rules of Procedure',
  'Session Documents',
  'Design Assets',
  'Handbooks & Guides',
  'General',
]

export default function UploadUtilityModal({
  open,
  onOpenChange,
  parentFolderId = null,
  parentFolderName,
  onSuccess,
}: UploadUtilityModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('General')
  const [tags, setTags] = useState('')
  const [uploadedBy, setUploadedBy] = useState('Secretariat Member')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return
    setFile(selectedFile)
    setError(null)
    if (!title) {
      // Pre-fill title without file extension
      const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, '')
      setTitle(nameWithoutExt.replace(/[-_]/g, ' '))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file to upload.')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('category', category)
      formData.append('tags', tags)
      formData.append('uploadedBy', uploadedBy)
      if (parentFolderId) {
        formData.append('parentFolderId', parentFolderId)
      }

      const res = await fetch('/api/utilities/upload', {
        method: 'POST',
        body: formData,
      })

      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || 'Upload failed')
      }

      // Reset form
      setFile(null)
      setTitle('')
      setDescription('')
      setCategory('General')
      setTags('')
      onOpenChange(false)
      onSuccess()
    } catch (err: any) {
      setError(err?.message || 'Something went wrong while uploading.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-slate-900/95 text-white border-white/10 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Upload className="h-5 w-5 text-sky-400" />
            {parentFolderName ? `Upload File to "${parentFolderName}"` : 'Upload Offline Utility Resource'}
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">
            Upload PPTs, DOCs, PDFs, guidelines, or assets directly into the project storage for offline access.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* File Drag & Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragOver(true)
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragOver(false)
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileChange(e.dataTransfer.files[0])
              }
            }}
            className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
              isDragOver
                ? 'border-sky-500 bg-sky-500/10'
                : file
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10'
            }`}
          >
            <input
              type="file"
              id="fileInput"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              accept=".ppt,.pptx,.doc,.docx,.pdf,.xls,.xlsx,.png,.jpg,.jpeg,.zip"
            />
            {file ? (
              <div className="flex flex-col items-center space-y-1">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mb-1" />
                <p className="text-sm font-semibold text-emerald-300">{file.name}</p>
                <p className="text-[11px] text-slate-400">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload offline
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <div className="h-10 w-10 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    Click to browse or drop file here
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supports PPTX, DOCX, PDF, XLSX, images, and archives
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Resource Metadata Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Session Rules of Procedure 2026"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary or instructions on how to use this document..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="PPT, Template, Rules, 2026"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Uploaded By
              </label>
              <input
                type="text"
                value={uploadedBy}
                onChange={(e) => setUploadedBy(e.target.value)}
                placeholder="Developer / IT Team"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/10 bg-transparent text-slate-300 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUploading || !file}
              className="bg-sky-600 hover:bg-sky-500 text-white gap-2 font-medium"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving File...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Save to Offline Vault
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
