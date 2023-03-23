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

            var vehicleCollectionRef = db.collection('users').doc(user.uid).collection('myVehicles');
            vehicleCollectionRef.add({
                vehicle_name: nickname,
                vehicle_type: type,
                vehicle_tires: tire,
                vehicle_drivetrain: drivetrain,
                last_updated: firebase.firestore.FieldValue.serverTimestamp(),  //current system time           
            }).then(function (vehicleRef) {
                console.log("New vehicle added to firestore");
                currentUser.update({
                    vehicle_name: nickname,
                    vehicle_type: type,
                    vehicle_tires: tire,
                    vehicle_drivetrain: drivetrain,
                    vehicle_ref: vehicleRef.id
                });       //re-direct to vehicle.html after adding specs.
                let vehicleObj = {
                    title: nickname,
                    type: type,
                    tire: tire,
                    drivetrain: drivetrain
                };
                // Adds vehicle to local storage
                localStorage.setItem('vehicle', JSON.stringify(vehicleObj));
                window.location.assign("vehicle.html");
            }).catch(function (error) {
                console.log("Error adding new vehicle: " + error);
            });
            console.log(vehicleRef);
        } else {
            return true;
        }
        return false;
    })
}
