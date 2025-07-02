import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  Cloudy,
  Moon
} from 'lucide-react';

export const getWeatherIcon = (conditionCode: number, isDay: boolean = true) => {
  // Weather condition codes based on WeatherAPI.com
  if (conditionCode === 1000) {
    return isDay ? Sun : Moon;
  } else if ([1003, 1006, 1009].includes(conditionCode)) {
    return Cloud;
  } else if ([1063, 1069, 1072, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246].includes(conditionCode)) {
    return CloudRain;
  } else if ([1066, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264, 1279, 1282].includes(conditionCode)) {
    return CloudSnow;
  } else if ([1087, 1273, 1276].includes(conditionCode)) {
    return CloudLightning;
  } else if ([1030, 1135, 1147].includes(conditionCode)) {
    return Cloudy;
  }
  
  return isDay ? Sun : Moon;
};

export const formatTime = (timeString: string): string => {
  const time = new Date(timeString);
  return time.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: false 
  });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
};

export const getWindDirection = (degrees: string): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  // Convert to number and normalize to 0-360 degrees
  let deg = parseInt(degrees);
  // Handle negative degrees by adding 360 until positive
  while (deg < 0) {
    deg += 360;
  }
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
};

export const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  if (hour < 6) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

export const isDay = (): boolean => {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18;
};
