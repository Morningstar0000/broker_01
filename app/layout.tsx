import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/providers/AuthProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ForexPro - Professional Forex Trading Platform",
  description:
    "Trade forex like a pro with advanced tools, real-time data, and institutional-grade execution. Join thousands of successful traders on ForexPro.",
  keywords: "forex, trading, currency, investment, financial markets, FX",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
