/**
 * Seed script to populate Firebase Auth and Firestore with student data
 * Run this script once to initialize student accounts
 * 
 * Usage: Import and call seedStudents() from your app or run as a one-time script
 */

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, setDoc, getDoc, writeBatch } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { students } from '../data';
import assignmentsData from '../data/assignments.json';
import { events } from '../data/events.js';
import classesData from '../data/classes.json';

/**
 * Seed students into Firebase Auth and Firestore
 * Creates auth accounts and stores student profiles in Firestore
 */
export const seedStudents = async () => {
  const results = {
    success: [],
    updated: [],
    errors: [],
  };

  console.log(`Starting to seed ${students.length} students...`);

  for (const student of students) {
    try {
      const email = student.contact?.universityEmail;
      const studentId = student.studentId;

      if (!email) {
        console.warn(`Skipping ${studentId}: No university email found`);
        results.errors.push({
          studentId,
          error: 'No university email',
        });
        continue;
      }

      // Default password: studentId (students can change this later)
      const defaultPassword = studentId;

      // Check if user already exists in Firestore
      const studentRef = doc(db, 'students', studentId);
      const studentSnap = await getDoc(studentRef);
      const exists = studentSnap.exists();
      const existingData = exists ? studentSnap.data() : null;

      // Get or create Firebase Auth account
      let uid = null;
      if (exists && existingData?.uid) {
        // Use existing UID if student already exists
        uid = existingData.uid;
        console.log(`Student ${studentId} already exists, updating data...`);
      } else {
        // Create Firebase Auth account for new students
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            defaultPassword
          );
          uid = userCredential.user.uid;
          console.log(`✓ Created auth account for ${studentId}`);
        } catch (authError) {
          // If user already exists in Auth, try to sign in to get uid
          if (authError.code === 'auth/email-already-in-use') {
            console.log(`Auth account already exists for ${studentId}, signing in to get uid...`);
            try {
              const existingUser = await signInWithEmailAndPassword(auth, email, defaultPassword);
              uid = existingUser.user.uid;
              // Sign out after getting uid
              await signOut(auth);
            } catch (signInError) {
              console.warn(`Could not sign in to get uid for ${studentId}:`, signInError.message);
              // Continue without uid - admin can update later
            }
          } else {
            throw authError;
          }
        }
      }

      // Store/update student profile in Firestore
      const studentData = {
        ...student,
        uid: uid || existingData?.uid, // Preserve existing UID or use new one
        email: email, // Store email for easy lookup
        createdAt: existingData?.createdAt || new Date().toISOString(), // Preserve original creation date
        updatedAt: new Date().toISOString(), // Always update this timestamp
      };

      await setDoc(studentRef, studentData);

      // Also create/update a mapping document for email lookup
      if (uid) {
        const emailRef = doc(db, 'studentEmails', email);
        await setDoc(emailRef, {
          studentId: studentId,
          uid: uid,
        });
      }
      
      if (exists) {
        console.log(`✓ Updated profile for ${studentId} in Firestore`);
        results.updated.push({
          studentId,
          email,
        });
      } else {
        console.log(`✓ Stored profile for ${studentId} in Firestore`);
        results.success.push({
          studentId,
          email,
          password: defaultPassword, // For reference - in production, send via secure channel
        });
      }
    } catch (error) {
      console.error(`✗ Error seeding ${student.studentId}:`, error.message);
      results.errors.push({
        studentId: student.studentId,
        error: error.message,
      });
    }
  }

  console.log('\n=== Seeding Complete ===');
  console.log(`New students: ${results.success.length}`);
  console.log(`Updated students: ${results.updated.length}`);
  console.log(`Errors: ${results.errors.length}`);

  if (results.success.length > 0) {
    console.log('\nSuccessfully seeded new students:');
    results.success.forEach(({ studentId, email, password }) => {
      console.log(`  ${studentId} - ${email} (password: ${password})`);
    });
  }

  if (results.updated.length > 0) {
    console.log('\nUpdated existing students:');
    results.updated.forEach(({ studentId, email }) => {
      console.log(`  ${studentId} - ${email}`);
    });
  }

  if (results.errors.length > 0) {
    console.log('\nErrors:');
    results.errors.forEach(({ studentId, error }) => {
      console.log(`  ${studentId}: ${error}`);
    });
  }

  return results;
};

/**
 * Seed assignments into Firestore
 */
export const seedAssignments = async () => {
  const results = {
    success: [],
    errors: [],
  };

  console.log(`Starting to seed ${assignmentsData.assignments.length} assignments...`);

  const batch = writeBatch(db);
  let batchCount = 0;
  const BATCH_LIMIT = 500;

  try {
    for (const assignment of assignmentsData.assignments) {
      try {
        const assignmentRef = doc(db, 'assignments', assignment.id);
        batch.set(assignmentRef, {
          ...assignment,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        batchCount++;

        if (batchCount >= BATCH_LIMIT) {
          await batch.commit();
          console.log(`✓ Committed batch of ${batchCount} assignments`);
          batchCount = 0;
        }

        results.success.push(assignment.id);
      } catch (error) {
        console.error(`✗ Error seeding assignment ${assignment.id}:`, error.message);
        results.errors.push({
          id: assignment.id,
          error: error.message,
        });
      }
    }

    // Commit remaining batch
    if (batchCount > 0) {
      await batch.commit();
      console.log(`✓ Committed final batch of ${batchCount} assignments`);
    }

    console.log('\n=== Assignments Seeding Complete ===');
    console.log(`Successfully seeded: ${results.success.length}`);
    console.log(`Errors: ${results.errors.length}`);
  } catch (error) {
    console.error('Error seeding assignments:', error);
  }

  return results;
};

/**
 * Seed events into Firestore
 */
export const seedEvents = async () => {
  const results = {
    success: [],
    errors: [],
  };

  console.log(`Starting to seed ${events.length} events...`);

  try {
    for (const event of events) {
      try {
        const eventRef = doc(db, 'events', event.id);
        await setDoc(eventRef, {
          ...event,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        console.log(`✓ Stored event ${event.id}: ${event.name}`);
        results.success.push(event.id);
      } catch (error) {
        console.error(`✗ Error seeding event ${event.id}:`, error.message);
        results.errors.push({
          id: event.id,
          error: error.message,
        });
      }
    }

    console.log('\n=== Events Seeding Complete ===');
    console.log(`Successfully seeded: ${results.success.length}`);
    console.log(`Errors: ${results.errors.length}`);
  } catch (error) {
    console.error('Error seeding events:', error);
  }

  return results;
};

/**
 * Seed classes into Firestore
 * Flattens the nested structure and adds dayOfWeek for easy querying
 */
export const seedClasses = async () => {
  const results = {
    success: [],
    errors: [],
  };

  console.log('Starting to seed classes...');

  const batch = writeBatch(db);
  let batchCount = 0;
  const BATCH_LIMIT = 500;

  try {
    // Helper to get day of week from date string
    const getDayOfWeek = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    for (const month of classesData.months) {
      for (const scheduleItem of month.schedule) {
        const dateString = scheduleItem.date;
        const dayOfWeek = getDayOfWeek(dateString);

        for (const classItem of scheduleItem.classes) {
          try {
            const classRef = doc(db, 'classes', classItem.id);
            batch.set(classRef, {
              ...classItem,
              date: dateString,
              dayOfWeek: dayOfWeek,
              month: month.month,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            batchCount++;

            if (batchCount >= BATCH_LIMIT) {
              await batch.commit();
              console.log(`✓ Committed batch of ${batchCount} classes`);
              batchCount = 0;
            }

            results.success.push(classItem.id);
          } catch (error) {
            console.error(`✗ Error seeding class ${classItem.id}:`, error.message);
            results.errors.push({
              id: classItem.id,
              error: error.message,
            });
          }
        }
      }
    }

    // Commit remaining batch
    if (batchCount > 0) {
      await batch.commit();
      console.log(`✓ Committed final batch of ${batchCount} classes`);
    }

    console.log('\n=== Classes Seeding Complete ===');
    console.log(`Successfully seeded: ${results.success.length}`);
    console.log(`Errors: ${results.errors.length}`);
  } catch (error) {
    console.error('Error seeding classes:', error);
  }

  return results;
};

/**
 * Seed all data (assignments, events, classes)
 */
export const seedAllData = async () => {
  console.log('=== Starting to seed all data ===\n');
  
  const assignmentsResult = await seedAssignments();
  console.log('\n');
  
  const eventsResult = await seedEvents();
  console.log('\n');
  
  const classesResult = await seedClasses();
  
  console.log('\n=== All Data Seeding Complete ===');
  return {
    assignments: assignmentsResult,
    events: eventsResult,
    classes: classesResult,
  };
};

/**
 * Helper function to seed a single student (useful for adding new students)
 */
export const seedSingleStudent = async (student) => {
  try {
    const email = student.contact?.universityEmail;
    const studentId = student.studentId;

    if (!email) {
      throw new Error('No university email found');
    }

    const defaultPassword = studentId;

    // Create Firebase Auth account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      defaultPassword
    );

    // Store student profile in Firestore
    const studentRef = doc(db, 'students', studentId);
    const studentData = {
      ...student,
      uid: userCredential.user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(studentRef, studentData);

    return {
      success: true,
      studentId,
      email,
      password: defaultPassword,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

