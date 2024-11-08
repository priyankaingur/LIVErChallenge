import express from 'express';
import admin from './src/config/firebaseConfig.js';
import client from './src/config/redisConfig.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware and route imports would go here

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export { app, client, admin };