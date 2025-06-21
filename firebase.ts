import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDYVlTvUI_3t4ei9PqdWGXWhpSE1RRXNRI",
  authDomain: "notion-clone-e5da0.firebaseapp.com",
  projectId: "notion-clone-e5da0",
  storageBucket: "notion-clone-e5da0.firebasestorage.app",
  messagingSenderId: "416806324245",
  appId: "1:416806324245:web:62e0227198e9233937261c",
  measurementId: "G-SBBFN5H562",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
export { db };