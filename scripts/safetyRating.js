const weatherAPIKey = 'API HERE';

window.onload = () => {
    ratingDisplay = document.getElementById('rating-display');
    needle = document.getElementById('needle');
    calcRating();
}

function getWeather() {

    const params = new URL(window.location.href);
    const from = params.searchParams.get('from').split(',');
    const to = params.searchParams.get('to').split(',');

    const lat = ((parseFloat(from[0]) + parseFloat(to[0]))/2).toString();
    const lng = ((parseFloat(from[1]) + parseFloat(to[1]))/2).toString(); 

    const Http = new XMLHttpRequest();
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&exclude=minutely,hourly,daily&units=metric&appid=${weatherAPIKey}`;
    Http.open("GET", url, false);
    Http.send();
    
    // Http.onreadystatechange = (e) => {
    //     if (Http.readyState == 4 && Http.status == 200) {
            return Http.responseText;
    //     }
    // }
}

function calcRating() {
    const weather = JSON.parse(getWeather()).current;

    // Weighted decision matrix
    const Rating = {
        weights: {
            "visibility": (x) => x * (x * x) / 100, // Exponential weight because visibility matters less the more you have
            dark: (x) => x * 0.5,
            temperature: (x) => x * 0.5,
            windSpeed: (x) => x,
            percipitation: (x) => x * 0.6,
            //alerts: (x) => x * 0.4
        },
        values: {
            visibility: weather.visibility > 1000 ? 0 : 10 - weather.visibility / 100, // From 0 m - 1000 m
            dark: weather.dt > weather.sunset ? 10 : 0,
            temperature: weather.temp < 0 ? 10 : 0,
            windSpeed: weather.wind_speed < 15 ? 0 : weather.wind_speed > 30 ? 10 : 2 * (weather.wind_speed - 15) / 3,
            percipitation: percipitation(weather.weather),
            //alerts: weather.alerts.length > 0 ? 10 : 0
        },
        worstRating: 36,
        rating: 0
    }

    const weights = Object.values(Rating)[0];
    const values = Object.values(Rating)[1];

    for (let i = 0; i < Object.values(values).length; i++) {
        Rating.rating += Object.values(weights)[i](Object.values(values)[i]);
    }
    ratingDisplay.innerHTML = Rating.rating;
    spinNeedle(Rating);
}

function percipitation(weather) {
    for (let i = 0; i < weather.length; i++) {
        if (weather[i].id[0] == 2) { // Thunderstorm
            return 0.7;
        }
        if (weather[i].id[0] == 5) { // Rain
            return 0.6;
        }
        if (weather[i].id[0] == 6) { // Snow
            return 0.8;
        } else {
            return 0;
        }
    }
}

function spinNeedle(rating) {
    let value = rating.rating / rating.worstRating;
    value = value * 180 - 90;
    needle.style.rotate = value.toString() + 'deg';
}