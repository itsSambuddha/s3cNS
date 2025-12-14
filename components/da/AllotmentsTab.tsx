"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

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
  committeePref1?: string
  committeePref2?: string
  committeePref3?: string
  insideSecInfo?: {
    semester: string
    classRollNo: string
    department: string
  }
  outsideSecInfo?: {
    instituteType: string
    collegeName?: string
    schoolName?: string
  }
}

interface Committee {
  _id: string
  name: string
  code: string
}

interface AllotmentsTabProps {
  selectedEventId?: string | null
}

export function AllotmentsTab({ selectedEventId }: AllotmentsTabProps) {
  const [delegates, setDelegates] = useState<Delegate[]>([])
  const [committees, setCommittees] = useState<Committee[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDelegate, setSelectedDelegate] = useState<Delegate | null>(null)
  const [statusFilter, setStatusFilter] = useState<DelegateStatus | "ALL">("APPLIED")
  const [searchTerm, setSearchTerm] = useState("")
  const [sheetOpen, setSheetOpen] = useState(false)

  // Form state for allotment
  const [allotmentForm, setAllotmentForm] = useState({
    committeeId: "",
    delegateCode: "",
    status: "APPLIED" as DelegateStatus,
  })
  const [submitting, setSubmitting] = useState(false)

  // Load delegates and committees
  useEffect(() => {
    async function load() {
      if (!selectedEventId) {
        setDelegates([])
        setCommittees([])
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const [delegatesRes, committeesRes] = await Promise.all([
          fetch(`/api/events/${selectedEventId}/registrations`),
          fetch(`/api/events/${selectedEventId}/committees`),
        ])

        if (delegatesRes.ok) {
          const delegatesData = await delegatesRes.json()
          setDelegates(delegatesData)
        }

        if (committeesRes.ok) {
          const committeesData = await committeesRes.json()
          setCommittees(committeesData)
        }
      } catch (err) {
        console.error("Failed to load allotment data", err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [selectedEventId])

  const filteredDelegates = delegates.filter((d) => {
    if (statusFilter !== "ALL" && d.status !== statusFilter) return false
    if (
      searchTerm &&
      !d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !d.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }
    return true
  })

  function handleSelectDelegate(delegate: Delegate) {
    setSelectedDelegate(delegate)
    setAllotmentForm({
      committeeId: "",
      delegateCode: "",
      status: delegate.status,
    })
    setSheetOpen(true)
  }

  async function handleSaveAllotment() {
    if (!selectedDelegate || !selectedEventId) return

    setSubmitting(true)
    try {
      const res = await fetch(
        `/api/events/${selectedEventId}/delegates/${selectedDelegate._id}/allot`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            committeeId: allotmentForm.committeeId,
            delegateCode: allotmentForm.delegateCode,
            status: allotmentForm.status,
          }),
        }
      )

      if (res.ok) {
        const updated = await res.json()
        setDelegates(
          delegates.map((d) => (d._id === selectedDelegate._id ? updated : d))
        )
        setSelectedDelegate(updated)
        setSheetOpen(false)

        // If status changed to ALLOTTED, optionally open WhatsApp
        if (allotmentForm.status === "ALLOTTED") {
          const message = `Hi ${updated.fullName}, your allotment for the event has been confirmed. Check your email for details.`
          window.open(
            `https://wa.me/${updated.whatsAppNumber}?text=${encodeURIComponent(message)}`,
            "_blank"
          )
        }
      }
    } catch (err) {
      console.error("Failed to save allotment", err)
    } finally {
      setSubmitting(false)
    }
  }

  if (!selectedEventId) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Select an event to manage allotments
      </div>
    )
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading delegates...</div>
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
            onValueChange={(v) =>
              setStatusFilter(v as DelegateStatus | "ALL")
            }
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
        </div>

        <div className="text-sm text-muted-foreground">
          {filteredDelegates.length} delegates
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Committee</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDelegates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No delegates found
                </TableCell>
              </TableRow>
            ) : (
              filteredDelegates.map((delegate) => (
                <TableRow key={delegate._id}>
                  <TableCell className="font-medium">{delegate.fullName}</TableCell>
                  <TableCell className="text-sm">{delegate.email}</TableCell>
                  <TableCell className="text-sm">
                    <Badge
                      variant={
                        delegate.status === "ALLOTTED"
                          ? "default"
                          : delegate.status === "APPLIED"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {delegate.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">—</TableCell>
                  <TableCell className="text-sm">—</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSelectDelegate(delegate)}
                    >
                      Allot
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Allotment Details</SheetTitle>
          </SheetHeader>

          {selectedDelegate && (
            <div className="space-y-6 py-6">
              {/* Delegate info */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Delegate Info</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Name:</span> {selectedDelegate.fullName}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Email:</span> {selectedDelegate.email}
                  </p>
                  <p>
                    <span className="text-muted-foreground">WhatsApp:</span> {selectedDelegate.whatsAppNumber}
                  </p>
                  {selectedDelegate.insideSecInfo && (
                    <>
                      <p>
                        <span className="text-muted-foreground">Sem:</span>{" "}
                        {selectedDelegate.insideSecInfo.semester}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Dept:</span>{" "}
                        {selectedDelegate.insideSecInfo.department}
                      </p>
                    </>
                  )}
                  {selectedDelegate.outsideSecInfo && (
                    <>
                      <p>
                        <span className="text-muted-foreground">Institute:</span>{" "}
                        {selectedDelegate.outsideSecInfo.collegeName ||
                          selectedDelegate.outsideSecInfo.schoolName}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Allotment form */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Allotment</h3>

                <div className="space-y-2">
                  <label className="text-xs font-medium">Committee</label>
                  <Select
                    value={allotmentForm.committeeId}
                    onValueChange={(v) =>
                      setAllotmentForm({ ...allotmentForm, committeeId: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select committee" />
                    </SelectTrigger>
                    <SelectContent>
                      {committees.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name} ({c.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium">Delegate Code</label>
                  <Input
                    value={allotmentForm.delegateCode}
                    onChange={(e) =>
                      setAllotmentForm({ ...allotmentForm, delegateCode: e.target.value })
                    }
                    placeholder="e.g., IND, USA, etc."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium">Status</label>
                  <Select
                    value={allotmentForm.status}
                    onValueChange={(v) =>
                      setAllotmentForm({
                        ...allotmentForm,
                        status: v as DelegateStatus,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APPLIED">Applied</SelectItem>
                      <SelectItem value="ALLOTTED">Allotted</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Save button */}
              <Button
                onClick={handleSaveAllotment}
                disabled={submitting}
                className="w-full"
              >
                {submitting ? "Saving..." : "Save allotment"}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
