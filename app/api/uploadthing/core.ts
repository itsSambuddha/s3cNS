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
      console.log(">>> [UploadThing] Upload complete for userId:", metadata.userId);
      console.log(">>> [UploadThing] File URL:", file.url);
      
      // Return the URL explicitly to the client
      return { url: file.url, name: file.name, size: file.size }
    }),
  chatAttachment: f({ 
    image: { maxFileSize: '4MB', maxFileCount: 5 },
    pdf: { maxFileSize: '8MB', maxFileCount: 2 },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: '8MB' },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { maxFileSize: '8MB' },
  })
    .middleware(async ({ req }) => {
      const cookieStore = await cookies();
      const token = cookieStore.get('s3cns_session')?.value;
      if (!token) throw new Error("Unauthorized");
      const payload = await verifySessionToken(token);
      if (!payload || !payload.uid) throw new Error("Unauthorized");
      return { userId: payload.uid };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      return { url: file.url, name: file.name, size: file.size, type: file.type }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
