// hooks/usePushRegistration.ts
"use client"

import { useEffect } from "react"
import { requestNotificationToken, subscribeForegroundMessages } from "@/lib/firebase/messaging"
import { useAuth } from "@/hooks/useAuth"
import { useAppUser } from "@/hooks/useAppUser"

export function usePushRegistration() {
  const { user: fbUser } = useAuth()
  const { user: appUser } = useAppUser()

  useEffect(() => {
    if (!fbUser || !appUser) return

    const register = async () => {
      try {
        const token = await requestNotificationToken()
        if (!token) return

        console.log("FCM token for this device:", token)

        await fetch("/api/notifications/register-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            userId: appUser._id, // important: send Mongo user id
            platform: "web",
          }),
        })
      } catch (e) {
        console.error("push registration error", e)
      }
    }

    register()

    subscribeForegroundMessages((payload) => {
      const title = payload.notification?.title ?? "Notification"
      const body = payload.notification?.body ?? ""

      alert(`${title}\n\n${body}`)
    })
  }, [fbUser, appUser])
}
