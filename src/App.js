import React, { useState } from 'react';
import './index.css';

const api = {
  key: "d06691d9ef0481cb18adad7a5d0a8c46",
  base: "https://api.openweathermap.org/data/2.5/"
};

const weatherIcons = {
  'Clear': '☀️',
  'Clouds': '☁️',
  'Rain': '🌧️',
  'Drizzle': '🌦️',
  'Thunderstorm': '⛈️',
  'Snow': '❄️',
  'Mist': '🌫️',
  'Fog': '🌫️',
  'Haze': '🌫️',
  'Dust': '🌪️',
  'Sand': '🌪️',
  'Tornado': '🌪️'
};

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = evt => {
    if (evt.key === "Enter" && query.trim()) {
      setLoading(true);
      setError('');
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setLoading(false);
          if (result.cod === 200) {
            setWeather(result);
          } else {
            setError('City not found. Please try again.');
            setWeather({});
          }
          setQuery('');
        })
        .catch(() => {
          setLoading(false);
          setError('Connection error. Check your network.');
        });
    }
  };

  const dateBuilder = (d) => {
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const getAppClass = () => {
    if (typeof weather.main === 'undefined') return 'app app-default';
    const temp = weather.main.temp;
    if (temp < 0)  return 'app app-freezing';
    if (temp < 15) return 'app app-cold';
    if (temp < 25) return 'app app-warm';
    return 'app app-hot';
  };

  const hasWeather = typeof weather.main !== 'undefined';

  return (
    <div className={getAppClass()}>
      <main>
        <div className="search-container">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-bar"
              placeholder="Search city..."
              onChange={e => setQuery(e.target.value)}
              value={query}
              onKeyPress={search}
            />
          </div>
          {error && <div className="error-msg">{error}</div>}
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Fetching weather...</p>
          </div>
        )}

        {hasWeather && !loading && (
          <div className="weather-container">
            <div className="location-box">
              <div className="location">
                <span className="pin-icon">📍</span>
                {weather.name}, {weather.sys.country}
              </div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div>

            <div className="weather-main">
              <div className="weather-icon-large">
                {weatherIcons[weather.weather[0].main] || '🌡️'}
              </div>
              <div className="temp">
                {Math.round(weather.main.temp)}°
              </div>
              <div className="weather-desc">{weather.weather[0].description}</div>
              <div className="feels-like">
                Feels like {Math.round(weather.main.feels_like)}°C
              </div>
            </div>

            <div className="weather-details">
              <div className="detail-card">
                <span className="detail-icon">💧</span>
                <span className="detail-value">{weather.main.humidity}%</span>
                <span className="detail-label">Humidity</span>
              </div>
              <div className="detail-card">
                <span className="detail-icon">💨</span>
                <span className="detail-value">{Math.round(weather.wind.speed * 3.6)} km/h</span>
                <span className="detail-label">Wind</span>
              </div>
              <div className="detail-card">
                <span className="detail-icon">🌡️</span>
                <span className="detail-value">{Math.round(weather.main.temp_max)}°</span>
                <span className="detail-label">High</span>
              </div>
              <div className="detail-card">
                <span className="detail-icon">❄️</span>
                <span className="detail-value">{Math.round(weather.main.temp_min)}°</span>
                <span className="detail-label">Low</span>
              </div>
            </div>
          </div>
        )}

        {!hasWeather && !loading && (
          <div className="welcome">
            <div className="welcome-icon">🌍</div>
            <h2>Weather App</h2>
            <p>Search for a city to get started</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
