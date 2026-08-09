import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// SaveLife Hospital Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2HSwV6NzdkVtQEm5fC0yAU1010Dhnu3Y",
  authDomain: "savelife-hospital-768bc.firebaseapp.com",
  projectId: "savelife-hospital-768bc",
  storageBucket: "savelife-hospital-768bc.firebasestorage.app",
  messagingSenderId: "655205114139",
  appId: "1:655205114139:web:bc1cfbc41bb27e58acf3be"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
