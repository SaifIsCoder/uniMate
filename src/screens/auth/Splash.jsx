import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { useUser } from "../../context/UserContext";

const { height } = Dimensions.get("window");
const logoImage = require("../../../assets/logo.png");

export default function SplashScreen({ navigation }) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.92)).current;
  const textTranslate = useRef(new Animated.Value(20)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;
  const { user, loading } = useUser();

  useEffect(() => {
    // Run animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textTranslate, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(dotsOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

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
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Image source={logoImage} style={styles.logo} resizeMode="contain" />
      </Animated.View>

      <Animated.Text
        style={[
          styles.title,
          { transform: [{ translateY: textTranslate }] },
        ]}
      >
        uniMate
      </Animated.Text>

      <Text style={styles.tagline}>Progress Starts Here.</Text>

      <Animated.Text style={[styles.dots, { opacity: dotsOpacity }]}>
        • • •
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A", // Deep navy
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: height * 0.04,
  },
  logo: {
    width: 90,
    height: 90,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.5,
    marginTop: -30,
  },
  tagline: {
    marginTop: 6,
    fontSize: 14,
    color: "#CBD5E1",
    letterSpacing: 0.3,
  },
  dots: {
    position: "absolute",
    bottom: 50,
    fontSize: 18,
    color: "#6366F1",
  },
});
