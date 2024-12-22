'use client'

import { DashboardGrid } from '@/components/dashboard/dashboard-grid'
import { WidgetManager } from '@/components/dashboard/widget-manager'
import { usePremium } from '@/lib/premium-context'
import { DashboardProvider } from '@/lib/dashboard-context'
import { WidgetConfigProvider } from '@/lib/widget-config-context'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { isPremium } = usePremium()
  const router = useRouter()

  useEffect(() => {
    if (!isPremium) {
      router.push('/')
    }
  }, [isPremium, router])

  if (!isPremium) {
    return null
  }

  return (
    <WidgetConfigProvider>
      <DashboardProvider>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          <DashboardGrid />
          <WidgetManager />
        </div>
      </DashboardProvider>
    </WidgetConfigProvider>
  )
}
