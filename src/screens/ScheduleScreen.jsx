import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ScheduleScreen() {
  const classes = [
    { time: "9:00 - 10:30 AM", subject: "Data Structures", room: "Room 201", teacher: "Dr. Khan" },
    { time: "11:00 - 12:30 PM", subject: "Database Systems", room: "Lab 2", teacher: "Prof. Ali" },
    { time: "2:00 - 3:30 PM", subject: "Operating Systems", room: "Room 105", teacher: "Dr. Fatima" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Today's Schedule</Text>
      {classes.map((cls, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="book-outline" size={22} color="#4F46E5" />
            <Text style={styles.subject}>{cls.subject}</Text>
          </View>
          <View style={styles.cardRow}>
            <Ionicons name="time-outline" size={18} color="#6B7280" />
            <Text style={styles.text}>{cls.time}</Text>
          </View>
          <View style={styles.cardRow}>
            <Ionicons name="location-outline" size={18} color="#6B7280" />
            <Text style={styles.text}>{cls.room}</Text>
          </View>
          <View style={styles.cardRow}>
            <Ionicons name="person-outline" size={18} color="#6B7280" />
            <Text style={styles.text}>{cls.teacher}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F9FAFB" },
  title: { fontSize: 24, fontWeight: "bold", color: "#4F46E5", marginBottom: 20 },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  subject: { fontSize: 18, fontWeight: "bold", color: "#111827", marginLeft: 8 },
  cardRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  text: { fontSize: 14, color: "#374151", marginLeft: 6 },
});
