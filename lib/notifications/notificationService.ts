import { connectToDatabase } from "@/lib/db/connect"
import { Device as DeviceModel } from "@/lib/db/models/Device"
import NotificationModel, {
  type NotificationCategory,
} from "@/lib/db/models/Notification"
import { User as UserModel } from "@/lib/db/models/User"

import { sendEmail } from "@/lib/email/sendEmail"

const trimEnv = (val?: string) => val?.trim().replace(/^["'](.+)["']$/, '$1') || ''

const PROJECT_ID = trimEnv(process.env.FIREBASE_PROJECT_ID)
const CLIENT_EMAIL = trimEnv(process.env.FIREBASE_CLIENT_EMAIL)
const PRIVATE_KEY = trimEnv(process.env.FIREBASE_PRIVATE_KEY)

export type NotificationPayload = {
  category: NotificationCategory
  title: string
  body: string
  url?: string
  data?: Record<string, string>
  sendEmail?: boolean
}

function base64url(obj: any) {
  return Buffer.from(JSON.stringify(obj))
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
}

async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: "RS256", typ: "JWT" }
  const payload = {
    iss: CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }

  const crypto = await import("crypto")
  const toSign = `${base64url(header)}.${base64url(payload)}`

  const sign = crypto.createSign("RSA-SHA256")
  sign.update(toSign)
  sign.end()

  const signature = sign
    .sign(PRIVATE_KEY.replace(/\\n/g, "\n"))
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")

  const jwt = `${toSign}.${signature}`

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  })

  const json = (await res.json()) as { access_token?: string }
  if (!json.access_token) throw new Error("No access_token from Google")
  return json.access_token
}

function userAllows(category: NotificationCategory, user: any) {
  const prefs = user.notificationPreferences || {}
  if (prefs.pushEnabled === false) return false

  switch (category) {
    case "BUDGET":
      return prefs.budget !== false
    case "APPROVAL":
      return prefs.approvals !== false
    case "EVENT":
      return prefs.events !== false
    case "TASK":
      return prefs.tasks !== false
    case "SECURITY":
      return prefs.security !== false
    case "ANNOUNCEMENT":
      return prefs.announcements !== false
  }
}

export async function sendNotificationToUsers(
  userIds: string[],
  payload: NotificationPayload,
) {
  if (!userIds.length) return

  await connectToDatabase()

  // 1) create in‑app notifications
  const users = await UserModel.find({ _id: { $in: userIds } }).lean()

  const allowedUserIds = users
    .filter((u) => userAllows(payload.category, u))
    .map((u) => String(u._id))

  if (!allowedUserIds.length) return

  const docs = allowedUserIds.map((uid) => ({
    userId: uid,
    category: payload.category,
    title: payload.title,
    body: payload.body,
    url: payload.url,
    data: payload.data || {},
  }))

  await NotificationModel.insertMany(docs)

  // 2) email notifications
  if (payload.sendEmail !== false) {
    const targetEmails = users
      .filter((u) => userAllows(payload.category, u) && u.email)
      .map((u) => u.email)

    if (targetEmails.length > 0) {
      const appDomain = process.env.NEXT_PUBLIC_APP_URL || "https://s3cns.vercel.app"
      const actionUrl = payload.url ? (payload.url.startsWith("http") ? payload.url : `${appDomain}${payload.url}`) : `${appDomain}/dashboard`

      const emailHtml = `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #334155;">
  <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 28px; text-align: center; border-bottom: 1px solid #334155;">
    <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #38bdf8; letter-spacing: 1px;">SECMUN SECRETARIAT</h1>
    <p style="margin: 4px 0 0 0; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px;">Official Member Notification</p>
  </div>
  <div style="padding: 32px; background-color: #0f172a;">
    <div style="display: inline-block; padding: 4px 12px; background-color: #0284c7; color: #ffffff; font-size: 11px; font-weight: 700; border-radius: 20px; text-transform: uppercase; margin-bottom: 16px;">
      ${payload.category}
    </div>
    <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700; color: #ffffff; line-height: 1.3;">
      ${payload.title}
    </h2>
    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap;">
      ${payload.body}
    </p>
    <div style="text-align: center; margin-top: 28px;">
      <a href="${actionUrl}" style="background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: #ffffff; padding: 12px 28px; text-decoration: none; font-size: 14px; font-weight: 700; border-radius: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);">
        View Details on SECMUN Portal &rarr;
      </a>
    </div>
  </div>
  <div style="padding: 20px; background-color: #020617; text-align: center; border-top: 1px solid #1e293b;">
    <p style="margin: 0; font-size: 11px; color: #64748b;">
      St. Edmund's Model United Nations Secretariat • Automated Notification System
    </p>
  </div>
</div>
`
      try {
        await sendEmail({
          to: targetEmails,
          subject: `[SECMUN] ${payload.title}`,
          html: emailHtml,
          fromName: "SECMUN Secretariat",
        })
        console.log(`[Email Notification] Successfully sent email to ${targetEmails.length} member(s).`)
      } catch (emailErr: any) {
        console.warn(`[Email Notification Warning] Could not send emails (Check SMTP setup): ${emailErr?.message || emailErr}`)
      }
    }
  }

  // 3) push to devices
  const devices = await DeviceModel.find({
    userId: { $in: allowedUserIds },
    isActive: true,
  }).lean()

  const tokens = Array.from(new Set(devices.map((d) => d.token)))
  if (!tokens.length) return

  const accessToken = await getAccessToken()

  // simple fan‑out; can be optimized later
  for (const token of tokens) {
    const body = {
      message: {
        token,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: {
          ...(payload.data || {}),
          ...(payload.url ? { url: payload.url } : {}),
          category: payload.category,
        },
      },
    }

    try {
      const res = await fetch(
        `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(body),
        },
      )

      if (!res.ok) {
        const txt = await res.text()
        console.error("FCM send error", res.status, txt)

        if (
          txt.includes("UNREGISTERED") ||
          txt.includes("registration-token-not-registered") ||
          txt.includes("NOT_FOUND")
        ) {
          await DeviceModel.updateOne({ token }, { $set: { isActive: false } })
        }
      }
    } catch (e) {
      console.error("FCM send exception", e)
    }
  }
}

export async function sendNotificationToUser(
  userId: string,
  payload: NotificationPayload,
) {
  return sendNotificationToUsers([userId], payload)
}
