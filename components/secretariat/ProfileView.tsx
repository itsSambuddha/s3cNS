// components/secretariat/ProfileView.tsx
"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, UserCircle, Briefcase, GraduationCap, Phone, Mail } from "lucide-react"
import RoleOnboarding from "./role-onboarding"
import type { AppUser } from "@/hooks/useAppUser"

export function ProfileView({ user }: { user: AppUser }) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <div className="relative">
        <Button 
          variant="outline" 
          size="sm"
          className="absolute top-0 right-0 z-10 m-2 sm:m-4"
          onClick={() => setIsEditing(false)}
        >
          Cancel Editing
        </Button>
        <RoleOnboarding
          initialName={user.displayName ?? user.email}
          initialEmail={user.email}
          initialPhone={user.phone}
          initialRollNo={user.rollNo}
          initialYear={user.year}
          initialDepartment={user.academicDepartment}
          initialSecretariatRole={user.secretariatRole}
          initialOffice={user.office ?? undefined}
          initialAvatarUrl={user.photoURL}
        />
      </div>
    )
  }

  const roleLabel = (role: string) => {
    switch (role) {
      case "PRESIDENT": return "President"
      case "SECRETARY_GENERAL": return "Secretary General"
      case "DIRECTOR_GENERAL": return "Director General"
      case "TEACHER": return "Teacher in Charge"
      case "USG": return "Under Secretary-General"
      case "MEMBER": return "Member"
      default: return role
    }
  }

  const formatOffice = (office?: string | null) => {
    if (!office) return ""
    return office.split("_").map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(" ")
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm dark:border-white/5 dark:bg-[#030712]/80">
          {/* Header/Cover Area */}
          <div className="relative h-32 w-full bg-gradient-to-r from-blue-600 to-sky-400 sm:h-48">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'2\' cy=\'2\' r=\'2\' fill=\'%23ffffff\' fill-opacity=\'0.1\'/%3E%3C/svg%3E')] opacity-30" />
            <div className="absolute -bottom-16 left-6 sm:left-10">
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-slate-100 shadow-xl dark:border-slate-900 dark:bg-slate-800">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || "Profile"} className="h-full w-full rounded-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-slate-400">
                    {(user.displayName || user.email || "S")[0].toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 pb-8 pt-20 sm:px-10">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {user.displayName || "Secretariat Member"}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                    {roleLabel(user.secretariatRole)}
                  </Badge>
                  {user.office && (
                    <Badge variant="outline" className="text-slate-600 dark:text-slate-400">
                      {formatOffice(user.office)}
                    </Badge>
                  )}
                  <Badge variant="outline" className={
                    user.memberStatus === 'ACTIVE' ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
                    user.memberStatus === 'APPLICANT' ? "border-amber-200 bg-amber-50 text-amber-700" :
                    "border-red-200 bg-red-50 text-red-700"
                  }>
                    {user.memberStatus}
                  </Badge>
                </div>
              </div>
              <Button onClick={() => setIsEditing(true)} className="rounded-full shadow-sm">
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {/* Personal Info */}
              <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-white/5 dark:bg-white/5">
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
                  <UserCircle className="h-4 w-4" />
                  Contact Info
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{user.phone || "Not provided"}</span>
                  </div>
                </div>
              </div>

              {/* Academics */}
              <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-white/5 dark:bg-white/5">
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
                  <GraduationCap className="h-4 w-4" />
                  Academics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Year</p>
                    <p className="font-medium text-slate-900 dark:text-white">{user.year || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Department</p>
                    <p className="font-medium text-slate-900 dark:text-white">{user.academicDepartment || "Not set"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500">Roll Number</p>
                    <p className="font-medium text-slate-900 dark:text-white">{user.rollNo || "Not set"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
