import type { Metadata, Viewport } from "next"
import { Cabin } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/Providers"
import { Footer } from "@/components/layout/Footer"

const cabin = Cabin({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "s3cNS- The SECMUN Platform",
  description: "Internal SECMUN platform",
}

export const viewport: Viewport = {
  themeColor: "#002f7a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className={cabin.className}>
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  )
}
