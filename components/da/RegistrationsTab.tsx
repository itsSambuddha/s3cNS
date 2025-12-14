"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

type DelegateStatus = "APPLIED" | "ALLOTTED" | "REJECTED" | "WITHDRAWN"
type FromSec = "INSIDE_SEC" | "OUTSIDE_SEC"

interface Delegate {
  _id: string
  fullName: string
  email: string
  whatsAppNumber: string
  fromSec: FromSec
  status: DelegateStatus
  eventType: string
  createdAt: string
}

interface RegistrationsTabProps {
  selectedEventId?: string | null
}

export function RegistrationsTab({ selectedEventId }: RegistrationsTabProps) {
  const [delegates, setDelegates] = useState<Delegate[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<DelegateStatus | "ALL">("ALL")
  const [fromSecFilter, setFromSecFilter] = useState<FromSec | "ALL">("ALL")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function loadDelegates() {
      if (!selectedEventId) {
        setDelegates([])
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const res = await fetch(`/api/events/${selectedEventId}/registrations`)
        if (res.ok) {
          const data = await res.json()
          setDelegates(data)
        }
      } catch (err) {
        console.error("Failed to load registrations", err)
      } finally {
        setLoading(false)
      }
    }

    loadDelegates()
  }, [selectedEventId])

  const filteredDelegates = delegates.filter((d) => {
    if (statusFilter !== "ALL" && d.status !== statusFilter) return false
    if (fromSecFilter !== "ALL" && d.fromSec !== fromSecFilter) return false
    if (
      searchTerm &&
      !d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !d.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }
    return true
  })

  if (!selectedEventId) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Select an event to view registrations
      </div>
    )
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading registrations...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as DelegateStatus | "ALL")}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="APPLIED">Applied</SelectItem>
              <SelectItem value="ALLOTTED">Allotted</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={fromSecFilter}
            onValueChange={(v) => setFromSecFilter(v as FromSec | "ALL")}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All sources</SelectItem>
              <SelectItem value="INSIDE_SEC">Inside SEC</SelectItem>
              <SelectItem value="OUTSIDE_SEC">Outside SEC</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          {filteredDelegates.length} registrations
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDelegates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No registrations found
                </TableCell>
              </TableRow>
            ) : (
              filteredDelegates.map((delegate) => (
                <TableRow key={delegate._id}>
                  <TableCell className="font-medium">{delegate.fullName}</TableCell>
                  <TableCell className="text-sm">{delegate.email}</TableCell>
                  <TableCell className="text-sm">{delegate.whatsAppNumber}</TableCell>
                  <TableCell className="text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs ${
                        delegate.fromSec === "INSIDE_SEC"
                          ? "bg-blue-500/10 text-blue-700"
                          : "bg-amber-500/10 text-amber-700"
                      }`}
                    >
                      {delegate.fromSec === "INSIDE_SEC" ? "SEC" : "Outside"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs ${
                        delegate.status === "ALLOTTED"
                          ? "bg-emerald-500/10 text-emerald-700"
                          : delegate.status === "REJECTED"
                            ? "bg-red-500/10 text-red-700"
                            : delegate.status === "WITHDRAWN"
                              ? "bg-gray-500/10 text-gray-700"
                              : "bg-blue-500/10 text-blue-700"
                      }`}
                    >
                      {delegate.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(delegate.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <button className="text-xs text-primary hover:underline">
                      View details
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
