import React, { useState } from 'react';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(true);  // State to toggle between Register and Login

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');

        try {
            let userCredential;
            if (isRegistering) {
                // Register User
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                await setDoc(doc(db, 'users', user.uid), {
                    email: user.email,
                    uid: user.uid,
                    createdAt: new Date(),
                });

            } else {
                // Login User
                userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                console.log("User logged in:", user);
            }

            // Retrieve the access token
            const idToken = await userCredential.user.getIdToken();
            console.log('User ID Token:', idToken);

            // Store the token in localStorage (you can also use sessionStorage)
            localStorage.setItem('userToken', idToken);

            // Optional: Store user data as well for easy access
            localStorage.setItem('userUid', userCredential.user.uid);
            console.log('User UID stored in localStorage');

        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                setError("This email is already registered. Please use a different one.");
            } else if (err.code === 'auth/wrong-password') {
                setError("Incorrect password. Please try again.");
            } else {
                setError("Error: " + err.message);
            }
        }
    };

    return (
        <div>
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            <form onSubmit={handleAuth}>
                <div>
                    <label>Email: </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
            </form>

            <button onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
        </div>
    );
}

export default Auth;
