import axios from 'axios';
import { WeatherData } from '@/types/weather';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

class WeatherService {
  async getCurrentWeather(location: string): Promise<WeatherData> {
    try {
      const response = await axios.get(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&days=7&aqi=no&alerts=no`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  async searchLocations(query: string): Promise<Array<{ name: string; country: string; region: string; }>> {
    try {
      const response = await axios.get(
        `${BASE_URL}/search.json?key=${API_KEY}&q=${query}`
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
