import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import Header from "../components/Header";

// Hardcoded notifications data
const hardcodedNotifications = [
  {
    id: "1",
    title: "New Assignment Posted",
    message: "Your professor posted a new assignment for CS 101. Due date: December 15, 2024",
    type: "Assignment",
    isRead: false,
    timestamp: "2024-12-10T10:30:00Z",
  },
  {
    id: "2",
    title: "Class Reminder",
    message: "You have a Mathematics class in 30 minutes at Room 204",
    type: "Schedule",
    isRead: false,
    timestamp: "2024-12-10T09:00:00Z",
  },
  {
    id: "3",
    title: "Event Registration Open",
    message: "Tech Fest 2024 registration is now open. Register before December 20!",
    type: "Event",
    isRead: true,
    timestamp: "2024-12-09T14:20:00Z",
  },
  {
    id: "4",
    title: "Assignment Due Soon",
    message: "Your History essay is due in 2 days. Don't forget to submit!",
    type: "Assignment",
    isRead: false,
    timestamp: "2024-12-09T16:45:00Z",
  },
  {
    id: "5",
    title: "Grade Updated",
    message: "Your grade for Physics Midterm has been updated. Check your results.",
    type: "Grade",
    isRead: true,
    timestamp: "2024-12-08T11:15:00Z",
  },
  {
    id: "6",
    title: "Library Book Due",
    message: "Your library book 'Introduction to Algorithms' is due in 3 days. Please return or renew.",
    type: "Library",
    isRead: false,
    timestamp: "2024-12-08T10:00:00Z",
  },
  {
    id: "7",
    title: "Campus Event Today",
    message: "Join us for the Career Fair today at 2 PM in the Main Hall. Free entry!",
    type: "Event",
    isRead: true,
    timestamp: "2024-12-07T08:30:00Z",
  },
  {
    id: "8",
    title: "New Updates Available",
    message: "Check your assignments and schedule for today.",
    type: "General",
    isRead: false,
    timestamp: "2024-12-07T07:00:00Z",
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    // Simulate loading delay
    setTimeout(() => {
      setNotifications(hardcodedNotifications);
      setLoading(false);
    }, 300);
  };

  const markAsRead = (id) => {
    // Update local state only
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View>
      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyTitle}>No notifications</Text>
          <Text style={styles.emptySubtitle}>
            You're all caught up!
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, !item.isRead && styles.unreadCard]}
              onPress={() => !item.isRead && markAsRead(item.id)}
            >
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text style={styles.noteMsg}>{item.message}</Text>
              {item.type && (
                <Text style={styles.noteType}>{item.type}</Text>
              )}
              {!item.isRead && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    position: "relative",
    borderColor: "#E5E7EB",
    borderWidth: 1,
  },
  unreadCard: {
    backgroundColor: "#F0F9FF",
    borderLeftWidth: 4,
    borderLeftColor: "#1E88E5",
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  noteMsg: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  noteType: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  unreadDot: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1E88E5",
  },
});
