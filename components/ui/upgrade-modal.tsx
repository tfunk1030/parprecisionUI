'use client'

import React from 'react'
import { X, Check } from 'lucide-react'
import { usePremium } from '@/lib/premium-context'

export function UpgradeModal() {
  const { showUpgradeModal, setShowUpgradeModal, togglePremium } = usePremium()

  if (!showUpgradeModal) return null

  const features = [
    'Advanced Wind Analysis',
    'Shot Trajectory Visualization',
    '3D Shot View',
    'Complete Shot History',
    'Club Performance Insights',
    'Flight Testing Mode',
    'Custom Shot Presets',
    'Data Export'
  ]

  const handleUpgrade = () => {
    togglePremium()
    setShowUpgradeModal(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowUpgradeModal(false)}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="relative pt-8 pb-4 px-6 text-center">
          <button
            onClick={() => setShowUpgradeModal(false)}
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-emerald-400 mb-2">
            Upgrade to Premium
          </h2>
          <p className="text-gray-400">
            Unlock advanced features to enhance your game
          </p>
        </div>

        {/* Features List */}
        <div className="px-6 py-4">
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-gray-200">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="px-6 py-4 text-center">
          <div className="text-3xl font-bold text-white">
            $4.99
            <span className="text-lg text-gray-400 font-normal">/month</span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Cancel anytime
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-2 space-y-3">
          <button
            onClick={handleUpgrade}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
          >
            Upgrade Now
          </button>
          <button
            onClick={() => setShowUpgradeModal(false)}
            className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium rounded-lg transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}
