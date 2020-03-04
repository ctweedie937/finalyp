import firebase from 'firebase';

import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyCGnET50Luv_0qHgK8iBCq3J7obfydKt4g",
    authDomain: "fake-news-fyp.firebaseapp.com",
    databaseURL: "https://fake-news-fyp.firebaseio.com",
    projectId: "fake-news-fyp",
    storageBucket: "fake-news-fyp.appspot.com",
    messagingSenderId: "964296198703",
    appId: "1:964296198703:web:ca4f2deea9fc481ecbd4da",
    measurementId: "G-6TV0SCWVZC"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// let db = firebase.database();

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export const db = firebase.firestore();


export default firebase;