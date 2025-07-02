import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WeatherDetails } from '@/components/WeatherDetails'
import { mockWeatherData } from '@/test/mocks'

describe('WeatherDetails', () => {
  const defaultProps = {
    weather: mockWeatherData
  }

  it('renders all weather detail sections', () => {
    render(<WeatherDetails {...defaultProps} />)
    
    expect(screen.getByText('Visibility')).toBeInTheDocument()
    expect(screen.getByText('Humidity')).toBeInTheDocument()
    expect(screen.getByText('Wind speed')).toBeInTheDocument()
    expect(screen.getByText('Air Pressure')).toBeInTheDocument()
    expect(screen.getByText('Sunrise')).toBeInTheDocument()
    expect(screen.getByText('Sunset')).toBeInTheDocument()
  })

  it('displays correct visibility value', () => {
    render(<WeatherDetails {...defaultProps} />)
    
    expect(screen.getByText('10km')).toBeInTheDocument()
  })

  it('displays correct humidity value', () => {
    render(<WeatherDetails {...defaultProps} />)
    
    expect(screen.getByText('65%')).toBeInTheDocument()
  })

  it('displays correct wind speed value', () => {
    render(<WeatherDetails {...defaultProps} />)
    
    expect(screen.getByText('13km/h')).toBeInTheDocument()
  })

  it('displays correct air pressure value', () => {
    render(<WeatherDetails {...defaultProps} />)
    
    expect(screen.getByText('1015hPa')).toBeInTheDocument()
  })

  it('displays correct sunrise and sunset times', () => {
    render(<WeatherDetails {...defaultProps} />)
    
    expect(screen.getByText('07:14 AM')).toBeInTheDocument()
    expect(screen.getByText('04:26 PM')).toBeInTheDocument()
  })

  it('renders all weather detail icons', () => {
    const { container } = render(<WeatherDetails {...defaultProps} />)
    
    // Check that 6 SVG icons are rendered (one for each detail)
    const icons = container.querySelectorAll('svg')
    expect(icons).toHaveLength(6)
  })

  it('uses correct grid layout', () => {
    const { container } = render(<WeatherDetails {...defaultProps} />)
    
    const gridContainer = container.querySelector('.grid.grid-cols-2')
    expect(gridContainer).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    const { container } = render(<WeatherDetails {...defaultProps} />)
    
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('bg-gray-900/50', 'backdrop-blur-sm')
    expect(card).toHaveClass('rounded-2xl', 'p-6', 'shadow-lg')
  })

  it('renders detail items with correct structure', () => {
    render(<WeatherDetails {...defaultProps} />)
    
    // Check that each detail has the correct structure
    const visibilitySection = screen.getByText('Visibility').closest('div')?.parentElement
    expect(visibilitySection).toHaveClass('flex', 'flex-col', 'items-center', 'text-center')
  })

  it('displays values with correct styling', () => {
    render(<WeatherDetails {...defaultProps} />)
    
    const visibilityValue = screen.getByText('10km')
    expect(visibilityValue).toHaveClass('text-lg', 'font-semibold', 'text-white')
    
    const visibilityLabel = screen.getByText('Visibility')
    expect(visibilityLabel).toHaveClass('text-sm', 'text-gray-400', 'mb-1')
  })

  it('handles missing astro data gracefully', () => {
    const weatherWithoutAstro = {
      ...mockWeatherData,
      forecast: {
        forecastday: []
      }
    }
    
    render(<WeatherDetails weather={weatherWithoutAstro} />)
    
    // Should still render sections but with default times
    expect(screen.getByText('Sunrise')).toBeInTheDocument()
    expect(screen.getByText('Sunset')).toBeInTheDocument()
  })

  it('rounds wind speed correctly', () => {
    const weatherWithDecimalWind = {
      ...mockWeatherData,
      current: {
        ...mockWeatherData.current,
        wind_kph: 13.7
      }
    }
    
    render(<WeatherDetails weather={weatherWithDecimalWind} />)
    
    expect(screen.getByText('14km/h')).toBeInTheDocument()
  })

  it('rounds pressure correctly', () => {
    const weatherWithDecimalPressure = {
      ...mockWeatherData,
      current: {
        ...mockWeatherData.current,
        pressure_mb: 1015.8
      }
    }
    
    render(<WeatherDetails weather={weatherWithDecimalPressure} />)
    
    expect(screen.getByText('1016hPa')).toBeInTheDocument()
  })
})
