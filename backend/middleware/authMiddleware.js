const jwt = require("jsonwebtoken");
const User = require("../models/User");
const storage = require("../utils/storage");
const { getIsConnected } = require("../config/db");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "brixo_secret_key");

      // Get user from database/storage
      let user;
      if (getIsConnected()) {
        user = await User.findById(decoded.id).select("-password");
      } else {
        const storedUser = storage.getUserById(decoded.id);
        if (storedUser) {
          const { password, ...userWithoutPassword } = storedUser;
          user = { id: storedUser._id, ...userWithoutPassword };
        }
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, user not found"
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed"
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token"
    });
  }
};

module.exports = { protect };
