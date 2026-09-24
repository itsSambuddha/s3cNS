import fs from 'fs'
import path from 'path'

const FLAG_FILE = path.join(process.cwd(), 'shutdown.flag')
const CONFIG_FILE = path.join(process.cwd(), 'config', 'shutdown.json')

export interface ShutdownState {
  terminated: boolean
  updatedAt: string
  reason: string
}

export function isAppTerminated(): boolean {
  try {
    if (process.env.APP_TERMINATED === 'true') return true
    if (fs.existsSync(FLAG_FILE)) return true

    if (fs.existsSync(CONFIG_FILE)) {
      const content = fs.readFileSync(CONFIG_FILE, 'utf8')
      const data = JSON.parse(content)
      return !!data.terminated
    }
  } catch (err) {
    // Return false on error reading filesystem
  }
  return false
}

export function getShutdownInfo(): ShutdownState {
  const defaultState: ShutdownState = {
    terminated: isAppTerminated(),
    updatedAt: new Date().toISOString(),
    reason: 'Due to complete lack of activity, s3cNS has been permanently terminated.',
  }

  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const content = fs.readFileSync(CONFIG_FILE, 'utf8')
      const data = JSON.parse(content)
      return {
        terminated: !!data.terminated || fs.existsSync(FLAG_FILE),
        updatedAt: data.updatedAt || defaultState.updatedAt,
        reason: data.reason || defaultState.reason,
      }
    }
  } catch (err) {
    // fallback to default
  }

  return defaultState
}

export function setAppTerminated(terminated: boolean, reason?: string): ShutdownState {
  const configDir = path.join(process.cwd(), 'config')
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true })
  }

  const newState: ShutdownState = {
    terminated,
    updatedAt: new Date().toISOString(),
    reason: reason || 'Due to complete lack of activity, s3cNS has been permanently terminated.',
  }

  // Update JSON config
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(newState, null, 2), 'utf8')

  // Toggle flag file
  if (terminated) {
    if (!fs.existsSync(FLAG_FILE)) {
      fs.writeFileSync(FLAG_FILE, 'SHUTDOWN_ACTIVE', 'utf8')
    }
  } else {
    if (fs.existsSync(FLAG_FILE)) {
      fs.unlinkSync(FLAG_FILE)
    }
  }

  return newState
}
