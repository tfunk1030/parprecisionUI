'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Target } from 'lucide-react'
import { useShots } from '@/lib/hooks/use-shots'

interface Shot {
  distance: number
  accuracy: number // Deviation from target line in yards
  height: number
  spin: number
  date: Date
}

export function ShotDispersionWidget() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { shots } = useShots()
  const [selectedClub, setSelectedClub] = useState('Driver')
  
  // Draw shot dispersion plot
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

    // Set up coordinate system
    const centerX = canvas.width / (2 * window.devicePixelRatio)
    const centerY = canvas.height / (2 * window.devicePixelRatio)
    const scale = 2 // yards per pixel

    // Draw target line
    ctx.beginPath()
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, canvas.height)
    ctx.strokeStyle = '#4B5563'
    ctx.setLineDash([5, 5])
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.setLineDash([])

    // Draw distance markers
    const distances = [50, 100, 150, 200, 250]
    distances.forEach(distance => {
      const y = centerY - (distance / scale)
      if (y > 0) {
        ctx.beginPath()
        ctx.moveTo(centerX - 50, y)
        ctx.lineTo(centerX + 50, y)
        ctx.strokeStyle = '#4B5563'
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.font = '12px system-ui'
        ctx.fillStyle = '#9CA3AF'
        ctx.textAlign = 'right'
        ctx.fillText(`${distance}y`, centerX - 60, y + 4)
      }
    })

    // Draw shots
    shots
      .filter(shot => shot.club === selectedClub)
      .forEach(shot => {
        const x = centerX + (shot.accuracy / scale)
        const y = centerY - (shot.distance / scale)

        // Draw shot marker
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59, 130, 246, 0.5)`
        ctx.fill()
      })

    // Draw dispersion ellipse if we have shots
    const filteredShots = shots.filter(shot => shot.club === selectedClub)
    if (filteredShots.length > 0) {
      const distances = filteredShots.map(s => s.distance)
      const accuracies = filteredShots.map(s => s.accuracy)
      
      const meanDist = distances.reduce((a, b) => a + b) / distances.length
      const meanAcc = accuracies.reduce((a, b) => a + b) / accuracies.length
      
      const stdDist = Math.sqrt(distances.map(x => Math.pow(x - meanDist, 2)).reduce((a, b) => a + b) / distances.length)
      const stdAcc = Math.sqrt(accuracies.map(x => Math.pow(x - meanAcc, 2)).reduce((a, b) => a + b) / accuracies.length)

      // Draw 1 and 2 standard deviation ellipses
      [1, 2].forEach(factor => {
        ctx.beginPath()
        ctx.ellipse(
          centerX + (meanAcc / scale),
          centerY - (meanDist / scale),
          (stdAcc * factor) / scale,
          (stdDist * factor) / scale,
          0,
          0,
          Math.PI * 2
        )
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 / factor})`
        ctx.lineWidth = 1
        ctx.stroke()
      })
    }
  }, [shots, selectedClub])

  // Calculate statistics
  const filteredShots = shots.filter(shot => shot.club === selectedClub)
  const avgDistance = filteredShots.length > 0
    ? Math.round(filteredShots.reduce((acc, shot) => acc + shot.distance, 0) / filteredShots.length)
    : 0
  const avgAccuracy = filteredShots.length > 0
    ? Math.round(Math.abs(filteredShots.reduce((acc, shot) => acc + shot.accuracy, 0)) / filteredShots.length * 10) / 10
    : 0

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Shot Dispersion</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Shot pattern analysis
          </p>
        </div>
        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
          <Target className="w-6 h-6 text-blue-500" />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <select
          value={selectedClub}
          onChange={(e) => setSelectedClub(e.target.value)}
          className="bg-gray-800/50 border border-gray-700 text-sm rounded-lg p-2.5"
        >
          <option value="Driver">Driver</option>
          <option value="3-Wood">3-Wood</option>
          <option value="5-Iron">5-Iron</option>
          <option value="7-Iron">7-Iron</option>
          <option value="PW">PW</option>
        </select>

        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-gray-400">Avg Distance:</span>
            <span className="ml-2 font-medium">{avgDistance}y</span>
          </div>
          <div>
            <span className="text-gray-400">Avg Deviation:</span>
            <span className="ml-2 font-medium">±{avgAccuracy}y</span>
          </div>
        </div>
      </div>

      <div className="aspect-square w-full">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  )
}
