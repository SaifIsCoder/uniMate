import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { useUser } from "../context/UserContext";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // User data is already loaded from UserContext
    if (user) {
      setLoading(false);
    }
  }, [user]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
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
    ]);
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

  // Map student data from Firebase structure
  const student = {
    name: user?.personal?.fullName || user?.personal?.firstName || "Student",
    email:
      user?.contact?.universityEmail ||
      user?.email ||
      user?.contact?.personalEmail ||
      "student@campus.edu",
    rollNo: user?.academic?.rollNo || user?.studentId || "000",
    department: user?.academic?.department || "Not Set",
    semester: user?.academic?.currentSemester
      ? `Semester ${user.academic.currentSemester}`
      : "Not Set",
    section: user?.academic?.section || "N/A",
    batch: user?.academic?.session || user?.academic?.batch || "N/A",
    program: user?.academic?.program || "Not Set",
    contact: user?.contact?.phone || "N/A",
    address: user?.contact?.address || "N/A",
    gpa: user?.academic?.cgpa || user?.academic?.gpa || "N/A",
    attendance: user?.academic?.attendance || user?.attendance || "0",
    avatar:
      user?.profile?.avatar ||
      user?.avatar ||
      "https://i.pravatar.cc/150?img=12",
    gender: user?.personal?.gender || "N/A",
    dateOfBirth: user?.personal?.dateOfBirth || "N/A",
    guardian: user?.guardian || null,
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
                  <Text style={styles.chipSecondaryText}>
                    {student.semester}
                  </Text>
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
            <Text style={styles.statValue}>{student.attendance}%</Text>
            <Text style={styles.statHint}>This semester</Text>
          </View>
        </View>

        {/* ACADEMIC INFO */}
        <Text style={styles.sectionTitle}>Academic Info</Text>
        <View style={styles.infoCard}>
          <InfoRow label="Program" value={student.program} />
          <InfoRow label="Department" value={student.department} />
          <InfoRow label="Session" value={student.batch} />
          <InfoRow label="Section" value={student.section} />
          <InfoRow label="Semester" value={student.semester} />
        </View>

        {/* PERSONAL INFO */}
        <Text style={styles.sectionTitle}>Personal Info</Text>
        <View style={styles.infoCard}>
          <InfoRow label="Gender" value={student.gender} />
          <InfoRow label="Date of Birth" value={student.dateOfBirth} />
        </View>

        {/* CONTACT INFO */}
        <Text style={styles.sectionTitle}>Contact</Text>
        <View style={styles.infoCard}>
          <InfoRow
            label="University Email"
            value={user?.contact?.universityEmail || "N/A"}
          />
          <InfoRow
            label="Personal Email"
            value={user?.contact?.personalEmail || "N/A"}
          />
          <InfoRow label="Phone" value={student.contact} />
          <InfoRow label="Address" value={student.address} />
        </View>

        {/* GUARDIAN INFO */}
        {student.guardian && (
          <>
            <Text style={styles.sectionTitle}>Guardian</Text>
            <View style={styles.infoCard}>
              <InfoRow label="Name" value={student.guardian.name || "N/A"} />
              <InfoRow
                label="Relation"
                value={student.guardian.relation || "N/A"}
              />
              <InfoRow label="Phone" value={student.guardian.phone || "N/A"} />
              <InfoRow label="Email" value={student.guardian.email || "N/A"} />
              <InfoRow
                label="Occupation"
                value={student.guardian.occupation || "N/A"}
              />
            </View>
          </>
        )}

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  /* HEADER */
  headerWrapper: {
    marginBottom: 5,
  },
  headerBg: {
    height: 180,
    backgroundColor: "#4F46E5",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    position: "relative",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    bottom: 0,
    // marginTop: ,
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
    gap: 8,
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
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginTop: 2,
  },
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
