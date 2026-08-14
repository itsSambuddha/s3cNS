// lib/firebase/messaging.ts
"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "BDZMx_Khov_BpbvOTWiCJVSacPbXkClIZFq5wT7rI9vAq3Is1LwP9y0G2IT3t18Vh3jOVN6asZw_S5wZrVTyTpQ";

// Initialize Firebase app on the client
function initializeClientApp() {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  } else {
    return getApp();
  }
}

async function getServiceWorkerRegistration() {
  if (!("serviceWorker" in navigator)) {
    console.warn("[FCM] Service workers are not supported in this browser environment.");
    return null;
  }

  try {
    const params = new URLSearchParams({
      apiKey: firebaseConfig.apiKey || "",
      authDomain: firebaseConfig.authDomain || "",
      projectId: firebaseConfig.projectId || "",
      storageBucket: firebaseConfig.storageBucket || "",
      messagingSenderId: firebaseConfig.messagingSenderId || "",
      appId: firebaseConfig.appId || "",
    });
    const swUrl = `/firebase-messaging-sw.js?${params.toString()}`;

    // Check if it's already registered
    let registration = await navigator.serviceWorker.getRegistration(swUrl);
    
    if (!registration) {
      console.log("[FCM] Registering new service worker...");
      registration = await navigator.serviceWorker.register(swUrl, {
        scope: "/"
      });
    }

    // Ensure it's active before returning
    if (registration.installing) {
      console.log("[FCM] SW Installing...");
      await new Promise<void>((resolve) => {
        registration!.installing?.addEventListener("statechange", (e: any) => {
          if (e.target.state === "activated") resolve();
        });
      });
    }

    const readyRegistration = await navigator.serviceWorker.ready;
    console.log("[FCM] Service Worker Ready.");
    return readyRegistration;
  } catch (error: any) {
    console.warn("[FCM] Service Worker registration skipped/failed:", error?.message || error);
    return null;
  }
}


export async function requestNotificationToken(): Promise<string | null> {
  try {
    const app = initializeClientApp();
    const messaging = getMessaging(app);

    if (typeof window === "undefined" || !("Notification" in window)) {
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("[FCM] Notification permission not granted.");
      return null;
    }

    const serviceWorkerRegistration = await getServiceWorkerRegistration();
    if (!serviceWorkerRegistration) {
      console.warn("[FCM] Service Worker registration not available. Skipping FCM token creation.");
      return null;
    }

    console.log("Using VAPID key:", VAPID_KEY);
    const currentToken = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration,
    }).catch((err) => {
      console.warn("[FCM] Push Service Error or getToken failure:", err?.message || err);
      return null;
    });

    if (currentToken) {
      console.log("[FCM] Token retrieved successfully.");
      return currentToken;
    } else {
      console.log("[FCM] No registration token returned by push service.");
      return null;
    }
  } catch (err: any) {
    console.warn("[FCM] Notification setup skipped due to browser restriction/error:", err?.message || err);
    return null;
  }
}

export function subscribeForegroundMessages(cb?: (payload: any) => void) {
  const app = initializeClientApp();
  const messaging = getMessaging(app);

  return onMessage(messaging, (payload) => {
    // Show a native OS notification when the app is in the foreground
    const title = payload.notification?.title ?? "s3cNS"
    const body = payload.notification?.body ?? ""
    const url = payload.data?.url as string | undefined

    if (Notification.permission === "granted") {
      // Trigger vibration for "buzz" feel in foreground
      if ("vibrate" in navigator) {
        navigator.vibrate([200, 100, 200]);
      }

      const n = new Notification(title, {
        body,
        icon: "/logo/s3cnsLogo.svg",
        badge: "/logo/s3cnsLogo.svg",
        tag: "s3cns-push",
        renotify: true,
        vibrate: [200, 100, 200],
      } as any)
      if (url) {
        n.onclick = () => {
          window.focus()
          window.location.href = url
        }
      }
    }

    // Call the optional extra handler (e.g. refresh bell count)
    cb?.(payload)
  })
}