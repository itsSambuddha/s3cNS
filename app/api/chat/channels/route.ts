// app/api/chat/channels/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { Channel } from '@/lib/db/models/Channel'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()

    // 1. Ensure default channels exist
    const defaultChannels = [
      {
        name: 'Senior Secretariat',
        description: 'Private discussions for Senior Secretariat (President, SG, DG, Teachers)',
        allowedRoles: ['PRESIDENT', 'SECRETARY_GENERAL', 'DIRECTOR_GENERAL', 'TEACHER'],
        type: 'GROUP'
      },
      {
        name: 'Secretariat General',
        description: 'All USG, Deputy USG and Senior Secretariat',
        allowedRoles: ['PRESIDENT', 'SECRETARY_GENERAL', 'DIRECTOR_GENERAL', 'TEACHER', 'USG', 'DEPUTY_USG'],
        type: 'GROUP'
      },
      {
        name: 'General Discussion',
        description: 'Open to all secretariat and members',
        allowedRoles: ['PRESIDENT', 'SECRETARY_GENERAL', 'DIRECTOR_GENERAL', 'TEACHER', 'USG', 'DEPUTY_USG', 'OFFICE_BEARER', 'MEMBER', 'ADMIN'],
        type: 'GROUP'
      }
    ]

    for (const channel of defaultChannels) {
      await Channel.findOneAndUpdate(
        { name: channel.name }, 
        { ...channel },
        { upsert: true, new: true }
      )
    }

    // 2. Fetch channels the user has access to
    const channels = await Channel.find({
      $or: [
        { 
          type: 'GROUP', 
          $or: [
            { allowedRoles: user.secretariatRole },
            { allowedRoles: user.role }
          ]
        },
        {
          type: 'DM',
          participants: user.uid
        }
      ]
    }).sort({ updatedAt: -1 })

    return NextResponse.json({ channels })
  } catch (error) {
    console.error('Fetch channels error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
