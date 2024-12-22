'use client'

import React, { useState } from 'react'
import { useEnvironmental } from '@/lib/hooks/use-environmental'
import { useSettings } from '@/lib/settings-context'
import { useWidgetConfig } from '@/lib/widget-config-context'
import { Settings2, Thermometer, Droplets, Mountain, Gauge } from 'lucide-react'
import { WidgetConfigModal } from '../widget-config-modal'

export function EnvironmentalConditionsWidget() {
  const { conditions } = useEnvironmental()
  const { formatTemperature, formatAltitude } = useSettings()
  const { getConfig } = useWidgetConfig()
  const [showConfig, setShowConfig] = useState(false)

  const config = getConfig('environmental')
  if (!config) return null

  const enabledVariables = config.variables
    .filter(v => v.enabled)
    .sort((a, b) => a.order - b.order)

  const getVariableIcon = (id: string) => {
    switch (id) {
      case 'temperature':
        return <Thermometer className="w-5 h-5 text-red-500" />
      case 'humidity':
        return <Droplets className="w-5 h-5 text-blue-500" />
      case 'pressure':
        return <Gauge className="w-5 h-5 text-purple-500" />
      case 'altitude':
        return <Mountain className="w-5 h-5 text-green-500" />
      case 'dewPoint':
        return <Droplets className="w-5 h-5 text-cyan-500" />
      default:
        return null
    }
  }

  const getVariableValue = (id: string) => {
    switch (id) {
      case 'temperature':
        return `${formatTemperature(Math.round(conditions.temperature * 10) / 10)}°`
      case 'humidity':
        return `${Math.round(conditions.humidity * 10) / 10}%`
      case 'pressure':
        return `${Math.round(conditions.pressure * 10) / 10} hPa`
      case 'altitude':
        return formatAltitude(Math.round(conditions.altitude))
      case 'dewPoint':
        return `${formatTemperature(Math.round(conditions.dewPoint * 10) / 10)}°`
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
          widgetId="environmental"
          onClose={() => setShowConfig(false)}
        />
      )}
    </div>
  )
}
