import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, setPersistenceToLocal } from '../firebase/credentials';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc, getFirestore } from 'firebase/firestore';

// Create AuthContext
const AuthContext = createContext();

// Define AuthContextProvider
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setPersistenceToLocal(); // Set persistence to local storage

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user data from Firestore
        const userDocRef = doc(getFirestore(), 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUser({ uid: user.uid, name: userData.nombre });
        } else {
          setUser({ uid: user.uid, name: user.email }); // Fallback to email if no name
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuthContext = () => {
  return useContext(AuthContext);
};

// Named export for AuthContext
export { AuthContext };