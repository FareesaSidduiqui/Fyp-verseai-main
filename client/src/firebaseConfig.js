// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth , GoogleAuthProvider} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnSDxnnsJAfCUzm9v_OdPduTfDrwp2ytQ",
  authDomain: "verse-ai-2025.firebaseapp.com",
  projectId: "verse-ai-2025",
  storageBucket: "verse-ai-2025.firebasestorage.app",
  messagingSenderId: "254698381921",
  appId: "1:254698381921:web:602c03eae182e554c08020",
  measurementId: "G-G8F1VJHSNY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Auth export
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account"  // 🔥 forces account selection dialog
});