// app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from 'uploadthing/next'

import { verifySessionToken } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';

const f = createUploadthing()

export const ourFileRouter = {
  avatarUploader: f({ image: { maxFileSize: '2MB', maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const cookieStore = await cookies();
      const token = cookieStore.get('s3cns_session')?.value;

      if (!token) throw new Error("Unauthorized");

      const payload = await verifySessionToken(token);
      if (!payload || !payload.uid) throw new Error("Unauthorized");

      return { userId: payload.uid };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      // file.url is the public URL; metadata includes userId from middleware
      console.log("Upload complete for userId:", metadata.userId);
      return { url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
