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

async function main() {
  const args = process.argv.slice(2)
  
  const getArg = (flag: string): string | undefined => {
    const idx = args.indexOf(flag)
    if (idx !== -1 && idx + 1 < args.length) return args[idx + 1]
    return undefined
  }

  const preset = getArg('--preset')
  let title = getArg('--title')
  let body = getArg('--body')
  let url = getArg('--url') || '/dashboard'
  let category = getArg('--category') || 'ANNOUNCEMENT'

  if (preset === 'profile-update') {
    title = title || 'Action Required: Profile Update'
    body = body || 'Please update your profile details and academic department information as per the new session.'
    url = '/profile'
    category = 'TASK'
  } else if (preset === 'app-update') {
    title = title || 'New App Update Available'
    body = body || 'A new update has been published on s3cNS! Go check out the latest features and improvements.'
    url = '/dashboard'
    category = 'ANNOUNCEMENT'
  } else if (preset === 'utility') {
    title = title || 'New Resource in Utilities Library'
    body = body || 'A new PPT / DOC document has been uploaded to the Utilities vault for Secretariat members.'
    url = '/utilities'
    category = 'ANNOUNCEMENT'
  } else if (preset === 'timetable') {
    title = title || 'Session Timetable Revised'
    body = body || 'The committee timetable and session schedule have been updated. Please review your schedule.'
    url = '/timetable'
    category = 'EVENT'
  }

  if (!title || !body) {
    console.log(`
Usage:
  npx tsx scripts/send-reminder.ts --preset profile-update
  npx tsx scripts/send-reminder.ts --preset app-update
  npx tsx scripts/send-reminder.ts --preset utility
  npx tsx scripts/send-reminder.ts --preset timetable
  npx tsx scripts/send-reminder.ts --title "Custom Title" --body "Custom Message" --url "/profile"
`)
    process.exit(1)
  }

  console.log('Connecting to database...')
  await connectToDatabase()

  console.log(`Fetching active Secretariat members...`)
  const users = await UserModel.find({ memberStatus: { $ne: 'REJECTED' } }, { _id: 1 }).lean()
  const userIds = users.map((u) => String(u._id))

  if (!userIds.length) {
    console.error('No active users found!')
    process.exit(1)
  }

  console.log(`Broadcasting to ${userIds.length} members...`)
  console.log(`Title: "${title}"`)
  console.log(`Body: "${body}"`)
  console.log(`Target URL: "${url}"`)

  await sendNotificationToUsers(userIds, {
    category: category as any,
    title,
    body,
    url,
    sendEmail: true,
  })

  await BroadcastLog.create({
    title,
    body,
    url,
    category,
    targetAudience: 'ALL',
    targetValue: 'ALL',
    recipientCount: userIds.length,
    sentBy: 'CLI Script (Developer)',
    isDeveloperOverride: true,
  })

  console.log(`✅ Broadcast sent successfully via In-App Notification, Web Push, and Email to ${userIds.length} members!`)
  process.exit(0)
}

main().catch((err) => {
  console.error('CLI Script Error:', err)
  process.exit(1)
})
