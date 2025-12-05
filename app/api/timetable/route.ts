// app/api/timetable/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { User } from '@/lib/db/models/User'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'

export async function GET() {
  await connectToDatabase()
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const fresh = await User.findById(user._id).select('routine').lean().exec()
  return NextResponse.json({ routine: fresh?.routine ?? [] })
}

export async function PUT(req: Request) {
  await connectToDatabase()
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { routine } = await req.json()

  if (!Array.isArray(routine)) {
    return NextResponse.json({ error: 'Invalid routine' }, { status: 400 })
  }

  await User.findByIdAndUpdate(
    user._id,
    { routine },
    { new: true, upsert: false }
  )

  return NextResponse.json({ ok: true })
}
