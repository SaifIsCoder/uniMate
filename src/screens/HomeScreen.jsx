import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import React, { useState } from "react";
import UserDrawer from "../components/UserDrawer";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { classes } from "../data";
import { useUser } from "../context/UserContext";
export default function HomeScreen({ navigation }) {
  const { user } = useUser();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const latestNotification =
    "Tomorrow’s AI class will be held online via Zoom 📢";
  const nextEvent = {
    title: "Hackathon 2025",
    date: "Oct 10th, 2025",
    location: "Main Auditorium",
  };
  const attendance = 85;

  const getStatusStyle = (status) => {
    if (status === "completed") return { color: "#22C55E" };
    if (status === "upcoming") return { color: "#3B82F6" };
    if (status === "missed") return { color: "#EF4444" };
    return { color: "#6B7280" };
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Welcome back,</Text>
            <Text style={styles.username}>{user?.name || "Student"}</Text>
          </View>

          <View style={styles.headerNotify}>
            {/* <View onPress={() => navigation.navigate("Notifications")}>
              <Ionicons name="notifications" size={28} color="grey" />
            </View> */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Notifications")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Notifications"
              accessibilityHint="Go to notifications screen"
            >
              <Ionicons name="notifications" size={28} color="grey" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setDrawerVisible(true)}>
              <Image
                source={{ uri: "https://i.pravatar.cc/100" }}
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Dashboard Cards */}
        <View style={styles.cardGrid}>
          {/* Classes */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: "#4F46E5" }]}
            onPress={() => navigation.navigate("Schedule")}
          >
            <Ionicons name="calendar" size={28} color="white" />
            <Text style={styles.cardTitle}>Today’s Classes</Text>
            <Text style={styles.cardText}>{classes.length} Scheduled</Text>
          </TouchableOpacity>

          {/* Attendance */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: "#10B981" }]}
            onPress={() => alert("Attendance details")}
          >
            <Ionicons name="bar-chart" size={28} color="white" />
            <Text style={styles.cardTitle}>Attendance</Text>
            <Text style={styles.cardText}>{attendance}%</Text>
          </TouchableOpacity>
          {/* Notifications */}
          {/* <TouchableOpacity
            style={[styles.card, { backgroundColor: "#22C55E" }]}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Ionicons name="notifications" size={28} color="white" />
            <Text style={styles.cardTitle}>Notifications</Text>
            <Text style={styles.cardText}>+5 New</Text>
          </TouchableOpacity> */}

          {/* Profile */}
          {/* <TouchableOpacity
            style={[styles.card, { backgroundColor: "#F59E0B" }]}
            onPress={() => navigation.navigate("Profile")}
          >
            <Ionicons name="person" size={28} color="white" />
            <Text style={styles.cardTitle}>Profile</Text>
            <Text style={styles.cardText}>View & Edit</Text>
          </TouchableOpacity> */}

          {/* Assignments */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: "#EF4444" }]}
            onPress={() => navigation.navigate("Assignments")}
          >
            <Ionicons name="document-text" size={28} color="white" />
            <Text style={styles.cardTitle}>Assignments</Text>
            <Text style={styles.cardText}>2 Pending</Text>
          </TouchableOpacity>

          {/* Quizzes */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: "#06B6D4" }]}
            onPress={() => alert("Quizzes screen coming soon")}
          >
            <Ionicons name="help-circle" size={28} color="white" />
            <Text style={styles.cardTitle}>Quizzes</Text>
            <Text style={styles.cardText}>1 Upcoming</Text>
          </TouchableOpacity>

          {/* Events */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: "#A855F7" }]}
            onPress={() => navigation.navigate("Events")}
          >
            <Ionicons name="gift" size={28} color="white" />
            <Text style={styles.cardTitle}>Next Event</Text>
            <Text style={styles.cardText}>{nextEvent.title}</Text>
          </TouchableOpacity>
        </View>

        {/* Today’s Classes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Today’s Classes</Text>
          {classes.map((cls) => (
            <View key={cls.id} style={styles.classCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.classSubject}>{cls.subject}</Text>
                <Text style={styles.classDetail}>
                  {cls.time} • {cls.room}
                </Text>
                <Text style={styles.classDetail}>{cls.teacher}</Text>
              </View>
              <Text style={[styles.classStatus, getStatusStyle(cls.status)]}>
                {cls.status.toUpperCase()}
              </Text>
            </View>
          ))}
        </View>

        {/* Latest Notification */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 Latest Notification</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>{latestNotification}</Text>
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => navigation.navigate("Notifications")}
            >
              <Text style={styles.infoButtonText}>See All</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Next Event */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎉 Next Event</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>{nextEvent.title}</Text>
            <Text style={styles.infoSub}>
              {nextEvent.date} • {nextEvent.location}
            </Text>
            <TouchableOpacity
              style={[styles.infoButton, { backgroundColor: "#A855F7" }]}
              onPress={() => navigation.navigate("Events")}
            >
              <Text style={styles.infoButtonText}>View Events</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Drawer Component */}
      <UserDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerNotify: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  welcome: { fontSize: 16, color: "#6B7280" },
  username: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    height: 140,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: { color: "white", fontSize: 16, fontWeight: "600", marginTop: 8 },
  cardText: { color: "white", fontSize: 14, opacity: 0.9 },
  section: { marginTop: 15, marginBottom: 10 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
  },
  classCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    margin: 5,
  },
  classSubject: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
  classDetail: { fontSize: 14, color: "#6B7280", marginTop: 2 },
  classStatus: { fontSize: 13, fontWeight: "700" },
  infoCard: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    margin: 5,
  },
  infoText: { fontSize: 15, color: "#374151", marginBottom: 6 },
  infoSub: { fontSize: 14, color: "#6B7280", marginBottom: 10 },
  infoButton: {
    backgroundColor: "#4F46E5",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  infoButtonText: { color: "white", fontWeight: "600" },
});
