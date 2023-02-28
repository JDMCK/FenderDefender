var firebaseConfig = {
  apiKey: "AIzaSyCcjyl44eHQwAo8oEcOBbxZI5dA3BiTNcQ",
  authDomain: "project-5895497555980020212.firebaseapp.com",
  projectId: "project-5895497555980020212",
  storageBucket: "project-5895497555980020212.appspot.com",
  messagingSenderId: "490172205289",
  appId: "1:490172205289:web:5ffc801eeb70a3c4050878"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();