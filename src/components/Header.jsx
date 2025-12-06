import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { useUser } from "../context/UserContext";

export default function Header() {
  const { user } = useUser();

  const firstName = user?.name
    ? user.name.split(" ")[0]       // Use first name only
    : "Student";                    // Fallback while loading

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.welcome}>Welcome back,</Text>
        <Text style={styles.username}>{user?.name}</Text>
      </View>

      <Image
        source={{
          uri: user?.avatarUrl || "https://i.pravatar.cc/100", // Fallback avatar
        }}
        style={styles.avatar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  welcome: {
    fontSize: 16,
    color: "#6B7280",
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },
});
