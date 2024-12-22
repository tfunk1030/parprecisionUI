'use client'

import React, { useState } from 'react'
import { useWidgetConfig } from '@/lib/widget-config-context'
import { Settings2 } from 'lucide-react'
import { WidgetConfigModal } from '../widget-config-modal'

// Mock data - replace with actual round data hook
const useRoundData = () => ({
  currentRound: {
    score: 75,
    putts: 32,
    fairwaysHit: 9,
    greensInRegulation: 12,
    penalties: 2,
  }
})

export function RoundTrackerWidget() {
  const { currentRound } = useRoundData()
  const { getConfig } = useWidgetConfig()
  const [showConfig, setShowConfig] = useState(false)

  const config = getConfig('round-tracker')
  if (!config) return null

  const enabledVariables = config.variables
    .filter(v => v.enabled)
    .sort((a, b) => a.order - b.order)

  const getVariableValue = (id: string) => {
    switch (id) {
      case 'score':
        return currentRound.score
      case 'putts':
        return currentRound.putts
      case 'fir':
        return `${currentRound.fairwaysHit}/14`
      case 'gir':
        return `${currentRound.greensInRegulation}/18`
      case 'penalties':
        return currentRound.penalties
      default:
        return ''
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowConfig(true)}
        className="absolute top-0 right-0 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <Settings2 className="w-4 h-4" />
      </button>

      <div className="grid grid-cols-2 gap-3 pt-6">
        {enabledVariables.map(variable => (
          <div key={variable.id} className="text-center">
            <div className="text-sm text-gray-500">{variable.name}</div>
            <div className="font-medium">{getVariableValue(variable.id)}</div>
          </div>
        ))}
      </div>

      {showConfig && (
        <WidgetConfigModal
          widgetId="round-tracker"
          onClose={() => setShowConfig(false)}
        />
      )}
    </div>
  )
}
