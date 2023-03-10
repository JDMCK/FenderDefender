var currentUser;  

//Function adds a new vehicle to the collection.//
function addVehicle() {
    firebase.auth().onAuthStateChanged(user =>{
        if (user){
        console.log(user.uid); 
        currentUser = db.collection("users").doc(user.uid);
        let tire = document.getElementById("vehicle_tires").value;
        let type = document.getElementById("vehicle_type").value;
        let drivetrain = document.getElementById("vehicle_drivetrain").value;
        let nickname = document.getElementById("vehicle_name").value;          
        var vehicleRef = db.collection('users').doc(user.uid).collection('myVehicles');
        vehicleRef.set({           
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
})}
