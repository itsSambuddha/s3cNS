"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAppUser } from "@/hooks/useAppUser";
import { requestNotificationToken, subscribeForegroundMessages } from "@/lib/firebase/messaging";

export function useFCM() {
  const { user: appUser, loading } = useAppUser();
  const registrationAttempted = useRef(false);

  useEffect(() => {
    if (loading || !appUser || registrationAttempted.current) return;

    const setupFCM = async () => {
      try {
        console.log("[useFCM] Requesting notification permission...");
        const token = await requestNotificationToken();
        
        if (token) {
          console.log("[useFCM] Token retrieved:", token.substring(0, 10) + "...");
          
          // Register token with backend
          const res = await fetch("/api/notifications/register-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token,
              userId: appUser._id,
              platform: "web",
            }),
          });
          
          if (res.ok) {
            console.log("[useFCM] Device registered successfully.");
            registrationAttempted.current = true;
          } else {
            console.error("[useFCM] Failed to register device:", await res.text());
          }
        }
      } catch (err) {
        console.error("[useFCM] Setup error:", err);
      }
    };

    setupFCM();
    
    // Subscribe to foreground messages
    const unsubscribe = subscribeForegroundMessages((payload) => {
      console.log("[useFCM] Foreground message received:", payload);
      // Native notification is handled inside subscribeForegroundMessages,
      // but you could add extra logic here (e.g. state update, sound)
    });

    return () => unsubscribe();
  }, [appUser, loading]);
}
