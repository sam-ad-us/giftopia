// This file is designated for CLIENT-SIDE Firebase initialization ONLY.

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

interface FirebaseClientServices {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

let firebaseClientServices: FirebaseClientServices | null = null;

/**
 * Initializes and returns a singleton instance of Firebase services for the client.
 * This function is safe to call multiple times and will only initialize Firebase once.
 * It ensures that Firebase is ONLY initialized on the client side.
 * @returns {FirebaseClientServices} An object containing the Firebase App, Auth, and Firestore instances.
 */
export function getFirebaseClient(): FirebaseClientServices {
  // Guard clause to ensure this only runs in the browser.
  if (typeof window === 'undefined') {
    // This will be logged on the server during SSR/build if accidentally imported.
    console.error("getFirebaseClient should only be called on the client side.");
    // Return a dummy object or throw an error to prevent server-side execution.
    // In this case, we'll throw to make the issue obvious during development.
    throw new Error("Firebase cannot be initialized on the server.");
  }

  // Use the existing instance if it's already been created (singleton pattern).
  if (firebaseClientServices) {
    return firebaseClientServices;
  }
  
  // If no apps are initialized, create a new one. Otherwise, get the existing one.
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  // Store the initialized services in the singleton variable.
  firebaseClientServices = {
    firebaseApp: app,
    auth,
    firestore,
  };

  return firebaseClientServices;
}
