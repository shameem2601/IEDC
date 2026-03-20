import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB10kzJWld9P9f378suJChtyYMDeHNAAL0",
  authDomain: "iedc-website-2.firebaseapp.com",
  projectId: "iedc-website-2",
  storageBucket: "iedc-website-2.firebasestorage.app",
  messagingSenderId: "889411924349",
  appId: "1:889411924349:web:39d7ee7728564d394d5c14",
  measurementId: "G-TVHVYDE55B"
};

const app = initializeApp(firebaseConfig);
export let analytics = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});
