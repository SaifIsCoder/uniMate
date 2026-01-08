

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../context/UserContext";
import { classes, events } from "../data";
import UserDrawer from "../components/UserDrawer";
import { db } from "../config/firebase";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { seedAllData } from "../scripts/seedFirebase";
import { scheduleNotification, scheduleDelayedNotification, requestPermissions } from "../services/notificationService";

const defaultAvatar = require("../../assets/avatar.jpg");

export default function HomeScreen({ navigation }) {
  const { user } = useUser();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [todayClasses, setTodayClasses] = useState([]);
  const [stats, setStats] = useState({
    attendance: user?.attendance || "90",
    pendingAssignments: 0,
    upcomingQuizzes: 0,
  });
  const [latestNotification, setLatestNotification] = useState(null);
  const [nextEvent, setNextEvent] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const handleBellPress = async () => {
    // Navigate to notifications screen
    navigation?.navigate("Notifications");
    
    // Also trigger a notification
    await scheduleNotification(
      "New Updates Available",
      "Check your assignments and schedule for today.",
      { type: "bell_press", screen: "Notifications" }
    );
  };

  const handleSeedData = async () => {
    Alert.alert(
      "Seed Data to Firebase",
      "This will seed assignments, events, and classes data to Firebase. Continue?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Seed",
          onPress: async () => {
            try {
              setSeeding(true);
              const results = await seedAllData();
              
              const totalSuccess = 
                results.assignments.success.length +
                results.events.success.length +
                results.classes.success.length;
              
              Alert.alert(
                "Seeding Complete",
                `Successfully seeded:\n- Assignments: ${results.assignments.success.length}\n- Events: ${results.events.success.length}\n- Classes: ${results.classes.success.length}\n\nTotal: ${totalSuccess} items`,
                [{ text: "OK" }]
              );
            } catch (error) {
              console.error("Error seeding data:", error);
              Alert.alert("Error", "Failed to seed data: " + error.message);
            } finally {
              setSeeding(false);
            }
          },
        },
      ]
    );
  };

  const loadTodayClassesFromLocal = (todayDateString) => {
    // Import classes data from JSON
    try {
      const classesData = require("../data/classes.json");
      
      // Find today's classes from the nested structure
      const todayClassesList = [];
      
      for (const month of classesData.months) {
        for (const scheduleItem of month.schedule) {
          if (scheduleItem.date === todayDateString) {
            // Add all classes for today's date
            todayClassesList.push(...scheduleItem.classes);
          }
        }
      }
      
      setTodayClasses(todayClassesList);
      console.log("Today's classes from local data:", todayClassesList.length);
    } catch (error) {
      console.log("Error loading local classes:", error);
      setTodayClasses([]);
    }
  };

  useEffect(() => {
    loadEvents();
    loadRealTimeData();
    setLoading(false);

    // Request notification permissions on mount
    requestPermissions();

    // Schedule a one-time notification after 5 seconds (only once per session)
    const timer = setTimeout(() => {
      scheduleNotification(
        "Welcome to uniMate!",
        "You have new updates. Check your assignments and schedule.",
        { type: "welcome" }
      );
    }, 5000);

    // Cleanup listeners on unmount
    return () => {
      clearTimeout(timer);
      // Listeners will be cleaned up automatically when component unmounts
    };
  }, [user]);

  const loadRealTimeData = () => {
    if (!user) return;

    // Get today's date in YYYY-MM-DD format to match Firebase date field
    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    // Try to get classes from Firebase, fallback to local data
    try {
      const classesQuery = query(
        collection(db, "classes"),
        where("date", "==", todayDateString)
      );

      const unsubscribeClasses = onSnapshot(
        classesQuery,
        (snapshot) => {
          if (!snapshot.empty) {
            const classesData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setTodayClasses(classesData);
            console.log("Today's classes from Firebase:", classesData.length);
          } else {
            // Fallback to local classes - filter by actual date
            loadTodayClassesFromLocal(todayDateString);
          }
        },
        (error) => {
          console.log("Error loading classes from Firebase, using local data:", error);
          // Fallback to local classes - filter by actual date
          loadTodayClassesFromLocal(todayDateString);
        }
      );
    } catch (error) {
      console.log("Using local classes data:", error);
      loadTodayClassesFromLocal(todayDateString);
    }

    // Real-time listener for pending assignments
    try {
      const assignmentsQuery = query(
        collection(db, "assignments"),
        where("status", "in", ["Pending", "Overdue"])
      );

      const unsubscribeAssignments = onSnapshot(
        assignmentsQuery,
        (snapshot) => {
          const pendingCount = snapshot.size;
          setStats((prev) => ({
            ...prev,
            pendingAssignments: pendingCount,
          }));
        },
        (error) => {
          console.log("Error loading assignments from Firebase:", error);
          // Try to get from local data as fallback
          try {
            const assignmentsData = require("../data/assignments.json");
            const pendingCount = assignmentsData.assignments?.filter(
              (a) => a.status === "Pending" || a.status === "Overdue"
            ).length || 0;
            setStats((prev) => ({
              ...prev,
              pendingAssignments: pendingCount,
            }));
          } catch (e) {
            console.log("Could not load local assignments:", e);
          }
        }
      );
    } catch (error) {
      console.log("Error setting up assignments listener:", error);
      // Fallback to local data
      try {
        const assignmentsData = require("../data/assignments.json");
        const pendingCount = assignmentsData.assignments?.filter(
          (a) => a.status === "Pending" || a.status === "Overdue"
        ).length || 0;
        setStats((prev) => ({
          ...prev,
          pendingAssignments: pendingCount,
        }));
      } catch (e) {
        console.log("Could not load local assignments:", e);
      }
    }
  };

  const loadEvents = () => {
    if (!user) return;

    // Real-time listener for events
    try {
      const eventsQuery = query(collection(db, "events"));

      const unsubscribeEvents = onSnapshot(
        eventsQuery,
        (snapshot) => {
          if (!snapshot.empty) {
            const eventsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            // Sort by date and get the next upcoming event
            const sortedEvents = eventsData.sort((a, b) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              return dateA - dateB;
            });
            setNextEvent(sortedEvents[0] || null);
          } else {
            // Fallback to local events
            if (events && events.length > 0) {
              const sortedEvents = events.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateA - dateB;
              });
              setNextEvent(sortedEvents[0] || null);
            }
          }
        },
        (error) => {
          console.log("Error loading events from Firebase, using local data:", error);
          // Fallback to local events
          if (events && events.length > 0) {
            const sortedEvents = events.sort((a, b) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              return dateA - dateB;
            });
            setNextEvent(sortedEvents[0] || null);
          }
        }
      );
    } catch (error) {
      console.log("Using local events data:", error);
      // Fallback to local events
      if (events && events.length > 0) {
        const sortedEvents = events.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        });
        setNextEvent(sortedEvents[0] || null);
      }
    }
  };

  // const loadHomeData = async () => {
  //   try {
  //     setLoading(true);
  //     const [classesData, statsData, notificationsData, eventsData] = await Promise.all([
  //       apiCall(API_ENDPOINTS.CLASSES.TODAY).catch(() => []),
  //       apiCall(API_ENDPOINTS.USERS.STATS).catch(() => ({ assignments: { pending: 0 } })),
  //       apiCall(API_ENDPOINTS.NOTIFICATIONS.ALL).catch(() => []),
  //       apiCall(API_ENDPOINTS.EVENTS.ALL).catch(() => []),
  //     ]);

  //     setTodayClasses(classesData);
  //     setStats({
  //       attendance: user?.attendance || "0",
  //       pendingAssignments: statsData.assignments?.pending || 0,
  //       upcomingQuizzes: 0,
  //     });
  //     setLatestNotification(notificationsData[0] || null);
  //     setNextEvent(eventsData[0] || null);
  //   } catch (error) {
  //     console.error("Error loading home data:", error);
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // };

  // const onRefresh = () => {
  //   setRefreshing(true);
  //   loadHomeData();
  // };

  // if (loading && !refreshing) {
  //   return (
  //     <SafeAreaView style={styles.safe}>
  //       <View style={styles.loadingContainer}>
  //         <ActivityIndicator size="large" color="#6366F1" />
  //       </View>
  //     </SafeAreaView>
  //   );
  // }
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Welcome back</Text>
            <Text style={styles.name}>
              {user?.personal?.firstName || user?.personal?.firstName || user?.name || "Student"}
            </Text>
            {user?.academic?.program && (
              <Text style={styles.degree}>{user.academic.program}</Text>
            )}
            {/* <Text style={styles.motivation}>
              Move forward. One class at a time.
            </Text> */}
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={handleBellPress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="notifications-outline" size={25} color="#0F172A" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconBtn}
              onPress={() => setDrawerVisible(true)}
            >
              <Image
                source={user?.profile?.avatar || user?.avatar ? { uri: user?.profile?.avatar || user?.avatar } : defaultAvatar}
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Seed Data Button - Remove in production */}
        {/* {__DEV__ && (
          <TouchableOpacity
            style={[styles.seedButton, seeding && styles.seedButtonDisabled]}
            onPress={handleSeedData}
            disabled={seeding}
          >
            {seeding ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={18} color="#FFFFFF" />
                <Text style={styles.seedButtonText}>Seed Data to Firebase</Text>
              </>
            )}
          </TouchableOpacity>
        )} */}

        {/* ================= TODAY HERO CARD ================= */}
        <TouchableOpacity 
          onPress={() => navigation?.navigate("Schedule")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#6366F1", "#8B5CF6", "#A855F7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroTitleContainer}>
              <View style={styles.heroTitleIconContainer}>
            <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
              <Text style={styles.heroTitle}>Today</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#FFFFFF" style={{ opacity: 0.9 }} />
            </View>
            <Text style={styles.heroMain}>
              {todayClasses.length > 0 ? `${todayClasses.length} class${todayClasses.length > 1 ? 'es' : ''} scheduled` : "No classes scheduled"}
            </Text>
            <Text style={styles.heroSub}>
              {todayClasses.length > 0 ? "Tap to view schedule" : "You have time to plan ahead"}
            </Text>
          </LinearGradient>
          </TouchableOpacity>

        {/* ================= PROGRESS SNAPSHOT ================= */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => alert("Attendance details")}
          >
            <Ionicons name="stats-chart-outline" size={22} color="#6366F1" />
            <Text style={styles.cardTitle}>Attendance</Text>
            <Text style={styles.cardValue}>{stats.attendance}%</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation?.navigate("Assignments")}
          >
            <Ionicons name="document-text-outline" size={22} color="#6366F1" />
            <Text style={styles.cardTitle}>Assignments</Text>
            <Text style={styles.cardValue}>{stats.pendingAssignments} pending</Text>
          </TouchableOpacity>
        </View>

        {/* ================= SECONDARY INFO ================= */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => alert("Quizzes screen coming soon")}
          >
            <Ionicons name="help-circle-outline" size={22} color="#6366F1" />
            <Text style={styles.cardTitle}>Quizzes</Text>
            <Text style={styles.cardValue}>{stats.upcomingQuizzes > 0 ? `${stats.upcomingQuizzes} upcoming` : "No upcoming"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation?.navigate("Events")}
          >
            <Ionicons name="gift-outline" size={22} color="#6366F1" />
            <Text style={styles.cardTitle}>Next Event</Text>
            <Text style={styles.cardValue} numberOfLines={1}>
              {nextEvent?.name || "No events"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================= BOTTOM SPACE ================= */}
        <View style={{ height: 40 }} />
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
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 43,
    height: 43,
    borderRadius: 50,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  welcome: {
    fontSize: 12,
    color: "#64748B",
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
    color: "#0F172A",
  },
  degree: {
    fontSize: 14,
    color: "#475569",
    marginTop: 2,
  },
  motivation: {
    fontSize: 13,
    color: "#6366F1",
    marginTop: 6,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    marginLeft: 12,
  },
  seedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366F1",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    gap: 8,
  },
  seedButtonDisabled: {
    opacity: 0.6,
  },
  seedButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  /* HERO CARD */
  heroCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  heroTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    // gap: 6,
    justifyContent: "space-between",
    // marginTop: 10,
  },
  heroTitleIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  heroTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    opacity: 0.9,
    fontWeight: "600",
  },
  heroMain: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 6,
  },
  heroSub: {
    fontSize: 14,
    color: "#FFFFFF",
    marginTop: 4,
    opacity: 0.85,
  },

  /* GRID */
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    width: "48%",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    color: "#475569",
    marginTop: 10,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0F172A",
    marginTop: 6,
  },
});
