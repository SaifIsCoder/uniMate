import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

/**
 * Authenticate a student using Firebase Auth
 * @param {string} identifier - Student ID or Email (university/personal)
 * @param {string} password - Password
 * @returns {Object|null} - Student data if authenticated, null otherwise
 */
export const authenticateStudent = async (identifier, password) => {
  if (!identifier || !password) {
    throw new Error('Email/Student ID and password are required');
  }

  try {
    let email = identifier;
    let studentId = identifier;

    // If identifier is not an email, search for student by Student ID
    if (!identifier.includes('@')) {
      const studentRef = doc(db, 'students', identifier);
      const studentSnap = await getDoc(studentRef);

      if (!studentSnap.exists()) {
        throw new Error('Student not found');
      }

      const studentData = studentSnap.data();
      email = studentData.contact?.universityEmail || studentData.email;

      if (!email) {
        throw new Error('Student email not found');
      }
      studentId = identifier;
    } else {
      // If it's an email, find the studentId from email mapping or search
      const emailRef = doc(db, 'studentEmails', email);
      const emailSnap = await getDoc(emailRef);
      
      if (emailSnap.exists()) {
        studentId = emailSnap.data().studentId;
      } else {
        // Fallback: search students collection by email field
        const studentsRef = collection(db, 'students');
        const q = query(studentsRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          studentId = doc.id;
        } else {
          throw new Error('Student not found');
        }
      }
    }

    // Authenticate with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    // Get student profile from Firestore using studentId
    const studentRef = doc(db, 'students', studentId);
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) {
      throw new Error('Student profile not found in Firestore');
    }

    const studentData = studentSnap.data();

    // Check if student is active
    if (!studentData.status?.isActive) {
      await firebaseSignOut(auth);
      throw new Error('Student account is inactive');
    }

    return {
      ...studentData,
      uid: user.uid,
      email: user.email,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    
    // Provide user-friendly error messages
    if (error.code === 'auth/user-not-found') {
      throw new Error('Student account not found');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email format');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many login attempts. Please try again later.');
    }
    
    throw error;
  }
};

/**
 * Get current authenticated student
 */
export const getCurrentStudent = async () => {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }

  try {
    const email = user.email;
    
    // Get studentId from email mapping
    const emailRef = doc(db, 'studentEmails', email);
    const emailSnap = await getDoc(emailRef);
    
    let studentId = null;
    
    if (emailSnap.exists()) {
      studentId = emailSnap.data().studentId;
    } else {
      // Fallback: search by email field in students collection
      const studentsRef = collection(db, 'students');
      const q = query(studentsRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        studentId = querySnapshot.docs[0].id;
      }
    }

    if (!studentId) {
      return null;
    }

    // Get student profile
    const studentRef = doc(db, 'students', studentId);
    const studentSnap = await getDoc(studentRef);

    if (studentSnap.exists()) {
      return {
        ...studentSnap.data(),
        uid: user.uid,
        email: user.email,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting current student:', error);
    return null;
  }
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return true;
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
