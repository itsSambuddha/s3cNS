"use client"

import React, { useEffect } from "react"
import { useFCM } from "@/hooks/useFCM"

export function Providers({ children }: { children: React.ReactNode }) {
  useFCM();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) =>
          console.log(
            "Service Worker registration successful with scope: ",
            registration.scope
          )
        )
        .catch((err) =>
          console.log("Service Worker registration failed: ", err)
        );
    }
  }, []);

  return <>{children}</>
}
