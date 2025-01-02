'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useWidgetConfig } from '@/lib/widget-config-context'

interface WidgetConfigModalProps {
  widgetId: string;
  onClose: () => void;
}

export function WidgetConfigModal({ widgetId, onClose }: WidgetConfigModalProps) {
  const { getConfig, updateConfig } = useWidgetConfig()
  const config = getConfig(widgetId)

  if (!config) return null

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Widget Configuration</DialogTitle>
          <DialogDescription>
            Configure the widget settings
          </DialogDescription>
        </DialogHeader>
        {/* Add your configuration options here */}
      </DialogContent>
    </Dialog>
  )
}
