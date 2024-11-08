import admin from 'firebase-admin';
import { config } from 'dotenv';

config();

// Initialize Firebase Admin SDK with Firestore
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
});

const db = admin.firestore(); // Firestore database instance

export { admin, db };
