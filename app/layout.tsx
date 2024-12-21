'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LastShot Windsurf',
  description: 'Advanced golf shot analysis and visualization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
        <div className="flex flex-col min-h-screen">
          {/* Fixed Header */}
          <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 border-b border-gray-700">
            <div className="px-4 py-3">
              <h1 className="text-base font-semibold">LastShot Windsurf</h1>
            </div>
          </header>

          {/* Main Content with padding for header and nav */}
          <main className="flex-1 pt-[52px] pb-[72px]">
            {children}
          </main>

          {/* Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-800 border-t border-gray-700">
            <div className="grid grid-cols-4 gap-1 px-2 py-2">
              <NavButton href="/" label="Home" icon="🏠" />
              <NavButton href="/shot-visualization" label="Shot" icon="🎯" />
              <NavButton href="/flight-testing" label="Test" icon="✈️" />
              <NavButton href="/settings" label="Settings" icon="⚙️" />
            </div>
          </nav>

          {/* iOS Safe Area */}
          <div className="h-[env(safe-area-inset-bottom)] bg-gray-800" />
        </div>
      </body>
    </html>
  )
}

function NavButton({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <a 
      href={href}
      className="flex flex-col items-center justify-center py-1 px-2 rounded-lg hover:bg-gray-700 active:bg-gray-600 transition-colors"
    >
      <span className="text-xl mb-0.5">{icon}</span>
      <span className="text-[10px] uppercase tracking-wide">{label}</span>
    </a>
  )
}
