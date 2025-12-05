'use client'

// components/layout/Sidebar.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/timetable', label: 'Timetable' },
  { href: '/attendance', label: 'Attendance' },
  { href: '/budget', label: 'Budget' },
  { href: '/documents', label: 'Documents' },
  { href: '/news', label: 'News' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/directory', label: 'Directory' },
  { href: '/admin', label: 'Admin' },
  { href: '/admin/attendance', label: 'Attendance Alerts' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-60 shrink-0 border-r bg-card/60 pt-16 sm:block">
      <nav className="space-y-1 px-3 pb-4 pt-4 text-sm">
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Navigation
        </p>
        {links.map((link) => {
          const active = pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                active
                  ? 'block rounded-md bg-primary/10 px-2 py-1.5 font-medium text-primary'
                  : 'block rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground'
              }
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
