const User = require("../../models/User");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all wallets for a user
// @route GET /users/wallets
// @access Private
const getAllWallets = asyncHandler(async (req, res) => {
  const { userId, username } = req.body;

  // Confirm received data
  if (!userId || !username) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const user = await User.findById(userId).exec();
  // Confirm if user exists
  if (!user) {
    return res.status(400).json({ message: "User not found." });
  }

  // Check for duplicate user
  const duplicate = await User.findOne({ username }).lean().exec();
  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== userId) {
    return res.status(409).json({ message: "Duplicate username." });
  }

  const wallets = user.wallets;

  // Check if user has active orders
  if (!Array.isArray(wallets) || !wallets.length) {
    return res.status(400).json({ message: "User has no wallets." });
  }

  // Return the active orders array
  res.status(201).json(wallets);
});

// @desc Create a new wallet
// @route POST /users/wallets
// @access Private
const createWallet = asyncHandler(async (req, res) => {
  const { userId, username, address, privateKey } = req.body;

  // Confirm received data
  if (!userId || !username || !address || !privateKey) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const user = await User.findById(userId).exec();
  // Confirm if user exists
  if (!user) {
    return res.status(400).json({ message: "User not found." });
  }

  // Check for duplicate user
  const duplicate = await User.findOne({ username }).lean().exec();
  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== userId) {
    return res.status(409).json({ message: "Duplicate username." });
  }

  // Hash private key
  const hashedPrivateKey = await bcrypt.hash(privateKey, 10); // Salt rounds = 10

  const walletObject = {
    address,
    privateKey: hashedPrivateKey,
  };

  const wallet = await User.findOneAndUpdate(
    { username },
    { $push: { wallets: walletObject } }
  );

  if (wallet) {
    // Wallet is created
    res
      .status(201)
      .json({ message: `New wallet with address: ${address} is created.` });
  } else {
    res.status(400).json({ message: "Invalid wallet data received." });
  }
});

// @desc Update a wallet
// @route PATCH /users/wallets
// @access Private
const updateWallet = asyncHandler(async (req, res) => {
  const { userId, username, walletId, address, privateKey } = req.body;

  // Confirm received data
  if (!userId || !username || !walletId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const user = await User.findById(userId).exec();
  // Confirm if user exists
  if (!user) {
    return res.status(400).json({ message: "User not found." });
  }

  // Check for duplicate user
  const duplicate = await User.findOne({ username }).lean().exec();
  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== userId) {
    return res.status(409).json({ message: "Duplicate username." });
  }

  // Find the wallet to be updated
  const wallet = await User.findOne({
    _id: mongoose.Types.ObjectId(userId),
    wallets: {
      $elemMatch: {
        _id: mongoose.Types.ObjectId(walletId),
      },
    },
  });

  // Check if wallet exists
  if (!wallet) {
    return res.status(400).json({ message: "Wallet not found." });
  }

  // Splice the wallet from the array
  const foundWallet = await User.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(userId),
      },
    },
    {
      $unwind: "$wallets",
    },
    {
      $match: {
        "wallets._id": mongoose.Types.ObjectId(walletId),
      },
    },
    {
      $replaceRoot: {
        newRoot: "$wallets",
      },
    },
  ]);

  // Create the updated wallet object
  if (address) foundWallet[0].address = address;
  if (privateKey) {
    // Hash private key
    const hashedPrivateKey = await bcrypt.hash(privateKey, 10); // Salt rounds = 10
    foundWallet[0].privateKey = hashedPrivateKey;
  }

  // Update the wallet
  const updatedWallet = await User.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(userId),
      wallets: {
        $elemMatch: {
          _id: mongoose.Types.ObjectId(walletId),
        },
      },
    },
    {
      $set: { "wallets.$": foundWallet[0] },
    }
  );
  if (updatedWallet) {
    res.status(201).json({
      message: `Updated wallet with address: ${foundWallet[0].address}.`,
    });
  } else {
    res.status(400).json({ message: "Invalid wallet data received." });
  }
});

// @desc Delete a wallet
// @route DELETE /users/wallets
// @access Private
const deleteWallet = asyncHandler(async (req, res) => {
  const { userId, username, walletId } = req.body;

  // Confirm received data
  if (!userId || !username || !walletId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const user = await User.findById(userId).exec();
  // Confirm if user exists
  if (!user) {
    return res.status(400).json({ message: "User not found." });
  }

  // Check for duplicate user
  const duplicate = await User.findOne({ username }).lean().exec();
  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== userId) {
    return res.status(409).json({ message: "Duplicate username." });
  }

  // Find the wallet to be deleted
  const wallet = await User.findOne({
    _id: mongoose.Types.ObjectId(userId),
    wallets: {
      $elemMatch: {
        _id: mongoose.Types.ObjectId(walletId),
      },
    },
  });

  // Check if wallet exists
  if (!wallet) {
    return res.status(400).json({ message: "Wallet not found." });
  }

  // Splice the wallet from the array
  const foundWallet = await User.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(userId),
      },
    },
    {
      $unwind: "$wallets",
    },
    {
      $match: {
        "wallets._id": mongoose.Types.ObjectId(walletId),
      },
    },
    {
      $replaceRoot: {
        newRoot: "$wallets",
      },
    },
  ]);

  // Delete the wallet
  const deletedWallet = await User.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(userId),
      wallets: {
        $elemMatch: {
          _id: mongoose.Types.ObjectId(walletId),
        },
      },
    },
    {
      $pull: { wallets: { _id: mongoose.Types.ObjectId(walletId) } },
    }
  );
  if (deletedWallet) {
    res.status(201).json({
      message: `Deleted wallet with address: ${foundWallet[0].address}.`,
    });
  } else {
    res.status(400).json({ message: "Invalid wallet data received." });
  }
});

module.exports = {
  getAllWallets,
  createWallet,
  updateWallet,
  deleteWallet,
};
