import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, collection, getDoc, setDoc, doc } from "firebase/firestore";  // Importa doc desde firebase/firestore, no desde credentials.js

const firebaseConfig = {
  apiKey: "AIzaSyBe5WBAEUT6xMs-pZbGNDRf1rjW6moKGus",
  authDomain: "lucha-b3119.firebaseapp.com",
  projectId: "lucha-b3119",
  storageBucket: "lucha-b3119.appspot.com",
  messagingSenderId: "510552591120",
  appId: "1:510552591120:web:a0c2a852a5ef68da9cb395",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const setPersistenceToLocal = async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (error) {
    console.error('Error setting persistence:', error);
  }
};

export default app;
