const User = require("../../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select("-password -wallets.privateKey")
    .lean();
  if (!users || !users.length) {
    return res.status(400).json({ message: "No users found." });
  }
  res.json(users);
});

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Confirm received data
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Username already exists." });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

  const userObject = {
    username,
    password: hashedPassword,
  };

  // Create and store new user
  const user = await User.create(userObject);

  if (user) {
    // User is created
    res
      .status(201)
      .json({ message: `New user with username: ${username} is created.` });
  } else {
    res.status(400).json({ message: "Invalid user data received." });
  }
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, active, password } = req.body;

  // Confirm received data
  if (!id || !username || typeof active !== "boolean") {
    return res.status(400).json({ message: "All fields are required." });
  }

  const user = await User.findById(id).exec();
  // Check if user exists
  if (!user) {
    return res.status(400).json({ message: "User not found." });
  }

  // Check for duplicate user
  const duplicate = await User.findOne({ username }).lean().exec();
  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username." });
  }

  // Set the user changes
  user.username = username;
  user.active = active;

  // Check if there is a password change
  if (password) {
    // Hash password
    user.password = await bcrypt.hash(password, 10); // Salt rounds = 10
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} is updated.` });
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found." });
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result.id} is deleted.`;

  res.json(reply);
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
