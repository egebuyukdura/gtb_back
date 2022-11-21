const User = require("../../models/User");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

// @desc Get all active orders for a user
// @route POST /users/activeOrders/get
// @access Private
const getActiveOrders = asyncHandler(async (req, res) => {
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

  const activeOrders = user.activeOrders;
  // Check if user has active orders
  if (!Array.isArray(activeOrders) || !activeOrders.length) {
    return res.status(400).json({ message: "User has no active orders." });
  }

  // Return the active orders array
  res.status(201).json(activeOrders);
});

// @desc Create a new active order
// @route POST /users/activeOrders
// @access Private
const createActiveOrder = asyncHandler(async (req, res) => {
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
  };

  const order = await User.findOneAndUpdate(
    { username },
    { $push: { activeOrders: orderObject } }
  );

  if (order) {
    // Order is created
    res
      .status(201)
      .json({ message: `New order with name: ${name} is created.` });
  } else {
    res.status(400).json({ message: "Invalid order data received." });
  }
});

// @desc Update an active order
// @route PATCH /users/activeOrders
// @access Private
const updateActiveOrder = asyncHandler(async (req, res) => {
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

  // Find the order to be updated
  const order = await User.findOne({
    _id: mongoose.Types.ObjectId(userId),
    activeOrders: {
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
      $unwind: "$activeOrders",
    },
    {
      $match: {
        "activeOrders._id": mongoose.Types.ObjectId(orderId),
      },
    },
    {
      $replaceRoot: {
        newRoot: "$activeOrders",
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
      activeOrders: {
        $elemMatch: {
          _id: mongoose.Types.ObjectId(orderId),
        },
      },
    },
    {
      $set: { "activeOrders.$": foundOrder[0] },
    }
  );
  if (updatedOrder) {
    res.status(201).json({
      message: `Updated order with name: ${foundOrder[0].name}.`,
    });
  } else {
    res.status(400).json({ message: "Invalid order data received." });
  }
});

// @desc Delete an active order
// @route DELETE /users/activeOrders
// @access Private
const deleteActiveOrder = asyncHandler(async (req, res) => {
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
    activeOrders: {
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
      $unwind: "$activeOrders",
    },
    {
      $match: {
        "activeOrders._id": mongoose.Types.ObjectId(orderId),
      },
    },
    {
      $replaceRoot: {
        newRoot: "$activeOrders",
      },
    },
  ]);
  foundOrder[0].status = "Cancelled";
  foundOrder[0].active = false;

  // Delete the order from the active orders array and add to past orders array
  const deletedOrder = await User.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(userId),
      activeOrders: {
        $elemMatch: {
          _id: mongoose.Types.ObjectId(orderId),
        },
      },
    },
    {
      $push: {
        pastOrders: foundOrder[0],
      },
      $pull: { activeOrders: { _id: mongoose.Types.ObjectId(orderId) } },
    }
  );
  if (deletedOrder) {
    res.status(201).json({
      message: `Deleted order with name: ${foundOrder[0].name}.`,
    });
  } else {
    res.status(400).json({ message: "Invalid order data received." });
  }
});

module.exports = {
  getActiveOrders,
  createActiveOrder,
  updateActiveOrder,
  deleteActiveOrder,
};
