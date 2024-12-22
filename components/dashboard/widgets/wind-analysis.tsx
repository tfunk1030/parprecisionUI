'use client'

import React, { useEffect, useRef } from 'react'
import { ArrowUp, Wind, Compass } from 'lucide-react'
import { useEnvironmental } from '@/lib/hooks/use-environmental'
import { useSettings } from '@/lib/settings-context'

interface WindData {
  speed: number // in m/s
  direction: number // in degrees
  gusts: number // in m/s
  altitude: number // in meters
  temperature: number // in celsius
  pressure: number // in hPa
}

export function WindAnalysisWidget() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { conditions } = useEnvironmental()
  const { settings, formatAltitude } = useSettings()
  
  if (!conditions) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Wind Analysis</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Multi-level wind conditions
            </p>
          </div>
          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
            <Wind className="w-6 h-6 text-blue-500" />
          </div>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-400">Loading wind data...</div>
        </div>
      </div>
    )
  }

  const [windData, setWindData] = React.useState<WindData[]>([
    { speed: 5, direction: 45, gusts: 7, altitude: 0, temperature: conditions.temperature, pressure: conditions.pressure },
    { speed: 7, direction: 50, gusts: 9, altitude: 50, temperature: conditions.temperature - 0.5, pressure: conditions.pressure - 5 },
    { speed: 8, direction: 55, gusts: 11, altitude: 100, temperature: conditions.temperature - 1, pressure: conditions.pressure - 10 },
  ])

  // Convert m/s to mph
  const msToMph = (ms: number) => Math.round(ms * 2.237)

  // Draw wind direction visualization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw compass rose
    const centerX = canvas.width / (2 * window.devicePixelRatio)
    const centerY = canvas.height / (2 * window.devicePixelRatio)
    const radius = Math.min(centerX, centerY) - 10

    // Draw compass circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.strokeStyle = '#4B5563'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw cardinal directions
    const directions = ['N', 'E', 'S', 'W']
    const angles = [0, Math.PI / 2, Math.PI, Math.PI * 3 / 2]
    ctx.font = '14px system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#9CA3AF'

    directions.forEach((dir, i) => {
      const x = centerX + Math.sin(angles[i]) * (radius + 20)
      const y = centerY - Math.cos(angles[i]) * (radius + 20)
      ctx.fillText(dir, x, y)
    })

    // Draw wind arrows for each altitude
    windData.forEach((data, index) => {
      const angle = (data.direction - 90) * Math.PI / 180
      const intensity = data.speed / 10 // Scale factor for arrow length

      // Draw arrow
      ctx.beginPath()
      ctx.moveTo(
        centerX - Math.cos(angle) * radius * 0.5,
        centerY - Math.sin(angle) * radius * 0.5
      )
      ctx.lineTo(
        centerX + Math.cos(angle) * radius * 0.5 * intensity,
        centerY + Math.sin(angle) * radius * 0.5 * intensity
      )

      // Arrow color based on altitude
      const alpha = 0.3 + (index / windData.length) * 0.7
      ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`
      ctx.lineWidth = 3
      ctx.stroke()

      // Draw arrowhead
      const headLen = 10
      const arrowAngle = Math.PI / 6
      ctx.beginPath()
      ctx.moveTo(
        centerX + Math.cos(angle) * radius * 0.5 * intensity,
        centerY + Math.sin(angle) * radius * 0.5 * intensity
      )
      ctx.lineTo(
        centerX + Math.cos(angle - Math.PI + arrowAngle) * headLen,
        centerY + Math.sin(angle - Math.PI + arrowAngle) * headLen
      )
      ctx.lineTo(
        centerX + Math.cos(angle - Math.PI - arrowAngle) * headLen,
        centerY + Math.sin(angle - Math.PI - arrowAngle) * headLen
      )
      ctx.closePath()
      ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`
      ctx.fill()
    })
  }, [windData])

  // Update wind data based on environmental conditions
  useEffect(() => {
    // Simulate wind changes with altitude
    const newWindData = windData.map((data, index) => ({
      ...data,
      temperature: conditions.temperature - (index * 0.5),
      pressure: conditions.pressure - (index * 5),
      speed: conditions.windSpeed * (1 + index * 0.2),
      gusts: conditions.windSpeed * (1.3 + index * 0.2),
      direction: (conditions.windDirection + index * 5) % 360,
    }))
    setWindData(newWindData)
  }, [conditions])

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Wind Analysis</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Multi-level wind conditions
          </p>
        </div>
        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
          <Wind className="w-6 h-6 text-blue-500" />
        </div>
      </div>

      {/* Wind Direction Visualization */}
      <div className="aspect-square w-full max-w-[200px] mx-auto mb-6">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {windData.map((data, index) => (
          <div
            key={index}
            className="bg-gray-800/50 p-4 rounded-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">
                {formatAltitude(data.altitude)}
              </span>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">{data.direction}°</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-400">Wind Speed</span>
                <p className="font-semibold">{msToMph(data.speed)} mph</p>
              </div>
              <div>
                <span className="text-sm text-gray-400">Gusts</span>
                <p className="font-semibold">{msToMph(data.gusts)} mph</p>
              </div>
              <div>
                <span className="text-sm text-gray-400">Temperature</span>
                <p className="font-semibold">{Math.round(data.temperature * 10) / 10}°C</p>
              </div>
              <div>
                <span className="text-sm text-gray-400">Pressure</span>
                <p className="font-semibold">{Math.round(data.pressure)} hPa</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
