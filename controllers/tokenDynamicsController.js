const tokenVars = require("../utils/tokenVars");
const asyncHandler = require("express-async-handler");
const { ethers } = require("ethers");
const { threeDots, sixDecimals } = require("../utils/formatting");

const provider = new ethers.providers.JsonRpcProvider(
  tokenVars.providerJsonRpc
);
const pcsRouterAddress = tokenVars.pcsRouterAddress;
const pcsFactoryAddress = tokenVars.pcsFactoryAddress;

const pcsFactoryABI = tokenVars.pcsFactoryABI;
const pairABI = tokenVars.pairABI;
const tokenABI = tokenVars.tokenABI;

const pcsFactoryContract = new ethers.Contract(
  pcsFactoryAddress,
  pcsFactoryABI,
  provider
);

const baseTokens = tokenVars.baseTokens;

let tokenAddress,
  walletAddress,
  tokenContract,
  tokenSupply,
  tokenBalance,
  tokenPair,
  tokenLiq,
  tokenDollarLiq,
  tokenPrice,
  tokenMCap,
  tokenApproval,
  tokenDynamics;
let tokenPairs = [
  { type: baseTokens[0], pair: "" },
  { type: baseTokens[1], pair: "" },
  { type: baseTokens[2], pair: "" },
];
let reserves = [[], [], []];

// @desc Get dynamic data for a token
// @route POST /token/dynamics
// @access Private
const getTokenDynamics = asyncHandler(async (req, res) => {
  tokenPairs = [
    { type: baseTokens[0], pair: "" },
    { type: baseTokens[1], pair: "" },
    { type: baseTokens[2], pair: "" },
  ];
  reserves = [[], [], []];
  const { tAddress, wAddress, tDecimals, bnbPrice } = req.body;

  // Confirm received data
  if (!tAddress || !wAddress || !tDecimals || !bnbPrice) {
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

  try {
    // Get token dynamic data
    let tokenDeadSupply;
    tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);

    // Old code with awaiting every result
    /*tokenBalance = await tokenContract.balanceOf(walletAddress);
    tokenBalance = ethers.utils.formatUnits(tokenBalance, tDecimals);
    tokenSupply = await tokenContract.totalSupply();
    tokenSupply = ethers.utils.formatUnits(tokenSupply, tDecimals);
    tokenDeadSupply = await tokenContract.balanceOf(
      "0x000000000000000000000000000000000000dead"
    );
    tokenDeadSupply = ethers.utils.formatUnits(tokenDeadSupply, tDecimals);
    tokenDeadSupply =
      tokenDeadSupply === "0.0"
        ? tokenSupply.split(".")[0]
        : (tokenSupply - tokenDeadSupply).toString();
    // Get token approval status for wallet
    let tempApprove = await tokenContract.allowance(
      walletAddress,
      pcsRouterAddress
    );
    tempApprove.toString() > 0
      ? (tokenApproval = true)
      : (tokenApproval = false); */

    [tokenBalance, tokenSupply, tokenDeadSupply, tempApprove] =
      await Promise.all([
        tokenContract.balanceOf(walletAddress),
        tokenContract.totalSupply(),
        tokenContract.balanceOf("0x000000000000000000000000000000000000dead"),
        tokenContract.allowance(walletAddress, pcsRouterAddress),
      ]);
    tokenBalance = ethers.utils.formatUnits(tokenBalance, tDecimals);
    tokenSupply = ethers.utils.formatUnits(tokenSupply, tDecimals);
    tokenDeadSupply = ethers.utils.formatUnits(tokenDeadSupply, tDecimals);
    tokenDeadSupply =
      tokenDeadSupply === "0.0"
        ? tokenSupply.split(".")[0]
        : (tokenSupply - tokenDeadSupply).toString();
    tempApprove.toString() > 0
      ? (tokenApproval = true)
      : (tokenApproval = false);

    // Old code with awaiting every result
    // Find token pairs
    /* let i = 0;
    for await (const b of baseTokens) {
      let tempPair = await pcsFactoryContract.getPair(tokenAddress, b);
      tempPair === "0x0000000000000000000000000000000000000000"
        ? (tokenPairs[i].pair = "")
        : (tokenPairs[i].pair = tempPair);
      i++;
    }
    i = 0; */

    const findPair = baseTokens.map((b, i) => {
      return pcsFactoryContract.getPair(tokenAddress, b).then((p) => {
        p === "0x0000000000000000000000000000000000000000"
          ? (tokenPairs[i].pair = "")
          : (tokenPairs[i].pair = p);
        return;
      });
    });

    await Promise.all(findPair);

    // Find token data for each pair
    let i = 0;
    let reserveOutcome = 0,
      pairOutcome = 0;
    let tempReserve, reserveBN, tempReserveBN;
    const findReserve = tokenPairs.map((p, i) => {
      if (p.pair) {
        let tempContract = new ethers.Contract(p.pair, pairABI, provider);
        return Promise.all([
          tempContract.getReserves(),
          tempContract.token0(),
        ]).then((r) => {
          if (r[1] === p.type) {
            reserves[i][0] = ethers.utils.formatEther(r[0][0]);
            reserves[i][1] = ethers.utils.formatUnits(r[0][1], tDecimals);
          } else {
            reserves[i][0] = ethers.utils.formatEther(r[0][1]);
            reserves[i][1] = ethers.utils.formatUnits(r[0][0], tDecimals);
          }
          i === 0
            ? (tempReserve = reserves[i][0] * bnbPrice)
            : (tempReserve = reserves[i][0]);
          if (Number(reserveOutcome) <= Number(tempReserve)) {
            reserveOutcome = tempReserve;
            pairOutcome = i;
          }
        });
      }
    });
    await Promise.all(findReserve);

    switch (pairOutcome) {
      case 0:
        tokenPair = "BNB";
        tokenLiq = reserves[0][0];
        tokenLiq = Number(tokenLiq).toFixed(2);
        tokenDollarLiq = threeDots(tokenLiq * bnbPrice);
        tokenPrice = (reserves[0][0] / reserves[0][1]) * bnbPrice;
        tokenMCap = threeDots(tokenPrice * tokenDeadSupply);
        tokenPrice = sixDecimals(tokenPrice);
        break;
      case 1:
        tokenPair = "BUSD";
        tokenLiq = reserves[1][0];
        tokenLiq = Number(tokenLiq).toFixed(2);
        tokenDollarLiq = threeDots(tokenLiq);
        tokenPrice = reserves[1][0] / reserves[1][1];
        tokenMCap = threeDots(tokenPrice * tokenDeadSupply);
        tokenPrice = sixDecimals(tokenPrice);
        break;
      case 2:
        tokenPair = "USDT";
        tokenLiq = reserves[2][0];
        tokenLiq = Number(tokenLiq).toFixed(2);
        tokenDollarLiq = threeDots(tokenLiq);
        tokenPrice = reserves[2][0] / reserves[2][1];
        tokenMCap = threeDots(tokenPrice * tokenDeadSupply);
        tokenPrice = sixDecimals(tokenPrice);
        break;
      default:
        break;
    }
    /* for await (const p of tokenPairs) {
      if (p.pair) {
        let tempContract = new ethers.Contract(p.pair, pairABI, provider);
        let tempReserves = await tempContract.getReserves();
        let token0 = await tempContract.token0();
        if (token0 === p.type) {
          reserves[i][0] = ethers.utils.formatEther(tempReserves[0]);
          reserves[i][1] = ethers.utils.formatUnits(tempReserves[1], tDecimals);
        } else {
          reserves[i][0] = ethers.utils.formatEther(tempReserves[1]);
          reserves[i][1] = ethers.utils.formatUnits(tempReserves[0], tDecimals);
        }
        i === 0
          ? (tempReserve = reserves[i][0] * bnbPrice)
          : (tempReserve = reserves[i][0]);

        // For Big Number Comparison
        // reserveBN = ethers.BigNumber.from(greaterThanZero(reserveOutcome));
         // tempReserveBN = ethers.BigNumber.from(greaterThanZero(tempReserve));
         // if (reserveBN.lte(tempReserveBN)) 

        if (Number(reserveOutcome) <= Number(tempReserve)) {
          reserveOutcome = tempReserve;
          pairOutcome = i;
        }
        switch (pairOutcome) {
          case 0:
            tokenPair = "BNB";
            tokenLiq = reserves[0][0];
            tokenLiq = Number(tokenLiq).toFixed(2);
            tokenDollarLiq = threeDots(tokenLiq * bnbPrice);
            tokenPrice = (reserves[0][0] / reserves[0][1]) * bnbPrice;
            tokenMCap = threeDots(tokenPrice * tokenDeadSupply);
            tokenPrice = sixDecimals(tokenPrice);
            break;
          case 1:
            tokenPair = "BUSD";
            tokenLiq = reserves[1][0];
            tokenLiq = Number(tokenLiq).toFixed(2);
            tokenDollarLiq = threeDots(tokenLiq);
            tokenPrice = reserves[1][0] / reserves[1][1];
            tokenMCap = threeDots(tokenPrice * tokenDeadSupply);
            tokenPrice = sixDecimals(tokenPrice);
            break;
          case 2:
            tokenPair = "USDT";
            tokenLiq = reserves[2][0];
            tokenLiq = Number(tokenLiq).toFixed(2);
            tokenDollarLiq = threeDots(tokenLiq);
            tokenPrice = reserves[2][0] / reserves[2][1];
            tokenMCap = threeDots(tokenPrice * tokenDeadSupply);
            tokenPrice = sixDecimals(tokenPrice);
            break;
          default:
            break;
        }
      }
      i++;
    } */
    i = 0;

    tokenDynamics = {
      tokenSupply: tokenSupply.split(".")[0],
      tokenBalance: tokenBalance,
      tokenPair: tokenPair,
      tokenLiq: tokenLiq,
      tokenDollarLiq: tokenDollarLiq,
      tokenPrice: tokenPrice,
      tokenMCap: tokenMCap,
      tokenApproval: tokenApproval,
    };
    if (tokenDynamics) {
      res.status(201).json(tokenDynamics);
    } else {
      res.status(400).json({ message: "Could not fetch token dynamics." });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Invalid data." });
  }
});

module.exports = {
  getTokenDynamics,
};
