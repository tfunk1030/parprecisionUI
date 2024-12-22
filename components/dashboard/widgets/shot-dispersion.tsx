'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Target } from 'lucide-react'
import { useShots } from '@/lib/hooks/use-shots'
import * as d3 from 'd3'

interface Shot {
  distance: number
  accuracy: number
  club: string
}

export function ShotDispersionWidget() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { shots } = useShots()
  const [selectedClub, setSelectedClub] = useState('Driver')

  // Draw shot dispersion plot
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !shots.length) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up plot dimensions
    const margin = { top: 20, right: 20, bottom: 30, left: 40 }
    const width = canvas.width - margin.left - margin.right
    const height = canvas.height - margin.top - margin.bottom

    // Filter shots for selected club
    const filteredShots = shots.filter(s => s.club === selectedClub)
    if (!filteredShots.length) return

    // Extract distances and accuracies
    const distances = filteredShots.map(s => s.distance)
    const accuracies = filteredShots.map(s => s.accuracy)

    // Calculate scales
    const xMin = Math.min(...distances)
    const xMax = Math.max(...distances)
    const yMin = Math.min(...accuracies)
    const yMax = Math.max(...accuracies)

    const xScale = (x: number) => 
      margin.left + ((x - xMin) / (xMax - xMin)) * width
    const yScale = (y: number) => 
      margin.top + height - ((y - yMin) / (yMax - yMin)) * height

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(margin.left, margin.top + height)
    ctx.lineTo(margin.left + width, margin.top + height)
    ctx.strokeStyle = '#666'
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(margin.left, margin.top)
    ctx.lineTo(margin.left, margin.top + height)
    ctx.stroke()

    // Draw points
    filteredShots.forEach(shot => {
      ctx.beginPath()
      ctx.arc(
        xScale(shot.distance),
        yScale(shot.accuracy),
        4,
        0,
        2 * Math.PI
      )
      ctx.fillStyle = 'rgba(66, 153, 225, 0.6)'
      ctx.fill()
    })

    // Calculate statistics
    const meanDist = d3.mean(distances) ?? 0
    const meanAcc = d3.mean(accuracies) ?? 0

    const stdDist = Math.sqrt(
      d3.mean(distances.map(x => (x - meanDist) ** 2)) ?? 0
    )
    const stdAcc = Math.sqrt(
      d3.mean(accuracies.map(x => (x - meanAcc) ** 2)) ?? 0
    )

    // Draw standard deviation ellipses
    const drawEllipse = (factor: number, color: string, dashed = false) => {
      const points = 50
      const angleStep = (2 * Math.PI) / points

      ctx.beginPath()
      for (let i = 0; i <= points; i++) {
        const angle = i * angleStep
        const x = xScale(meanDist + factor * stdDist * Math.cos(angle))
        const y = yScale(meanAcc + factor * stdAcc * Math.sin(angle))
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.strokeStyle = color
      if (dashed) {
        ctx.setLineDash([5, 5])
      } else {
        ctx.setLineDash([])
      }
      ctx.stroke()
      ctx.setLineDash([])
    }

    drawEllipse(1, '#48bb78')
    drawEllipse(2, '#9f7aea', true)

  }, [shots, selectedClub])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Target className="w-5 h-5" />
          Shot Dispersion
        </h3>
        <select
          value={selectedClub}
          onChange={(e) => setSelectedClub(e.target.value)}
          className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 
                   rounded-lg px-3 py-1 text-sm"
        >
          {Array.from(new Set(shots.map(s => s.club))).map(club => (
            <option key={club} value={club}>{club}</option>
          ))}
        </select>
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="w-full bg-white dark:bg-gray-900 rounded-lg"
      />
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-0.5 bg-[#48bb78]" /> 1σ (68% of shots)
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-[#9f7aea]" style={{ borderStyle: 'dashed' }} /> 2σ (95% of shots)
        </div>
      </div>
    </div>
  )
}
