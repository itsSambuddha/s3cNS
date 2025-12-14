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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

type PortfolioType = "COUNTRY" | "ROLE"

interface Portfolio {
  _id: string
  label: string
  code: string
  type: PortfolioType
  isTaken: boolean
  assignedDelegateId?: string | null
}

interface Committee {
  _id: string
  name: string
  code: string
}

interface PortfoliosTabProps {
  selectedEventId?: string | null
}

export function PortfoliosTab({ selectedEventId }: PortfoliosTabProps) {
  const [committees, setCommittees] = useState<Committee[]>([])
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCommitteeId, setSelectedCommitteeId] = useState<string>("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    label: "",
    code: "",
    type: "COUNTRY" as PortfolioType,
  })
  const [submitting, setSubmitting] = useState(false)

  // Load committees
  useEffect(() => {
    async function loadCommittees() {
      if (!selectedEventId) {
        setCommittees([])
        setSelectedCommitteeId("")
        setPortfolios([])
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const res = await fetch(`/api/events/${selectedEventId}/committees`)
        if (res.ok) {
          const data = await res.json()
          setCommittees(data)
          if (data.length > 0) {
            setSelectedCommitteeId(data[0]._id)
          }
        }
      } catch (err) {
        console.error("Failed to load committees", err)
      } finally {
        setLoading(false)
      }
    }

    loadCommittees()
  }, [selectedEventId])

  // Load portfolios for selected committee
  useEffect(() => {
    async function loadPortfolios() {
      if (!selectedEventId || !selectedCommitteeId) {
        setPortfolios([])
        return
      }

      try {
        const res = await fetch(
          `/api/events/${selectedEventId}/committees/${selectedCommitteeId}/portfolios`
        )
        if (res.ok) {
          const data = await res.json()
          setPortfolios(data)
        }
      } catch (err) {
        console.error("Failed to load portfolios", err)
      }
    }

    loadPortfolios()
  }, [selectedEventId, selectedCommitteeId])

  async function handleAddPortfolio() {
    if (!selectedEventId || !selectedCommitteeId || !formData.label || !formData.code) {
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(
        `/api/events/${selectedEventId}/committees/${selectedCommitteeId}/portfolios`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            label: formData.label,
            code: formData.code,
            type: formData.type,
          }),
        }
      )

      if (res.ok) {
        const newPortfolio = await res.json()
        setPortfolios([...portfolios, newPortfolio])
        setFormData({ label: "", code: "", type: "COUNTRY" })
        setDialogOpen(false)
      }
    } catch (err) {
      console.error("Failed to add portfolio", err)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeletePortfolio(portfolioId: string) {
    if (!selectedEventId || !selectedCommitteeId) return

    try {
      const res = await fetch(
        `/api/events/${selectedEventId}/committees/${selectedCommitteeId}/portfolios/${portfolioId}`,
        {
          method: "DELETE",
        }
      )

      if (res.ok) {
        setPortfolios(portfolios.filter((p) => p._id !== portfolioId))
      }
    } catch (err) {
      console.error("Failed to delete portfolio", err)
    }
  }

  if (!selectedEventId) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Select an event to manage portfolios
      </div>
    )
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading committees...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Committee:</label>
          <Select value={selectedCommitteeId} onValueChange={setSelectedCommitteeId}>
            <SelectTrigger className="w-64">
              <SelectValue />
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

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add portfolio</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add portfolio</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Label</label>
                <Input
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  placeholder="e.g., India, USA, Secretary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Code</label>
                <Input
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="e.g., IND, USA, SEC"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={formData.type}
                  onValueChange={(v) =>
                    setFormData({ ...formData, type: v as PortfolioType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COUNTRY">Country</SelectItem>
                    <SelectItem value="ROLE">Role</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleAddPortfolio}
                disabled={submitting || !formData.label || !formData.code}
                className="w-full"
              >
                {submitting ? "Adding..." : "Add portfolio"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No portfolios yet. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              portfolios.map((portfolio) => (
                <TableRow key={portfolio._id}>
                  <TableCell className="font-medium">{portfolio.label}</TableCell>
                  <TableCell className="text-sm">{portfolio.code}</TableCell>
                  <TableCell className="text-sm">
                    <Badge variant="outline">{portfolio.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    <Badge
                      variant={portfolio.isTaken ? "default" : "secondary"}
                    >
                      {portfolio.isTaken ? "Taken" : "Free"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={portfolio.isTaken}
                      onClick={() => handleDeletePortfolio(portfolio._id)}
                    >
                      Delete
                    </Button>
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
