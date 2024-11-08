import { logProductViewService, getRecentlyViewedService } from "../services/recentlyViewedService.js";

const logProductView = async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId } = req.body;

        // Call the service to log the product view
        const result = await logProductViewService(userId, productId);

        return res.status(200).json({ message: "Product view logged successfully", data: result });
    } catch (error) {
        console.error("Error logging product view:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getRecentlyViewed = async (req, res) => {
    try {
        const { userId } = req.params;

        // Call the service to get recently viewed products
        const result = await getRecentlyViewedService(userId);

        return res.status(200).json({ message: "Recently viewed products retrieved successfully", data: result });
    } catch (error) {
        console.error("Error retrieving recently viewed products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export { logProductView, getRecentlyViewed };
