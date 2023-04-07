// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {

      var user = authResult.user;                            // get the user object from the Firebase authentication database
      if (authResult.additionalUserInfo.isNewUser) {         //if new user
        let username = user.displayName.replace(" ", ",");
        const [fname, lname] = username.split(",");
          db.collection("users").doc(user.uid).set({         //write to firestore. We are using the UID for the ID in users collection
                 fname: fname,                    //"users" collection
                 lname: lname,
                 email: user.email,
          }).then(function () {
                 window.location.assign("new_vehicle_add.html");       //re-direct to index.html after signup
          }).catch(function (error) {
                 console.log("Error adding new user: " + error);
          });
      } else {
          return true;
      }
          return false;
      },
    uiShown: function () {
      document.getElementById( 'loader' ).style.display = 'none';
    }
  },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'index.html',
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
  };

  ui.start('#firebaseui-auth-container', uiConfig);
