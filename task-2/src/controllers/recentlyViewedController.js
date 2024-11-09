import { logProductViewService, getRecentlyViewedService } from "../services/recentlyViewedService.js";

const logProductView = async (req, res, next) => {
    const { userId } = req.params;
    const { productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ message: "Missing userId or productId" });
    }

    try {
        const result = await logProductViewService(userId, productId);

        if (result.status === 404) {
            return res.status(404).json({ message: result.message });
        }

        return res.status(200).json({ message: "Product view logged successfully", data: result });
    } catch (error) {
        next(error);
    }
};

const getRecentlyViewed = async (req, res,next) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "Missing userId" });
        }

        const result = await getRecentlyViewedService(userId);

        if (result.status === 404) {
            return res.status(404).json({ message: result.message });
        }

        return res.status(200).json({ message: "Recently viewed products retrieved successfully", data: result });
    } catch (error) {
        next(error);
    }
};

export { logProductView, getRecentlyViewed };
