import express from "express";
import cors from "cors";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { unknownEndpoint, errorHandler, authMiddleware } from "./src/utils/middleware.js";
import recentlyViewedRouter from "./src/routes/apiV1.js";
import authRouter from "./src/routes/authRoutes.js";

const app = express();

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Recently Viewed Products API",
            version: "1.0.0",
            description: "API for managing recently viewed products",
        },
        tags: [
            { name: "Authentication", description: "Auth routes" },
            { name: "Recently Viewed Products", description: "User-related operations" },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ["./src/routes/*.js"]
    // route file
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(authMiddleware);
app.use('/auth', authRouter);
app.use("/api/v1/users", recentlyViewedRouter);


// middlewares
app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
