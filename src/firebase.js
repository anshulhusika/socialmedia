
import * as firebase from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "@firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyA13Mmsl0RpqGWtw05fOv_RYODtlevezrU",
  authDomain: "socialmedia-14fbd.firebaseapp.com",
  databaseURL: "https://socialmedia-14fbd.firebaseio.com",
  projectId: "socialmedia-14fbd",
  storageBucket: "socialmedia-14fbd.appspot.com",
  messagingSenderId: "390415671166",
  appId: "1:390415671166:web:07aa3a08e76e750d929d2f",
  measurementId: "G-S4CBMY6VKP"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const storage = getStorage();

export const db = getFirestore(app);
export const auth = getAuth(app);
export default firebase;
