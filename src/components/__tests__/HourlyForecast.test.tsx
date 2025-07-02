import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HourlyForecast } from '@/components/HourlyForecast'
import { mockWeatherData } from '@/test/mocks'

// Mock the weather utils
vi.mock('@/utils/weatherUtils', () => ({
  getWeatherIcon: vi.fn(() => 'Cloud'),
  formatTime: vi.fn((time: string) => {
    const date = new Date(time)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  }),
  isDay: vi.fn(() => true)
}))

describe('HourlyForecast', () => {
  const defaultProps = {
    weather: mockWeatherData,
    unit: 'celsius' as const
  }

  beforeEach(() => {
    const mockDate = new Date('2023-11-05T00:00:00')
    vi.setSystemTime(mockDate)
  })

  it('renders tab buttons correctly', () => {
    render(<HourlyForecast {...defaultProps} />)
    
    expect(screen.getByRole('button', { name: 'Today' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tomorrow' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next 7 Days' })).toBeInTheDocument()
  })

  it('shows Today tab as active by default', () => {
    render(<HourlyForecast {...defaultProps} />)
    
    const todayButton = screen.getByRole('button', { name: 'Today' })
    expect(todayButton).toHaveClass('text-green-400', 'font-medium', 'bg-green-400/20')
  })
})
