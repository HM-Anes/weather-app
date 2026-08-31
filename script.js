const apikey = "2718081ff8a7fe01d8ecf7f4413dcbec";
// for manual search
const apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
// for auto search
const apiUrlByCoords =
    "https://api.openweathermap.org/data/2.5/weather?units=metric";

// input
const searchBox = document.getElementById("city-name");
// search button
const searchBtn = document.getElementById("search-btn");
// location button
const locationBtn = document.getElementById("location-btn");
// weather icon
const weatherIcon = document.querySelector(".weather-icon");

// click on the search button
searchBtn.addEventListener("click", () => {
    // check the weather (temp, humidity, wind)
    checkweather(searchBox.value);
});

// press enter = click on the search button
searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        // check the weather (temp, humidity, wind)
        checkweather(searchBox.value);
    }
});

// click on location button => automatic location
locationBtn.addEventListener("click", () => {
    searchBox.value = "";
    // if Geolocation is not supported
    if (!("geolocation" in navigator)) {
        alert("Geolocation is not supported by your browser.");
        return;
    }
    //the browser API call
    navigator.geolocation.getCurrentPosition(
        onLocationSuccess,
        onLocationError,
    );
});

// Runs when the browser successfully gets the user's coordinates
function onLocationSuccess(position) {
    const { latitude, longitude } = position.coords;
    checkweatherByCoords(latitude, longitude);
}

// Runs when geolocation fails, for any reason
function onLocationError(error) {
    switch (error.code) {
        // PERMISSION_DENIED
        case 1:
            alert("Location permission denied. Search manually instead.");
            break;
        // POSITION_UNAVAILABLE
        case 2:
            alert("Location unavailable. Search manually instead.");
            break;
        // TIMEOUT
        case 3:
            alert("Location request timed out. Try again.");
            break;
        default:
            alert("Could not get your location.");
    }
}

async function checkweather(city) {
    // take the full URL
    const response = await fetch(apiUrl + city + `&appid=${apikey}`);
    // Response processing
    handleResponse(response);
}

// fetch weather using lat/lon instead of city name
async function checkweatherByCoords(lat, lon) {
    const response = await fetch(
        `${apiUrlByCoords}&lat=${lat}&lon=${lon}&appid=${apikey}`,
    );
    // Response processing
    handleResponse(response);
}

// seach-btn or location-btn render the same way
async function handleResponse(response) {
    // if the city not found
    if (response.status === 404) {
        document.querySelector(".error").classList.remove("hide");
        document.getElementById("weather").classList.add("hide");
    } else {
        var data = await response.json();
        window.localStorage.setItem("lastcity", data.name);

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML =
            Math.round(data.main.temp) + "°c";
        document.querySelector(".humidity").innerHTML =
            data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";

        switch (data.weather[0].main) {
            case "Clouds":
                weatherIcon.alt = "clouds";
                weatherIcon.src = "images/clouds.png";
                break;
            case "Clear":
                weatherIcon.alt = "clear";
                weatherIcon.src = "images/clear.png";
                break;
            case "Rain":
                weatherIcon.alt = "rain";
                weatherIcon.src = "images/rain.png";
                break;
            case "Drizzle":
                weatherIcon.alt = "drizzle";
                weatherIcon.src = "images/drizzle.png";
                break;
            case "Mist":
                weatherIcon.alt = "mist";
                weatherIcon.src = "images/mist.png";
                break;
            default:
                weatherIcon.alt = "rain";
                weatherIcon.src = "images/rain.png";
        }
        document.querySelector(".error").classList.add("hide");
        document.getElementById("weather").classList.remove("hide");
    }
}

// on page load, restore the last searched city
window.addEventListener("DOMContentLoaded", () => {
    const lastCity = window.localStorage.getItem("lastcity");
    if (lastCity) {
        searchBox.value = lastCity;
        checkweather(lastCity);
    }
});
