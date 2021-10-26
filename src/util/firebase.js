import firebase from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyCl-eLi6K19lxYcyM6XNWHQLufcKXRJ3EA",
  authDomain: "world-from-home.firebaseapp.com",
  projectId: "world-from-home",
  storageBucket: "world-from-home.appspot.com",
  messagingSenderId: "774028887408",
  appId: "1:774028887408:web:a63d032375b950ddca7bb5",
  measurementId: "G-JZ4M2WGJKB",
};
firebase.initializeApp(firebaseConfig);

export default firebase;

// let instance;

// export default function getFirebase() {
//   if (typeof window !== "undefined") {
//     if (instance) return instance;
//     instance = firebase.initializeApp(firebaseConfig);
//     return instance;
//   }

//   return null;
// }
