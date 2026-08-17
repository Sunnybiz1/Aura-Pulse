import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Default Firebase configuration (usable for local emulator or mock fallback)
const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyForLocalTestingMode12345",
  authDomain: "jabbfit-app.firebaseapp.com",
  projectId: "jabbfit-app",
  storageBucket: "jabbfit-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:demo123456789012"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
