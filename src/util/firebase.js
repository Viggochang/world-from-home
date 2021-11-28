import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_APP_ID,
// };

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

const db = firebase.firestore();
const storage = firebase.storage();
const db_userInfo = db.collection("user_info");
const db_gallery = db.collection("gallery");
const db_tourist_spot = db.collection("tourist_spot");

function onAuthStateChanged(callback) {
  firebase.auth().onAuthStateChanged((user) => callback(user));
}

function getUserIsExist(uid) {
  return db_userInfo
    .doc(uid)
    .get()
    .then((doc) => {
      return doc.exists;
    });
}
function getAlbumIsExist(id) {
  return db_gallery
    .doc(id)
    .get()
    .then((doc) => {
      return doc.exists;
    });
}

function getUserDataByUid(uid) {
  return db_userInfo
    .doc(uid)
    .get()
    .then((doc) => doc.data());
}

function getAlbumDataById(id) {
  return db_gallery
    .doc(id)
    .get()
    .then((doc) => doc.data());
}

function getTouristSpotByAlbumId(albumId) {
  return db_tourist_spot
    .where("album_id", "==", albumId)
    .get()
    .then((snapshot) => snapshot.docs.map((doc) => doc.data()));
}

function getTouristSpotsData() {
  return db_tourist_spot
    .get()
    .then((snapshot) =>
      snapshot.docs
        .filter((doc) => doc.data().condition === "completed")
        .map((doc) => doc.data())
    );
}

function getFriendsHere(countryId, callback) {
  return db_gallery
    .where("country", "==", countryId)
    .get()
    .then((allAlbums) => callback(allAlbums.docs.map((album) => album.data())));
}

function setUserDataIntoDb(docId, body) {
  return db_userInfo.doc(docId).set(body);
}
function setAlbumDataIntoDb(docId, body) {
  return db_gallery.doc(docId).set(body);
}
function setTouristSpotDataIntoDb(docId, body) {
  return db_tourist_spot.doc(docId).set(body);
}

function onSnapShotByUid(uid, callback) {
  return db_userInfo.doc(uid).onSnapshot((doc) => {
    callback(doc.data());
  });
}
function onSnapShotMyTravelCountry(uid, callback) {
  return db_gallery
    .where("user_id", "==", uid || null)
    .onSnapshot((myAlbums) =>
      callback(myAlbums.docs.map((album) => album.data()))
    );
}
function onSnapshotMyFriend(id, condition, callback) {
  return db_userInfo
    .where("friends", "array-contains", { id: id, condition: condition })
    .onSnapshot((myFriends) =>
      callback(myFriends.docs.map((friend) => friend.data()))
    );
}
function onSnapshotAlbumByAlbumId(albumId, callback) {
  return db_gallery.doc(albumId).onSnapshot((doc) => {
    if (doc.exists) {
      callback(doc.data().praise.length);
    }
  });
}
function onSnapshotAlbumByUserId(uid, callback) {
  return db_gallery.where("user_id", "==", uid).onSnapshot((querySnapshot) => {
    callback(querySnapshot.docs.map((doc) => doc.data()));
  });
}
function onSnapshotAlbumByCountry(countryId, callback) {
  return db_gallery
    .where("country", "==", countryId)
    .onSnapshot((querySnapshot) => {
      callback(querySnapshot.docs.map((doc) => doc.data()));
    });
}
function onSnapshotTouristSpot(callback) {
  return db_tourist_spot
    .where("condition", "==", "completed")
    .onSnapshot((allSpots) => callback(allSpots.docs.map((doc) => doc.data())));
}

function updateUser(uid, body) {
  return db_userInfo.doc(uid).update(body);
}
function updateAlbum(albumId, body) {
  return db_gallery.doc(albumId).update(body);
}
function updateTouristSpot(spotId, body) {
  return db_tourist_spot.doc(spotId).update(body);
}

function deleteAlbum(albumId) {
  return db_gallery.doc(albumId).delete();
}
function deleteTouristSpot(spotId) {
  return db_tourist_spot.doc(spotId).delete();
}

export {
  firebase,
  storage,
  db_userInfo,
  db_gallery,
  db_tourist_spot,
  onAuthStateChanged,
  getUserIsExist,
  getAlbumIsExist,
  getUserDataByUid,
  getAlbumDataById,
  getTouristSpotByAlbumId,
  getTouristSpotsData,
  getFriendsHere,
  setUserDataIntoDb,
  setAlbumDataIntoDb,
  setTouristSpotDataIntoDb,
  onSnapShotByUid,
  onSnapShotMyTravelCountry,
  onSnapshotMyFriend,
  onSnapshotAlbumByAlbumId,
  onSnapshotAlbumByUserId,
  onSnapshotAlbumByCountry,
  onSnapshotTouristSpot,
  updateAlbum,
  updateUser,
  updateTouristSpot,
  deleteAlbum,
  deleteTouristSpot,
};

// let instance;

// export default function getFirebase() {
//   if (typeof window !== "undefined") {
//     if (instance) return instance;
//     instance = firebase.initializeApp(firebaseConfig);
//     return instance;
//   }

//   return null;
// }
