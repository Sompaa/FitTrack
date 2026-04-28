// Admin-only middleware — must run AFTER the `protect` middleware.
// protect puts the authenticated user on req.user; this checks isAdmin.
exports.requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};
