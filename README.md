# Weather Widget App

A simple weather widget application that allows users to check the current weather conditions and a 7-day forecast for any city. The app features live weather data, unit conversion (Celsius and Fahrenheit), geolocation-based weather fetching, and a weekly weather chart.

## Features

- 🌍 **City Search**: Enter any city to view the current weather conditions.
- 📍 **Geolocation**: Fetch weather data for your current location.
- 🌡️ **Unit Toggle**: Switch between Celsius (°C) and Fahrenheit (°F).
- 🌞 **Dynamic Background**: The background changes based on the weather description (sunny, rainy, snow, etc.).
- 📊 **Weekly Forecast**: View a 7-day forecast with a temperature chart.
- 🌗 **Dark Mode**: Toggle between dark mode and light mode.
- 📤 **Shareable**: Share the current weather details through supported browsers.

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/Sheikh-Muhammad-Mujtaba/weather-widget-app.git
    
    cd weather-widget-app
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:  
   Create a `.env.local` file in the root of the project and add your Weather API key:
    ```env
    NEXT_PUBLIC_WEATHER_API_KEY=your_weather_api_key
    ```

4. **Run the development server**:
    ```bash
    npm run dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Usage

- Enter the name of a city to fetch the weather information.
- Toggle between Celsius (°C) and Fahrenheit (°F).
- Use the "Fetch Location" button to get weather data based on your current location.
- Toggle "Show Weather Table" to display a 7-day forecast with a temperature chart.
- Share the weather information using the "Share" button.

## Technologies Used

- **React**: UI development.
- **Next.js**: Server-side rendering and routing.
- **Chart.js**: Used to display the temperature data in a line chart.
- **Lucide Icons**: For weather-related icons.
- **WeatherAPI**: Fetching weather data from an external API.

## Deployment

The app is deployed using [Vercel](https://vercel.com/).  
You can view the live deployment here:  
[Weather Widget App](https://weather-widget-app-six.vercel.app/)


### Author

Sheikh Muhammad Mujtaba Javed  
Feel free to reach out on [LinkedIn](https://www.linkedin.com/in/sheikh-m-mujtaba-javed-0362872b9).

