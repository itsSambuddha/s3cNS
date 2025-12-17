// components/layout/MobileNav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from 'firebase/auth'
import { firebaseAuth } from '@/lib/auth/firebase'
import * as Dialog from '@radix-ui/react-dialog'
import type { IUser } from '@/lib/db/models/User'

// Top navbar items
const topLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/gazette', label: 'Gazette' },
  { href: '/secretariat', label: 'Secretariat' },
]

// Sidebar items (from Sidebar.tsx)
const baseLinks = [
  { href: '/dashboard', label: 'Overview', type: 'base' },
  { href: '/timetable', label: 'Timetable', type: 'base' },
  { href: '/budget', label: 'Budget', type: 'base' },
  { href: '/documents', label: 'Documents', type: 'base' },
  { href: '/news', label: 'News', type: 'base' },
  { href: '/achievements', label: 'Achievements', type: 'base' },
  { href: '/directory', label: 'Directory', type: 'base' },
];

const secretariatLinks = [
  { href: '/secretariat/directory', label: 'Secretariat Directory', type: 'secretariat' },
  { href: '/secretariat/usg-approvals', label: 'USG Approvals', type: 'secretariat', requiresApprove: true },
  { href: '/secretariat/onboarding', label: 'Set up profile', type: 'secretariat', requiresDefaultRole: true },
];

const adminLinks = [
  { href: '/admin', label: 'Admin', type: 'admin' },
];

export default function MobileNav() {
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await signOut(firebaseAuth)
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: '' }),
    })
    setOpen(false)
    window.location.href = '/'
  }

  const linkClass = (active: boolean) =>
    active
      ? 'block rounded-md bg-muted px-2 py-1.5 font-medium text-foreground'
      : 'block rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground'

  // Combine links, filtering based on user permissions
  const dbUser = user as IUser | null
  const allLinks = [
    ...baseLinks,
    ...(dbUser?.secretariatRole ? secretariatLinks.filter(link => {
      if (link.requiresApprove && (!dbUser?.canApproveUSG && !['LEADERSHIP', 'TEACHER'].includes(dbUser?.role))) {
        return false;
      }
      if (link.requiresDefaultRole && !dbUser?.displayName) {
        return true; // Show "Set up profile" if profile not set up
      }
      if (link.requiresDefaultRole) { // If it requires default role but conditions above not met, hide it
        return false;
      }
      return true;
    }) : []),
    ...(dbUser?.role === 'ADMIN' ? adminLinks : [])
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation menu"
          className="sm:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 px-4">
        {/* Proper DialogTitle (visually hidden) to satisfy Radix */}
        <Dialog.Title className="sr-only">
          Mobile navigation
        </Dialog.Title>

        <div className="mt-3 flex flex-col gap-5">
          {/* Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
<img src="/logo/s3cnsLogo.svg" alt="s3cNS Logo" className="mt-2 h-10 w-25 rounded-lg"/>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold">s3cNS</span>
                <span className="text-[11px] text-muted-foreground">
                  SECMUN Platform
                </span>
              </div>
            </div>
          </div>

          {/* Top nav */}
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Main
            </p>
            <nav className="space-y-1 text-sm">
              {topLinks.map((link) => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={linkClass(active)}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Sidebar / modules */}
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Navigation
            </p>
            <nav className="space-y-1 text-sm">
              {allLinks.map((item) => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={linkClass(active)}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Auth */}
          {!loading && (
            <div className="pt-1">
              {user ? (
                <Button
                  className="w-full"
                  size="sm"
                  variant="outline"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button className="w-full" size="sm">
                    Sign in
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
