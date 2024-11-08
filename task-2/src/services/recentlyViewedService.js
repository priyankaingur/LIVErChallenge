import { admin } from '../config/firebaseConfig.js';
import redisClient from '../config/redisConfig.js'; // Assuming you have a Redis config
import { db } from '../config/firebaseConfig.js';  // Firebase Firestore reference

// Log product view
const logProductViewService = async (userId, productId) => {
    try {
        const userRef = db.collection('users').doc(userId).collection('recentlyViewed');

        // Record the view time for the product
        const timestamp = Date.now();

        // Store product ID and timestamp in Firestore
        await userRef.add({ productId, timestamp });

        // Cache the most recent viewed product in Redis (limited to 10 products)
        await redisClient.lpush(`recentlyViewed:${userId}`, JSON.stringify({ productId, timestamp }));
        await redisClient.ltrim(`recentlyViewed:${userId}`, 0, 9); // Keep only the last 10 viewed products

        return { productId, timestamp };
    } catch (error) {
        throw new Error('Error logging product view: ' + error.message);
    }
};

// Get recently viewed products from Firestore or Redis cache
const getRecentlyViewedService = async (userId) => {
    try {
        // Check if data is in Redis cache
        const cachedData = await redisClient.lrange(`recentlyViewed:${userId}`, 0, -1);

        if (cachedData.length > 0) {
            return cachedData.map(item => JSON.parse(item));  // Parse cached data and return it
        }

        // If not in cache, fetch from Firestore
        const userRef = db.collection('users').doc(userId).collection('recentlyViewed');
        const snapshot = await userRef.orderBy('timestamp', 'desc').limit(10).get();

        const recentlyViewed = snapshot.docs.map(doc => doc.data());

        // Cache the recently viewed products in Redis
        recentlyViewed.forEach(item => {
            redisClient.lpush(`recentlyViewed:${userId}`, JSON.stringify(item));
        });

        return recentlyViewed;
    } catch (error) {
        throw new Error('Error retrieving recently viewed products: ' + error.message);
    }
};

export { logProductViewService, getRecentlyViewedService };
