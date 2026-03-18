// lib/chat/notifications.ts
import { adminMessaging } from '@/lib/firebase/admin'
import { sendEmail } from '@/lib/email/sendEmail'
import { User } from '@/lib/db/models/User'
import { connectToDatabase } from '@/lib/db/connect'
import type { IMessage } from '@/lib/db/models/Message'
import type { IChannel } from '@/lib/db/models/Channel'

/**
 * Notifies all eligible participants of a channel about a new message.
 * Eligible participants are users whose secretariatRole or role matches the channel's allowedRoles.
 */
export async function notifyChannelParticipants(
  channel: IChannel,
  message: IMessage,
  senderId: string
) {
  console.log(`>>> [ChatNotify] Starting for channel: ${channel.name} (${channel._id})`);
  await connectToDatabase()

  // 1. Find all users who are in the "allowedRoles" for this channel
  // We exclude the sender
  const query = {
    // uid: { $ne: senderId }, // Temporarily disabled so you can test notifications on your own account
    $or: [
      { secretariatRole: { $in: channel.allowedRoles } },
      { role: { $in: channel.allowedRoles } }
    ],
    memberStatus: { $in: ['ACTIVE', 'APPLICANT'] } 
  };
  
  console.log(`>>> [ChatNotify] Query:`, JSON.stringify(query, null, 2));
  
  const eligibleUsers = await User.find(query);

  console.log(`>>> [ChatNotify] Found ${eligibleUsers.length} eligible users (excluding sender)`);

  const notificationTitle = `${message.senderName} in ${channel.name}`
  const notificationBody = message.content.length > 100 
    ? message.content.substring(0, 97) + '...' 
    : message.content
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://s3cns.vercel.app'; // Fallback to current hosting
  const chatUrl = `${baseUrl.replace(/\/$/, '')}/chat?channelId=${channel._id}`

  const pushPromises = []
  const emailPromises = []

  for (const user of eligibleUsers) {
    console.log(`>>> [ChatNotify] Processing user: ${user.email} (hasToken: ${!!user.fcmToken})`);
    
    // Send Push Notification if FCM token exists
    const pushEnabled = user.notificationPreferences?.pushEnabled !== false;
    if (user.fcmToken && pushEnabled) {
      console.log(`>>> [ChatNotify] Dispatching Push to ${user.email}`);
      pushPromises.push(
        adminMessaging.send({
          token: user.fcmToken,
          notification: {
            title: notificationTitle,
            body: notificationBody,
          },
          data: {
            url: chatUrl,
            channelId: channel._id.toString(),
            type: 'chat_message'
          },
          webpush: {
            fcmOptions: {
              link: chatUrl
            },
            notification: {
              vibrate: [200, 100, 200],
              icon: '/logo/s3cnsLogo.svg',
              badge: '/logo/s3cnsLogo.svg',
              tag: channel._id.toString(),
              renotify: true
            }
          }
        }).then(() => console.log(`>>> [ChatNotify] Push SENT to ${user.email}`))
          .catch(err => console.error(`>>> [ChatNotify] Push FAILED for ${user.email}:`, err))
      )
    } else {
      console.log(`>>> [ChatNotify] Push SKIPPED for ${user.email} (token: ${!!user.fcmToken}, enabled: ${pushEnabled})`);
    }

    // Send Email Notification if enabled
    const emailEnabled = user.notificationPreferences?.announcements !== false;
    if (user.email && emailEnabled) {
      console.log(`>>> [ChatNotify] Dispatching Email to ${user.email}`);
      emailPromises.push(
        sendEmail({
          to: user.email,
          subject: `New message from ${message.senderName}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
              <h2 style="color: #333;">New Message in ${channel.name}</h2>
              <p><strong>${message.senderName}:</strong></p>
              <blockquote style="background: #f9f9f9; border-left: 5px solid #ccc; padding: 10px 20px; margin: 20px 0;">
                ${message.content}
              </blockquote>
              <div style="margin-top: 30px;">
                <a href="${chatUrl}" style="background: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Open Chat
                </a>
              </div>
              <hr style="margin-top: 40px; border: 0; border-top: 1px solid #eee;" />
              <p style="font-size: 12px; color: #777;">
                You are receiving this because you are part of the ${channel.name} channel on s3cNS.
              </p>
            </div>
          `,
          fromName: 's3cNS Chat'
        }).then(() => console.log(`>>> [ChatNotify] Email SENT to ${user.email}`))
          .catch(err => console.error(`>>> [ChatNotify] Email FAILED for ${user.email}:`, err))
      )
    } else {
      console.log(`>>> [ChatNotify] Email SKIPPED for ${user.email} (hasEmail: ${!!user.email}, enabled: ${emailEnabled})`);
    }
  }

  await Promise.allSettled([...pushPromises, ...emailPromises]);
  console.log(`>>> [ChatNotify] All finished for channel ${channel.name}`);
}
