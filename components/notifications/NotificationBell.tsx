"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type NotificationItem = {
  id: string
  category: string
  title: string
  body: string
  url?: string
  createdAt: string
  readAt?: string | null
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<NotificationItem[]>([])
  const unreadCount = items.filter((n) => !n.readAt).length

  async function load() {
    const res = await fetch("/api/notifications/list")
    if (!res.ok) return
    const json = await res.json()
    setItems(json.notifications || [])
  }

  useEffect(() => {
    load()
  }, [])

  async function markRead(id: string, url?: string) {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)),
    )
    await fetch("/api/notifications/mark-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })

    if (url) {
      window.location.href = url
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 sm:w-96">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-2 overflow-y-auto">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground">No notifications yet.</p>
          )}
          {items.map((n) => (
            <button
              key={n.id}
              onClick={() => markRead(n.id, n.url)}
              className={`w-full rounded-md border px-3 py-2 text-left text-sm transition hover:bg-muted ${
                !n.readAt ? "border-primary/40 bg-primary/5" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{n.title}</span>
                <span className="text-[10px] uppercase text-muted-foreground">
                  {n.category.toLowerCase()}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {n.body}
              </p>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
