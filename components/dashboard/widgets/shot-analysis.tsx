'use client'

import React from 'react'
import { usePremium } from '@/lib/premium-context'
import { useEnvironmental } from '@/lib/hooks/use-environmental'
import { useSettings } from '@/lib/settings-context'
import { Wind, Target, ArrowUp, Thermometer } from 'lucide-react'

export function ShotAnalysisWidget() {
  const { isPremium } = usePremium()
  const { conditions } = useEnvironmental()
  const { formatTemperature, formatAltitude } = useSettings()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const shotData = {
    shot: {
      intendedYardage: 150,
      adjustedYardage: 156,
      actualYardage: 153,
      suggestedClub: "7 Iron",
      alternateClub: "6 Iron",
      flightPath: {
        apex: "82 ft",
        landingAngle: "45°",
        carry: "148 yards",
        total: "153 yards"
      },
      spinRate: 2800,
      launchAngle: 16.5,
      ballSpeed: 115,
      smashFactor: 1.48
    }
  }

  // Draw shot trajectory
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isPremium) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw ground line
    const groundY = canvas.height / window.devicePixelRatio - 20
    ctx.beginPath()
    ctx.moveTo(20, groundY)
    ctx.lineTo(canvas.width / window.devicePixelRatio - 20, groundY)
    ctx.strokeStyle = '#4B5563'
    ctx.lineWidth = 1
    ctx.stroke()

    // Calculate trajectory points
    const points: [number, number][] = []
    const totalPoints = 50
    const maxHeight = parseFloat(shotData.shot.flightPath.apex)
    const totalDistance = parseFloat(shotData.shot.flightPath.total)
    
    for (let i = 0; i <= totalPoints; i++) {
      const x = i / totalPoints
      const y = 4 * maxHeight * x * (1 - x) // Parabolic trajectory
      points.push([x, y])
    }

    // Scale points to canvas
    const scaledPoints = points.map(([x, y]) => [
      20 + (canvas.width / window.devicePixelRatio - 40) * x,
      groundY - (groundY - 20) * (y / maxHeight)
    ])

    // Draw trajectory
    ctx.beginPath()
    ctx.moveTo(scaledPoints[0][0], scaledPoints[0][1])
    scaledPoints.slice(1).forEach(([x, y]) => {
      ctx.lineTo(x, y)
    })
    ctx.strokeStyle = '#3B82F6'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw ball position
    const ballPos = scaledPoints[Math.floor(totalPoints * 0.6)]
    ctx.beginPath()
    ctx.arc(ballPos[0], ballPos[1], 4, 0, Math.PI * 2)
    ctx.fillStyle = '#3B82F6'
    ctx.fill()

    // Draw height markers
    const heights = [20, 40, 60, 80]
    heights.forEach(height => {
      const y = groundY - (groundY - 20) * (height / maxHeight)
      if (y > 20) {
        ctx.beginPath()
        ctx.moveTo(15, y)
        ctx.lineTo(25, y)
        ctx.strokeStyle = '#4B5563'
        ctx.stroke()

        ctx.font = '12px system-ui'
        ctx.fillStyle = '#9CA3AF'
        ctx.textAlign = 'right'
        ctx.fillText(`${height}ft`, 12, y + 4)
      }
    })
  }, [shotData, isPremium])

  return (
    <div className="space-y-4">
      {/* Shot Data Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h3 className="text-emerald-400 mb-2">Target</h3>
          <div className="text-lg">{shotData.shot.intendedYardage} yards</div>
          <div className="text-sm text-gray-400 mt-1">
            Adjusted: {shotData.shot.adjustedYardage} yards
          </div>
        </div>
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h3 className="text-emerald-400 mb-2">Result</h3>
          <div className="text-lg">{shotData.shot.actualYardage} yards</div>
          <div className="text-sm text-gray-400 mt-1">
            Deviation: {Math.abs(shotData.shot.actualYardage - shotData.shot.intendedYardage)} yards
          </div>
        </div>
      </div>

      {/* Shot Trajectory */}
      <div className="relative h-64">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
      </div>

      {/* Advanced Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 p-3 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Spin Rate</div>
          <div className="text-lg">{shotData.shot.spinRate} rpm</div>
        </div>
        <div className="bg-gray-800/50 p-3 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Launch Angle</div>
          <div className="text-lg">{shotData.shot.launchAngle}°</div>
        </div>
        <div className="bg-gray-800/50 p-3 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Ball Speed</div>
          <div className="text-lg">{shotData.shot.ballSpeed} mph</div>
        </div>
        <div className="bg-gray-800/50 p-3 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">Smash Factor</div>
          <div className="text-lg">{shotData.shot.smashFactor}</div>
        </div>
      </div>
    </div>
  )
}
