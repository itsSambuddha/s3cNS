'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavItems } from '@/components/ui/resizable-navbar'

interface ResizableNavbarItem {
  id: string;
  label: string;
  href: string;
}

const navItems: ResizableNavbarItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'secretariat', label: 'Secretariat', href: '/secretariat' },
  { id: 'events', label: 'Events', href: '/events' },
  { id: 'resources', label: 'Resources', href: '/resources' },
]

export function LandingNavbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="rounded-full bg-sky-600 px-2 py-1 text-xs font-semibold text-white">
            SECMUN
          </span>
          <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
            Secretariat Platform
          </span>
        </Link>

        {/* Resizable navbar from Aceternity */}
        <div className="hidden sm:block">
          <NavItems
            items={navItems.map(item => ({ name: item.label, link: item.href }))}
          />
        </div>

        {/* Right side auth buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-accent sm:inline-block"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-sky-600 px-3 py-1 text-xs font-medium text-white hover:bg-sky-700"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  )
}
