import { connectToDatabase } from "@/lib/db/connect"
import { Device as DeviceModel } from "@/lib/db/models/Device"
import NotificationModel, {
  type NotificationCategory,
} from "@/lib/db/models/Notification"
import { User as UserModel } from "@/lib/db/models/User"

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID!
const CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL!
const PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY!

export type NotificationPayload = {
  category: NotificationCategory
  title: string
  body: string
  url?: string
  data?: Record<string, string>
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

  // 2) push to devices
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
