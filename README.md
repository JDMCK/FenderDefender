# FenderDefender

## 1. Project Description
An application that suggests whether the user should drive based on the car specs, road conditions, weather, and locations.

![map](https://github.com/JDMCK/FenderDefender/blob/main/map.png?raw=true) | ![danger-rating](https://github.com/JDMCK/FenderDefender/blob/main/danger_rating.png?raw=true)

## 2. Names of Contributors
List team members and/or short bio's here... 
* Ross Wong
* Eric Chau
* Jesse McKenzie
	
## 3. Technologies and Resources Used
List technologies (with version numbers), API's, icons, fonts, images, media or data sources, and other resources that were used.
* HTML, CSS, JavaScript
* Bootstrap 5.0 (Frontend library)
* Firebase 8.0 (BAAS - Backend as a Service)
* Google Maps API
* Open Weather API

## 4. Complete setup/installion/usage
State what a user needs to do when they come to your project.  How do others start using your code or application?
Here are the steps ...
* Users will open the web page and be greeting with the landing page.
* Users will be prompted to sign-in/sign-up but can use the app without an account with limited features.
* Users who are new will be brought to a page to add a new vehicle but a vehicle is not required but will work with limited features.
* Once the vehicle information is entered, the user can go to the map.
* Users are prompted to enter an origin and destination for their route.
* Once the route appears, if the user is happy with it, they can continue to the danger rating.
* If the user has multiple vehicles, they can go back to the map, select current vehicles which will prompt a modal to take them back to the vehicle page to change the vehicle.
* The danger rating will provide a warning based on an algorithm of various live weather information and vehicle specifications.
* If the user is satisfied with the score, they can press continue and it was take them to Google Maps.
* This ends their use of Fender Defender.

## 5. Known Bugs and Limitations
Here are some known bugs:
* Google Maps API is called synchronously and can slow the final step significantly if the road conditions change between the route selection and the continue to Google maps portion.

## 6. Features for Future
What we'd like to build in the future:
* Feature routes favourite's.
* Change the weather calculations to better reflect longer routes.
* Driver comfortability rating.
	
## 7. Contents of Folder
Content of the project folder:
* app
* images
* scripts
* styles
* text
```
 Top level of project folder: 
├── .gitignore               # Git ignore file
    /config.js
    /firebaseAPI_team19.js
└── README.md

It has the following subfolders and files:
├── .git                     # Folder for git repo
├── app
    /about_us.html
    /editProfile.html
    /editVehicle.html
    /favourites.html
    /index.html
    /login.html
    /map.html
    /new_vehicle_add.html
    /safetyRating.html
    /template.html
    /vehicle.html
├── images                   # Folder for images
    /add.png
    /all-wheel-drive.png
    /car.png
    /day-and-night.png
    /delete-button.png
    /eric.jpg
    /ferrari.png
    /front-car.png
    /github.png
    /go.png
    /google_map.png
    /image.png
    /jesse.jpg
    /map.png
    /needle.png
    /pickup.png
    /ross.jpeg
    /sedan.png
    /speedometer.png
    /suv.png
    /tag.png
    /thermometer.png
    /weather.png
    /wheel.png
    /wind.png
    /yes.png
├── scripts                  # Folder for scripts
    /addVehicle.js
    /authentication.js
    /config.js
    /editProfile.js
    /editVehicle.js
    /firebaseAPI_team19.js
    /index_skeleton.js
    /profile.js
    /SafetyRating.js
    /skeleton.js
    /vehicle.js
├── styles                   # Folder for styles
    /aboutus.css
    /button.css
    /profile.css
    /style.css
├── text
    /body_cards.html
    /car_display_modal.html
    /confirm_modal.html
    /confirm_route.html
    /confirm_safety.html
    /footer.html
    /hazard_warnings.html
    /navbar_guest.html
    /navbar.html
    /no_vehicles.html
    /searchbar.html
    /vehicle_info.html
```


