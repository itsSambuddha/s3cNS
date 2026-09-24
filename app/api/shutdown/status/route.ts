import { NextResponse } from 'next/server'
import { getShutdownInfo } from '@/lib/shutdown/shutdownManager'

export async function GET() {
  const info = getShutdownInfo()
  return NextResponse.json(info)
}
