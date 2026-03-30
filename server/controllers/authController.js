const User = require("../models/User");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "secretkey"; // For production,we will put it in .env

// REGISTER
const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await User.findOne({ username });
    //check if user exists
    if (existing) return res.status(400).json({ error: "User already exists" });

    const user = new User({ username, password });
    await user.save();
    //save new user

    res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    //to find user
    if (!user) return res.status(401).json({ error: "Invalid username or password" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: "Invalid username or password" });
    //verify password

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1d" });
    //create jwt token
    res.status(200).json({ token, username: user.username });//sends token to frontend
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };