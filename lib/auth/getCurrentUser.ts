// lib/auth/getCurrentUser.ts
import { cookies } from 'next/headers'
import { connectToDatabase } from '@/lib/db/connect'
import { User } from '@/lib/db/models/User'

export async function getCurrentUser() {
  await connectToDatabase()

  const cookieStore = await cookies()
  const uid = cookieStore.get('s3cns_session')?.value
  if (!uid) return null

  const user = await User.findOne({ uid }).lean().exec()
  if (!user) return null

  return user
}
