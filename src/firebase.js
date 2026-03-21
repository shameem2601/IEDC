import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB10kzJWld9P9f378suJChtyYMDeHNAAL0",
  authDomain: "iedc-website-2.firebaseapp.com",
  projectId: "iedc-website-2",
  storageBucket: "iedc-website-2.firebasestorage.app",
  messagingSenderId: "889411924349",
  appId: "1:889411924349:web:39d7ee7728564d394d5c14",
  measurementId: "G-TVHVYDE55B"
};

let app, db, storage, analytics = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  storage = getStorage(app);
  
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
} catch (error) {
  console.error("Critical Firebase Initialization Error! Running in offline/mock mode.", error);
  db = null;
  storage = null;
}

export { db, storage, analytics };
