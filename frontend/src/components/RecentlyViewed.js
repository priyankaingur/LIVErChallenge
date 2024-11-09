import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
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

                const apiUrl = `https://api-gteteofhta-uc.a.run.app/api/v1/users/${user.uid}/recentlyViewed`;

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

    useEffect(() => {
        fetchRecentlyViewed();
    }, []);
    return (
        <div>
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
