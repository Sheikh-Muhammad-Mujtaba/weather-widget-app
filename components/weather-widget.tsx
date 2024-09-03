"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon, SearchIcon, Share2Icon } from "lucide-react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, Tooltip, Legend, CategoryScale, LinearScale);

interface WeatherData {
    temperature: number;
    description: string;
    location: string;
    unit: string;
}

interface WeeklyWeatherData {
    date: string;
    temperature: number;
}

export default function WeatherWidget() {
    const [location, setLocation] = useState<string>("");
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [unit, setUnit] = useState<string>("C");
    const [showTable, setShowTable] = useState<boolean>(false);
    const [weeklyWeather, setWeeklyWeather] = useState<WeeklyWeatherData[]>([]);

    useEffect(() => {
        fetchWeatherForCurrentLocation();
    }, []);

    const fetchWeather = async (query: string, isCoords = false) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${query}&units=${unit}`);
            if (!response.ok) throw new Error("City not found");
            const data = await response.json();
            setWeather({
                temperature: data.current.temp_c,
                description: data.current.condition.text,
                location: data.location.name,
                unit: "C",
            });
            fetchWeeklyWeather(data.location.name);
        } catch (error) {
            setError("Unable to fetch weather data. Please try again.");
            setWeather(null);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchWeeklyWeather = async (location: string) => {
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${location}&days=7`);
            if (!response.ok) throw new Error("Unable to fetch weekly weather");
            const data = await response.json();
            setWeeklyWeather(data.forecast.forecastday.map((day: any) => ({
                date: day.date,
                temperature: day.day.avgtemp_c,
            })));
        } catch (error) {
            setWeeklyWeather([]);
        }
    };

    const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (location.trim() === "") {
            setError("Please enter a valid location.");
            return;
        }
        fetchWeather(location.trim());
    };

    const toggleUnit = () => {
        if (weather) {
            const newUnit = unit === "C" ? "F" : "C";
            setUnit(newUnit);
            setWeather(prevWeather => {
                const currentTemperature = prevWeather!.temperature;
                const convertedTemperature = newUnit === "C"
                    ? Math.floor((currentTemperature - 32) * 5 / 9)
                    : Math.floor((currentTemperature * 9) / 5 + 32);
                    
                return {
                    ...prevWeather!,
                    temperature: convertedTemperature,
                    unit: newUnit,
                };
            });
        }
    };
    

    const getBackgroundClass = (description: string) => {
        switch (description.toLowerCase()) {
            case "sunny":
                return "bg-yellow-100";
            case "rain":
            case "thunderstorm":
                return "bg-blue-200";
            case "snow":
                return "bg-gray-100";
            default:
                return "bg-gray-200";
        }
    };

    const shareWeather = () => {
        if (weather && navigator.share) {
            navigator.share({
                title: "Weather Update",
                text: `The current weather in ${weather.location} is ${weather.temperature}°${weather.unit} with ${weather.description}.`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            alert("Sharing is not supported on this browser.");
        }
    };

    const fetchWeatherForCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => fetchWeather(`${position.coords.latitude},${position.coords.longitude}`, true),
                () => setError("Unable to fetch location. Please enter a city.")
            );
        }
    };

    const chartData = {
        labels: weeklyWeather.map(day => day.date),
        datasets: [{
            label: `Temperature (°${unit})`,
            data: weeklyWeather.map(day => day.temperature),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
        }],
    };

    const getTemperatureMessage = (temperature: number, unit: string): string => {
        if (unit === "C") {
            if (temperature < 0) return `It's freezing at ${temperature}°C! Bundle up!`;
            if (temperature < 10) return `It's quite cold at ${temperature}°C. Wear warm clothes.`;
            if (temperature < 20) return `The temperature is ${temperature}°C. Comfortable for a light jacket.`;
            if (temperature < 30) return `It's a pleasant ${temperature}°C. Enjoy the nice weather!`;
            return `It's hot at ${temperature}°C. Stay hydrated!`;
        } else if (unit === "F") {
            if (temperature < 32) return `It's freezing at ${temperature}°F! Bundle up!`;
            if (temperature < 50) return `It's quite cold at ${temperature}°F. Wear warm clothes.`;
            if (temperature < 68) return `The temperature is ${temperature}°F. Comfortable for a light jacket.`;
            if (temperature < 86) return `It's a pleasant ${temperature}°F. Enjoy the nice weather!`;
            return `It's hot at ${temperature}°F. Stay hydrated!`;
        }
        return `${temperature}°${unit}`;
    };
    

    const getWeatherMessage = (description: string): string => {
        switch (description.toLowerCase()) {
            case "sunny": return "It's a beautiful sunny day!";
            case "partly cloudy": return "Expect some clouds and sunshine.";
            case "cloudy": return "It's cloudy today.";
            case "overcast": return "The sky is overcast.";
            case "rain": return "Don't forget your umbrella! It's raining.";
            case "thunderstorm": return "Thunderstorms are expected today.";
            case "snow": return "Bundle up! It's snowing.";
            case "mist": return "It's misty outside.";
            case "fog": return "Be careful, there's fog outside.";
            default: return description;
        }
    };

    const getLocationMessage = (location: string): string => {
        const currentHour = new Date().getHours();
        const isNight = currentHour >= 18 || currentHour < 6;
        return `${location} ${isNight ? "at Night" : "During the Day"}`;
    };

    return (
        <div className={`${isDarkMode ? "bg-black text-white" : "bg-white text-black"} flex justify-center items-start mt-10 h-screen`}>
            <Card className={`w-full max-w-md mx-auto text-center flex flex-col items-center ${weather ? getBackgroundClass(weather.description) : ""}`}>
                <CardHeader>
                    <CardTitle>Weather Widget</CardTitle>
                    <CardDescription>
                        Search for the current weather conditions in your city.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleSearch} className="flex flex-col items-center w-full max-w-md mx-auto gap-4">
                        <div className="flex gap-2 mt-4">
                            <input
                                type="text"
                                placeholder="Enter a city name"
                                value={location}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                                className="p-2 border rounded"
                                aria-label="City name"
                            />
                            <Button type="submit" disabled={isLoading} className="flex gap-2">
                                <SearchIcon className="w-4 h-4" />
                                <span>Search</span>
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" onClick={fetchWeatherForCurrentLocation} className="flex items-center gap-2">
                                Fetch Location
                            </Button>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <select
                                value={unit}
                                onChange={() => toggleUnit()}
                                className="p-2 border rounded"
                            >
                                <option value="C">℃</option>
                                <option value="F">℉</option>
                            </select>
                            <select
                                value={isDarkMode ? "dark" : "light"}
                                onChange={(e) => setIsDarkMode(e.target.value === "dark")}
                                className="p-2 border rounded"
                            >
                                <option value="light">Light Mode</option>
                                <option value="dark">Dark Mode</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <input
                                type="checkbox"
                                id="showTable"
                                checked={showTable}
                                onChange={(e) => setShowTable(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <label htmlFor="showTable" className="cursor-pointer">Show Weather Table</label>
                        </div>
                        {isLoading && <p>Loading...</p>}
                        {error && <p className="text-red-500">{error}</p>}
                        {weather && (
                            <div className="mt-4">
                                <div className="flex items-center gap-2">
                                <MapPinIcon className="w-6 h-6 " />
                                <div></div><h2 className="text-2xl">{getLocationMessage(weather.location)}</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                <ThermometerIcon className="w-6 h-6" />
                                <div><p className="text-center">{getTemperatureMessage(weather.temperature, unit)}</p></div>
                                </div>
                                <div className="flex items-center gap-2">
                                <CloudIcon className="w-6 h-6 " />
                                <div><p>{getWeatherMessage(weather.description)}</p></div>
                                </div>
                                <Button type="button" onClick={shareWeather} className="mt-4">
                                    <Share2Icon className="w-4 h-4" />
                                    <span>Share</span>
                                </Button>
                                {showTable && weeklyWeather.length > 0 && (
                                    <div className="mt-4">
                                        <Line data={chartData} />
                                    </div>
                                )}
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
