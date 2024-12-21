'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Slider } from './ui/slider'
import Flight3DVisualization from './flight-3d-viz'

export default function BallFlightVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [params, setParams] = useState({
    launchAngle: 15,
    speed: 150,
    spin: 2500
  })

  const [flightStats, setFlightStats] = useState({
    height: 0,
    distance: 0,
    time: 0
  })

  const [view3D, setView3D] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#1F2937' // bg-gray-800
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = '#374151' // bg-gray-700
    ctx.lineWidth = 1
    
    // Vertical lines every 50 yards
    for (let x = 50; x < 300; x += 50) {
      const pixelX = (x / 300) * canvas.width
      ctx.beginPath()
      ctx.moveTo(pixelX, 0)
      ctx.lineTo(pixelX, canvas.height)
      ctx.stroke()
      
      // Yard markers
      ctx.fillStyle = '#9CA3AF' // text-gray-400
      ctx.font = '12px sans-serif'
      ctx.fillText(`${x}y`, pixelX - 10, canvas.height - 10)
    }

    // Calculate flight path
    const PADDING = 40
    const originX = PADDING
    const originY = canvas.height - PADDING

    // Scale factors
    const yardToPixelX = (canvas.width - PADDING * 2) / 300 // 300 yards max
    const yardToPixelY = (canvas.height - PADDING * 2) / 200 // 200 feet max

    // Calculate distance based on launch conditions
    const distance = params.speed * Math.cos(params.launchAngle * Math.PI / 180) * 1.7
    const maxHeight = params.speed * Math.sin(params.launchAngle * Math.PI / 180) * 1.2
    const flightTime = (2 * maxHeight) / (32.2 * Math.sin(params.launchAngle * Math.PI / 180))

    // Draw trajectory
    ctx.beginPath()
    ctx.strokeStyle = '#10B981' // text-emerald-500
    ctx.lineWidth = 2

    const numPoints = 100
    let lastX = originX
    let lastY = originY
    let maxHeightPoint = 0

    // Calculate initial velocity based on speed
    const initialVelocity = params.speed / 150 // Normalized velocity
    
    // Calculate spin effect
    const spinEffect = params.spin / 2500 // Normalized spin

    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints
      
      // Parabolic height curve
      const heightT = 4 * t * (1 - t) // Parabolic curve peaking at t=0.5
      const heightOffset = maxHeight * heightT * yardToPixelY
      
      // Calculate velocity decay
      const velocityDecay = Math.pow(1 - t, 0.7)
      const currentVelocity = initialVelocity * velocityDecay
      
      // Calculate lateral movement based on spin
      const lateralFactor = Math.pow(1 - currentVelocity, 2)
      const distanceFactor = Math.pow(t, 3)
      const lateralOffset = spinEffect * 30 // 30 yards max lateral movement
      const lateralT = lateralFactor * distanceFactor
      
      // Calculate positions
      const x = originX + (distance * t * yardToPixelX)
      const y = originY - (distance * t * Math.tan(params.launchAngle * Math.PI / 180) * yardToPixelY) + heightOffset
      const adjustedX = x + (lateralOffset * lateralT * yardToPixelX)

      ctx.lineTo(adjustedX, y)
      lastX = adjustedX
      lastY = y
      
      // Track max height
      if (heightOffset > maxHeightPoint) {
        maxHeightPoint = heightOffset
      }
    }
    
    ctx.stroke()

    // Draw landing point
    ctx.beginPath()
    ctx.arc(lastX, lastY, 5, 0, 2 * Math.PI)
    ctx.fillStyle = '#10B981'
    ctx.fill()

    // Update flight stats
    setFlightStats({
      height: Math.round(maxHeight),
      distance: Math.round(distance),
      time: Math.round(flightTime * 10) / 10
    })

  }, [params])

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Header with View Toggle */}
      <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-base font-semibold text-white">Flight Testing</h2>
        <button
          onClick={() => {
            setView3D(!view3D)
            // Haptic feedback on view switch
            if ('vibrate' in navigator) {
              navigator.vibrate(50)
            }
          }}
          className="px-3 py-1 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          {view3D ? '2D View' : '3D View'}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-3 space-y-3">
        {/* Visualization */}
        <div className="relative bg-gray-800 rounded-xl overflow-hidden aspect-[3/4] w-full shadow-lg">
          {view3D ? (
            <Flight3DVisualization
              distance={flightStats.distance}
              height={flightStats.height}
              spin={params.spin}
              launchAngle={params.launchAngle}
            />
          ) : (
            <canvas
              ref={canvasRef}
              width={600}
              height={800}
              className="w-full h-full"
            />
          )}
        </div>

        {/* Flight Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-800 rounded-xl p-3 shadow-lg">
            <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Height</div>
            <div className="text-lg font-bold text-emerald-400">
              {flightStats.height}<span className="text-xs ml-1">ft</span>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-3 shadow-lg">
            <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Distance</div>
            <div className="text-lg font-bold text-emerald-400">
              {flightStats.distance}<span className="text-xs ml-1">yds</span>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-3 shadow-lg">
            <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Time</div>
            <div className="text-lg font-bold text-emerald-400">
              {flightStats.time}<span className="text-xs ml-1">sec</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-xl p-4 space-y-5 shadow-lg">
          {/* Launch Angle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] uppercase tracking-wider text-gray-400">
                Launch Angle
              </div>
              <div className="text-sm font-semibold text-emerald-400">
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
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] uppercase tracking-wider text-gray-400">
                Ball Speed
              </div>
              <div className="text-sm font-semibold text-emerald-400">
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
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] uppercase tracking-wider text-gray-400">
                Spin Rate
              </div>
              <div className="text-sm font-semibold text-emerald-400">
                {params.spin}<span className="text-xs ml-1">rpm</span>
              </div>
            </div>
            <div className="px-1">
              <Slider
                min={0}
                max={5000}
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
