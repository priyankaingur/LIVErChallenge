import {signIn} from "../controllers/authController.js";
import express from "express";

const router = express.Router();
/**
 * @swagger
 * /auth/signIn:
 *   post:
 *     summary: Sign in a user
 *     description: Authenticates a user with email and password, returning an access token upon successful login.
 *     operationId: signIn
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *                 example: "abcxyz@gmail.com"
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: "12345abc"
 *     responses:
 *       200:
 *         description: Successfully signed in and received token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token for authentication.
 *                 userId:
 *                      type: string
 *                      description: user id of the user.
 *                 refreshToken:
 *                   type: string
 *                   description: Token for refreshing access.
 *       400:
 *         description: Bad request, invalid or missing data
 *       401:
 *         description: Unauthorized, invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/signIn', signIn);

export default router;
