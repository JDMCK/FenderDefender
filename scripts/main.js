var currentUser;  

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
           currentUser = db.collection("users");
          //  .doc(user.uid).collection('myVehicles'); // will to to the firestore and go to the document of the user
           currentUser.get().then(vehicleList=>{
            vehicleList.forEach((doc)=>{ 
               //get the user name
               // <<.example insert here.>> .doc.id
               var vehicleName = doc.data().vehicle_name;
               var vehicleType = doc.data().vehicle_type;  // get value of the "details" key
               var vehicleTires = doc.data().vehicle_tires;    //get unique ID to each hike to be used for fetching right image
               var vehicleDrivetrain = doc.data().vehicle_drivetrain;
               $("#vehicle-name").text(vehicleName); //jquery
               $("#vehicle-type").text(vehicleType); //jquery
               $("#vehicle-tires").text(vehicleTires); //jquery
               $("#vehicle-drivetrain").text(vehicleDrivetrain);})
           }) 
       }    
    })
}
insertVehicleFromFirestore()


//Function adds a new vehicle to the collection.//
function addVehicle() {
    firebase.auth().onAuthStateChanged(user =>{
        if (user){
        console.log(user.uid); 
        currentUser = db.collection("users").doc(user.uid);
        let tire = document.getElementById("tires").value;
        let type = document.getElementById("type").value;
        let drivetrain = document.getElementById("drivetrain").value;
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
})}

// ******To change current database call*******
function displayCardsDynamically(collection, containerId) {
  firebase.auth().onAuthStateChanged(user =>{
    if(user) {  
  console.log("displaying cards in container:", containerId);
    let select = document.createElement("select");
    let placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.text = "Choose...";
    select.appendChild(placeholder);
    var vehicleRef = db.collection('users').doc(user.uid).collection('myVehicles');

    vehicleRef.get()
      .then(allvehicle => {
        allvehicle.forEach(doc => {
          var title = doc.data().vehicle_name;
          var type = doc.data().vehicle_type;
          var tire = doc.data().vehicle_tires;
          var dt = doc.data().vehicle_drivetrain;
          const option = document.createElement('option');
          option.value = (title + "," + type + "," + tire + "," + dt);
          option.text = (title + ": " + type + " with " + tire + " tires and " + dt);
          // console.log(option.value);
          select.appendChild(option);
        });

        select.addEventListener("click", (event) => {
          updateUserData(event.target.value);
        });
        
        document.getElementById(containerId).appendChild(select);
      })
      .catch(error => {
        console.error(error);
      });
}})}
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

function updateUserData(option) {
  console.log(option);
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      const [title, type, tire, dt] = option.split(",");
      db.collection("users").doc(user.uid).update({
        vehicle_name: title,
        vehicle_type: type,
        vehicle_tires: tire,
        vehicle_drivetrain: dt
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


//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// Code Testing
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// Ask Jesse about localhost variable setter to apply that takes in the
// selected option as the optionValue to be parsed
// function updateUserData(option) {
//   console.log(option);
//   firebase.auth().onAuthStateChanged(function(user) {
//     const [title, type, tire, dt] = option.split(",");
//     if (user) {
//       currentUser = db.collection("users").doc(user.uid);
//       // currentUser.get().then(vehicleList => {
//       //   vehicleList.forEach(doc => {
//           currentUser.set({
//             vehicle_name: title,
//             vehicle_type: type,
//             vehicle_tires: tire,
//             vehicle_drivetrain: dt,
// function updateUserData(option) {
//   console.log(option);
//   firebase.auth().onAuthStateChanged(function (user) {
//     if (user) {
//       const [title, type, tire, dt] = option.split(",");
//       db.collection("users").doc(user.uid).update({
//         vehicle_name: title,
//         vehicle_type: type,
//         vehicle_tires: tire,
//         vehicle_drivetrain: dt
//           }, { merge: true })
//           .then(() => {
//             console.log("User data successfully updated!");
//           })
//           .catch(error => {
//             console.error("Error updating user data: ", error);
//           });
// }});
//       }
//       )
//     }
//   });
// }




//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&//
// *** Accidentally made a vehicle information update function, to be implemented elsewhere ***///
// function updateUserData(optionValue) {
//   firebase.auth().onAuthStateChanged(function(user) {
//     const [title, type, tire, dt] = optionValue.split(",");
//     if (user) {
//       currentUser = db.collection("users").doc(user.uid);v
//       let tire = document.getElementById("tires").value;
//       let type = document.getElementById("type").value;
//       let drivetrain = document.getElementById("drivetrain").value;
//       let nickname = document.getElementById("vehicle_name").value; 
//       currentUser.collection("myVehicles").get().then(vehicleList => {
//         vehicleList.forEach(doc => {
//           doc.ref.update({
//             vehicle_name: title,
//             vehicle_type: type,
//             vehicle_tires: tire,
//             vehicle_drivetrain: dt,
//           }, { merge: true })
//           .then(() => {
//             console.log("User data successfully updated!");
//           })
//           .catch(error => {
//             console.error("Error updating user data: ", error);
//           });
//         });
//       })
//     }
//   });
// }
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&//


// function updateUserData(optionValue) {
//     firebase.auth().onAuthStateChanged(function(user) {
//       const [title, type, tire, dt] = optionValue.split(",");
//       if (user) {
//         currentUser = db.collection("users");
//         currentUser.get().then(vehicleList=>{
//         vehicleList.forEach().update({
//           vehicle_name: title,
//           vehicle_type: type,
//           vehicle_tires: tire,
//           vehicle_drivetrain: dt,
//         }, { merge: true })
//         .then(() => {
//           console.log("User data successfully updated!");
//         })
//         .catch(error => {
//           console.error("Error updating user data: ", error);
//         });
//       })
//     }});
//   }
  

// "db.collection('users').doc(user.uid).collection('myVehicles').doc(vehicleDoc)"   ".update()   ;  doc.id


// function updateUserData(optionValue) {
//     const [title, type, tire, drivetrain] = optionValue.split(",");
//     firebase.auth().onAuthStateChanged(function(user) {
//       if (user) {
//         db.collection(collection).get()
//          .then(currentvehicle => {
//         currentvehicle.forEach(doc => {
//           var title = doc.data().vehicle_name;
//           var type = doc.data().vehicle_type;
//           var tire = doc.data().vehicle_tires;
//           var dt = doc.data().vehicle_drivetrain;
//         db.collection("users").doc(user.uid).set({
//           vehicle_name: title,
//           vehicle_type: type,
//           vehicle_tires: tire,
//           vehicle_drivetrain: dt,
//         }, { merge: true }
//         .then(() => {
//           console.log("User data successfully updated!");
//         })
//         .catch(error => {
//           console.error("Error updating user data: ", error);
//         }));
//       })
//     });}
//   }
  