const weatherAPIKey = '';

window.onload = () => {
    ratingDisplay = document.getElementById('rating-display');
    ball = document.getElementById('ball');
    ballFill = document.getElementById('ball-fill');
    slider = document.getElementById('slider');

    backBtn = document.getElementById('back-btn').onclick = () => {
        window.location.href = './map.html';
    }
    driveBtn = document.getElementById('drive-btn').onclick = () => {
        $('#modal').modal('show');
    };
    
    modalCancelBtn = document.getElementById('cancel-safety-modal').onclick = () => {
        $('#modal').modal('hide');
    }
    
    modalConfirmBtn = document.getElementById('confirm-safety-modal').onclick = () => {
        const param = new URL(window.location.href).searchParams.get('formattedAddress');
        const url = 'https://www.google.com/maps/dir/' + param;
        window.location.href = url;
    }
    calcRating();
}


// Calls OpenWeather api to get weather information
// returns HTTP response
function getWeather() {

    //return '{"lat":49.07,"lon":-122.2887,"timezone":"America/Vancouver","timezone_offset":-25200,"current":{"dt":1679368762,"sunrise":1679321535,"sunset":1679365262,"temp":9.16,"feels_like":8.65,"pressure":1008,"humidity":93,"dew_point":8.09,"uvi":0,"clouds":100,"visibility":10000,"wind_speed":1.54,"wind_deg":200,"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}]}}';

    const params = new URL(window.location.href);
    const from = params.searchParams.get('from').split(',');
    const to = params.searchParams.get('to').split(',');

    const lat = ((parseFloat(from[0]) + parseFloat(to[0])) / 2).toString();
    const lng = ((parseFloat(from[1]) + parseFloat(to[1])) / 2).toString();

    const Http = new XMLHttpRequest();
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&exclude=minutely,hourly,daily&units=metric&appid=${weatherAPIKey}`;
    Http.open("GET", url, false);
    Http.send();

    // VVV Commented out because ^ async set to false
    // Http.onreadystatechange = (e) => {
    //     if (Http.readyState == 4 && Http.status == 200) {
    return Http.responseText;
    //     }
    // }
}

// Calculates the overall safety rating by getting weather information and vehicle information
function calcRating() {
    const weather = JSON.parse(getWeather()).current;

    const ConditionsRating = {
        // Weighted decision matrix
        weights: {
            visibility: (x) => x * (x * x) / 100, // Exponential weight because visibility matters less the more you have
            dark: (x) => x * 0.6,
            temperature: (x) => x,
            windSpeed: (x) => x * 0.4,
            percipitation: (x) => x,
        },
        values: {
            visibility: weather.visibility > 1000 ? 0 : 10 - weather.visibility / 100, // From 0 m - 1000 m
            dark: weather.dt > weather.sunset || weather.dt < weather.sunrise ? 10 : 0,
            temperature: weather.temp < 0 ? 10 : 0,
            windSpeed: weather.wind_speed < 15 ? 0 : weather.wind_speed > 30 ? 10 : 2 * (weather.wind_speed - 15) / 3,
            percipitation: percipitation(weather.weather, false),
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
    const VehicleRating = getVehicleRating(ConditionsRating);

    let finalRating = getFinalRating(ConditionsRating, VehicleRating);
    spinNeedle(finalRating);
    populateRatingInfo(finalRating, weather);
}

// Determines danger from various types of percipitation
// takes weather object
// returns rating
function percipitation(weather, literal) {
    for (let i = 0; i < weather.length; i++) {
        if (weather[i].id >= 200 && weather[i].id < 300) { // Thunderstorm
            return literal ? "Thunderstorm" : 7;
        }
        if (weather[i].id >= 500 && weather[i].id < 600) { // Rain
            return literal ? "Rain" : 6;
        }
        if (weather[i].id >= 600 && weather[i].id < 700) { // Snow
            return literal ? "Snow" : 8;
        } else {
            return literal ? "Clear" : 0;
        }
    }
}

// Calculates final rating  from driving conditions and vehicle safety rating
// returns final rating
function getFinalRating(conditionsRating, vehicleRating) {
    const bias = 0.5;
    let value = (conditionsRating.rating - vehicleRating) / (conditionsRating.worstRating * bias); // From 0 to 1
    if (value < 0) value = 0;
    return value;
}

// Calculates vehicle safety rating from vehicle info in local storage
// takes weather conditions rating object
// returns vehicle rating
function getVehicleRating(conditionsRating) {
    let vehicle = localStorage.getItem('vehicle');
    vehicle = JSON.parse(vehicle);
    if (vehicle == null) return 0;

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

// Animates the speedometer display and changes rating number
// takes value from 0 to 1
function spinNeedle(value) {

    let fps = 30;
    let interval = setInterval(speedometerAnimation, 1000 / fps);
    const totalTime = 1; // in seconds
    let tempVal = 0;

    function speedometerAnimation() {

        //value = slider.value;

        let ballDeg = tempVal * 180 - 90;
        let ballFillDeg = tempVal * 180 - 135;

        tempVal += value / (fps * totalTime);

        if (tempVal >= value) {
            clearInterval(interval);
            tempVal = value;
        }

        ball.style.rotate = ballDeg.toString() + 'deg';
        ballFill.style.rotate = ballFillDeg.toString() + 'deg';
        ratingDisplay.innerHTML = Math.round(tempVal * 100);
    }
}

// Populates the rating information and map link below the speedometer graphic
function populateRatingInfo(rating, weather) {

    $('#hazard-warnings').load('../text/hazard_warnings.html', () => {

        if (rating == 0) {
            $('#warning-state-icon').attr('src', '../images/yes.png');
        } else if (rating == 1) {
            $('#warning-state-icon').attr('src', '../images/delete-button.png');
        } else {
            $('#warning-state-icon').attr('src', '../images/warning.png');
        }

        $('#temperature-cell').html(weather.temp + ' °C');
        $('#percipitation-cell').html(percipitation(weather.weather, true));
        $('#wind-cell').html((weather.wind_speed * 3.6).toFixed(2) + ' km/hr');
        $('#light-cell').html(weather.dt > weather.sunset || weather.dt < weather.sunrise ? 'Nighttime' : 'Daytime')
    });
}