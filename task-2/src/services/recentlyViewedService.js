import { db } from '../config/firebaseConfig.js';
import redisClient from '../config/redisConfig.js';

// Log product view
const logProductViewService = async (userId, productId) => {
    try {
        const userRef = db.collection('users').doc(userId).collection('recentlyViewed');
        const timestamp = Date.now();

        // Store product ID and timestamp in Firestore
        await userRef.add({ productId, timestamp });

        // Redis cache for recently viewed products (limit to 10)
        await redisClient.sendCommand(['LPUSH', `recentlyViewed:${userId}`, JSON.stringify({ productId, timestamp })]);
        await redisClient.sendCommand(['LTRIM', `recentlyViewed:${userId}`, '0', '9']);

        return { productId, timestamp };
    } catch (error) {
        throw new Error('Error logging product view: ' + error.message);
    }
};

// Get recently viewed products from Firestore or Redis cache
const getRecentlyViewedService = async (userId) => {
    try {
        const cachedData = await redisClient.sendCommand(['LRANGE', `recentlyViewed:${userId}`, '0', '-1']);

        if (cachedData.length > 0) {
            return cachedData.map(item => JSON.parse(item));
        }

        // If not in cache, fetch from Firestore
        const userRef = db.collection('users').doc(userId).collection('recentlyViewed');
        const snapshot = await userRef.orderBy('timestamp', 'desc').limit(10).get();

        const recentlyViewed = snapshot.docs.map(doc => doc.data());

        // Cache recently viewed products in Redis
        recentlyViewed.forEach(item => {
            redisClient.sendCommand(['LPUSH', `recentlyViewed:${userId}`, JSON.stringify(item)]);
        });

        return recentlyViewed;
    } catch (error) {
        throw new Error('Error retrieving recently viewed products: ' + error.message);
    }
};

export { logProductViewService, getRecentlyViewedService };
