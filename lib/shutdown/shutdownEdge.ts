import shutdownData from '@/config/shutdown.json'

export function isAppTerminatedEdge(): boolean {
  try {
    if (process.env.APP_TERMINATED === 'true' || process.env.NEXT_PUBLIC_APP_TERMINATED === 'true') {
      return true
    }
    return !!shutdownData?.terminated
  } catch (e) {
    return false
  }
}
