import WeatherWidget from "@/components/weather-widget";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-8">
      {/* Add padding to the top of the container for space before the heading */}
      <div className="pt-8">
        {/* Heading with margin-bottom for spacing */}
        <h1 className="text-3xl font-bold mb-8">Your Weather App</h1>
      </div>
      {/* Widget with additional margin-top for spacing */}
      <div className="mt-8">
        <WeatherWidget />
      </div>
    </div>
  );
}
