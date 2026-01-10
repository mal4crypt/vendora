/**
 * Retries a function with exponential backoff.
 * @param {Function} fn - The async function to retry.
 * @param {Object} options - Options for retry count and delay.
 * @returns {Promise<any>} - The result of the function.
 */
export const fetchWithRetry = async (fn, options = {}) => {
    const { retries = 3, delay = 1000, maxDelay = 4000 } = options;

    try {
        return await fn();
    } catch (error) {
        if (retries <= 0) throw error;

        // Wait for the specified delay
        await new Promise(resolve => setTimeout(resolve, delay));

        // Exponential backoff: Increase delay, but cap at maxDelay
        const nextDelay = Math.min(delay * 2, maxDelay);

        console.warn(`Retrying operation... Attempts left: ${retries - 1}. Next delay: ${nextDelay}ms`);

        return fetchWithRetry(fn, {
            retries: retries - 1,
            delay: nextDelay,
            maxDelay
        });
    }
};
