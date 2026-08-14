"use client"

import React from "react"
import { useFCM } from "@/hooks/useFCM"

export function Providers({ children }: { children: React.ReactNode }) {
  useFCM();

  return <>{children}</>
}

