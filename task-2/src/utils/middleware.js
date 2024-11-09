import { admin } from '../config/firebaseConfig.js';
import logger from './logger.js';

const requestLogger = (request, response, next) => {
    logger.info("Method:", request.method);
    logger.info("Path:  ", request.path);
    logger.info("Body:  ", request.body);
    logger.info("---");
    next();
};

const authMiddleware = async (req, res, next) => {
    if (req.originalUrl.startsWith("/auth/signIn") && req.method === "POST") {
        next();
    }else{
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        logger.error("Authorization header missing or malformed");
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.userId = decodedToken.uid;
        next();
    } catch (error) {
        logger.error("Token verification failed:", error.message);

        if (error.code === 'auth/id-token-expired') {
            res.status(401).json({ message: 'Token expired' });
        } else if (error.code === 'auth/argument-error') {
            res.status(401).json({ message: 'Invalid token format' });
        } else {
            res.status(401).json({ message: 'Invalid token' });
        }
    }
    }
};

const unknownEndpoint = (request, response, next) => {
    response.status(404).send({ error: "unknown endpoint" });
    next();
};

const errorHandler = (error, request, response, next) => {
    console.log("msg", error.message);
    console.log("name", error.name);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "mal-formatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    } else if (error.name === "MongoServerError") {
        return response.status(400).json({ error: "Name already exists" });
    }
    next(error);
};

export { authMiddleware, requestLogger, unknownEndpoint, errorHandler };
