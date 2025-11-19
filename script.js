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

// -----------------------------
// THEME TOGGLER
// -----------------------------
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// -----------------------------
// WEATHER APP
// -----------------------------

const btn = document.getElementById("checkWeatherBtn");
const input = document.getElementById("cityInput");

// Click event
btn.addEventListener("click", getWeather);

async function getWeather() {
  const city = input.value.trim();
  if (!city) {
    alert("Please type a city 🩷");
    return;
  }

  try {
    // 1️⃣ Convert city → coordinates using Open-Meteo Geocoding API
    const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;

    const geoRes = await fetch(geoURL);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      alert("City not found 💔 Try a different one.");
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2️⃣ Get weather for those coordinates
    const weatherURL =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&current_weather=true`;

    const weatherRes = await fetch(weatherURL);
    const weatherData = await weatherRes.json();

    const weather = weatherData.current_weather;

    // 3️⃣ Update UI
    document.getElementById("cityName").textContent = `${name}, ${country}`;
    document.getElementById("temp").textContent = weather.temperature + "°C";
    document.getElementById("description").textContent =
      "Feels like " + weather.temperature + "°C";
    document.getElementById("details").textContent =
      `Wind: ${weather.windspeed} km/h • Direction: ${weather.winddirection}°`;

    document.getElementById("weatherCard").style.display = "block";

  } catch (error) {
    console.error("Weather error:", error);
    alert("Something went wrong 😭");
  }
}



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
