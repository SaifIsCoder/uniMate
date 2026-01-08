import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Animated, Easing } from "react-native";
import { useUser } from "../context/UserContext";

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const { user, loading } = useUser();

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

    // Wait for user context to load and animation to complete
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      if (!loading) {
        if (user) {
          // User is logged in - go to main app
          navigation.replace("MainTabs");
        } else {
          // User is not logged in - go to Login
          navigation.replace("Login");
        }
      }
    };

    checkAuth();
  }, [user, loading, navigation]);

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
        uniMate
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
