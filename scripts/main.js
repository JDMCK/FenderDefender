
function insertNameFromFirestore(){
    // to check if the user is logged in:
    firebase.auth().onAuthStateChanged(user =>{
        if (user){
           console.log(user.uid); // let me to know who is the user that logged in to get the UID
           currentUser = db.collection("users").doc(user.uid); // will to to the firestore and go to the document of the user
           currentUser.get().then(userDoc=>{
               //get the user name
               var userName = userDoc.data().name;
               console.log(userName);
               $("#name-goes-here").text(userName); //jquery

           }) 
       }    
    })
}
insertNameFromFirestore()

function insertVehicleFromFirestore(){
    // to check if the user is logged in:
    firebase.auth().onAuthStateChanged(user =>{
        if (user){
           console.log(user.uid); // let me to know who is the user that logged in to get the UID
           currentUser = db.collection("vehicle").doc(user.uid); // will to to the firestore and go to the document of the user
           currentUser.get().then(userDoc=>{
               //get the user name
               var vehicleName = userDoc.data().vehicle_name;
               var vehicleType = userDoc.data().vehicle_type;  // get value of the "details" key
               var vehicleTires = userDoc.data().vehicle_tires;    //get unique ID to each hike to be used for fetching right image
               var vehicleDrivetrain = userDoc.data().vehicle_drivetrain;
               $("#vehicle-name").text(vehicleName); //jquery
               $("#vehicle-type").text(vehicleType); //jquery
               $("#vehicle-tires").text(vehicleTires); //jquery
               $("#vehicle-drivetrain").text(vehicleDrivetrain); 
           }) 
       }    
    })
}
insertVehicleFromFirestore()

//Function works to change the car type, not actually add a new vehicle to the collection.//
function addVehicle() {
    firebase.auth().onAuthStateChanged(user =>{
        if (user){
        console.log(user.uid); 
        currentUser = db.collection("users").doc(user.uid);
        let tire = document.getElementById("tires").value;
        let type = document.getElementById("type").value;
        let drivetrain = document.getElementById("drivetrain").value;
        let nickname = document.getElementById("vehicle_name").value;          

        db.collection("vehicle").doc(user.uid).set({ 
            vehicle_name: nickname,
            vehicle_type: type,
            vehicle_tires: tire,
            vehicle_drivetrain: drivetrain,
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


function displayCardsDynamically(collection, containerId) {
    console.log("displaying cards in container:", containerId);
    let select = document.createElement("select");
    let placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.text = "Choose...";
    select.appendChild(placeholder);
  
    db.collection(collection).get()
      .then(allvehicle => {
        allvehicle.forEach(doc => {
          var title = doc.data().vehicle_name;
          const option = document.createElement('option');
          option.value = title;
          option.text = title;
          select.appendChild(option);
        });
        
        document.getElementById(containerId).appendChild(select);
      })
      .catch(error => {
        console.error(error);
      });
}
displayCardsDynamically("vehicle", "my-container")
  

function writeVehicle() {
    //define a variable for the collection you want to create in Firestore to populate data
    var vehicleRef = db.collection('vehicle');

    vehicleRef.add({
        vehicle_name: "Lightning McQueen", //replace with your own vehicle
        vehicle_type: "Sport Sedan",
        vehicle_tires: "Summer",
        vehicle_drivetrain: "Rear wheel drive",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    vehicleRef.add({
        vehicle_name: "Mater", //replace with your own vehicle
        vehicle_type: "Truck",
        vehicle_tires: "All Weather",
        vehicle_drivetrain: "Front wheel drive",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    vehicleRef.add({
        vehicle_name: "Sally Carrera", //replace with your own vehicle
        vehicle_type: "Sport Sedan",
        vehicle_tires: "Summer",
        vehicle_drivetrain: "Rear wheel drive",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
}

