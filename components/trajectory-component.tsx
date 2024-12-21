'use client'

import React, { useEffect, useState } from 'react'
import { Card } from './ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Slider } from './ui/slider'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

interface TrajectoryPoint {
  distance: number
  height: number
  lateralOffset: number
  time: number
}

interface BallPhysics {
  initialVelocity: number
  launchAngle: number
  spinRate: number
  windSpeed: number
  windDirection: number
  clubType: string
}

const clubPresets = {
  'Driver': { velocity: 167, angle: 14.2, spinRate: 2800 },
  '3-Wood': { velocity: 158, angle: 13.5, spinRate: 3400 },
  '5-Iron': { velocity: 138, angle: 17.8, spinRate: 5200 },
  '7-Iron': { velocity: 127, angle: 19.5, spinRate: 6400 },
  'PW': { velocity: 115, angle: 24, spinRate: 8200 }
}

const TrajectoryVisualization = () => {
  const [trajectoryData, setTrajectoryData] = useState<TrajectoryPoint[]>([])
  const [physics, setPhysics] = useState<BallPhysics>({
    initialVelocity: 167,
    launchAngle: 14.2,
    spinRate: 2800,
    windSpeed: 10,
    windDirection: 45,
    clubType: 'Driver'
  })

  // Constants for ball flight calculations
  const GRAVITY = 32.174 // ft/s²
  const AIR_DENSITY = 0.0765 // lb/ft³
  const BALL_MASS = 0.1012 // lb
  const BALL_RADIUS = 0.084 // ft
  const BALL_AREA = Math.PI * BALL_RADIUS * BALL_RADIUS
  const DRAG_COEFFICIENT = 0.47
  const MAGNUS_COEFFICIENT = 0.25
  const TIME_STEP = 0.01 // seconds

  useEffect(() => {
    calculateTrajectory()
  }, [physics])

  const calculateTrajectory = () => {
    const points: TrajectoryPoint[] = []
    let x = 0
    let y = 0
    let z = 0
    
    // Convert initial conditions to SI units
    const v0 = physics.initialVelocity * 1.467 // Convert mph to ft/s
    const theta = physics.launchAngle * Math.PI / 180
    const omega = physics.spinRate * 2 * Math.PI / 60 // Convert rpm to rad/s
    const vWind = physics.windSpeed * 1.467 // Convert mph to ft/s
    const windTheta = physics.windDirection * Math.PI / 180

    // Initial velocities
    let vx = v0 * Math.cos(theta)
    let vy = 0 // Initial lateral velocity
    let vz = v0 * Math.sin(theta)
    
    let t = 0
    
    while (z >= 0 && t < 10) { // Max 10 seconds of flight
      // Calculate relative wind velocity
      const vWindX = vWind * Math.cos(windTheta)
      const vWindY = vWind * Math.sin(windTheta)
      const vRelX = vx - vWindX
      const vRelY = vy - vWindY
      const vRelZ = vz
      const vRel = Math.sqrt(vRelX * vRelX + vRelY * vRelY + vRelZ * vRelZ)

      // Drag force
      const dragForce = 0.5 * AIR_DENSITY * BALL_AREA * DRAG_COEFFICIENT * vRel
      const dragX = -dragForce * vRelX / vRel
      const dragY = -dragForce * vRelY / vRel
      const dragZ = -dragForce * vRelZ / vRel

      // Magnus force (lift due to spin)
      const magnusForce = 0.5 * AIR_DENSITY * BALL_AREA * MAGNUS_COEFFICIENT * omega * BALL_RADIUS
      const magnusZ = magnusForce

      // Calculate accelerations
      const ax = dragX / BALL_MASS
      const ay = dragY / BALL_MASS
      const az = (dragZ + magnusZ) / BALL_MASS - GRAVITY

      // Update velocities
      vx += ax * TIME_STEP
      vy += ay * TIME_STEP
      vz += az * TIME_STEP

      // Update positions
      x += vx * TIME_STEP
      y += vy * TIME_STEP
      z += vz * TIME_STEP

      // Store point
      points.push({
        distance: x / 3, // Convert to yards
        height: z / 3, // Convert to yards
        lateralOffset: y / 3, // Convert to yards
        time: t
      })

      t += TIME_STEP
    }

    setTrajectoryData(points)
  }

  const handleClubChange = (value: string) => {
    const preset = clubPresets[value]
    setPhysics(prev => ({
      ...prev,
      initialVelocity: preset.velocity,
      launchAngle: preset.angle,
      spinRate: preset.spinRate,
      clubType: value
    }))
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Shot Trajectory</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trajectory Charts */}
          <div className="space-y-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trajectoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="distance" 
                    label={{ value: 'Distance (yards)', position: 'bottom' }} 
                  />
                  <YAxis 
                    dataKey="height" 
                    label={{ value: 'Height (yards)', angle: -90, position: 'left' }} 
                  />
                  <Tooltip 
                    formatter={(value: number) => value.toFixed(1) + ' yards'}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="height" 
                    stroke="#8884d8" 
                    name="Height"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trajectoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="distance" 
                    label={{ value: 'Distance (yards)', position: 'bottom' }} 
                  />
                  <YAxis 
                    dataKey="lateralOffset" 
                    label={{ value: 'Lateral Offset (yards)', angle: -90, position: 'left' }} 
                  />
                  <Tooltip 
                    formatter={(value: number) => value.toFixed(1) + ' yards'}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="lateralOffset" 
                    stroke="#82ca9d" 
                    name="Lateral"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Club Selection</Label>
                <Select value={physics.clubType} onValueChange={handleClubChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(clubPresets).map(club => (
                      <SelectItem key={club} value={club}>
                        {club}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ball Speed (mph)</Label>
                <Slider
                  min={80}
                  max={190}
                  step={0.5}
                  value={[physics.initialVelocity]}
                  onValueChange={([value]) => setPhysics(prev => ({ ...prev, initialVelocity: value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Launch Angle (degrees)</Label>
                <Slider
                  min={0}
                  max={30}
                  step={0.1}
                  value={[physics.launchAngle]}
                  onValueChange={([value]) => setPhysics(prev => ({ ...prev, launchAngle: value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Spin Rate (rpm)</Label>
                <Slider
                  min={1000}
                  max={10000}
                  step={100}
                  value={[physics.spinRate]}
                  onValueChange={([value]) => setPhysics(prev => ({ ...prev, spinRate: value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Wind Speed (mph)</Label>
                <Slider
                  min={0}
                  max={30}
                  step={0.5}
                  value={[physics.windSpeed]}
                  onValueChange={([value]) => setPhysics(prev => ({ ...prev, windSpeed: value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Wind Direction (degrees)</Label>
                <Slider
                  min={0}
                  max={360}
                  step={5}
                  value={[physics.windDirection]}
                  onValueChange={([value]) => setPhysics(prev => ({ ...prev, windDirection: value }))}
                />
              </div>
            </div>

            {/* Stats Display */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-800 rounded-lg">
                <div className="text-gray-400 mb-1">Max Height</div>
                <div className="text-emerald-400 font-semibold">
                  {Math.round(Math.max(...trajectoryData.map(p => p.height)))} yards
                </div>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg">
                <div className="text-gray-400 mb-1">Total Distance</div>
                <div className="text-emerald-400 font-semibold">
                  {Math.round(trajectoryData[trajectoryData.length - 1]?.distance || 0)} yards
                </div>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg">
                <div className="text-gray-400 mb-1">Max Lateral</div>
                <div className="text-emerald-400 font-semibold">
                  {Math.round(Math.max(...trajectoryData.map(p => Math.abs(p.lateralOffset))))} yards
                </div>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg">
                <div className="text-gray-400 mb-1">Flight Time</div>
                <div className="text-emerald-400 font-semibold">
                  {trajectoryData[trajectoryData.length - 1]?.time.toFixed(1)}s
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default TrajectoryVisualization
