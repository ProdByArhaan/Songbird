// server/middleware/auth.js
export const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
};

// Middleware to track user activity
export const trackActivity = (req, res, next) => {
    if (req.isAuthenticated()) {
        const activity = {
            timestamp: new Date(),
            action: req.method + ' ' + req.path,
            details: req.query.q || req.params.id || 'page visit'
        };

        if (!req.session.recentActivity) {
            req.session.recentActivity = [];
        }

        req.session.recentActivity.unshift(activity);
        // Keep only last 4 activities
        req.session.recentActivity = req.session.recentActivity.slice(0, 4);
    }
    next();
};