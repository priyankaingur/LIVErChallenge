import redis from 'redis';

const redisClient = redis.createClient({
    url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
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


