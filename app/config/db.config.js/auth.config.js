// app/config/auth.config.js
module.exports = {
  secret: process.env.JWT_SECRET || "dev-secret-change-me",
  expiresIn: process.env.JWT_EXPIRES_IN || "1h"
};