// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 's3cNS · SECMUN Platform',
  description: 'Mobile‑friendly SECMUN club management platform.',
  manifest: '/manifest.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased"
            style={{ fontFamily: '"Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        {children}
        <Footer />
      </body>
    </html>
  )
}
