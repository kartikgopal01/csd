// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1fA5yNiuNL_l1DAikiy7XrH1BT_u7rQA",
  authDomain: "dept-csd.firebaseapp.com",
  projectId: "dept-csd",
  storageBucket: "dept-csd.firebasestorage.app",
  messagingSenderId: "552884935197",
  appId: "1:552884935197:web:07ead1a6e85ef434de84f4",
  measurementId: "G-D5DL153RVZ"
};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Initialize analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.log('Analytics initialization skipped:', error.message);
  }
}
export { analytics };