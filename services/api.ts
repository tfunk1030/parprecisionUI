// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

// Types for your research data
export interface ShotData {
  distance: number
  windSpeed: number
  windDirection: number
  lateralOffset: number
  // Add more fields from your research
}

export interface WeatherData {
  temperature: number
  humidity: number
  pressure: number
  // Add more weather fields
}

// API service functions
export const api = {
  // Shot Analysis
  async getShotData(params: Partial<ShotData>): Promise<ShotData> {
    const response = await fetch(`${API_BASE_URL}/shots/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    return response.json()
  },

  // Weather Data
  async getWeatherData(): Promise<WeatherData> {
    const response = await fetch(`${API_BASE_URL}/weather`)
    return response.json()
  },

  // Flight Path Calculation
  async calculateFlightPath(params: {
    initialVelocity: number
    launchAngle: number
    spinRate: number
  }): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/flight/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    return response.json()
  },

  // Club Selection
  async getClubRecommendation(distance: number, conditions: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/clubs/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ distance, conditions })
    })
    return response.json()
  }
}
