import React, { useState, useEffect } from 'react';
import {auth, signOut} from '../firebase';
import {Link} from "react-router-dom";  // Assuming you've set up Firebase auth


export default function RecentlyViewed() {
    const [recentProducts, setRecentProducts] = useState([]);
    const fetchRecentlyViewed = async () => {
        const user = auth.currentUser;  // Get current authenticated user

        if (user) {
            try {
                // Retrieve the token from localStorage
                const token = localStorage.getItem('userToken');

                if (!token) {
                    throw new Error('No authentication token found in localStorage');
                }

                // const apiUrl = `https://api-gteteofhta-uc.a.run.app/api/v1/users/${user.uid}/recentlyViewed`;
                const apiUrl = `https://us-central1-liverchallenge.cloudfunctions.net/api/api/v1/users/${user.uid}/recentlyViewed`;

                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,  // Use the token from localStorage
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch recently viewed products');
                }

                const data = await response.json();
                console.log('Recently viewed products:', data);

                if (data && data?.data) {
                    setRecentProducts(data.data);

                } else {
                    console.log('No recent products found.');
                }
            } catch (error) {
                console.error('Error fetching recently viewed products:', error);
            }
        }
    };
    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('userToken');
            localStorage.removeItem('userUid');
            console.log('User logged out');
        } catch (err) {
            console.error('Error logging out:', err);
        }
    };

    useEffect(() => {
        fetchRecentlyViewed();
    }, []);
    return (
        <div>
                <button onClick={handleLogout} style={{ marginTop: '10px' }}>
                    Logout
                </button>
            <h3>Recently Viewed Products</h3>
            <ul>
                {recentProducts.map((product) => (
                    <li key={product.productId}>
                        <Link to={`/product/${product.productId}`} style={{ color: 'red' }}>
                            {product.productId}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
