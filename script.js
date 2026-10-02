const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weatherIcon");
const message = document.getElementById("message");

// Search button
searchBtn.addEventListener("click", getWeather);

// Press Enter to search
cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        getWeather();
    }
});

async function getWeather() {
    const city = cityInput.value.trim();

    // Empty input check
    if (city === "") {
        message.textContent = "Please enter a city name.";
        return;
    }

    message.textContent = "Loading...";

    try {
        // STEP 1: Find city
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Geocoding API error");
        }

        const geoData = await geoResponse.json();

        console.log("City Data:", geoData);

        // Check city
        if (!geoData.results || geoData.results.length === 0) {
            message.textContent = "City not found. Try another city.";
            return;
        }

        const location = geoData.results[0];

        // STEP 2: Get weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=kmh`
        );

        if (!weatherResponse.ok) {
            throw new Error("Weather API error");
        }

        const weatherData = await weatherResponse.json();

        console.log("Weather Data:", weatherData);

        const current = weatherData.current;

        // STEP 3: Display city
        cityName.textContent =
            `${location.name}, ${location.country_code}`;

        // Temperature
        temperature.textContent =
            `${Math.round(current.temperature_2m)}°C`;

        // Humidity
        humidity.textContent =
            `${current.relative_humidity_2m}%`;

        // Wind
        wind.textContent =
            `${current.wind_speed_10m} km/h`;

        // Weather description
        weatherDescription.textContent =
            getWeatherDescription(current.weather_code);

        // Weather icon
        weatherIcon.textContent =
            getWeatherIcon(current.weather_code);

        // Clear message
        message.textContent = "";

    } catch (error) {
        console.error("Error:", error);

        message.textContent =
            "Unable to get weather. Please check your internet connection.";
    }
}


// Weather description function
function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear sky";
    }

    if (code === 1 || code === 2 || code === 3) {
        return "Partly cloudy";
    }

    if (code === 45 || code === 48) {
        return "Foggy";
    }

    if (code >= 51 && code <= 57) {
        return "Drizzle";
    }

    if (code >= 61 && code <= 67) {
        return "Rain";
    }

    if (code >= 71 && code <= 77) {
        return "Snow";
    }

    if (code >= 80 && code <= 82) {
        return "Rain showers";
    }

    if (code >= 95) {
        return "Thunderstorm";
    }

    return "Unknown weather";
}


// Weather icon function
function getWeatherIcon(code) {

    if (code === 0) {
        return "☀️";
    }

    if (code === 1 || code === 2 || code === 3) {
        return "🌤️";
    }

    if (code === 45 || code === 48) {
        return "🌫️";
    }

    if (code >= 51 && code <= 67) {
        return "🌧️";
    }

    if (code >= 71 && code <= 77) {
        return "❄️";
    }

    if (code >= 80 && code <= 82) {
        return "🌦️";
    }

    if (code >= 95) {
        return "⛈️";
    }

    return "🌤️";
}