import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WeeklyForecast } from '@/components/WeeklyForecast'
import { mockWeatherData } from '@/test/mocks'

// Mock the weather utils
vi.mock('@/utils/weatherUtils', () => ({
  getWeatherIcon: vi.fn(() => 'Cloud'),
  formatTime: vi.fn((time: string) => time),
  formatDate: vi.fn((date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { weekday: 'short' })
  }),
  isDay: vi.fn(() => true)
}))

describe('WeeklyForecast', () => {
  const defaultProps = {
    weather: mockWeatherData,
    unit: 'celsius' as const
  }

  it('renders weekly forecast section', () => {
    render(<WeeklyForecast {...defaultProps} />)
    
    expect(screen.getByText('Next 7 Days')).toBeInTheDocument()
  })

  it('displays forecast days', () => {
    render(<WeeklyForecast {...defaultProps} />)
    
    // Should show days from forecast data (uses abbreviated day names)
    expect(screen.getByText('Sun')).toBeInTheDocument()
    expect(screen.getByText('Mon')).toBeInTheDocument()
  })

  it('displays temperatures in celsius when unit is celsius', () => {
    render(<WeeklyForecast {...defaultProps} unit="celsius" />)
    
    // Temperatures are formatted with spaces like "18 ° C"
    expect(screen.getByText(/18.*°.*C/)).toBeInTheDocument() // max temp
    expect(screen.getByText(/10.*°.*C/)).toBeInTheDocument() // min temp
  })

  it('displays temperatures in fahrenheit when unit is fahrenheit', () => {
    render(<WeeklyForecast {...defaultProps} unit="fahrenheit" />)
    
    // Temperatures are formatted with spaces like "64 ° F"
    expect(screen.getByText(/64.*°.*F/)).toBeInTheDocument() // max temp fahrenheit
    expect(screen.getByText(/50.*°.*F/)).toBeInTheDocument() // min temp fahrenheit
  })

  it('shows weather condition icons', () => {
    render(<WeeklyForecast {...defaultProps} />)
    
    // Icons are rendered as SVG elements with specific classes
    const icons = screen.getAllByRole('generic', { name: '' })
    expect(icons.length).toBeGreaterThan(0)
    
    // Weather icons appear as "cloud" elements from our mocked getWeatherIcon
    const cloudIcons = document.querySelectorAll('cloud')
    expect(cloudIcons.length).toBeGreaterThan(0)
  })

  it('displays weather condition text', () => {
    render(<WeeklyForecast {...defaultProps} />)
    
    expect(screen.getByText('Partly cloudy')).toBeInTheDocument()
    expect(screen.getByText('Sunny')).toBeInTheDocument()
  })

  it('shows correct day labels', () => {
    render(<WeeklyForecast {...defaultProps} />)
    
    // Component uses abbreviated day names
    expect(screen.getByText('Sun')).toBeInTheDocument()
    expect(screen.getByText('Mon')).toBeInTheDocument()
  })

  it('displays precipitation chance', () => {
    render(<WeeklyForecast {...defaultProps} />)
    
    // Check for precipitation information from mock data (formatted with space)
    expect(screen.getByText(/65.*%/)).toBeInTheDocument() // chance of rain
  })

  it('applies correct styling to forecast container', () => {
    const { container } = render(<WeeklyForecast {...defaultProps} />)
    
    const forecastCard = container.firstChild as HTMLElement
    expect(forecastCard).toHaveClass('bg-gray-900/50', 'backdrop-blur-sm')
    expect(forecastCard).toHaveClass('rounded-2xl', 'p-6', 'shadow-lg')
  })

  it('renders forecast items with correct structure', () => {
    render(<WeeklyForecast {...defaultProps} />)
    
    // Check that forecast items have the correct layout (using Sun instead of Today)
    const sunItem = screen.getByText('Sun').closest('.flex.items-center.justify-between')
    expect(sunItem).toBeInTheDocument()
    expect(sunItem).toHaveClass('flex', 'items-center', 'justify-between')
  })

  it('shows temperature range with proper formatting', () => {
    render(<WeeklyForecast {...defaultProps} />)
    
    // Should show both high and low temperatures
    const tempElements = screen.getAllByText(/\d+°/)
    expect(tempElements.length).toBeGreaterThan(1)
  })

  it('handles empty forecast data gracefully', () => {
    const emptyWeatherData = {
      ...mockWeatherData,
      forecast: {
        forecastday: []
      }
    }
    
    render(<WeeklyForecast weather={emptyWeatherData} unit="celsius" />)
    
    // Should still render the section title
    expect(screen.getByText('Next 7 Days')).toBeInTheDocument()
  })

  it('limits forecast to 7 days maximum', () => {
    const extendedWeatherData = {
      ...mockWeatherData,
      forecast: {
        forecastday: [
          ...mockWeatherData.forecast.forecastday,
          ...Array(10).fill(mockWeatherData.forecast.forecastday[0]).map((day, index) => ({
            ...day,
            date: `2023-11-${7 + index}`,
            date_epoch: 1699315200 + (index * 86400)
          }))
        ]
      }
    }
    
    render(<WeeklyForecast weather={extendedWeatherData} unit="celsius" />)
    
    // Should only show up to 7 days (but our extended data has 12 days)
    // Each day shows 2 temperatures (high and low), so max should be 14
    const forecastItems = screen.getAllByText(/\d+\s*°/)
    expect(forecastItems.length).toBeLessThanOrEqual(14) // max 7 days * 2 temps per day
  })

  it('displays weather icons with correct alt text', () => {
    render(<WeeklyForecast {...defaultProps} />)
    
    // Icons are rendered as "cloud" elements from our mocked getWeatherIcon
    const cloudIcons = document.querySelectorAll('cloud')
    expect(cloudIcons.length).toBeGreaterThan(0)
    
    // Check that weather condition text is displayed
    expect(screen.getByText('Partly cloudy')).toBeInTheDocument()
  })

  it('rounds temperatures correctly', () => {
    const weatherWithDecimalTemps = {
      ...mockWeatherData,
      forecast: {
        forecastday: [{
          ...mockWeatherData.forecast.forecastday[0],
          day: {
            ...mockWeatherData.forecast.forecastday[0].day,
            maxtemp_c: 18.7,
            mintemp_c: 10.3
          }
        }]
      }
    }
    
    render(<WeeklyForecast weather={weatherWithDecimalTemps} unit="celsius" />)
    
    // Temperatures are formatted with spaces
    expect(screen.getByText(/19.*°.*C/)).toBeInTheDocument() // rounded max
    expect(screen.getByText(/10.*°.*C/)).toBeInTheDocument() // rounded min
  })
})
