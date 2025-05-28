import type React from "react"
import "./globals.css"
import type { Metadata } from "next"

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
      <head />
      <body className="font-inter" suppressHydrationWarning>
        {children}
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
