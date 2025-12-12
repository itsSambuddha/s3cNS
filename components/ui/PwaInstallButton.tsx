"use client"

import { useState, useEffect } from "react"
import { Button } from "./button"

export const PwaInstallButton = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null)

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: any) => {
      event.preventDefault()
      setInstallPrompt(event)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      )
    }
  }, [])

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt()
      installPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt")
        } else {
          console.log("User dismissed the install prompt")
        }
        setInstallPrompt(null)
      })
    }
  }

  if (!installPrompt) {
    return null
  }

  return (
    <Button onClick={handleInstallClick}>
      Install App
    </Button>
  )
}
