// AssignmentsScreen.js
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STATUS_FILTERS = ["All", "Pending", "Submitted", "Overdue"];

const COURSES = [
  "All Courses",
  "CS-101 Database Systems",
  "CS-201 Mobile Development",
  "MATH-301 Linear Algebra",
  "ENG-101 English Composition",
];

const initialAssignments = [
  {
    id: "1",
    title: "Database Project Report",
    course: "CS-101 Database Systems",
    dueDate: "12 Dec, 11:59 PM",
    status: "Pending",
    submittedAt: null,
    hasAttachment: true,
    isLateAllowed: true,
  },
  {
    id: "2",
    title: "SQL Query Optimization",
    course: "CS-101 Database Systems",
    dueDate: "18 Dec, 11:59 PM",
    status: "Pending",
    submittedAt: null,
    hasAttachment: true,
    isLateAllowed: true,
  },
  {
    id: "3",
    title: "ER Diagram Design",
    course: "CS-101 Database Systems",
    dueDate: "08 Dec, 11:59 PM",
    status: "Submitted",
    submittedAt: "07 Dec, 10:15 PM",
    hasAttachment: false,
    isLateAllowed: true,
  },
  {
    id: "4",
    title: "Mobile App UI Prototype",
    course: "CS-201 Mobile Development",
    dueDate: "10 Dec, 11:59 PM",
    status: "Submitted",
    submittedAt: "09 Dec, 8:30 PM",
    hasAttachment: false,
    isLateAllowed: true,
  },
  {
    id: "5",
    title: "React Native Navigation",
    course: "CS-201 Mobile Development",
    dueDate: "15 Dec, 11:59 PM",
    status: "Pending",
    submittedAt: null,
    hasAttachment: true,
    isLateAllowed: true,
  },
  {
    id: "6",
    title: "State Management Report",
    course: "CS-201 Mobile Development",
    dueDate: "03 Dec, 11:59 PM",
    status: "Overdue",
    submittedAt: null,
    hasAttachment: false,
    isLateAllowed: true,
  },
  {
    id: "7",
    title: "Matrix Operations Assignment",
    course: "MATH-301 Linear Algebra",
    dueDate: "14 Dec, 11:59 PM",
    status: "Pending",
    submittedAt: null,
    hasAttachment: true,
    isLateAllowed: true,
  },
  {
    id: "8",
    title: "Eigenvalues Problem Set",
    course: "MATH-301 Linear Algebra",
    dueDate: "20 Dec, 11:59 PM",
    status: "Pending",
    submittedAt: null,
    hasAttachment: false,
    isLateAllowed: true,
  },
  {
    id: "9",
    title: "Vector Spaces Quiz",
    course: "MATH-301 Linear Algebra",
    dueDate: "06 Dec, 11:59 PM",
    status: "Submitted",
    submittedAt: "05 Dec, 4:45 PM",
    hasAttachment: false,
    isLateAllowed: true,
  },
  {
    id: "10",
    title: "Research Essay",
    course: "ENG-101 English Composition",
    dueDate: "05 Dec, 11:59 PM",
    status: "Overdue",
    submittedAt: null,
    hasAttachment: false,
    isLateAllowed: true,
  },
  {
    id: "11",
    title: "Persuasive Writing Draft",
    course: "ENG-101 English Composition",
    dueDate: "16 Dec, 11:59 PM",
    status: "Pending",
    submittedAt: null,
    hasAttachment: true,
    isLateAllowed: true,
  },
  {
    id: "12",
    title: "Literature Review",
    course: "ENG-101 English Composition",
    dueDate: "09 Dec, 11:59 PM",
    status: "Submitted",
    submittedAt: "08 Dec, 9:20 PM",
    hasAttachment: false,
    isLateAllowed: true,
  },
];

const AssignmentsScreen = () => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  const [assignments, setAssignments] = useState(initialAssignments);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);

  const stats = useMemo(() => {
    const total = assignments.length;
    const pending = assignments.filter((a) => a.status === "Pending").length;
    const submitted = assignments.filter(
      (a) => a.status === "Submitted"
    ).length;
    const overdue = assignments.filter((a) => a.status === "Overdue").length;
    const completion = total === 0 ? 0 : Math.round((submitted / total) * 100);

    return { total, pending, submitted, overdue, completion };
  }, [assignments]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const statusMatch =
        selectedStatusFilter === "All" || a.status === selectedStatusFilter;
      const courseMatch =
        selectedCourse === "All Courses" || a.course === selectedCourse;
      return statusMatch && courseMatch;
    });
  }, [assignments, selectedStatusFilter, selectedCourse]);

  const openUploadModal = (assignment) => {
    setSelectedAssignment(assignment);
    setSelectedFileName(null);
    setUploadModalVisible(true);
  };

  const closeUploadModal = () => {
    setUploadModalVisible(false);
    setSelectedAssignment(null);
    setSelectedFileName(null);
  };

  // Just a mock – in real app you'd use a file picker or camera
  const handleChooseFile = () => {
    setSelectedFileName("my_assignment.pdf");
  };

  const handleTakePhoto = () => {
    setSelectedFileName("photo_assignment.jpg");
  };

  const handleSubmitUpload = () => {
    if (!selectedAssignment || !selectedFileName) return;

    const updated = assignments.map((a) =>
      a.id === selectedAssignment.id
        ? {
            ...a,
            status: "Submitted",
            submittedAt: "Now (mock)",
          }
        : a
    );
    setAssignments(updated);
    closeUploadModal();
  };

  const renderStatusBadge = (status) => {
    let bgColor = "#E0E0E0";
    let textColor = "#333";

    if (status === "Submitted") {
      bgColor = "#D1F5E1";
      textColor = "#1C7C3A";
    } else if (status === "Pending") {
      bgColor = "#E3F2FD";
      textColor = "#1565C0";
    } else if (status === "Overdue") {
      bgColor = "#FFEBEE";
      textColor = "#C62828";
    }

    return (
      <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
        <Text style={[styles.statusBadgeText, { color: textColor }]}>
          {status}
        </Text>
      </View>
    );
  };

  const renderAssignmentItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          <Text style={styles.assignmentTitle}>{item.title}</Text>
          {renderStatusBadge(item.status)}
        </View>

        <View style={styles.cardMiddleRow}>
          <Text style={styles.courseText}>{item.course}</Text>
          <Text style={styles.dueText}>Due: {item.dueDate}</Text>
        </View>

        {item.status === "Submitted" && (
          <Text style={styles.submittedText}>
            Submitted on: {item.submittedAt}
          </Text>
        )}

        <View style={styles.cardBottomRow}>
          {item.status === "Submitted" ? (
            <>
              <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>View Submission</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openUploadModal(item)}>
                <Text style={styles.reuploadText}>Re-upload</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => openUploadModal(item)}
              >
                <Text style={styles.primaryButtonText}>
                  {item.status === "Overdue" ? "Upload (Late)" : "Upload"}
                </Text>
              </TouchableOpacity>
              {item.status === "Overdue" && (
                <Text style={styles.lateWarning}>⚠ Late</Text>
              )}
            </>
          )}

          {item.hasAttachment && (
            <View style={styles.attachmentContainer}>
              <Text style={styles.attachmentIcon}>📎</Text>
              <Text style={styles.attachmentText}>Instructions</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <StatusBar barStyle="dark-content" /> */}
      {/* HEADER */}
      <View style={styles.header}>
        {/* <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity> */}
        {/* <Text style={styles.headerTitle}></Text> */}
        <Text style={styles.title}>Assignments</Text>

        {/* <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>U</Text>
        </View> */}
      </View>

      {/* FILTERS */}
      <View style={styles.filtersContainer}>
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            style={[
              styles.courseDropdown,
              courseDropdownOpen && styles.courseDropdownOpen,
            ]}
            onPress={() => setCourseDropdownOpen(!courseDropdownOpen)}
          >
            <Text style={styles.courseDropdownText}>{selectedCourse}</Text>
            <Text style={styles.dropdownArrow}>
              {courseDropdownOpen ? "▲" : "▼"}
            </Text>
          </TouchableOpacity>

          {courseDropdownOpen && (
            <View style={styles.dropdownList}>
              {COURSES.map((course) => {
                const isActive = selectedCourse === course;
                return (
                  <TouchableOpacity
                    key={course}
                    style={[
                      styles.dropdownItem,
                      isActive && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setSelectedCourse(course);
                      setCourseDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        isActive && styles.dropdownItemTextActive,
                      ]}
                    >
                      {course}
                    </Text>
                    {isActive && <Text style={styles.checkMark}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.statusFilterRow}>
          {STATUS_FILTERS.map((filter) => {
            const isActive = selectedStatusFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.statusChip, isActive && styles.statusChipActive]}
                onPress={() => setSelectedStatusFilter(filter)}
              >
                <Text
                  style={[
                    styles.statusChipText,
                    isActive && styles.statusChipTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* SUMMARY CARD - PROGRESS */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLine}>
          Assignments: {stats.total} Pending: {stats.pending} Overdue:{" "}
          {stats.overdue}
        </Text>
        <Text style={styles.summaryLine}>
          Completed: {stats.submitted} ({stats.completion}%)
        </Text>

        <View style={styles.progressBarBackground}>
          <View
            style={[styles.progressBarFill, { width: `${stats.completion}%` }]}
          />
        </View>
      </View>

      {/* ASSIGNMENT LIST */}
      {filteredAssignments.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📄</Text>
          <Text style={styles.emptyTitle}>No assignments found</Text>
          <Text style={styles.emptySubtitle}>
            Try changing filters or check again later.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredAssignments}
          keyExtractor={(item) => item.id}
          renderItem={renderAssignmentItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* UPLOAD MODAL */}
      <Modal
        visible={uploadModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeUploadModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload Assignment</Text>
            {selectedAssignment && (
              <>
                <Text style={styles.modalAssignmentTitle}>
                  {selectedAssignment.title}
                </Text>
                <Text style={styles.modalDueText}>
                  Due: {selectedAssignment.dueDate}
                </Text>
              </>
            )}

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleChooseFile}
              >
                <Text style={styles.secondaryButtonText}>Choose File</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleTakePhoto}
              >
                <Text style={styles.secondaryButtonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.selectedFileLabel}>Selected:</Text>
            <Text style={styles.selectedFileName}>
              {selectedFileName || "No file selected"}
            </Text>

            <View style={styles.modalBottomRow}>
              <Pressable
                style={[
                  styles.primaryButton,
                  !selectedFileName && { opacity: 0.5 },
                ]}
                onPress={handleSubmitUpload}
                disabled={!selectedFileName}
              >
                <Text style={styles.primaryButtonText}>Submit</Text>
              </Pressable>

              <TouchableOpacity onPress={closeUploadModal}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AssignmentsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
  },

  backButton: {
    paddingRight: 12,
    paddingVertical: 4,
  },
  backButtonText: {
    fontSize: 20,
  },
  header: {
    // flexDirection: "row",
    // alignItems: "center",
    paddingHorizontal: 6,
    // paddingTop: 8,
    paddingBottom: 5,
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
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontWeight: "700",
    color: "#555555",
  },
  filtersContainer: {
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: "#F5F5F5",
  },
  dropdownWrapper: {
    position: "relative",
    zIndex: 10,
    marginBottom: 8,
  },
  courseDropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#DDDDDD",
  },
  courseDropdownOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: "#1565C0",
  },
  courseDropdownText: {
    fontSize: 14,
    color: "#333333",
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#666666",
    marginLeft: 8,
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: StyleSheet.hairlineWidth,
    borderTopWidth: 0,
    borderColor: "#1565C0",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEEEEE",
  },
  dropdownItemActive: {
    backgroundColor: "#E3F2FD",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#333333",
    flex: 1,
  },
  dropdownItemTextActive: {
    color: "#1565C0",
    fontWeight: "600",
  },
  statusFilterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#BBBBBB",
    backgroundColor: "#FFFFFF",
  },
  statusChipActive: {
    backgroundColor: "#1565C0",
    borderColor: "#1565C0",
  },
  statusChipText: {
    fontSize: 13,
    color: "#333333",
  },
  statusChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  summaryCard: {
    marginHorizontal: 4,
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E0E0E0",
  },
  summaryLine: {
    fontSize: 13,
    color: "#444444",
    marginBottom: 4,
  },
  progressBarBackground: {
    marginTop: 4,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EEEEEE",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#1565C0",
  },
  listContent: {
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E0E0E0",
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  assignmentTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#222222",
    marginRight: 8,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  cardMiddleRow: {
    marginBottom: 6,
  },
  courseText: {
    fontSize: 13,
    color: "#555555",
    marginBottom: 2,
  },
  dueText: {
    fontSize: 12,
    color: "#777777",
  },
  submittedText: {
    fontSize: 12,
    color: "#1C7C3A",
    marginBottom: 8,
  },
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
    flexWrap: "wrap",
  },
  primaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "#1565C0",
  },
  primaryButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  reuploadText: {
    fontSize: 12,
    color: "#1565C0",
  },
  lateWarning: {
    fontSize: 12,
    color: "#C62828",
  },
  attachmentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  attachmentIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  attachmentText: {
    fontSize: 12,
    color: "#555555",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#666666",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#222222",
  },
  modalAssignmentTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333333",
  },
  modalDueText: {
    fontSize: 13,
    color: "#777777",
    marginBottom: 12,
  },
  modalButtonsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#1565C0",
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1565C0",
  },
  selectedFileLabel: {
    fontSize: 12,
    color: "#777777",
  },
  selectedFileName: {
    fontSize: 13,
    color: "#333333",
    marginBottom: 12,
  },
  modalBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cancelText: {
    fontSize: 13,
    color: "#777777",
    marginLeft: 12,
  },
  checkMark: {
    fontSize: 16,
    color: "#1565C0",
    fontWeight: "700",
  },
});
