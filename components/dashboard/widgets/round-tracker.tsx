'use client'

import React, { useState } from 'react'
import { useWidgetConfig } from '@/lib/widget-config-context'
import { WIDGET_SIZES } from '@/lib/widget-sizes'
import { Settings2 } from 'lucide-react'
import { WidgetConfigModal } from '@/components/dashboard/widget-config-modal'
import { useWidgetSize } from '@/lib/use-widget-size'
import { useDashboard } from '@/lib/dashboard-context'

interface RoundData {
  number: number
  shots: any[]
  score?: number
  putts?: number
  fairwaysHit?: number
  greensInRegulation?: number
  penalties?: number
}

// Mock data - replace with actual round data hook
const useRoundData = () => ({
  currentRound: {
    number: 1,
    shots: [],
    score: 72,
    putts: 30,
    fairwaysHit: 10,
    greensInRegulation: 12,
    penalties: 2
  } as RoundData
})

export function RoundTrackerWidget() {
  const size = useWidgetSize()
  const { currentRound } = useRoundData()
  const { getConfig } = useWidgetConfig()
  const { activeLayout } = useDashboard()
  const [showConfig, setShowConfig] = useState(false)

  // Find the widget ID from the active layout
  const roundWidget = activeLayout?.widgets.find(w => w.type === 'round-tracker')
  if (!roundWidget) return null

  const config = getConfig(roundWidget.id)
  if (!config) return null

  const enabledVariables = config.variables
    .filter(v => v.enabled)
    .sort((a, b) => a.order - b.order)

  const getVariableValue = (id: string) => {
    switch (id) {
      case 'score':
        return currentRound.score ?? '--'
      case 'putts':
        return currentRound.putts ?? '--'
      case 'fir':
        return currentRound.fairwaysHit ? `${currentRound.fairwaysHit}/14` : '--'
      case 'gir':
        return currentRound.greensInRegulation ? `${currentRound.greensInRegulation}/18` : '--'
      case 'penalties':
        return currentRound.penalties ?? '--'
      default:
        return '--'
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
          widgetId={roundWidget.id}
          onClose={() => setShowConfig(false)}
        />
      )}
    </div>
  )
}
