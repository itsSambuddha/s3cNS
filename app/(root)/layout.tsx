// app/(root)/layout.tsx
import type { ReactNode } from 'react'
import Navbar from '@/components/layout/Navbar'

export default function RootPublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
