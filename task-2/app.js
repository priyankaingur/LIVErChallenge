import express from "express";
import "express-async-errors";
import cors from "cors";

// Import middlewares and routes
import { unknownEndpoint, errorHandler, authMiddleware } from "./src/utils/middleware.js";
import recentlyViewedRouter from "./src/routes/apiV1.js";
import redisClient from "./src/config/redisConfig.js";

const app = express();

// Middleware setup
app.use(cors());
app.use(express.static("build"));
app.use(express.json());

app.set("redisClient", redisClient);

// Versioned routes
app.use("/api/v1/users", recentlyViewedRouter);  // Use versioned route for recently viewed products

// Global middlewares
// app.use(authMiddleware);
app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
