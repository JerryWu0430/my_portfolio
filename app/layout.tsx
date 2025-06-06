import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: "Jerry Wu",
  description: "Jerry Wu's Portfolio",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className="font-inter" suppressHydrationWarning>
        {children}
        <SpeedInsights />
        <Analytics />
      </body> 
    </html>
  )
}

// Add configuration to prevent scroll restoration
export const dynamic = 'force-dynamic'
export const revalidate = 0

// This ensures the page always starts at the top
export const viewport = {
  scrollRestoration: 'manual'
}
