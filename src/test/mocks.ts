import { WeatherData } from '@/types/weather'

export const mockWeatherData: WeatherData = {
  location: {
    name: 'London',
    country: 'United Kingdom'
  },
  current: {
    temp_c: 15.0,
    temp_f: 59.0,
    feelslike_c: 14.0,
    feelslike_f: 57.2,
    condition: {
      text: 'Partly cloudy',
      icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
      code: 1003
    },
    wind_kph: 13.0,
    wind_dir: 'SW',
    pressure_mb: 1015.0,
    humidity: 65,
    vis_km: 10.0,
    uv: 3.0
  },
  forecast: {
    forecastday: [
      {
        date: '2023-11-05',
        date_epoch: 1699142400,
        day: {
          maxtemp_c: 18.0,
          maxtemp_f: 64.4,
          mintemp_c: 10.0,
          mintemp_f: 50.0,
          avgtemp_c: 14.0,
          avgtemp_f: 57.2,
          condition: {
            text: 'Partly cloudy',
            icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
            code: 1003
          },
          maxwind_kph: 20.1,
          totalprecip_mm: 0.0,
          avgvis_km: 10.0,
          avghumidity: 65.0,
          daily_will_it_rain: 0,
          daily_chance_of_rain: 10,
          daily_will_it_snow: 0,
          daily_chance_of_snow: 0,
          uv: 3.0
        },
        astro: {
          sunrise: '07:14 AM',
          sunset: '04:26 PM',
          moonrise: '09:45 PM',
          moonset: '02:15 PM',
          moon_phase: 'Waning Crescent',
          moon_illumination: '15'
        },
        hour: [
          {
            time_epoch: 1699200000,
            time: '2023-11-05 14:00',
            temp_c: 15.0,
            temp_f: 59.0,
            condition: {
              text: 'Partly cloudy',
              icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
              code: 1003
            },
            wind_kph: 13.0,
            wind_dir: 'SW',
            pressure_mb: 1015.0,
            precip_mm: 0.0,
            humidity: 65,
            cloud: 50,
            feelslike_c: 14.0,
            feelslike_f: 57.2,
            windchill_c: 14.0,
            windchill_f: 57.2,
            heatindex_c: 15.0,
            heatindex_f: 59.0,
            dewpoint_c: 8.0,
            dewpoint_f: 46.4,
            will_it_rain: 0,
            chance_of_rain: 10,
            will_it_snow: 0,
            chance_of_snow: 0,
            vis_km: 10.0,
            gust_kph: 20.2,
            uv: 3.0
          },
          {
            time_epoch: 1699203600,
            time: '2023-11-05 15:00',
            temp_c: 16.0,
            temp_f: 60.8,
            condition: {
              text: 'Sunny',
              icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
              code: 1000
            },
            wind_kph: 12.1,
            wind_dir: 'SW',
            pressure_mb: 1016.0,
            precip_mm: 0.0,
            humidity: 60,
            cloud: 25,
            feelslike_c: 15.5,
            feelslike_f: 59.9,
            windchill_c: 15.5,
            windchill_f: 59.9,
            heatindex_c: 16.0,
            heatindex_f: 60.8,
            dewpoint_c: 7.5,
            dewpoint_f: 45.5,
            will_it_rain: 0,
            chance_of_rain: 5,
            will_it_snow: 0,
            chance_of_snow: 0,
            vis_km: 10.0,
            gust_kph: 17.7,
            uv: 2.0
          }
        ]
      },
      {
        date: '2023-11-06',
        date_epoch: 1699228800,
        day: {
          maxtemp_c: 20.0,
          maxtemp_f: 68.0,
          mintemp_c: 12.0,
          mintemp_f: 53.6,
          avgtemp_c: 16.0,
          avgtemp_f: 60.8,
          condition: {
            text: 'Sunny',
            icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
            code: 1000
          },
          maxwind_kph: 16.1,
          totalprecip_mm: 0.0,
          avgvis_km: 10.0,
          avghumidity: 60.0,
          daily_will_it_rain: 0,
          daily_chance_of_rain: 5,
          daily_will_it_snow: 0,
          daily_chance_of_snow: 0,
          uv: 4.0
        },
        astro: {
          sunrise: '07:15 AM',
          sunset: '04:25 PM',
          moonrise: '10:30 PM',
          moonset: '03:00 PM',
          moon_phase: 'Waning Crescent',
          moon_illumination: '10'
        },
        hour: []
      }
    ]
  }
}

export const mockGeolocationData = {
  coords: {
    latitude: 51.5074,
    longitude: -0.1278,
    accuracy: 100,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null
  },
  timestamp: Date.now()
}
