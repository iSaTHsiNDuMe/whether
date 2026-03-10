module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { lat, lon } = req.query;
    const latitude = Number(lat);
    const longitude = Number(lon);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return res.status(400).json({ error: "Invalid latitude/longitude." });
    }

    async function fetchFromOpenMeteo() {
      const meteoRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
      );

      if (!meteoRes.ok) {
        throw new Error("Failed to fetch Open-Meteo data.");
      }

      const meteoJson = await meteoRes.json();
      const current = meteoJson?.current;

      if (!current) {
        throw new Error("No current weather returned by Open-Meteo.");
      }

      return {
        weather_code: current.weather_code ?? null,
        description: "Weather from Open-Meteo",
        temperature_c: current.temperature_2m ?? null,
        humidity_percent: current.relative_humidity_2m ?? null,
        wind_kmh: current.wind_speed_10m ?? null,
        observed_at: current.time || new Date().toISOString(),
        provider: "Open-Meteo"
      };
    }

    const openWeatherApiKey = process.env.OPENWEATHER_API_KEY;

    if (!openWeatherApiKey) {
      const fallback = await fetchFromOpenMeteo();
      return res.status(200).json(fallback);
    }

    try {
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&appid=${encodeURIComponent(openWeatherApiKey)}&units=metric`
      );

      if (!currentRes.ok) {
        throw new Error("Failed to fetch OpenWeather data.");
      }

      const current = await currentRes.json();

      if (!current || !current.main) {
        throw new Error("No current weather returned by OpenWeather.");
      }

      return res.status(200).json({
        weather_code: current.weather?.[0]?.id ?? null,
        description: current.weather?.[0]?.description || "Unknown weather",
        temperature_c: current.main?.temp ?? null,
        humidity_percent: current.main?.humidity ?? null,
        wind_kmh: current.wind?.speed != null ? Number((current.wind.speed * 3.6).toFixed(1)) : null,
        observed_at: current.dt ? new Date(current.dt * 1000).toISOString() : new Date().toISOString(),
        provider: "OpenWeather"
      });
    } catch (openWeatherError) {
      console.error(openWeatherError);
      const fallback = await fetchFromOpenMeteo();
      return res.status(200).json(fallback);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch weather." });
  }
};
