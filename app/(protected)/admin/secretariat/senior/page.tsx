// app/admin/secretariat/senior/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, User2 } from "lucide-react"

type SimpleUser = {
  _id: string
  displayName: string
  email: string
  secretariatRole: string
}

type SeniorState = {
  presidentId: string | null
  secretaryGeneralId: string | null
  directorGeneralId: string | null
}

export default function SeniorSecretariatPage() {
  const [eligible, setEligible] = useState<SimpleUser[]>([])
  const [senior, setSenior] = useState<SeniorState>({
    presidentId: null,
    secretaryGeneralId: null,
    directorGeneralId: null,
  })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/admin/secretariat/senior", {
          credentials: "include",
        })
        const data = await res.json()

        const leaders: SimpleUser[] = data.leaders ?? []
        const eligibleUsers: SimpleUser[] = data.eligible ?? []

        setEligible(eligibleUsers)

        const president = leaders.find((u) => u.secretariatRole === "PRESIDENT")
        const secGen = leaders.find(
          (u) => u.secretariatRole === "SECRETARY_GENERAL",
        )
        const dirGen = leaders.find(
          (u) => u.secretariatRole === "DIRECTOR_GENERAL",
        )

        setSenior({
          presidentId: president?._id ?? null,
          secretaryGeneralId: secGen?._id ?? null,
          directorGeneralId: dirGen?._id ?? null,
        })
      } catch (e) {
        console.error("senior secretariat load error", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const save = async () => {
    try {
      setSaving(true)
      const res = await fetch("/api/admin/secretariat/senior", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(senior),
      })
      if (!res.ok) {
        console.error("Failed to save senior secretariat", await res.text())
        return
      }
    } catch (e) {
      console.error("save senior secretariat error", e)
    } finally {
      setSaving(false)
    }
  }

  const renderSelect = (
    label: string,
    key: keyof SeniorState,
    placeholder: string,
  ) => (
    <div className="space-y-1.5">
      <p className="text-[11px] font-medium text-slate-700">{label}</p>
      <Select
        value={senior[key] ?? ""}
        onValueChange={(value) =>
          setSenior((prev) => ({
            ...prev,
            [key]: value === "NONE" ? null : value,
          }))
        }
      >
        <SelectTrigger className="h-8 text-[12px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="NONE">None / not assigned</SelectItem>
          {eligible.map((u) => (
            <SelectItem key={u._id} value={u._id}>
              {u.displayName} · {u.email}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-sky-700" />
          <div>
            <h1 className="text-xl font-semibold">Senior Secretariat</h1>
            <p className="text-xs text-muted-foreground">
              Assign the President, Secretary General, and Director General from active members.
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-[10px]">
          Leadership
        </Badge>
      </div>

      <Card className="border-slate-200/70 bg-white/90 p-4 shadow-sm">
        {loading && (
          <p className="text-[11px] text-muted-foreground">
            Loading eligible members…
          </p>
        )}

        {!loading && (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              {renderSelect("President", "presidentId", "Select President")}
              {renderSelect(
                "Secretary General",
                "secretaryGeneralId",
                "Select Secretary General",
              )}
              {renderSelect(
                "Director General",
                "directorGeneralId",
                "Select Director General",
              )}
            </div>

            <div className="flex items-center justify-between gap-2 pt-2">
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <User2 className="h-3 w-3" />
                <span>
                  Changes here automatically update the leadership carousel and directory.
                </span>
              </div>
              <Button
                size="sm"
                className="h-8 px-4 text-xs"
                onClick={save}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
