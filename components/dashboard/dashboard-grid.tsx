'use client'

import React from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { useDashboard } from '@/lib/dashboard-context'
import { WindAnalysisWidget } from './widgets/wind-analysis'
import { ShotHeatmapWidget } from './widgets/shot-heatmap'
import { ClubComparisonWidget } from './widgets/club-comparison'
import { EnvironmentalConditionsWidget } from './widgets/environmental-conditions'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

const WIDGET_COMPONENTS = {
  'wind-analysis': WindAnalysisWidget,
  'shot-heatmap': ShotHeatmapWidget,
  'club-comparison': ClubComparisonWidget,
  'environmental': EnvironmentalConditionsWidget,
} as const

export function DashboardGrid() {
  const { activeLayout, updateWidget, removeWidget } = useDashboard()

  if (!activeLayout) return null

  const handleLayoutChange = (layout: any[]) => {
    layout.forEach((item) => {
      const widget = activeLayout.widgets.find((w) => w.id === item.i)
      if (widget) {
        updateWidget(activeLayout.id, widget.id, {
          position: { x: item.x, y: item.y },
          size: { width: item.w, height: item.h }
        })
      }
    })
  }

  return (
    <div className="p-4">
      <ResponsiveGridLayout
        className="layout"
        layouts={{
          lg: activeLayout.widgets.map((widget) => ({
            i: widget.id,
            x: widget.position.x,
            y: widget.position.y,
            w: widget.size.width,
            h: widget.size.height,
            minW: 2,
            minH: 2
          }))
        }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        onLayoutChange={handleLayoutChange}
        isDraggable={true}
        isResizable={true}
        margin={[16, 16]}
      >
        {activeLayout.widgets.map((widget) => {
          const WidgetComponent = WIDGET_COMPONENTS[widget.type as keyof typeof WIDGET_COMPONENTS]
          if (!WidgetComponent) return null

          return (
            <div key={widget.id} className="h-full">
              <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-2 border-b dark:border-gray-700 flex items-center justify-between">
                  <h3 className="text-sm font-medium capitalize">
                    {widget.type.split('-').join(' ')}
                  </h3>
                  <button
                    onClick={() => removeWidget(activeLayout.id, widget.id)}
                    className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                    aria-label="Remove Widget"
                  >
                    ×
                  </button>
                </div>
                <div className="p-4 h-[calc(100%-3rem)]">
                  <WidgetComponent />
                </div>
              </div>
            </div>
          )
        })}
      </ResponsiveGridLayout>
    </div>
  )
}
