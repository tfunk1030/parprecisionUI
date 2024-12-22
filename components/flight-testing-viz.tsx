'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Slider } from './ui/slider'
import { FlightViz } from './flight-3d-viz'
import { clubData } from '@/lib/club-data'

interface FlightParams {
  speed: number
  launchAngle: number
  spin: number
}

interface FlightStats {
  height: number
  distance: number
  time: number
}

const PADDING = 40

export default function BallFlightVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedClub, setSelectedClub] = useState(clubData[0])
  const [view3D, setView3D] = useState(false)
  const [params, setParams] = useState<FlightParams>({
    launchAngle: 10.4,
    speed: 171,
    spin: 2545
  })
  const [flightStats, setFlightStats] = useState<FlightStats>({
    height: 0,
    distance: 0,
    time: 0
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up coordinate system
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 1
    
    // X axis
    ctx.moveTo(PADDING, canvas.height - PADDING)
    ctx.lineTo(canvas.width - PADDING, canvas.height - PADDING)
    
    // Y axis
    ctx.moveTo(PADDING, canvas.height - PADDING)
    ctx.lineTo(PADDING, PADDING)
    ctx.stroke()

    // Calculate total distance based on driver standard
    // Driver: 171mph, 10.4°, 2545rpm = 282 yards
    const distance = params.speed * (282/171)

    // Calculate max height based on driver standard
    // Convert feet to yards (divide by 3)
    const heightInYards = Math.max(10, Math.min(47, (params.launchAngle / 10.4 * 105 / 3)))  // 30-140 feet = 10-47 yards

    // Calculate grid dimensions based on shot
    const gridMaxDistance = Math.ceil(distance / 25) * 25 // Round up to nearest 25
    const gridMaxHeight = Math.ceil((heightInYards + 3) / 5) * 5 // Round up to nearest 5, smaller buffer
    
    // Scale factors for canvas
    const yardToPixelX = (canvas.width - PADDING * 2) / gridMaxDistance
    const yardToPixelY = (canvas.height - PADDING * 2) / gridMaxHeight

    // Generate trajectory points
    const points: [number, number][] = []
    const numPoints = 100

    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints
      
      // X position is linear
      const x = distance * t
      
      // Y position uses a more gradual curve
      const flippedT = 1 - t
      
      // Even more gradual curve shape
      const baseCurve = (Math.sin(Math.PI * flippedT) * Math.pow(1 - flippedT, 0.5)) / 0.85
      
      // Adjust early trajectory based on launch angle
      let y = heightInYards * baseCurve
      if (t < 0.3) {
        const launchEffect = (params.launchAngle - 10.4) / 30
        const earlyAdjust = (0.3 - t) / 0.3
        y *= (1 + launchEffect * earlyAdjust * 0.2)
      }

      points.push([x, Math.max(0, y)])
    }

    // Draw trajectory
    ctx.beginPath()
    ctx.strokeStyle = '#10B981'
    ctx.lineWidth = 2

    points.forEach(([x, y], i) => {
      const pixelX = PADDING + x * yardToPixelX
      const pixelY = canvas.height - PADDING - y * yardToPixelY
      
      if (i === 0) {
        ctx.moveTo(pixelX, pixelY)
      } else {
        ctx.lineTo(pixelX, pixelY)
      }
    })
    
    ctx.stroke()

    // Draw landing point
    const finalX = PADDING + (distance * yardToPixelX)
    const finalY = canvas.height - PADDING

    ctx.beginPath()
    ctx.arc(finalX, finalY, 5, 0, 2 * Math.PI)
    ctx.fillStyle = '#10B981'
    ctx.fill()

    // Draw grid lines and labels
    ctx.font = '12px Arial'
    ctx.fillStyle = '#666'
    ctx.textAlign = 'right'
    
    // Y axis grid (height in yards)
    for (let h = 0; h <= gridMaxHeight; h += 5) {
      const y = canvas.height - PADDING - (h * yardToPixelY)
      ctx.beginPath()
      ctx.strokeStyle = '#333'
      ctx.setLineDash([2, 4])
      ctx.moveTo(PADDING, y)
      ctx.lineTo(canvas.width - PADDING, y)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.fillText(`${h}y`, PADDING - 5, y + 4)
    }
    
    // X axis grid (distance in yards)
    for (let d = 0; d <= gridMaxDistance; d += 25) {
      const x = PADDING + (d * yardToPixelX)
      ctx.beginPath()
      ctx.strokeStyle = '#333'
      ctx.setLineDash([2, 4])
      ctx.moveTo(x, PADDING)
      ctx.lineTo(x, canvas.height - PADDING)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.textAlign = 'center'
      ctx.fillText(`${d}`, x, canvas.height - PADDING + 15)
    }

    // Update flight stats with actual values in feet
    setFlightStats({
      height: Math.round(heightInYards * 3),  // Convert back to feet for display
      distance: Math.round(distance),
      time: Math.round((distance / params.speed) * 10) / 10
    })
  }, [params])

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Header with View Toggle */}
      <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-white">Flight Testing</h2>
        <button
          onClick={() => {
            setView3D(!view3D)
            if ('vibrate' in navigator) {
              navigator.vibrate(50)
            }
          }}
          className="px-2 py-1 text-xs bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          {view3D ? '2D View' : '3D View'}
        </button>
        <select 
          className="text-xs w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={selectedClub.name}
          onChange={(e) => setSelectedClub(clubData.find(c => c.name === e.target.value) || clubData[0])}
        >
          {clubData.map(club => (
            <option key={club.name} value={club.name}>
              {club.name} ({club.carry} yards)
            </option>
          ))}
        </select>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-2 space-y-2">
        {/* Visualization */}
        <div className="relative bg-gray-800 rounded-xl overflow-hidden w-full shadow-lg" style={{ height: '300px' }}>
          {view3D ? (
            <FlightViz
              distance={flightStats.distance}
              height={flightStats.height}
              launchAngle={params.launchAngle}
            />
          ) : (
            <canvas 
              ref={canvasRef} 
              width={1200} 
              height={300}
              className="w-full h-full object-contain"
            ></canvas>
          )}
        </div>

        {/* Flight Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-800 rounded-lg p-2 shadow-lg">
            <div className="text-[10px] uppercase tracking-wider text-gray-400">Height</div>
            <div className="text-sm font-bold text-emerald-400">
              {flightStats.height}<span className="text-xs ml-1">ft</span>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-2 shadow-lg">
            <div className="text-[10px] uppercase tracking-wider text-gray-400">Distance</div>
            <div className="text-sm font-bold text-emerald-400">
              {flightStats.distance}<span className="text-xs ml-1">yds</span>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-2 shadow-lg">
            <div className="text-[10px] uppercase tracking-wider text-gray-400">Time</div>
            <div className="text-sm font-bold text-emerald-400">
              {flightStats.time}<span className="text-xs ml-1">sec</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-lg p-3 space-y-3 shadow-lg">
          {/* Launch Angle */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-wider text-gray-400">
                Launch Angle
              </div>
              <div className="text-xs font-semibold text-emerald-400">
                {params.launchAngle}°
              </div>
            </div>
            <div className="px-1">
              <Slider
                min={0}
                max={45}
                step={0.5}
                value={[params.launchAngle]}
                onValueChange={([value]) => setParams(prev => ({ ...prev, launchAngle: value }))}
                className="touch-none"
              />
            </div>
          </div>

          {/* Ball Speed */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-wider text-gray-400">
                Ball Speed
              </div>
              <div className="text-xs font-semibold text-emerald-400">
                {params.speed}<span className="text-xs ml-1">mph</span>
              </div>
            </div>
            <div className="px-1">
              <Slider
                min={100}
                max={200}
                step={1}
                value={[params.speed]}
                onValueChange={([value]) => setParams(prev => ({ ...prev, speed: value }))}
                className="touch-none"
              />
            </div>
          </div>

          {/* Spin Rate */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-wider text-gray-400">
                Spin Rate
              </div>
              <div className="text-xs font-semibold text-emerald-400">
                {params.spin}<span className="text-xs ml-1">rpm</span>
              </div>
            </div>
            <div className="px-1">
              <Slider
                min={2000}
                max={10000}
                step={100}
                value={[params.spin]}
                onValueChange={([value]) => setParams(prev => ({ ...prev, spin: value }))}
                className="touch-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
