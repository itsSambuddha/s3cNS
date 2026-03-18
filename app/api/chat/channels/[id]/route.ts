// app/api/chat/channels/[id]/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { Channel } from '@/lib/db/models/Channel'
import { Message } from '@/lib/db/models/Message'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    await connectToDatabase()

    const channel = await Channel.findById(id)
    if (!channel) return NextResponse.json({ error: 'Channel not found' }, { status: 404 })

    // Verify access/permission
    const isParticipant = channel.participants?.includes(user.uid)
    const isAdmin = user.role === 'ADMIN'

    // Only participants or admins can delete DMs. 
    // Usually, "deleting a DM" means purging the whole history for both.
    if (!isParticipant && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // 1. Delete all messages in this channel
    await Message.deleteMany({ channelId: id })

    // 2. Delete the channel itself
    await Channel.findByIdAndDelete(id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Channel deletion error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
