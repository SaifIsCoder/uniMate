import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !studentId || !department || !email || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    setLoading(true);

    try {
      // 1: Create Firebase Auth user
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCred.user;

      // 2: Update profile (displayName)
      await updateProfile(user, { displayName: name });

      // 3: Save profile to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        studentId,
        department,
        role: "student",
        createdAt: new Date().toISOString(),
      });

      // 4: Send email verification
      await sendEmailVerification(user);

      Alert.alert(
        "Verify Email",
        "Account created! Please check your email and verify before logging in."
      );

      // 5: Redirect to Login (NOT MainTabs)
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Signup Failed", error.message);
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Student Account</Text>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Student ID"
        value={studentId}
        onChangeText={setStudentId}
        style={styles.input}
      />

      <TextInput
        placeholder="Department"
        value={department}
        onChangeText={setDepartment}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1E88E5",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#1E88E5",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  link: { color: "#1E88E5", marginTop: 10 },
});
