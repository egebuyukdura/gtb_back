const tokenVars = require("../utils/tokenVars");
const asyncHandler = require("express-async-handler");
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  tokenVars.providerJsonRpc
);

let bnbBalanceBN, bnbBalance, walletAddress;

// @desc Get wallet balance
// @route POST /balance
// @access Private
const getBalance = asyncHandler(async (req, res) => {
  const { wAddress } = req.body;

  // Confirm received data
  if (!wAddress) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Check if received wallet address is valid
  try {
    walletAddress = ethers.utils.getAddress(wAddress);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Please enter a valid address." });
  }

  // Get wallet balance
  try {
    bnbBalanceBN = await provider.getBalance(walletAddress);
    bnbBalance = ethers.utils.formatEther(bnbBalanceBN);
    if (bnbBalance) {
      res.status(201).json(bnbBalance);
    } else {
      res.status(400).json({ message: "Could not fetch wallet balance." });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Invalid data." });
  }
});

module.exports = {
  getBalance,
};
