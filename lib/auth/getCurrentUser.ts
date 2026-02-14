// lib/auth/getCurrentUser.ts
import { cookies } from 'next/headers'
import { connectToDatabase } from '@/lib/db/connect'
import { User } from '@/lib/db/models/User'
import { verifySessionToken } from './jwt'

export async function getCurrentUser() {
  await connectToDatabase()

  const cookieStore = await cookies()
  const token = cookieStore.get('s3cns_session')?.value

  if (!token) return null

  const payload = await verifySessionToken(token)
  if (!payload || !payload.uid) return null

  const user = await User.findOne({ uid: payload.uid }).lean().exec()

  if (!user) return null

  // Mongoose lean() returns POJO, safe to return
  return user
}
