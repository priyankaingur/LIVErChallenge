import express from "express";
import { logProductView, getRecentlyViewed } from "../controllers/recentlyViewedController.js";
// import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

// POST endpoint to log a product view
router.post("/:userId/recentlyViewed", logProductView);

// GET endpoint to retrieve recently viewed products
router.get("/:userId/recentlyViewed", getRecentlyViewed);

export default router;
