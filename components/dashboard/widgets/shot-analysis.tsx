'use client'

import React from 'react'
import { usePremium } from '@/lib/premium-context'
import { useEnvironmental } from '@/lib/hooks/use-environmental'
import { useSettings } from '@/lib/settings-context'

export function ShotAnalysisWidget() {
  const { isPremium } = usePremium()
  const { conditions } = useEnvironmental()
  const { formatTemperature, formatAltitude } = useSettings()

  const shotData = {
    shot: {
      intendedYardage: 150,
      adjustedYardage: 156,
      actualYardage: 153,
      suggestedClub: "7 Iron",
      alternateClub: "6 Iron",
      flightPath: {
        apex: "82",
        landingAngle: "45°",
        carry: "148",
        total: "153"
      },
      spinRate: 2800,
      launchAngle: 16.5,
      ballSpeed: 115,
      smashFactor: 1.48
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Shot Info */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
          <div className="text-sm text-gray-500">Intended</div>
          <div className="text-lg font-bold">{shotData.shot.intendedYardage} yards</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
          <div className="text-sm text-gray-500">Actual</div>
          <div className="text-lg font-bold">{shotData.shot.actualYardage} yards</div>
        </div>
      </div>

      {/* Flight Path Summary */}
      <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg mb-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-sm text-gray-500">Carry</div>
            <div className="font-medium">{shotData.shot.flightPath.carry}y</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Total</div>
            <div className="font-medium">{shotData.shot.flightPath.total}y</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Apex</div>
            <div className="font-medium">{shotData.shot.flightPath.apex}ft</div>
          </div>
        </div>
      </div>

      {/* Flight Data */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
          <div className="text-sm text-gray-500">Launch</div>
          <div className="font-medium">{shotData.shot.launchAngle}°</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
          <div className="text-sm text-gray-500">Ball Speed</div>
          <div className="font-medium">{shotData.shot.ballSpeed} mph</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
          <div className="text-sm text-gray-500">Spin Rate</div>
          <div className="font-medium">{shotData.shot.spinRate} rpm</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
          <div className="text-sm text-gray-500">Smash</div>
          <div className="font-medium">{shotData.shot.smashFactor}</div>
        </div>
      </div>
    </div>
  )
}
