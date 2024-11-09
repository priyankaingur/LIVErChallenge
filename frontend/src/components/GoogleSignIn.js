import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import  { auth, db } from '../firebase';
import React, { useState } from 'react';

const SignInWithGoogle = () => {
    const [user, setUser] = useState(null);

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const userCredential = result.user;

            const userDocRef = doc(db, "users", userCredential.uid);
            const userDocSnap = await getDoc(userDocRef);

            // If the user doesn't exist in Firestore, create the user document
            if (!userDocSnap.exists()) {
                // Set up the user's document in Firestore
                await setDoc(userDocRef, {
                    email: userCredential.email,
                    displayName: userCredential.displayName,
                    photoURL: userCredential.photoURL,
                    createdAt: new Date(),
                });
                console.log("User document created in Firestore");
            } else {
                console.log("User document already exists in Firestore");
            }

            setUser(userCredential);
        } catch (error) {
            console.error("Error signing in with Google:", error.message);
        }
    };

    return (
        <div>
            <button onClick={signInWithGoogle}>Sign In with Google</button>
            {user && (
                <div>
                    <h3>Welcome, {user.displayName}</h3>
                    <p>Email: {user.email}</p>
                </div>
            )}
        </div>
    );
};

export default SignInWithGoogle;
