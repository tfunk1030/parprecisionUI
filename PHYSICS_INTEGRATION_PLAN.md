# Physics Model Integration Plan for parprecisionUI

## Table of Contents
1. [Introduction](#introduction)
2. [Integration Overview](#integration-overview)
3. [Implementation Steps](#implementation-steps)
   - [Step 1: Service Layer Setup](#step-1-service-layer-setup)
   - [Step 2: Shot Calculator Implementation](#step-2-shot-calculator-implementation)
   - [Step 3: Wind Calculator Implementation](#step-3-wind-calculator-implementation)
   - [Step 4: Weather Page Integration](#step-4-weather-page-integration)
   - [Step 5: Error Handling Implementation](#step-5-error-handling-implementation)
   - [Step 6: Performance Optimization](#step-6-performance-optimization)
4. [File Organization](#file-organization)
5. [Testing Strategy](#testing-strategy)
6. [Deployment Considerations](#deployment-considerations)
7. [Maintenance Guidelines](#maintenance-guidelines)

---

## Introduction
This document outlines the detailed plan for integrating the physics model into parprecisionUI while maintaining the existing UI structure. The integration focuses on three main areas: Shot Calculator, Wind Calculator (Pro Feature), and Weather Page display.

---

## Integration Overview

### Key Components
1. **Shot Calculator**
   - Uses weather data and club settings
   - Calculates adjusted yardage
   - Provides club recommendation

2. **Wind Calculator (Pro Feature)**
   - Includes standard shot calculations
   - Adds separate wind adjustments
   - Displays total adjustments summary

3. **Weather Page**
   - Displays basic live weather data
   - Maintains simple dashboard view

---

## Implementation Steps

### Step 1: Service Layer Setup

1. Create service layer directory
```bash
mkdir src/services
```

2. Implement base services
```typescript:src/services/base-service.ts
class BaseService {
  protected async fetchData(endpoint: string, params: any) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      return await response.json();
    } catch (error) {
      throw new Error(`Service error: ${error.message}`);
    }
  }
}
```

3. Create physics service
```typescript:src/services/physics-service.ts
class PhysicsService extends BaseService {
  async calculateBasicShot(params: BasicShotParams) {
    return this.fetchData('/api/physics/basic', params);
  }

  async calculateWindEffect(params: WindParams) {
    return this.fetchData('/api/physics/wind', params);
  }
}

export const physicsService = new PhysicsService();
```

---

### Step 2: Shot Calculator Implementation

1. Create Shot Calculator component
```typescript:src/components/ShotCalculator/index.tsx
function ShotCalculator() {
  const { weather, clubs } = useAppState();
  const { adjustedYardage, recommendedClub } = useShotCalculation(weather, clubs);
  
  return (
    <div className="shot-calculator">
      <WeatherSummary data={weather} />
      <AdjustedYardage value={adjustedYardage} />
      <ClubRecommendation club={recommendedClub} />
    </div>
  );
}
```

2. Implement calculation hook
```typescript:src/hooks/useShotCalculation.ts
function useShotCalculation(weather: WeatherData, clubs: ClubSettings) {
  const [result, setResult] = useState({ adjustedYardage: 0, recommendedClub: null });

  useEffect(() => {
    const calculate = async () => {
      try {
        const params = {
          temperature: weather.temperature,
          pressure: weather.pressure,
          humidity: weather.humidity,
          altitude: weather.altitude,
          clubType: clubs.type,
          loftAngle: clubs.loft
        };
        
        const response = await physicsService.calculateBasicShot(params);
        setResult(response);
      } catch (error) {
        handleCalculationError(error);
      }
    };

    calculate();
  }, [weather, clubs]);

  return result;
}
```

---

### Step 3: Wind Calculator Implementation

1. Create Wind Calculator component
```typescript:src/components/WindCalculator/index.tsx
function WindCalculator() {
  const { weather, clubs } = useAppState();
  const { normal, wind, total } = useWindCalculation(weather, clubs);
  
  return (
    <div className="wind-calculator">
      <AdjustmentsSummary normal={normal} wind={wind} total={total} />
    </div>
  );
}
```

2. Implement wind calculation hook
```typescript:src/hooks/useWindCalculation.ts
function useWindCalculation(weather: WeatherData, clubs: ClubSettings) {
  const [result, setResult] = useState({ normal: 0, wind: 0, total: 0 });

  useEffect(() => {
    const calculate = async () => {
      try {
        const basicParams = {
          temperature: weather.temperature,
          pressure: weather.pressure,
          humidity: weather.humidity,
          altitude: weather.altitude,
          clubType: clubs.type,
          loftAngle: clubs.loft
        };
        
        const windParams = {
          windSpeed: weather.windSpeed,
          windDirection: weather.windDirection
        };
        
        const [basicResult, windResult] = await Promise.all([
          physicsService.calculateBasicShot(basicParams),
          physicsService.calculateWindEffect(windParams)
        ]);
        
        setResult({
          normal: basicResult,
          wind: windResult,
          total: basicResult + windResult
        });
      } catch (error) {
        handleCalculationError(error);
      }
    };

    calculate();
  }, [weather, clubs]);

  return result;
}
```

---

### Step 4: Weather Page Integration

1. Implement Weather Page
```typescript:src/pages/weather/index.tsx
function WeatherPage() {
  const { weatherData } = useWeather();
  
  return (
    <WeatherDashboard>
      <WeatherSummary data={weatherData} />
    </WeatherDashboard>
  );
}
```

2. Create weather data hook
```typescript:src/hooks/useWeather.ts
function useWeather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const cached = getCachedWeather('current');
        if (cached) {
          setWeatherData(cached);
          return;
        }
        
        const data = await weatherService.getCurrentWeather();
        cacheWeather('current', data);
        setWeatherData(data);
      } catch (error) {
        handleWeatherError(error);
      }
    };

    fetchWeather();
  }, []);

  return { weatherData };
}
```

---

### Step 5: Error Handling Implementation

1. Create error handler
```typescript:src/lib/error-handler.ts
export function handleCalculationError(error: Error) {
  if (error instanceof PhysicsError) {
    return {
      error: true,
      message: 'Calculation failed. Please check your inputs.'
    };
  }
  
  if (error instanceof WeatherDataError) {
    return {
      error: true,
      message: 'Weather data unavailable. Using default values.'
    };
  }
  
  console.error('Unexpected error:', error);
  return {
    error: true,
    message: 'An unexpected error occurred. Please try again.'
  };
}
```

---

### Step 6: Performance Optimization

1. Implement caching
```typescript:src/lib/cache.ts
const WEATHER_CACHE_EXPIRY = 1000 * 60 * 5; // 5 minutes

const weatherCache = new Map<string, { timestamp: number, data: WeatherData }>();

export function getCachedWeather(key: string) {
  const cached = weatherCache.get(key);
  if (cached && Date.now() - cached.timestamp < WEATHER_CACHE_EXPIRY) {
    return cached.data;
  }
  return null;
}

export function cacheWeather(key: string, data: WeatherData) {
  weatherCache.set(key, { timestamp: Date.now(), data });
}
```

---

## File Organization

```
src/
├── physics/
│   ├── basic-calculations.js
│   ├── wind-calculations.js
│   └── index.ts
├── services/
│   ├── physics-service.ts
│   ├── weather-service.ts
│   └── base-service.ts
├── components/
│   ├── ShotCalculator/
│   │   ├── index.tsx
│   │   ├── WeatherSummary.tsx
│   │   └── ClubRecommendation.tsx
│   └── WindCalculator/
│       ├── index.tsx
│       └── AdjustmentsSummary.tsx
├── hooks/
│   ├── useShotCalculation.ts
│   ├── useWindCalculation.ts
│   └── useWeather.ts
├── lib/
│   ├── error-handler.ts
│   ├── cache.ts
│   └── types.ts
└── pages/
    ├── weather/
    │   ├── index.tsx
    │   └── dashboard.tsx
    └── calculator/
        ├── shot.tsx
        └── wind.tsx
```

---

## Testing Strategy

1. Unit Tests
   - Test individual physics calculations
   - Verify service layer functionality

2. Integration Tests
   - Test component interactions
   - Verify data flow between components

3. End-to-End Tests
   - Test complete user workflows
   - Verify UI updates correctly

---

## Deployment Considerations

1. Environment Variables
   - Set API endpoints
   - Configure cache settings

2. Build Process
   - Include physics model in build
   - Optimize bundle size

3. Monitoring
   - Set up error tracking
   - Monitor performance metrics

---

## Maintenance Guidelines

1. Version Control
   - Use feature branches
   - Implement semantic versioning

2. Documentation
   - Maintain API documentation
   - Update integration guide

3. Updates
   - Regularly update physics model
   - Monitor for breaking changes

---

This detailed guide provides a comprehensive roadmap for integrating the physics model into parprecisionUI while maintaining the existing UI structure and meeting all requirements from Operation.md.
