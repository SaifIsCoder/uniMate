import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function EventsScreen() {
  const events = [
    { name: "Tech Fest", date: "Oct 15", place: "Auditorium" },
    { name: "Sports Gala", date: "Nov 5", place: "Main Ground" },
    { name: "Job Fair", date: "Dec 1", place: "Hall B" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Upcoming Events</Text>
      {events.map((event, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.eventName}>{event.name}</Text>
          <Text style={styles.eventInfo}>
            {event.date} • {event.place}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F9FAFB" },
  title: { fontSize: 24, fontWeight: "bold", color: "#4F46E5", marginBottom: 15 },
  card: { backgroundColor: "white", padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
  eventName: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  eventInfo: { fontSize: 14, color: "#6B7280", marginTop: 4 },
});
