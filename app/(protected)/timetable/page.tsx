// app/(protected)/timetable/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type RoutineItem = {
  id: string
  className: string
  startTime: string
  endTime: string
  teacher: string
}

export default function TimetablePage() {
  const [items, setItems] = useState<RoutineItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/timetable')
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        setItems(data.routine || [])
      } catch (e) {
        console.error(e)
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const addRow = () => {
    setItems((prev) => [
      ...prev,
      {
        id: nanoid(),
        className: '',
        startTime: '',
        endTime: '',
        teacher: '',
      },
    ])
  }

  const updateRow = (id: string, patch: Partial<RoutineItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    )
  }

  const deleteRow = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/timetable', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routine: items }),
      })
      if (!res.ok) throw new Error('Failed to save')
      // optionally show toast here
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    // simply reload from server
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">
            My timetable
          </h1>
          <p className="text-sm text-muted-foreground">
            Add your college classes with timings and class teacher. This will
            be used to create attendance prompts.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" disabled={saving} onClick={handleSave}>
            {saving ? 'Saving…' : 'Done'}
          </Button>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading timetable…</p>
      )}

      {!loading && (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-xl border bg-card p-4 sm:flex-row sm:items-end"
            >
              <div className="flex-[2] space-y-1"> {/* Increased flex for class name */}
                <label className="text-xs font-medium text-muted-foreground">
                  Class Name
                </label>
                <Input
                  value={item.className}
                  onChange={(e) =>
                    updateRow(item.id, { className: e.target.value })
                  }
                  placeholder="e.g. IR Lecture"
                />
              </div>
              <div className="w-full space-y-1 sm:w-28"> {/* Shorter width for time */}
                <label className="text-xs font-medium text-muted-foreground">
                  Start time
                </label>
                <Input
                  type="time"
                  value={item.startTime}
                  onChange={(e) =>
                    updateRow(item.id, { startTime: e.target.value })
                  }
                />
              </div>
              <div className="w-full space-y-1 sm:w-28"> {/* Shorter width for time */}
                <label className="text-xs font-medium text-muted-foreground">
                  End time
                </label>
                <Input
                  type="time"
                  value={item.endTime}
                  onChange={(e) =>
                    updateRow(item.id, { endTime: e.target.value })
                  }
                />
              </div>
              <div className="flex-[1.5] space-y-1"> {/* Adjusted flex for teacher name */}
                <label className="text-xs font-medium text-muted-foreground">
                  Class Teacher
                </label>
                <Input
                  value={item.teacher}
                  onChange={(e) =>
                    updateRow(item.id, { teacher: e.target.value })
                  }
                  placeholder="e.g. Prof. X"
                />
              </div>
              <div className="flex gap-2"> {/* Container for buttons */}
                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={addRow} // Calls addRow to append a new item
                >
                  Add
                </Button> */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteRow(item.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}

          <Button variant="outline" size="sm" onClick={addRow}>
            + Add class
          </Button>
        </div>
      )}
    </div>
  )
}
