import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import {
  getFirestore,
  //connectFirestoreEmulator
} from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Inicialização
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Configurar persistência local explícita
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Erro ao definir persistência de auth:", error);
});

// Analytics condicional (não quebra em desenvolvimento)
let analytics;
isSupported().then((supported) => {
  if (supported) analytics = getAnalytics(app);
});

// Exportações organizadas
export {
  auth,
  db,
  analytics,
  signInAnonymously,
  onAuthStateChanged,
  GoogleAuthProvider,
};
