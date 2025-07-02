'use client';

import React from 'react';
import { WeatherData } from '@/types/weather';
import { Eye, Droplets, Wind, Gauge, Sunrise, Sunset } from 'lucide-react';

interface WeatherDetailsProps {
  weather: WeatherData;
}

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({ weather }) => {
  const sunrise = weather.forecast.forecastday[0]?.astro.sunrise || '7:00 AM';
  const sunset = weather.forecast.forecastday[0]?.astro.sunset || '6:00 PM';

  const details = [
    {
      icon: Eye,
      label: 'Visibility',
      value: `${weather.current.vis_km}km`,
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${weather.current.humidity}%`,
    },
    {
      icon: Wind,
      label: 'Wind speed',
      value: `${Math.round(weather.current.wind_kph)}km/h`,
    },
    {
      icon: Gauge,
      label: 'Air Pressure',
      value: `${Math.round(weather.current.pressure_mb)}hPa`,
    },
    {
      icon: Sunrise,
      label: 'Sunrise',
      value: sunrise,
    },
    {
      icon: Sunset,
      label: 'Sunset',
      value: sunset,
    },
  ];

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-800">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {details.map((detail) => {
          const IconComponent = detail.icon;
          return (
            <div key={detail.label} className="flex flex-col items-center text-center">
              <IconComponent className="w-8 h-8 text-green-400 mb-2" />
              <div className="text-sm text-gray-400 mb-1">{detail.label}</div>
              <div className="text-lg font-semibold text-white">{detail.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
