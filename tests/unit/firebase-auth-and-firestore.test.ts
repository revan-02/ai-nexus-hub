import { describe, it, expect, vi, beforeEach } from 'vitest';
import { firebaseConfig, app, auth, db } from '@/lib/firebase/config';
import * as firestoreModule from '@/lib/firebase/firestore';
import * as authModule from '@/lib/firebase/auth';

describe('Firebase Configuration & Services Suite (revbodh)', () => {
  it('correctly configures project revbodh with sender ID 779059382432', () => {
    expect(firebaseConfig.projectId).toBe('revbodh');
    expect(firebaseConfig.authDomain).toContain('revbodh');
    expect(firebaseConfig.messagingSenderId).toBe('779059382432');
    expect(firebaseConfig.storageBucket).toContain('revbodh');
    expect(firebaseConfig.apiKey).toBe('AIzaSyBRw7qdie8WYA5_8FgkLHcerHBsxrXnvbs');
    expect(firebaseConfig.appId).toBe('1:779059382432:web:51cb6917b380a56c92e1c5');
    expect(firebaseConfig.measurementId).toBe('G-MG6XXP3ZWB');
  });

  it('initializes Firebase App, Auth, and Firestore instances', () => {
    expect(app).toBeDefined();
    expect(auth).toBeDefined();
    expect(db).toBeDefined();
  });

  it('exports complete Firebase Authentication methods for Email, Google, and Phone Auth', () => {
    expect(typeof authModule.loginWithEmail).toBe('function');
    expect(typeof authModule.registerWithEmail).toBe('function');
    expect(typeof authModule.signInWithGoogle).toBe('function');
    expect(typeof authModule.initPhoneRecaptcha).toBe('function');
    expect(typeof authModule.sendPhoneOtp).toBe('function');
    expect(typeof authModule.verifyPhoneOtp).toBe('function');
    expect(typeof authModule.logoutUser).toBe('function');
    expect(typeof authModule.onAuthStateChange).toBe('function');
  });

  it('exports Firestore database document helpers for user profiles', () => {
    expect(typeof firestoreModule.getUserProfile).toBe('function');
    expect(typeof firestoreModule.createOrUpdateUserProfile).toBe('function');
    expect(typeof firestoreModule.findUserByEmailOrUsername).toBe('function');
  });
});
