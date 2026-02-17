// lib/auth/getCurrentUser.ts
import { cookies } from 'next/headers'
import { connectToDatabase } from '@/lib/db/connect'
import { User } from '@/lib/db/models/User'
import { verifySessionToken } from './jwt'

export async function getCurrentUser() {
  try {
    await connectToDatabase()

    const cookieStore = await cookies()
    const token = cookieStore.get('s3cns_session')?.value

    console.log('[AuthDebug] getCurrentUser called')
    if (!token) {
      console.log('[AuthDebug] No s3cns_session cookie found')
      return null
    }

    const payload = await verifySessionToken(token)
    if (!payload || !payload.uid) {
      console.log('[AuthDebug] Token verification failed or no uid', payload)
      return null
    }

    const user = await User.findOne({ uid: payload.uid }).lean().exec()

    if (!user) {
      console.log('[AuthDebug] User not found in DB for uid:', payload.uid)
      return null
    }

    // Mongoose lean() returns POJO, safe to return
    return user
  } catch (error) {
    console.error('[AuthDebug] getCurrentUser crashed:', error)
    return null
  }
}
