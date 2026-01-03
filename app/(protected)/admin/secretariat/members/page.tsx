// app/admin/secretariat/members/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Trash2 } from "lucide-react"

type Member = {
  _id: string
  displayName: string
  email: string
  secretariatRole: string
  office: string | null
  academicDepartment?: string
  year?: string
  memberStatus: "ACTIVE" | "INACTIVE" | "ALUMNI" | string
  canManageFinance?: boolean
  canManageEvents?: boolean
}

const ROLE_OPTIONS = [
  "PRESIDENT",
  "SECRETARY_GENERAL",
  "DIRECTOR_GENERAL",
  "USG",
  "DEPUTY_USG",
]

const OFFICE_OPTIONS = [
  "FINANCE",
  "LOGISTICS",
  "DELEGATIONS",
  "ACADEMICS",
  "PUBLIC_RELATIONS",
  "UNASSIGNED",
]

export default function SecretariatMembersAdminPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState("")

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set("q", q)
        const res = await fetch(`/api/secretariat/members?${params.toString()}`, {
          credentials: "include",
        })
        const data = await res.json()
        setMembers(data.members ?? [])
      } catch (e) {
        console.error("admin members fetch error", e)
        setMembers([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [q])

  const updateMember = async (id: string, patch: Partial<Member>) => {
    try {
      const res = await fetch("/api/admin/secretariat/member", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: id, ...patch }),
      })
      if (!res.ok) {
        console.error("Failed to update member", await res.text())
        return
      }
      setMembers((prev) =>
        prev.map((m) => (m._id === id ? { ...m, ...patch } : m)),
      )
    } catch (e) {
      console.error("update member error", e)
    }
  }

  const deleteMember = async (id: string) => {
    if (!window.confirm("This will delete the member. Continue?")) return
    try {
      const res = await fetch(`/api/admin/secretariat/member?userId=${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) {
        console.error("Failed to delete member", await res.text())
        return
      }
      setMembers((prev) => prev.filter((m) => m._id !== id))
    } catch (e) {
      console.error("delete member error", e)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Secretariat roles & offices</h1>
          <p className="text-xs text-muted-foreground">
            Promote or demote members, change their office, deactivate or delete them.
          </p>
        </div>
        <Input
          className="w-52"
          placeholder="Search by name or email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <Card className="overflow-hidden border">
        <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr_0.8fr_0.7fr] gap-2 border-b bg-slate-50 px-3 py-2 text-[11px] font-semibold text-slate-600">
          <span>Name</span>
          <span>Role</span>
          <span>Office</span>
          <span>Dept · Year</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="max-h-[520px] divide-y overflow-y-auto text-xs">
          {loading && (
            <p className="px-3 py-2 text-[11px] text-muted-foreground">
              Loading members…
            </p>
          )}
          {!loading && members.length === 0 && (
            <p className="px-3 py-2 text-[11px] text-muted-foreground">
              No members found.
            </p>
          )}
          {members.map((m) => (
            <div
              key={m._id}
              className="grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr_0.8fr_0.7fr] items-center gap-2 px-3 py-2"
            >
              <div>
                <p className="text-[12px] font-medium">{m.displayName}</p>
                <p className="text-[11px] text-muted-foreground">{m.email}</p>
              </div>

              <Select
                value={m.secretariatRole}
                onValueChange={(value) =>
                  updateMember(m._id, { secretariatRole: value })
                }
              >
                <SelectTrigger className="h-7 text-[11px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={m.office || "UNASSIGNED"}
                onValueChange={(value) =>
                  updateMember(m._id, { office: value === "UNASSIGNED" ? null : value })
                }
              >
                <SelectTrigger className="h-7 text-[11px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OFFICE_OPTIONS.map((office) => (
                    <SelectItem key={office} value={office}>
                      {office === "UNASSIGNED"
                        ? "Unassigned"
                        : office.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-[11px] text-muted-foreground">
                <p>{m.academicDepartment || "Department"}</p>
                <p>{m.year || "--"}</p>
              </div>

              <Badge
                variant={m.memberStatus === "ACTIVE" ? "outline" : "secondary"}
                className="w-fit text-[10px]"
              >
                {m.memberStatus}
              </Badge>

              <div className="flex items-center justify-end gap-2">
                {m.memberStatus === "ACTIVE" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-[10px]"
                    onClick={() =>
                      updateMember(m._id, { memberStatus: "INACTIVE" })
                    }
                  >
                    Deactivate
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-[10px]"
                    onClick={() =>
                      updateMember(m._id, { memberStatus: "ACTIVE" })
                    }
                  >
                    Activate
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-rose-500 hover:text-rose-600"
                  onClick={() => deleteMember(m._id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
