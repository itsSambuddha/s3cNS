// app/api/chat/messages/[id]/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { Message } from '@/lib/db/models/Message'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { content } = await req.json()
    const { id } = await params

    await connectToDatabase()

    const message = await Message.findById(id)
    if (!message) return NextResponse.json({ error: 'Message not found' }, { status: 404 })

    // Check ownership
    if (message.senderId !== user.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check edit window (5 minutes)
    const now = new Date()
    const diff = (now.getTime() - new Date(message.createdAt).getTime()) / 1000 / 60
    if (diff > 5) {
      return NextResponse.json({ error: 'Edit window expired (5 min max)' }, { status: 400 })
    }

    message.content = content
    message.edited = true
    await message.save()

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Edit message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    await connectToDatabase()

    const message = await Message.findById(id)
    if (!message) return NextResponse.json({ error: 'Message not found' }, { status: 404 })

    // Check ownership or admin/teacher
    const isAdmin = ['ADMIN', 'TEACHER'].includes(user.role) || 
                    ['PRESIDENT', 'SECRETARY_GENERAL', 'DIRECTOR_GENERAL', 'TEACHER'].includes(user.secretariatRole)
    
    if (message.senderId !== user.uid && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    message.deleted = true
    message.content = 'This message was deleted'
    await message.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
