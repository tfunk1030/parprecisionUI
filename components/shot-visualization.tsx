'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Slider } from './ui/slider'
import { api } from '@/services/api'
import { DataAdapter } from '@/services/data-adapter'

interface ShotVisualizationProps {
  initialDistance?: number
  initialWindSpeed?: number
  initialWindDirection?: number
}

const ShotVisualization: React.FC<ShotVisualizationProps> = ({
  initialDistance = 200,
  initialWindSpeed = 10,
  initialWindDirection = 45
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const PADDING = 40 // Padding for axis labels

  const [params, setParams] = useState({
    distance: initialDistance,
    windSpeed: initialWindSpeed,
    windDirection: initialWindDirection
  })

  useEffect(() => {
    const updateShot = async () => {
      try {
        // Get shot data from your research API
        const shotData = await api.getShotData({
          distance: params.distance,
          windSpeed: params.windSpeed,
          windDirection: params.windDirection
        })

        // Convert research data to UI format
        const adaptedData = DataAdapter.adaptShotData(shotData)

        // Update visualization
        drawShot(adaptedData)
      } catch (error) {
        console.error('Error fetching shot data:', error)
      }
    }

    updateShot()
  }, [params])

  const drawShot = (data: any) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set background
    ctx.fillStyle = '#111827'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Calculate scales
    const xRange = 40 // -20 to +20 yards
    const yardToPixelX = (canvas.width - (2 * PADDING)) / xRange
    const yardToPixelY = (canvas.height - (2 * PADDING)) / data.distance

    // Set origin to bottom center of canvas
    const originX = canvas.width / 2
    const originY = canvas.height - PADDING

    // Draw grid and axes
    drawGrid(ctx, canvas.width, canvas.height, data.distance, xRange, yardToPixelX, yardToPixelY, originX, originY)

    // Draw wind indicator
    drawWindIndicator(ctx, data.windSpeed, data.windDirection)

    // Draw shot path with calculated lateral offset
    drawShotPath(ctx, originX, originY, data.distance, data.lateralOffset, yardToPixelX, yardToPixelY)
  }

  const drawGrid = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    distance: number,
    xRange: number,
    yardToPixelX: number,
    yardToPixelY: number,
    originX: number,
    originY: number
  ) => {
    ctx.strokeStyle = '#1F2937'
    ctx.lineWidth = 1
    ctx.fillStyle = '#9CA3AF'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'

    // Draw Y axis
    ctx.beginPath()
    ctx.moveTo(originX, originY)
    ctx.lineTo(originX, PADDING)
    ctx.strokeStyle = '#4B5563'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw X axis
    ctx.beginPath()
    ctx.moveTo(PADDING, originY)
    ctx.lineTo(width - PADDING, originY)
    ctx.stroke()

    // Draw Y axis markers (distance)
    const yInterval = 50
    for (let y = 0; y <= distance; y += yInterval) {
      const yPos = originY - (y * yardToPixelY)
      
      // Draw marker line
      ctx.beginPath()
      ctx.moveTo(originX - 5, yPos)
      ctx.lineTo(originX + 5, yPos)
      ctx.stroke()
      
      // Draw yardage text
      ctx.fillText(`${y}`, originX - 20, yPos + 4)
    }

    // Draw X axis markers (lateral)
    const xInterval = 5
    for (let x = -xRange/2; x <= xRange/2; x += xInterval) {
      const xPos = originX + (x * yardToPixelX)
      
      // Draw marker line
      ctx.beginPath()
      ctx.moveTo(xPos, originY - 5)
      ctx.lineTo(xPos, originY + 5)
      ctx.stroke()
      
      // Draw lateral text
      if (x !== 0) { // Don't draw 0 as it overlaps with Y axis
        ctx.fillText(`${x}`, xPos, originY + 20)
      }
    }

    // Draw grid lines
    ctx.strokeStyle = '#1F2937'
    ctx.lineWidth = 1

    // Vertical grid lines
    for (let x = -xRange/2; x <= xRange/2; x += xInterval) {
      const xPos = originX + (x * yardToPixelX)
      ctx.beginPath()
      ctx.moveTo(xPos, originY)
      ctx.lineTo(xPos, PADDING)
      ctx.stroke()
    }

    // Horizontal grid lines
    for (let y = 0; y <= distance; y += yInterval) {
      const yPos = originY - (y * yardToPixelY)
      ctx.beginPath()
      ctx.moveTo(PADDING, yPos)
      ctx.lineTo(width - PADDING, yPos)
      ctx.stroke()
    }
  }

  const drawWindIndicator = (
    ctx: CanvasRenderingContext2D,
    speed: number,
    direction: number
  ) => {
    const x = 60
    const y = 60
    const radius = 25

    // Draw circle background
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fillStyle = '#1F2937'
    ctx.fill()
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw arrow
    const angleRad = (direction - 90) * Math.PI / 180
    ctx.beginPath()
    ctx.moveTo(
      x - Math.cos(angleRad) * radius * 0.7,
      y - Math.sin(angleRad) * radius * 0.7
    )
    ctx.lineTo(
      x + Math.cos(angleRad) * radius * 0.7,
      y + Math.sin(angleRad) * radius * 0.7
    )
    ctx.strokeStyle = '#10B981'
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw wind speed
    ctx.fillStyle = '#D1D5DB'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`${speed} mph`, x, y + radius + 15)
  }

  const drawShotPath = (
    ctx: CanvasRenderingContext2D,
    originX: number,
    originY: number,
    distance: number,
    lateralOffset: number,
    yardToPixelX: number,
    yardToPixelY: number
  ) => {
    const endX = originX + (lateralOffset * yardToPixelX)
    const endY = originY - (distance * yardToPixelY)
    
    // Calculate control points for late break
    // First control point is almost straight up (minimal lateral movement)
    const cp1x = originX + (lateralOffset * 0.1 * yardToPixelX)
    const cp1y = originY - (distance * 0.7 * yardToPixelY)
    
    // Second control point creates the late break
    const cp2x = originX + (lateralOffset * 0.5 * yardToPixelX)
    const cp2y = originY - (distance * 0.9 * yardToPixelY)

    // Draw shot line
    ctx.beginPath()
    ctx.moveTo(originX, originY)
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY)
    ctx.strokeStyle = '#10B981'
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw starting point
    ctx.beginPath()
    ctx.arc(originX, originY, 4, 0, 2 * Math.PI)
    ctx.fillStyle = '#10B981'
    ctx.fill()

    // Draw ending point
    ctx.beginPath()
    ctx.arc(endX, endY, 4, 0, 2 * Math.PI)
    ctx.fillStyle = '#FFFFFF'
    ctx.strokeStyle = '#10B981'
    ctx.lineWidth = 2
    ctx.fill()
    ctx.stroke()
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
        <h2 className="text-base font-semibold text-white">Shot Visualization</h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-3 space-y-3">
        {/* Canvas */}
        <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-[3/4] w-full shadow-lg">
          <canvas
            ref={canvasRef}
            width={600}
            height={800}
            className="w-full h-full"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800 rounded-xl p-3 shadow-lg">
            <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Carry</div>
            <div className="text-lg font-bold text-emerald-400">
              {Math.round(params.distance)}<span className="text-xs ml-1">yds</span>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-3 shadow-lg">
            <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Offset</div>
            <div className="text-lg font-bold text-emerald-400">
              {params.windDirection > 90 ? 'R' : 'L'} {Math.abs(Math.round(params.windSpeed))}<span className="text-xs ml-1">yds</span>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-gray-800 rounded-xl p-4 space-y-5 shadow-lg">
          {/* Distance Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[10px] uppercase tracking-wider text-gray-400">
                Distance
              </div>
              <div className="text-sm font-semibold text-emerald-400">
                {Math.round(params.distance)}<span className="text-xs ml-1">yds</span>
              </div>
            </div>
            <div className="px-1">
              <Slider
                min={100}
                max={350}
                step={1}
                value={[params.distance]}
                onValueChange={([value]) => setParams(prev => ({ ...prev, distance: value }))}
                className="touch-none"
              />
            </div>
          </div>

          {/* Wind Controls */}
          <div className="space-y-4">
            {/* Wind Speed */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] uppercase tracking-wider text-gray-400">
                  Wind Speed
                </div>
                <div className="text-sm font-semibold text-emerald-400">
                  {params.windSpeed.toFixed(1)}<span className="text-xs ml-1">mph</span>
                </div>
              </div>
              <div className="px-1">
                <Slider
                  min={0}
                  max={30}
                  step={0.5}
                  value={[params.windSpeed]}
                  onValueChange={([value]) => setParams(prev => ({ ...prev, windSpeed: value }))}
                  className="touch-none"
                />
              </div>
            </div>

            {/* Wind Direction */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] uppercase tracking-wider text-gray-400">
                  Wind Direction
                </div>
                <div className="text-sm font-semibold text-emerald-400">
                  {params.windDirection}°
                </div>
              </div>
              <div className="px-1">
                <Slider
                  min={0}
                  max={360}
                  step={5}
                  value={[params.windDirection]}
                  onValueChange={([value]) => setParams(prev => ({ ...prev, windDirection: value }))}
                  className="touch-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShotVisualization
