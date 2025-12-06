

import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAK2716qyOm2B_bDCON4Qk7Ytu0kXvMmgE",
  authDomain: "campus-companion-app-f6378.firebaseapp.com",
  projectId: "campus-companion-app-f6378",
  storageBucket: "campus-companion-app-f6378.firebasestorage.app",
  messagingSenderId: "904475174828",
  appId: "1:904475174828:web:36c50c416b82b1cef5fc09",
  measurementId: "G-S5BTW6PC32"
};
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);
