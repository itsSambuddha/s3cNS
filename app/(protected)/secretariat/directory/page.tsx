'use client'

import { useEffect, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Member = {
  _id: string
  displayName: string
  email: string
  phone?: string
  secretariatRole: string
  office: string | null
  academicDepartment?: string
  year?: string
}

export default function SecretariatDirectoryPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (q) params.set('q', q)
        if (roleFilter) params.set('role', roleFilter)
        const res = await fetch(`/api/secretariat/members?${params.toString()}`)
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        setMembers(
          (data.members || []).map((m: any) => ({
            _id: m._id,
            displayName: m.displayName || m.email,
            email: m.email,
            phone: m.phone,
            secretariatRole: m.secretariatRole,
            office: m.office,
            academicDepartment: m.academicDepartment,
            year: m.year,
          }))
        )
      } catch (e) {
        console.error(e)
        setMembers([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [q, roleFilter])

  const leadership = useMemo(
    () =>
      members.filter((m) =>
        ['PRESIDENT', 'SECRETARY_GENERAL', 'DIRECTOR_GENERAL'].includes(
          m.secretariatRole
        )
      ),
    [members]
  )

  const teachers = useMemo(
    () => members.filter((m) => m.secretariatRole === 'TEACHER'),
    [members]
  )

  const usgsByOffice = useMemo(() => {
    const result: Record<string, Member[]> = {}
    members
      .filter((m) => m.secretariatRole === 'USG')
      .forEach((m) => {
        const key = m.office || 'UNASSIGNED'
        if (!result[key]) result[key] = []
        result[key].push(m)
      })
    return result
  }, [members])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">
            Secretariat directory
          </h1>
          <p className="text-sm text-muted-foreground">
            Leadership, teachers, and USGs organised by office.
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            className="w-40 sm:w-56"
            placeholder="Search by name or email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All roles</SelectItem>
              <SelectItem value="PRESIDENT">President</SelectItem>
              <SelectItem value="SECRETARY_GENERAL">Sec‑Gen</SelectItem>
              <SelectItem value="DIRECTOR_GENERAL">Dir‑Gen</SelectItem>
              <SelectItem value="TEACHER">Teacher</SelectItem>
              <SelectItem value="USG">USG</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading directory…</p>
      )}

      {!loading && (
        <div className="space-y-6">
          {/* Leadership */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Leadership
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              {leadership.map((m) => (
                <Card key={m._id} className="p-4">
                  <p className="text-sm font-semibold">{m.displayName}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.secretariatRole.replace('_', ' ')}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {m.academicDepartment || 'Department'} · {m.year || '--'}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {m.email}
                  </p>
                  {m.phone && (
                    <p className="text-xs text-muted-foreground">{m.phone}</p>
                  )}
                </Card>
              ))}
              {leadership.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No leadership members defined yet.
                </p>
              )}
            </div>
          </section>

          {/* Teachers */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Teachers
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              {teachers.map((m) => (
                <Card key={m._id} className="p-4">
                  <p className="text-sm font-semibold">{m.displayName}</p>
                  <p className="text-xs text-muted-foreground">Teacher</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {m.email}
                  </p>
                  {m.phone && (
                    <p className="text-xs text-muted-foreground">{m.phone}</p>
                  )}
                </Card>
              ))}
              {teachers.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No teachers added yet.
                </p>
              )}
            </div>
          </section>

          {/* USGs by office */}
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Under Secretaries‑General
            </h2>
            {Object.keys(usgsByOffice).length === 0 && (
              <p className="text-xs text-muted-foreground">
                No USGs added yet.
              </p>
            )}
            {Object.entries(usgsByOffice).map(([office, list]) => (
              <div key={office} className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium">
                    {office === 'UNASSIGNED'
                      ? 'Unassigned office'
                      : office.replace(/_/g, ' ')}
                  </h3>
                  <Badge variant="outline" className="text-[10px]">
                    {list.length} USG
                    {list.length === 1 ? '' : 's'}
                  </Badge>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {list.map((m) => (
                    <Card key={m._id} className="p-4">
                      <p className="text-sm font-semibold">{m.displayName}</p>
                      <p className="text-xs text-muted-foreground">USG</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {m.academicDepartment || 'Department'} ·{' '}
                        {m.year || '--'}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {m.email}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>
      )}
    </div>
  )
}