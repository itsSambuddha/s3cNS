import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db/connect'
import { User } from '@/lib/db/models/User'
import { sendEmail } from '@/lib/email/sendEmail'
import { sendNotificationToUsers, type NotificationPayload } from '@/lib/notifications/notificationService'
import { Device as DeviceModel } from '@/lib/db/models/Device'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { canManageDelegationTeam } from '@/lib/delegation-team/access'

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !canManageDelegationTeam(user)) {
      return NextResponse.json({ error: 'Unauthorized. Only Senior Secretariat can send announcements.' }, { status: 403 })
    }

    const body = await req.json()
    const { title, content, platforms, recipientsGroup, individualIds } = body

    if (!title || !content || !platforms) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectToDatabase()

    let query: any = { memberStatus: 'ACTIVE' }
    
    if (recipientsGroup === 'INDIVIDUAL' && Array.isArray(individualIds) && individualIds.length === 0) {
      // Test mode: Send only to current user
      query._id = user._id
    } else if (individualIds && Array.isArray(individualIds) && individualIds.length > 0) {
      query._id = { $in: individualIds }
    } else if (recipientsGroup === 'SENIOR_SECRETARIAT') {
      query.secretariatRole = { $in: ['PRESIDENT', 'SECRETARY_GENERAL', 'DIRECTOR_GENERAL', 'TEACHER'] }
    } else if (recipientsGroup === 'ALL_APPROVED') {
      // already set to ACTIVE
    } else {
      return NextResponse.json({ error: 'No recipients specified.' }, { status: 400 })
    }

    const targetUsers = await User.find(query).select('email phone _id displayName').lean()

    if (targetUsers.length === 0) {
      return NextResponse.json({ error: 'No users found in target group' }, { status: 404 })
    }

    const results: any = {
      totalRecipients: targetUsers.length,
      emailsSent: 0,
      emailsFailed: 0,
      pushSent: false,
      unreachablePushCount: 0,
      errors: [] as string[]
    }

    // Reach Analysis: Check who doesn't have a device registered
    if (platforms.includes('push')) {
      const activeDevices = await DeviceModel.find({
        userId: { $in: targetUsers.map(u => u._id) },
        isActive: true
      }).select('userId').lean()
      
      const registeredUserIds = new Set(activeDevices.map(d => String(d.userId)))
      results.unreachablePushCount = targetUsers.filter(u => !registeredUserIds.has(String(u._id))).length
    }

    // 1. Email
    if (platforms.includes('email')) {
      for (const u of targetUsers) {
        if (!u.email) {
          results.emailsFailed++
          continue
        }
        try {
          await sendEmail({
            to: u.email,
            subject: title,
            html: `<div style="font-family: sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
              <div style="background: #0f172a; padding: 24px; color: white;">
                <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.025em;">SECMUN ANNOUNCEMENT</h1>
              </div>
              <div style="padding: 32px; background: white;">
                <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 24px; font-weight: 700;">${title}</h2>
                <p style="margin: 0; white-space: pre-wrap;">${content}</p>
              </div>
              <div style="padding: 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #64748b;">This message was sent from the SEC-MUN Portal by an authorized administrator.</p>
              </div>
            </div>`,
            fromName: "SEC-MUN"
          })
          results.emailsSent++
        } catch (e: any) {
          console.error(`Failed to send email to ${u.email}`, e)
          results.emailsFailed++
          results.errors.push(`Email (${u.email}): ${e.message || 'SMTP Error'}`)
        }
      }
    }

    // 2. Push / In-app
    if (platforms.includes('push')) {
      const userIds = targetUsers.map(u => String(u._id))
      const payload: NotificationPayload = {
        category: 'ANNOUNCEMENT',
        title: title,
        body: content,
        data: { url: '/dashboard' }
      }
      try {
        await sendNotificationToUsers(userIds, payload)
        results.pushSent = true
      } catch (e: any) {
        console.error('Push notification failed', e)
        results.errors.push(`Push: ${e.message || 'Unknown Error'}`)
      }
    }

    return NextResponse.json({ ok: true, results })
  } catch (error: any) {
    console.error('Announcement API error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
