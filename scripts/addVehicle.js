var currentUser;

//Function adds a new vehicle to the collection.//
function addVehicle() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid);
            let tire = document.getElementById("vehicle_tires").value;
            let type = document.getElementById("vehicle_type").value;
            let drivetrain = document.getElementById("vehicle_drivetrain").value;
            let nickname = document.getElementById("vehicle_name").value;

            if (type == 'Please select your type of vehicle' ||
                tire == 'Please select your tire type' ||
                drivetrain == 'Please select your drivetrain' ||
                nickname == '') {
                alert('You cannot leave any option blank.');
                return;
            }

            var vehicleRef = db.collection('users').doc(user.uid).collection('myVehicles');
            vehicleRef.add({
                vehicle_name: nickname,
                vehicle_type: type,
                vehicle_tires: tire,
                vehicle_drivetrain: drivetrain,
                last_updated: firebase.firestore.FieldValue.serverTimestamp(),  //current system time           
            }).then(function () {
                console.log("New vehicle added to firestore");
                currentUser.set({
                    vehicle_name: nickname,
                    vehicle_type: type,
                    vehicle_tires: tire,
                    vehicle_drivetrain: drivetrain,
                });       //re-direct to vehicle.html after adding specs.
                window.location.assign("vehicle.html");
            }).catch(function (error) {
                console.log("Error adding new vehicle: " + error);
            });
        } else {
            return true;
        }
        return false;
    })
}
