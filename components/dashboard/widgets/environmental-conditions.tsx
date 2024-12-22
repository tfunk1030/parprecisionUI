'use client'

import React from 'react'
import { Wind, Thermometer, Droplets, Mountain, Gauge } from 'lucide-react'
import { useEnvironmental } from '@/lib/hooks/use-environmental'

export function EnvironmentalConditionsWidget() {
  const { conditions, getAdjustments, getRecommendations } = useEnvironmental()
  const [shotDirection, setShotDirection] = React.useState(0)

  const adjustments = React.useMemo(() => 
    getAdjustments(shotDirection), [conditions, shotDirection, getAdjustments]
  )

  const recommendations = React.useMemo(() => 
    getRecommendations(), [conditions, getRecommendations]
  )

  if (!conditions) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-gray-500">Loading environmental data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Environmental Conditions</h3>
        <span className="text-sm text-gray-500">
          Live Updates
        </span>
      </div>

      {/* Current Conditions */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Wind</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">{conditions.windSpeed.toFixed(1)} mph</span>
              <div
                className="w-6 h-6 transition-transform duration-500"
                style={{
                  transform: `rotate(${conditions.windDirection}deg)`,
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-red-500" />
                <span className="text-sm">Temperature</span>
              </div>
              <span className="text-lg font-semibold">{conditions.temperature.toFixed(1)}°F</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Humidity</span>
              </div>
              <span className="text-lg font-semibold">{conditions.humidity.toFixed(1)}%</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Mountain className="w-4 h-4 text-green-500" />
                <span className="text-sm">Altitude</span>
              </div>
              <span className="text-lg font-semibold">{conditions.altitude.toFixed(0)}ft</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shot Direction Control */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Shot Direction</span>
          <span className="text-sm text-gray-500">{shotDirection}°</span>
        </div>
        <input
          type="range"
          min="0"
          max="359"
          value={shotDirection}
          onChange={(e) => setShotDirection(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Shot Adjustments */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <span className="text-sm text-gray-500">Distance Adjustment</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-lg font-semibold ${
              adjustments.distanceAdjustment > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {adjustments.distanceAdjustment > 0 ? '+' : ''}
              {adjustments.distanceAdjustment.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <span className="text-sm text-gray-500">Trajectory Shift</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-semibold">
              {Math.abs(adjustments.trajectoryShift).toFixed(1)}y
            </span>
            <span className="text-sm text-gray-500">
              {adjustments.trajectoryShift > 0 ? 'right' : 'left'}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Gauge className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-gray-500">Air Density</span>
          </div>
          <span className="text-lg font-semibold">
            {conditions.airDensity.toFixed(3)} kg/m³
          </span>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-500">Dew Point</span>
          </div>
          <span className="text-lg font-semibold">
            {conditions.dewPoint.toFixed(1)}°F
          </span>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Playing Recommendations</h4>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm"
              >
                <svg
                  className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
