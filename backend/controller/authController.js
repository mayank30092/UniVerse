import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Register User
export const registerUser = async (req, res) => {
  console.log("Register hit:", req.body);
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
// Login User - ENHANCED DEBUG VERSION
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log("🔐 LOGIN ATTEMPT:");
    console.log("Email:", email);
    console.log("Request body:", req.body);

    // Find user
    const user = await User.findOne({ email });
    console.log("User found in DB:", user ? "Yes" : "No");
    if (!user) {
      console.log("❌ User not found for email:", email);
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Check password
    console.log("🔑 Checking password...");
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);
    
    if (!isMatch) {
      console.log("❌ Password doesn't match");
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Create JWT token
    const tokenPayload = {
      id: user._id.toString(),
      role: user.role,
      name: user.name,
      email: user.email,
    };
    
    console.log("🎫 JWT Payload:", tokenPayload);

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Verify the token was created correctly
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded JWT:", decoded);

    console.log("🚀 Login successful, sending response...");
    
    res.json({ 
      token, 
      role: user.role, 
      name: user.name,
      _id: user._id 
    });
    
  } catch (error) {
    console.error("💥 LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
