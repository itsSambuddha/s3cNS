// lib/uploadthing.ts
import type { OurFileRouter } from '@/app/api/upoadthing/core'
import { generateReactHelpers } from '@uploadthing/react'

export const { useUploadThing } = generateReactHelpers<OurFileRouter>()
