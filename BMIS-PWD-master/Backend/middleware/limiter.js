const { RateLimiterMemory } = require('rate-limiter-flexible'); // Change 1: Specific import

// Change 2: Use the specific class name
const limiter = new RateLimiterMemory({
    points: 5, 
    duration: 60 * 15, 
    blockDuration: 60 * 15, 
});

const rateLimitMiddleware = (req, res, next) => {
    limiter.consume(req.ip)
        .then(() => {
            next();
        })
        .catch((rejRes) => {
            const retrySecs = Math.round(rejRes.msBeforeNext / 1000) || 1;
            res.set('Retry-After', String(retrySecs));
            res.status(429).json({ 
                success: false, 
                message: "Too many requests. Please try again in " + retrySecs + " seconds." 
            });
        });
}

module.exports = rateLimitMiddleware;