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
  const latitude = 40.7128;   // change this
  const longitude = -74.0060; // change this

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    document.getElementById("temp").textContent =
      data.current_weather.temperature + "°C";
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
}

getWeather();



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
