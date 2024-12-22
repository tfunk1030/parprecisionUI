'use client'

import React from 'react'
import { useEnvironmental } from '@/lib/hooks/use-environmental'
import { useSettings } from '@/lib/settings-context'
import { useState, useEffect } from 'react'
import { DashboardGrid } from '@/components/dashboard/dashboard-grid'

function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°F`
}

function formatWindSpeed(speed: number): string {
  return `${Math.round(speed)} mph`
}

function formatWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(((degrees + 22.5) % 360) / 45)
  return directions[index]
}

export default function Home() {
  const { conditions, adjustments, isLoading } = useEnvironmental()
  const { settings } = useSettings()

  if (isLoading || !conditions) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-800 rounded mb-4"></div>
          <div className="h-8 bg-gray-800 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Temperature Card */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 mb-2">Temperature</h3>
            <div>
              <div className="text-4xl font-bold">
                {formatTemperature(conditions.temperature)}
              </div>
              <div className="text-gray-400 text-sm">
                Feels like {formatTemperature(conditions.temperature + 2)}
              </div>
            </div>
          </div>

          {/* Wind Card */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 mb-2">Wind</h3>
            <div>
              <div className="text-4xl font-bold">
                {formatWindSpeed(conditions.windSpeed)}
              </div>
              <div className="text-gray-400 text-sm">
                From {formatWindDirection(conditions.windDirection)}
              </div>
            </div>
          </div>

          {/* Altitude Card */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 mb-2">Altitude</h3>
            <div>
              <div className="text-4xl font-bold">
                {Math.round(conditions.altitude)} ft
              </div>
              <div className="text-gray-400 text-sm">
                {adjustments && `${adjustments.distanceAdjustment > 0 ? '+' : ''}${Math.round(adjustments.distanceAdjustment)}% Distance`}
              </div>
            </div>
          </div>
        </div>

        <DashboardGrid />
      </div>
    </main>
  )
}
