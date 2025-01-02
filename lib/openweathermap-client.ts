export class OpenWeatherMapClient {
  private static instance: OpenWeatherMapClient
  private apiKey: string
  private baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public static getInstance(): OpenWeatherMapClient {
    if (!OpenWeatherMapClient.instance) {
      OpenWeatherMapClient.instance = new OpenWeatherMapClient(process.env.OPENWEATHERMAP_API_KEY || '')
    }
    return OpenWeatherMapClient.instance
  }

  public async getCurrentWeather(lat: number, lon: number): Promise<any> {
    const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Weather API request failed with status ${response.status}`)
    }

    return response.json()
  }

  public async getForecast(lat: number, lon: number): Promise<any> {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Forecast API request failed with status ${response.status}`)
    }

    return response.json()
  }
}