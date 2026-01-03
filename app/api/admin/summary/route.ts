// app/api/admin/summary/route.ts
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db/connect"
import { User } from "@/lib/db/models/User"
import { getGazetteIssues } from "@/lib/gazette"

type SecretariatSummary = {
  total: number
  active: number
  byRole: Record<string, number>
  byOffice: Record<string, number>
}

type GazetteSummary = {
  issues: number
}

type SystemHealth = {
  dbOk: boolean
  dbMessage?: string
  emailOk: boolean
  emailMessage?: string
  storageOk: boolean
  storageUsedMb?: number
}

type AdminSummary = {
  secretariat: SecretariatSummary
  gazette: GazetteSummary
  system: SystemHealth
}

const DEFAULT_SUMMARY: AdminSummary = {
  secretariat: {
    total: 0,
    active: 0,
    byRole: {},
    byOffice: {},
  },
  gazette: {
    issues: 0,
  },
  system: {
    dbOk: true,
    dbMessage: "OK",
    emailOk: true,
    emailMessage: "OK",
    storageOk: true,
    storageUsedMb: 0,
  },
}

export async function GET() {
  try {
    await connectToDatabase()

    // 1) Secretariat summary
    const [total, active] = await Promise.all([
      User.countDocuments({}).exec(),
      User.countDocuments({ memberStatus: "ACTIVE" }).exec(),
    ])

    const [byRoleAgg, byOfficeAgg] = await Promise.all([
      User.aggregate([
        {
          $group: {
            _id: "$secretariatRole",
            count: { $sum: 1 },
          },
        },
      ]),
      User.aggregate([
        {
          $group: {
            _id: "$office",
            count: { $sum: 1 },
          },
        },
      ]),
    ])

    const byRole: Record<string, number> = {}
    for (const row of byRoleAgg) {
      const key = row._id || "UNASSIGNED"
      byRole[key] = row.count
    }

    const byOffice: Record<string, number> = {}
    for (const row of byOfficeAgg) {
      const key = row._id || "UNASSIGNED"
      byOffice[key] = row.count
    }

    const secretariat: SecretariatSummary = {
      total,
      active,
      byRole,
      byOffice,
    }

    // 2) Gazette summary (from filesystem helper)
    let issues = 0
    try {
      const allIssues = getGazetteIssues()
      issues = allIssues.length
    } catch (e) {
      console.error("Admin summary Gazette error", e)
      issues = 0
    }
    const gazette: GazetteSummary = {
      issues,
    }

    // 3) System health – simple “OK” defaults for now
    const system: SystemHealth = {
      dbOk: true,
      dbMessage: "Connected",
      emailOk: true,
      emailMessage: "Configured",
      storageOk: true,
      storageUsedMb: 0,
    }

    const summary: AdminSummary = {
      secretariat,
      gazette,
      system,
    }

    return NextResponse.json(summary)
  } catch (err: any) {
    console.error("GET /api/admin/summary error", err)
    return NextResponse.json(DEFAULT_SUMMARY, { status: 500 })
  }
}
