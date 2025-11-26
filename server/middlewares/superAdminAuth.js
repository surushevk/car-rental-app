// Middleware to check if user is super admin
export const superAdminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin' && req.user.isSuperAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Super admin only.' });
    }
};
