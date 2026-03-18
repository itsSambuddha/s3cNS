// app/api/chat/messages/[id]/react/route.ts
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

    const { emoji } = await req.json()
    const { id: messageId } = await params

    await connectToDatabase()

    const message = await Message.findById(messageId)
    if (!message) return NextResponse.json({ error: 'Message not found' }, { status: 404 })

    // Initialize reactions if undefined
    if (!message.reactions) message.reactions = []

    const existingReactionIndex = message.reactions.findIndex(
      (r) => r.emoji === emoji && r.userId === user.uid
    )

    if (existingReactionIndex > -1) {
      // Remove reaction if already exists (toggle)
      message.reactions.splice(existingReactionIndex, 1)
    } else {
      // Add reaction
      message.reactions.push({ emoji, userId: user.uid })
    }

    await message.save()

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Reaction error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
