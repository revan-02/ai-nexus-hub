import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  User as FirebaseUser,
  ApplicationVerifier,
} from 'firebase/auth';
import { auth, googleProvider } from './config';
import { createOrUpdateUserProfile, getUserProfile } from './firestore';

export interface AuthSuccessResult {
  user: FirebaseUser;
  profile: {
    uid: string;
    name: string;
    email: string | null;
    phone: string | null;
    role: string;
    username: string;
    avatar: string | null;
  };
}

/**
 * Format and persist user info in localStorage so all components react immediately
 */
function syncLocalUserSession(profile: {
  uid: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  username: string;
  avatar: string | null;
}) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      'nexus_user_profile',
      JSON.stringify({
        name: profile.name,
        email: profile.email || '',
        phone: profile.phone || '',
        username: profile.username.startsWith('@') ? profile.username : `@${profile.username}`,
        bio: 'AI Practitioner & Systems Builder',
        role: profile.role,
        avatar: profile.avatar,
      })
    );
    window.dispatchEvent(new Event('nexus_profile_updated'));
  } catch (e) {
    console.warn('[Firebase Auth] Failed to sync local session:', e);
  }
}

/**
 * Sign in with Email and Password
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<AuthSuccessResult> {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const user = userCredential.user;

  // Retrieve or initialize Firestore document
  let profileDoc = await getUserProfile(user.uid);
  if (!profileDoc) {
    const rawUsername = user.email ? user.email.split('@')[0] : `user_${user.uid.slice(0, 5)}`;
    profileDoc = {
      uid: user.uid,
      name: user.displayName || rawUsername,
      username: `@${rawUsername}`,
      email: user.email,
      phone: user.phoneNumber,
      role: 'User',
      avatar: user.photoURL,
      bio: 'AI Practitioner & Systems Builder',
    };
    await createOrUpdateUserProfile(user.uid, profileDoc);
  }

  const profile = {
    uid: user.uid,
    name: profileDoc.name || user.displayName || 'Learner',
    email: user.email,
    phone: profileDoc.phone || user.phoneNumber || null,
    role: profileDoc.role || 'User',
    username: profileDoc.username || `@${user.uid.slice(0, 6)}`,
    avatar: profileDoc.avatar || user.photoURL || null,
  };

  syncLocalUserSession(profile);
  return { user, profile };
}

/**
 * Register with Email, Password, Name, and Phone
 */
export async function registerWithEmail(params: {
  name: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<AuthSuccessResult> {
  const { name, username, email, password, phone } = params;
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const user = userCredential.user;

  // Update Auth Profile display name
  try {
    await updateProfile(user, { displayName: name.trim() });
  } catch (err) {
    console.warn('[Firebase Auth] Could not update displayName on auth user:', err);
  }

  const cleanUsername = username.trim().replace(/^@/, '');
  const profileDoc = {
    uid: user.uid,
    name: name.trim(),
    username: `@${cleanUsername}`,
    email: email.trim().toLowerCase(),
    phone: phone ? phone.trim() : null,
    role: 'User' as const,
    avatar: null,
    bio: 'AI Practitioner & Systems Builder',
  };

  // Save to Firestore
  await createOrUpdateUserProfile(user.uid, profileDoc);

  const profile = {
    uid: user.uid,
    name: profileDoc.name,
    email: profileDoc.email,
    phone: profileDoc.phone,
    role: profileDoc.role,
    username: profileDoc.username,
    avatar: null,
  };

  syncLocalUserSession(profile);
  return { user, profile };
}

/**
 * Sign In with Google Popup
 */
export async function signInWithGoogle(): Promise<AuthSuccessResult> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Retrieve or create Firestore profile
  let profileDoc = await getUserProfile(user.uid);
  if (!profileDoc) {
    const rawUsername = user.email ? user.email.split('@')[0] : `user_${user.uid.slice(0, 5)}`;
    profileDoc = {
      uid: user.uid,
      name: user.displayName || 'Google User',
      username: `@${rawUsername}`,
      email: user.email,
      phone: user.phoneNumber,
      role: 'User',
      avatar: user.photoURL,
      bio: 'AI Practitioner & Systems Builder',
    };
    await createOrUpdateUserProfile(user.uid, profileDoc);
  }

  const profile = {
    uid: user.uid,
    name: profileDoc.name || user.displayName || 'Google User',
    email: user.email,
    phone: profileDoc.phone || user.phoneNumber || null,
    role: profileDoc.role || 'User',
    username: profileDoc.username || `@${user.uid.slice(0, 6)}`,
    avatar: profileDoc.avatar || user.photoURL || null,
  };

  syncLocalUserSession(profile);
  return { user, profile };
}

/**
 * Initialize Invisible reCAPTCHA verifier for Phone Auth
 */
export function initPhoneRecaptcha(containerId: string): RecaptchaVerifier {
  if (typeof window === 'undefined') {
    throw new Error('reCAPTCHA can only be initialized on the client side.');
  }

  // Clear existing verifier if any
  const existingVerifier = (window as unknown as { recaptchaVerifier?: RecaptchaVerifier }).recaptchaVerifier;
  if (existingVerifier) {
    try {
      existingVerifier.clear();
    } catch {}
  }

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
    },
    'expired-callback': () => {
      console.warn('[Firebase Auth] reCAPTCHA expired, please retry.');
    },
  });

  (window as unknown as { recaptchaVerifier: RecaptchaVerifier }).recaptchaVerifier = verifier;
  return verifier;
}

/**
 * Send Phone Verification OTP SMS
 */
export async function sendPhoneOtp(
  phoneNumber: string,
  appVerifier?: ApplicationVerifier
): Promise<ConfirmationResult> {
  const verifier =
    appVerifier || (window as unknown as { recaptchaVerifier?: RecaptchaVerifier }).recaptchaVerifier;

  if (!verifier) {
    throw new Error('reCAPTCHA verifier not initialized. Call initPhoneRecaptcha first.');
  }

  // Ensure phone has leading + and country code
  let formattedPhone = phoneNumber.trim();
  if (!formattedPhone.startsWith('+')) {
    const digits = formattedPhone.replace(/[^0-9]/g, '');
    if (digits.length === 10) {
      formattedPhone = `+91${digits}`; // Default to India (+91) if 10-digit number
    } else {
      formattedPhone = `+${digits}`;
    }
  }

  return await signInWithPhoneNumber(auth, formattedPhone, verifier);
}

/**
 * Confirm Phone Verification Code and complete sign in
 */
export async function verifyPhoneOtp(
  confirmationResult: ConfirmationResult,
  verificationCode: string,
  extraDetails?: { name?: string; username?: string }
): Promise<AuthSuccessResult> {
  const userCredential = await confirmationResult.confirm(verificationCode.trim());
  const user = userCredential.user;

  // Retrieve or create Firestore profile
  let profileDoc = await getUserProfile(user.uid);
  const cleanUsername = extraDetails?.username?.replace(/^@/, '') || `learner_${user.uid.slice(0, 5)}`;
  const cleanName = extraDetails?.name?.trim() || user.displayName || 'Phone User';

  if (!profileDoc) {
    profileDoc = {
      uid: user.uid,
      name: cleanName,
      username: `@${cleanUsername}`,
      email: user.email,
      phone: user.phoneNumber,
      role: 'User',
      avatar: user.photoURL,
      bio: 'AI Practitioner & Systems Builder',
    };
    await createOrUpdateUserProfile(user.uid, profileDoc);
  } else if (extraDetails?.name) {
    await createOrUpdateUserProfile(user.uid, {
      name: cleanName,
      username: `@${cleanUsername}`,
    });
    profileDoc.name = cleanName;
    profileDoc.username = `@${cleanUsername}`;
  }

  const profile = {
    uid: user.uid,
    name: profileDoc.name,
    email: user.email,
    phone: user.phoneNumber || profileDoc.phone || null,
    role: profileDoc.role || 'User',
    username: profileDoc.username,
    avatar: profileDoc.avatar || user.photoURL || null,
  };

  syncLocalUserSession(profile);
  return { user, profile };
}

/**
 * Sign out user from Firebase and clear local session
 */
export async function logoutUser(): Promise<void> {
  await firebaseSignOut(auth);
  if (typeof window !== 'undefined') {
    localStorage.removeItem('nexus_user_profile');
    window.dispatchEvent(new Event('nexus_profile_updated'));
  }
}

/**
 * Listen to Firebase Auth state change
 */
export function onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
