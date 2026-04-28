// ================================================================
// jwt.js — JSON Web Token Utilities
// ================================================================
// JSON Web Tokens (JWTs) are how FitTrack identifies logged-in users.
//
// A JWT has three parts: Header.Payload.Signature
//   - Header:    algorithm used (HS256)
//   - Payload:   data we stored (the userId), plus expiry
//   - Signature: cryptographic proof the token wasn't tampered with
//
// The token is generated on login and sent back to the browser.
// The browser stores it in localStorage and sends it with every
// subsequent request via the Authorization header.
// ================================================================

const jwt = require('jsonwebtoken');

// ----------------------------------------------------------------
// generateToken — creates a new JWT for a given userId
// ----------------------------------------------------------------
// Called after a successful login or registration.
// The token payload only contains { id: userId } — nothing sensitive.
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },                                                    // what we store inside the token
    process.env.JWT_SECRET || 'default-secret-change-in-production',  // secret key used to sign it
    { expiresIn: process.env.JWT_EXPIRE || '24h' }                    // token auto-expires after 24h
  );
};

// ----------------------------------------------------------------
// verifyToken — decodes and validates an existing JWT
// ----------------------------------------------------------------
// Called by the protect middleware on every protected request.
// Returns the decoded payload ({ id, iat, exp }) if valid.
// Returns null (instead of throwing) so callers can handle it cleanly.
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'default-secret-change-in-production');
  } catch (error) {
    // Token was expired, tampered with, or just invalid — treat as not logged in
    return null;
  }
};

module.exports = { generateToken, verifyToken };
