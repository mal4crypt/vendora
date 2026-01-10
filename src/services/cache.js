/**
 * Simple cache service using localStorage with TTL.
 */

const CACHE_PREFIX = 'vendora_cache_';

export const CacheService = {
    /**
     * Store data in cache
     * @param {string} key - Cache key
     * @param {any} data - Data to store
     * @param {number} ttlMinutes - Time to live in minutes (default 60)
     */
    set: (key, data, ttlMinutes = 60) => {
        try {
            const item = {
                data,
                expiry: Date.now() + ttlMinutes * 60 * 1000,
                timestamp: Date.now()
            };
            localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
        } catch (error) {
            console.error('Cache set error:', error);
        }
    },

    /**
     * Retrieve data from cache
     * @param {string} key - Cache key
     * @returns {any|null} - Cached data or null if expired/missing
     */
    get: (key) => {
        try {
            const itemStr = localStorage.getItem(CACHE_PREFIX + key);
            if (!itemStr) return null;

            const item = JSON.parse(itemStr);
            const now = Date.now();

            if (now > item.expiry) {
                localStorage.removeItem(CACHE_PREFIX + key);
                return null;
            }

            return item.data;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    },

    /**
     * Clear specific cache item
     */
    remove: (key) => {
        localStorage.removeItem(CACHE_PREFIX + key);
    },

    /**
     * Clear all app cache
     */
    clearAll: () => {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(CACHE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    }
};
