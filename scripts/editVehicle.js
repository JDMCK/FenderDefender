var currentUser;

//Function edits current vehicle in the collection.//
function editVehicle() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            //var user = authResult.user;
            currentUser = db.collection("users").doc(user.uid);
            var vehiclesCollection = db.collection('users').doc(user.uid).collection('myVehicles');
            let type = document.getElementById("vehicle_type").value;
            let tire = document.getElementById("vehicle_tires").value;
            let drivetrain = document.getElementById("vehicle_drivetrain").value;
            let nickname = document.getElementById("vehicle_name").value;

            currentUser.get()
                .then(userDoc => {
                    var vehicleRef = userDoc.data().vehicle_ref;
                    vehiclesCollection.doc(vehicleRef).update({
                        vehicle_name: nickname,
                        vehicle_type: type,
                        vehicle_tires: tire,
                        vehicle_drivetrain: drivetrain,
                        last_updated: firebase.firestore.FieldValue.serverTimestamp(),  //current system time           
                    }).then(function () {
                        currentUser.update({
                            vehicle_name: nickname,
                            vehicle_type: type,
                            vehicle_tires: tire,
                            vehicle_drivetrain: drivetrain,
                        });
                        console.log("Vehicle edits added to firestore");
                        window.location.assign("vehicle.html");       //re-direct to vehicle.html after adding specs.
                    }).catch(function (error) {
                        console.log("Error adding new vehicle: " + error);
                    });
                });
        } else {
            return true;
        }
        return false;
    })
}



function populateVehicleInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

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

                    //if the data fields are not empty, then write them in to the form.
                    if (vehicle_name != null) {
                        document.getElementById("vehicle_name").value = vehicle_name;
                        document.getElementById("vehicle_type").value = vehicle_type;
                        document.getElementById("vehicle_tires").value = vehicle_tires;
                        document.getElementById("vehicle_drivetrain").value = vehicle_drivetrain;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

//call the function to run it 
populateVehicleInfo();