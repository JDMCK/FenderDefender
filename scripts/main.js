function insertName() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            user_Name = user.displayName;

            //method #1:  insert with html only
            //document.getElementById("name-goes-here").innerText = user_Name;    //using javascript
            //method #2:  insert using jquery
            $("#name-goes-here").text(user_Name); //using jquery

        } else {
            // No user is signed in.
        }
    });
}
insertName(); //run the function


function insertNameFromFirestore(){
    // to check if the user is logged in:
    firebase.auth().onAuthStateChanged(user =>{
        if (user){
           console.log(user.uid); // let me to know who is the user that logged in to get the UID
           currentUser = db.collection("users").doc(user.uid); // will to to the firestore and go to the document of the user
           currentUser.get().then(userDoc=>{
               //get the user name
               var userName= userDoc.data().name;
               console.log(userName);
               //$("#name-goes-here").text(userName); //jquery
               document.getElementById("name-goes-here").innerText=userName;
           })    
       }    
    })
}
insertNameFromFirestore()

function insertVehicleType() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(vehicle.type);  //print the user name in the browser console
            console.log(vehicle.tire);
            console.log(vehicle.drivetrian);
            vehicle_type = "Summer";
            vehicle_tire = vehicle.tire;
            vehicle_drivetrian = vehicle.drivetrian;

            //method #1:  insert with html only
            //document.getElementById("name-goes-here").innerText = user_Name;    //using javascript
            //method #2:  insert using jquery
            $("#vehicle_type_here").text(vehicle_type); //using jquery
            $("#vehicle_tire_here").text(vehicle_tire);
            $("#vehicle_drivetrain_here").text(vehicle_drivetrian);

        } else {
            // No user is signed in.
        }
    });
}
insertName(); //run the function

