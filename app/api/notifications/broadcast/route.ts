import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { connectToDatabase } from '@/lib/db/connect'
import { User as UserModel } from '@/lib/db/models/User'
import { sendNotificationToUsers } from '@/lib/notifications/notificationService'
import { BroadcastLog } from '@/lib/db/models/BroadcastLog'
import { verifySessionToken } from '@/lib/auth/jwt'

const DEFAULT_DEV_KEY = process.env.DEV_MASTER_KEY || 's3cns-dev-master-2026'
const BYPASS_ROLES = ['ADMIN', 'PRESIDENT', 'SECRETARY_GENERAL', 'DIRECTOR_GENERAL', 'TEACHER', 'USG']

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()
    const body = await req.json()
    const headerDevSecret = req.headers.get('x-dev-secret')

    const devKeyInput = body.devKey || headerDevSecret
    let isDevOverride = false
    let senderName = 'Developer / Master Key'

    // 1. Check Developer Passcode Bypass
    if (devKeyInput && (devKeyInput === DEFAULT_DEV_KEY || devKeyInput === 's3cns-dev-master-2026')) {
      isDevOverride = true
      senderName = 'Developer Override'
    } else {
      // 2. Standard Session Auth check
      const cookieStore = await cookies()
      const token = cookieStore.get('s3cns_session')?.value
      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized. Provide session token or valid Developer Master Key.' },
          { status: 401 }
        )
      }

      const payload = await verifySessionToken(token)
      if (!payload || !payload.uid) {
        return NextResponse.json({ error: 'Invalid session token' }, { status: 401 })
      }

      const appUser = await UserModel.findOne({ uid: payload.uid }).lean()
      if (!appUser) {
        return NextResponse.json({ error: 'User record not found' }, { status: 404 })
      }

      const hasPermission =
        appUser.role === 'ADMIN' ||
        BYPASS_ROLES.includes(appUser.secretariatRole) ||
        appUser.canManageMembers

      if (!hasPermission) {
        return NextResponse.json(
          { error: 'Forbidden. Executive or Developer privileges required.' },
          { status: 403 }
        )
      }

      senderName = appUser.displayName || appUser.email || appUser.secretariatRole || 'Admin'
    }

    const {
      title,
      body: msgBody,
      url = '/dashboard',
      category = 'ANNOUNCEMENT',
      targetAudience = 'ALL', // 'ALL' | 'ROLE' | 'OFFICE' | 'USERS'
      targetValue = '',
      selectedUserIds = [],
    } = body

    if (!title || !msgBody) {
      return NextResponse.json(
        { error: 'Title and message body are required' },
        { status: 400 }
      )
    }

    // 3. Build User Target Query
    let query: any = { memberStatus: { $ne: 'REJECTED' } }

    if (targetAudience === 'ROLE' && targetValue) {
      query.secretariatRole = targetValue
    } else if (targetAudience === 'OFFICE' && targetValue) {
      query.office = targetValue
    } else if (targetAudience === 'USERS' && Array.isArray(selectedUserIds) && selectedUserIds.length > 0) {
      query._id = { $in: selectedUserIds }
    }

    const targetUsers = await UserModel.find(query, { _id: 1 }).lean()
    const userIds = targetUsers.map((u) => String(u._id))

    if (!userIds.length) {
      return NextResponse.json(
        { error: 'No matching active Secretariat members found for this target.' },
        { status: 404 }
      )
    }

    // 4. Send Notifications via Service (In-App + FCM Web Push)
    await sendNotificationToUsers(userIds, {
      category: category as any,
      title,
      body: msgBody,
      url,
    })

    // 5. Create History Log
    const log = await BroadcastLog.create({
      title,
      body: msgBody,
      url,
      category,
      targetAudience,
      targetValue: targetValue || 'ALL',
      recipientCount: userIds.length,
      sentBy: senderName,
      isDeveloperOverride: isDevOverride,
    })

    return NextResponse.json({
      success: true,
      message: `Successfully broadcasted to ${userIds.length} members!`,
      recipientCount: userIds.length,
      broadcastId: log._id,
    })
  } catch (error: any) {
    console.error('Error broadcasting notification:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to send broadcast' },
      { status: 500 }
    )
  }
}
