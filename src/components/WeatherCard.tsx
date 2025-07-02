'use client';

import React from 'react';
import { WeatherData } from '@/types/weather';
import { getWeatherIcon, isDay } from '@/utils/weatherUtils';

interface WeatherCardProps {
  weather: WeatherData;
  unit: 'celsius' | 'fahrenheit';
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, unit }) => {
  const IconComponent = getWeatherIcon(weather.current.condition.code, isDay());
  const temp = unit === 'celsius' ? weather.current.temp_c : weather.current.temp_f;
  const feelsLike = unit === 'celsius' ? weather.current.feelslike_c : weather.current.feelslike_f;
  const unitSymbol = unit === 'celsius' ? '°C' : '°F';

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 text-white shadow-2xl border border-gray-800 relative overflow-hidden">
      {/* Abstract background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-full blur-xl"></div>
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{weather.location.name}, {weather.location.country}</span>
          </div>
        </div>
        <div className="bg-green-400/20 rounded-full p-3">
          <IconComponent className="w-8 h-8 text-green-400" />
        </div>
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div>
          <div className="text-6xl font-light mb-2 text-white">{Math.round(temp)}°C</div>
          <div className="text-gray-400 text-lg mb-1">
            Feels like {Math.round(feelsLike)}{unitSymbol}
          </div>
          <div className="text-gray-300 text-lg capitalize">
            {weather.current.condition.text}
          </div>
        </div>
      </div>
    </div>
  );
};
