import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

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
      <body className={inter.className} suppressHydrationWarning>
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
