type GeocodeResponse = {
  results?: Array<{
    latitude?: number;
    longitude?: number;
    country_code?: string;
  }>;
};

type ForecastResponse = {
  timezone?: string;
  utc_offset_seconds?: number;
  current?: {
    temperature_2m?: number;
    weather_code?: number;
  };
};

type Coordinates = {
  lat: number;
  lng: number;
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const fallback = readFallbackCoords(query.lat, query.lng);

  if (!fallback) {
    throw createError({ statusCode: 400, statusMessage: "Missing coordinates" });
  }

  const coords = await resolveCapitalCoords(
    typeof query.capital === "string" ? query.capital : "",
    typeof query.country === "string" ? query.country : "",
    fallback,
  );

  setHeader(event, "Cache-Control", "public, max-age=300, s-maxage=900");

  try {
    const data = await $fetch<ForecastResponse>("https://api.open-meteo.com/v1/forecast", {
      query: {
        latitude: coords.lat,
        longitude: coords.lng,
        current: "temperature_2m,weather_code",
        timezone: "auto",
      },
      timeout: 5000,
    });

    return {
      timezone: data.timezone || "",
      timezoneOffsetSeconds: typeof data.utc_offset_seconds === "number"
        ? data.utc_offset_seconds
        : estimateOffsetSeconds(coords.lng),
      temperature: typeof data.current?.temperature_2m === "number" ? data.current.temperature_2m : null,
      weatherCode: typeof data.current?.weather_code === "number" ? data.current.weather_code : null,
    };
  } catch {
    return {
      timezone: "",
      timezoneOffsetSeconds: estimateOffsetSeconds(coords.lng),
      temperature: null,
      weatherCode: null,
    };
  }
});

function readFallbackCoords(lat: unknown, lng: unknown): Coordinates | null {
  const parsedLat = Number(lat);
  const parsedLng = Number(lng);
  if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) return null;
  return { lat: parsedLat, lng: parsedLng };
}

async function resolveCapitalCoords(capital: string, country: string, fallback: Coordinates) {
  if (!capital) return fallback;

  try {
    const data = await $fetch<GeocodeResponse>("https://geocoding-api.open-meteo.com/v1/search", {
      query: {
        name: capital,
        count: 5,
        language: "en",
        format: "json",
      },
      timeout: 3000,
    });
    const alpha2 = country.toUpperCase();
    const match = data.results?.find((item) => item.country_code?.toUpperCase() === alpha2) || data.results?.[0];
    if (typeof match?.latitude === "number" && typeof match.longitude === "number") {
      return { lat: match.latitude, lng: match.longitude };
    }
  } catch {
    /* Country coordinates are good enough when geocoding is temporarily unavailable. */
  }

  return fallback;
}

function estimateOffsetSeconds(lng: number) {
  const offsetMinutes = Math.round((lng / 15) * 2) * 30;
  return Math.max(-12 * 60, Math.min(14 * 60, offsetMinutes)) * 60;
}
