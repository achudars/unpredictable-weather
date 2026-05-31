import { WeatherData } from '@/types/weather';

function toF(c: number) {
  return Math.round((c * 9) / 5 + 32 * 10) / 10;
}

const CONDITIONS = [
  { text: 'Sunny',        icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',   code: 1000 },
  { text: 'Partly cloudy',icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',   code: 1003 },
  { text: 'Cloudy',       icon: '//cdn.weatherapi.com/weather/64x64/day/119.png',   code: 1006 },
  { text: 'Light rain',   icon: '//cdn.weatherapi.com/weather/64x64/day/296.png',   code: 1183 },
  { text: 'Overcast',     icon: '//cdn.weatherapi.com/weather/64x64/day/122.png',   code: 1009 },
  { text: 'Clear',        icon: '//cdn.weatherapi.com/weather/64x64/night/113.png', code: 1000 },
  { text: 'Patchy rain',  icon: '//cdn.weatherapi.com/weather/64x64/day/293.png',   code: 1180 },
];

const DAY_CONDITIONS = [
  { cond: CONDITIONS[0], maxC: 22, minC: 14, wind: 10, humidity: 55, uv: 6 },
  { cond: CONDITIONS[1], maxC: 19, minC: 12, wind: 15, humidity: 65, uv: 4 },
  { cond: CONDITIONS[3], maxC: 16, minC: 11, wind: 20, humidity: 80, uv: 2 },
  { cond: CONDITIONS[2], maxC: 17, minC: 13, wind: 18, humidity: 75, uv: 3 },
  { cond: CONDITIONS[0], maxC: 24, minC: 15, wind: 8,  humidity: 50, uv: 7 },
  { cond: CONDITIONS[4], maxC: 18, minC: 12, wind: 12, humidity: 70, uv: 2 },
  { cond: CONDITIONS[6], maxC: 20, minC: 14, wind: 14, humidity: 68, uv: 3 },
];

type DayCond = typeof DAY_CONDITIONS[0];

function buildHours(now: Date, dayOffset: number, maxC: number, minC: number, dayCond: DayCond) {
  const base = new Date(now);
  base.setDate(base.getDate() + dayOffset);
  base.setHours(0, 0, 0, 0);

  return Array.from({ length: 24 }, (_, h) => {
    const progress = Math.sin(((h - 4) / 24) * Math.PI);
    const temp_c = Math.round((minC + (maxC - minC) * Math.max(0, progress)) * 10) / 10;
    const feelslike_c = Math.round((temp_c - 1.5) * 10) / 10;
    const epochMs = base.getTime() + h * 3600 * 1000;
    const timeStr = `${base.toISOString().slice(0, 10)} ${String(h).padStart(2, '0')}:00`;
    const isRainy = dayCond.cond.code >= 1180;

    return {
      time_epoch: Math.floor(epochMs / 1000),
      time: timeStr,
      temp_c,
      temp_f: toF(temp_c),
      condition: h >= 6 && h < 20 ? dayCond.cond : CONDITIONS[5],
      wind_kph: dayCond.wind + (h % 3),
      wind_dir: 'SW',
      pressure_mb: 1013,
      precip_mm: isRainy && h >= 10 && h < 16 ? 0.5 : 0,
      humidity: dayCond.humidity,
      cloud: dayCond.humidity - 10,
      feelslike_c,
      feelslike_f: toF(feelslike_c),
      windchill_c: feelslike_c,
      windchill_f: toF(feelslike_c),
      heatindex_c: temp_c,
      heatindex_f: toF(temp_c),
      dewpoint_c: Math.round((temp_c - 5) * 10) / 10,
      dewpoint_f: toF(temp_c - 5),
      will_it_rain: isRainy ? 1 : 0,
      chance_of_rain: isRainy ? 60 : 10,
      will_it_snow: 0,
      chance_of_snow: 0,
      vis_km: isRainy ? 7 : 10,
      gust_kph: dayCond.wind + 8,
      uv: h >= 10 && h < 16 ? dayCond.uv : 0,
    };
  });
}

function buildDemoData(): WeatherData {
  const now = new Date();

  const forecastday = DAY_CONDITIONS.map((dc, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const avgC = Math.round(((dc.maxC + dc.minC) / 2) * 10) / 10;

    return {
      date: dateStr,
      date_epoch: Math.floor(d.getTime() / 1000),
      day: {
        maxtemp_c: dc.maxC,
        maxtemp_f: toF(dc.maxC),
        mintemp_c: dc.minC,
        mintemp_f: toF(dc.minC),
        avgtemp_c: avgC,
        avgtemp_f: toF(avgC),
        condition: dc.cond,
        maxwind_kph: dc.wind + 5,
        totalprecip_mm: dc.cond.code >= 1180 ? 3.2 : 0,
        avgvis_km: dc.cond.code >= 1180 ? 7 : 10,
        avghumidity: dc.humidity,
        daily_will_it_rain: dc.cond.code >= 1180 ? 1 : 0,
        daily_chance_of_rain: dc.cond.code >= 1180 ? 65 : 10,
        daily_will_it_snow: 0,
        daily_chance_of_snow: 0,
        uv: dc.uv,
      },
      astro: {
        sunrise: '06:02 AM',
        sunset: '08:47 PM',
        moonrise: '09:15 PM',
        moonset: '05:30 AM',
        moon_phase: 'Waxing Gibbous',
        moon_illumination: '72',
      },
      hour: buildHours(now, i, dc.maxC, dc.minC, dc),
    };
  });

  const todayDc = DAY_CONDITIONS[0];
  const currentHour = now.getHours();
  const currentHourData = forecastday[0].hour[currentHour];

  return {
    location: { name: 'Demo City', country: 'Demo Mode' },
    current: {
      temp_c: currentHourData.temp_c,
      temp_f: currentHourData.temp_f,
      feelslike_c: currentHourData.feelslike_c,
      feelslike_f: currentHourData.feelslike_f,
      condition: currentHourData.condition,
      wind_kph: todayDc.wind,
      wind_dir: 'SW',
      pressure_mb: 1013,
      humidity: todayDc.humidity,
      vis_km: 10,
      uv: todayDc.uv,
    },
    forecast: { forecastday },
  };
}

export const demoWeatherData: WeatherData = buildDemoData();

export const demoSearchResults = [
  { name: 'London', country: 'United Kingdom', region: 'City of London, Greater London' },
  { name: 'New York', country: 'United States of America', region: 'New York' },
  { name: 'Tokyo', country: 'Japan', region: 'Tokyo' },
  { name: 'Paris', country: 'France', region: 'Ile-de-France' },
  { name: 'Sydney', country: 'Australia', region: 'New South Wales' },
];
