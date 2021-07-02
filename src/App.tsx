import './App.css';
import React, { useEffect, useState } from "react";
import { Dimmer, Loader } from 'semantic-ui-react';
import Weather from './components/weather';
import Forecast from './components/forecast';

// import weatherJson from './data/weather.json'
// import forecastJson from './data/forecast.json'


export default function App() {

  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [weatherData, setWeatherData] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
    });


    getWeather(lat, long)
      .then(weather => {
        setWeatherData(weather);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
      });

    getForecast(lat, long)
      .then(data => {
        setForecast(data);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
      });


    // setWeatherData(mapDataToWeatherInterface(weather));
    // setWeatherData(weatherJson);
    // setForecast(forecastJson.list);

    // eslint-disable-next-line
  }, [lat, long, error])

  function handleResponse(response) {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Please Enable your Location in your browser!");
    }
  }

  function getWeather(lat, long) {
    return fetch(
      `${process.env.REACT_APP_API_URL}/weather/?lat=${lat}&lon=${long}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`
    )
      .then(res => handleResponse(res))
      .then(weather => {
        if (Object.entries(weather).length) {
          // const mappedData = mapDataToWeatherInterface(weather);
          return weather;
        }
      });
  }

  function getForecast(lat, long) {
    return fetch(
      `${process.env.REACT_APP_API_URL}/forecast/?lat=${lat}&lon=${long}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`
    )
      .then(res => handleResponse(res))
      .then(forecastData => {
        if (Object.entries(forecastData).length) {
          return forecastData.list
            // .filter(forecast => forecast.dt_txt.match(/09:00:00/))
            // .map(mapDataToWeatherInterface);
        }
      });
  }

  // function mapDataToWeatherInterface(data) {
  //   console.log('data:', data)
  //   const mapped = {
  //     ...data,
  //     date: data.dt * 1000,
  //     // date: data.dt_txt * 1000, // convert from seconds to milliseconds
  //     description: data.weather[0].main,
  //     temperature: Math.round(data.main.temp),
  //   };
  //   // Add extra properties for the five day forecast: dt, icon, min, max
  //   if (data.dt_txt) {
  //     mapped.dt_txt = data.dt_txt;
  //   }

  //   return mapped;
  // }

  return (
    <div className="App">
      {console.log('weatherData:', weatherData)}
      {console.log('-------------------')}

      {(typeof weatherData.main !== 'undefined') ? (
        <div>
          <Weather weatherData={weatherData} />
          <Forecast forecast={forecast} weatherData={weatherData} />
        </div>
      ) : (
        <div>
          <Dimmer active>
            <Loader>Loading..</Loader>
          </Dimmer>
        </div>
      )}
    </div>
  );
}
