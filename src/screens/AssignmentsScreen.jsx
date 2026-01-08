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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import assignmentsData from "../data/assignments.json";
import Header from "../components/Header";

const STATUS_FILTERS = ["All", "Pending", "Submitted", "Overdue"];

const AssignmentsScreen = () => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  const [assignments, setAssignments] = useState(assignmentsData.assignments);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("All Courses");
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const stats = useMemo(() => {
    const total = assignments.length;
    const pending = assignments.filter((a) => a.status === "Pending").length;
    const submitted = assignments.filter((a) => a.status === "Submitted").length;
    const overdue = assignments.filter((a) => a.status === "Overdue").length;
    const completion = total === 0 ? 0 : Math.round((submitted / total) * 100);

    return { total, pending, submitted, overdue, completion };
  }, [assignments]);

  // Get unique courses from assignments
  const courses = useMemo(() => {
    const uniqueCourses = [...new Set(assignments.map((a) => a.course))];
    return ["All Courses", ...uniqueCourses];
  }, [assignments]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const statusMatch = selectedStatusFilter === "All" || a.status === selectedStatusFilter;
      const courseMatch = selectedCourse === "All Courses" || a.course === selectedCourse;
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

  // Mock file selection - in production, use expo-document-picker or expo-image-picker
  const handleChooseFile = () => {
    setSelectedFileName("my_assignment.pdf");
  };

  const handleTakePhoto = () => {
    setSelectedFileName("photo_assignment.jpg");
  };

  const handleSubmitUpload = () => {
    if (!selectedAssignment || !selectedFileName) return;

    setSubmitting(true);
    
    // Update local state to mark as submitted
    setTimeout(() => {
      setAssignments(prev => 
        prev.map(a => 
          a.id === selectedAssignment.id 
            ? { ...a, status: "Submitted", submittedAt: new Date().toISOString() }
            : a
        )
      );
      
      setSubmitting(false);
      Alert.alert("Success", "Assignment submitted successfully!");
      closeUploadModal();
    }, 1000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderStatusBadge = (status) => {
    let bgColor = "#E0E0E0";
    let textColor = "#333";
    let iconName = "clock-outline";

    if (status === "Submitted") {
      bgColor = "#D1F5E1";
      textColor = "#1C7C3A";
      iconName = "check-circle-outline";
    } else if (status === "Pending") {
      bgColor = "#E3F2FD";
      textColor = "#1565C0";
      iconName = "clock-outline";
    } else if (status === "Overdue") {
      bgColor = "#FFEBEE";
      textColor = "#C62828";
      iconName = "alert-circle-outline";
    }

    return (
      <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
        <MaterialCommunityIcons name={iconName} size={12} color={textColor} style={{ marginRight: 4 }} />
        <Text style={[styles.statusBadgeText, { color: textColor }]}>{status}</Text>
      </View>
    );
  };

  const renderAssignmentItem = ({ item }) => {
    return (
      <View style={[styles.card, { borderLeftColor: item.color || '#6366F1' }]}>
        <View style={styles.cardTopRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.assignmentTitle} numberOfLines={2}>{item.title}</Text>
          </View>
          {renderStatusBadge(item.status)}
        </View>

        <View style={styles.cardMiddleRow}>
          <View style={styles.courseContainer}>
            <MaterialCommunityIcons name="book-outline" size={14} color="#6B7280" />
            <Text style={styles.courseText}>{item.course}</Text>
            <Text style={styles.courseCode}>({item.courseCode})</Text>
          </View>
          <View style={styles.dueContainer}>
            <MaterialCommunityIcons name="calendar-clock" size={14} color="#6B7280" />
            <Text style={styles.dueLabel}>Due date:</Text>
            <Text style={styles.dueText}>{formatDate(item.dueDate)}</Text>
          </View>
        </View>

        {/* {item.description && (
          <Text style={styles.descriptionText} numberOfLines={2}>{item.description}</Text>
        )} */}

        {item.status === "Submitted" && item.submittedAt && (
          <View style={styles.submittedContainer}>
            <MaterialCommunityIcons name="check-circle" size={14} color="#1C7C3A" />
            <Text style={styles.submittedText}>
              Submitted on {formatDate(item.submittedAt)}
            </Text>
          </View>
        )}

        <View style={styles.cardBottomRow}>
          <View style={styles.pointsContainer}>
            <MaterialCommunityIcons name="star-outline" size={14} color="#F59E0B" />
            <Text style={styles.pointsText}>{item.points} pts</Text>
          </View>

          {item.status === "Submitted" ? (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.secondaryBtn}>
                <MaterialCommunityIcons name="eye-outline" size={16} color="#1565C0" />
                <Text style={styles.secondaryBtnText}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openUploadModal(item)}>
                <Text style={styles.reuploadText}>Re-upload</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.primaryButton, item.status === "Overdue" && styles.overdueButton]}
                onPress={() => openUploadModal(item)}
              >
                <MaterialCommunityIcons name="upload" size={16} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>
                  {item.status === "Overdue" ? "Late Submit" : "Submit"}
                </Text>
              </TouchableOpacity>
              {item.hasAttachment && (
                <TouchableOpacity style={styles.attachmentBtn}>
                  <MaterialCommunityIcons name="paperclip" size={16} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />

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
              {courses.map((course) => {
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

      {/* SUMMARY CARD */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLine}>
          Assignments: {stats.total} Pending: {stats.pending} Overdue: {stats.overdue}
        </Text>
        <Text style={styles.summaryLine}>
          Completed: {stats.submitted} 
          {/* ({stats.completion}%) */}
        </Text>
        {/* <View style={styles.progressBarBackground}>
          <View
            style={[styles.progressBarFill, { width: `${stats.completion}%` }]}
          />
        </View> */}
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
                  Due: {formatDate(selectedAssignment.dueDate)}
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
                  (!selectedFileName || submitting) && { opacity: 0.5 },
                ]}
                onPress={handleSubmitUpload}
                disabled={!selectedFileName || submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Submit</Text>
                )}
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
    padding: 20,
    paddingBottom: 0,
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
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  titleContainer: {
    flex: 1,
    marginRight: 10,
  },
  assignmentTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    lineHeight: 22,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  cardMiddleRow: {
    marginBottom: 8,
  },
  courseContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  courseText: {
    fontSize: 13,
    color: "#4B5563",
    marginLeft: 6,
  },
  courseCode: {
    fontSize: 12,
    color: "#9CA3AF",
    marginLeft: 4,
  },
  dueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dueLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 6,
    fontWeight: "500",
  },
  dueText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  descriptionText: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 10,
    lineHeight: 18,
  },
  submittedContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  submittedText: {
    fontSize: 12,
    color: "#1C7C3A",
    marginLeft: 6,
  },
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pointsText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#F59E0B",
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1565C0",
    gap: 6,
  },
  overdueButton: {
    backgroundColor: "#DC2626",
  },
  primaryButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#E3F2FD",
    gap: 4,
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1565C0",
  },
  reuploadText: {
    fontSize: 12,
    color: "#1565C0",
    fontWeight: "500",
  },
  attachmentBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingTop: 100,
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
