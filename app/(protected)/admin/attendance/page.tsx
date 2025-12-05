// app/(protected)/admin/attendance/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

type LowStudent = {
  id: string
  name: string
  email: string
  role: string
  present: number
  total: number
  percentage: number
}

export default function AdminAttendancePage() {
  const [students, setStudents] = useState<LowStudent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/admin/attendance/low')
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        setStudents(data.students || [])
      } catch (e) {
        console.error(e)
        setStudents([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleExport = () => {
    const header = 'Name,Email,Role,Present,Total,Percentage\n'
    const rows = students
      .map((s) =>
        [
          `"${s.name}"`, // Corrected: escaped quotes within template literal
          `"${s.email}"`, // Corrected: escaped quotes within template literal
          s.role,
          s.present,
          s.total,
          s.percentage,
        ].join(',')
      )
      .join('\n') // Corrected: escaped newline for string literal
    const csv = header + rows
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'low-attendance.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">
            Attendance alerts
          </h1>
          <p className="text-sm text-muted-foreground">
            Students with monthly attendance below 80%.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={loading || students.length === 0}
          onClick={handleExport}
        >
          Export CSV
        </Button>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {!loading && students.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No students below 80% for this month.
        </p>
      )}

      {!loading && students.length > 0 && (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Present</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">%
</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{s.email}</td>
                  <td className="px-4 py-2">{s.role}</td>
                  <td className="px-4 py-2">{s.present}</td>
                  <td className="px-4 py-2">{s.total}</td>
                  <td className="px-4 py-2">{s.percentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  )
}