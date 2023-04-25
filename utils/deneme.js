const { ethers } = require('ethers');
const tokenVars = require("../utils/tokenVars");

// BSC provider
const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed1.binance.org');

// Dummy token address and sell amount
const dummyAddress = '0x4885ee9007Fd68BeE1b7513E565023DE056467E1';
const tokenAddress = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82';
const bnbAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
const sellAmount = ethers.utils.parseUnits('0.5', 18);
const gasPrice = ethers.utils.parseUnits("5", 9);
  const gasLimit = 1000000;

// Call the "sell" function on the contract
const contractAddress = tokenVars.pcsRouterAddress;
const contractAbi = tokenVars.pcsRouterABI;
const contract = new ethers.Contract(contractAddress, contractAbi, provider);
// Encode function call
const functionSignature = 'swapExactTokensForETH';
const path = [tokenAddress, bnbAddress];
const deadline = Date.now() + 10000;
//const encodedFunctionCall = contract.interface.encodeFunctionData(functionSignature, [sellAmount, 0, path, contractAddress, deadline]);

const data = '0x1aa2b64e000000000000000000000000cc7bb2d219a0fc08033e130629c2b854b7ba91950000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000000000006446b6d5';
const decodedData = ethers.utils.defaultAbiCoder.decode(["uint256","uint256","address[]","address","uint256"], data.slice(10));
console.log(decodedData);

// Simulate the transaction using callStatic
contract.callStatic[functionSignature](sellAmount, 0, path, dummyAddress, deadline, { from: dummyAddress, gasLimit: gasLimit, gasPrice:gasPrice  })
  .then(result => {
    console.log(result);
    console.log(ethers.utils.formatEther(result[0]))
    console.log(ethers.utils.formatEther(result[1]))
  })
  .catch(error => {
    console.error(error);
  });