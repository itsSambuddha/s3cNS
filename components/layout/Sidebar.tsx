'use client'

// components/layout/Sidebar.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth' // Import useAuth
import type { IUser } from '@/lib/db/models/User'

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


export default function Sidebar() {
  const pathname = usePathname();
  const { user, loading } = useAuth(); // Use the useAuth hook

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
    <aside className="hidden w-60 shrink-0 border-r bg-card/60 pt-16 sm:block">
      <nav className="space-y-1 px-3 pb-4 pt-4 text-sm">
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Navigation
        </p>
        {allLinks.map((link) => { // Map through allLinks
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
