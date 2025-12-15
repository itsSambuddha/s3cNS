// components/da/RegistrationsTab.tsx
"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface Registration {
  _id: string
  fullName: string
  email: string
  whatsAppNumber: string
  interestType?: "DELEGATE" | "CAMPUS_AMBASSADOR"
  emailSent?: boolean
  whatsappSent?: boolean
  createdAt: string
}

export function RegistrationsTab({ eventType }: { eventType?: string }) {
  const [data, setData] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const res = await fetch(
        eventType
          ? `/api/registrations?eventType=${eventType}`
          : `/api/registrations`,
      )
      const json = await res.json()
      if (json.success) setData(json.data || [])
      setLoading(false)
    }
    load()
  }, [eventType])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading registrations…
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border/60 bg-background shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>WhatsApp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                No registrations yet
              </TableCell>
            </TableRow>
          ) : (
            data.map((r) => (
              <TableRow key={r._id}>
                <TableCell className="font-medium">{r.fullName}</TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell>{r.whatsAppNumber}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {r.interestType ?? "—"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={r.emailSent ? "default" : "secondary"}
                  >
                    {r.emailSent ? "Sent" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={r.whatsappSent ? "default" : "secondary"}
                  >
                    {r.whatsappSent ? "Sent" : "Pending"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
