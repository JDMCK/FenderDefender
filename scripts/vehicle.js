var currentUser;
var currentVehicle;

function editVehicle() {
  // let url = new URL('./editVehicle.html');
  // console.log('hi')
  // url += '';
  window.location.href = './editVehicle.html';
}

// Populates the vehicle information section with current vehicle
function populateVehicleInfo() {
  firebase.auth().onAuthStateChanged(user => {
    // Check if user is signed in:
    if (user) {

      var vehicleCount;

      db.collection('users').doc(user.uid).collection('myVehicles')
        .get().then(vehicles => {

          vehicleCount = vehicles.size;
          if (vehicleCount == 0) {
            $('#vehicle_info').load('../text/no_vehicles.html');
          } else {
            $('#vehicle_info').load('../text/vehicle_info.html');
          }

          //go to the correct user document by referencing to the user uid
          currentUser = db.collection("users").doc(user.uid)
          //get the document for current user.
          currentUser.get()
            .then(userDoc => {
              //get the data fields of the user
              var vehicle_name = userDoc.data().vehicle_name;
              var vehicle_type = userDoc.data().vehicle_type;
              var vehicle_tires = userDoc.data().vehicle_tires;
              var vehicle_drivetrain = userDoc.data().vehicle_drivetrain;
              var vehicle_ref = userDoc.data().vehicle_ref;

              //if the data fields are not empty, then write them in to the form.
              if (vehicle_name != null) {
                // document.getElementById("vehicle-name").value = vehicle_name;
                $("#vehicle-name").text(vehicle_name);
              }
              if (vehicle_type != null) {
                $("#vehicle-type").text(vehicle_type);
                $("#vehicle-icon").attr('src', '../images/sedan.png');
                if (vehicle_type == 'Sedan') $("#vehicle-icon").attr('src', '../images/sedan.png');
                if (vehicle_type == 'SUV') $("#vehicle-icon").attr('src', '../images/suv.png');
                if (vehicle_type == 'Truck') $("#vehicle-icon").attr('src', '../images/pickup.png');
                if (vehicle_type == 'Sports Car') $("#vehicle-icon").attr('src', '../images/ferrari.png');
              }
              if (vehicle_tires != null) {
                $("#vehicle-tires").text(vehicle_tires);
              }
              if (vehicle_drivetrain != null) {
                $("#vehicle-drivetrain").text(vehicle_drivetrain);
              }

              displayCardsDynamically("myVehicles", "my-container");
            })
        });
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
  });
}

//call the function to run it 
populateVehicleInfo();

// Function adds a new vehicle to the collection
function addVehicle() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      console.log(user.uid);
      currentUser = db.collection("users").doc(user.uid);
      let tire = document.getElementById("vehicle_tires").value;
      let type = document.getElementById("vehicle_type").value;
      let drivetrain = document.getElementById("vehicle_drivetrain").value;
      let nickname = document.getElementById("vehicle_name").value;
      var vehicleRef = db.collection('users').doc(user.uid).collection('myVehicles');
      vehicleRef.add({
        vehicle_name: nickname,
        vehicle_type: type,
        vehicle_tires: tire,
        vehicle_drivetrain: drivetrain,
        last_updated: firebase.firestore.FieldValue.serverTimestamp(),  //current system time           
      }).then(function () {
        console.log("New vehicle added to firestore");
        window.location.assign("vehicle.html");       //re-direct to vehicle.html after adding specs.
      }).catch(function (error) {
        console.log("Error adding new vehicle: " + error);
      });
    } else {
      return true;
    }
    return false;
  })
}

// Grabs vehicle info from firestore upon changing vehicle
function displayCardsDynamically(collection, containerId) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {

      let select = document.createElement("ul");
      // let placeholder = document.createElement("option");
      // placeholder.value = "";
      // placeholder.text = "Choose...";
      // select.appendChild(placeholder);

      var vehicleRef = db.collection('users').doc(user.uid).collection(collection);

      vehicleRef.get()
        .then(allvehicle => {
          allvehicle.forEach(doc => {
            var title = doc.data().vehicle_name;
            var type = doc.data().vehicle_type;
            var tire = doc.data().vehicle_tires;
            var dt = doc.data().vehicle_drivetrain;
            const option = document.createElement('option');
            option.value = (title + "," + type + "," + tire + "," + dt + ',' + doc.id);
            option.text = (title + " - " + type);
            // console.log(option.value);
            select.appendChild(option);
          });

          select.addEventListener("click", (event) => {
            console.log(event.target.value);
            updateUserData(event.target.value);
          });
          let container = document.getElementById(containerId);
          container.appendChild(select);

        })
        .catch(error => {
          console.error(error);
        });
    } else {
      console.log('No user signed in.')
    }
  })
}

// 
function updateUserData(option) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      const [title, type, tire, dt, docId] = option.split(",");
      db.collection("users").doc(user.uid).update({
        vehicle_name: title,
        vehicle_type: type,
        vehicle_tires: tire,
        vehicle_drivetrain: dt,
        vehicle_ref: docId
      }, { merge: true })
        .then(() => {
          console.log("User data successfully updated!");
          window.location.assign("vehicle.html");
        })
        .catch(error => {
          console.error("Error updating user data: ", error);
        });
    }
  });
}

function deleteVehicle() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      let currentUser = db.collection("users").doc(user.uid);
      currentUser.get()
        .then(userDoc => {
          var vehicleRef = userDoc.data().vehicle_ref;
          db.collection("users").doc(user.uid).collection('myVehicles').doc(vehicleRef).delete().then(() => {
            console.log('Succefully Deleted');

            var vehiclesCollectionRef = db.collection('users').doc(user.uid).collection('myVehicles');

            vehiclesCollectionRef.get()
              .then(allvehicles => {
                if (allvehicles.size == 0) {
                  location.reload();
                } else {
                  console.log(allvehicles.size);
                  const randomId = Math.floor(Math.random() * allvehicles.size);
                  var vehicleDoc = allvehicles.docs[randomId];

                  var title = vehicleDoc.data().vehicle_name;
                  var type = vehicleDoc.data().vehicle_type;
                  var tire = vehicleDoc.data().vehicle_tires;
                  var dt = vehicleDoc.data().vehicle_drivetrain;

                  currentUser.update({
                    vehicle_name: title,
                    vehicle_type: type,
                    vehicle_tires: tire,
                    vehicle_drivetrain: dt,
                    vehicle_ref: vehicleDoc.id
                }).then(() => {
                  location.reload();
                });
                }
              });
          });
        });
    };
  });
}