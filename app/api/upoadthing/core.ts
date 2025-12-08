// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

export const ourFileRouter = {
  avatarUploader: f({ image: { maxFileSize: '2MB', maxFileCount: 1 } })
    .onUploadComplete(async ({ file, metadata }) => {
      // file.url is the public URL; metadata can include uid later if you want
      return { url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
