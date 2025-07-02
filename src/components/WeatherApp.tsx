'use client';

import React, { useState, useEffect } from 'react';
import { WeatherData } from '@/types/weather';
import { weatherService } from '@/services/weatherService';
import { WeatherCard } from '@/components/WeatherCard';
import { HourlyForecast } from '@/components/HourlyForecast';
import { WeatherDetails } from '@/components/WeatherDetails';
import { WeeklyForecast } from '@/components/WeeklyForecast';
import { LocationSearch } from '@/components/LocationSearch';
import { RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';

export const WeatherApp: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState('London, UK');
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeather = async (locationQuery: string) => {
    try {
      setLoading(true);
      setError(null);
      const weatherData = await weatherService.getCurrentWeather(locationQuery);
      setWeather(weatherData);
      setLocation(`${weatherData.location.name}, ${weatherData.location.country}`);
    } catch (err) {
      setError('Failed to fetch weather data. Please check your API key and try again.');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWeather(location);
    setRefreshing(false);
  };

  const toggleUnit = () => {
    setUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  useEffect(() => {
    fetchWeather('London, UK');
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-green-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center bg-gray-900/50 p-8 rounded-2xl shadow-lg max-w-md border border-gray-800">
          <h2 className="text-xl font-semibold text-red-400 mb-4">Weather API Setup Required</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-4">
            Please get a free API key from{' '}
            <a 
              href="https://www.weatherapi.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-400 hover:underline"
            >
              WeatherAPI.com
            </a>
            {' '}and add it to your environment variables as NEXT_PUBLIC_WEATHER_API_KEY
          </p>
          <button
            onClick={() => fetchWeather(location)}
            className="px-6 py-2 bg-green-500 text-black rounded-lg hover:bg-green-400 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background abstract waves */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-green-400 rounded-full wave-animation"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 border border-green-400 rounded-full wave-animation [animation-delay:5s]"></div>
      </div>
      
      <div className="container mx-auto px-6 py-8 max-w-sm md:max-w-md relative z-10">
        {/* Header */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-green-400 text-sm font-medium">Search mode</span>
              <h1 className="text-2xl font-light">Weather in {weather.location.name}</h1>
              <p className="text-green-400 text-lg">today:</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              title="Refresh weather data"
              className="bg-gray-800/50 backdrop-blur-sm rounded-full p-3 hover:bg-gray-700/50 transition-colors disabled:opacity-50 border border-gray-700"
            >
              <RefreshCw className={`w-5 h-5 text-gray-300 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="w-full max-w-md">
            <LocationSearch onLocationSelect={fetchWeather} />
          </div>
          
          <div className="flex items-center gap-4 justify-between">
            <button
              onClick={toggleUnit}
              className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm rounded-xl px-4 py-2 hover:bg-gray-700/50 transition-colors border border-gray-700"
            >
              <span className={unit === 'celsius' ? 'font-medium text-green-400' : 'text-gray-400'}>°C</span>
              {unit === 'celsius' ? (
                <ToggleLeft className="w-6 h-6 text-green-400" />
              ) : (
                <ToggleRight className="w-6 h-6 text-green-400" />
              )}
              <span className={unit === 'fahrenheit' ? 'font-medium text-green-400' : 'text-gray-400'}>°F</span>
            </button>
          </div>
        </div>

        {/* Main Weather Card */}
        <div className="mb-8">
          <WeatherCard weather={weather} unit={unit} />
        </div>

        {/* Hourly Forecast */}
        <div className="mb-8">
          <HourlyForecast weather={weather} unit={unit} />
        </div>

        {/* Weather Details */}
        <div className="mb-8">
          <WeatherDetails weather={weather} />
        </div>

        {/* Weekly Forecast */}
        <div className="mb-8">
          <WeeklyForecast weather={weather} unit={unit} />
        </div>
      </div>
    </div>
  );
};
