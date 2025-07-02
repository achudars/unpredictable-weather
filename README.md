# 🌤️ Unpredictable Weather

A modern, responsive weather application built with Next.js, TypeScript, and Tailwind CSS. Get current weather conditions and 7-day forecasts for any location worldwide.

## ✨ Features

- 🔍 **Location Search**: Search for weather by city name
- 🌡️ **Current Weather**: Real-time temperature, feels-like, and conditions
- ⏰ **24-Hour Forecast**: Hourly weather predictions
- 📅 **7-Day Forecast**: Extended weather outlook
- 📊 **Detailed Metrics**: Humidity, wind speed, pressure, visibility, sunrise/sunset
- 🔄 **Unit Toggle**: Switch between Celsius and Fahrenheit
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- 🎨 **Modern UI**: Clean, intuitive interface inspired by modern weather apps

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A free API key from [WeatherAPI.com](https://www.weatherapi.com/)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd unpredictable-weather
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your WeatherAPI key:

   ```env
   NEXT_PUBLIC_WEATHER_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 API Key Setup

1. Visit [WeatherAPI.com](https://www.weatherapi.com/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env.local` file as shown above

The free tier includes:

- 1 million calls per month
- Current weather and forecasts
- Search functionality
- No credit card required

## 🛠️ Built With

- **[Next.js 15](https://nextjs.org/)** - React framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Lucide React](https://lucide.dev/)** - Icons
- **[WeatherAPI](https://www.weatherapi.com/)** - Weather data
- **[Axios](https://axios-http.com/)** - HTTP requests

## 📱 Screenshots

The app features a clean, modern design with:

- Gradient weather cards
- Interactive location search
- Smooth animations and transitions
- Responsive grid layouts
- Intuitive weather icons

## 🎯 Usage

1. **Search for a location** using the search bar
2. **View current weather** with temperature and conditions
3. **Check hourly forecasts** for the next 24 hours
4. **See extended forecasts** for the next 7 days
5. **Toggle temperature units** between °C and °F
6. **Refresh data** with the refresh button

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
