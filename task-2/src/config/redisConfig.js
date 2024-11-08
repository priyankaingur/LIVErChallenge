import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10)
    }
});

client.connect().catch((error) => {
    console.error("Redis connection error:", error);
});
console.log("Connecting to Redis Cloud:");
console.log("Host:", process.env.REDIS_HOST);
console.log("Port:", process.env.REDIS_PORT);
export default client;