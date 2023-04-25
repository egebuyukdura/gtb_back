const tokenVars = require("../../utils/tokenVars");
const asyncHandler = require("express-async-handler");
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
    tokenVars.providerJsonRpc
  );

const pcsRouterAddress = tokenVars.pcsRouterAddress;
const pcsRouterABI = tokenVars.pcsRouterABI;

const baseTokens = tokenVars.baseTokens;

let tokenAddress, walletAddress;

// @desc A basic buy transaction with standard gas
// @route POST /token/transactions/buy/standard
// @access Private
const basicBuyTx = asyncHandler(async (req, res)=> {
  const {tAddress, wAddress, wPriv, tPair, buyAmount} = req.body;

  const amountOutMin = 0;
  const gasLimit = 1000000;
  const gasPrice = ethers.utils.parseUnits("5", 9);
  
  let pairPath;

  // Confirm received data
  if (!tAddress || !wAddress || !tPair || !buyAmount || !wPriv) {
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

  // Check if received wallet address is a valid address
  try {
    walletAddress = ethers.utils.getAddress(wAddress);
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ message: "Please enter a valid wallet address." });
  }

  const wallet = new ethers.Wallet(wPriv);
  const signer = wallet.connect(provider);
  const tokenBuyContract = new ethers.Contract(
    pcsRouterAddress,
    pcsRouterABI,
    signer
  );
  try{
  if (tPair === "BNB") {
    pairPath = [baseTokens[0], tokenAddress];
  } else if (tPair === "BUSD") {
    pairPath = [baseTokens[0], baseTokens[1], tokenAddress];
  } else {
    pairPath = [baseTokens[0], baseTokens[2], tokenAddress];
  }
  if (buyAmount && tokenAddress) {
    console.log("Sending the Buy transaction for: " + buyAmount);
    const tx =
      await tokenBuyContract.swapExactETHForTokensSupportingFeeOnTransferTokens(
        amountOutMin,
        pairPath,
        walletAddress,
        Date.now() + 10000,
        {
          value: ethers.utils.parseEther(buyAmount),
          gasLimit: gasLimit,
          gasPrice: gasPrice,
        }
      );
    console.log("Transaction:");
    console.log(tx);
    const receipt = await tx.wait();
    console.log("Mined... Hash: " + receipt.transactionHash);
  }
} catch (e) {
  console.log(e);
  return res.status(400).json({ message: "Invalid data." });
}
});

// @desc A basic buy transaction with custom gas
// @route POST /token/transactions/buy/custom
// @access Private
const basicBuyTxCustomGas = asyncHandler(async (req, res)=> {});

// @desc A basic sell transaction with standard gas
// @route POST /token/transactions/sell/standard
// @access Private
const basicSellTx = asyncHandler(async (req, res)=> {});

// @desc A basic sell transaction with custom gas
// @route POST /token/transactions/sell/custom
// @access Private
const basicSellTxCustomGas = asyncHandler(async (req, res)=> {});

module.exports = {
  basicBuyTx,
  basicBuyTxCustomGas,
  basicSellTx,
  basicSellTxCustomGas,
};