"""Static acceptance checks for the Echo Show dashboard."""
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]

class DashboardTests(unittest.TestCase):
    def read(self, relative):
        return (ROOT / relative).read_text(encoding="utf-8")

    def test_clock_date_and_weather_panel(self):
        html = self.read("index.html")
        css = self.read("styles.css")
        js = self.read("app.js")
        self.assertIn('id="clock"', html)
        self.assertIn('id="date"', html)
        self.assertIn('id="weather-icon"', html)
        self.assertIn('id="weather-name"', html)
        self.assertIn('id="temperature"', html)
        self.assertIn("flex-direction: column", css)
        self.assertIn('getElementById("date")', js)
        self.assertIn('getElementById("weather-name")', js)
        self.assertNotIn("<br", html)

    def test_background_in_repository(self):
        self.assertTrue((ROOT / "assets/bg-1.jpg").is_file())
        self.assertIn('url("./assets/bg-1.jpg")', self.read("styles.css"))

    def test_tokyo_clock_and_weather_failover(self):
        js = self.read("app.js")
        self.assertIn('Asia/Tokyo', js)
        self.assertIn('hourCycle: "h23"', js)
        self.assertIn('api.open-meteo.com', js)
        self.assertIn('weather_code', js)
        self.assertIn('catch (error)', js)
        self.assertIn('setInterval(renderClock', js)

    def test_locally_vendored_keep_silk_open(self):
        self.assertIn('./vendor/keep-silk-open/keep.js', self.read("index.html"))
        self.assertIn('media.mp3', self.read("vendor/keep-silk-open/keep.js"))
        self.assertIn('audio.onended = reload', self.read("vendor/keep-silk-open/keep.js"))
        self.assertIn('DaGammla', self.read("vendor/keep-silk-open/LICENSE"))
        self.assertGreater((ROOT / "vendor/keep-silk-open/media.mp3").stat().st_size, 50)

    def test_no_external_script_or_secrets(self):
        html = self.read("index.html")
        self.assertNotIn('<script src="https:', html)
        self.assertNotIn("password", html.lower())
        self.assertTrue((ROOT / ".gitignore").is_file())

if __name__ == "__main__":
    unittest.main()
