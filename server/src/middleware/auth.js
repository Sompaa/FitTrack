// ================================================================
// auth.js — JWT Authentication Middleware
// ================================================================
// This middleware protects routes that require a logged-in user.
// Add it to any route like: router.get('/profile', protect, handler)
//
// HOW IT WORKS:
//   1. Reads the Authorization header: "Bearer <token>"
//   2. Decodes the JWT to get the userId stored inside
//   3. Loads that user from the database
//   4. Attaches the user object to req.user
//   5. Calls next() so the route handler can run
//
// If anything goes wrong (no token, expired, user deleted) it returns 401.
// ================================================================

const User = require('../models/User');
const { verifyToken } = require('../utils/jwt');

const protect = async (req, res, next) => {
  let token;

  // The standard way to send a token is in the Authorization header.
  // Format: "Authorization: Bearer eyJhbGci..."
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Split "Bearer <token>" and take the second part
    token = req.headers.authorization.split(' ')[1];
  }

  // If there is no token, the user is not logged in — reject immediately
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // verifyToken decodes the JWT and checks the signature.
    // Returns null if the token is tampered with or expired.
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Fetch the full user from the database using the id stored in the token.
    // We exclude the password field — route handlers never need it.
    req.user = await User.findById(decoded.id).select('-password');

    // Guard: the account might have been deleted after the token was issued
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Everything looks good — hand control to the actual route handler
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

module.exports = { protect };
