// Theme toggle
const toggle = document.getElementById('themeToggle');

toggle?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
});

document.getElementById("load").addEventListener("click", () => {
  const quoteElement = document.getElementById("quote");
  quoteElement.textContent = "Loading quote... ✨";

  fetch("https://api.quotable.io/random")
    .then(res => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then(data => {
      quoteElement.textContent = `"${data.content}" — ${data.author}`;
    })
    .catch(error => {
      console.error("Error fetching quote:", error);
      quoteElement.textContent = "Unable to load quote 💔";
    });
});

// --- Get user location and fetch weather from Open-Meteo ---
async function getWeather() {
    if (!navigator.geolocation) {
        alert("Geolocation not supported.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            const weather = data.current_weather;

            updateWeatherUI(weather);
        } catch (error) {
            console.error("Error fetching weather:", error);
        }
    });
}

// --- Convert weathercode to a cute emoji + text ---
function getWeatherDetails(code) {
    const meanings = {
        0: ["☀️", "Clear sky"],
        1: ["🌤️", "Mainly clear"],
        2: ["⛅", "Partly cloudy"],
        3: ["☁️", "Cloudy"],
        45: ["🌫️", "Foggy"],
        48: ["🌫️", "Fog depositing rime"],
        51: ["🌦️", "Light drizzle"],
        61: ["🌧️", "Rain"],
        71: ["❄️", "Snow"],
        95: ["⛈️", "Thunderstorm"]
    };

    return meanings[code] || ["❔", "Unknown"];
}

// --- Update the HTML with cute weather info ---
function updateWeatherUI(weather) {
    const [emoji, text] = getWeatherDetails(weather.weathercode);

    document.getElementById("weather-emoji").textContent = emoji;
    document.getElementById("weather-temp").textContent = `${weather.temperature}°C`;
    document.getElementById("weather-desc").textContent = text;
}

// --- Run on page load ---
window.onload = getWeather;


// Contact form
const form = document.getElementById('contactForm');
const status = document.getElementById('status');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.textContent = 'Sending...';

  try {
    const res = await fetch('https://httpbin.org/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    });

    if (!res.ok) throw new Error();

    status.textContent = 'Message sent!';
    form.reset();
  } catch {
    status.textContent = 'Failed to send.';
  }
});
