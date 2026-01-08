import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import { authenticateStudent } from '../../services/authService';
import { useUser } from '../../context/UserContext';
import { auth } from '../../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SeedButton from '../../components/SeedButton';

export default function Login({ navigation }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { setUser } = useUser();

  const handleLogin = async () => {
    if (!identifier.trim()) {
      Alert.alert('Error', 'Please enter your Student ID or Email');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setLoading(true);

    try {
      // Authenticate with Firebase
      const student = await authenticateStudent(identifier.trim(), password);

      if (!student) {
        Alert.alert(
          'Login Failed',
          'Invalid credentials or account not found. Please check your Student ID or Email.'
        );
        setLoading(false);
        return;
      }

      // Get and store Firebase Auth token immediately after login
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        await AsyncStorage.setItem('firebase_token', token);
        await AsyncStorage.setItem('firebase_uid', firebaseUser.uid);
      }

      // Store user data (token is now stored in AsyncStorage)
      setUser(student, student.uid);

      navigation.replace('MainTabs');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message || 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
    
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              alt="App Logo"
              resizeMode="contain"
              style={styles.headerImg}
              source={{ uri: 'https://assets.withfra.me/SignIn.2.png' }} />

            <Text style={styles.title}>
              Sign in to <Text style={{ color: '#075eec' }}>uniMate</Text>
            </Text>

            {/* <Text style={styles.subtitle}>
              Get access to your schedule and more
            </Text> */}
          </View>

          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Student ID or Email</Text>

              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="default"
                onChangeText={setIdentifier}
                placeholder="BSCS-23-041 or email@example.com"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={identifier} />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Password</Text>

              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={setPassword}
                placeholder="********"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={password} />
            </View>

            <View style={styles.formAction}>
              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}>
                <View style={[styles.btn, loading && styles.btnDisabled]}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.btnText}>Sign in</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* <Text style={styles.info}>
              Use your Student ID (e.g., BSCS-23-041) or Email to login
            </Text>
            <Text style={styles.testInfo}>
              Default password: Your Student ID{'\n'}
              Example: BSCS-23-041 / BSCS-23-041
            </Text> */}

            {/* Seed Button - Remove after seeding */}
            {/* <SeedButton /> */}

            {/* <TouchableOpacity
              onPress={() => {
                // handle link
              }}>
              <Text style={styles.formLink}>Forgot password?</Text>
            </TouchableOpacity> */}
          </View>
        </View>
   

      {/* <TouchableOpacity
        onPress={() => {
          // handle link
        }}>
        <Text style={styles.formFooter}>
          Don't have an account?{' '}
          <Text style={{ textDecorationLine: 'underline' }}>Sign up</Text>
        </Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    padding: 24,
    // The 'border' property is not valid in React Native styles.
    // If you want to indicate a border for debugging, use:
    
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  /** Header */
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
    marginTop: 86,
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 36,
  },
  /** Form */
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#075eec',
    textAlign: 'center',
  },
  formFooter: {
    paddingVertical: 24,
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  /** Input */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderStyle: 'solid',
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#075eec',
    borderColor: '#075eec',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  info: {
    marginTop: 15,
    marginBottom: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  testInfo: {
    marginBottom: 16,
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});