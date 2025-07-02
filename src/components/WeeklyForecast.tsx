'use client';

import React from 'react';
import { WeatherData } from '@/types/weather';
import { getWeatherIcon, formatDate, isDay } from '@/utils/weatherUtils';

interface WeeklyForecastProps {
  weather: WeatherData;
  unit: 'celsius' | 'fahrenheit';
}

export const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ weather, unit }) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-800">
      <h3 className="text-lg font-medium text-white mb-4">Next 7 Days</h3>
      <div className="space-y-4">
        {weather.forecast.forecastday.slice(0, 7).map((day) => {
          const IconComponent = getWeatherIcon(day.day.condition.code, isDay());
          const maxTemp = unit === 'celsius' ? day.day.maxtemp_c : day.day.maxtemp_f;
          const minTemp = unit === 'celsius' ? day.day.mintemp_c : day.day.mintemp_f;
          
          return (
            <div 
              key={day.date}
              className="flex items-center justify-between py-3 border-b border-gray-800 last:border-b-0"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 text-sm text-gray-400">
                  {formatDate(day.date)}
                </div>
                <IconComponent className="w-8 h-8 text-green-400" />
                <div className="flex-1">
                  <div className="text-white capitalize text-sm">
                    {day.day.condition.text}
                  </div>
                  <div className="text-xs text-gray-500">
                    {day.day.avghumidity}% • {Math.round(day.day.maxwind_kph)}km/h
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-lg font-medium text-white">
                    {Math.round(maxTemp)}°{unit === 'celsius' ? 'C' : 'F'}
                  </div>
                  <div className="text-sm text-gray-400">
                    {Math.round(minTemp)}°{unit === 'celsius' ? 'C' : 'F'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
