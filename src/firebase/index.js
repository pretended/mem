import { initializeApp } from "firebase/app";
import {   getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
    // api config
};
import { getFirestore } from 'firebase/firestore';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app)
export const auth = getAuth(app);
export const storage = getStorage(app);
