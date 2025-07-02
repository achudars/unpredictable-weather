'use client';

import React, { useState } from 'react';
import { WeatherData } from '@/types/weather';
import { getWeatherIcon, formatTime, isDay } from '@/utils/weatherUtils';

interface HourlyForecastProps {
  weather: WeatherData;
  unit: 'celsius' | 'fahrenheit';
}

type ForecastTab = 'today' | 'tomorrow' | 'weekly';

type HourData = {
  time: string;
  temp_c: number;
  temp_f: number;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
};

type DayData = {
  date: string;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
  };
};

type ForecastItem = HourData | DayData;

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ weather, unit }) => {
  const [activeTab, setActiveTab] = useState<ForecastTab>('today');
  
  const currentHour = new Date().getHours();
  const todayHours = weather.forecast.forecastday[0]?.hour || [];
  const tomorrowHours = weather.forecast.forecastday[1]?.hour || [];
  
  // Get next 24 hours starting from current hour
  const next24Hours = [
    ...todayHours.slice(currentHour),
    ...tomorrowHours.slice(0, Math.max(0, 24 - (24 - currentHour)))
  ].slice(0, 24);

  const getForecastData = () => {
    switch (activeTab) {
      case 'today':
        return next24Hours;
      case 'tomorrow':
        return tomorrowHours;
      case 'weekly':
        // For weekly view, show daily forecasts instead of hourly
        return weather.forecast.forecastday.slice(0, 7);
      default:
        return next24Hours;
    }
  };

  const getTimeLabel = (item: any, index: number) => {
    if (activeTab === 'weekly') {
      const date = new Date(item.date);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
      }
      return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
    }
    
    if (activeTab === 'today' && index === 0) {
      return 'Now';
    }
    
    return formatTime(item.time);
  };

  const getTemperature = (item: any) => {
    if (activeTab === 'weekly') {
      const maxTemp = unit === 'celsius' ? item.day.maxtemp_c : item.day.maxtemp_f;
      return Math.round(maxTemp);
    }
    
    const temp = unit === 'celsius' ? item.temp_c : item.temp_f;
    return Math.round(temp);
  };

  const getWeatherCondition = (item: any) => {
    if (activeTab === 'weekly') {
      return item.day.condition;
    }
    return item.condition;
  };

  const getTabTitle = () => {
    if (activeTab === 'today') return 'Today';
    if (activeTab === 'tomorrow') return 'Tomorrow';
    return 'Next 7 Days';
  };

  const getItemKey = (item: any) => {
    if (activeTab === 'weekly') {
      return item.date;
    }
    return item.time;
  };

  const getMinTemp = (item: any) => {
    if (activeTab === 'weekly') {
      return Math.round(unit === 'celsius' ? item.day.mintemp_c : item.day.mintemp_f);
    }
    return null;
  };

  const forecastData = getForecastData();

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">
          {getTabTitle()}
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('today')}
            className={`text-sm px-3 py-1 rounded-full cursor-pointer transition-colors ${
              activeTab === 'today' 
                ? 'text-green-400 font-medium bg-green-400/20' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Today
          </button>
          <button 
            onClick={() => setActiveTab('tomorrow')}
            className={`text-sm px-3 py-1 rounded-full cursor-pointer transition-colors ${
              activeTab === 'tomorrow' 
                ? 'text-green-400 font-medium bg-green-400/20' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Tomorrow
          </button>
          <button 
            onClick={() => setActiveTab('weekly')}
            className={`text-sm px-3 py-1 rounded-full cursor-pointer transition-colors ${
              activeTab === 'weekly' 
                ? 'text-green-400 font-medium bg-green-400/20' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Next 7 Days
          </button>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {forecastData.map((item, index) => {
          const condition = getWeatherCondition(item);
          const IconComponent = getWeatherIcon(condition.code, isDay());
          const temp = getTemperature(item);
          const timeLabel = getTimeLabel(item, index);
          const minTemp = getMinTemp(item);
          
          return (
            <div 
              key={getItemKey(item)}
              className="flex flex-col items-center min-w-[80px] py-4 px-3 rounded-xl hover:bg-gray-800/50 transition-colors"
            >
              <div className="text-sm text-gray-400 mb-2">
                {timeLabel}
              </div>
              <IconComponent className="w-8 h-8 text-green-400 mb-2" />
              <div className="text-lg font-medium text-white">
                {temp}°{unit === 'celsius' ? 'C' : 'F'}
              </div>
              {activeTab === 'weekly' && minTemp !== null && (
                <div className="text-xs text-gray-400 mt-1">
                  {minTemp}°
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
