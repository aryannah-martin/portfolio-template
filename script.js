
const toggle = document.getElementById('themeToggle');

toggle?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
});


const loadBtn = document.getElementById("load");
const quoteElement = document.getElementById("quote");

if (loadBtn && quoteElement) {
  loadBtn.addEventListener("click", () => {
    quoteElement.textContent = "Loading quote... ✨";

    fetch("https://api.quotable.io/random")
      .then(res => res.json())
      .then(data => {
        quoteElement.textContent = `"${data.content}" — ${data.author}`;
      })
      .catch(() => {
        quoteElement.textContent = "Unable to load quote 💔";
      });
  });
}




const weatherBtn = document.getElementById("checkWeatherBtn");
const cityInput = document.getElementById("cityInput");

if (weatherBtn && cityInput) {
  weatherBtn.addEventListener("click", getWeather);
}

async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    alert("Please type a city 🩷");
    return;
  }

  try {
    // 1️⃣ Get city coordinates
    const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city
    )}&count=1`;

    const geoRes = await fetch(geoURL);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      alert("City not found 💔 Try again.");
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2️⃣ Get weather
    const weatherURL = 
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}` +
      `&longitude=${longitude}&current_weather=true`;

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

  } catch (err) {
    console.error("Weather error:", err);
    alert("Something went wrong 😭");
  }
}




const contactForm = document.getElementById("contactForm");
const statusBox = document.getElementById("status");

if (contactForm && statusBox) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusBox.textContent = "Sending...";

    try {
      const res = await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
      });

      if (!res.ok) throw new Error();

      statusBox.textContent = "Message sent!";
      contactForm.reset();
    } catch {
      statusBox.textContent = "Failed to send.";
    }
  });
}
