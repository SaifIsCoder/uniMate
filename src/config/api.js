// API Configuration
// IMPORTANT: For physical Android device, you need to use your computer's IP address
// Find your IP: Run 'ipconfig' in terminal and look for IPv4 Address (usually 192.168.x.x)
// Then change the API_BASE_URL below to: http://YOUR_IP:4000

// For Android emulator: http://10.0.2.2:4000
// For iOS simulator: http://localhost:4000
// For physical device: http://YOUR_COMPUTER_IP:4000 (e.g., http://192.168.1.100:4000)

// Get API URL from environment variable or use defaults
// Set EXPO_PUBLIC_API_BASE_URL in .env file
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  (__DEV__ ? "http://10.0.2.2:4000" : "http://localhost:4000");

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  // AUTH: {
  //   LOGIN: `${API_BASE_URL}/api/auth/login`,
  //   SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  // },
  USERS: {
    ME: `${API_BASE_URL}/api/users/me`,
    STATS: `${API_BASE_URL}/api/users/me/stats`,
  },
  CLASSES: {
    ALL: `${API_BASE_URL}/api/classes`,
    TODAY: `${API_BASE_URL}/api/classes/today`,
    BY_DAY: (day) => `${API_BASE_URL}/api/classes/day/${day}`,
  },
  ASSIGNMENTS: {
    ALL: `${API_BASE_URL}/api/assignments`,
    BY_ID: (id) => `${API_BASE_URL}/api/assignments/${id}`,
    SUBMIT: (id) => `${API_BASE_URL}/api/assignments/${id}/submit`,
  },
  EVENTS: {
    ALL: `${API_BASE_URL}/api/events`,
    BY_ID: (id) => `${API_BASE_URL}/api/events/${id}`,
  },
  NOTIFICATIONS: {
    ALL: `${API_BASE_URL}/api/notifications`,
    UNREAD: `${API_BASE_URL}/api/notifications/unread`,
    MARK_READ: (id) => `${API_BASE_URL}/api/notifications/${id}/read`,
  },
  ATTENDANCE: {
    ALL: `${API_BASE_URL}/api/attendance`,
  },
};

// Helper to get token from AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Helper function to make authenticated API calls
export const apiCall = async (url, options = {}) => {
  const token = await getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }

  return response.json();
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem("token");
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

export const setToken = async (token) => {
  try {
    await AsyncStorage.setItem("token", token);
  } catch (error) {
    console.error("Error setting token:", error);
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("token");
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

export default API_ENDPOINTS;
