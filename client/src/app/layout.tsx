import type { Metadata } from "next";
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display:"swap"
})

export const metadata: Metadata = {
  title: { default: "Persona", template: "%s-Persona" },
  description:"AI-powered cold outreach personalization."
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-svh bg-background font-sans text-foreground antialiased">
          {children}
      </body>
    </html>
  )
}