import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

export interface UserProfileDocument {
  uid: string;
  name: string;
  username: string;
  email: string | null;
  phone?: string | null;
  role: 'User' | 'Admin' | 'Instructor';
  avatar?: string | null;
  bio?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

/**
 * Get user profile document from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfileDocument | null> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfileDocument;
    }
    return null;
  } catch (error) {
    console.warn('[Firestore] Error getting user profile:', error);
    return null;
  }
}

/**
 * Create or update user profile document in Firestore
 */
export async function createOrUpdateUserProfile(
  uid: string,
  data: Partial<UserProfileDocument>
): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(userRef, {
        uid,
        name: data.name || 'AI Nexus Learner',
        username: data.username || `@learner_${uid.slice(0, 6)}`,
        email: data.email || null,
        phone: data.phone || null,
        role: data.role || 'User',
        avatar: data.avatar || null,
        bio: data.bio || 'AI Practitioner & Systems Builder',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.warn('[Firestore] Error saving user profile:', error);
  }
}

/**
 * Query user by username or email in Firestore
 */
export async function findUserByEmailOrUsername(
  identifier: string
): Promise<UserProfileDocument | null> {
  try {
    const clean = identifier.trim().toLowerCase();
    const usersRef = collection(db, 'users');

    // Query email
    const emailQuery = query(usersRef, where('email', '==', clean));
    const emailSnap = await getDocs(emailQuery);
    if (!emailSnap.empty) {
      return emailSnap.docs[0].data() as UserProfileDocument;
    }

    // Query username
    const usernameWithoutAt = clean.replace(/^@/, '');
    const userQuery = query(usersRef, where('username', '==', `@${usernameWithoutAt}`));
    const userSnap = await getDocs(userQuery);
    if (!userSnap.empty) {
      return userSnap.docs[0].data() as UserProfileDocument;
    }

    return null;
  } catch (error) {
    console.warn('[Firestore] Error querying user:', error);
    return null;
  }
}
