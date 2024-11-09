import redis from 'redis';
import { config } from 'dotenv';

config();

const redisClient = redis.createClient({
    url: `redis://:${process.env.RD_PASSWORD}@${process.env.RD_HOST}:${process.env.RD_PORT}`
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

(async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
            console.log("Connected to Redis");
        }
    } catch (err) {
        console.error("Error connecting to Redis:", err);
    }
})();

export default redisClient;


