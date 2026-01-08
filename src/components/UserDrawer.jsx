// components/UserDrawer.js
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { useUser } from "../context/UserContext";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
const { width } = Dimensions.get("window");
const defaultAvatar = require("../../assets/avatar.jpg");
export default function UserDrawer({ visible, onClose }) {
  const slideAnim = useRef(new Animated.Value(width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const { user, logout } = useUser();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: width,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
      onClose();
    } catch (error) {
      Alert.alert("Logout Failed", error.message);
    }
  };

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[styles.overlay, { opacity: fadeAnim }]}
    >
      {/* Tap outside to close */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>

      {/* Drawer Content */}
      <Animated.View
        style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={user?.avatarUrl ? { uri: user.avatarUrl } : defaultAvatar}
            style={styles.avatar}
          />
          <Text style={styles.username}>{user?.name || "Student"}</Text>
          <Text style={styles.email}>{user?.email || "student@campus.edu"}</Text>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate("Profile");
              onClose();
            }}
          >
            <Ionicons name="person-circle-outline" size={22} color="#111827" />
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={22} color="#111827" />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            <Text style={[styles.menuText, { color: "#EF4444" }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Close button */}
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    marginTop: 40,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  drawer: {
    width: "75%",
    backgroundColor: "white",
    height: "100%",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    padding: 20,
    elevation: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  email: {
    fontSize: 14,
    color: "#6B7280",
  },
  menu: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    color: "#111827",
    marginLeft: 12,
  },
  closeBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    borderRadius: 20,
    backgroundColor: "#D3D3D3",
    padding: 5,
  },
});
