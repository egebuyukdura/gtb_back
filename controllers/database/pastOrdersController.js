const User = require("../../models/User");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

// @desc Get all past orders for a user
// @route POST /users/pastOrders/get
// @access Private
const getPastOrders = asyncHandler(async (req, res) => {
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

  const pastOrders = user.pastOrders;
  // Check if user has past orders
  if (!Array.isArray(pastOrders) || !pastOrders.length) {
    return res.status(400).json({ message: "User has no past orders." });
  }

  // Return the past orders array
  res.status(201).json(pastOrders);
});

// @desc Create a new past order
// @route POST /users/pastOrders
// @access Private
const createPastOrder = asyncHandler(async (req, res) => {
  const { userId, username, name, type, details, status } = req.body;

  // Confirm received data
  if (!userId || !username || !name || !type || !details || !status) {
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

  const orderObject = {
    name,
    type,
    details,
    status,
    active: false,
  };

  const order = await User.findOneAndUpdate(
    { username },
    { $push: { pastOrders: orderObject } }
  );

  if (order) {
    // Order is created
    res
      .status(201)
      .json({ message: `New past order with name: ${name} is created.` });
  } else {
    res.status(400).json({ message: "Invalid order data received." });
  }
});

// @desc Update a past order
// @route PATCH /users/pastOrders
// @access Private
const updatePastOrder = asyncHandler(async (req, res) => {
  const { userId, username, orderId, name, type, details, status, active } =
    req.body;

  // Confirm received data
  if (!userId || !username || !orderId) {
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

  // Find the order to be deleted
  const order = await User.findOne({
    _id: mongoose.Types.ObjectId(userId),
    pastOrders: {
      $elemMatch: {
        _id: mongoose.Types.ObjectId(orderId),
      },
    },
  });

  // Check if order exists
  if (!order) {
    return res.status(400).json({ message: "Order not found." });
  }

  // Splice the order from the array
  const foundOrder = await User.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(userId),
      },
    },
    {
      $unwind: "$pastOrders",
    },
    {
      $match: {
        "pastOrders._id": mongoose.Types.ObjectId(orderId),
      },
    },
    {
      $replaceRoot: {
        newRoot: "$pastOrders",
      },
    },
  ]);

  // Create the updated order object
  console.log(typeof active);
  if (name) foundOrder[0].name = name;
  if (type) foundOrder[0].type = type;
  if (details) foundOrder[0].details = details;
  if (status) foundOrder[0].status = status;
  if (typeof active === "boolean") foundOrder[0].active = active;

  // Update the order
  const updatedOrder = await User.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(userId),
      pastOrders: {
        $elemMatch: {
          _id: mongoose.Types.ObjectId(orderId),
        },
      },
    },
    {
      $set: { "pastOrders.$": foundOrder[0] },
    }
  );
  if (updatedOrder) {
    res.status(201).json({
      message: `Updated past order with name: ${foundOrder[0].name}.`,
    });
  } else {
    res.status(400).json({ message: "Invalid order data received." });
  }
});

// @desc Delete a past order
// @route DELETE /users/pastOrders
// @access Private
const deletePastOrder = asyncHandler(async (req, res) => {
  const { userId, username, orderId } = req.body;

  // Confirm received data
  if (!userId || !username || !orderId) {
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

  // Find the order to be deleted
  const order = await User.findOne({
    _id: mongoose.Types.ObjectId(userId),
    pastOrders: {
      $elemMatch: {
        _id: mongoose.Types.ObjectId(orderId),
      },
    },
  });

  // Check if order exists
  if (!order) {
    return res.status(400).json({ message: "Order not found." });
  }

  // Splice the order from the array
  const foundOrder = await User.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(userId),
      },
    },
    {
      $unwind: "$pastOrders",
    },
    {
      $match: {
        "pastOrders._id": mongoose.Types.ObjectId(orderId),
      },
    },
    {
      $replaceRoot: {
        newRoot: "$pastOrders",
      },
    },
  ]);

  // Delete the order from the past orders array
  const deletedOrder = await User.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(userId),
      pastOrders: {
        $elemMatch: {
          _id: mongoose.Types.ObjectId(orderId),
        },
      },
    },
    {
      $pull: { pastOrders: { _id: mongoose.Types.ObjectId(orderId) } },
    }
  );
  if (deletedOrder) {
    res.status(201).json({
      message: `Deleted past order with name: ${foundOrder[0].name}.`,
    });
  } else {
    res.status(400).json({ message: "Invalid order data received." });
  }
});

module.exports = {
  getPastOrders,
  createPastOrder,
  updatePastOrder,
  deletePastOrder,
};
