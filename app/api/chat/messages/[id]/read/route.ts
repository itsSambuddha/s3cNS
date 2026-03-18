// app/api/chat/messages/[id]/read/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { Message } from '@/lib/db/models/Message'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    await connectToDatabase()

    const message = await Message.findById(id)
    if (!message) return NextResponse.json({ error: 'Message not found' }, { status: 404 })

    // If already read by this user, just return success
    if (message.readBy?.some(r => r.userId === user.uid)) {
      return NextResponse.json({ success: true })
    }

    // Initialize readBy if it doesn't exist
    if (!message.readBy) message.readBy = []

    // Add user to readBy array
    message.readBy.push({
      userId: user.uid,
      at: new Date()
    })

    await message.save()

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Read receipt error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
