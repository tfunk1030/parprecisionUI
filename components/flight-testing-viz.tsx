'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Slider } from './ui/slider'

export default function BallFlightVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [params, setParams] = useState({
    launchAngle: 15,
    speed: 150,
    spin: 2500
  })

  useEffect(() => {
    // Canvas drawing logic here
  }, [params])

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
        <h2 className="text-base font-semibold text-white">Flight Testing</h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-3 space-y-3">
        {/* Canvas */}
        <div className="relative bg-gray-800 rounded-xl overflow-hidden aspect-[3/4] w-full shadow-lg">
          <canvas
            ref={canvasRef}
            width={600}
            height={800}
            className="w-full h-full"
          />
        </div>

        {/* Flight Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-800 rounded-xl p-3 shadow-lg">
            <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Height</div>
            <div className="text-lg font-bold text-emerald-400">
              125<span className="text-xs ml-1">ft</span>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-3 shadow-lg">
            <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Distance</div>
            <div className="text-lg font-bold text-emerald-400">
              245<span className="text-xs ml-1">yds</span>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-3 shadow-lg">
            <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Time</div>
            <div className="text-lg font-bold text-emerald-400">
              6.2<span className="text-xs ml-1">sec</span>
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
                min={1000}
                max={4000}
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
