import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA3HoSI8MxW-JJylGG52tdzOIHoUfLRNPs",
  authDomain: "memoir-1296.firebaseapp.com",
  projectId: "memoir-1296",
  storageBucket: "memoir-1296.firebasestorage.app",
  messagingSenderId: "125543487374",
  appId: "1:125543487374:web:2bfd48bfd7568d205bf6df",
  measurementId: "G-LPNWKGG8C4"
};

export const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();




