import { logProductViewService, getRecentlyViewedService } from './src/services/recentlyViewedService.js';
import redisClient from './src/config/redisConfig.js';

jest.mock('./src/config/firebaseConfig.js');
jest.mock('./src/config/redisConfig.js');

describe('logProductViewService', () => {
    const userId = 'testUserId';
    const productId = 'testProductId';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 404 if user does not exist', async () => {
        db.collection.mockReturnValue({
            doc: jest.fn().mockReturnValue({
                get: jest.fn().mockResolvedValue({ exists: false })
            })
        });

        const result = await logProductViewService(userId, productId);
        expect(result).toEqual({ status: 404, message: "User ID doesn't exist" });
    });

    it('should return 404 if product does not exist', async () => {
        db.collection.mockImplementation((collectionName) => {
            if (collectionName === 'users') {
                return {
                    doc: jest.fn().mockReturnValue({
                        get: jest.fn().mockResolvedValue({ exists: true })
                    })
                };
            }
            return {
                doc: jest.fn().mockReturnValue({
                    get: jest.fn().mockResolvedValue({ exists: false })
                })
            };
        });

        const result = await logProductViewService(userId, productId);
        expect(result).toEqual({ status: 404, message: "Product ID doesn't exist" });
    });

    it('should log product view successfully and store in Redis', async () => {
        db.collection.mockImplementation((collectionName) => {
            return {
                doc: jest.fn().mockReturnValue({
                    get: jest.fn().mockResolvedValue({ exists: true }),
                    collection: jest.fn().mockReturnValue({
                        add: jest.fn().mockResolvedValue({})
                    })
                })
            };
        });

        redisClient.sendCommand = jest.fn();

        const result = await logProductViewService(userId, productId);

        expect(redisClient.sendCommand).toHaveBeenCalledWith(['LPUSH', `recentlyViewed:${userId}`, expect.any(String)]);
        expect(redisClient.sendCommand).toHaveBeenCalledWith(['LTRIM', `recentlyViewed:${userId}`, '0', '9']);
        expect(result).toHaveProperty('productId', productId);
        expect(result).toHaveProperty('timestamp');
    });

    it('should throw an error if an exception occurs', async () => {
        db.collection.mockImplementation(() => { throw new Error('Database error'); });

        await expect(logProductViewService(userId, productId)).rejects.toThrow('Error logging product view: Database error');
    });
});

describe('getRecentlyViewedService', () => {
    const userId = 'testUserId';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return cached recently viewed products if available in Redis', async () => {
        const cachedData = [{ productId: 'prod1', timestamp: Date.now() }];
        redisClient.sendCommand = jest.fn().mockResolvedValue(cachedData.map(JSON.stringify));

        const result = await getRecentlyViewedService(userId);

        expect(redisClient.sendCommand).toHaveBeenCalledWith(['LRANGE', `recentlyViewed:${userId}`, '0', '-1']);
        expect(result).toEqual(cachedData);
    });

    it('should return recently viewed products from Firestore if not in Redis cache', async () => {
        redisClient.sendCommand = jest.fn().mockResolvedValue([]);
        db.collection.mockReturnValue({
            doc: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue({
                    orderBy: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            get: jest.fn().mockResolvedValue({
                                empty: false,
                                docs: [
                                    { data: () => ({ productId: 'prod1', timestamp: Date.now() }) },
                                    { data: () => ({ productId: 'prod2', timestamp: Date.now() }) }
                                ]
                            })
                        })
                    })
                })
            })
        });

        const result = await getRecentlyViewedService(userId);

        expect(result).toHaveLength(2);
        expect(result[0]).toHaveProperty('productId', 'prod1');
        expect(result[1]).toHaveProperty('productId', 'prod2');
    });

    it('should return 404 if no recently viewed products exist in Firestore', async () => {
        redisClient.sendCommand = jest.fn().mockResolvedValue([]);
        db.collection.mockReturnValue({
            doc: jest.fn().mockReturnValue({
                collection: jest.fn().mockReturnValue({
                    orderBy: jest.fn().mockReturnValue({
                        limit: jest.fn().mockReturnValue({
                            get: jest.fn().mockResolvedValue({ empty: true })
                        })
                    })
                })
            })
        });

        const result = await getRecentlyViewedService(userId);

        expect(result).toEqual({ status: 404, message: "User ID does not exists or no recently viewed products" });
    });

    it('should throw an error if an exception occurs', async () => {
        redisClient.sendCommand = jest.fn(() => { throw new Error('Redis error'); });

        await expect(getRecentlyViewedService(userId)).rejects.toThrow('Error retrieving recently viewed products: Redis error');
    });
});
