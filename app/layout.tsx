'use client'

import './globals.css'
import Navigation from '@/components/navigation'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <main className="pb-20">
          {children}
        </main>
        <Navigation />
      </body>
    </html>
  )
}
