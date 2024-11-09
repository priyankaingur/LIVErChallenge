import React, { useState } from 'react';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, db, signOut } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // New state to track login status

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
                console.log("User logged in:", userCredential.user);
            }

            const idToken = await userCredential.user.getIdToken();
            console.log('User ID Token:', idToken);

            localStorage.setItem('userToken', idToken);
            localStorage.setItem('userUid', userCredential.user.uid);

            setIsLoggedIn(true); // Set login status to true
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

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('userToken');
            localStorage.removeItem('userUid');
            setIsLoggedIn(false); // Set login status to false
            console.log('User logged out');
        } catch (err) {
            console.error('Error logging out:', err);
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

            {isLoggedIn && (
                <button onClick={handleLogout} style={{ marginTop: '10px' }}>
                    Logout
                </button>
            )}
        </div>
    );
}

export default Auth;
