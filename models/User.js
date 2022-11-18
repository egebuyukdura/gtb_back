const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  privateKey: {
    type: String,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  tier: {
    type: Number,
    default: 1,
  },
  wallets: [walletSchema],
  activeOrders: [orderSchema],
  pastOrders: [orderSchema],
});

module.exports = mongoose.model("User", userSchema);
