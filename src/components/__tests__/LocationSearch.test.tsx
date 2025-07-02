import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocationSearch } from '@/components/LocationSearch'
import { weatherService } from '@/services/weatherService'

// Mock the weather service
vi.mock('@/services/weatherService', () => ({
  weatherService: {
    searchLocations: vi.fn(),
    getCurrentWeather: vi.fn()
  }
}))

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Search: vi.fn(({ className }) => <div data-testid="search-icon" className={className}>Search</div>),
  MapPin: vi.fn(({ className }) => <div data-testid="map-pin-icon" className={className}>MapPin</div>),
}))

// Get the mocked version of weatherService
const mockedWeatherService = vi.mocked(weatherService)

describe('LocationSearch', () => {
  const mockOnLocationSelect = vi.fn()

  const defaultProps = {
    onLocationSelect: mockOnLocationSelect
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Default mock behavior
    mockedWeatherService.searchLocations.mockResolvedValue([
      { name: 'London', country: 'United Kingdom', region: 'England' }
    ])
  })

  it('renders search input correctly', () => {
    render(<LocationSearch {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText(/search for a city/i)
    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toHaveAttribute('type', 'text')
  })

  it('renders search icon', () => {
    render(<LocationSearch {...defaultProps} />)
    
    const searchIcon = screen.getByTestId('search-icon')
    expect(searchIcon).toBeInTheDocument()
  })

  it('updates search input value when typing', async () => {
    const user = userEvent.setup()
    render(<LocationSearch {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText(/search for a city/i)
    await user.type(searchInput, 'London')
    
    expect(searchInput).toHaveValue('London')
  })

  it('shows search results when typing', async () => {
    const user = userEvent.setup()
    render(<LocationSearch {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText(/search for a city/i)
    await user.type(searchInput, 'London')
    
    await waitFor(() => {
      expect(screen.getByText('London')).toBeInTheDocument()
      expect(screen.getByText('England, United Kingdom')).toBeInTheDocument()
    })
  })

  it('calls onLocationSelect when search result is clicked', async () => {
    const user = userEvent.setup()
    render(<LocationSearch {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText(/search for a city/i)
    await user.type(searchInput, 'London')
    
    await waitFor(() => {
      const result = screen.getByText('London')
      expect(result).toBeInTheDocument()
    })
    
    const result = screen.getByText('London')
    await user.click(result)
    
    expect(mockOnLocationSelect).toHaveBeenCalledWith('London, United Kingdom')
  })

  it('applies correct styling to search container', () => {
    const { container } = render(<LocationSearch {...defaultProps} />)
    
    const searchContainer = container.firstChild as HTMLElement
    expect(searchContainer).toHaveClass('relative')
  })

  it('applies correct styling to search input', () => {
    render(<LocationSearch {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText(/search for a city/i)
    expect(searchInput).toHaveClass('w-full')
    expect(searchInput).toHaveClass('bg-gray-900/50')
    expect(searchInput).toHaveClass('text-white')
    expect(searchInput).toHaveClass('rounded-xl')
  })

  it('clears search results when input is cleared', async () => {
    const user = userEvent.setup()
    render(<LocationSearch {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText(/search for a city/i)
    await user.type(searchInput, 'London')
    
    await waitFor(() => {
      expect(screen.getByText('London')).toBeInTheDocument()
    })
    
    await user.clear(searchInput)
    
    await waitFor(() => {
      expect(screen.queryByText('London')).not.toBeInTheDocument()
    })
  })

  it('closes search results when clicking outside', async () => {
    const user = userEvent.setup()
    render(<LocationSearch {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText(/search for a city/i)
    await user.type(searchInput, 'London')
    
    await waitFor(() => {
      expect(screen.getByText('London')).toBeInTheDocument()
    })
    
    // Click outside
    await user.click(document.body)
    
    await waitFor(() => {
      expect(screen.queryByText('London')).not.toBeInTheDocument()
    })
  })

  it('handles empty search results', async () => {
    // Mock empty results for this specific test
    mockedWeatherService.searchLocations.mockClear()
    mockedWeatherService.searchLocations.mockResolvedValue([])
    
    const user = userEvent.setup()
    render(<LocationSearch {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText(/search for a city/i)
    await user.type(searchInput, 'NonexistentCity')
    
    await waitFor(() => {
      expect(screen.getByText('No locations found')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('handles search errors gracefully', async () => {
    // Mock search error for this specific test
    mockedWeatherService.searchLocations.mockClear()
    mockedWeatherService.searchLocations.mockRejectedValue(new Error('Search failed'))
    
    const user = userEvent.setup()
    render(<LocationSearch {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText(/search for a city/i)
    await user.type(searchInput, 'London')
    
    // Should not crash and should not show results (results should be cleared on error)
    await waitFor(() => {
      expect(screen.queryByText('London')).not.toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('handles async search operations correctly', async () => {
    // Test that the component handles async search operations without crashing
    // and that the search function is called with the correct query
    mockedWeatherService.searchLocations.mockClear()
    mockedWeatherService.searchLocations.mockResolvedValue([
      { name: 'London', country: 'United Kingdom', region: 'England' }
    ])
    
    const user = userEvent.setup()
    render(<LocationSearch {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText(/search for a city/i)
    await user.type(searchInput, 'London')
    
    // Wait for search results to appear
    await waitFor(() => {
      expect(screen.getByText('London')).toBeInTheDocument()
    })
    
    // Verify the search service was called with correct query
    expect(mockedWeatherService.searchLocations).toHaveBeenCalledWith('London')
  })

  it('limits search results to 5 items', async () => {
    // Mock many results for this specific test
    mockedWeatherService.searchLocations.mockClear()
    const manyResults = Array.from({ length: 10 }, (_, i) => ({
      name: `City${i}`,
      country: 'Country',
      region: 'Region'
    }))
    mockedWeatherService.searchLocations.mockResolvedValue(manyResults)
    
    const user = userEvent.setup()
    render(<LocationSearch {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText(/search for a city/i)
    await user.type(searchInput, 'City')
    
    await waitFor(() => {
      // Should only show first 5 results
      expect(screen.getByText('City0')).toBeInTheDocument()
      expect(screen.getByText('City4')).toBeInTheDocument()
      expect(screen.queryByText('City5')).not.toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('does not search for queries shorter than 2 characters', async () => {
    const user = userEvent.setup()
    render(<LocationSearch {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText(/search for a city/i)
    await user.type(searchInput, 'L')
    
    // Should not call search service
    expect(mockedWeatherService.searchLocations).not.toHaveBeenCalled()
  })
})
