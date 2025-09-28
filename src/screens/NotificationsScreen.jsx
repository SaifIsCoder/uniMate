import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function NotificationsScreen() {
  const notifications = [
    { title: "New Assignment", message: "Submit DBMS assignment by Friday." },
    { title: "Exam Alert", message: "Midterm exams start next Monday." },
    { title: "Holiday Notice", message: "Campus closed on 14th August." },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔔 Notifications</Text>
      {notifications.map((note, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.noteTitle}>{note.title}</Text>
          <Text style={styles.noteMsg}>{note.message}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F9FAFB" },
  title: { fontSize: 24, fontWeight: "bold", color: "#4F46E5", marginBottom: 15 },
  card: { backgroundColor: "white", padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  noteTitle: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  noteMsg: { fontSize: 14, color: "#6B7280", marginTop: 4 },
});
