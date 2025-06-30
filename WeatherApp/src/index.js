document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "453a219f00d24481898180420252906";

    const cityInput = document.getElementById('cityInput');
    const searchBtn = document.getElementById('searchBtn');
    const gpsBtn = document.getElementById('gpsBtn');

    const locationName = document.getElementById('locationName');
    const weatherDescription = document.getElementById('weatherDescription');
    const weatherMainIcon = document.getElementById('weatherMainIcon');
    const temperature = document.getElementById('temperature');

    const humidity = document.getElementById('humidity');
    const wind = document.getElementById('wind');
    const pressure = document.getElementById('pressure');
    const visibility = document.getElementById('uvIndex');

    const container = document.getElementById('weatherContainer');

    async function fetchWeatherByCity(city) {
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=ru`);
            if (!response.ok) {
                throw new Error('Город не найден');
            }
            const data = await response.json();
            updateWeatherUI(data);
        } catch (error) {
            alert(error.message);
            console.error('Ошибка при получении данных:', error);
        }
    }

    async function fetchWeatherByCoords(latitude, longitude) {
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&lang=ru`);
            if (!response.ok) {
                throw new Error('Не удалось получить данные о погоде');
            }
            const data = await response.json();
            updateWeatherUI(data);
        } catch (error) {
            alert(error.message);
            console.error('Ошибка при получении данных:', error);
        }
    }

    function getWeatherIconClass(current) {
        const code = current.condition.code;
        const isDay = current.is_day === 1;

        const iconMap = {
            1000: isDay ? 'wi-day-sunny' : 'wi-night-clear',          // Ясно
            1003: isDay ? 'wi-day-cloudy' : 'wi-night-alt-cloudy',    // Частичная облачность
            1006: 'wi-cloudy',                                        // Пасмурно
            1009: 'wi-cloudy',                                        // Сильно облачно
            1030: 'wi-fog',                                           // Туман
            1063: 'wi-showers',                                       // Легкий дождь
            1066: 'wi-snow',                                          // Легкий снег
            1069: 'wi-sleet',                                         // Мокрый снег
            1072: 'wi-sleet',                                         // Мокрый снег
            1087: 'wi-thunderstorm',                                  // Гроза
            1114: 'wi-snow-wind',                                     // Снежная буря
            1117: 'wi-snow-wind',                                     // Метель
            1135: 'wi-fog',                                           // Туман
            1147: 'wi-fog',                                           // Гололедный туман
            1150: 'wi-sprinkle',                                      // Легкая морось
            1153: 'wi-sprinkle',                                      // Морось
            1180: 'wi-showers',                                       // Местами дождь
            1183: 'wi-rain',                                          // Легкий дождь
            1186: 'wi-rain',                                          // Дождь
            1189: 'wi-rain',                                          // Дождь
            1192: 'wi-rain',                                          // Ливень
            1195: 'wi-rain',                                          // Сильный ливень
            1198: 'wi-sleet',                                         // Ледяной дождь
            1201: 'wi-sleet',                                         // Ледяной дождь
            1204: 'wi-sleet',                                         // Мокрый снег
            1207: 'wi-sleet',                                         // Мокрый снег
            1210: 'wi-snow',                                          // Легкий снег
            1213: 'wi-snow',                                          // Снег
            1216: 'wi-snow',                                          // Снег
            1219: 'wi-snow',                                          // Снег
            1222: 'wi-snow',                                          // Сильный снег
            1225: 'wi-snow',                                          // Сильный снег
            1237: 'wi-hail',                                          // Град
            1240: 'wi-showers',                                       // Легкий дождь
            1243: 'wi-rain',                                          // Дождь
            1246: 'wi-rain',                                          // Сильный дождь
            1249: 'wi-sleet',                                         // Мокрый снег
            1252: 'wi-sleet',                                         // Мокрый снег
            1255: 'wi-snow',                                          // Снег
            1258: 'wi-snow',                                          // Сильный снег
            1261: 'wi-hail',                                          // Град
            1264: 'wi-hail',                                          // Град
            1273: 'wi-thunderstorm',                                  // Гроза с дождем
            1276: 'wi-thunderstorm',                                  // Гроза с ливнем
            1279: 'wi-thunderstorm',                                  // Гроза со снегом
            1282: 'wi-thunderstorm'                                   // Гроза со снегом
        };

        return iconMap[code] || 'wi-na';
    }

    function updateWeatherUI(data) {
        console.dir(data);
        const { location, current } = data;

        locationName.textContent = `${location.name}, ${location.country}`;
        weatherDescription.textContent = current.condition.text;
        temperature.textContent = `${Math.round(current.temp_c)}°C`;

        const iconClass = getWeatherIconClass(current);

        weatherMainIcon.innerHTML = `<i class="wi ${iconClass}"></i>`;

        humidity.textContent = `${current.humidity}%`;
        wind.textContent = `${Math.round(current.wind_kph)} км/ч`;
        pressure.textContent = `${current.pressure_mb} hPa`;
        visibility.textContent = `${current.uv}`;

        document.querySelectorAll('.detail-item span').forEach(span => {
            span.style.display = 'block';
        });

        container.classList.add('expanded');
    }


    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherByCity(city);
        } else {
            alert('Пожалуйста, введите название города');
        }
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city) {
                fetchWeatherByCity(city);
            }
        }
    });

    gpsBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherByCoords(latitude, longitude);
                },
                (error) => {
                    alert('Не удалось получить ваше местоположение. Пожалуйста, введите город вручную.');
                    console.error('Ошибка геолокации:', error);
                }
            );
        } else {
            alert('Геолокация не поддерживается вашим браузером. Пожалуйста, введите город вручную.');
        }
    });
});