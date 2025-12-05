// components/attendance/MarkAttendanceDialog.tsx
'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

type Props = {
  session: {
    _id: string
    subject: string
    className: string
    slotLabel: string
  }
  open: boolean
  onClose: () => void
  onUpdated: () => void
}

type StudentRow = {
  _id: string
  name: string
  present: boolean
}

export default function MarkAttendanceDialog({
  session,
  open,
  onClose,
  onUpdated,
}: Props) {
  const [students, setStudents] = useState<StudentRow[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!open) return
    const load = async () => {
      setLoading(true)
      try {
        // TODO: replace with real endpoint that returns expectedStudentIds + existing records
        const res = await fetch(`/api/attendance/session?id=${session._id}`)
        if (!res.ok) throw new Error('Failed to load students')
        const data = await res.json()
        const mapped: StudentRow[] = (data.students || []).map((s: any) => ({
          _id: s._id,
          name: s.name,
          present: s.status === 'PRESENT',
        }))
        setStudents(mapped)
      } catch (e) {
        console.error(e)
        setStudents([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [open, session._id])

  const toggleAll = (value: boolean) => {
    setStudents((prev) => prev.map((s) => ({ ...s, present: value })))
  }

  const handleSave = async (lockAfter: boolean) => {
    setSaving(true)
    try {
      const records = students.map((s) => ({
        studentId: s._id,
        status: s.present ? 'PRESENT' : 'ABSENT',
      }))
      const res = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session._id, records, lockAfter }),
      })
      if (!res.ok) throw new Error('Failed to save')
      await onUpdated()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[80vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mark attendance</DialogTitle>
          <DialogDescription>
            {session.className} · {session.subject} · {session.slotLabel}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-2">
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            <div className="h-4 w-56 animate-pulse rounded bg-muted" />
            <div className="h-4 w-52 animate-pulse rounded bg-muted" />
          </div>
        ) : (
          <>
<div className="mb-2 flex items-center justify-between text-xs">
  <p className="text-muted-foreground">
    Tap to toggle present/absent.
  </p>
  <div className="flex gap-2">
    <Button
      size="sm"                    // was "xs"
      className="h-7 px-2 text-[11px]"
      variant="outline"
      onClick={() => toggleAll(true)}
    >
      Mark all present
    </Button>
    <Button
      size="sm"                    // was "xs"
      className="h-7 px-2 text-[11px]"
      variant="outline"
      onClick={() => toggleAll(false)}
    >
      Mark all absent
    </Button>
  </div>
</div>


            <div className="space-y-2">
              {students.map((s) => (
                <label
                  key={s._id}
                  className="flex items-center justify-between rounded-lg border bg-card px-3 py-2 text-sm"
                >
                  <span>{s.name}</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Present</span>
                    <Checkbox
                      checked={s.present}
                      onCheckedChange={(val) =>
                        setStudents((prev) =>
                          prev.map((row) =>
                            row._id === s._id
                              ? { ...row, present: val === true }
                              : row
                          )
                        )
                      }
                    />
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={saving}
                onClick={() => handleSave(false)}
              >
                Save
              </Button>
              <Button
                size="sm"
                disabled={saving}
                onClick={() => handleSave(true)}
              >
                Save & Lock session
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
