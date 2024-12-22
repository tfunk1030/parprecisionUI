'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface PremiumContextType {
  isPremium: boolean
  setIsPremium: (value: boolean) => void
  showUpgradeModal: boolean
  setShowUpgradeModal: (value: boolean) => void
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined)

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  // Always set to true for development
  const [isPremium, setIsPremium] = useState(true)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Load premium status from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsPremium(true) // Always premium in development
    }
  }, [])

  // Save premium status to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isPremium', 'true') // Always premium in development
    }
  }, [isPremium])

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        setIsPremium,
        showUpgradeModal,
        setShowUpgradeModal,
      }}
    >
      {children}
    </PremiumContext.Provider>
  )
}

export function usePremium() {
  const context = useContext(PremiumContext)
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider')
  }
  return context
}
