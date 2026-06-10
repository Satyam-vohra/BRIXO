const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const storage = require("../utils/storage");
const { getIsConnected } = require("../config/db");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "brixo_secret_key", {
    expiresIn: "30d"
  });
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please add all fields (name, email, password)"
    });
  }

  try {
    const isDbConnected = getIsConnected();
    
    // Check if user exists
    let userExists;
    if (isDbConnected) {
      userExists = await User.findOne({ email });
    } else {
      userExists = storage.getUserByEmail(email);
    }

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    let user;
    if (isDbConnected) {
      user = await User.create({
        name,
        email,
        password: hashedPassword
      });
    } else {
      user = storage.saveUser({
        name,
        email,
        password: hashedPassword
      });
    }

    if (user) {
      const userId = user._id || user.id;
      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          id: userId,
          name: user.name,
          email: user.email,
          token: generateToken(userId)
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid user data"
      });
    }
  } catch (error) {
    console.error("Register controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password"
    });
  }

  try {
    const isDbConnected = getIsConnected();
    
    // Find user
    let user;
    if (isDbConnected) {
      user = await User.findOne({ email });
    } else {
      user = storage.getUserByEmail(email);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials (user not found)"
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials (password incorrect)"
      });
    }

    const userId = user._id || user.id;
    return res.json({
      success: true,
      message: "Login successful",
      data: {
        id: userId,
        name: user.name,
        email: user.email,
        token: generateToken(userId)
      }
    });
  } catch (error) {
    console.error("Login controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message
    });
  }
};

module.exports = {
  register,
  login
};