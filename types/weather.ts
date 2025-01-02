export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  altitude: number;
  latitude: number;
  longitude: number;
  condition?: string;
  location?: string;
  icon?: string;
  time?: Date;
}

export interface WeatherResponse {
  data: WeatherData;
  timestamp: number;
}

export interface WeatherCache {
  [key: string]: WeatherResponse;
}

export interface WeatherError {
  message: string;
  code?: string;
  status?: number;
}

export interface WeatherState {
  data: WeatherData | null;
  isLoading: boolean;
  error: WeatherError | null;
  lastUpdated: number | null;
} 