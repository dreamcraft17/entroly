import NodeCache from "node-cache";

/**
 * In-memory cache for profile and AI page data.
 * 
 * Uses available RAM to cache frequently accessed profiles,
 * reducing database queries and improving response times.
 * 
 * TTL: 5 minutes (300s)
 * Check period: 60 seconds
 */
export const profileCache = new NodeCache({
    stdTTL: 300,       // 5 minute cache TTL
    checkperiod: 60,   // Check for expired keys every 60s
    useClones: false,  // Return references for better performance (data is read-only)
    maxKeys: 10000,    // Limit to prevent memory bloat
});

export const aiPageCache = new NodeCache({
    stdTTL: 300,
    checkperiod: 60,
    useClones: false,
    maxKeys: 5000,
});

/**
 * Cache statistics for monitoring
 */
export function getCacheStats() {
    return {
        profile: profileCache.getStats(),
        aiPage: aiPageCache.getStats(),
    };
}
