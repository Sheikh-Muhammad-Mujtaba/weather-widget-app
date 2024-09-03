"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";

// Define the shape of the weather data object
interface WeatherData {
    temperature: number;  // Temperature in Celsius
    description: string;  // Weather description, e.g., "Sunny"
    location: string;     // Location name
    unit: string;         // Unit of temperature, "C" for Celsius
}

export default function WeatherWidget() {
    {/* State to store the user's input location */}
    const [location, setLocation] = useState<string>("");

    {/* State to store the fetched weather data */}
    const [weather, setWeather] = useState<WeatherData | null>(null);

    {/* State to store any error messages */}
    const [error, setError] = useState<string | null>(null);

    {/* State to indicate if data is currently being loaded */}
    const [isLoading, setIsLoading] = useState<boolean>(false);

    {/* Handle the search form submission */}
    const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();  {/* Prevent the default form submission behavior */}
        const trimmedLocation = location.trim();  {/* Remove any whitespace from the input */}

        {/* Check if the input location is empty */}
        if (trimmedLocation === "") {
            setError("Please enter a valid location.");
            setWeather(null);
            return;
        }

        setError(null);  {/* Clear any previous error messages */}
        setIsLoading(true);  {/* Indicate that data is being loaded */}

        try {
            {/* Fetch weather data from the API */}
            const response = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
            );

            {/* Check if the response is not successful */}
            if (!response.ok) {
                throw new Error("City not found");  {/* Throw an error if city is not found */}
            }

            const data = await response.json();  {/* Parse the JSON response */}

            {/* Create a WeatherData object with the fetched data */}
            const WeatherData: WeatherData = {
                temperature: data.current.temp_c,
                description: data.current.condition.text,
                location: data.location.name,
                unit: "C",
            };

            setWeather(WeatherData);  {/* Update the weather state with the fetched data */}
        } catch (error) {
            {/* Handle any errors that occur during the fetch */}
            console.error("Error fetching weather data:", error);
            setError("City not found. Please try again.");  {/* Set an error message */}
            setWeather(null);  {/* Clear the weather data if there is an error */}
        } finally {
            setIsLoading(false);  {/* Indicate that loading has finished */}
        }
    };

    {/* Function to generate a temperature message based on the temperature value and unit */}
    function getTemperatureMessage(temperature: number, unit: string): string {
        if (unit === "C") {
            {/* Provide different messages based on the temperature */}
            if (temperature < 0) {
                return `It's freezing at ${temperature}℃! Bundle up!`;
            } else if (temperature < 10) {
                return `It's quite cold at ${temperature}℃. Wear warm clothes.`;
            } else if (temperature < 20) {
                return `The temperature is ${temperature}℃. Comfortable for a light jacket.`;
            } else if (temperature < 30) {
                return `It's a pleasant ${temperature}℃. Enjoy the nice weather!`;
            } else {
                return `It's hot at ${temperature}℃. Stay hydrated!`;
            }
        } else {
            return `${temperature}°${unit}`;  {/* Return the temperature in the specified unit */}
        }
    }

    {/* Function to generate a message based on the weather description */}
    function getWeatherMessage(description: string): string {
        switch (description.toLowerCase()) {
            case "sunny":
                return "It's a beautiful sunny day!";
            case "partly cloudy":
                return "Expect some clouds and sunshine.";
            case "cloudy":
                return "It's cloudy today.";
            case "overcast":
                return "The sky is overcast.";
            case "rain":
                return "Don't forget your umbrella! It's raining.";
            case "thunderstorm":
                return "Thunderstorms are expected today.";
            case "snow":
                return "Bundle up! It's snowing.";
            case "mist":
                return "It's misty outside.";
            case "fog":
                return "Be careful, there's fog outside.";
            default:
                return description;  {/* Default case to return the description itself */}
        }
    }

    {/* Function to generate a message based on the location and time of day */}
    function getLocationMessage(location: string): string {
        const currentHour = new Date().getHours();  {/* Get the current hour */}
        const isNight = currentHour >= 18 || currentHour < 6;  {/* Determine if it's night */}

        return `${location} ${isNight ? "at Night" : "During the Day"}`;  {/* Return a message based on the time of day */}
    }

    {/* Render the component */}
    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-md mx-auto text-center">
                <CardHeader>
                    <CardTitle>Weather Widget</CardTitle>
                    <CardDescription>
                        Search for the current weather conditions in your city.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Form for searching weather */}
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Enter a city name"
                            value={location}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}  
                        />{/* Update location state on input change */}
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Loading..." : "Search"}  {/* Display "Loading..." if data is being fetched */}
                        </Button>
                    </form>
                    {/* Display error message if any */}
                    {error && <div className="mt-4 text-red-500">{error}</div>}
                    {/* Display weather data if available */}
                    {weather && (
                        <div className="mt-4 grid gap-2">
                            <div className="flex items-center gap-2">
                                <ThermometerIcon className="w-6 h-6" />
                                {getTemperatureMessage(weather.temperature, weather.unit)}  {/* Display temperature message */}
                            </div>
                            <div className="flex items-center gap-2">
                                <CloudIcon className="w-6 h-6" />
                                <div>{getWeatherMessage(weather.description)}</div>  {/* Display weather description message */}
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPinIcon className="w-6 h-6" />
                                <div>{getLocationMessage(weather.location)}</div>  {/* Display location and time of day message */}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
