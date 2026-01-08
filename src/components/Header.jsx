import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import { useUser } from "../context/UserContext";

const defaultAvatar = require("../../assets/avatar.jpg");

// Map route names to display names
const screenNameMap = {
  Home: "Home",
  Schedule: "Schedule",
  Assignments: "Assignments",
  Events: "Events",
  Notifications: "Notifications",
};

export default function Header() {
  const { user } = useUser();
  const route = useRoute();
  const screenName = screenNameMap[route.name] || route.name;

  return (
    <View style={styles.header}>
      <Text style={styles.screenName}>{screenName}</Text>
      <Image
        source={user?.avatarUrl ? { uri: user.avatarUrl } : defaultAvatar}
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
    // paddingHorizontal: 16,
  },
  screenName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },
});
