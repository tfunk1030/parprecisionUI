'use client'

import ShotVisualization from '@/components/shot-visualization'

export default function ShotVisualizationPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <ShotVisualization
        distance={220}
        lateralOffset={5}
        windSpeed={12}
        windDirection={45}
      />
    </div>
  )
}
