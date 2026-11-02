import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import bundledConfig from '../../firebase-applet-config.json';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

// Allow Netlify / external environment variable overrides while defaulting to bundled yatrababa-8b728 config
const env = (typeof import.meta !== 'undefined' && import.meta?.env) ? import.meta.env : ({} as Record<string, string | undefined>);

const firebaseConfig = {
  projectId: env.VITE_FIREBASE_PROJECT_ID || bundledConfig.projectId || 'yatrababa-8b728',
  appId: env.VITE_FIREBASE_APP_ID || bundledConfig.appId,
  apiKey: env.VITE_FIREBASE_API_KEY || bundledConfig.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || bundledConfig.authDomain || 'yatrababa-8b728.firebaseapp.com',
  firestoreDatabaseId: env.VITE_FIREBASE_FIRESTORE_DB_ID || bundledConfig.firestoreDatabaseId || '(default)',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || bundledConfig.storageBucket || 'yatrababa-8b728.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || bundledConfig.messagingSenderId,
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Use specified database ID or default with ignoreUndefinedProperties to prevent setDoc crashes
const firestoreDbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? firebaseConfig.firestoreDatabaseId
  : undefined;

export const db = initializeFirestore(
  app,
  {
    ignoreUndefinedProperties: true,
  },
  firestoreDbId
);

// Firebase Storage initialized with project storage bucket
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
// Force Google account chooser so the user can explicitly select the admin email
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot per Firebase guidelines
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'siteSettings', 'main'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection: client appears offline or connecting.');
    }
    return false;
  }
}

export { signInWithPopup, signOut };
