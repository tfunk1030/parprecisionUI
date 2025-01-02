import { useEffect, useState, useMemo } from 'react'

interface Shot {
  id: string
  club: string
  distance: number
  accuracy: number // Deviation from target line in yards
  height: number
  spin: number
  date: Date
}

// Generate some realistic test data
function generateTestShots(): Shot[] {
  const clubs = ['Driver', '3-Wood', '5-Iron', '7-Iron', 'PW']
  const shots: Shot[] = []

  clubs.forEach(club => {
    // Base statistics for each club
    const baseStats = {
      Driver: { distance: 280, spread: 20 },
      '3-Wood': { distance: 250, spread: 15 },
      '5-Iron': { distance: 200, spread: 12 },
      '7-Iron': { distance: 170, spread: 10 },
      'PW': { distance: 130, spread: 8 }
    }[club]

    if (!baseStats) return

    // Generate 20 shots for each club
    for (let i = 0; i < 20; i++) {
      // Add some random variation to distance and accuracy
      const distanceVariation = (Math.random() - 0.5) * 20
      const accuracyVariation = (Math.random() - 0.5) * baseStats.spread * 2

      shots.push({
        id: `${club}-${i}`,
        club,
        distance: baseStats.distance + distanceVariation,
        accuracy: accuracyVariation,
        height: 30 + Math.random() * 10,
        spin: 2500 + Math.random() * 500,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date in last 30 days
      })
    }
  })

  // Sort by date
  return shots.sort((a, b) => b.date.getTime() - a.date.getTime())
}

export function useShots() {
  const [shots, setShots] = useState<Shot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchShots = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/shots')
        const data = await response.json()
        setShots(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchShots()
  }, [])

  const stats = useMemo(() => {
    const baseStats = {
      totalShots: shots.length,
      averageDistance: 0,
      longestShot: 0,
      shortestShot: Infinity,
      averageAccuracy: 0
    }

    if (shots.length === 0) return baseStats

    return shots.reduce((acc, shot) => {
      acc.averageDistance += shot.distance
      acc.longestShot = Math.max(acc.longestShot, shot.distance)
      acc.shortestShot = Math.min(acc.shortestShot, shot.distance)
      acc.averageAccuracy += shot.accuracy || 0
      return acc
    }, baseStats)
  }, [shots])

  return { shots, loading, error, stats }
}
