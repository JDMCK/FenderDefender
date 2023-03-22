let from;
let to;
let formattedFrom;
let formattedTo;
const apiKey = 'AIzaSyAvVBwD347tCmjaM9WzFeBD7W8iLWTdIXA';

// Initialize and add the map
function initMap() {
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();

  const mapOptions = {
    zoom: 7,
    center: { lat: 49.0454103480525, lng: -122.30955548860403 },
    disableDefaultUI: true
  }
  const map = new google.maps.Map(document.getElementById('map'), mapOptions);
  directionsRenderer.setMap(map);
}


window.onload = () => {
  searchbutton = document.getElementById('search-button');
  searchbutton.onclick = search;

  searchbarFrom = document.getElementById('searchbar-from');
  searchbarFrom.value = "3410 applewood dr abbotsford";

  searchbarTo = document.getElementById('searchbar-to');
  searchbarTo.value = "mei secondary abbotsford";

  circleBtn = document.getElementById('circle-btn').onclick = () => {
    displayCar();
    $('#modal').modal('show');
  };

  confirmCar = document.getElementById('confirm-car-modal').onclick = () => {
    $('#modal').modal('hide');
  }

  // Post search button click
  confirmRoute = document.getElementById('confirm-route');

  confirmBtn = document.getElementById('confirm-btn');
  confirmBtn.onclick = nextPage;

  searchbar = document.getElementById('searchbar');

  cancelBtn = document.getElementById('cancel-btn');
  cancelBtn.onclick = () => {
    confirmRoute.style.display = 'none';
    searchbar.style.display = 'block';
    initMap();
  };

}

function search() {
  from = searchbarFrom.value;
  to = searchbarTo.value;

  // From
  const HttpFrom = new XMLHttpRequest();
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${from}&key=${apiKey}`;
  HttpFrom.open("GET", url);
  HttpFrom.send();

  HttpFrom.onreadystatechange = (e) => {
    if (HttpFrom.readyState == 4 && HttpFrom.status == 200) {
      const jsonFrom = JSON.parse(HttpFrom.response);
      from = [jsonFrom.results[0].geometry.location.lat, jsonFrom.results[0].geometry.location.lng];

      // To
      const HttpTo = new XMLHttpRequest();
      const urlTo = `https://maps.googleapis.com/maps/api/geocode/json?address=${to}&key=${apiKey}`;
      HttpTo.open("GET", urlTo);
      HttpTo.send();

      HttpTo.onreadystatechange = (e) => {
        if (HttpTo.readyState == 4 && HttpTo.status == 200) {
          const jsonTo = JSON.parse(HttpTo.response);
          to = [jsonTo.results[0].geometry.location.lat, jsonTo.results[0].geometry.location.lng];

          formattedFrom = jsonFrom.results[0].formatted_address;
          console.log(jsonFrom);
          formattedTo = jsonTo.results[0].formatted_address;

          calcRoute();
          //getWeather(from, to);
        }
      }
    }
  }
}

// Goes to next page by forming url with parameters
function nextPage() {
  let url = './safetyRating.html?';
  url += `from=${from}&to=${to}`;
  url += `&formattedAddress=${formattedFrom}/${formattedTo}`;
  window.location.href = url;
};

function calcRoute() {
  const request = {
    origin: { lat: parseFloat(from[0]), lng: parseFloat(from[1]) },
    destination: { lat: parseFloat(to[0]), lng: parseFloat(to[1]) },
    travelMode: 'DRIVING'
  };
  directionsService.route(request, function (result, status) {
    if (status == 'OK') {
      directionsRenderer.setDirections(result);
      runConfirm();
    }
  });
}

function runConfirm() {
  confirmRoute.style.display = 'flex';
  searchbar.style.display = 'none';
}

function displayCar() {
  let vehicle = localStorage.getItem('vehicle');
  vehicle = JSON.parse(vehicle);
  document.getElementById('car-name-modal').innerHTML = '<br>' + vehicle.title + ' - ' + vehicle.type;
}

// parses road names from results object and returns list
function getRoadNames(result) {
  let roadNames = [];
  let filter = ['right', 'left', 'north', 'south', 'east', 'west']; // other junk that can be in <b> tags
  let steps = result.routes[0].legs[0].steps;

  // looping through all the instructions
  for (let i = 0; i < steps.length; i++) {
    let instruction = steps[i].instructions;

    // getting the road names
    for (let j = 0; j < instruction.length; j++) {
      if (instruction.substring(j, j + 3) == '<b>') {
        let end = instruction.indexOf('</b>', j + 3);
        let substr = instruction.substring(j + 3, end); // potential road name

        if (!roadNames.includes(substr) && !filter.includes(substr) && substr.includes(' ')) {
          roadNames.push(substr);
        }
      }
    }
  }
  return roadNames;
}
// Current thinking for getting road hazards:
// to get weather, I find the center of my start and end and get weather at that point
// to get road conditions, i grab all events (of hopefully around major status) and filter event descriptions for my road names