'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { useDashboard } from '@/lib/dashboard-context'

const AVAILABLE_WIDGETS = [
  { type: 'wind-analysis', label: 'Wind Analysis' },
  { type: 'shot-heatmap', label: 'Shot Heatmap' },
  { type: 'club-comparison', label: 'Club Comparison' },
  { type: 'environmental', label: 'Environmental' },
] as const

type WidgetType = typeof AVAILABLE_WIDGETS[number]['type']

export function WidgetManager() {
  const { activeLayout, addWidget } = useDashboard()
  const [isOpen, setIsOpen] = React.useState(false)

  const handleAddWidget = (type: WidgetType) => {
    if (!activeLayout) return

    addWidget(activeLayout.id, {
      type,
      position: { x: 0, y: 0 },
      size: { width: 2, height: 2 }
    })
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <button
        className="w-12 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg"
        aria-label="Add Widget"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Plus className="w-6 h-6" />
      </button>
      
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2">
          <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl p-2 w-48">
            <div className="text-xs text-gray-400 px-2 pb-2">Add Widget</div>
            {AVAILABLE_WIDGETS.map(widget => (
              <button
                key={widget.type}
                onClick={() => handleAddWidget(widget.type)}
                className="w-full text-left px-3 py-2 hover:bg-gray-800 rounded text-sm text-gray-200 hover:text-white transition-colors"
              >
                {widget.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
