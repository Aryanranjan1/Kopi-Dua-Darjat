
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    firestore: getFirestore(firebaseApp),
  };
}

// This function is intended for server-side use only.
export function initializeServerSideFirebase() {
  if (!getApps().length) {
    // If no app is initialized, initialize one with the config.
    const firebaseApp = initializeApp(firebaseConfig);
    return getSdks(firebaseApp);
  }
  // If an app is already initialized, get it and return the SDKs.
  return getSdks(getApp());
}
