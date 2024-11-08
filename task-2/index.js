import config from "./src/utils/config.js";
import admin from './src/config/firebaseConfig.js';
import client from './src/config/redisConfig.js';
import dotenv from 'dotenv';

dotenv.config();
import app from "./app.js";
import http from "http";

const server = http.createServer(app);

server.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
});

export { app, client, admin };