import express from "express";
import { logProductView, getRecentlyViewed } from "../controllers/recentlyViewedController.js";

const router = express.Router();

// POST endpoint to log a product view
/**
 * @swagger
 * /api/v1/users/{userId}/recentlyViewed:
 *   post:
 *     summary: Log a product view for a user
 *     description: Logs a user's view of a product, including the user ID.
 *     operationId: logProductView
 *     tags:
 *       - Recently Viewed Products
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user who viewed the product.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Request body to log a product view
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product being viewed
 *     responses:
 *       '200':
 *         description: Product view logged successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product view logged successfully"
 *       '400':
 *         description: Invalid request data
 *       '401':
 *         description: Unauthorized request
 *       '500':
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []  # Specifies that Bearer authentication is required
 */
router.post("/:userId/recentlyViewed", logProductView);

// GET endpoint to retrieve recently viewed products
/**
 * @swagger
 * /api/v1/users/{userId}/recentlyViewed:
 *   get:
 *     summary: Retrieve recently viewed products for a user
 *     description: Retrieves the list of products that a user has recently viewed based on the user ID.
 *     operationId: getRecentlyViewed
 *     tags:
 *       - Recently Viewed Products
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user whose recently viewed products are being retrieved.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved the list of recently viewed products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: The ID of a product
 *       '400':
 *         description: Invalid request data
 *       '401':
 *         description: Unauthorized request
 *       '404':
 *         description: User not found or no recently viewed products
 *       '500':
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []  # Specifies that Bearer authentication is required
 */
router.get("/:userId/recentlyViewed", getRecentlyViewed);


export default router;
