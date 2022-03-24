import { initializeApp } from "firebase/app";
import {   getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
    apiKey: "AIzaSyCmy-1a9sYnhG_dS_hdB0IfM_I1ViAu4tA",
    authDomain: "fir-99b86.firebaseapp.com",
    projectId: "fir-99b86",
    storageBucket: "fir-99b86.appspot.com",
    messagingSenderId: "64359081462",
    appId: "1:64359081462:web:5012a7dffb8c5f570353d7",
    measurementId: "G-JWQCY30K92"
};
import { getFirestore } from 'firebase/firestore';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app)
export const auth = getAuth(app);
export const storage = getStorage(app);
auth.onAuthStateChanged(async (user) => {
    if (user) {
        //user logged
    } else {
        // user not logged
    }
})

