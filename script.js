const searchCity = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-button');
const returnContainer = document.querySelector('.fetch-return');
const notificationContainer = document.querySelector('.notification');

const GEOCODE_API = '6899e907e6c1b959907482szlf49a89';
const WEATHER_API = '07b07fe9c66dbea3673fd47f7f6a6625';

async function searchWeather(city, geocode_api, weather_api) {
    const coords = await cityToCoords(city, geocode_api);
    try {
        const lat = coords[0].lat;
        const lon = coords[0].lon;
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weather_api}`);
        const weather = await weatherResponse.json();
        console.log(weather);
        renderWeather(weather);
    } catch {
        console.error('Wrong city');
        notificationContainer.style.display = 'block';
        setTimeout(() => {
            notificationContainer.classList.add('notification-out');
            setTimeout(() => {
                notificationContainer.style.display = 'none';
                notificationContainer.classList.remove('notification-out');
            }, 900);
        }, 2000);
    }
}

async function cityToCoords(city, api) {
    const response = await fetch(`https://geocode.maps.co/search?q=${city}&api_key=${api}`)
    const data = await response.json();
    return data;
}

function renderWeather(weather) {
    returnContainer.innerHTML = '';

    const cityEl = document.createElement('p');
    cityEl.textContent = 'City: ' + weather.name;

    const temperatureEl = document.createElement('p');
    temperatureEl.textContent = 'Current temperature: ' + Math.round(weather.main.temp - 273.15) + '°C';

    const descriptionEl = document.createElement('p');
    descriptionEl.textContent = 'Weather description: ' + weather.weather[0].description;

    const iconEl = document.createElement('img');
    iconEl.src = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
    iconEl.alt = 'weather-condition';

    returnContainer.appendChild(cityEl);
    returnContainer.appendChild(temperatureEl);
    returnContainer.appendChild(descriptionEl);
    returnContainer.appendChild(iconEl);
}

searchCity.addEventListener('keydown', (e => {
    if (e.key === 'Enter') searchWeather(searchCity.value.trim(), GEOCODE_API, WEATHER_API);
}));
searchButton.addEventListener('click', () => searchWeather(searchCity.value.trim(), GEOCODE_API, WEATHER_API));