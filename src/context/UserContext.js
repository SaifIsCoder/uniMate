import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChange, getCurrentStudent, signOut as firebaseSignOut } from "../services/authService";
import { auth } from "../config/firebase";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from Firebase Auth on mount
  useEffect(() => {
    let isMounted = true;
    
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get Firebase Auth token and store it
          const token = await firebaseUser.getIdToken();
          await AsyncStorage.setItem("firebase_token", token);
          await AsyncStorage.setItem("firebase_uid", firebaseUser.uid);
          
          // Get their student profile from Firestore
          const studentData = await getCurrentStudent();
          if (studentData && isMounted) {
            // Store student data in AsyncStorage for persistence
            await AsyncStorage.setItem("user_data", JSON.stringify(studentData));
            setUser(studentData);
          } else if (isMounted) {
            // If student data not found, clear storage
            await AsyncStorage.removeItem("firebase_token");
            await AsyncStorage.removeItem("firebase_uid");
            await AsyncStorage.removeItem("user_data");
            setUser(null);
          }
        } else {
          // User is signed out, clear storage
          if (isMounted) {
            await AsyncStorage.removeItem("firebase_token");
            await AsyncStorage.removeItem("firebase_uid");
            await AsyncStorage.removeItem("user_data");
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    // Also try to load from AsyncStorage on initial mount for faster display
    loadUserFromStorage();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Load user from AsyncStorage on app start (for faster initial display)
  const loadUserFromStorage = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("user_data");
      const storedToken = await AsyncStorage.getItem("firebase_token");
      
      if (storedUserData && storedToken) {
        const userData = JSON.parse(storedUserData);
        setUser(userData);
        // Firebase Auth will verify the token automatically
      }
    } catch (error) {
      console.error("Error loading user from storage:", error);
    }
  };

  const updateUser = async (userData, uid) => {
    setUser(userData);
    // Store in AsyncStorage
    if (userData) {
      await AsyncStorage.setItem("user_data", JSON.stringify(userData));
      
      // Ensure token is stored if we have a Firebase user
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          await AsyncStorage.setItem("firebase_token", token);
          await AsyncStorage.setItem("firebase_uid", firebaseUser.uid);
        } catch (error) {
          console.error("Error storing token:", error);
        }
      }
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut();
      await AsyncStorage.removeItem("firebase_token");
      await AsyncStorage.removeItem("firebase_uid");
      await AsyncStorage.removeItem("user_data");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
