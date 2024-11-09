import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { getFirestore, getDocs, collection, query, orderBy, limit } from 'firebase/firestore';
import { Link } from 'react-router-dom';
function RecentlyViewed() {
    const [recentProducts, setRecentProducts] = useState([]);

    useEffect(() => {
        const fetchRecentlyViewed = async () => {
            const user = auth.currentUser;
            if (user) {
                const db = getFirestore();
                const recentlyViewedRef = collection(db, 'users', user.uid, 'recentlyViewed'); // Correct reference to the sub-collection
                const recentProductsQuery = query(recentlyViewedRef, orderBy('timestamp', 'desc'), limit(10)); // Ordered by timestamp, limit to 10 items
                try {
                    const querySnapshot = await getDocs(recentProductsQuery);

                    // Check if the querySnapshot exists
                    if (!querySnapshot.empty) {
                        const products = querySnapshot.docs.map((doc) => ({
                            ...doc.data(),
                            productId: doc.id,
                        }));
                        setRecentProducts(products);
                    } else {
                        console.log("No recent products found.");
                    }
                } catch (error) {
                    console.error("Error fetching recently viewed products:", error);
                }
            }
        };

        fetchRecentlyViewed();
    }, []);

    return (
        <div>
            <h2>Recently Viewed Products</h2>
            {recentProducts.length > 0 ? (
                <ul>
                    {recentProducts.map((product, index) => (
                        <li key={index}>
                            {/* Link to the product detail page */}
                            <Link to={`/product/${product.productId}`}>
                                Product ID: {product.productId},
                            </Link>
                            Viewed At: {new Date(product.timestamp).toLocaleString()}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No recently viewed products.</p>
            )}
        </div>
    );
}

export default RecentlyViewed;
