'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

type Applicant = {
  _id: string
  displayName: string
  email: string
  academicDepartment?: string
  year?: string
  office?: string
  rollNo?: string
}

export default function USGApprovalsPage() {
  const [apps, setApps] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/secretariat/applicants')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setApps(
        (data.applicants || []).map((a: any) => ({
          _id: a._id,
          displayName: a.displayName || a.email,
          email: a.email,
          academicDepartment: a.academicDepartment,
          year: a.year,
          office: a.office,
          rollNo: a.rollNo,
        }))
      )
    } catch (e) {
      console.error(e)
      setApps([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const act = async (userId: string, action: 'APPROVE' | 'REJECT') => {
    setSavingId(userId)
    try {
      const res = await fetch('/api/secretariat/applicants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      })
      if (!res.ok) throw new Error('Failed')
      await load()
    } catch (e) {
      console.error(e)
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">
          USG approvals
        </h1>
        <p className="text-sm text-muted-foreground">
          Review and approve Under Secretary‑General applicants.
        </p>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading applicants…</p>
      )}

      {!loading && apps.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No pending USG applications.
        </p>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {apps.map((a) => (
          <Card key={a._id} className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <p className="text-sm font-semibold">{a.displayName}</p>
              <p className="text-xs text-muted-foreground">{a.email}</p>
              <p className="text-xs text-muted-foreground">
                {a.academicDepartment || 'Department'} · {a.year || '--'} ·{' '}
                {a.rollNo || 'Roll —'}
              </p>
              <p className="text-xs text-muted-foreground">
                Office: {a.office ? a.office.replace(/_/g, ' ') : 'Not selected'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={savingId === a._id}
                onClick={() => act(a._id, 'REJECT')}
              >
                Reject
              </Button>
              <Button
                size="sm"
                disabled={savingId === a._id}
                onClick={() => act(a._id, 'APPROVE')}
              >
                Approve
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}