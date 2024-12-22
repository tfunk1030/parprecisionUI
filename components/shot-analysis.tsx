'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Card } from './ui/card'
import { usePremium } from '@/lib/premium-context'
import { useEnvironmental } from '@/lib/hooks/use-environmental'
import { useSettings } from '@/lib/settings-context'
import { Wind, Target, ArrowUp, Thermometer } from 'lucide-react'

const defaultShotData = {
  conditions: {
    temperature: '20°C',
    humidity: '50%',
    pressure: '1013 hPa',
    altitude: '0 m',
    wind: {
      speed: '0 mph',
      direction: 0
    }
  },
  shot: {
    intendedYardage: 150,
    adjustedYardage: 150,
    actualYardage: 150,
    suggestedClub: "7 Iron",
    alternateClub: "6 Iron",
    flightPath: {
      apex: "82 ft",
      landingAngle: "45°",
      carry: "148 yards",
      total: "150 yards"
    },
    spinRate: 2800,
    launchAngle: 16.5,
    ballSpeed: 115,
    smashFactor: 1.48
  }
}

export default function ShotAnalysis() {
  const { isPremium } = usePremium()
  const { conditions } = useEnvironmental()
  const { formatTemperature, formatAltitude } = useSettings()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [shotData, setShotData] = useState(defaultShotData)

  useEffect(() => {
    setShotData({
      conditions: {
        temperature: formatTemperature(conditions.temperature),
        humidity: `${Math.round(conditions.humidity)}%`,
        pressure: `${Math.round(conditions.pressure)} hPa`,
        altitude: formatAltitude(conditions.altitude),
        wind: {
          speed: `${Math.round(conditions.windSpeed * 2.237)} mph`,
          direction: conditions.windDirection
        }
      },
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
    })
  }, [conditions, formatTemperature, formatAltitude])

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
      <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-emerald-400">Shot Analysis</h2>
              <p className="text-sm text-gray-400">Advanced shot metrics and visualization</p>
            </div>
            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          
          {/* Conditions Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Thermometer className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-gray-400">Temperature</span>
              </div>
              <div className="text-lg">{shotData.conditions.temperature}</div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Wind className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-gray-400">Wind</span>
              </div>
              <div className="text-lg">{shotData.conditions.wind.speed}</div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <ArrowUp className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-gray-400">Altitude</span>
              </div>
              <div className="text-lg">{shotData.conditions.altitude}</div>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-gray-400">Pressure</span>
              </div>
              <div className="text-lg">{shotData.conditions.pressure}</div>
            </div>
          </div>

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

          {isPremium && (
            <>
              {/* Advanced Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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

              {/* Trajectory Visualization */}
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-emerald-400 mb-4">Shot Trajectory</h3>
                <div className="aspect-[2/1] w-full">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Club Selection */}
          <div className="bg-gray-800/50 p-4 rounded-lg mt-4">
            <h3 className="text-emerald-400 mb-2">Suggested Clubs</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Primary</div>
                <div className="text-lg">{shotData.shot.suggestedClub}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Alternative</div>
                <div className="text-lg">{shotData.shot.alternateClub}</div>
              </div>
            </div>
          </div>

          {/* Flight Data */}
          <div className="bg-gray-800/50 p-4 rounded-lg mt-4">
            <h3 className="text-emerald-400 mb-2">Flight Data</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Carry</div>
                <div>{shotData.shot.flightPath.carry}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Total</div>
                <div>{shotData.shot.flightPath.total}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Apex</div>
                <div>{shotData.shot.flightPath.apex}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Landing Angle</div>
                <div>{shotData.shot.flightPath.landingAngle}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
