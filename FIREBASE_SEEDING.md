# Firebase Seeding Instructions

This guide explains how to seed student data into Firebase Auth and Firestore.

## Overview

The app uses Firebase Authentication and Firestore to store student accounts. Students are pre-registered by admins through the admin dashboard, and the mobile app only handles login.

## Seeding Process

### Option 1: Using the Seed Button (Recommended)

1. **Open the Login Screen** - The seed button is temporarily added to the login screen
2. **Click "Seed Students to Firebase"** - This will create all student accounts
3. **Wait for completion** - The process will show success/error messages
4. **Remove the SeedButton** - After seeding, you can remove `<SeedButton />` from `LoginScreen.jsx`

### Option 2: Programmatic Seeding

Import and call the seed function in your code:

```javascript
import { seedStudents } from './src/scripts/seedFirebase';

// Call once to seed all students
const results = await seedStudents();
console.log(`Seeded ${results.success.length} students`);
```

## What Gets Created

For each student in `src/data/students.json`:

1. **Firebase Auth Account**
   - Email: Student's university email (`contact.universityEmail`)
   - Password: Student ID (e.g., `BSCS-23-041`)
   - Students can change their password after first login

2. **Firestore Documents**
   - `students/{studentId}` - Full student profile data
   - `studentEmails/{email}` - Email to Student ID mapping for quick lookup

## Student Login

Students can login using:
- **Student ID**: `BSCS-23-041`
- **University Email**: `ali.khan@university.edu`
- **Password**: Their Student ID (default, can be changed)

## Default Credentials

- **Email**: `{studentId}@university.edu` format (from `contact.universityEmail`)
- **Password**: Student ID (e.g., `BSCS-23-041`)

## Important Notes

1. **One-time Operation**: Only run the seed script once. It checks for existing students and skips them.

2. **Password Security**: Default passwords are set to Student IDs. Students should change their passwords after first login.

3. **Admin Dashboard**: New student registrations should be handled through the admin dashboard, which will create accounts in Firebase.

4. **Firebase Rules**: Make sure your Firestore security rules allow:
   - Reading from `students` collection (authenticated users)
   - Reading from `studentEmails` collection (authenticated users)
   - Writing to these collections (admin only)

## Troubleshooting

### "Email already in use"
- The student account already exists in Firebase Auth
- The script will continue and add/update the Firestore document

### "Student not found" during login
- Make sure the seed script has been run
- Verify the student exists in `students.json`
- Check Firestore console to confirm the document exists

### Authentication errors
- Verify Firebase configuration in `src/config/firebase.js`
- Check that Firebase Auth is enabled in Firebase Console
- Ensure Firestore is enabled and rules are configured

## Removing Seed Button

After seeding is complete, remove the SeedButton from LoginScreen:

1. Open `src/screens/LoginScreen.jsx`
2. Remove the import: `import SeedButton from "../components/SeedButton";`
3. Remove the component: `<SeedButton />`

