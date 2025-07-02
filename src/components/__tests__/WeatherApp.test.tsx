import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WeatherApp } from '../WeatherApp';
import { weatherService } from '@/services/weatherService';
import { mockWeatherData } from '@/test/mocks';

// Mock the weather service
vi.mock('@/services/weatherService', () => ({
  weatherService: {
    getCurrentWeather: vi.fn(),
  },
}));

// Mock all child components
vi.mock('../WeatherCard', () => ({
  WeatherCard: vi.fn(({ weather, unit }) => (
    <div data-testid="weather-card">
      WeatherCard - {weather.location.name} - {unit}
    </div>
  )),
}));

vi.mock('../HourlyForecast', () => ({
  HourlyForecast: vi.fn(({ weather, unit }) => (
    <div data-testid="hourly-forecast">
      HourlyForecast - {weather.location.name} - {unit}
    </div>
  )),
}));

vi.mock('../WeatherDetails', () => ({
  WeatherDetails: vi.fn(({ weather }) => (
    <div data-testid="weather-details">
      WeatherDetails - {weather.location.name}
    </div>
  )),
}));

vi.mock('../WeeklyForecast', () => ({
  WeeklyForecast: vi.fn(({ weather, unit }) => (
    <div data-testid="weekly-forecast">
      WeeklyForecast - {weather.location.name} - {unit}
    </div>
  )),
}));

vi.mock('../LocationSearch', () => ({
  LocationSearch: vi.fn(({ onLocationSelect }) => (
    <div data-testid="location-search">
      <button
        onClick={() => onLocationSelect('New York')}
        data-testid="location-select-button"
      >
        Search Location
      </button>
    </div>
  )),
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  RefreshCw: vi.fn(({ className }) => (
    <div data-testid="refresh-icon" className={className}>
      RefreshCw
    </div>
  )),
  ToggleLeft: vi.fn(({ className }) => (
    <div data-testid="toggle-left-icon" className={className}>
      ToggleLeft
    </div>
  )),
  ToggleRight: vi.fn(({ className }) => (
    <div data-testid="toggle-right-icon" className={className}>
      ToggleRight
    </div>
  )),
}));

const mockWeatherService = weatherService as unknown as {
  getCurrentWeather: ReturnType<typeof vi.fn>;
};

describe('WeatherApp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWeatherService.getCurrentWeather.mockResolvedValue(mockWeatherData);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<WeatherApp />);
    
    expect(screen.getByText('Loading weather data...')).toBeInTheDocument();
    expect(screen.getByTestId('refresh-icon')).toHaveClass('animate-spin');
  });

  it('renders weather data after successful fetch', async () => {
    render(<WeatherApp />);

    await waitFor(() => {
      expect(screen.getByText('Weather in London')).toBeInTheDocument();
    });

    expect(screen.getByTestId('weather-card')).toBeInTheDocument();
    expect(screen.getByTestId('hourly-forecast')).toBeInTheDocument();
    expect(screen.getByTestId('weather-details')).toBeInTheDocument();
    expect(screen.getByTestId('weekly-forecast')).toBeInTheDocument();
    expect(screen.getByTestId('location-search')).toBeInTheDocument();
  });

  it('renders error state when weather fetch fails', async () => {
    const errorMessage = 'API Error';
    mockWeatherService.getCurrentWeather.mockRejectedValue(new Error(errorMessage));

    render(<WeatherApp />);

    await waitFor(() => {
      expect(screen.getByText('Weather API Setup Required')).toBeInTheDocument();
    });

    expect(screen.getByText('Failed to fetch weather data. Please check your API key and try again.')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /WeatherAPI.com/i })).toHaveAttribute('href', 'https://www.weatherapi.com/');
  });

  it('handles refresh button click', async () => {
    render(<WeatherApp />);

    await waitFor(() => {
      expect(screen.getByText('Weather in London')).toBeInTheDocument();
    });

    const refreshButton = screen.getByTitle('Refresh weather data');
    fireEvent.click(refreshButton);

    expect(mockWeatherService.getCurrentWeather).toHaveBeenCalledTimes(2);
    expect(mockWeatherService.getCurrentWeather).toHaveBeenLastCalledWith('London, United Kingdom');
  });

  it('toggles temperature unit between celsius and fahrenheit', async () => {
    render(<WeatherApp />);

    await waitFor(() => {
      expect(screen.getByText('Weather in London')).toBeInTheDocument();
    });

    // Initially should be celsius
    expect(screen.getByTestId('toggle-left-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('toggle-right-icon')).not.toBeInTheDocument();

    // Click toggle button
    const toggleButton = screen.getByRole('button', { name: /°C.*°F/i });
    fireEvent.click(toggleButton);

    // Should now be fahrenheit
    expect(screen.getByTestId('toggle-right-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('toggle-left-icon')).not.toBeInTheDocument();

    // Click toggle button again
    fireEvent.click(toggleButton);

    // Should be back to celsius
    expect(screen.getByTestId('toggle-left-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('toggle-right-icon')).not.toBeInTheDocument();
  });

  it('handles location search', async () => {
    const newLocationData = {
      ...mockWeatherData,
      location: {
        name: 'New York',
        country: 'United States',
      },
    };

    mockWeatherService.getCurrentWeather
      .mockResolvedValueOnce(mockWeatherData) // Initial load
      .mockResolvedValueOnce(newLocationData); // Location search

    render(<WeatherApp />);

    await waitFor(() => {
      expect(screen.getByText('Weather in London')).toBeInTheDocument();
    });

    const locationSearchButton = screen.getByTestId('location-select-button');
    fireEvent.click(locationSearchButton);

    await waitFor(() => {
      expect(mockWeatherService.getCurrentWeather).toHaveBeenCalledWith('New York');
    });
  });

  it('handles try again button click in error state', async () => {
    mockWeatherService.getCurrentWeather
      .mockRejectedValueOnce(new Error('API Error'))
      .mockResolvedValueOnce(mockWeatherData);

    render(<WeatherApp />);

    await waitFor(() => {
      expect(screen.getByText('Weather API Setup Required')).toBeInTheDocument();
    });

    const tryAgainButton = screen.getByText('Try Again');
    fireEvent.click(tryAgainButton);

    await waitFor(() => {
      expect(screen.getByText('Weather in London')).toBeInTheDocument();
    });

    expect(mockWeatherService.getCurrentWeather).toHaveBeenCalledTimes(2);
  });

  it('passes correct unit prop to child components', async () => {
    render(<WeatherApp />);

    await waitFor(() => {
      expect(screen.getByText('Weather in London')).toBeInTheDocument();
    });

    // Initially should be celsius
    expect(screen.getByText('WeatherCard - London - celsius')).toBeInTheDocument();
    expect(screen.getByText('HourlyForecast - London - celsius')).toBeInTheDocument();
    expect(screen.getByText('WeeklyForecast - London - celsius')).toBeInTheDocument();

    // Toggle to fahrenheit
    const toggleButton = screen.getByRole('button', { name: /°C.*°F/i });
    fireEvent.click(toggleButton);

    expect(screen.getByText('WeatherCard - London - fahrenheit')).toBeInTheDocument();
    expect(screen.getByText('HourlyForecast - London - fahrenheit')).toBeInTheDocument();
    expect(screen.getByText('WeeklyForecast - London - fahrenheit')).toBeInTheDocument();
  });

  it('handles refresh button click without errors', async () => {
    render(<WeatherApp />);

    await waitFor(() => {
      expect(screen.getByText('Weather in London')).toBeInTheDocument();
    }, { timeout: 3000 });

    const refreshButton = screen.getByTitle('Refresh weather data');
    
    // Verify button exists and is clickable
    expect(refreshButton).toBeInTheDocument();
    expect(refreshButton).not.toBeDisabled();

    // Click should not cause errors
    fireEvent.click(refreshButton);

    // Verify the component still renders weather data (may re-render but should still show data)
    await waitFor(() => {
      expect(screen.getByText('Weather in London')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('displays search mode text', async () => {
    render(<WeatherApp />);

    await waitFor(() => {
      expect(screen.getByText('Search mode')).toBeInTheDocument();
    });
  });

  it('displays today text', async () => {
    render(<WeatherApp />);

    await waitFor(() => {
      expect(screen.getByText('today:')).toBeInTheDocument();
    });
  });

  it('applies correct CSS classes for styling', async () => {
    render(<WeatherApp />);

    await waitFor(() => {
      expect(screen.getByText('Weather in London')).toBeInTheDocument();
    });

    const container = screen.getByText('Weather in London').closest('.container');
    expect(container).toHaveClass('mx-auto', 'px-6', 'py-8');
  });

  it('renders background decorative elements', async () => {
    const { container } = render(<WeatherApp />);

    await waitFor(() => {
      expect(screen.getByText('Weather in London')).toBeInTheDocument();
    });

    const waveElements = container.querySelectorAll('.wave-animation');
    expect(waveElements).toHaveLength(2);
  });
});
