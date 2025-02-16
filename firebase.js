import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBbdZ_LPbk5r11pmWv2cYbMrmBZWyZlMrs",
  authDomain: "tinder-my-19299.firebaseapp.com",
  projectId: "tinder-my-19299",
  storageBucket: "tinder-my-19299.appspot.com",
  messagingSenderId: "669195874983",
  appId: "1:669195874983:web:0a2cdd6803b968411f2182",
  measurementId: "G-MWF190ZSYJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firebase Storage
const storage = getStorage(app);

export { db, auth, storage };
