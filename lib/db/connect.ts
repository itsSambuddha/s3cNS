// lib/db/connect.ts
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not set in environment variables')
}

let cached = (global as any)._mongooseCached

if (!cached) {
  cached = (global as any)._mongooseCached = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: process.env.MONGODB_DB || 's3cns',
      })
      .then((mongooseInstance) => mongooseInstance)
  }

  cached.conn = await cached.promise
  return cached.conn
}
