'use client'

import React from 'react'
import { useWidgetConfig, type WidgetConfig, type WidgetVariable } from '@/lib/widget-config-context'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X } from 'lucide-react'

interface WidgetConfigModalProps {
  widgetId: string
  onClose: () => void
}

function SortableItem({ variable }: { variable: WidgetVariable }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: variable.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-move text-gray-400"
      >
        <GripVertical className="w-5 h-5" />
      </div>
      <label className="flex items-center flex-1">
        <input
          type="checkbox"
          checked={variable.enabled}
          onChange={() => {}} // Will be handled by parent
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-2">{variable.name}</span>
      </label>
    </div>
  )
}

export function WidgetConfigModal({ widgetId, onClose }: WidgetConfigModalProps) {
  const { getConfig, updateConfig } = useWidgetConfig()
  const config = getConfig(widgetId)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  if (!config) return null

  const handleToggleVariable = (variableId: string) => {
    const newConfig: WidgetConfig = {
      ...config,
      variables: config.variables.map(v => 
        v.id === variableId ? { ...v, enabled: !v.enabled } : v
      )
    }
    updateConfig(widgetId, newConfig)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = config.variables.findIndex(v => v.id === active.id)
      const newIndex = config.variables.findIndex(v => v.id === over.id)

      const newConfig: WidgetConfig = {
        ...config,
        variables: arrayMove(config.variables, oldIndex, newIndex).map(
          (v, index) => ({ ...v, order: index })
        )
      }
      updateConfig(widgetId, newConfig)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Widget Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={config.variables.map(v => v.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {config.variables
                  .sort((a, b) => a.order - b.order)
                  .map((variable) => (
                    <div key={variable.id} onClick={() => handleToggleVariable(variable.id)}>
                      <SortableItem variable={variable} />
                    </div>
                  ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="p-4 border-t dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
