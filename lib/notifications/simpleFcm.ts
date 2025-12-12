// lib/notifications/simpleFcm.ts
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID!
const CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL!
const PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY!

type SimplePayload = { title: string; body: string; url?: string }

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

export async function sendTestPushToToken(token: string, payload: SimplePayload) {
  const accessToken = await getAccessToken()

  const body = {
    message: {
      token,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.url ? { url: payload.url } : {},
    },
  }

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

  const text = await res.text()
  console.log("FCM response", res.status, text)
}
