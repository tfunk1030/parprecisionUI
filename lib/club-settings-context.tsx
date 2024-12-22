'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface ClubData {
  name: string
  normalYardage: number
  loft: number
}

interface ClubSettingsContextType {
  clubs: ClubData[]
  addClub: (club: ClubData) => void
  updateClub: (index: number, club: ClubData) => void
  removeClub: (index: number) => void
  getRecommendedClub: (targetYardage: number) => ClubData | null
}

const defaultClubs: ClubData[] = [
  { name: 'Driver', normalYardage: 250, loft: 10.5 },
  { name: '3W', normalYardage: 230, loft: 15 },
  { name: '5W', normalYardage: 215, loft: 18 },
  { name: '4i', normalYardage: 200, loft: 21 },
  { name: '5i', normalYardage: 190, loft: 24 },
  { name: '6i', normalYardage: 180, loft: 27 },
  { name: '7i', normalYardage: 170, loft: 31 },
  { name: '8i', normalYardage: 160, loft: 35 },
  { name: '9i', normalYardage: 145, loft: 39 },
  { name: 'PW', normalYardage: 135, loft: 43 },
  { name: 'GW', normalYardage: 125, loft: 48 },
  { name: 'SW', normalYardage: 115, loft: 54 },
  { name: 'LW', normalYardage: 95, loft: 58 },
]

const ClubSettingsContext = createContext<ClubSettingsContextType | undefined>(undefined)

export function ClubSettingsProvider({ children }: { children: React.ReactNode }) {
  const [clubs, setClubs] = useState<ClubData[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('clubSettings')
      return saved ? JSON.parse(saved) : defaultClubs
    }
    return defaultClubs
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('clubSettings', JSON.stringify(clubs))
    }
  }, [clubs])

  const addClub = (club: ClubData) => {
    setClubs(prev => [...prev, club])
  }

  const updateClub = (index: number, club: ClubData) => {
    setClubs(prev => {
      const newClubs = [...prev]
      newClubs[index] = club
      return newClubs
    })
  }

  const removeClub = (index: number) => {
    setClubs(prev => prev.filter((_, i) => i !== index))
  }

  const getRecommendedClub = (targetYardage: number): ClubData | null => {
    const sortedClubs = [...clubs].sort((a, b) => {
      return Math.abs(a.normalYardage - targetYardage) - Math.abs(b.normalYardage - targetYardage)
    })
    return sortedClubs[0] || null
  }

  return (
    <ClubSettingsContext.Provider 
      value={{ 
        clubs, 
        addClub, 
        updateClub, 
        removeClub,
        getRecommendedClub
      }}
    >
      {children}
    </ClubSettingsContext.Provider>
  )
}

export function useClubSettings() {
  const context = useContext(ClubSettingsContext)
  if (!context) {
    throw new Error('useClubSettings must be used within a ClubSettingsProvider')
  }
  return context
}
