import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";

export default function ProfileScreen() {
  const student = {
    name: "Saif Mughal",
    email: "saif@student.edu",
    rollNo: "08643",
    department: "Computer Science",
    semester: "6th Semester",
    section: "B",
    batch: "2021-2025",
    contact: "+92 300 1234567",
    address: "Sargodha, Pakistan",
    gpa: "3.65",
    attendance: "92%",
    avatar: "https://i.pravatar.cc/150?img=12",
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: student.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{student.name}</Text>
        <Text style={styles.email}>{student.email}</Text>
      </View>

      {/* Info Cards */}
      <View style={styles.card}>
        <Text style={styles.infoTitle}>Roll No</Text>
        <Text style={styles.infoValue}>{student.rollNo}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.infoTitle}>Department</Text>
        <Text style={styles.infoValue}>{student.department}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.infoTitle}>Semester</Text>
        <Text style={styles.infoValue}>{student.semester}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.infoTitle}>Section</Text>
        <Text style={styles.infoValue}>{student.section}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.infoTitle}>Batch</Text>
        <Text style={styles.infoValue}>{student.batch}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.infoTitle}>Contact</Text>
        <Text style={styles.infoValue}>{student.contact}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.infoTitle}>Address</Text>
        <Text style={styles.infoValue}>{student.address}</Text>
      </View>

      <View style={styles.cardRow}>
        <View style={styles.halfCard}>
          <Text style={styles.infoTitle}>GPA</Text>
          <Text style={styles.infoValue}>{student.gpa}</Text>
        </View>
        <View style={styles.halfCard}>
          <Text style={styles.infoTitle}>Attendance</Text>
          <Text style={styles.infoValue}>{student.attendance}</Text>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 20 },
  header: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  email: { fontSize: 14, color: "#6B7280", marginBottom: 10 },

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  halfCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
  },
  infoTitle: { fontSize: 13, color: "#6B7280" },
  infoValue: { fontSize: 16, fontWeight: "bold", color: "#111827" },

  logoutBtn: {
    marginTop: 20,
    backgroundColor: "#EF4444",
    padding: 12,
    borderRadius: 8,
  },
  logoutText: { textAlign: "center", color: "white", fontWeight: "bold" },
});
