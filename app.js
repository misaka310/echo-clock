/* Echo Show 11 dashboard; no accounts, no tracking. */
(() => {
  "use strict";
  const TOKYO = "Asia/Tokyo";
  const WEATHER_URL = "https://api.open-meteo.com/v1/forecast?latitude=35.6762&longitude=139.6503&current=temperature_2m,weather_code,is_day&timezone=Asia%2FTokyo";
  const WEATHER_REFRESH_MS = 15 * 60 * 1000;
  const CLOCK_REFRESH_MS = 1000;
  const BACKGROUNDS = {
    "1": "./assets/bg-1.jpg",
    "2": "./assets/bg-2.jpg",
    "3": "./assets/bg-3.jpg",
    "4": "./assets/bg-4.jpg",
    mountain: "./assets/bg-1.jpg",
    ocean: "./assets/bg-2.jpg",
    forest: "./assets/bg-3.jpg",
    gradient: "./assets/bg-4.jpg"
  };
  const bgParam = new URLSearchParams(location.search).get("bg");
  if (bgParam && BACKGROUNDS[bgParam]) {
    document.querySelector(".background").style.backgroundImage = `url("${BACKGROUNDS[bgParam]}")`;
  }

  const timeEl = document.getElementById("clock");
  const dateEl = document.getElementById("date");
  const weatherEl = document.getElementById("weather-line");
  const iconEl = document.getElementById("weather-icon");
  const nameEl = document.getElementById("weather-name");
  const tempEl = document.getElementById("temperature");

  const clockFormat = new Intl.DateTimeFormat("ja-JP", {
    timeZone: TOKYO, hour: "2-digit", minute: "2-digit",
    hour12: false, hourCycle: "h23"
  });
  const dateFormat = new Intl.DateTimeFormat("ja-JP", {
    timeZone: TOKYO, year: "numeric", month: "long", day: "numeric", weekday: "long"
  });
  const panelDateFormat = new Intl.DateTimeFormat("ja-JP", {
    timeZone: TOKYO, month: "long", day: "numeric", weekday: "short"
  });
  function renderClock() {
    const now = new Date();
    timeEl.textContent = clockFormat.format(now).replace(/^24:/, "00:");
    timeEl.setAttribute("datetime", now.toISOString());
    timeEl.title = dateFormat.format(now);
    dateEl.textContent = panelDateFormat.format(now);
  }

  function weatherAppearance(code, isDay) {
    if (code === 0) return { icon: isDay ? "☀️" : "🌙", name: "快晴" };
    if (code === 1 || code === 2) return { icon: isDay ? "🌤️" : "☁️", name: "晴れ時々曇り" };
    if (code === 3) return { icon: "☁️", name: "曇り" };
    if (code === 45 || code === 48) return { icon: "🌫️", name: "霧" };
    if ([51, 53, 55, 56, 57].includes(code)) return { icon: "🌦️", name: "霧雨" };
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { icon: "🌧️", name: "雨" };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: "❄️", name: "雪" };
    if ([95, 96, 99].includes(code)) return { icon: "⛈️", name: "雷雨" };
    return { icon: "☁️", name: "天気不明" };
  }

  async function refreshWeather() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);
      let response;
      try {
        response = await fetch(WEATHER_URL, { cache: "no-store", signal: controller.signal });
      } finally { clearTimeout(timeoutId); }
      if (!response.ok) throw new Error("HTTP " + response.status);
      const data = await response.json();
      const current = data && data.current;
      if (!current || !Number.isFinite(current.temperature_2m) || !Number.isFinite(current.weather_code)) {
        throw new Error("Unexpected weather data");
      }
      const appearance = weatherAppearance(current.weather_code, current.is_day === 1);
      iconEl.textContent = appearance.icon;
      nameEl.textContent = appearance.name;
      tempEl.textContent = Math.round(current.temperature_2m) + "°C";
      weatherEl.title = "東京の現在の天気: " + appearance.name + "（Open-Meteo）";
      weatherEl.setAttribute("aria-label", "東京 " + appearance.name + " " + tempEl.textContent);
    } catch (error) {
      // Preserve the previous reading, but show a clear unavailable state on first load.
      weatherEl.title = "天気情報を取得できません。自動で再試行します";
      if (tempEl.textContent === "--°C") iconEl.textContent = "—";
    }
  }

  renderClock();
  refreshWeather();
  setInterval(renderClock, CLOCK_REFRESH_MS);
  setInterval(refreshWeather, WEATHER_REFRESH_MS);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) { renderClock(); refreshWeather(); }
  });
})();
