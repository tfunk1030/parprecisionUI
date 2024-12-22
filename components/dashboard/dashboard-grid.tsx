'use client'

import React from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { useDashboard } from '@/lib/dashboard-context'
import { EnvironmentalConditionsWidget } from './widgets/environmental-conditions'
import { WindWidget } from './widgets/wind-widget'
import { RoundTrackerWidget } from './widgets/round-tracker'
import { ShotAnalysisWidget } from './widgets/shot-analysis'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

const widgetComponents = {
  'environmental': EnvironmentalConditionsWidget,
  'wind': WindWidget,
  'round-tracker': RoundTrackerWidget,
  'shot-analysis': ShotAnalysisWidget,
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
          xxs: activeLayout.widgets.map((widget) => ({
            i: widget.id,
            x: widget.position.x,
            y: widget.position.y,
            w: widget.size.width,
            h: widget.size.height,
            minW: 2,
            minH: 2,
            maxW: 4,
            maxH: 6,
          }))
        }}
        breakpoints={{ xxs: 0 }}
        cols={{ xxs: 4 }}
        rowHeight={60}
        onLayoutChange={handleLayoutChange}
        isDraggable={true}
        isResizable={true}
        margin={[8, 8]}
        containerPadding={[8, 8]}
        resizeHandles={['s', 'e', 'se']}
        draggableHandle=".widget-handle"
        compactType={null}
        preventCollision={true}
        useCSSTransforms={true}
      >
        {activeLayout.widgets.map((widget) => {
          const WidgetComponent = widgetComponents[widget.type]
          if (!WidgetComponent) return null

          return (
            <div key={widget.id} className="h-full">
              <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="border-b dark:border-gray-700 flex items-center">
                  <div className="widget-handle cursor-move flex-1 p-2">
                    <h3 className="text-sm font-medium capitalize">
                      {widget.type.split('-').join(' ')}
                    </h3>
                  </div>
                  <button
                    onClick={() => removeWidget(activeLayout.id, widget.id)}
                    className="w-10 h-10 shrink-0 flex items-center justify-center text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Remove Widget"
                  >
                    ×
                  </button>
                </div>
                <div className="p-4 h-[calc(100%-3rem)] overflow-y-auto">
                  <WidgetComponent />
                </div>
              </div>
            </div>
          )
        })}
      </ResponsiveGridLayout>

      <style jsx global>{`
        .react-resizable-handle {
          width: 20px !important;
          height: 20px !important;
          background: none !important;
        }
        .react-resizable-handle::after {
          border-color: #9ca3af !important;
          width: 8px !important;
          height: 8px !important;
        }
        .react-resizable-handle-s {
          bottom: 4px !important;
        }
        .react-resizable-handle-e {
          right: 4px !important;
        }
        .react-resizable-handle-se {
          bottom: 4px !important;
          right: 4px !important;
        }
      `}</style>
    </div>
  )
}
