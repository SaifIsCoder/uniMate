import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authenticateStudent } from "../services/authService";
import { useUser } from "../context/UserContext";
import { auth } from "../config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SeedButton from "../components/SeedButton";

export default function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useUser();

  const handleLogin = async () => {
    if (!identifier.trim()) {
      Alert.alert("Error", "Please enter your Student ID or Email");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    setLoading(true);

    try {
      // Authenticate with Firebase
      const student = await authenticateStudent(identifier.trim(), password);

      if (!student) {
        Alert.alert(
          "Login Failed",
          "Invalid credentials or account not found. Please check your Student ID or Email."
        );
        setLoading(false);
        return;
      }

      // Get and store Firebase Auth token immediately after login
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        await AsyncStorage.setItem("firebase_token", token);
        await AsyncStorage.setItem("firebase_uid", firebaseUser.uid);
      }

      // Store user data (token is now stored in AsyncStorage)
      setUser(student, student.uid);

      navigation.replace("MainTabs");
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Failed", error.message || "An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Welcome Back</Text>

        <TextInput
          placeholder="Student ID or Email"
          value={identifier}
          onChangeText={setIdentifier}
          keyboardType="default"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.info}>
          Use your Student ID (e.g., BSCS-23-041) or Email to login
        </Text>
        <Text style={styles.testInfo}>
          Default password: Your Student ID{'\n'}
          Example: BSCS-23-041 / BSCS-23-041
        </Text>

        {/* Seed Button - Remove after seeding */}
        <SeedButton />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1E88E5",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#1E88E5",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  info: {
    marginTop: 15,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  testInfo: {
    marginTop: 10,
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
  },
});
