import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://i.pravatar.cc/150?img=12" }}
        style={styles.avatar}
      />
      <Text style={styles.name}>Saif Mughal</Text>
      <Text style={styles.email}>saif@student.edu</Text>

      <View style={styles.card}>
        <Text style={styles.infoTitle}>Department</Text>
        <Text style={styles.infoValue}>Computer Science</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.infoTitle}>Roll No</Text>
        <Text style={styles.infoValue}>08643</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20, backgroundColor: "#F9FAFB" },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  email: { fontSize: 14, color: "#6B7280", marginBottom: 20 },
  card: { width: "100%", backgroundColor: "white", padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  infoTitle: { fontSize: 14, color: "#6B7280" },
  infoValue: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  logoutBtn: { marginTop: 20, backgroundColor: "#EF4444", padding: 12, borderRadius: 8, width: "100%" },
  logoutText: { textAlign: "center", color: "white", fontWeight: "bold" },
});
