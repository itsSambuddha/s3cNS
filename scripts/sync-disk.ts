import fs from 'fs'
import path from 'path'

// Auto-load .env.local
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
} catch (e) {}

import { syncDiskUtilities } from '../lib/utilities/diskScanner'

async function run() {
  console.log('Scanning public/uploads/utilities/...')
  await syncDiskUtilities()
  console.log('✅ Disk utilities synced successfully with database!')
  process.exit(0)
}

run().catch((err) => {
  console.error('Error during disk sync:', err)
  process.exit(1)
})
