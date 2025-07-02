import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  Cloudy,
  Moon
} from 'lucide-react'
import {
  getWeatherIcon,
  formatTime,
  formatDate,
  getWindDirection,
  getTimeOfDay,
  isDay
} from '../weatherUtils'

describe('weatherUtils', () => {
  describe('getWeatherIcon', () => {
    it('should return Sun icon for clear day (1000)', () => {
      expect(getWeatherIcon(1000, true)).toBe(Sun)
    })

    it('should return Moon icon for clear night (1000)', () => {
      expect(getWeatherIcon(1000, false)).toBe(Moon)
    })

    it('should return Cloud icon for partly cloudy conditions', () => {
      expect(getWeatherIcon(1003, true)).toBe(Cloud)
      expect(getWeatherIcon(1006, true)).toBe(Cloud)
      expect(getWeatherIcon(1009, true)).toBe(Cloud)
    })

    it('should return CloudRain icon for rainy conditions', () => {
      const rainyCodes = [1063, 1069, 1072, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246]
      rainyCodes.forEach(code => {
        expect(getWeatherIcon(code, true)).toBe(CloudRain)
      })
    })

    it('should return CloudSnow icon for snowy conditions', () => {
      const snowyCodes = [1066, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264, 1279, 1282]
      snowyCodes.forEach(code => {
        expect(getWeatherIcon(code, true)).toBe(CloudSnow)
      })
    })

    it('should return CloudLightning icon for thunderstorm conditions', () => {
      const thunderCodes = [1087, 1273, 1276]
      thunderCodes.forEach(code => {
        expect(getWeatherIcon(code, true)).toBe(CloudLightning)
      })
    })

    it('should return Cloudy icon for foggy/misty conditions', () => {
      const foggyCodes = [1030, 1135, 1147]
      foggyCodes.forEach(code => {
        expect(getWeatherIcon(code, true)).toBe(Cloudy)
      })
    })

    it('should return default Sun icon for unknown condition during day', () => {
      expect(getWeatherIcon(9999, true)).toBe(Sun)
    })

    it('should return default Moon icon for unknown condition during night', () => {
      expect(getWeatherIcon(9999, false)).toBe(Moon)
    })

    it('should default to day=true when isDay parameter is not provided', () => {
      expect(getWeatherIcon(1000)).toBe(Sun)
    })
  })

  describe('formatTime', () => {
    it('should format time in 24-hour format', () => {
      expect(formatTime('2023-12-01T14:30:00')).toBe('14:30')
      expect(formatTime('2023-12-01T09:05:00')).toBe('09:05')
      expect(formatTime('2023-12-01T23:59:00')).toBe('23:59')
      expect(formatTime('2023-12-01T00:00:00')).toBe('00:00')
    })

    it('should handle different date string formats', () => {
      expect(formatTime('2023-12-01 14:30:00')).toBe('14:30')
      expect(formatTime('December 1, 2023 2:30:00 PM')).toBe('14:30')
    })
  })

  describe('formatDate', () => {
    beforeEach(() => {
      // Mock the current date to December 1, 2023
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2023-12-01T12:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should return "Today" for today\'s date', () => {
      expect(formatDate('2023-12-01')).toBe('Today')
      expect(formatDate('2023-12-01T15:30:00')).toBe('Today')
    })

    it('should return "Tomorrow" for tomorrow\'s date', () => {
      expect(formatDate('2023-12-02')).toBe('Tomorrow')
      expect(formatDate('2023-12-02T10:00:00')).toBe('Tomorrow')
    })

    it('should return formatted date for other dates', () => {
      expect(formatDate('2023-12-03')).toBe('Sun, Dec 3')
      expect(formatDate('2023-11-30')).toBe('Thu, Nov 30')
      expect(formatDate('2023-12-10')).toBe('Sun, Dec 10')
    })
  })

  describe('getWindDirection', () => {
    it('should return correct cardinal directions', () => {
      expect(getWindDirection('0')).toBe('N')
      expect(getWindDirection('90')).toBe('E')
      expect(getWindDirection('180')).toBe('S')
      expect(getWindDirection('270')).toBe('W')
    })

    it('should return correct intermediate directions', () => {
      expect(getWindDirection('45')).toBe('NE')
      expect(getWindDirection('135')).toBe('SE')
      expect(getWindDirection('225')).toBe('SW')
      expect(getWindDirection('315')).toBe('NW')
    })

    it('should handle edge cases and rounding', () => {
      expect(getWindDirection('11')).toBe('N') // Should round to N
      expect(getWindDirection('12')).toBe('NNE') // Should round to NNE
      expect(getWindDirection('360')).toBe('N') // 360 degrees = 0 degrees
      expect(getWindDirection('361')).toBe('N') // Should wrap around
    })

    it('should handle decimal degrees', () => {
      expect(getWindDirection('22.5')).toBe('NNE')
      expect(getWindDirection('67.5')).toBe('ENE')
      expect(getWindDirection('112.5')).toBe('ESE')
    })

    it('should handle negative degrees by converting to equivalent positive direction', () => {
      expect(getWindDirection('-45')).toBe('NW') // -45 degrees should be equivalent to 315 degrees (NW)
      expect(getWindDirection('-90')).toBe('W')  // -90 degrees should be equivalent to 270 degrees (W)
      expect(getWindDirection('-180')).toBe('S') // -180 degrees should be equivalent to 180 degrees (S)
    })
  })

  describe('getTimeOfDay', () => {
    afterEach(() => {
      vi.useRealTimers()
    })

    it('should return "night" for early morning hours (0-5)', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2023-12-01T02:00:00'))
      expect(getTimeOfDay()).toBe('night')

      vi.setSystemTime(new Date('2023-12-01T05:59:00'))
      expect(getTimeOfDay()).toBe('night')
    })

    it('should return "morning" for morning hours (6-11)', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2023-12-01T06:00:00'))
      expect(getTimeOfDay()).toBe('morning')

      vi.setSystemTime(new Date('2023-12-01T11:59:00'))
      expect(getTimeOfDay()).toBe('morning')
    })

    it('should return "afternoon" for afternoon hours (12-17)', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2023-12-01T12:00:00'))
      expect(getTimeOfDay()).toBe('afternoon')

      vi.setSystemTime(new Date('2023-12-01T17:59:00'))
      expect(getTimeOfDay()).toBe('afternoon')
    })

    it('should return "evening" for evening hours (18-23)', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2023-12-01T18:00:00'))
      expect(getTimeOfDay()).toBe('evening')

      vi.setSystemTime(new Date('2023-12-01T23:59:00'))
      expect(getTimeOfDay()).toBe('evening')
    })
  })

  describe('isDay', () => {
    afterEach(() => {
      vi.useRealTimers()
    })

    it('should return false for night hours (0-5 and 18-23)', () => {
      vi.useFakeTimers()
      
      // Early morning
      vi.setSystemTime(new Date('2023-12-01T02:00:00'))
      expect(isDay()).toBe(false)

      vi.setSystemTime(new Date('2023-12-01T05:59:00'))
      expect(isDay()).toBe(false)

      // Evening
      vi.setSystemTime(new Date('2023-12-01T18:00:00'))
      expect(isDay()).toBe(false)

      vi.setSystemTime(new Date('2023-12-01T23:00:00'))
      expect(isDay()).toBe(false)
    })

    it('should return true for day hours (6-17)', () => {
      vi.useFakeTimers()
      
      // Morning
      vi.setSystemTime(new Date('2023-12-01T06:00:00'))
      expect(isDay()).toBe(true)

      // Afternoon
      vi.setSystemTime(new Date('2023-12-01T12:00:00'))
      expect(isDay()).toBe(true)

      // Late afternoon
      vi.setSystemTime(new Date('2023-12-01T17:59:00'))
      expect(isDay()).toBe(true)
    })

    it('should handle boundary cases correctly', () => {
      vi.useFakeTimers()
      
      // Just before day starts
      vi.setSystemTime(new Date('2023-12-01T05:59:59'))
      expect(isDay()).toBe(false)

      // Day starts
      vi.setSystemTime(new Date('2023-12-01T06:00:00'))
      expect(isDay()).toBe(true)

      // Day ends
      vi.setSystemTime(new Date('2023-12-01T17:59:59'))
      expect(isDay()).toBe(true)

      // Night starts
      vi.setSystemTime(new Date('2023-12-01T18:00:00'))
      expect(isDay()).toBe(false)
    })
  })
})
