'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePremium } from '@/lib/premium-context'
import BallFlightVisualizer from '@/components/flight-testing-viz'

export default function FlightTestingPage() {
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

  return <BallFlightVisualizer />
}
