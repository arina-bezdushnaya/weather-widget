import { API_KEY } from './key.js';

const locationName = document.getElementById("currentlocation");
const currentMainWeather = document.getElementById("currentmainweather");
const currentWeatherIcon = document.getElementById("currentweathericon");
const currentWeatherTemp = document.getElementById("currentweathertemperature");
const currentWeatherTime = document.getElementById("currentweathertime");
const currentWeatherDate = document.getElementById("currentweatherdate");
const currentWind = document.getElementById("currentwind");
const currentCloudiness = document.getElementById("currentcloudiness");
const currentPressure = document.getElementById("currentpressure");
const currentHumidity = document.getElementById("currenthumidity");
const currentSunrise = document.getElementById("currentsunrise");
const currentSunset = document.getElementById("currentsunset");
const currentGeocoords = document.getElementById("currentgeocoords");
const forecastLocationName = document.getElementById("forecastlocation");
const forecastDays = document.getElementById("forecastdays");



if ("geolocation" in navigator) {
  console.log("geolocation is available")
} else {
  console.log("geolocation IS NOT available")
}

navigator.geolocation.getCurrentPosition(function(position) {
  const lat = position.coords.latitude;
  const long = position.coords.longitude;
  getCurrentWeather(lat, long);
  getWeatherForecast(lat, long);
});


async function getCurrentWeather(lat, long){
  const baseURL = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${API_KEY}&&units=metric`;
  console.log(baseURL);

  try {
    const response = await fetch(baseURL);
    const json = await response.json();
    displayCurrentWeather(json);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    console.log("Successfully loaded");
  }
}


async function getWeatherForecast(lat, long){
  const API_KEY = "800f2bbd241dda519063717708699912";
  const baseURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API_KEY}&&units=metric`;
  console.log(baseURL);

  try {
    const response = await fetch(baseURL);
    const json = await response.json();
    displayWeatherForecast(json);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    console.log("Successfully loaded");
  }
}

// display current weather
function displayCurrentWeather(json){
  currentMainWeather.innerHTML = json.current.weather[0].main;
  currentWeatherIcon.innerHTML = `<img src=http://openweathermap.org/img/wn/${json.current.weather[0].icon}.png>`
  currentWeatherTemp.innerHTML = json.current.temp + "&deg;C";
  currentWeatherTime.innerHTML = new Date().toLocaleTimeString().slice(0,-3);
  currentWeatherDate.innerHTML = new Date().toLocaleDateString();
  currentWind.innerHTML = `${json.current.wind_speed} m/s, ${json.current.wind_deg}&deg;, wind gust ${json.current.wind_gust} m/s`;
  currentCloudiness.innerHTML = json.current.clouds + "%";
  currentPressure.innerHTML = json.current.pressure + " hPa";
  currentHumidity.innerHTML = json.current.humidity + " %";
  currentSunrise.innerHTML = new Date(json.current.sunrise*1000).toLocaleTimeString();
  currentSunset.innerHTML = new Date(json.current.sunset*1000).toLocaleTimeString();
  currentGeocoords.innerHTML = `[${json.lat}, ${json.lon}]` ;
};


// create and show 5 days forecast
function displayWeatherForecast(json){
  forecastLocationName.innerHTML = json.city.name;
  locationName.innerHTML = json.city.name;
   
  function addToDateList(date) {
    const dateElement = forecastDays.appendChild(document.createElement("div"));
    const dateElementInner = dateElement.appendChild(document.createElement("div"));
    dateElementInner.innerHTML = date; 
    dateElement.className = "weather-forecast__day";
    dateElementInner.className = "weather-forecast__date";

    return dateElement;
  }

  function addToTimeList(date, time, icon, temperature, main, wind, clouds, pressure) {
    const hourElement = date.appendChild(document.createElement("div"));
    const timeElement = hourElement.appendChild(document.createElement("div"));
    const weatherElementBrief = hourElement.appendChild(document.createElement("div"));
    timeElement.innerHTML = time + `<img src=http://openweathermap.org/img/wn/${icon}.png>`; 
    weatherElementBrief.innerHTML = `<span class="weather-forecast__temp">${temperature}&deg;C</span> ${main}, ${wind} m/s, ${clouds}%, ${pressure} hPa`; 
    hourElement.className = "weather-forecast__hour";
    timeElement.className = "weather-forecast__time";
    weatherElementBrief.className = "weather-forecast__brief";
  }

  let pastDateElement;
  let dateElementInserted;

  for(let i = 0; i < 40; i++) {
    const currentDateElement = new Date(json.list[i].dt_txt).toLocaleDateString();
    const currentTimeElement = new Date(json.list[i].dt_txt).toLocaleTimeString().slice(0,-3);
    const currentIconElement = json.list[i].weather[0].icon;
    const currentTemperatureElement = json.list[i].main.temp;
    const currentMainElement = json.list[i].weather[0].main;
    const currentWindElement = json.list[i].wind.speed;
    const forecastCloudsElement = json.list[i].clouds.all;
    const forecastPressureElement = json.list[i].main.pressure;
    
    if (i == 0) {
      dateElementInserted = addToDateList(currentDateElement);
    } else if (currentDateElement != pastDateElement) {
      dateElementInserted = addToDateList(currentDateElement);
    }

    addToTimeList(dateElementInserted, currentTimeElement, currentIconElement, currentTemperatureElement, currentMainElement, currentWindElement, forecastCloudsElement, forecastPressureElement); 

    pastDateElement = currentDateElement;
  }
};
