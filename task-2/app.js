import express from "express";
import cors from "cors";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { unknownEndpoint, errorHandler, authMiddleware } from "./src/middlewares/middleware.js";
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


const allowedOrigins = [
    "https://liv-er-challenge.vercel.app", "http://localhost:3000", 'http://localhost:8080', 'http://127.0.0.1:5500'
];
// console.log("allowed origins: " + allowedOrigins);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS!"));
        }
    },
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.static("build"));
app.use(express.json());
app.use(authMiddleware);
app.use('/auth', authRouter);
app.use("/api/v1/users", recentlyViewedRouter);


// middlewares
app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
