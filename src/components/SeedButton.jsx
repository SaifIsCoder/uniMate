/**
 * Component to seed Firebase with student data
 * This is a one-time operation - can be removed after seeding
 * 
 * Usage: Add <SeedButton /> to a screen temporarily to seed data
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { seedStudents } from '../scripts/seedFirebase';

export default function SeedButton() {
  const [loading, setLoading] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const handleSeed = async () => {
    Alert.alert(
      'Seed Firebase',
      'This will create student accounts in Firebase Auth and Firestore. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Seed',
          onPress: async () => {
            setLoading(true);
            try {
              const results = await seedStudents();
              setSeeded(true);
              const message = `New: ${results.success.length}\nUpdated: ${results.updated?.length || 0}\nErrors: ${results.errors.length}`;
              Alert.alert(
                'Seeding Complete',
                message,
                [{ text: 'OK' }]
              );
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to seed students');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (seeded) {
    return (
      <View style={styles.container}>
        <Text style={styles.successText}>✓ Students seeded successfully!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSeed}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Seed Students to Firebase</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.info}>
        Run this once to populate Firebase with student data
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    marginTop: 10,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  successText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
});

