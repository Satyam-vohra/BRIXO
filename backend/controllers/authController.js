const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Website = require("../models/Website");
const storage = require("../utils/storage");
const { getIsConnected } = require("../config/db");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "brixo_secret_key", {
    expiresIn: "30d"
  });
};

const getUserId = (req) => {
  if (!req.user) return null;
  return req.user._id || req.user.id;
};

const buildUserResponse = (user, includeToken = false) => {
  const userId = user._id || user.id;
  const data = {
    id: userId,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  if (includeToken) {
    data.token = generateToken(userId);
  }

  return data;
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

const getProfile = async (req, res) => {
  const userId = getUserId(req);

  try {
    let user;
    if (getIsConnected()) {
      user = await User.findById(userId).select("-password");
    } else {
      user = storage.getUserById(userId);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.json({
      success: true,
      data: buildUserResponse(user)
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during profile fetching",
      error: error.message
    });
  }
};

const updateProfile = async (req, res) => {
  const userId = getUserId(req);
  const { name, email, password } = req.body;

  if (name === undefined && email === undefined && password === undefined) {
    return res.status(400).json({
      success: false,
      message: "Please provide at least one field to update"
    });
  }

  try {
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) {
      const existingUser = getIsConnected()
        ? await User.findOne({ email })
        : storage.getUserByEmail(email);

      if (existingUser && (existingUser._id || existingUser.id).toString() !== userId.toString()) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use"
        });
      }

      updateFields.email = email;
    }
    if (password !== undefined) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    let updatedUser;
    if (getIsConnected()) {
      updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
        new: true,
        runValidators: true
      }).select("-password");
    } else {
      updatedUser = storage.updateUser(userId, updateFields);
    }

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully",
      data: buildUserResponse(updatedUser, true)
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during profile update",
      error: error.message
    });
  }
};

const deleteAccount = async (req, res) => {
  const userId = getUserId(req);

  try {
    let deletedUser;
    if (getIsConnected()) {
      await Website.deleteMany({ userId });
      deletedUser = await User.findByIdAndDelete(userId);
    } else {
      storage.deleteWebsitesByUserId(userId);
      deletedUser = storage.deleteUser(userId);
    }

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.json({
      success: true,
      message: "Account deleted successfully"
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during account deletion",
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteAccount
};
