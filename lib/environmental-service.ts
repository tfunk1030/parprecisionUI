import { EnvironmentalConditions, EnvironmentalCalculator } from './environmental-calculations';

interface EnvironmentalConditions {
  temperature: number; // in Celsius
  humidity: number; // percentage
  altitude: number; // in meters
  pressure: number; // in hPa
  windSpeed: number; // in m/s
  windDirection: number; // in degrees
  dewPoint: number; // in Celsius
  airDensity: number; // in kg/m³
}

const DEFAULT_CONDITIONS: EnvironmentalConditions = {
  temperature: 20, // 20°C
  humidity: 50, // 50%
  altitude: 0, // sea level
  pressure: 1013.25, // standard pressure
  windSpeed: 0, // no wind
  windDirection: 0, // no wind direction
  dewPoint: 10, // 10°C
  airDensity: 1.225, // standard air density
};

type SubscriberCallback = (conditions: EnvironmentalConditions) => void

export class EnvironmentalService {
  private static instance: EnvironmentalService;
  private conditions: EnvironmentalConditions;
  private subscribers: Set<SubscriberCallback>;
  private updateInterval: NodeJS.Timeout | null;
  private baseAltitude: number; // Base altitude that stays constant
  private lastUpdate: number; // Last update timestamp

  private constructor() {
    // Generate a stable random base altitude using a fixed seed
    const seed = 42; // Using a fixed seed for consistent values
    this.baseAltitude = (Math.sin(seed) + 1) * 1000; // 0-2000 meters

    this.conditions = {
      ...DEFAULT_CONDITIONS,
      altitude: this.baseAltitude,
    };
    this.subscribers = new Set();
    this.updateInterval = null;
    this.lastUpdate = Date.now();
  }

  public static getInstance(): EnvironmentalService {
    if (!EnvironmentalService.instance) {
      EnvironmentalService.instance = new EnvironmentalService();
    }
    return EnvironmentalService.instance;
  }

  public getConditions(): EnvironmentalConditions {
    return { ...this.conditions };
  }

  public subscribe(callback: SubscriberCallback): () => void {
    this.subscribers.add(callback);
    callback(this.conditions);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach((callback) => callback({ ...this.conditions }));
  }

  private updateConditions() {
    const now = Date.now();
    const timeDiff = (now - this.lastUpdate) / 1000; // Time difference in seconds

    // Use time-based variations with fixed phase offsets for stability
    const timeScale = timeDiff / 3600; // Scale over an hour
    this.conditions = {
      temperature: 20 + Math.sin(timeScale * Math.PI * 2) * 5, // Vary between 15-25°C
      humidity: 50 + Math.sin(timeScale * Math.PI * 2 + 1) * 20, // Vary between 30-70%
      altitude: this.baseAltitude + Math.sin(timeScale * Math.PI * 2 + 2) * 10, // Small variations
      pressure: 1013.25 + Math.sin(timeScale * Math.PI * 2 + 3) * 10, // Vary around standard
      windSpeed: Math.sin(timeScale * Math.PI * 2 + 4) * 15, // Vary between 0-15 m/s
      windDirection: Math.sin(timeScale * Math.PI * 2 + 5) * 360, // Vary between 0-360 degrees
      dewPoint: EnvironmentalCalculator.calculateDewPoint(
        this.conditions.temperature,
        this.conditions.humidity
      ),
      airDensity: this.conditions.airDensity, // Will be calculated below
    };

    // Calculate air density
    const tempK = this.conditions.temperature + 273.15; // Convert to Kelvin
    const pressure = this.conditions.pressure * 100; // Convert hPa to Pa
    this.conditions.airDensity = pressure / (287.05 * tempK);

    this.lastUpdate = now;
    this.notifySubscribers();
  }

  public startMonitoring() {
    if (!this.updateInterval) {
      this.updateInterval = setInterval(() => this.updateConditions(), 30000);
      this.updateConditions(); // Initial update
    }
  }

  public stopMonitoring() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}
