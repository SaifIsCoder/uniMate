import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { events } from "../data/events";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

const categories = ["All", "Workshop", "Sports", "Cultural", "Tech"];

export default function EventsScreen() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredEvents =
    activeCategory === "All"
      ? events
      : events.filter((e) => e.category === activeCategory);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Events</Text>
      </View>
      {/* CATEGORY FILTERS */}
      <View style={styles.filterRow}>
        {categories.map((cat) => {
          const active = activeCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text
                style={[styles.filterText, active && styles.filterTextActive]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* EVENT LIST */}
      <FlatList
        data={filteredEvents}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <EventCard event={item} />}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </SafeAreaView>
  );
}

/* ---------------- EVENT CARD COMPONENT ---------------- */

function EventCard({ event }) {
  return (
    <View style={styles.card}>
      {/* IMAGE */}
      {event.image && (
        <Image source={{ uri: event.image }} style={styles.cardImage} />
      )}

      <View style={{ padding: 12 }}>
        {/* TITLE */}
        <Text style={styles.eventName}>{event.name}</Text>

        {/* CATEGORY BADGE */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{event.category}</Text>
        </View>

        {/* DATE + TIME */}
        <Text style={styles.eventInfo}>
          📅 {event.date} ⏰ {event.time}
        </Text>

        {/* LOCATION */}
        <Text style={styles.eventInfo}>📍 {event.place}</Text>

        {/* ORGANIZER */}
        <Text style={styles.organizer}>🎤 Organized by: {event.organizer}</Text>

        {/* DESCRIPTION PREVIEW */}
        <Text numberOfLines={2} style={styles.description}>
          {event.description}
        </Text>

        {/* Button */}
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
    backgroundColor: "#F9FAFB",
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
    // marginTop: 15,
  },
  filterRow: {
    paddingTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 15,
  },

  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  filterChipActive: {
    backgroundColor: "#1565C0",
  },
  filterText: { fontSize: 14, color: "#374151" },
  filterTextActive: { color: "white", fontWeight: "600" },

  /* CARD */
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 20,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    // elevation: 3,
    overflow: "hidden",
  },

  cardImage: {
    width: "100%",
    height: 160,
  },

  eventName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 5,
  },

  badge: {
    backgroundColor: "#EEF2FF",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  badgeText: { color: "#4F46E5", fontSize: 12, fontWeight: "600" },

  eventInfo: { fontSize: 14, color: "#6B7280", marginBottom: 3 },

  organizer: { fontSize: 14, color: "#374151", marginBottom: 10 },

  description: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 12,
  },

  detailsButton: {
    backgroundColor: "#1565C0",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  detailsButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
