// app/(protected)/secretariat/onboarding/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export default function SecretariatOnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [displayName, setDisplayName] = useState('')
  const [phone, setPhone] = useState('')
  const [rollNo, setRollNo] = useState('')
  const [year, setYear] = useState('')
  const [academicDepartment, setAcademicDepartment] = useState('')
  const [secretariatRole, setSecretariatRole] = useState('')
  const [office, setOffice] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/secretariat/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName,
          phone,
          rollNo,
          year,
          academicDepartment,
          secretariatRole,
          office,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to save')
      }

      // Go to dashboard or secretariat directory after onboarding
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold sm:text-3xl">
          Secretariat profile setup
        </h1>
        <p className="text-sm text-muted-foreground">
          Tell us your role, department, and basic details so the directory and
          permissions can be configured correctly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your full name"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit phone"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="roll">College roll no.</Label>
            <Input
              id="roll"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="Roll number"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FY">FY</SelectItem>
                <SelectItem value="SY">SY</SelectItem>
                <SelectItem value="TY">TY</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Department</Label>
            <Select
              value={academicDepartment}
              onValueChange={setAcademicDepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sociology">Sociology</SelectItem>
                <SelectItem value="Computer Science">
                  Computer Science
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1">
          <Label>Secretariat role</Label>
          <Select
            value={secretariatRole}
            onValueChange={(val) => {
              setSecretariatRole(val)
              if (val !== 'USG') setOffice('')
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PRESIDENT">President</SelectItem>
              <SelectItem value="SECRETARY_GENERAL">
                Secretary General
              </SelectItem>
              <SelectItem value="DIRECTOR_GENERAL">
                Director General
              </SelectItem>
              <SelectItem value="USG">Under Secretary‑General</SelectItem>
              <SelectItem value="TEACHER">Teacher</SelectItem>
              <SelectItem value="MEMBER">Member</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {secretariatRole === 'USG' && (
          <div className="space-y-1">
            <Label>Office</Label>
            <Select value={office} onValueChange={setOffice}>
              <SelectTrigger>
                <SelectValue placeholder="Select office" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DELEGATION_AFFAIRS">
                  Delegation Affairs
                </SelectItem>
                <SelectItem value="SPONSORSHIP">Sponsorship</SelectItem>
                <SelectItem value="MARKETING">Marketing</SelectItem>
                <SelectItem value="FINANCE">Finance</SelectItem>
                <SelectItem value="IT_DESIGN">IT · Design</SelectItem>
                <SelectItem value="IT_SOCIAL_MEDIA">
                  IT · Social Media
                </SelectItem>
                <SelectItem value="PUBLIC_RELATIONS">
                  Public Relations
                </SelectItem>
                <SelectItem value="CONFERENCE_MANAGEMENT">
                  Conference Management
                </SelectItem>
                <SelectItem value="LOGISTICS">Logistics</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard')}
          >
            Skip for now
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Save profile'}
          </Button>
        </div>
      </form>
    </div>
  )
}
