// app/admin/settings/permissions/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Shield, Users } from "lucide-react"

type AppRole = "ADMIN" | "LEADERSHIP" | "TEACHER" | "OFFICE_BEARER" | "MEMBER"

type UserRow = {
  _id: string
  displayName?: string
  email: string
  role: AppRole
  secretariatRole: string
  office: string | null
  memberStatus: string
  canManageMembers: boolean
  canApproveUSG: boolean
  canManageFinance: boolean
  canManageEvents: boolean
}

export default function PermissionsSettingsPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch("/api/admin/settings/permissions", {
          credentials: "include",
        })

        if (!res.ok) {
          const text = await res.text()
          console.error("permissions load error", res.status, text)
          if (res.status === 401) {
            setError("You are not authorized to view permissions.")
          } else if (res.status === 404) {
            setError("Permissions API route not found. Check file path.")
          } else {
            setError("Failed to load permissions.")
          }
          setUsers([])
          return
        }

        const data = await res.json()
        setUsers(data.users ?? [])
      } catch (e) {
        console.error("permissions load error", e)
        setError("Failed to load permissions.")
        setUsers([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = users.filter((u) => {
    if (!q.trim()) return true
    const needle = q.toLowerCase()
    return (
      (u.displayName ?? "").toLowerCase().includes(needle) ||
      u.email.toLowerCase().includes(needle)
    )
  })

  const updatePermissions = async (
    userId: string,
    patch: Partial<UserRow>,
  ) => {
    try {
      const payload: any = { userId }

      if (typeof patch.canManageMembers === "boolean")
        payload.canManageMembers = patch.canManageMembers
      if (typeof patch.canApproveUSG === "boolean")
        payload.canApproveUSG = patch.canApproveUSG
      if (typeof patch.canManageFinance === "boolean")
        payload.canManageFinance = patch.canManageFinance
      if (typeof patch.canManageEvents === "boolean")
        payload.canManageEvents = patch.canManageEvents

      const res = await fetch("/api/admin/settings/permissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        console.error(
          "Failed to update permissions",
          res.status,
          await res.text(),
        )
        return
      }

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, ...patch } : u)),
      )
    } catch (e) {
      console.error("update permissions error", e)
    }
  }

  const renderSwitch = (
    u: UserRow,
    field: keyof Pick<
      UserRow,
      | "canManageMembers"
      | "canApproveUSG"
      | "canManageFinance"
      | "canManageEvents"
    >,
  ) => (
    <Switch
      checked={u[field]}
      onCheckedChange={(checked) =>
        updatePermissions(u._id, { [field]: checked } as any)
      }
      className="scale-90"
    />
  )

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-slate-800" />
          <div>
            <h1 className="text-xl font-semibold">Permissions & access</h1>
            <p className="text-xs text-muted-foreground">
              Control which members can manage Secretariat, finance, and events.
            </p>
          </div>
        </div>
        <Input
          className="w-56"
          placeholder="Search by name or email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {error && (
        <p className="text-[11px] text-red-600">
          {error}
        </p>
      )}

      <Card className="overflow-hidden border">
        <div className="grid grid-cols-[1.7fr_1fr_1fr_0.9fr_0.9fr_0.9fr_0.9fr] gap-2 border-b bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-600">
          <span>Member</span>
          <span>App role</span>
          <span>Secretariat</span>
          <span className="text-center">Manage members</span>
          <span className="text-center">Approve USG</span>
          <span className="text-center">Manage finance</span>
          <span className="text-center">Manage events</span>
        </div>

        <div className="max-h-[520px] divide-y overflow-y-auto text-xs">
          {loading && (
            <p className="px-3 py-2 text-[11px] text-muted-foreground">
              Loading users…
            </p>
          )}
          {!loading && !error && filtered.length === 0 && (
            <p className="px-3 py-2 text-[11px] text-muted-foreground">
              No users match this filter.
            </p>
          )}
          {!loading &&
            !error &&
            filtered.map((u) => (
              <div
                key={u._id}
                className="grid grid-cols-[1.7fr_1fr_1fr_0.9fr_0.9fr_0.9fr_0.9fr] items-center gap-2 px-3 py-2"
              >
                <div>
                  <p className="text-[12px] font-medium">
                    {u.displayName || u.email}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {u.email}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1 text-[11px]">
                  <Badge
                    variant={u.role === "ADMIN" ? "default" : "outline"}
                    className="text-[10px]"
                  >
                    {u.role}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {u.memberStatus}
                  </span>
                </div>

                <div className="text-[11px] text-muted-foreground">
                  <p>{u.secretariatRole.replace(/_/g, " ")}</p>
                  <p>
                    {u.office
                      ? u.office.replace(/_/g, " ")
                      : "No office assigned"}
                  </p>
                </div>

                <div className="flex items-center justify-center">
                  {renderSwitch(u, "canManageMembers")}
                </div>
                <div className="flex items-center justify-center">
                  {renderSwitch(u, "canApproveUSG")}
                </div>
                <div className="flex items-center justify-center">
                  {renderSwitch(u, "canManageFinance")}
                </div>
                <div className="flex items-center justify-center">
                  {renderSwitch(u, "canManageEvents")}
                </div>
              </div>
            ))}
        </div>
      </Card>

      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <Users className="h-3 w-3" />
        <span>
          Changes are saved immediately and affect access to admin modules
          and sensitive actions.
        </span>
      </div>
    </div>
  )
}
;