// app/api/chat/messages/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import mongoose from 'mongoose'
import { Message } from '@/lib/db/models/Message'
import { Channel } from '@/lib/db/models/Channel'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const channelId = searchParams.get('channelId')
    const since = searchParams.get('since')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!channelId) return NextResponse.json({ error: 'Missing channelId' }, { status: 400 })

    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectToDatabase()

    const query: any = { channelId, deleted: { $ne: true } }
    if (since) {
      query.createdAt = { $gt: new Date(since) }
    }

    // Manual population to bypass StrictPopulateError
    const messages = await Message.find(query)
      .sort({ createdAt: 1 })
      .limit(limit)
      .lean()

    const finalMessages = await Promise.all(messages.map(async (msg) => {
      if (msg.replyTo) {
        const replyToMsg = await Message.findById(msg.replyTo)
          .select('content senderName senderId')
          .lean()
        return { ...msg, replyTo: replyToMsg }
      }
      return msg
    }))

    // Mark as read (non-blocking)
    const unreadIds = messages
      .filter(m => !m.readBy?.some(r => r.userId === user.uid))
      .map(m => m._id)

    if (unreadIds.length > 0) {
      Message.updateMany(
        { _id: { $in: unreadIds } },
        { $push: { readBy: { userId: user.uid, at: new Date() } } }
      ).catch(console.error)
    }

    return NextResponse.json({ messages: finalMessages })
  } catch (error) {
    console.error('Fetch messages error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { channelId, content, attachments, replyTo } = await req.json()
    if (!channelId || !content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectToDatabase()

    const channel = await Channel.findById(channelId)
    if (!channel) return NextResponse.json({ error: 'Channel not found' }, { status: 404 })

    const designation = user.secretariatRole || user.role
    const displayNameWithRole = `(${designation}) ${user.displayName || user.email}`

    // Create message with basic replyTo ID
    const message = await Message.create({
      channelId,
      senderId: user.uid,
      senderName: displayNameWithRole,
      senderAvatar: user.photoURL,
      content,
      attachments: attachments || [],
      replyTo: (replyTo && replyTo != 'undefined') ? replyTo : undefined,
      readBy: [{ userId: user.uid, at: new Date() }]
    })

    // Manual merge for the response to bypass StrictPopulateError
    let populatedReplyTo = null
    if (message.replyTo) {
      populatedReplyTo = await Message.findById(message.replyTo)
        .select('content senderName senderId')
        .lean()
    }

    const result = {
      ...message.toObject(),
      replyTo: populatedReplyTo
    }

    // Update channel last message
    await Channel.findByIdAndUpdate(channelId, {
      lastMessage: {
        content: content.substring(0, 50),
        senderName: user.displayName || user.email,
        senderId: user.uid,
        createdAt: new Date()
      }
    })

    return NextResponse.json({ message: result })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
