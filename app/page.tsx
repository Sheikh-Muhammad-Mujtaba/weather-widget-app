import WeatherWidget from "@/components/weather-widget";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8 sm:p-6 md:p-8">
  <h1 className="text-2xl md:text-3xl font-bold mt-8">Your Weather App</h1>
  <div className="flex flex-col items-center w-full max-w-md mx-auto p-4 space-y-8">
    <WeatherWidget />
  </div>
</div>

  );
}
