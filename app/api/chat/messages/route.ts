// app/api/chat/messages/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { Message } from '@/lib/db/models/Message'
import { Channel } from '@/lib/db/models/Channel'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { notifyChannelParticipants } from '@/lib/chat/notifications'

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const channelId = searchParams.get('channelId')
    const since = searchParams.get('since')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!channelId) return NextResponse.json({ error: 'Missing channelId' }, { status: 400 })

    await connectToDatabase()

    // Verify access
    const channel = await Channel.findById(channelId)
    if (!channel) return NextResponse.json({ error: 'Channel not found' }, { status: 404 })

    const hasAccess = channel.type === 'DM'
      ? channel.participants?.includes(user.uid)
      : channel.allowedRoles.includes(user.secretariatRole as any) || channel.allowedRoles.includes(user.role as any)

    if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // Build query
    const query: any = { channelId, deleted: false }
    if (since && since !== 'null' && since !== 'undefined') {
      const date = new Date(since)
      if (!isNaN(date.getTime())) {
        query.createdAt = { $gt: date }
      }
    }

    const messages = await Message.find(query)
      .sort({ createdAt: 1 }) // Chronological order
      .limit(limit)

    // Mark these messages as read by the user (non-blocking)
    const unreadIds = messages
      .filter(m => !m.readBy?.some(r => r.userId === user.uid))
      .map(m => m._id)

    if (unreadIds.length > 0) {
      Message.updateMany(
        { _id: { $in: unreadIds } },
        { $push: { readBy: { userId: user.uid, at: new Date() } } }
      ).catch(console.error)
    }

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Fetch messages error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { channelId, content, attachments } = await req.json()

    if (!channelId || !content) {
      return NextResponse.json({ error: 'Missing channelId or content' }, { status: 400 })
    }

    await connectToDatabase()

    // Verify access
    const channel = await Channel.findById(channelId)
    if (!channel) return NextResponse.json({ error: 'Channel not found' }, { status: 404 })

    const hasAccess = channel.type === 'DM'
      ? channel.participants?.includes(user.uid)
      : channel.allowedRoles.includes(user.secretariatRole as any) || channel.allowedRoles.includes(user.role as any)

    if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // Create message
    const designation = user.secretariatRole || user.role
    const displayNameWithRole = `(${designation}) ${user.displayName || user.email}`

    const message = await Message.create({
      channelId,
      senderId: user.uid,
      senderName: displayNameWithRole,
      senderAvatar: user.photoURL,
      content,
      attachments: attachments || [],
      readBy: [{ userId: user.uid, at: new Date() }] // Read by sender by default
    })

    // Update channel last message
    await Channel.findByIdAndUpdate(channelId, {
      lastMessage: {
        content: content.substring(0, 50),
        senderName: user.displayName || user.email,
        senderId: user.uid,
        createdAt: new Date()
      }
    })

    // Notify participants (non-blocking)
    notifyChannelParticipants(channel, message, user.uid).catch(console.error)

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
