# How to Seed Assignments, Events, and Classes Data to Firebase

This guide explains how to seed assignments, events, and classes data to Firebase Firestore.

## Available Functions

The seed script (`src/scripts/seedFirebase.js`) now includes:

1. `seedAssignments()` - Seeds assignments data
2. `seedEvents()` - Seeds events data  
3. `seedClasses()` - Seeds classes data (flattens nested structure)
4. `seedAllData()` - Seeds all data at once

## Usage

### Option 1: Import and call from your app

You can import and call these functions from anywhere in your app:

```javascript
import { seedAssignments, seedEvents, seedClasses, seedAllData } from './src/scripts/seedFirebase';

// Seed all data at once (recommended)
await seedAllData();

// Or seed individually
await seedAssignments();
await seedEvents();
await seedClasses();
```

### Option 2: Create a temporary component

Create a temporary screen or component to trigger seeding:

```javascript
import React from 'react';
import { View, Button } from 'react-native';
import { seedAllData } from '../scripts/seedFirebase';

export default function SeedDataScreen() {
  const handleSeed = async () => {
    try {
      const results = await seedAllData();
      console.log('Seeding complete:', results);
      alert('Data seeded successfully!');
    } catch (error) {
      console.error('Error seeding data:', error);
      alert('Error seeding data: ' + error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Seed All Data to Firebase" onPress={handleSeed} />
    </View>
  );
}
```

### Option 3: Call from console (Development)

In development, you can call these functions from the React Native debugger console or add a button in your app temporarily.

## Data Structure

### Assignments
- Collection: `assignments`
- Document ID: Assignment `id` from JSON
- Fields: All fields from assignments.json plus `createdAt` and `updatedAt`

### Events
- Collection: `events`
- Document ID: Event `id` from events.js
- Fields: All fields from events.js plus `createdAt` and `updatedAt`

### Classes
- Collection: `classes`
- Document ID: Class `id` from classes.json
- Fields: All class fields plus:
  - `date`: Date string (YYYY-MM-DD)
  - `dayOfWeek`: Day name (Monday, Tuesday, etc.)
  - `month`: Month string (YYYY-MM)
  - `createdAt` and `updatedAt`

## Notes

- The seed functions check if data already exists and will update it
- Classes are flattened from the nested structure (months > schedule > date > classes)
- All data includes timestamps for tracking
- Batch writes are used for efficiency when seeding large datasets

