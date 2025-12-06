import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Animated, Easing } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useUser } from "../context/UserContext";

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const { setUser } = useUser();

  useEffect(() => {
    // Run animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Check auth state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Wait for animation to complete
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (user) {
        // User is logged in - fetch user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data());
          }
          navigation.replace("MainTabs");
        } catch (error) {
          console.log("Error fetching user data:", error);
          navigation.replace("MainTabs");
        }
      } else {
        // User is not logged in - go to Login
        navigation.replace("Login");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        Campus Companion
      </Animated.Text>

      <ActivityIndicator size="large" color="#fff" style={{ marginTop: 25 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E88E5",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});
