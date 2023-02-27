//  import { orsKey } from "./config";
//console.log(orsKey);

window.onload = () => {
    searchButton = document.getElementById('searchButton')
    searchBar = document.getElementById('searchbar-input');

    //searchButton.onclick = getCoords;
}

function getCoords() {
    //let location = searchBar.value;
    //console.log(location);

    var request = new XMLHttpRequest();

    request.open('GET', `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${orsKey}&start=${start}&end=${end}`);

    request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');

    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            console.log('Status:', this.status);
            console.log('Headers:', this.getAllResponseHeaders());
            console.log('Body:', this.responseText);
        }
    };

    request.send();

}

// Questions:
// - what is an xml request?
// - why can i just call a random variable and it doesnt complain? what is it the child of?
// - why isnt npm modules showing up?
// - how do i get values from a config file?
// - how should i auto fill locations?
// - module.exports = {}, can i add unlimited ones of those? will it override?