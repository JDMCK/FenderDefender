
function insertNameFromFirestore(){
    // to check if the user is logged in:
    firebase.auth().onAuthStateChanged(user =>{
        if (user){
           console.log(user.uid); // let me to know who is the user that logged in to get the UID
           currentUser = db.collection("users").doc(user.uid); // will to to the firestore and go to the document of the user
           currentUser.get().then(userDoc=>{
               //get the user name
               var userName = userDoc.data().name;
               var vehicleType = userDoc.data().vehicle_type;  // get value of the "details" key
               var vehicleTires = userDoc.data().vehicle_tires;    //get unique ID to each hike to be used for fetching right image
               var vehicleDrivetrain = userDoc.data().vehicle_drivetrain;
               console.log(userName);
               $("#name-goes-here").text(userName); //jquery
               $("#vehicle-type").text(vehicleType); //jquery
               $("#vehicle-tires").text(vehicleTires); //jquery
               $("#vehicle-drivetrain").text(vehicleDrivetrain); 
            //    //$("#name-goes-here").text(userName); //jquery
           })    
       }    
    })
}
insertNameFromFirestore()


function writeVehicle() {
    //define a variable for the collection you want to create in Firestore to populate data
    var vehicleRef = db.collection('users/vehicle');

    vehicleRef.add({
        name: "Lightning McQueen", //replace with your own vehicle
        vehicle_type: "Sport Sedan",
        vehicle_tires: "Summer",
        vehicle_drivetrain: "Rear wheel drive",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    vehicleRef.add({
        name: "Mater", //replace with your own vehicle
        vehicle_type: "Truck",
        vehicle_tires: "All Weather",
        vehicle_drivetrain: "Front wheel drive",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    vehicleRef.add({
        name: "Sally Carrera", //replace with your own vehicle
        vehicle_type: "Sport Sedan",
        vehicle_tires: "Summer",
        vehicle_drivetrain: "Rear wheel drive",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
}
