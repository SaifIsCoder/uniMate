import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useUser } from "../context/UserContext";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, setUser } = useUser();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              setUser(null);
              // Reset navigation to Login screen
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                })
              );
            } catch (error) {
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          },
        },
      ]
    );
  };

  // Use user data from context with fallbacks
  const student = {
    name: user?.name || "Student",
    email: user?.email || "student@campus.edu",
    rollNo: user?.rollNo || "000",
    department: user?.department || "Not Set",
    semester: user?.semester || "Not Set",
    section: user?.section || "N/A",
    batch: user?.batch || "N/A",
    contact: user?.contact || "N/A",
    address: user?.address || "N/A",
    gpa: user?.gpa || "N/A",
    attendance: "92%",
    avatar: "https://i.pravatar.cc/150?img=12",
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* TOP HEADER / HERO */}
        <View style={styles.headerWrapper}>
          <View style={styles.headerBg} />
          <View style={styles.headerContent}>
            <Image source={{ uri: student.avatar }} style={styles.avatar} />
            <View style={styles.nameSection}>
              <Text style={styles.name}>{student.name}</Text>
              <Text style={styles.email}>{student.email}</Text>

              <View style={styles.chipRow}>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>Roll #{student.rollNo}</Text>
                </View>
                <View style={styles.chipSecondary}>
                  <Text style={styles.chipSecondaryText}>{student.semester}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* QUICK STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>GPA</Text>
            <Text style={styles.statValue}>{student.gpa}</Text>
            <Text style={styles.statHint}>Current CGPA</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Attendance</Text>
            <Text style={styles.statValue}>{student.attendance}</Text>
            <Text style={styles.statHint}>This semester</Text>
          </View>
        </View>

        {/* ACADEMIC INFO */}
        <Text style={styles.sectionTitle}>Academic Info</Text>
        <View style={styles.infoCard}>
          <InfoRow label="Department" value={student.department} />
          <InfoRow label="Batch" value={student.batch} />
          <InfoRow label="Section" value={student.section} />
        </View>

        {/* CONTACT INFO */}
        <Text style={styles.sectionTitle}>Contact</Text>
        <View style={styles.infoCard}>
          <InfoRow label="Phone" value={student.contact} />
          <InfoRow label="Address" value={student.address} />
        </View>

        {/* ACCOUNT / ACTIONS */}
        {/* <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.infoCard}>
          <InfoRow label="Student Email" value={student.email} />
        </View> */}

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* Small reusable row component */
function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },

  /* HEADER */
  headerWrapper: {
    marginBottom: 5,
  },
  headerBg: {
    height: 90,
    backgroundColor: "#4F46E5",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: -55, // overlaps the purple background
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#E5E7EB",
    backgroundColor: "#E5E7EB",
  },
  nameSection: {
    marginLeft: 16,
    flex: 1,
  },
  name: { fontSize: 20, fontWeight: "700", color: "white" },
  email: { fontSize: 13, marginTop: 2, color: "white" },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
    marginRight: 8,
  },
  chipText: {
    fontSize: 12,
    color: "#4F46E5",
    fontWeight: "600",
  },
  chipSecondary: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },
  chipSecondaryText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },

  /* QUICK STATS */
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  statLabel: { fontSize: 12, color: "#6B7280" },
  statValue: { fontSize: 22, fontWeight: "700", color: "#111827", marginTop: 2 },
  statHint: { fontSize: 11, color: "#9CA3AF", marginTop: 4 },

  /* SECTION TITLES */
  sectionTitle: {
    marginTop: 10,
    marginBottom: 6,
    paddingHorizontal: 20,
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },

  /* INFO CARDS */
  infoCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  infoRow: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: { fontSize: 12, color: "#6B7280", marginBottom: 2 },
  infoValue: { fontSize: 15, color: "#111827", fontWeight: "500" },

  /* LOGOUT BUTTON */
  logoutBtn: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
});

