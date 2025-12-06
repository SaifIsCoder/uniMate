import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
// Helper: get current week's dates (Mon-Fri)
const getWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay(); // Sunday=0, Monday=1...
  const monday = new Date(today);
  monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));

  const week = {};
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  for (let i = 0; i < days.length; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    week[days[i]] = {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };
  }
  return week;
};

export default function ScheduleScreen() {
  const weekDates = getWeekDates();

  const weekSchedule = {
    Monday: [
      {
        time: "9:00 - 10:30 AM",
        subject: "Data Structures",
        room: "Room 201",
        teacher: "Dr. Khan",
      },
      {
        time: "11:00 - 12:30 PM",
        subject: "Database Systems",
        room: "Lab 2",
        teacher: "Prof. Ali",
      },
    ],
    Tuesday: [
      {
        time: "10:00 - 11:30 AM",
        subject: "Operating Systems",
        room: "Room 105",
        teacher: "Dr. Fatima",
      },
      {
        time: "1:00 - 2:30 PM",
        subject: "Computer Networks",
        room: "Lab 1",
        teacher: "Prof. Ahmed",
      },
    ],
    Wednesday: [
      {
        time: "9:00 - 10:30 AM",
        subject: "Software Engineering",
        room: "Room 202",
        teacher: "Ms. Sara",
      },
    ],
    Thursday: [
      {
        time: "11:00 - 12:30 PM",
        subject: "Artificial Intelligence",
        room: "Room 303",
        teacher: "Dr. Asim",
      },
    ],
    Friday: [
      {
        time: "9:00 - 10:30 AM",
        subject: "Machine Learning",
        room: "Room 305",
        teacher: "Prof. Ali",
      },
      {
        time: "2:00 - 3:30 PM",
        subject: "Database Systems Lab",
        room: "Lab 2",
        teacher: "Ms. Fatima",
      },
    ],
  };

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>  
        <Text style={styles.title}>Weekly Schedule</Text>
        </View>
        {Object.entries(weekSchedule).map(([day, classes]) => (
          <View
            key={day}
            style={[
              styles.dayContainer,
              today === day && { borderColor: "#4F46E5", borderWidth: 2 },
            ]}
          >
            <Text style={styles.dayTitle}>
              {day} - {weekDates[day]?.date} {today === day ? "⭐" : ""}
            </Text>
            {classes.map((cls, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="book-outline" size={20} color="#1565C0" />
                  <Text style={styles.subject}>{cls.subject}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Ionicons name="time-outline" size={16} color="#6B7280" />
                  <Text style={styles.text}>{cls.time}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Ionicons name="location-outline" size={16} color="#6B7280" />
                  <Text style={styles.text}>{cls.room}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Ionicons name="person-outline" size={16} color="#6B7280" />
                  <Text style={styles.text}>{cls.teacher}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 20,
  },
  header: {
    // flexDirection: "row",
    // alignItems: "center",
    paddingHorizontal: 6,
    // paddingTop: 8,
    paddingBottom: 5,
    marginBottom: 5,
    // backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E0E0E0",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    // marginBottom: 15,
    marginTop: 15,
  },

  dayContainer: {
    marginBottom: 5,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    margin: 5,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  subject: { fontSize: 16, fontWeight: "600", color: "#111827", marginLeft: 6 },
  cardRow: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  text: { fontSize: 14, color: "#374151", marginLeft: 6 },
});
