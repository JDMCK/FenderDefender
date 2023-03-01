let from;
let to;


// Initialize and add the map
function initMap() {
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();

  var mapOptions = {
    zoom:7,
    center: {lat: 49.0454103480525, lng: -122.30955548860403}
  }
  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  directionsRenderer.setMap(map);
}


window.onload = () => {
  searchbutton = document.getElementById('search-button');
  searchbutton.onclick = search;

  searchbarFrom = document.getElementById('searchbar-from');
  searchbarTo = document.getElementById('searchbar-to');

  
}

function search() {
  from = searchbarFrom.value;
  to = searchbarTo.value;

  // From
  const HttpFrom = new XMLHttpRequest();
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${from}&key=AIzaSyAvVBwD347tCmjaM9WzFeBD7W8iLWTdIXA`;
  HttpFrom.open("GET", url);
  HttpFrom.send();

  HttpFrom.onreadystatechange = (e) => {
    let jsonFrom = JSON.parse(HttpFrom.response);
    from = [jsonFrom.results[0].geometry.location.lat, jsonFrom.results[0].geometry.location.lng];
    console.log(from);
  }
  // To
  const HttpTo = new XMLHttpRequest();
  const urlTo = `https://maps.googleapis.com/maps/api/geocode/json?address=${to}&key=AIzaSyAvVBwD347tCmjaM9WzFeBD7W8iLWTdIXA`;
  HttpTo.open("GET", urlTo);
  HttpTo.send();

  HttpTo.onreadystatechange = (e) => {
    let jsonTo = JSON.parse(HttpTo.response);
    to = [jsonTo.results[0].geometry.location.lat, jsonTo.results[0].geometry.location.lng];
    console.log(to);
    calcRoute();
  }

}

function calcRoute() {
  var request = {
    origin: {lat: parseFloat(from[0]), lng: parseFloat(from[1])},
    destination: {lat: parseFloat(to[0]), lng: parseFloat(to[1])},
    travelMode: 'DRIVING'
  };
  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      directionsRenderer.setDirections(result);
    }
  });
}
// 3410 applewood dr abbotsford

// mei secondary abbotsford