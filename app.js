// DOM ELEMENTS
// گرفتن تمام عناصر HTML

const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const locationButton = document.getElementById("locationButton");

const cityName =document.getElementById ("cityName");
const temperature = document.getElementById ("temperature");
const weatherDescription = document.getElementById ("weatherDescription");
const weatherStatus = document.getElementById("weatherStatus");
const humidity = document.getElementById ("humidity");
const windSpeed =  document.getElementById ("windSpeed");
const feelslike = document.getElementById ("feelslike");
const weatherIcon = document.getElementById ("weatherIcon")
const currentDate = document.getElementById("currentDate");
const forecastContainer = document.getElementById("forecastContainer");
const greeting = document.getElementById("greeting");
const liveClock = document.getElementById("liveClock");
const languageSelect = document.getElementById("languageSelect");
const feelsLikeTitle =document.getElementById("feelsLikeTitle");
const humidityTitle =document.getElementById("humidityTitle");
const windSpeedTitle =document.getElementById("windSpeedTitle");

const errorMessage = document.getElementById ("errorMessage");
const loadingMessage = document.getElementById ("loadingMessage");

// APPLICATION STATE//
// متغیرهای سراسری برنامه
let currentLanguage = "en";
let lastWeatherData = null;
let lastLocationData = null;


// GREETING SYSTEM
// نمایش پیام صبح بخیر، عصر بخیر و شب بخیر

function updateGreeting(){

    const hour = new Date().getHours();
    if(currentLanguage === "fa"){

        if(hour < 12){
           greeting.textContent = "☀ صبح بخیر";
        }
        else if(hour < 18){
            greeting.textContent = "🌤 عصر بخیر";
        }
        else{
            greeting.textContent = "🌙 شب بخیر";
        }

    }else{

        if(hour < 12){
            greeting.textContent = "Good Morning";
        }
        else if(hour < 18){
            greeting.textContent = "Good Afternoon";
        }
        else{
            greeting.textContent = "Good Evening";
        }
    }
}

// LIVE CLOCK
// ساعت زنده برنامه
function updateClock(){

    const now = new Date();
    const time = now.toLocaleTimeString(
        currentLanguage === "fa" ? "fa-IR" : "en-US",
        {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }
    );
    liveClock.textContent = time;
}

// LIVE CLOCK
// ساعت زنده برنامه
function updateLanguageUI(){

    if(currentLanguage === "fa"){
        document.body.dir = "rtl";
        document.body.style.textAlign = "right";

        document.querySelector(".app-header h1").textContent ="برنامه آب و هوا";
        document.querySelector(".app-header p").textContent = "بررسی وضعیت فعلی هوا و پیش بینی هوا";
        searchButton.textContent = "جستجو";
        locationButton.textContent = "موقعیت من";
        document.querySelector(".forecast-section h2").textContent ="پیش بینی ۵ روز آینده";
        cityInput.placeholder = "نام شهر را مورد نظر تان را وارد کنید";
        feelsLikeTitle.textContent = "🌡 احساس دما";
        humidityTitle.textContent = "💧 رطوبت";
        windSpeedTitle.textContent = "🌬 سرعت باد";
    }else{
        document.body.dir = "ltr";
        document.body.style.textAlign = "left";

        document.querySelector(".app-header h1").textContent ="Weather App";
        document.querySelector(".app-header p").textContent ="Check The current weather and forecast";
        searchButton.textContent ="Search";
        locationButton.textContent ="Use My Location";
        document.querySelector(".forecast-section h2").textContent ="5-Day Forecast";
        cityInput.placeholder ="Enter your city name";
       feelsLikeTitle.textContent = "🌡 Feels Like";
        humidityTitle.textContent = "💧 Humidity";
        windSpeedTitle.textContent = "🌬 Wind Speed";
    }
}
//---------------------------------------//
// CITY GEOCODING API
// تبدیل نام شهر به مختصات جغرافیایی
//----------------------------------------//

async function getCityCoordinates(city) {
   const apiLanguage = currentLanguage === "fa" ? "fa" : "en";

const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=${apiLanguage}&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    if (!data.results || data.results.length === 0){
        throw new Error("City not found");
    }

    return {
        name: data.results[0].name,
        country: data.results[0].country,
        latitude: data.results[0].latitude,
        longitude: data.results[0].longitude
    };
}

//---------------------------------------//
// WEATHER API
// دریافت اطلاعات آب و هوا از Open-Meteo
//---------------------------------------//

async function getWeather(latitude, longitude) {

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Weather data not available");
    }

    const data = await response.json();
    return data;
}

//---------------------------------------//
// DISPLAY CURRENT WEATHER
// نمایش اطلاعات فعلی آب و هوا
//---------------------------------------//

function displayWeather(city , weather){
if(currentLanguage === "fa"){
    cityName.textContent = `${city.name}، ${city.country}`;
}else{
    cityName.textContent = `${city.name}, ${city.country}`;
}

const now = new Date();
if(currentLanguage === "fa"){
    const persianDate = now.toLocaleDateString("fa-IR",{
        weekday:"long",
        day:"numeric",
        month:"long",
        year:"numeric"
    });

    const persianTime = now.toLocaleTimeString("fa-IR",{
        hour:"2-digit",
        minute:"2-digit"
    });

    currentDate.textContent =`${persianDate} | ${persianTime}`;

}else{

    const englishDate = now.toLocaleDateString("en-US",{
        weekday:"long",
        month:"long",
        day:"numeric",
        year:"numeric"
    });

    const englishTime = now.toLocaleTimeString("en-US",{
        hour:"2-digit",
        minute:"2-digit"
    });

    currentDate.textContent =`${englishDate} | ${englishTime}`;
}

   temperature.textContent =`${weather.current.temperature_2m}℃`;
   feelslike.textContent =`${weather.current.apparent_temperature}℃`;
   weatherDescription.textContent =getWeatherDescription( weather.current.weather_code);

   if(weather.current.temperature_2m >= 30){
    weatherStatus.textContent = currentLanguage === "fa" ? "🔥 هوای گرم": "🔥 Hot Weather";

}
else if(weather.current.temperature_2m <= 10){

    weatherStatus.textContent = currentLanguage === "fa" ? "❄ هوای سرد" : "❄ Cold Weather";

}
else{

    weatherStatus.textContent = currentLanguage === "fa"? "🌤 هوای معتدل": "🌤 Moderate Weather";
}

   weatherIcon.src = getWeatherIcon(weather.current.weather_code);

   changeBackground( weather.current.weather_code);

   humidity.textContent =`${weather.current.relative_humidity_2m}%`;

    windSpeed.textContent =`${weather.current.wind_speed_10m} km/h`;
}

// DISPLAY 5-DAY FORECAST
// نمایش پیش بینی پنج روز آینده
function displayForecast(weather) {

    forecastContainer.innerHTML = "";
    const days = weather.daily.time;
    const maxTemps = weather.daily.temperature_2m_max;
    const minTemps = weather.daily.temperature_2m_min;
    const codes = weather.daily.weather_code;


    for (let i = 0; i < days.length; i++) {
        const date = new Date(days[i]);
        const dayName = date.toLocaleDateString(
            currentLanguage === "fa" ? "fa-IR" : "en-US",
            {
                weekday: "long"
            }
        );

        const card = document.createElement("article");
        card.className = "forecast-card";
        card.innerHTML = `

            <h3>${dayName}</h3>

            <img 
            src="${getWeatherIcon(codes[i])}"
            width="60"
            alt="weather icon">


            <p> ${getWeatherDescription(codes[i])} </p>
            <strong>  ${maxTemps[i]}℃
            </strong>
            <small>${minTemps[i]}℃ </small> `;
        forecastContainer.appendChild(card);

    }
}

// SEARCH WEATHER
// جستجوی آب و هوا براساس نام شهر

async function searchWeather() {
  let city = cityInput.value.trim();

if (city === ""){
   errorMessage.textContent = currentLanguage === "fa"? "لطفاً نام شهر را وارد کنید": "Please enter a city name";
return;
}

localStorage.setItem("lastCity",city);

    try {
        loadingMessage.style.display = "block";
        errorMessage.textContent = "";
        const location = await getCityCoordinates(city);
        const weather = await getWeather(location.latitude , location.longitude);
        lastWeatherData = weather;
        lastLocationData = location;
        displayWeather( location , weather);
        displayForecast(weather);
    
    } catch (error) {

    errorMessage.textContent =
    error.message ||
    (currentLanguage === "fa"
    ? "خطایی رخ داد"
    : "Something went wrong");

}finally {
        loadingMessage.style.display = "none";
    }
}

// DYNAMIC THEME SYSTEM
// تغییر رنگ پس زمینه براساس وضعیت هوا

function changeBackground(weatherCode){
    document.body.classList.remove("sunny-bg","cloudy-bg", "rainy-bg", "sunny-theme","cloudy-theme","rainy-theme");
    if(weatherCode === 0){

        document.body.classList.add("sunny-bg");
        document.body.classList.add("sunny-theme");

    }else if(weatherCode <= 3){

        document.body.classList.add("cloudy-bg");
        document.body.classList.add("cloudy-theme");

    }else{

        document.body.classList.add("rainy-bg");
        document.body.classList.add("rainy-theme");
    }
}

// WEATHER DESCRIPTION
// تبدیل کد هواشناسی به متن قابل نمایش

function getWeatherDescription(code){

    if(currentLanguage === "fa"){

        if(code === 0){
            return "آسمان صاف";
        }
        else if(code <= 3){
            return "نیمه ابری";
        }
        else if(code <= 48){
            return "مه آلود";
        }
        else if(code <= 67){
            return "بارانی";
        }
        else if(code <= 77){
            return "برفی";
        }
        else{
            return "طوفانی";
        }

    }else{

        if(code === 0){
            return "Clear Sky";
        }
        else if(code <= 3){
            return "Partly Cloudy";
        }
        else if(code <= 48){
            return "Foggy";
        }
        else if(code <= 67){
            return "Rainy";
        }
        else if(code <= 77){
            return "Snowy";
        }
        else{
            return "Stormy";
        }
    }
}


// WEATHER ICONS
// انتخاب آیکون مناسب برای وضعیت هوا

function getWeatherIcon(code){
    if(code=== 0){
        return "https://cdn-icons-png.flaticon.com/512/869/869869.png";
    }

    else if(code <= 3){
        return "https://cdn-icons-png.flaticon.com/512/1163/1163624.png";
    }

    else if(code <= 67){
        return "https://cdn-icons-png.flaticon.com/512/3351/3351979.png";
    }

    else{
        return "https://cdn-icons-png.flaticon.com/512/1146/1146869.png";
    }
}

// EVENT LISTENERS
// مدیریت رویدادهای برنامه

searchButton.addEventListener(
    "click", searchWeather
);

locationButton.addEventListener("click", ()=>{

    if(!navigator.geolocation){

        errorMessage.textContent =
        currentLanguage === "fa"
        ? "مرورگر شما موقعیت مکانی را پشتیبانی نمی‌کند"
        : "Geolocation is not supported";

        return;
    }

    navigator.geolocation.getCurrentPosition(

        async(position)=>{

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            try{

                errorMessage.textContent = "";
                const weather = await getWeather(latitude,longitude);
                const city = {

                    name:
                    currentLanguage === "fa"
                    ? "موقعیت شما"
                    : "Your Location",

                    country:""
                };

                displayWeather(city,weather);
                displayForecast(weather);

            }catch(error){

                errorMessage.textContent =
                currentLanguage === "fa"
                ? "خطا در دریافت آب و هوا"
                : error.message;
            }
        },

        ()=>{

            errorMessage.textContent =
            currentLanguage === "fa"
            ? "اجازه دسترسی به موقعیت داده نشد"
            : "Location permission denied";
        }

    );
});

languageSelect.addEventListener("change", () => {
    currentLanguage = languageSelect.value;

    updateGreeting();
    updateLanguageUI();
    if(lastWeatherData && lastLocationData){
    displayWeather(lastLocationData,lastWeatherData);
    displayForecast(lastWeatherData);
}

});

// APPLICATION INITIALIZATION
// اجرای اولیه برنامه هنگام بارگذاری صفحه

window.addEventListener("load",()=>{

    updateGreeting();
    updateClock();
    setInterval(updateClock,1000);
    updateLanguageUI();

    const lastCity =
    localStorage.getItem("lastCity");

    if(lastCity){

        cityInput.value = lastCity;

        searchWeather();
    }
});

cityInput.addEventListener("keypress",(event)=>{

        if(event.key==="Enter"){
            searchWeather();
        }
    }
);