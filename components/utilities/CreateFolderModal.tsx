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
import { FolderPlus, AlertCircle, Loader2 } from 'lucide-react'

interface CreateFolderModalProps {
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

export default function CreateFolderModal({
  open,
  onOpenChange,
  parentFolderId = null,
  parentFolderName,
  onSuccess,
}: CreateFolderModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('General')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Please enter a folder name.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/utilities/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          parentFolderId: parentFolderId || null,
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || 'Failed to create folder')
      }

      setTitle('')
      setDescription('')
      setCategory('General')
      onOpenChange(false)
      onSuccess()
    } catch (err: any) {
      setError(err?.message || 'Error creating folder.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-slate-900/95 text-white border-white/10 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-amber-400" />
            {parentFolderName ? `Create Subfolder in "${parentFolderName}"` : 'Create New Folder'}
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">
            Organize your PPTs, DOCs, and resource files inside custom folders and subfolders.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Folder Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Session 2026 PPTs, Official Guidelines, Logos"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional notes or contents summary..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none resize-none"
            />
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
              disabled={isSubmitting || !title.trim()}
              className="bg-amber-600 hover:bg-amber-500 text-white gap-2 font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Folder...
                </>
              ) : (
                <>
                  <FolderPlus className="h-4 w-4" />
                  Create Folder
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
