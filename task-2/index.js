
import client from './src/config/redisConfig.js';
import * as functions from 'firebase-functions';

import app from "./app.js";
import http from "http";

const server = http.createServer(app);

// Utilize for local development
// server.listen(3000, () => {
//     console.log(`Server running on port 3000`);
// });

export { app, client};
export const api = functions.https.onRequest(app);
