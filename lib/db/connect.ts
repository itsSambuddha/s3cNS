// lib/db/connect.ts
import mongoose from 'mongoose'

let cached = (global as any)._mongooseCached

if (!cached) {
  cached = (global as any)._mongooseCached = { conn: null, promise: null }
}

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not set in environment variables')
  }

  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        dbName: process.env.MONGODB_DB || 's3cns',
      })
      .then((mongooseInstance) => mongooseInstance)
  }

  cached.conn = await cached.promise
  return cached.conn
}
