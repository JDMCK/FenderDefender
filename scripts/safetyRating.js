const weatherAPIKey = '';

window.onload = () => {
    ratingDisplay = document.getElementById('rating-display');
    needle = document.getElementById('needle');
    calcRating();
}

function getWeather() {

    const params = new URL(window.location.href);
    const from = params.searchParams.get('from').split(',');
    const to = params.searchParams.get('to').split(',');

    const lat = ((parseFloat(from[0]) + parseFloat(to[0])) / 2).toString();
    const lng = ((parseFloat(from[1]) + parseFloat(to[1])) / 2).toString();

    const Http = new XMLHttpRequest();
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&exclude=minutely,hourly,daily&units=metric&appid=${weatherAPIKey}`;
    Http.open("GET", url, false);
    Http.send();

    // Commented out because ^ async set to false
    // Http.onreadystatechange = (e) => {
    //     if (Http.readyState == 4 && Http.status == 200) {
    return Http.responseText;
    //     }
    // }
}

function calcRating() {
    const weather = JSON.parse(getWeather()).current;

    // Weighted decision matrix
    const ConditionsRating = {
        weights: {
            visibility: (x) => x * (x * x) / 100, // Exponential weight because visibility matters less the more you have
            dark: (x) => x * 0.6,
            temperature: (x) => x,
            windSpeed: (x) => x * 0.4,
            percipitation: (x) => x,
            //alerts: (x) => x * 0.4
        },
        values: {
            visibility: weather.visibility > 1000 ? 0 : 10 - weather.visibility / 100, // From 0 m - 1000 m
            dark: weather.dt > weather.sunset || weather.dt < weather.sunrise ? 10 : 0,
            temperature: weather.temp < 0 ? 10 : 0,
            windSpeed: weather.wind_speed < 15 ? 0 : weather.wind_speed > 30 ? 10 : 2 * (weather.wind_speed - 15) / 3,
            percipitation: percipitation(weather.weather),
            //alerts: weather.alerts.length > 0 ? 10 : 0
        },
        worstRating: 40,
        rating: 0
    }

    const weights = Object.values(ConditionsRating)[0];
    const values = Object.values(ConditionsRating)[1];

    for (let i = 0; i < Object.values(values).length; i++) {
        ConditionsRating.rating += Object.values(weights)[i](Object.values(values)[i]);
    }
    ratingDisplay.innerHTML = ConditionsRating.rating;
    console.log(weather);
    console.log(ConditionsRating);
    const VehicleRating = getVehicleRating(ConditionsRating);
    spinNeedle(ConditionsRating, VehicleRating);
}

function percipitation(weather) {
    for (let i = 0; i < weather.length; i++) {
        if (weather[i].id >= 200 && weather[i].id < 300) { // Thunderstorm
            return 7;
        }
        if (weather[i].id >= 500 && weather[i].id < 600) { // Rain
            return 6;
        }
        if (weather[i].id >= 600 && weather[i].id < 700) { // Snow
            return 8;
        } else {
            return 0;
        }
    }
}

function spinNeedle(conditionsRating, vehicleRating) {
    const bias = 0.5; // total * bias = highest meter pos
    let value = (conditionsRating.rating + vehicleRating) / (conditionsRating.worstRating * bias);
    value = value * 180 - 90;
    needle.style.rotate = value.toString() + 'deg';
}

function getVehicleRating(conditionsRating) {
    const vehicle = localStorage.getItem('vehicle');
    if (vehicle == null) return;

    let vehicleRating = 0;

    if (vehicle.type == 'SUV' || vehicle.type == 'Truck') vehicleRating += 1;
    if (vehicle.tire == 'Summer' && conditionsRating.values.temperature == 10) vehicleRating += 0;
    if (vehicle.tire == 'All Weather' && conditionsRating.values.temperature == 10) vehicleRating += 3;
    if (vehicle.tire == 'Winter' && conditionsRating.values.temperature == 10) vehicleRating += 6;
    if (vehicle.drivetrain == 'Front Wheel Drive' && (conditionsRating.values.temperature == 10
        || conditionsRating.values.percipitation == 8)) vehicleRating += 1;
    if ((vehicle.drivetrain == 'All Wheel Drive' || vehicle.drivetrain == '4x4') &&
        (conditionsRating.values.temperature == 10 || conditionsRating.values.percipitation == 8)) vehicleRating += 3;

    return vehicleRating;
}