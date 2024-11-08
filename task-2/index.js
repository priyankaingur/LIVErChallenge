import config from "./src/utils/config.js";
import {admin, db} from './src/config/firebaseConfig.js';
import client from './src/config/redisConfig.js';
import dotenv from 'dotenv';

dotenv.config();
import app from "./app.js";
// const app = require("./app");
import http from "http";

const server = http.createServer(app);

server.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
});

export { app, client, admin, db };