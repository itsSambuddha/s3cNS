// components/secretariat/RoleOnBoarding.tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useUploadThing } from '@/lib/uploadthing'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

type StepId = 1 | 2 | 3 | 4

const steps: { id: StepId; label: string; chip: string }[] = [
  { id: 1, label: 'About you', chip: '1' },
  { id: 2, label: 'Academics', chip: '2' },
  { id: 3, label: 'Role', chip: '3' },
  { id: 4, label: 'Finish', chip: '4' },
]

const stepVariants = {
  enter: { opacity: 0, x: 32 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -32 },
}

const leadershipRoles = ['PRESIDENT', 'SECRETARY_GENERAL', 'DIRECTOR_GENERAL'] as const
const teacherRole = 'TEACHER'
const usgRole = 'USG'
const memberRole = 'MEMBER'

type SecretariatRole =
  | (typeof leadershipRoles)[number]
  | typeof teacherRole
  | typeof usgRole
  | typeof memberRole

const MAX_SIZE_MB = 2
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

export function RoleOnboarding({
  initialName,
  initialEmail,
  initialPhone,
  initialRollNo,
  initialYear,
  initialDepartment,
  initialSecretariatRole,
  initialOffice,
}: {
  initialName?: string | null
  initialEmail?: string | null
  initialPhone?: string | null
  initialRollNo?: string | null
  initialYear?: string | null
  initialDepartment?: string | null
  initialSecretariatRole?: string | null
  initialOffice?: string | null
}) {
  const router = useRouter()
  const { user: fbUser } = useAuth()
  const uploadThing = useUploadThing('avatarUploader')

  const [currentStep, setCurrentStep] = useState<StepId>(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [fullName, setFullName] = useState(initialName ?? '')
  const [phone, setPhone] = useState(initialPhone ?? '')
  const [rollNo, setRollNo] = useState(initialRollNo ?? '')

  const [year, setYear] = useState(initialYear ?? '')
  const [department, setDepartment] = useState(initialDepartment ?? '')

  const [secretariatRole, setSecretariatRole] = useState<SecretariatRole | ''>(
    (initialSecretariatRole as SecretariatRole | undefined) || '',
  )
  const [office, setOffice] = useState(initialOffice ?? '')
  const [officeRank, setOfficeRank] = useState<'HEAD' | 'DEPUTY' | ''>('')
  const [tagline, setTagline] = useState('')

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const progress =
    (steps.findIndex((s) => s.id === currentStep) / (steps.length - 1)) * 100

  const canContinueFromStep = (step: StepId) => {
    if (step === 1) return !!fullName.trim()
    if (step === 2) return !!year && !!department
    if (step === 3) {
      if (!secretariatRole) return false
      if (secretariatRole === usgRole) {
        return !!office && !!officeRank
      }
      return true
    }
    return true
  }

  const next = () => {
    if (currentStep === 4) return
    if (!canContinueFromStep(currentStep)) return
    setCurrentStep((prev) => (prev + 1) as StepId)
  }

  const prev = () => {
    if (currentStep === 1) return
    setCurrentStep((prev) => (prev - 1) as StepId)
  }

  const roleLabel = (value: SecretariatRole | '') => {
    switch (value) {
      case 'PRESIDENT':
        return 'President'
      case 'SECRETARY_GENERAL':
        return 'Secretary General'
      case 'DIRECTOR_GENERAL':
        return 'Director General'
      case 'TEACHER':
        return 'Teacher in Charge'
      case 'USG':
        return 'Under Secretary‑General'
      case 'MEMBER':
        return 'Member'
      default:
        return 'Select role'
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_SIZE_BYTES) {
      setError(`File too large. Max ${MAX_SIZE_MB} MB.`)
      return
    }

    setError(null)
    setAvatarFile(file)
    const url = URL.createObjectURL(file)
    setAvatarPreview(url)
  }

  const handleSave = async () => {
    if (!fbUser) {
      setError('You are not signed in.')
      return
    }
    if (!canContinueFromStep(3)) {
      setCurrentStep(3)
      return
    }

    try {
      setSaving(true)
      setError(null)

      let avatarUrl: string | null = avatarPreview ?? null

      if (avatarFile) {
        try {
          const result = await uploadThing.startUpload([avatarFile])
          if (result && result[0]) {
            avatarUrl = result[0].url
          }
        } catch (uploadErr: any) {
          console.error('avatar upload error', uploadErr)
          setError(
            uploadErr?.message ||
              'Could not upload avatar. You can try again or continue without it.',
          )
        }
      }

      const res = await fetch('/api/secretariat/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fullName,
          phone,
          rollNo,
          academicDepartment: department,
          year,
          secretariatRole: secretariatRole || memberRole,
          office: secretariatRole === usgRole ? office : null,
          officeRank: secretariatRole === usgRole ? officeRank : '',
          tagline,
          avatarUrl,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Could not save profile')
      }

      router.push('/dashboard')
    } catch (e: any) {
      setError(e?.message || 'Could not save profile')
    } finally {
      setSaving(false)
    }
  }

  const StepChips = () => (
    <div className="flex flex-wrap gap-2">
      {steps.map((step, idx) => {
        const isActive = step.id === currentStep
        const isDone = idx < steps.findIndex((s) => s.id === currentStep)
        return (
          <button
            key={step.id}
            type="button"
            className={cn(
              'flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition-colors',
              isActive
                ? 'border-sky-500 bg-sky-50 text-sky-900'
                : isDone
                ? 'border-emerald-500/70 bg-emerald-50 text-emerald-900'
                : 'border-transparent bg-muted/60 text-muted-foreground',
            )}
            onClick={() => {
              if (idx <= steps.findIndex((s) => s.id === currentStep)) {
                setCurrentStep(step.id)
              }
            }}
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-background text-[11px] font-medium">
              {step.chip}
            </span>
            <span>{step.label}</span>
          </button>
        )
      })}
    </div>
  )

  const RoleCard = ({
    value,
    title,
    subtitle,
    accent,
  }: {
    value: SecretariatRole
    title: string
    subtitle: string
    accent: string
  }) => {
    const selected = secretariatRole === value
    return (
      <motion.button
        type="button"
        onClick={() => setSecretariatRole(value)}
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="text-left"
      >
        <Card
          className={cn(
            'h-full cursor-pointer border px-3 py-3 text-xs transition-all',
            selected
              ? 'border-sky-600 bg-sky-50/80 shadow-sm'
              : 'hover:border-sky-300 hover:bg-slate-50',
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {title}
              </p>
              <p className="text-[11px] text-muted-foreground">{subtitle}</p>
            </div>
            <span
              className={cn(
                'mt-0.5 h-6 w-6 rounded-full border-2',
                selected
                  ? 'border-sky-600 bg-sky-500/10'
                  : 'border-muted bg-background',
              )}
            >
              <span
                className={cn(
                  'ml-1 mt-1 block h-3 w-3 rounded-full',
                  selected ? accent : 'bg-transparent',
                )}
              />
            </span>
          </div>
        </Card>
      </motion.button>
    )
  }

  const previewRole =
    secretariatRole
      ? roleLabel(secretariatRole)
      : 'Not set yet'

  return (
    <div className="min-h-[520px] bg-muted/40">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 lg:flex-row">
        {/* Left: wizard */}
        <Card className="w-full rounded-3xl border bg-background/90 p-5 shadow-sm backdrop-blur sm:p-7 lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Secretariat profile setup
              </h1>
              <p className="mt-2 max-w-xl text-xs text-muted-foreground sm:text-sm">
                Answer a few quick questions so your role, department, and permissions are set up correctly for this SEC‑MUN cycle.
              </p>
            </div>
            <div className="mt-2 sm:mt-0">
              <StepChips />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Step {steps.findIndex((s) => s.id === currentStep) + 1} of{' '}
                {steps.length}
              </span>
              <span>{steps.find((s) => s.id === currentStep)?.label}</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="space-y-5"
              >
                {currentStep === 1 && (
                  <>
                    <div className="space-y-1.5">
                      <p className="text-sm font-medium sm:text-base">
                        How should we address you?
                      </p>
                      <p className="text-xs text-muted-foreground sm:text-sm">
                        This name appears across the dashboard, directory, and certificates.
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-3 pt-1 sm:flex-row sm:items-center">
                      <div className="relative">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                          {avatarPreview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={avatarPreview}
                              alt="Profile preview"
                              className="h-16 w-16 rounded-full object-cover"
                            />
                          ) : (
                            (fullName || 'S')[0]
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label
                          htmlFor="avatar"
                          className="cursor-pointer text-xs font-medium text-sky-700 hover:underline"
                        >
                          Upload profile picture
                        </Label>
                        <Input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                        <p className="text-[11px] text-muted-foreground">
                          Max {MAX_SIZE_MB} MB. Square images work best. You can change this later from your profile.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="fullName">Full name</Label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your full name"
                        />
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="10‑digit phone"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="roll">College roll no.</Label>
                          <Input
                            id="roll"
                            value={rollNo}
                            onChange={(e) => setRollNo(e.target.value)}
                            placeholder="Roll number"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div className="space-y-1.5">
                      <p className="text-sm font-medium sm:text-base">
                        Where are you in college right now?
                      </p>
                      <p className="text-xs text-muted-foreground sm:text-sm">
                        This helps with allocations, communication, and reporting.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 pt-1">
                      <div className="space-y-1.5">
                        <Label htmlFor="year">Year</Label>
                        <Input
                          id="year"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          placeholder="FY / SY / TY"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="dept">Department</Label>
                        <Input
                          id="dept"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          placeholder="e.g. Sociology, Computer Science"
                        />
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <div className="space-y-1.5">
                      <p className="text-sm font-medium sm:text-base">
                        What kind of responsibilities do you handle?
                      </p>
                      <p className="text-xs text-muted-foreground sm:text-sm">
                        Choose the role that best matches your Secretariat responsibilities for this SECMUN cycle.
                      </p>
                    </div>
                    <div className="mt-2 grid gap-3 sm:grid-cols-2">
                      {leadershipRoles.map((role) => (
                        <RoleCard
                          key={role}
                          value={role}
                          title={roleLabel(role)}
                          subtitle="Core leadership – can manage members and approvals."
                          accent="bg-emerald-500"
                        />
                      ))}

                      <RoleCard
                        value={teacherRole}
                        title={roleLabel(teacherRole)}
                        subtitle="Faculty mentor with oversight and approvals."
                        accent="bg-violet-500"
                      />
                      <RoleCard
                        value={usgRole}
                        title={roleLabel(usgRole)}
                        subtitle="Runs a specific office – Delegation Affairs, Sponsorship, etc."
                        accent="bg-sky-500"
                      />
                      <RoleCard
                        value={memberRole}
                        title={roleLabel(memberRole)}
                        subtitle="Core member / volunteer with access to essential tools."
                        accent="bg-slate-500"
                      />
                    </div>

                    {secretariatRole === usgRole && (
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="office">USG office</Label>
                          <Input
                            id="office"
                            value={office}
                            onChange={(e) => setOffice(e.target.value)}
                            placeholder="e.g. Delegation Affairs, Sponsorship"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Position</Label>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant={officeRank === 'HEAD' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setOfficeRank('HEAD')}
                            >
                              Head
                            </Button>
                            <Button
                              type="button"
                              variant={officeRank === 'DEPUTY' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setOfficeRank('DEPUTY')}
                            >
                              Deputy
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {currentStep === 4 && (
                  <>
                    <div className="space-y-1.5">
                      <p className="text-sm font-medium sm:text-base">
                        Anything else we should know?
                      </p>
                      <p className="text-xs text-muted-foreground sm:text-sm">
                        Add a short line about yourself. This appears in the directory and helps others know you better.
                      </p>
                    </div>
                    <div className="space-y-3 pt-1">
                      <div className="space-y-1.5">
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input
                          id="tagline"
                          value={tagline}
                          onChange={(e) => setTagline(e.target.value)}
                          placeholder="e.g. Loves crisis committees and late‑night drafting."
                        />
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {error && (
            <p className="mt-4 text-xs font-medium text-destructive">{error}</p>
          )}

          <div className="mt-6 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={prev}
              disabled={currentStep === 1 || saving}
            >
              Back
            </Button>
            <div className="flex items-center gap-3">
              {currentStep === 4 && (
                <button
                  type="button"
                  className="text-xs text-muted-foreground underline-offset-2 hover:underline"
                  onClick={() => router.push('/dashboard')}
                  disabled={saving}
                >
                  Skip for now
                </button>
              )}
              {currentStep < 4 && (
                <Button
                  type="button"
                  size="sm"
                  onClick={next}
                  disabled={!canContinueFromStep(currentStep) || saving}
                >
                  Continue
                </Button>
              )}
              {currentStep === 4 && (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving…' : 'Save profile'}
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Right: live preview */}
        <div className="hidden flex-1 lg:block">
          <Card className="sticky top-10 h-full rounded-3xl border bg-slate-950 text-slate-50">
            <div className="h-full space-y-4 p-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
                Live preview
              </p>
              <div className="space-y-1">
                <h2 className="flex items-center gap-3 text-lg font-semibold">
                  {avatarPreview && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  )}
                  <span>{fullName || 'Your Secretariat name'}</span>
                </h2>
                <p className="text-xs text-slate-400">
                  {previewRole} · {year || 'Year not set'} ·{' '}
                  {department || 'Department not set'}
                </p>
              </div>
              <div className="mt-2 rounded-2xl bg-slate-900/80 p-4 text-xs text-slate-300">
                <p className="font-medium">Directory card</p>
                <p className="mt-2 text-[11px] text-slate-400">
                  {tagline ||
                    'Add a short tagline to show your interests, committee preferences, or responsibilities.'}
                </p>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                This is how you will appear in the Secretariat directory and internal tools.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
