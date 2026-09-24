import fs from 'fs'
import path from 'path'

// Auto-load .env.local for CLI standalone environment execution
try {
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    envContent.split('\n').forEach((line) => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const idx = trimmed.indexOf('=')
        if (idx !== -1) {
          const key = trimmed.slice(0, idx).trim()
          const val = trimmed.slice(idx + 1).trim().replace(/^["'](.+)["']$/, '$1')
          if (key && !process.env[key]) {
            process.env[key] = val
          }
        }
      }
    })
  }
} catch (e) {
  // Ignore env load failure
}

import { connectToDatabase } from '../lib/db/connect'
import { User as UserModel } from '../lib/db/models/User'
import { sendNotificationToUsers } from '../lib/notifications/notificationService'
import { BroadcastLog } from '../lib/db/models/BroadcastLog'
import { setAppTerminated } from '../lib/shutdown/shutdownManager'

async function main() {
  const args = process.argv.slice(2)
  const skipEnable = args.includes('--no-lock')

  if (!skipEnable) {
    console.log('🔒 Locking application into Permanent Termination mode...')
    setAppTerminated(true, 'Permanently terminated due to zero user activity.')
  }

  console.log('🔌 Connecting to database...')
  await connectToDatabase()

  console.log(`📋 Fetching all active Secretariat members...`)
  const users = await UserModel.find({ memberStatus: { $ne: 'REJECTED' } }, { _id: 1, email: 1, displayName: 1 }).lean()
  const userIds = users.map((u) => String(u._id))

  if (!userIds.length) {
    console.warn('⚠️ No active users found in database to notify.')
    process.exit(0)
  }

  const title = 'Notice of Service Decommission: s3cNS Platform Terminated'
  const body = `Following an extended period of zero recorded activity and member engagement, s3cNS has officially been decommissioned. Effective immediately, all online services, platform utilities, and account portals have been permanently terminated. Gratitude is expressed to everyone involved during its development. Goodbye.`

  console.log(`📢 Broadcasting Permanent Shutdown Notification to ALL ${userIds.length} members...`)
  console.log(`Title: "${title}"`)
  console.log(`Body: "${body}"`)

  await sendNotificationToUsers(userIds, {
    category: 'ANNOUNCEMENT',
    title,
    body,
    url: '/',
    sendEmail: true,
  })

  await BroadcastLog.create({
    title,
    body,
    url: '/',
    category: 'ANNOUNCEMENT',
    targetAudience: 'ALL',
    targetValue: 'ALL',
    recipientCount: userIds.length,
    sentBy: 'App Shutdown Script (Permanent Termination)',
    isDeveloperOverride: true,
  })

  console.log(`\n🥀 ✅ Notification sent via Email & Web Push to ALL ${userIds.length} members!`)
  console.log(`🖤 The app is now locked in Permanent Termination mode. Anyone opening the app will see ONLY the animated farewell page.`)
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Shutdown Notification Error:', err)
  process.exit(1)
})
