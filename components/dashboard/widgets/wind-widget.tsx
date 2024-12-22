'use client'

import React, { useState } from 'react'
import { useEnvironmental } from '@/lib/hooks/use-environmental'
import { useWidgetConfig } from '@/lib/widget-config-context'
import { Settings2, Wind, ArrowUp, CloudRain } from 'lucide-react'
import { WidgetConfigModal } from '../widget-config-modal'

const getWindDirection = (degrees: number) => {
  // Normalize degrees to positive value between 0 and 360
  degrees = ((degrees % 360) + 360) % 360
  
  const directions = [
    { min: 348.75, max: 360, name: 'N' },
    { min: 0, max: 11.25, name: 'N' },
    { min: 11.25, max: 33.75, name: 'NNE' },
    { min: 33.75, max: 56.25, name: 'NE' },
    { min: 56.25, max: 78.75, name: 'ENE' },
    { min: 78.75, max: 101.25, name: 'E' },
    { min: 101.25, max: 123.75, name: 'ESE' },
    { min: 123.75, max: 146.25, name: 'SE' },
    { min: 146.25, max: 168.75, name: 'SSE' },
    { min: 168.75, max: 191.25, name: 'S' },
    { min: 191.25, max: 213.75, name: 'SSW' },
    { min: 213.75, max: 236.25, name: 'SW' },
    { min: 236.25, max: 258.75, name: 'WSW' },
    { min: 258.75, max: 281.25, name: 'W' },
    { min: 281.25, max: 303.75, name: 'WNW' },
    { min: 303.75, max: 326.25, name: 'NW' },
    { min: 326.25, max: 348.75, name: 'NNW' },
  ]

  return directions.find(dir => 
    degrees >= dir.min && degrees < dir.max
  )?.name || 'N'
}

export function WindWidget() {
  const { conditions } = useEnvironmental()
  const { getConfig } = useWidgetConfig()
  const [showConfig, setShowConfig] = useState(false)

  const config = getConfig('wind')
  if (!config) return null

  const enabledVariables = config.variables
    .filter(v => v.enabled)
    .sort((a, b) => a.order - b.order)

  const getVariableIcon = (id: string) => {
    switch (id) {
      case 'speed':
        return <Wind className="w-5 h-5 text-blue-500" />
      case 'direction':
        return <ArrowUp className="w-5 h-5 text-green-500" />
      case 'gusts':
        return <CloudRain className="w-5 h-5 text-purple-500" />
      default:
        return null
    }
  }

  const getVariableValue = (id: string) => {
    switch (id) {
      case 'speed': {
        const speed = Math.abs(Math.round(conditions.windSpeed * 10) / 10)
        return `${speed} mph`
      }
      case 'direction': {
        const degrees = ((conditions.windDirection % 360) + 360) % 360
        const roundedDegrees = Math.round(degrees)
        const directionName = getWindDirection(degrees)
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 transition-transform duration-500"
              style={{
                transform: `rotate(${degrees}deg)`,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </div>
            <span>{roundedDegrees}° {directionName}</span>
          </div>
        )
      }
      case 'gusts': {
        const gusts = Math.abs(Math.round((conditions.windGusts || 0) * 10) / 10)
        return `${gusts} mph`
      }
      default:
        return ''
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowConfig(true)}
        className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <Settings2 className="w-4 h-4" />
      </button>

      <div className="space-y-3 pt-2">
        {enabledVariables.map(variable => (
          <div 
            key={variable.id} 
            className="flex items-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
          >
            <div className="flex items-center gap-2 flex-1">
              {getVariableIcon(variable.id)}
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {variable.name}
                </div>
                <div className="font-medium text-lg">
                  {getVariableValue(variable.id)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showConfig && (
        <WidgetConfigModal
          widgetId="wind"
          onClose={() => setShowConfig(false)}
        />
      )}
    </div>
  )
}
