// app/(protected)/attendance/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card' // Assuming a Card component exists based on folder structure
import { Badge } from '@/components/ui/badge' // Assuming a Badge component exists

type Session = {
  _id: string
  date: string
  subject: string
  classId: string
  slotLabel: string
  startTime: string
  endTime: string
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | null
}

type Summary = {
  month: number
  year: number
  totalSessions: number
  present: number
  percentage: number
  belowEighty: boolean
}

const today = new Date()
const todayFormatted = today.toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export default function AttendancePage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)

  const fetchAttendanceData = async () => {
    setLoading(true)
    try {
      const [sessionsRes, summaryRes] = await Promise.all([
        fetch('/api/attendance/today'),
        fetch('/api/attendance/summary'),
      ])

      if (!sessionsRes.ok) throw new Error('Failed to fetch sessions')
      if (!summaryRes.ok) throw new Error('Failed to fetch summary')

      const sessionsData = await sessionsRes.json()
      const summaryData = await summaryRes.json()

      setSessions(sessionsData.sessions || [])
      setSummary(summaryData)
    } catch (e) {
      console.error('Error fetching attendance data:', e)
      setSessions([])
      setSummary(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendanceData()
  }, [])

  const handleMark = async (sessionId: string, status: Session['status']) => {
    setSavingId(sessionId)
    try {
      const res = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, status }),
      })
      if (!res.ok) throw new Error('Failed to mark attendance')
      await fetchAttendanceData() // Refetch all data
    } catch (e) {
      console.error('Error marking attendance:', e)
      // Optionally show an error message to the user
    } finally {
      setSavingId(null)
    }
  }

  const pendingSessionsCount = sessions.filter((s) => s.status === null).length

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">
            My class attendance
          </h1>
          <p className="text-sm text-muted-foreground">{todayFormatted}</p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading attendance data...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-4">
            <h3 className="text-lg font-semibold">Today&apos;s Classes</h3>
            <p className="text-3xl font-bold">{sessions.length}</p>
            <p className="text-sm text-muted-foreground">sessions scheduled</p>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold">This Month</h3>
            {summary ? (
              <>
                <p className="text-3xl font-bold">
                  {summary.percentage}%
                  {summary.belowEighty && (
                    <Badge variant="destructive" className="ml-2">
                      Below 80%
                    </Badge>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  {summary.present} / {summary.totalSessions} sessions present
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No summary available</p>
            )}
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold">Pending Actions</h3>
            <p className="text-3xl font-bold">{pendingSessionsCount}</p>
            <p className="text-sm text-muted-foreground">sessions not logged</p>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Today&apos;s Sessions</h2>
        {sessions.length === 0 && !loading ? (
          <p className="text-sm text-muted-foreground">No sessions scheduled for today.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <Card key={session._id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{session.subject}</h3>
                  {session.status && (
                    <Badge
                      variant={
                        session.status === 'PRESENT' ? 'default' : 'secondary'
                      }
                    >
                      {session.status}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {session.slotLabel} ({session.startTime} - {session.endTime})
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleMark(session._id, 'PRESENT')}
                    disabled={savingId === session._id || session.status === 'PRESENT'}
                  >
                    {savingId === session._id ? 'Saving...' : 'Mark Present'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMark(session._id, 'ABSENT')}
                    disabled={savingId === session._id || session.status === 'ABSENT'}
                  >
                    {savingId === session._id ? 'Saving...' : 'Mark Absent'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}