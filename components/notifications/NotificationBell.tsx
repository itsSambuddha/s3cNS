"use client"

import { useEffect, useState } from "react"
import { 
  Bell, 
  Trash2, 
  X, 
  CreditCard, 
  CheckCircle, 
  Calendar, 
  ClipboardList, 
  ShieldAlert, 
  Megaphone,
  BellOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppUser } from "@/hooks/useAppUser"
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

const CATEGORY_ICONS: Record<string, any> = {
  BUDGET: CreditCard,
  APPROVAL: CheckCircle,
  EVENT: Calendar,
  TASK: ClipboardList,
  SECURITY: ShieldAlert,
  ANNOUNCEMENT: Megaphone,
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<NotificationItem[]>([])
  const { user: appUser, loading } = useAppUser()
  const unreadCount = items.filter((n) => !n.readAt).length

  async function load() {
    const res = await fetch("/api/notifications/list")
    if (!res.ok) return
    const json = await res.json()
    setItems(json.notifications || [])
  }

  useEffect(() => {
    if (!loading && appUser) {
      load()
    }
  }, [loading, appUser])

  async function markRead(id: string, url?: string) {
    const item = items.find(i => i.id === id)
    if (item?.readAt) {
      if (url) window.location.href = url
      return
    }

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

  async function deleteOne(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    setItems((prev) => prev.filter((n) => n.id !== id))
    await fetch("/api/notifications/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
  }

  async function clearAll() {
    setItems([])
    await fetch("/api/notifications/clear-all", {
      method: "POST",
    })
  }

  // Only show top 10
  const displayedItems = items.slice(0, 10)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground shadow-sm">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col border-l bg-background/95 p-0 backdrop-blur-sm sm:max-w-md">
        <SheetHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold tracking-tight">Notifications</SheetTitle>
            {items.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAll}
                className="h-8 text-xs font-medium text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Clear All
              </Button>
            )}
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto px-6">
          <div className="py-6 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <BellOff className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">No notifications</p>
                <p className="text-xs text-muted-foreground">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {displayedItems.map((n) => {
                  const Icon = CATEGORY_ICONS[n.category] || Megaphone
                  return (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id, n.url)}
                      className={`group relative flex w-full cursor-pointer items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200 hover:shadow-md ${
                        !n.readAt 
                          ? "border-primary/20 bg-primary/5 shadow-sm" 
                          : "border-border bg-card hover:bg-accent/50"
                      }`}
                    >
                      <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        !n.readAt ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-sm font-semibold leading-none ${!n.readAt ? "text-foreground" : "text-muted-foreground"}`}>
                            {n.title}
                          </span>
                          <span className="text-[10px] whitespace-nowrap text-muted-foreground font-medium">
                            {new Date(n.createdAt).toLocaleDateString(undefined, { 
                              month: 'short', 
                              day: 'numeric', 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed line-clamp-2 ${!n.readAt ? "text-foreground/80" : "text-muted-foreground/80"}`}>
                          {n.body}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 px-1.5 py-0.5 rounded bg-muted/50 border border-border/50">
                            {n.category}
                          </span>
                          {!n.readAt && (
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => deleteOne(e, n.id)}
                        className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground/0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:text-muted-foreground"
                        aria-label="Delete notification"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )
                })}
                {items.length > 10 && (
                  <p className="text-center text-[10px] text-muted-foreground pt-2">
                    Showing top 10 of {items.length} notifications
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
