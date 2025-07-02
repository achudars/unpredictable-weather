'use client';

import React from 'react';
import { WeatherData } from '@/types/weather';
import { getWeatherIcon, formatTime, isDay } from '@/utils/weatherUtils';

interface HourlyForecastProps {
  weather: WeatherData;
  unit: 'celsius' | 'fahrenheit';
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ weather, unit }) => {
  const currentHour = new Date().getHours();
  const todayHours = weather.forecast.forecastday[0]?.hour || [];
  const tomorrowHours = weather.forecast.forecastday[1]?.hour || [];
  
  // Get next 24 hours starting from current hour
  const next24Hours = [
    ...todayHours.slice(currentHour),
    ...tomorrowHours.slice(0, Math.max(0, 24 - (24 - currentHour)))
  ].slice(0, 24);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">Today</h3>
        <div className="flex gap-2">
          <button className="text-green-400 text-sm font-medium bg-green-400/20 px-3 py-1 rounded-full">Today</button>
          <button className="text-gray-400 text-sm px-3 py-1 rounded-full hover:text-white">Tomorrow</button>
          <button className="text-gray-400 text-sm px-3 py-1 rounded-full hover:text-white">Next 7 Days</button>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {next24Hours.map((hour, index) => {
          const IconComponent = getWeatherIcon(hour.condition.code, isDay());
          const temp = unit === 'celsius' ? hour.temp_c : hour.temp_f;
          const time = formatTime(hour.time);
          
          return (
            <div 
              key={hour.time}
              className="flex flex-col items-center min-w-[80px] py-4 px-3 rounded-xl hover:bg-gray-800/50 transition-colors"
            >
              <div className="text-sm text-gray-400 mb-2">
                {index === 0 ? 'Now' : time}
              </div>
              <IconComponent className="w-8 h-8 text-green-400 mb-2" />
              <div className="text-lg font-medium text-white">
                {Math.round(temp)}°{unit === 'celsius' ? 'C' : 'F'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
