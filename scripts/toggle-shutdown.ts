import { setAppTerminated, isAppTerminated, getShutdownInfo } from '../lib/shutdown/shutdownManager'
import { execSync } from 'child_process'

const args = process.argv.slice(2)
const command = args[0]?.toLowerCase()

if (!command || command === 'help' || command === '-h') {
  console.log(`
s3cNS Permanent Shutdown CLI Tool
=================================

Usage:
  npx tsx scripts/toggle-shutdown.ts on         Enable app termination page (lockout active)
  npx tsx scripts/toggle-shutdown.ts off        Disable app termination page (restore app)
  npx tsx scripts/toggle-shutdown.ts status     Check current app termination status
  npx tsx scripts/toggle-shutdown.ts notify     Send sad termination email & push notification
  npx tsx scripts/toggle-shutdown.ts on --notify Enable termination AND send notification
`)
  process.exit(0)
}

if (command === 'on' || command === 'enable' || command === 'activate') {
  const info = setAppTerminated(true)
  console.log(`🔒 APP TERMINATION ACTIVATED!`)
  console.log(`Updated At: ${info.updatedAt}`)
  console.log(`Reason: ${info.reason}`)
  console.log(`\nAll app routes and APIs are now locked down to the animated Terminated page.`)

  if (args.includes('--notify')) {
    console.log(`\n📢 Sending shutdown broadcast...`)
    execSync('npx tsx scripts/send-shutdown-notification.ts --no-lock', { stdio: 'inherit' })
  }
} else if (command === 'off' || command === 'disable' || command === 'deactivate') {
  const info = setAppTerminated(false)
  console.log(`🔓 APP TERMINATION DEACTIVATED!`)
  console.log(`App has been unlocked and restored to normal operation.`)
} else if (command === 'status') {
  const info = getShutdownInfo()
  console.log(`App Termination Status: ${info.terminated ? '🔴 ACTIVE (LOCKED)' : '🟢 INACTIVE (NORMAL)'}`)
  console.log(`Last Updated: ${info.updatedAt}`)
  console.log(`Reason: ${info.reason}`)
} else if (command === 'notify') {
  console.log(`📢 Sending shutdown broadcast to all members...`)
  execSync('npx tsx scripts/send-shutdown-notification.ts', { stdio: 'inherit' })
} else {
  console.error(`Unknown command: "${command}". Run with "help" for options.`)
  process.exit(1)
}
