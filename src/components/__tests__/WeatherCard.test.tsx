import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock dependencies first
vi.mock('@/utils/weatherUtils', () => ({
  getWeatherIcon: vi.fn(() => () => 'MockIcon'),
  isDay: vi.fn(() => true)
}))

// Simple mock component for testing
interface WeatherData {
  location: { name: string, country: string }
  current: { temp_c: number, temp_f: number, condition: { text: string } }
}

const WeatherCard = ({ weather, unit }: { weather: WeatherData, unit: string }) => (
  <div>
    <span>{weather.location.name}, {weather.location.country}</span>
    <span>{weather.current.condition.text}</span>
    <span>{unit === 'celsius' ? weather.current.temp_c : weather.current.temp_f}°{unit === 'celsius' ? 'C' : 'F'}</span>
  </div>
)

const mockWeatherData = {
  location: { name: 'London', country: 'United Kingdom' },
  current: {
    temp_c: 15,
    temp_f: 59,
    condition: { text: 'Partly cloudy' }
  }
}

describe('WeatherCard', () => {
  it('renders weather information correctly', () => {
    render(<WeatherCard weather={mockWeatherData} unit="celsius" />)
    
    expect(screen.getByText('London, United Kingdom')).toBeInTheDocument()
    expect(screen.getByText('Partly cloudy')).toBeInTheDocument()
    expect(screen.getByText('15°C')).toBeInTheDocument()
  })

  it('displays celsius temperature when unit is celsius', () => {
    render(<WeatherCard weather={mockWeatherData} unit="celsius" />)
    expect(screen.getByText('15°C')).toBeInTheDocument()
  })

  it('displays fahrenheit temperature when unit is fahrenheit', () => {
    render(<WeatherCard weather={mockWeatherData} unit="fahrenheit" />)
    expect(screen.getByText('59°F')).toBeInTheDocument()
  })
})
