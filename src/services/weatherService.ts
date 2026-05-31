import axios from 'axios';
import { WeatherData } from '@/types/weather';
import { demoWeatherData, demoSearchResults } from '@/services/demoData';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

export const isDemoMode = !API_KEY;

class WeatherService {
  async getCurrentWeather(location: string): Promise<WeatherData> {
    if (isDemoMode) {
      return demoWeatherData;
    }
    try {
      const response = await axios.get(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=7&aqi=no&alerts=no`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  async searchLocations(query: string): Promise<Array<{ name: string; country: string; region: string; }>> {
    if (isDemoMode) {
      const q = query.toLowerCase();
      return demoSearchResults.filter(r => r.name.toLowerCase().includes(q));
    }
    try {
      const response = await axios.get(
        `${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error searching locations:', error);
      throw new Error('Failed to search locations');
    }
  }

  getWeatherIconUrl(iconCode: string): string {
    return `https:${iconCode}`;
  }
}

export const weatherService = new WeatherService();
