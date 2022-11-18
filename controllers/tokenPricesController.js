const tokenVars = require("../utils/tokenVars");
const asyncHandler = require("express-async-handler");
const { ethers } = require("ethers");
const { sixDecimals } = require("../utils/formatting");

const provider = new ethers.providers.JsonRpcProvider(
  tokenVars.providerJsonRpc
);

const pcsRouterAddress = tokenVars.pcsRouterAddress;
const pcsRouterABI = tokenVars.pcsRouterABI;
const pcsRouterContract = new ethers.Contract(
  pcsRouterAddress,
  pcsRouterABI,
  provider
);

const baseTokens = tokenVars.baseTokens;

let tokenAddress, buyAmount, sellAmount, buyOutput, sellOutput;

// @desc Get buy price for a token
// @route GET /token/prices/buy
// @access Private
const getTokenBuyPrice = asyncHandler(async (req, res) => {
  const { tAddress, tDecimals, tPair, buyInput } = req.body;

  // Confirm received data
  if (!tAddress || !tDecimals || !tPair || !buyInput) {
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
    buyAmount = ethers.utils.parseEther(buyInput).toString();
    if (tPair === "BNB") {
      buyOutput = await pcsRouterContract.getAmountsOut(buyAmount, [
        baseTokens[0],
        tokenAddress,
      ]);
      buyOutput = ethers.utils.formatUnits(buyOutput[1].toString(), tDecimals);
      buyOutput = sixDecimals(buyOutput);
    } else if (tPair === "BUSD") {
      buyOutput = await pcsRouterContract.getAmountsOut(buyAmount, [
        baseTokens[0],
        baseTokens[1],
        tokenAddress,
      ]);
      buyOutput = ethers.utils.formatUnits(buyOutput[2].toString(), tDecimals);
      buyOutput = sixDecimals(buyOutput);
    } else {
      buyOutput = await pcsRouterContract.getAmountsOut(buyAmount, [
        baseTokens[0],
        baseTokens[2],
        tokenAddress,
      ]);
      buyOutput = ethers.utils.formatUnits(buyOutput[2].toString(), tDecimals);
      buyOutput = sixDecimals(buyOutput);
    }
    if (buyOutput) {
      res.status(201).json(buyOutput);
    } else {
      res.status(400).json({ message: "Could not fetch buy price." });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Invalid data." });
  }
});

// @desc Get sell price for a token
// @route POST /token/prices/sell
// @access Private
const getTokenSellPrice = asyncHandler(async (req, res) => {
  const { tAddress, tDecimals, tPair, sellInput } = req.body;

  // Confirm received data
  if (!tAddress || !tDecimals || !tPair || !sellInput) {
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
    sellAmount = ethers.utils.parseUnits(sellInput, tDecimals).toString();
    if (tPair === "BNB") {
      sellOutput = await pcsRouterContract.getAmountsOut(sellAmount, [
        tokenAddress,
        baseTokens[0],
      ]);
      sellOutput = ethers.utils.formatEther(sellOutput[1].toString());
      sellOutput = sixDecimals(sellOutput);
    } else if (tPair === "BUSD") {
      sellOutput = await pcsRouterContract.getAmountsOut(sellAmount, [
        tokenAddress,
        baseTokens[1],
        baseTokens[0],
      ]);
      sellOutput = ethers.utils.formatEther(sellOutput[2].toString());
      sellOutput = sixDecimals(sellOutput);
    } else {
      sellOutput = await pcsRouterContract.getAmountsOut(sellAmount, [
        tokenAddress,
        baseTokens[2],
        baseTokens[0],
      ]);
      sellOutput = ethers.utils.formatEther(sellOutput[2].toString());
      sellOutput = sixDecimals(sellOutput);
    }
    if (sellOutput) {
      res.status(201).json(sellOutput);
    } else {
      res.status(400).json({ message: "Could not fetch sell price." });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Invalid data." });
  }
});

module.exports = {
  getTokenBuyPrice,
  getTokenSellPrice,
};
