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

type WidgetType = 'environmental' | 'wind' | 'round-tracker' | 'shot-analysis';

const widgetComponents: Record<WidgetType, React.FC> = {
  'environmental': EnvironmentalConditionsWidget,
  'wind': WindWidget,
  'round-tracker': RoundTrackerWidget,
  'shot-analysis': ShotAnalysisWidget,
}

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
            minW: 1,
            minH: 1,
            maxW: 12,
            maxH: 12,
            isDraggable: true,
            isResizable: true,
          }))
        }}
        breakpoints={{ xxs: 0 }}
        cols={{ xxs: 12 }}
        rowHeight={100}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        onLayoutChange={handleLayoutChange}
        isDraggable={true}
        isResizable={true}
      >
        {activeLayout.widgets.map((widget) => {
          const WidgetComponent = widgetComponents[widget.type as WidgetType]
          if (!WidgetComponent) return null

          return (
            <div key={widget.id} className="relative">
              <WidgetComponent />
            </div>
          )
        })}
      </ResponsiveGridLayout>
    </div>
  )
}
