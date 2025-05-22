import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { InteractiveBackground } from "@/components/InteractiveBackground"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jerry Wu | Portfolio",
  description: "Personal portfolio website of Jerry Wu",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <InteractiveBackground />
        {children}
      </body>
    </html>
  )
}
