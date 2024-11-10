// tests/service/recentlyViewedService.test.js

import { logProductViewService, getRecentlyViewedService } from '../../src/services/recentlyViewedService';
import redisClient from '../../src/config/redisConfig';
import { db } from '../../src/config/firebaseConfig';

jest.mock('../../src/config/redisConfig', () => ({
    sendCommand: jest.fn(),
}));

jest.mock('../../src/config/firebaseConfig', () => ({
    db: {
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnThis(),
        get: jest.fn(),
        add: jest.fn(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
    },
}));

describe('Recently Viewed Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test for successful logging of product view
    test('logProductViewService should log product view successfully', async () => {
        db.get.mockResolvedValueOnce({ exists: true });  // Mock user exists
        db.get.mockResolvedValueOnce({ exists: true });  // Mock product exists
        db.add.mockResolvedValueOnce({});  // Mock Firestore write
        redisClient.sendCommand.mockResolvedValueOnce('OK');  // LPUSH
        redisClient.sendCommand.mockResolvedValueOnce('OK');  // LTRIM

        const result = await logProductViewService('userId', 'productId');
        expect(result).toHaveProperty('productId', 'productId');
    });

    // Test when user does not exist
    test('logProductViewService should return 404 when user does not exist', async () => {
        db.get.mockResolvedValueOnce({ exists: false });

        const result = await logProductViewService('userId', 'productId');
        expect(result).toEqual({ status: 404, message: "User ID doesn't exist" });
    });

    // Test when product does not exist
    test('logProductViewService should return 404 when product does not exist', async () => {
        db.get.mockResolvedValueOnce({ exists: true });
        db.get.mockResolvedValueOnce({ exists: false });

        const result = await logProductViewService('userId', 'productId');
        expect(result).toEqual({ status: 404, message: "Product ID doesn't exist" });
    });

    // Test for successfully retrieving recently viewed products from Redis cache
    test('getRecentlyViewedService should get recently viewed products from Redis cache', async () => {
        redisClient.sendCommand.mockResolvedValueOnce([
            JSON.stringify({ productId: 'productId', timestamp: 123456789 })
        ]);

        const result = await getRecentlyViewedService('userId');
        expect(result[0]).toHaveProperty('productId', 'productId');
    });

    // Test for retrieving recently viewed products from Firestore if Redis cache is empty
    test('getRecentlyViewedService should get recently viewed products from Firestore if Redis cache is empty', async () => {
        redisClient.sendCommand.mockResolvedValueOnce([]);
        db.get.mockResolvedValueOnce({ exists: true });
        db.orderBy.mockReturnValueOnce({
            get: jest.fn().mockResolvedValue({
                empty: false,
                docs: [{ data: () => ({ productId: 'productId', timestamp: 123456789 }) }],
            }),
        });

        const result = await getRecentlyViewedService('userId');
        expect(result[0]).toHaveProperty('productId', 'productId');
    });

    // Test for handling empty recently viewed products list from both Redis and Firestore
    test('getRecentlyViewedService should return 404 if recently viewed products list is empty', async () => {
        redisClient.sendCommand.mockResolvedValueOnce([]);
        db.orderBy.mockReturnValueOnce({
            get: jest.fn().mockResolvedValue({ empty: true }),
        });

        const result = await getRecentlyViewedService('userId');
        expect(result).toEqual({ status: 404, message: "User ID does not exist or no recently viewed products" });
    });

    // Test for handling errors in logProductViewService
    test('logProductViewService should throw an error if there is an issue with logging', async () => {
        db.get.mockRejectedValueOnce(new Error('Firestore error'));

        await expect(logProductViewService('userId', 'productId')).rejects.toThrow('Error logging product view: Firestore error');
    });

    // Test for handling errors in getRecentlyViewedService
    test('getRecentlyViewedService should throw an error if there is an issue with retrieval', async () => {
        redisClient.sendCommand.mockRejectedValueOnce(new Error('Redis error'));

        await expect(getRecentlyViewedService('userId')).rejects.toThrow('Error retrieving recently viewed products: Redis error');
    });
});
