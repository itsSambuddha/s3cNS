// lib/firebase/messaging.ts
"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC2FVThtugQFaXunbbt1X6ht4wkKAD1Tr4",
  authDomain: "s3cns-f159a.firebaseapp.com",
  projectId: "s3cns-f159a",
  storageBucket: "s3cns-f159a.appspot.com",
  messagingSenderId: "438835392978",
  appId: "1:438835392978:web:cc1d801ebaeac8e180b",
};

const VAPID_KEY = "BBcE0jlezPZk2sq2bqYli1KuNAWK7jCSvF2PdWXSrJ5Jk3qWj2usTlohsWosdJZKr1Qde3HNdiJTIGGWuBd1gY8";

// Initialize Firebase app on the client
function initializeClientApp() {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  } else {
    return getApp();
  }
}

async function getServiceWorkerRegistration() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        { scope: "/firebase-cloud-messaging-push-scope" }
      );
      return registration;
    } catch (error) {
      console.error("Service Worker registration failed: ", error);
      // Fallback: Try to get existing registration without scope
      return navigator.serviceWorker.ready;
    }
  }
  throw new Error("Service workers are not supported in this browser.");
}


export async function requestNotificationToken(): Promise<string | null> {
  const app = initializeClientApp();
  const messaging = getMessaging(app);

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission not granted.");
      return null;
    }

    const serviceWorkerRegistration = await getServiceWorkerRegistration();
    
    console.log("Using VAPID key:", VAPID_KEY);
    const currentToken = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration,
    });

    if (currentToken) {
      return currentToken;
    } else {
      console.log("No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (err) {
    console.error("An error occurred while retrieving token. ", err);
    return null;
  }
}

export function subscribeForegroundMessages(cb: (payload: any) => void) {
  const app = initializeClientApp();
  const messaging = getMessaging(app);
  return onMessage(messaging, cb);
}