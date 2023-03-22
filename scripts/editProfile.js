//Function works to change the car type, not actually add a new vehicle to the collection.//
function userProfile() {
    firebase.auth().onAuthStateChanged(user =>{
        if (user){
        console.log(user.uid); 
        currentUser = db.collection("users").doc(user.uid);
        let fName = document.getElementById("inputFirstName").value;
        let lName = document.getElementById("inputLastName").value;
        //let located = document.getElementById("inputLocation").value;
        let email = document.getElementById("inputEmailAddress").value;        

        currentUser.set({ 
            fname: fName,
            lname: lName,
            email: email,
            //location: located,
    }).then(function () {
        console.log("New user information added to firestore");
        //window.location.assign("new_vehicle_add.html");       //re-direct to vehicle.html after adding specs.
        window.location.assign("index.html");       //re-direct to index.html after adding specs.
 }).catch(function (error) {
        console.log("Error adding new vehicle: " + error);
 });
} else {
 return true;
}
 return false;
})}


function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    var fName = userDoc.data().fname;
                    var lName = userDoc.data().lname;
                    var email = userDoc.data().email;
                    var location = userDoc.data().location;

                    //if the data fields are not empty, then write them in to the form.
                    if (fName != null) {
                        document.getElementById("inputFirstName").value = fName;
                    }
                    if (lName != null) {
                        document.getElementById("inputLastName").value = lName;
                    } 
                    if (location != null) {
                        document.getElementById("inputLocation").value = location;
                    }
                    if (email != null) {
                        document.getElementById("inputEmailAddress").value = email;
                    }
                })
        } else {
            // No user is signed in.
            console.log ("No user is signed in");
        }
    });
}

//call the function to run it 
populateUserInfo();