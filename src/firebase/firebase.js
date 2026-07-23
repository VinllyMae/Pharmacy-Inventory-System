import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAOvQADU1Sgf05GdrnL0kAxRsBWId7Twdk",
  authDomain: "medtrack-4132d.firebaseapp.com",
  projectId: "medtrack-4132d",
  storageBucket: "medtrack-4132d.firebasestorage.app",
  messagingSenderId: "759949378367",
  appId: "1:759949378367:web:5b0c845197a9fd517d898a",
};

const app = initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;