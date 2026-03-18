// app/api/chat/channels/dm/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { Channel } from '@/lib/db/models/Channel'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { User } from '@/lib/db/models/User'

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { targetUid } = await req.json()
    if (!targetUid) return NextResponse.json({ error: 'Target user ID required' }, { status: 400 })

    await connectToDatabase()

    // 1. Check if target user exists and is approved/secretariat
    const targetUser = await User.findOne({ uid: targetUid })
    if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // 2. Check if a DM channel already exists between these two
    let channel = await Channel.findOne({
      type: 'DM',
      participants: { $all: [currentUser.uid, targetUid] }
    })

    if (!channel) {
      // Create new DM channel
      const senderPrefix = currentUser.secretariatRole || currentUser.role
      const targetPrefix = targetUser.secretariatRole || targetUser.role
      
      channel = await Channel.create({
        name: `(${senderPrefix}) ${currentUser.displayName} & (${targetPrefix}) ${targetUser.displayName}`,
        type: 'DM',
        participants: [currentUser.uid, targetUid],
        allowedRoles: [] // DMs don't use roles for access, they use participants
      })
    }

    return NextResponse.json(channel)
  } catch (error: any) {
    console.error('DM creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
