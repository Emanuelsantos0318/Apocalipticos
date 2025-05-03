import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

export { auth, signInAnonymously, db };

const firebaseConfig = {
    apiKey: "AIzaSyAVS_gb4f31FKb0jY11U-w7PmIVBxmaNxc",
    authDomain: "apocalipticos-ab93c.firebaseapp.com",
    projectId: "apocalipticos-ab93c",
    storageBucket: "apocalipticos-ab93c.firebasestorage.app",
    messagingSenderId: "889560921943",
    appId: "1:889560921943:web:a6e8bef2bb66cd613fb012",
    measurementId: "G-XB7ND9CH0L"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
