import admin from 'firebase-admin';
import { config } from 'dotenv';

config();

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();

export { admin, db };
