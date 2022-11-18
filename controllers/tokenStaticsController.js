const tokenVars = require("../utils/tokenVars");
const asyncHandler = require("express-async-handler");
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  tokenVars.providerJsonRpc
);
const tokenABI = tokenVars.tokenABI;

let tokenAddress,
  tokenContract,
  tokenDecimals,
  tokenName,
  tokenSymbol,
  tokenSupply,
  tokenStatics;

// @desc Get static data for a token
// @route GET /token/statics
// @access Private
const getTokenStatics = asyncHandler(async (req, res) => {
  const { tAddress } = req.body;

  // Confirm received data
  if (!tAddress) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Check if received token address is a valid address
  try {
    tokenAddress = ethers.utils.getAddress(tAddress);
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ message: "Please enter a valid token address." });
  }

  try {
    // Get token static data
    tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
    tokenDecimals = await tokenContract.decimals();
    tokenName = await tokenContract.name();
    tokenSymbol = await tokenContract.symbol();
    tokenSupply = await tokenContract.totalSupply();
    tokenSupply = ethers.utils.formatUnits(tokenSupply, tokenDecimals);
    let tempSupply = tokenSupply.split(".");
    tokenSupply = tempSupply[0];

    tokenStatics = {
      tokenName: tokenName,
      tokenSymbol: tokenSymbol,
      tokenSupply: tokenSupply.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."),
      tokenDecimals: tokenDecimals.toString(),
    };

    if (tokenStatics) {
      res.status(201).json(tokenStatics);
    } else {
      res.status(400).json({ message: "Could not fetch token statics." });
    }
  } catch (e) {
    console.log(e);
    // If the decimals method fails, then it's not a token address
    if (e.method === "decimals()") {
      return res.status(400).json({
        message: "The address you have entered is not a token address.",
      });
    } else {
      return res.status(400).json({ message: "Invalid data." });
    }
  }
});

module.exports = {
  getTokenStatics,
};
