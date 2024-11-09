import React, { useState, useEffect } from 'react';
import {Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import RecentlyViewed from './components/RecentlyViewed';
import { auth } from './firebase';
import ProductDetail from './components/ProductDetail';
import Register from "./components/Register";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="App">
            <header>React App with Firebase Authentication and Conditional Routing</header>
                <Routes>
                    {/* Redirect to recently-viewed if the user is logged in, else show sign-in */}
                    <Route path="/" element={user ? <Navigate to="/recently-viewed" /> : <Register />} />

                    {/* Show RecentlyViewed page only if the user is authenticated */}
                    <Route
                        path="/recently-viewed"
                        element={user ? <RecentlyViewed /> : <Navigate to="/" />}
                    />

                    {/* Show ProductDetail page only if the user is authenticated */}
                    <Route
                        path="/product/:productId"
                        element={user ? <ProductDetail /> : <Navigate to="/" />}
                    />
                </Routes>
        </div>
    );
}

export default App;
